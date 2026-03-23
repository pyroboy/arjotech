import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/db';
import { leads, marketingContent, bookings, kpiActivityLog } from '$lib/db/schema';
import { desc, gte } from 'drizzle-orm';

export const GET: RequestHandler = async ({ platform, url }) => {
  const db = getDb(platform?.env ?? {});
  const period = url.searchParams.get('period') || 'week';

  // Calculate date cutoff
  const now = new Date();
  const cutoff = new Date();
  if (period === 'week') cutoff.setDate(now.getDate() - 7);
  else if (period === 'month') cutoff.setMonth(now.getMonth() - 1);
  else cutoff.setDate(now.getDate() - 7);

  // Fetch all data
  const [allLeads, allContent, allBookings, recentActivity] = await Promise.all([
    db.select().from(leads),
    db.select().from(marketingContent),
    db.select().from(bookings),
    db
      .select()
      .from(kpiActivityLog)
      .where(gte(kpiActivityLog.createdAt, cutoff))
      .orderBy(desc(kpiActivityLog.createdAt)),
  ]);

  // Filter to period
  const periodLeads = allLeads.filter((l) => new Date(l.createdAt) >= cutoff);
  const periodContent = allContent.filter((c) => new Date(c.createdAt) >= cutoff);
  const periodBookings = allBookings.filter((b) => new Date(b.createdAt) >= cutoff);
  const periodActivity = recentActivity.filter((a) => new Date(a.createdAt) >= cutoff);

  // Aggregate KPI Activity Log by category and action
  const builderActivity = periodActivity.filter((a) => a.category === 'builder');
  const docsActivity = periodActivity.filter((a) => a.category === 'docs');
  const automationActivity = periodActivity.filter((a) => a.category === 'automation');
  const productActivity = periodActivity.filter((a) => a.category === 'product');
  const revenueActivity = periodActivity.filter((a) => a.category === 'revenue');
  const growthActivity = periodActivity.filter((a) => a.category === 'growth');
  const salesCollateralActivity = periodActivity.filter((a) => a.category === 'sales_collateral');

  // Build KPI summary
  const report = {
    period,
    generatedAt: now.toISOString(),

    // Marketing KPIs
    marketing: {
      totalContent: allContent.length,
      periodContent: periodContent.length,
      byStatus: {
        draft: allContent.filter((c) => c.status === 'draft').length,
        generated: allContent.filter((c) => c.status === 'generated').length,
        approved: allContent.filter((c) => c.status === 'approved').length,
        scheduled: allContent.filter((c) => c.status === 'scheduled').length,
        published: allContent.filter((c) => c.status === 'published').length,
        failed: allContent.filter((c) => c.status === 'failed').length,
      },
      byBusiness: groupBy(allContent, 'business'),
      byPlatform: groupBy(allContent, 'platform'),
    },

    // Leads KPIs
    leads: {
      totalLeads: allLeads.length,
      periodLeads: periodLeads.length,
      byStatus: {
        new: allLeads.filter((l) => l.status === 'new').length,
        contacted: allLeads.filter((l) => l.status === 'contacted').length,
        responded: allLeads.filter((l) => l.status === 'responded').length,
        qualified: allLeads.filter((l) => l.status === 'qualified').length,
        proposal_sent: allLeads.filter((l) => l.status === 'proposal_sent').length,
        negotiating: allLeads.filter((l) => l.status === 'negotiating').length,
        won: allLeads.filter((l) => l.status === 'won').length,
        lost: allLeads.filter((l) => l.status === 'lost').length,
        dormant: allLeads.filter((l) => l.status === 'dormant').length,
      },
      byBusiness: groupBy(allLeads, 'business'),
      bySource: groupBy(allLeads, 'source'),
      totalPipelineValue: allLeads
        .filter((l) => !['won', 'lost', 'dormant'].includes(l.status))
        .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
      wonValue: allLeads
        .filter((l) => l.status === 'won')
        .reduce((sum, l) => sum + (l.convertedValue || l.estimatedValue || 0), 0),
      totalDmsSent: allLeads.reduce((sum, l) => sum + (l.dmsSent || 0), 0),
      totalCallsMade: allLeads.reduce((sum, l) => sum + (l.callsMade || 0), 0),
      conversionRate:
        allLeads.length > 0
          ? (
              (allLeads.filter((l) => l.status === 'won').length / allLeads.length) *
              100
            ).toFixed(1)
          : '0',
    },

    // Bookings KPIs
    bookings: {
      totalBookings: allBookings.length,
      periodBookings: periodBookings.length,
      byStatus: {
        pending: allBookings.filter((b) => b.status === 'Pending').length,
        confirmed: allBookings.filter((b) => b.status === 'Confirmed').length,
        completed: allBookings.filter((b) => b.status === 'Completed').length,
        rejected: allBookings.filter((b) => b.status === 'Rejected').length,
      },
    },

    // Builder KPIs
    builder: {
      commits: sumByAction(builderActivity, 'commit_pushed'),
      featuresShipped: countByAction(builderActivity, 'feature_shipped'),
      bugsFixed: countByAction(builderActivity, 'bug_fixed'),
      reposWorked: countDistinctMetadata(builderActivity, 'repo_worked', 'repo'),
    },

    // Docs KPIs
    docs: {
      docsCreated: countByAction(docsActivity, 'doc_created'),
      businessPlansUpdated: countByAction(docsActivity, 'business_plan_updated'),
      prdsWritten: countByAction(docsActivity, 'prd_written'),
    },

    // Automation KPIs
    automation: {
      pipelinesBuilt: countByAction(automationActivity, 'pipeline_built'),
      chatbotsCreated: countByAction(automationActivity, 'chatbot_created'),
      workflowsDeployed: countByAction(automationActivity, 'workflow_deployed'),
      integrationsAdded: countByAction(automationActivity, 'integration_added'),
    },

    // Product KPIs
    product: {
      appsDeployed: countByAction(productActivity, 'app_deployed'),
      appsUpdated: countByAction(productActivity, 'app_updated'),
      usersAcquired: sumByAction(productActivity, 'user_acquired'),
      freeToolsBuilt: countByAction(productActivity, 'free_tool_built'),
      onlineProductsMade: countByAction(productActivity, 'online_product_made'),
      totalOnlineProducts:
        countByAction(productActivity, 'app_deployed') +
        countByAction(productActivity, 'free_tool_built') +
        countByAction(productActivity, 'online_product_made'),
    },

    // Revenue KPIs
    revenue: {
      contractsSigned: countByAction(revenueActivity, 'contract_signed'),
      contractsValue: sumByAction(revenueActivity, 'contract_signed'),
      mrrAdded: sumByAction(revenueActivity, 'mrr_added'),
      oneTimeRevenue: sumByAction(revenueActivity, 'one_time_revenue'),
      totalRevenue:
        sumByAction(revenueActivity, 'contract_signed') +
        sumByAction(revenueActivity, 'mrr_added') +
        sumByAction(revenueActivity, 'one_time_revenue'),
    },

    // Sales Collateral KPIs
    salesCollateral: {
      proposalsSent: countByAction(salesCollateralActivity, 'proposal_sent'),
      pitchDecksMade: countByAction(salesCollateralActivity, 'pitch_deck_made'),
      onePagersMade: countByAction(salesCollateralActivity, 'one_pager_made'),
      caseStudiesWritten: countByAction(salesCollateralActivity, 'case_study_written'),
      totalCollateral:
        countByAction(salesCollateralActivity, 'proposal_sent') +
        countByAction(salesCollateralActivity, 'pitch_deck_made') +
        countByAction(salesCollateralActivity, 'one_pager_made') +
        countByAction(salesCollateralActivity, 'case_study_written'),
    },

    // Growth KPIs
    growth: {
      skillsLearned: countByAction(growthActivity, 'skill_learned'),
      connectionsMade: countByAction(growthActivity, 'connection_made'),
      contentPublished: countByAction(growthActivity, 'content_published'),
    },

    // Activity Feed
    recentActivity: recentActivity.slice(0, 20),
  };

  return json(report);
};

// Helper functions
function groupBy(arr: any[], key: string): Record<string, number> {
  return arr.reduce(
    (acc, item) => {
      const val = item[key] || 'unknown';
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

function countByAction(arr: any[], action: string): number {
  return arr.filter((item) => item.action === action).length;
}

function sumByAction(arr: any[], action: string): number {
  return arr
    .filter((item) => item.action === action)
    .reduce((sum, item) => sum + (item.value || 0), 0);
}

function countDistinctMetadata(arr: any[], action: string, metadataKey: string): number {
  const items = arr.filter((item) => item.action === action);
  const seen = new Set<string>();
  items.forEach((item) => {
    if (item.metadata && item.metadata[metadataKey]) {
      seen.add(item.metadata[metadataKey]);
    }
  });
  return seen.size;
}
