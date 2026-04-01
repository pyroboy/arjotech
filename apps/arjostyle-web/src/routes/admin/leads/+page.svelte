<script lang="ts">
  import { Plus, Search, X, ChevronRight, MessageCircle, Phone, Calendar, TrendingUp } from 'lucide-svelte';
  import type { Lead } from '$db/schema';

  let { data } = $props();

  // State – initialised once from server data; mutations update local copy
  // svelte-ignore state_referenced_locally
  let allLeads = $state<Lead[]>(data.leads);
  let searchQuery = $state('');
  let selectedBusiness = $state<string | null>(null);
  let selectedStatus = $state<string | null>(null);
  let loading = $state(false);
  let error = $state<string | null>(null);

  // Form state for adding leads
  let showAddForm = $state(false);
  let formData = $state({
    name: '',
    business: 'arjostyle' as const,
    source: 'other' as const,
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
    interest: '',
    estimatedValue: '',
    notes: '',
  });

  const businesses = [
    { id: 'silog', label: 'Silog', emoji: '🍚' },
    { id: 'sweetytreats', label: 'Sweety Treats', emoji: '🍰' },
    { id: 'foodhub', label: 'FoodHub', emoji: '🍽️' },
    { id: 'dorm', label: 'Dorm', emoji: '🏠' },
    { id: 'arjostyle', label: 'ArjoStyle', emoji: '🎨' },
  ];

  const statuses = [
    'new',
    'contacted',
    'responded',
    'qualified',
    'proposal_sent',
    'negotiating',
    'won',
    'lost',
    'dormant',
  ];

  const sources = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'google', label: 'Google' },
    { id: 'walk_in', label: 'Walk In' },
    { id: 'referral', label: 'Referral' },
    { id: 'dm', label: 'DM' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'website', label: 'Website' },
    { id: 'other', label: 'Other' },
  ];

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    contacted: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    responded: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    qualified: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    proposal_sent: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    negotiating: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    won: 'bg-green-500/10 text-green-400 border-green-500/30',
    lost: 'bg-red-500/10 text-red-400 border-red-500/30',
    dormant: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
  };

  const statusLabels: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    responded: 'Responded',
    qualified: 'Qualified',
    proposal_sent: 'Proposal Sent',
    negotiating: 'Negotiating',
    won: 'Won',
    lost: 'Lost',
    dormant: 'Dormant',
  };

  // Derived state
  let filteredLeads = $derived.by(() => {
    return allLeads.filter((lead) => {
      const matchesSearch =
        !searchQuery ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.interest?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBusiness = !selectedBusiness || lead.business === selectedBusiness;
      const matchesStatus = !selectedStatus || lead.status === selectedStatus;

      return matchesSearch && matchesBusiness && matchesStatus;
    });
  });

  let stats = $derived.by(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: allLeads.length,
      newThisWeek: allLeads.filter(
        (l) => new Date(l.createdAt) > weekAgo
      ).length,
      contacted: allLeads.filter((l) => l.lastContactedAt).length,
      won: allLeads.filter((l) => l.status === 'won').length,
      totalValue: allLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
    };
  });

  let groupedByStatus = $derived.by(() => {
    const groups: Record<string, Lead[]> = {};
    statuses.forEach((s) => {
      groups[s] = [];
    });
    filteredLeads.forEach((lead) => {
      if (lead.status in groups) {
        groups[lead.status].push(lead);
      }
    });
    return groups;
  });

  // Functions
  function getBusinessEmoji(business: string): string {
    return businesses.find((b) => b.id === business)?.emoji || '📌';
  }

  function formatDate(d: string | Date | null | undefined): string {
    if (!d) return 'Never';
    const date = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(date.getTime())) return 'Invalid';
    return new Intl.DateTimeFormat('en-PH', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  function formatCurrency(n: number | null | undefined): string {
    if (n == null || isNaN(n)) return '₱0';
    return `₱${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  }

  function daysSinceContact(date: string | Date | null | undefined): string {
    if (!date) return '—';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '—';
    const days = Math.floor(
      (new Date().getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return 'Today';
    if (days === 1) return '1d ago';
    if (days < 7) return `${days}d`;
    return `${Math.floor(days / 7)}w`;
  }

  function getSourceLabel(source: string): string {
    return sources.find((s) => s.id === source)?.label || source;
  }

  async function addLead() {
    if (!formData.name || !formData.business) {
      error = 'Name and business are required';
      return;
    }

    loading = true;
    error = null;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : null,
        }),
      });

      if (!res.ok) throw new Error('Failed to create lead');

      const newLead: Lead = await res.json();
      allLeads = [newLead, ...allLeads];

      // Reset form
      formData = {
        name: '',
        business: 'arjostyle',
        source: 'other',
        phone: '',
        email: '',
        facebook: '',
        instagram: '',
        interest: '',
        estimatedValue: '',
        notes: '',
      };
      showAddForm = false;
    } catch (err) {
      console.error('Failed to add lead:', err);
      error = 'Failed to create lead. Please try again.';
    } finally {
      loading = false;
    }
  }

  async function updateLeadStatus(leadId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update lead');

      const updated: Lead = await res.json();
      const idx = allLeads.findIndex((l) => l.id === leadId);
      if (idx >= 0) {
        allLeads[idx] = updated;
        allLeads = [...allLeads];
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
      error = 'Failed to update lead status';
    }
  }

  async function markAsContacted(leadId: string) {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastContactedAt: new Date().toISOString(),
          dmsSent: (allLeads.find((l) => l.id === leadId)?.dmsSent || 0) + 1,
        }),
      });

      if (!res.ok) throw new Error('Failed to update lead');

      const updated: Lead = await res.json();
      const idx = allLeads.findIndex((l) => l.id === leadId);
      if (idx >= 0) {
        allLeads[idx] = updated;
        allLeads = [...allLeads];
      }
    } catch (err) {
      console.error('Failed to mark as contacted:', err);
      error = 'Failed to update lead';
    }
  }

  async function logCall(leadId: string) {
    try {
      const lead = allLeads.find((l) => l.id === leadId);
      if (!lead) return;

      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastContactedAt: new Date().toISOString(),
          callsMade: (lead.callsMade || 0) + 1,
        }),
      });

      if (!res.ok) throw new Error('Failed to update lead');

      const updated: Lead = await res.json();
      const idx = allLeads.findIndex((l) => l.id === leadId);
      if (idx >= 0) {
        allLeads[idx] = updated;
        allLeads = [...allLeads];
      }
    } catch (err) {
      console.error('Failed to log call:', err);
      error = 'Failed to log call';
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-surface-900 to-surface-800 p-4 sm:p-8">
  <!-- Header -->
  <div class="mb-6 sm:mb-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Leads</h1>
        <p class="text-sm sm:text-base text-zinc-400">Manage sales pipeline across all businesses</p>
      </div>
      <button
        onclick={() => (showAddForm = !showAddForm)}
        class="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-lg px-4 py-3 text-orange-400 font-semibold hover:bg-orange-500/30 transition-colors self-start sm:self-auto"
      >
        <Plus class="w-5 h-5" />
        Add Lead
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      <div class="bg-surface-800 border border-zinc-700 rounded-lg p-3 sm:p-4">
        <p class="text-zinc-400 text-xs sm:text-sm font-medium mb-1">Total Leads</p>
        <p class="text-2xl sm:text-3xl font-bold text-white">{stats.total}</p>
      </div>
      <div class="bg-surface-800 border border-zinc-700 rounded-lg p-3 sm:p-4">
        <p class="text-zinc-400 text-xs sm:text-sm font-medium mb-1">New This Week</p>
        <p class="text-2xl sm:text-3xl font-bold text-blue-400">{stats.newThisWeek}</p>
      </div>
      <div class="bg-surface-800 border border-zinc-700 rounded-lg p-3 sm:p-4">
        <p class="text-zinc-400 text-xs sm:text-sm font-medium mb-1">Contacted</p>
        <p class="text-2xl sm:text-3xl font-bold text-cyan-400">{stats.contacted}</p>
      </div>
      <div class="bg-surface-800 border border-zinc-700 rounded-lg p-3 sm:p-4">
        <p class="text-zinc-400 text-xs sm:text-sm font-medium mb-1">Won</p>
        <p class="text-2xl sm:text-3xl font-bold text-green-400">{stats.won}</p>
      </div>
      <div class="bg-surface-800 border border-zinc-700 rounded-lg p-3 sm:p-4">
        <p class="text-zinc-400 text-xs sm:text-sm font-medium mb-1">Pipeline Value</p>
        <p class="text-xl sm:text-2xl font-bold text-orange-400">{formatCurrency(stats.totalValue)}</p>
      </div>
    </div>

    <!-- Error message -->
    {#if error}
      <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 flex items-center justify-between">
        <span>{error}</span>
        <button onclick={() => (error = null)} class="text-red-400 hover:text-red-300">
          <X class="w-5 h-5" />
        </button>
      </div>
    {/if}

    <!-- Add Lead Form -->
    {#if showAddForm}
      <div class="bg-surface-800 border border-zinc-700 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-bold text-white mb-4">New Lead</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-zinc-400 text-sm font-medium mb-2">Name *
            <input
              type="text"
              placeholder="Lead name"
              bind:value={formData.name}
              class="w-full bg-surface-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-sm font-medium mb-2">Business *
            <select
              bind:value={formData.business}
              class="w-full bg-surface-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
            >
              {#each businesses as b}
                <option value={b.id}>{b.label}</option>
              {/each}
            </select>
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-sm font-medium mb-2">Source
            <select
              bind:value={formData.source}
              class="w-full bg-surface-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
            >
              {#each sources as s}
                <option value={s.id}>{s.label}</option>
              {/each}
            </select>
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-sm font-medium mb-2">Estimated Value (₱)
            <input
              type="number"
              placeholder="5000"
              bind:value={formData.estimatedValue}
              class="w-full bg-surface-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-sm font-medium mb-2">Phone
            <input
              type="tel"
              placeholder="+63 9XX XXX XXXX"
              bind:value={formData.phone}
              class="w-full bg-surface-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-sm font-medium mb-2">Email
            <input
              type="email"
              placeholder="email@example.com"
              bind:value={formData.email}
              class="w-full bg-surface-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-sm font-medium mb-2">Facebook
            <input
              type="text"
              placeholder="facebook.com/username"
              bind:value={formData.facebook}
              class="w-full bg-surface-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-sm font-medium mb-2">Instagram
            <input
              type="text"
              placeholder="@username"
              bind:value={formData.instagram}
              class="w-full bg-surface-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
</label>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-zinc-400 text-sm font-medium mb-2">Interest / What they want
            <textarea
              placeholder="e.g., 'Tapsilog catering for 50 people', 'Tattoo sleeve design', etc."
              bind:value={formData.interest}
              rows="2"
              class="w-full bg-surface-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
            ></textarea>
</label>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-zinc-400 text-sm font-medium mb-2">Notes
            <textarea
              placeholder="Additional notes..."
              bind:value={formData.notes}
              rows="2"
              class="w-full bg-surface-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
            ></textarea>
</label>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            onclick={addLead}
            disabled={loading}
            class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'Creating...' : 'Create Lead'}
          </button>
          <button
            onclick={() => (showAddForm = false)}
            class="flex-1 bg-surface-700 hover:bg-surface-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    {/if}

    <!-- Search and Filters -->
    <div class="flex gap-3 sm:gap-4 mb-6">
      <div class="flex-1 relative">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search leads by name, email, phone, or interest..."
          bind:value={searchQuery}
          class="w-full bg-surface-800 border border-zinc-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
        />
      </div>
    </div>

    <!-- Business Filter Tabs -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button
        onclick={() => (selectedBusiness = null)}
        class="px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap {selectedBusiness === null
          ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
          : 'bg-surface-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'}"
      >
        All Businesses
      </button>
      {#each businesses as business}
        <button
          onclick={() => (selectedBusiness = selectedBusiness === business.id ? null : business.id)}
          class="px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 {selectedBusiness === business.id
            ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
            : 'bg-surface-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'}"
        >
          <span>{business.emoji}</span>
          {business.label}
        </button>
      {/each}
    </div>

    <!-- Status Filter Pills -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button
        onclick={() => (selectedStatus = null)}
        class="px-3 py-1 rounded-full text-sm font-semibold transition-all whitespace-nowrap {selectedStatus === null
          ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
          : 'bg-surface-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'}"
      >
        All Status
      </button>
      {#each statuses as status}
        <button
          onclick={() => (selectedStatus = selectedStatus === status ? null : status)}
          class="px-3 py-1 rounded-full text-sm font-semibold transition-all whitespace-nowrap {selectedStatus === status
            ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
            : 'bg-surface-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'}"
        >
          {statusLabels[status]}
        </button>
      {/each}
    </div>
  </div>

  <!-- Kanban Board -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-8">
    {#each statuses.slice(0, 3) as status}
      <div class="flex flex-col bg-surface-800/30 border border-zinc-700 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span class={`inline-block w-2 h-2 rounded-full`}
            style={`background: ${
              status === 'new'
                ? '#3b82f6'
                : status === 'contacted'
                  ? '#06b6d4'
                  : status === 'qualified'
                    ? '#f97316'
                    : '#8b5cf6'
            }`}></span>
          {statusLabels[status]}
          <span class="text-xs font-normal text-zinc-500">({groupedByStatus[status].length})</span>
        </h2>
        <div class="flex-1 space-y-3 overflow-y-auto max-h-96">
          {#each groupedByStatus[status] as lead (lead.id)}
            <div class="bg-surface-900 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-all group">
              <!-- Header: Name and emoji -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <p class="font-semibold text-white">{lead.name}</p>
                  <p class="text-xs text-zinc-500">{getBusinessEmoji(lead.business)} {lead.business}</p>
                </div>
                <span class="text-sm font-semibold text-orange-400">{formatCurrency(lead.estimatedValue)}</span>
              </div>

              <!-- Source badge -->
              <div class="mb-3">
                <span class="inline-block bg-surface-800 text-zinc-300 text-xs px-2 py-1 rounded">
                  {getSourceLabel(lead.source)}
                </span>
              </div>

              <!-- Interest snippet -->
              {#if lead.interest}
                <p class="text-sm text-zinc-400 mb-3 line-clamp-2">{lead.interest}</p>
              {/if}

              <!-- Days since contact -->
              {#if lead.lastContactedAt}
                <p class="text-xs text-zinc-500 mb-3">Last contacted: {daysSinceContact(lead.lastContactedAt)}</p>
              {/if}

              <!-- Actions -->
              <div class="flex gap-2 mb-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onclick={() => markAsContacted(lead.id)}
                  title="Mark as contacted"
                  class="flex-1 flex items-center justify-center gap-1 bg-surface-800 hover:bg-surface-700 text-zinc-300 hover:text-white py-1 px-2 rounded text-xs font-semibold transition-colors"
                >
                  <MessageCircle class="w-3 h-3" />
                  DM
                </button>
                <button
                  onclick={() => logCall(lead.id)}
                  title="Log a call"
                  class="flex-1 flex items-center justify-center gap-1 bg-surface-800 hover:bg-surface-700 text-zinc-300 hover:text-white py-1 px-2 rounded text-xs font-semibold transition-colors"
                >
                  <Phone class="w-3 h-3" />
                  Call
                </button>
              </div>

              <!-- Status progression -->
              {#if status !== 'won' && status !== 'lost' && status !== 'dormant'}
                <div class="flex gap-2">
                  {#each statuses.slice(statuses.indexOf(status) + 1, statuses.indexOf(status) + 2) as nextStatus}
                    <button
                      onclick={() => updateLeadStatus(lead.id, nextStatus)}
                      class="flex-1 flex items-center justify-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:border-orange-500/50 py-1 px-2 rounded text-xs font-semibold transition-colors"
                    >
                      <ChevronRight class="w-3 h-3" />
                      Move
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {:else}
            <p class="text-zinc-600 text-center py-8 text-sm">No leads in this stage</p>
          {/each}
        </div>
      </div>
    {/each}

    <!-- Final stages column -->
    <div class="flex flex-col bg-surface-800/30 border border-zinc-700 rounded-lg p-4">
      <h2 class="text-lg font-bold text-white mb-4">Won / Lost / Dormant</h2>
      <div class="flex-1 space-y-3 overflow-y-auto max-h-96">
        {#each statuses.slice(6) as status}
          {#each groupedByStatus[status] as lead (lead.id)}
            <div class="bg-surface-900 border {statusColors[status]} rounded-lg p-3">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <p class="font-semibold text-white text-sm">{lead.name}</p>
                  <p class="text-xs text-zinc-500">{getBusinessEmoji(lead.business)} {lead.business}</p>
                </div>
                <span class="text-xs font-semibold">{formatCurrency(lead.estimatedValue)}</span>
              </div>
              <span class="inline-block {statusColors[status]} text-xs px-2 py-1 rounded border">
                {statusLabels[status]}
              </span>
            </div>
          {/each}
        {/each}
        {#if statuses.slice(6).every((s) => groupedByStatus[s].length === 0)}
          <p class="text-zinc-600 text-center py-8 text-sm">No closed leads</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    @apply bg-surface-900;
  }
</style>
