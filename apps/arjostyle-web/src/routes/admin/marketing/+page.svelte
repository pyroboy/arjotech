<script lang="ts">
  import { onMount } from 'svelte';

  // Pipeline stages
  const stages = [
    { id: 'awareness', label: 'Awareness', emoji: '👀', description: 'They discover you exist', color: 'bg-blue-500' },
    { id: 'interest', label: 'Interest', emoji: '🤔', description: 'They check you out', color: 'bg-purple-500' },
    { id: 'conversion', label: 'Conversion', emoji: '💰', description: 'They buy', color: 'bg-green-500' },
    { id: 'retention', label: 'Retention', emoji: '🔁', description: 'They come back', color: 'bg-orange-500' },
    { id: 'advocacy', label: 'Advocacy', emoji: '📢', description: 'They tell others', color: 'bg-pink-500' },
  ];

  const businesses = [
    { id: 'silog', name: "Kuya's Silog & Lugaw", emoji: '🍳', color: 'text-orange-400' },
    { id: 'sweetytreats', name: 'SweetyTreats', emoji: '🍰', color: 'text-pink-400' },
    { id: 'foodhub', name: 'FoodHub', emoji: '🍽️', color: 'text-cyan-400' },
    { id: 'dorm', name: 'Dorm Living', emoji: '🏠', color: 'text-emerald-400' },
    { id: 'arjostyle', name: 'ArjoStyle', emoji: '🎨', color: 'text-violet-400' },
  ];

  let selectedBusiness = $state('silog');
  let content = $state<any[]>([]);
  let loading = $state(true);

  let stats = $derived({
    total: content.length,
    drafts: content.filter(c => c.status === 'draft').length,
    generated: content.filter(c => c.status === 'generated').length,
    approved: content.filter(c => c.status === 'approved').length,
    scheduled: content.filter(c => c.status === 'scheduled').length,
    published: content.filter(c => c.status === 'published').length,
  });

  let stageContent = $derived(
    stages.map(s => ({
      ...s,
      items: content.filter(c => c.pipelineStage === s.id),
      count: content.filter(c => c.pipelineStage === s.id).length,
    }))
  );

  async function fetchContent() {
    loading = true;
    try {
      const res = await fetch(`/api/marketing/content?business=${selectedBusiness}`);
      content = await res.json();
    } catch (e) {
      console.error('Failed to fetch content:', e);
      content = [];
    }
    loading = false;
  }

  onMount(fetchContent);

  $effect(() => {
    selectedBusiness;
    fetchContent();
  });

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/marketing/content/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchContent();
  }

  async function deleteContent(id: string) {
    if (!confirm('Delete this content?')) return;
    await fetch(`/api/marketing/content/${id}`, { method: 'DELETE' });
    fetchContent();
  }
</script>

<div class="p-8 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold text-white">Marketing Pipeline</h1>
      <p class="text-zinc-500 text-sm mt-1">AI-powered content generation & scheduling across all businesses</p>
    </div>
    <div class="flex gap-3">
      <a href="/admin/marketing/generate" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
        ✨ Generate Content
      </a>
      <a href="/admin/marketing/calendar" class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium transition-colors">
        📅 Calendar
      </a>
    </div>
  </div>

  <!-- Business Selector -->
  <div class="flex gap-2 mb-8 flex-wrap">
    {#each businesses as biz}
      <button
        onclick={() => selectedBusiness = biz.id}
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all {selectedBusiness === biz.id ? 'bg-zinc-700 text-white ring-2 ring-orange-500' : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800'}"
      >
        <span class="mr-1.5">{biz.emoji}</span>
        {biz.name}
      </button>
    {/each}
  </div>

  <!-- Stats Bar -->
  <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
      <p class="text-zinc-500 text-xs uppercase tracking-wider">Total</p>
      <p class="text-2xl font-bold text-white mt-1">{stats.total}</p>
    </div>
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
      <p class="text-zinc-500 text-xs uppercase tracking-wider">Drafts</p>
      <p class="text-2xl font-bold text-yellow-400 mt-1">{stats.drafts + stats.generated}</p>
    </div>
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
      <p class="text-zinc-500 text-xs uppercase tracking-wider">Approved</p>
      <p class="text-2xl font-bold text-blue-400 mt-1">{stats.approved}</p>
    </div>
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
      <p class="text-zinc-500 text-xs uppercase tracking-wider">Scheduled</p>
      <p class="text-2xl font-bold text-purple-400 mt-1">{stats.scheduled}</p>
    </div>
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
      <p class="text-zinc-500 text-xs uppercase tracking-wider">Published</p>
      <p class="text-2xl font-bold text-green-400 mt-1">{stats.published}</p>
    </div>
  </div>

  <!-- Pipeline Funnel -->
  <h2 class="text-lg font-semibold text-white mb-4">Pipeline Stages</h2>
  <div class="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
    {#each stageContent as stage}
      <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden">
        <div class="p-4 border-b border-zinc-700/50">
          <div class="flex items-center justify-between">
            <span class="text-lg">{stage.emoji}</span>
            <span class="text-xs font-mono text-zinc-500">{stage.count}</span>
          </div>
          <h3 class="text-white font-semibold text-sm mt-2">{stage.label}</h3>
          <p class="text-zinc-500 text-xs">{stage.description}</p>
        </div>
        <div class="p-3 space-y-2 max-h-64 overflow-y-auto">
          {#if stage.items.length === 0}
            <p class="text-zinc-600 text-xs italic text-center py-4">No content yet</p>
          {/if}
          {#each stage.items as item}
            <div class="bg-zinc-900/50 rounded-lg p-3 group">
              <div class="flex items-start justify-between">
                <p class="text-zinc-300 text-xs font-medium truncate flex-1">{item.title}</p>
                <button onclick={() => deleteContent(item.id)} class="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <span class="text-xs">✕</span>
                </button>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{item.platform}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded {
                  item.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400' :
                  item.status === 'generated' ? 'bg-blue-900/30 text-blue-400' :
                  item.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                  item.status === 'scheduled' ? 'bg-purple-900/30 text-purple-400' :
                  item.status === 'published' ? 'bg-emerald-900/30 text-emerald-400' :
                  'bg-zinc-800 text-zinc-400'
                }">{item.status}</span>
              </div>
              {#if item.status === 'generated'}
                <div class="flex gap-1 mt-2">
                  <button onclick={() => updateStatus(item.id, 'approved')} class="text-[10px] px-2 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/40 transition-colors">Approve</button>
                  <button onclick={() => updateStatus(item.id, 'scheduled')} class="text-[10px] px-2 py-1 bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/40 transition-colors">Schedule</button>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <!-- Recent Content Table -->
  <h2 class="text-lg font-semibold text-white mb-4">All Content</h2>
  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="text-zinc-500 text-sm">Loading...</div>
    </div>
  {:else if content.length === 0}
    <div class="bg-zinc-800/30 border border-dashed border-zinc-700 rounded-lg p-12 text-center">
      <p class="text-zinc-500 text-sm">No content yet for this business.</p>
      <a href="/admin/marketing/generate" class="inline-block mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors">
        Generate your first content ✨
      </a>
    </div>
  {:else}
    <div class="bg-zinc-800/30 border border-zinc-700/50 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-zinc-700/50">
              <th class="text-left text-zinc-500 text-xs uppercase tracking-wider px-4 py-3">Title</th>
              <th class="text-left text-zinc-500 text-xs uppercase tracking-wider px-4 py-3">Type</th>
              <th class="text-left text-zinc-500 text-xs uppercase tracking-wider px-4 py-3">Platform</th>
              <th class="text-left text-zinc-500 text-xs uppercase tracking-wider px-4 py-3">Stage</th>
              <th class="text-left text-zinc-500 text-xs uppercase tracking-wider px-4 py-3">Status</th>
              <th class="text-left text-zinc-500 text-xs uppercase tracking-wider px-4 py-3">Created</th>
              <th class="text-right text-zinc-500 text-xs uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each content as item}
              <tr class="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td class="px-4 py-3 text-zinc-300 font-medium max-w-[200px] truncate">{item.title}</td>
                <td class="px-4 py-3 text-zinc-400">{item.contentType.replace('_', ' ')}</td>
                <td class="px-4 py-3 text-zinc-400 capitalize">{item.platform}</td>
                <td class="px-4 py-3 text-zinc-400 capitalize">{item.pipelineStage}</td>
                <td class="px-4 py-3">
                  <span class="text-xs px-2 py-1 rounded-full {
                    item.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400' :
                    item.status === 'generated' ? 'bg-blue-900/30 text-blue-400' :
                    item.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                    item.status === 'scheduled' ? 'bg-purple-900/30 text-purple-400' :
                    item.status === 'published' ? 'bg-emerald-900/30 text-emerald-400' :
                    'bg-zinc-800 text-zinc-400'
                  }">{item.status}</span>
                </td>
                <td class="px-4 py-3 text-zinc-500 text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex gap-1 justify-end">
                    {#if item.status === 'generated'}
                      <button onclick={() => updateStatus(item.id, 'approved')} class="text-xs px-2 py-1 text-green-400 hover:bg-green-600/20 rounded transition-colors">✓</button>
                    {/if}
                    {#if item.status === 'approved'}
                      <button onclick={() => updateStatus(item.id, 'scheduled')} class="text-xs px-2 py-1 text-purple-400 hover:bg-purple-600/20 rounded transition-colors">📅</button>
                    {/if}
                    <button onclick={() => deleteContent(item.id)} class="text-xs px-2 py-1 text-red-400 hover:bg-red-600/20 rounded transition-colors">🗑</button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
