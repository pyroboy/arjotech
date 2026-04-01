<script lang="ts">
  import { onMount } from 'svelte';
  import { formatCurrency } from '$lib/utils/formatters';

  // Types
  interface KPIReport {
    period: string;
    generatedAt: string;
    marketing: {
      totalContent: number;
      periodContent: number;
      byStatus: Record<string, number>;
      byBusiness: Record<string, number>;
      byPlatform: Record<string, number>;
    };
    leads: {
      totalLeads: number;
      periodLeads: number;
      byStatus: Record<string, number>;
      byBusiness: Record<string, number>;
      bySource: Record<string, number>;
      totalPipelineValue: number;
      wonValue: number;
      totalDmsSent: number;
      totalCallsMade: number;
      conversionRate: string;
    };
    bookings: {
      totalBookings: number;
      periodBookings: number;
      byStatus: Record<string, number>;
    };
    builder?: {
      commits: number;
      featuresShipped: number;
      bugsFixed: number;
      reposWorked: number;
    };
    docs?: {
      docsCreated: number;
      businessPlansUpdated: number;
      prdsWritten: number;
    };
    automation?: {
      pipelinesBuilt: number;
      chatbotsCreated: number;
      workflowsDeployed: number;
      integrationsAdded: number;
    };
    product?: {
      appsDeployed: number;
      appsUpdated: number;
      usersAcquired: number;
      freeToolsBuilt: number;
      onlineProductsMade: number;
      totalOnlineProducts: number;
    };
    salesCollateral?: {
      proposalsSent: number;
      pitchDecksMade: number;
      onePagersMade: number;
      caseStudiesWritten: number;
      totalCollateral: number;
    };
    revenue?: {
      contractsSigned: number;
      contractsValue: number;
      mrrAdded: number;
      oneTimeRevenue: number;
      totalRevenue: number;
    };
    growth?: {
      skillsLearned: number;
      connectionsMade: number;
      contentPublished: number;
    };
    recentActivity: Array<{
      id: string;
      business: string;
      category: string;
      action: string;
      value: number;
      createdAt: string;
      metadata?: Record<string, any>;
      notes?: string;
    }>;
  }

  // Reactive state
  let period = $state<'week' | 'month'>('week');
  let report = $state<KPIReport | null>(null);
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  // Quick log form state
  let logForm = $state({
    category: 'builder',
    action: '',
    business: 'arjostyle',
    value: 1,
    notes: ''
  });
  let isSubmittingLog = $state(false);

  // Lead stages for funnel
  const leadStages = ['new', 'contacted', 'responded', 'qualified', 'proposal_sent', 'negotiating', 'won'];
  const stageLabels: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    responded: 'Responded',
    qualified: 'Qualified',
    proposal_sent: 'Proposal Sent',
    negotiating: 'Negotiating',
    won: 'Won'
  };
  const stageColors: Record<string, string> = {
    new: 'bg-zinc-600',
    contacted: 'bg-zinc-500',
    responded: 'bg-orange-600',
    qualified: 'bg-orange-500',
    proposal_sent: 'bg-orange-400',
    negotiating: 'bg-orange-300',
    won: 'bg-green-500'
  };

  // Fetch report data
  async function fetchReport() {
    isLoading = true;
    error = null;
    try {
      const response = await fetch(`/api/reports?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch report');
      report = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      isLoading = false;
    }
  }

  // Submit quick log activity
  async function submitLogActivity() {
    if (!logForm.action.trim()) return;

    isSubmittingLog = true;
    try {
      const response = await fetch('/api/reports/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logForm)
      });

      if (!response.ok) throw new Error('Failed to log activity');

      // Reset form
      logForm = {
        category: 'builder',
        action: '',
        business: 'arjostyle',
        value: 1,
        notes: ''
      };

      // Refresh report
      await fetchReport();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to log activity';
    } finally {
      isSubmittingLog = false;
    }
  }

  // Watch period changes
  $effect(() => {
    fetchReport();
  });

  // Get max value for chart scaling
  function getMaxValue(obj: Record<string, number>): number {
    return Math.max(...Object.values(obj), 1);
  }

  // Get percentage width for bar
  function getPercentage(value: number, max: number): number {
    return (value / max) * 100;
  }

  // Format large numbers
  function formatNumber(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
  }

  // Format date
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Get activity icon
  function getActivityIcon(category: string): string {
    const icons: Record<string, string> = {
      marketing: '📝',
      leads: '👥',
      sales: '💰',
      bookings: '📅',
      builder: '🔨',
      docs: '📄',
      automation: '⚡',
      product: '📦',
      revenue: '💎',
      growth: '🌱',
      sales_collateral: '📑'
    };
    return icons[category] || '📌';
  }

  // Get activity description
  function getActivityDescription(category: string, action: string, value: number): string {
    const descriptions: Record<string, Record<string, string>> = {
      marketing: {
        content_created: `Content created (${value})`,
        content_published: `Content published (${value})`
      },
      leads: {
        lead_added: `Lead added (${value})`,
        lead_contacted: `Lead contacted`,
        lead_converted: `Lead converted`
      },
      sales: {
        deal_won: `Deal won (₱${value.toLocaleString('en-PH')})`,
        deal_lost: `Deal lost`
      },
      bookings: {
        booking_created: `Booking created (${value})`,
        booking_confirmed: `Booking confirmed`,
        booking_completed: `Booking completed`
      },
      builder: {
        commit_pushed: `Commit pushed (${value})`,
        feature_shipped: `Feature shipped`,
        bug_fixed: `Bug fixed`,
        repo_worked: `Repo worked on`
      },
      docs: {
        doc_created: `Doc created`,
        business_plan_updated: `Business plan updated`,
        prd_written: `PRD written`
      },
      automation: {
        pipeline_built: `Pipeline built`,
        chatbot_created: `Chatbot created`,
        workflow_deployed: `Workflow deployed`,
        integration_added: `Integration added`
      },
      product: {
        app_deployed: `App deployed`,
        app_updated: `App updated`,
        user_acquired: `User acquired (${value})`,
        free_tool_built: `Free tool built`,
        online_product_made: `Online product made`
      },
      revenue: {
        contract_signed: `Contract signed (₱${value.toLocaleString('en-PH')})`,
        mrr_added: `MRR added (₱${value.toLocaleString('en-PH')})`,
        one_time_revenue: `One-time revenue (₱${value.toLocaleString('en-PH')})`
      },
      sales_collateral: {
        proposal_sent: `Proposal sent`,
        pitch_deck_made: `Pitch deck created`,
        one_pager_made: `One-pager created`,
        case_study_written: `Case study written`
      },
      growth: {
        skill_learned: `Skill learned`,
        connection_made: `Connection made`,
        content_published: `Content published`
      }
    };
    return descriptions[category]?.[action] || `${action} (${value})`;
  }

  // Initialize
  onMount(() => {
    fetchReport();
  });
</script>

<div class="min-h-screen bg-surface-900 text-white">
  <!-- Header -->
  <div class="border-b border-zinc-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold">KPI Reports</h1>
          <p class="text-zinc-400 mt-1 text-sm sm:text-base">Comprehensive view of builder, product, and business metrics</p>
        </div>

        <!-- Period Toggle -->
        <div class="flex gap-2">
          <button
            onclick={() => {
              period = 'week';
            }}
            class="px-4 py-2 rounded-lg font-medium transition-all {period === 'week'
              ? 'bg-orange-500 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}"
          >
            This Week
          </button>
          <button
            onclick={() => {
              period = 'month';
            }}
            class="px-4 py-2 rounded-lg font-medium transition-all {period === 'month'
              ? 'bg-orange-500 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}"
          >
            This Month
          </button>
        </div>
      </div>

      {#if report}
        <p class="text-sm text-zinc-500 mt-4">
          Updated {formatDate(report.generatedAt)}
        </p>
      {/if}
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-6 py-8">
    {#if isLoading}
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="inline-block w-12 h-12 border-4 border-zinc-700 border-t-orange-500 rounded-full animate-spin"></div>
          <p class="text-zinc-400 mt-4">Loading report...</p>
        </div>
      </div>
    {:else if error}
      <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300">
        <p class="font-medium">Error loading report</p>
        <p class="text-sm mt-1">{error}</p>
      </div>
    {:else if report}
      <!-- SECTION 1: Score Cards Grid (3 rows x 4 columns) -->
      <div class="mb-12">
        <!-- Row 1: Business Output -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Content Created -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">📝</div>
            </div>
            <p class="text-3xl font-bold text-white">{report.marketing.periodContent}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Content Created</p>
            <p class="text-xs text-zinc-600 mt-1">This {period}</p>
          </div>

          <!-- Leads Added -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">🎯</div>
            </div>
            <p class="text-3xl font-bold text-white">{report.leads.periodLeads}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Leads Added</p>
            <p class="text-xs text-zinc-600 mt-1">This {period}</p>
          </div>

          <!-- DMs Sent -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">💬</div>
            </div>
            <p class="text-3xl font-bold text-white">{report.leads.totalDmsSent}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">DMs Sent</p>
            <p class="text-xs text-zinc-600 mt-1">Total</p>
          </div>

          <!-- Bookings -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">📋</div>
            </div>
            <p class="text-3xl font-bold text-white">{report.bookings.periodBookings}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Bookings</p>
            <p class="text-xs text-zinc-600 mt-1">This {period}</p>
          </div>
        </div>

        <!-- Row 2: Builder Output -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Commits Pushed -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">🔨</div>
            </div>
            <p class="text-3xl font-bold text-white">{report.builder?.commits ?? 0}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Commits Pushed</p>
            <p class="text-xs text-zinc-600 mt-1">This {period}</p>
          </div>

          <!-- Features Shipped -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">🚀</div>
            </div>
            <p class="text-3xl font-bold text-white">{report.builder?.featuresShipped ?? 0}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Features Shipped</p>
            <p class="text-xs text-zinc-600 mt-1">This {period}</p>
          </div>

          <!-- Docs Created -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">📄</div>
            </div>
            <p class="text-3xl font-bold text-white">{report.docs?.docsCreated ?? 0}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Docs Created</p>
            <p class="text-xs text-zinc-600 mt-1">This {period}</p>
          </div>

          <!-- Sales Collateral -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">📑</div>
            </div>
            <p class="text-3xl font-bold text-white">{report.salesCollateral?.totalCollateral ?? 0}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Sales Collateral</p>
            <p class="text-xs text-zinc-600 mt-1">This {period}</p>
          </div>
        </div>

        <!-- Row 3: Revenue -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Pipeline Value -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">💰</div>
            </div>
            <p class="text-2xl font-bold text-white">{formatCurrency(report.leads.totalPipelineValue)}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Pipeline Value</p>
            <p class="text-xs text-zinc-600 mt-1">Active deals</p>
          </div>

          <!-- Won Revenue -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">🏆</div>
            </div>
            <p class="text-2xl font-bold text-green-400">{formatCurrency(report.leads.wonValue)}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Won Revenue</p>
            <p class="text-xs text-zinc-600 mt-1">Converted</p>
          </div>

          <!-- Contracts Value -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">📑</div>
            </div>
            <p class="text-2xl font-bold text-white">{formatCurrency(report.revenue?.contractsValue ?? 0)}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Contracts Value</p>
            <p class="text-xs text-zinc-600 mt-1">This {period}</p>
          </div>

          <!-- Total Revenue -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="text-2xl">💎</div>
            </div>
            <p class="text-2xl font-bold text-orange-400">{formatCurrency(report.revenue?.totalRevenue ?? 0)}</p>
            <p class="text-xs text-zinc-500 uppercase font-medium mt-2">Total Revenue</p>
            <p class="text-xs text-zinc-600 mt-1">All sources</p>
          </div>
        </div>
      </div>

      <!-- SECTION 2: Builder Metrics Detailed Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Development Activity -->
        <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
          <h2 class="text-lg font-bold mb-6">Development Activity</h2>
          <div class="space-y-4">
            <!-- Commits -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-zinc-300">Commits Pushed</p>
                <span class="font-semibold">{report.builder?.commits ?? 0}</span>
              </div>
              <div class="w-full bg-zinc-900 rounded-full h-3 overflow-hidden">
                <div
                  class="h-full bg-yellow-500 transition-all duration-300"
                  style="width: {Math.min((report.builder?.commits ?? 0) / Math.max(report.builder?.commits ?? 1, 20) * 100, 100)}%"
                ></div>
              </div>
            </div>

            <!-- Features -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-zinc-300">Features Shipped</p>
                <span class="font-semibold">{report.builder?.featuresShipped ?? 0}</span>
              </div>
              <div class="w-full bg-zinc-900 rounded-full h-3 overflow-hidden">
                <div
                  class="h-full bg-green-500 transition-all duration-300"
                  style="width: {Math.min((report.builder?.featuresShipped ?? 0) / Math.max(report.builder?.featuresShipped ?? 1, 10) * 100, 100)}%"
                ></div>
              </div>
            </div>

            <!-- Bugs -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-zinc-300">Bugs Fixed</p>
                <span class="font-semibold">{report.builder?.bugsFixed ?? 0}</span>
              </div>
              <div class="w-full bg-zinc-900 rounded-full h-3 overflow-hidden">
                <div
                  class="h-full bg-red-500 transition-all duration-300"
                  style="width: {Math.min((report.builder?.bugsFixed ?? 0) / Math.max(report.builder?.bugsFixed ?? 1, 10) * 100, 100)}%"
                ></div>
              </div>
            </div>

            <!-- Repos -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-zinc-300">Repos Worked On</p>
                <span class="font-semibold">{report.builder?.reposWorked ?? 0}</span>
              </div>
              <div class="w-full bg-zinc-900 rounded-full h-3 overflow-hidden">
                <div
                  class="h-full bg-blue-500 transition-all duration-300"
                  style="width: {Math.min((report.builder?.reposWorked ?? 0) / Math.max(report.builder?.reposWorked ?? 1, 5) * 100, 100)}%"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Sales Collateral -->
        <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
          <h2 class="text-lg font-bold mb-6">Sales Collateral</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Proposals Sent</span>
              <span class="font-semibold text-pink-400">{report.salesCollateral?.proposalsSent ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Pitch Decks Made</span>
              <span class="font-semibold text-pink-400">{report.salesCollateral?.pitchDecksMade ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">One-Pagers Made</span>
              <span class="font-semibold text-pink-400">{report.salesCollateral?.onePagersMade ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Case Studies Written</span>
              <span class="font-semibold text-pink-400">{report.salesCollateral?.caseStudiesWritten ?? 0}</span>
            </div>
            <div class="border-t border-zinc-700 my-3"></div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/50 rounded">
              <span class="text-sm font-medium text-zinc-300">Total Collateral</span>
              <span class="font-bold text-pink-300 text-lg">{report.salesCollateral?.totalCollateral ?? 0}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- SECTION 2b: Docs & Automation -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Docs -->
        <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
          <h2 class="text-lg font-bold mb-6">Docs</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Docs Created</span>
              <span class="font-semibold text-orange-400">{report.docs?.docsCreated ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Business Plans</span>
              <span class="font-semibold text-orange-400">{report.docs?.businessPlansUpdated ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">PRDs Written</span>
              <span class="font-semibold text-orange-400">{report.docs?.prdsWritten ?? 0}</span>
            </div>
          </div>
        </section>

        <!-- Automation -->
        <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
          <h2 class="text-lg font-bold mb-6">Automation</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Pipelines Built</span>
              <span class="font-semibold text-blue-400">{report.automation?.pipelinesBuilt ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Chatbots Created</span>
              <span class="font-semibold text-blue-400">{report.automation?.chatbotsCreated ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Workflows Deployed</span>
              <span class="font-semibold text-blue-400">{report.automation?.workflowsDeployed ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Integrations Added</span>
              <span class="font-semibold text-blue-400">{report.automation?.integrationsAdded ?? 0}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- SECTION 3: Leads Funnel -->
      <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50 mb-8">
        <h2 class="text-xl font-bold mb-6">Leads Funnel</h2>
        <div class="space-y-4">
          {#each leadStages as stage}
            {@const count = report.leads.byStatus[stage] || 0}
            {@const maxCount = getMaxValue(report.leads.byStatus)}
            {@const percentage = getPercentage(count, maxCount)}
            {@const stageValue = report.leads.byStatus[stage] || 0}
            {@const stageWonValue = stage === 'won' ? report.leads.wonValue : 0}
            <div>
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-zinc-300">{stageLabels[stage]}</p>
                <div class="flex items-center gap-3">
                  <span class="font-semibold">{stageValue}</span>
                  {#if stage === 'won'}
                    <span class="text-green-400 text-sm">{formatCurrency(stageWonValue)}</span>
                  {/if}
                </div>
              </div>
              <div class="w-full bg-zinc-900 rounded-full h-8 overflow-hidden">
                <div
                  class="h-full {stageColors[stage]} transition-all duration-300 flex items-center px-3"
                  style="width: {percentage}%"
                >
                  {#if percentage > 15}
                    <span class="text-xs font-medium text-white">{Math.round(percentage)}%</span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- SECTION 4: Content & Leads -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Content by Platform -->
        <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
          <h2 class="text-lg font-bold mb-6">Content by Platform</h2>
          <div class="space-y-3">
            {#each Object.entries(report.marketing.byPlatform) as [platform, count]}
              {@const maxCount = getMaxValue(report.marketing.byPlatform)}
              {@const percentage = getPercentage(count, maxCount)}
              <div>
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-medium capitalize">{platform.replace('_', ' ')}</p>
                  <span class="text-sm text-zinc-400">{count}</span>
                </div>
                <div class="w-full bg-zinc-900 rounded-full h-6">
                  <div
                    class="h-full bg-orange-500 rounded-full transition-all duration-300"
                    style="width: {percentage}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <!-- Leads by Source -->
        <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
          <h2 class="text-lg font-bold mb-6">Leads by Source</h2>
          <div class="space-y-3">
            {#each Object.entries(report.leads.bySource) as [source, count]}
              {@const maxCount = getMaxValue(report.leads.bySource)}
              {@const percentage = getPercentage(count, maxCount)}
              <div>
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-medium capitalize">{source.replace('_', ' ')}</p>
                  <span class="text-sm text-zinc-400">{count}</span>
                </div>
                <div class="w-full bg-zinc-900 rounded-full h-6">
                  <div
                    class="h-full bg-tech-500 rounded-full transition-all duration-300"
                    style="width: {percentage}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </section>
      </div>

      <!-- SECTION 5: Bookings & Growth -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Bookings Summary -->
        <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
          <h2 class="text-lg font-bold mb-6">Bookings Summary</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-zinc-900/50 rounded p-4">
              <p class="text-zinc-500 text-xs font-medium mb-1">Pending</p>
              <p class="text-2xl font-bold">{report.bookings.byStatus.pending}</p>
            </div>
            <div class="bg-zinc-900/50 rounded p-4">
              <p class="text-zinc-500 text-xs font-medium mb-1">Confirmed</p>
              <p class="text-2xl font-bold text-orange-400">{report.bookings.byStatus.confirmed}</p>
            </div>
            <div class="bg-zinc-900/50 rounded p-4">
              <p class="text-zinc-500 text-xs font-medium mb-1">Completed</p>
              <p class="text-2xl font-bold text-green-400">{report.bookings.byStatus.completed}</p>
            </div>
            <div class="bg-zinc-900/50 rounded p-4">
              <p class="text-zinc-500 text-xs font-medium mb-1">Rejected</p>
              <p class="text-2xl font-bold text-red-400">{report.bookings.byStatus.rejected}</p>
            </div>
          </div>
        </section>

        <!-- Growth Metrics -->
        <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
          <h2 class="text-lg font-bold mb-6">Growth Metrics</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Skills Learned</span>
              <span class="font-semibold text-green-400">{report.growth?.skillsLearned ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Connections Made</span>
              <span class="font-semibold text-green-400">{report.growth?.connectionsMade ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Content Published</span>
              <span class="font-semibold text-green-400">{report.growth?.contentPublished ?? 0}</span>
            </div>
            <div class="border-t border-zinc-700 my-3"></div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Apps Deployed</span>
              <span class="font-semibold text-purple-400">{report.product?.appsDeployed ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Apps Updated</span>
              <span class="font-semibold text-purple-400">{report.product?.appsUpdated ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Free Tools Built</span>
              <span class="font-semibold text-purple-400">{report.product?.freeToolsBuilt ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/30 rounded">
              <span class="text-sm text-zinc-400">Users Acquired</span>
              <span class="font-semibold text-purple-400">{report.product?.usersAcquired ?? 0}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-zinc-900/50 rounded">
              <span class="text-sm font-medium text-zinc-300">Total Online Products</span>
              <span class="font-bold text-purple-300 text-lg">{report.product?.totalOnlineProducts ?? 0}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- SECTION 6: Quick Log Activity Form -->
      <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50 mb-8">
        <h2 class="text-lg font-bold mb-6">Quick Log Activity</h2>
        <form
          onsubmit={(e) => {
            e.preventDefault();
            submitLogActivity();
          }}
          class="space-y-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2">Category
              <select
                bind:value={logForm.category}
                class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="builder">Builder</option>
                <option value="docs">Docs</option>
                <option value="automation">Automation</option>
                <option value="product">Product</option>
                <option value="sales_collateral">Sales Collateral</option>
                <option value="revenue">Revenue</option>
                <option value="growth">Growth</option>
                <option value="marketing">Marketing</option>
                <option value="leads">Leads</option>
              </select>
</label>
            </div>

            <!-- Action -->
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2">Action
              <input
                type="text"
                bind:value={logForm.action}
                placeholder="e.g., feature_shipped, doc_created"
                class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
</label>
            </div>

            <!-- Business -->
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2">Business
              <select
                bind:value={logForm.business}
                class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="arjostyle">ArjoStyle</option>
                <option value="silog">Silog</option>
                <option value="sweetytreats">Sweety Treats</option>
                <option value="foodhub">FoodHub</option>
                <option value="dorm">Dorm</option>
              </select>
</label>
            </div>

            <!-- Value -->
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2">Value
              <input
                type="number"
                bind:value={logForm.value}
                class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              />
</label>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-2">Notes (optional)
            <textarea
              bind:value={logForm.notes}
              placeholder="Add any additional context..."
              class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              rows="2"
            ></textarea>
</label>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-2">
            <button
              type="submit"
              disabled={isSubmittingLog || !logForm.action.trim()}
              class="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
            >
              {isSubmittingLog ? 'Logging...' : 'Log Activity'}
            </button>
          </div>
        </form>
      </section>

      <!-- SECTION 7: Activity Feed -->
      <section class="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/50">
        <h2 class="text-lg font-bold mb-6">Recent Activity</h2>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          {#if report.recentActivity.length > 0}
            {#each report.recentActivity as activity}
              <div class="flex gap-4 p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                <div class="flex-shrink-0 text-xl">{getActivityIcon(activity.category)}</div>
                <div class="flex-grow min-w-0">
                  <p class="text-sm font-medium text-white">
                    {getActivityDescription(activity.category, activity.action, activity.value)}
                  </p>
                  <div class="flex items-center gap-3 mt-1">
                    <span class="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded capitalize">
                      {activity.business}
                    </span>
                    <span class="text-xs text-zinc-500">{formatDate(activity.createdAt)}</span>
                  </div>
                  {#if activity.notes}
                    <p class="text-xs text-zinc-400 mt-2">{activity.notes}</p>
                  {/if}
                </div>
              </div>
            {/each}
          {:else}
            <p class="text-center text-zinc-500 py-8">No recent activity</p>
          {/if}
        </div>
      </section>
    {/if}
  </div>
</div>

<style>
  :global(body) {
    background-color: #09090b;
  }
</style>
