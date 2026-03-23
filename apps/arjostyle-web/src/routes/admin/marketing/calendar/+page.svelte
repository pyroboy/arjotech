<script lang="ts">
  import { onMount } from 'svelte';

  let content = $state<any[]>([]);
  let selectedBusiness = $state('silog');
  let loading = $state(true);

  const businesses = [
    { id: 'silog', name: "Kuya's Silog" },
    { id: 'sweetytreats', name: 'SweetyTreats' },
    { id: 'foodhub', name: 'FoodHub' },
    { id: 'dorm', name: 'Dorm' },
    { id: 'arjostyle', name: 'ArjoStyle' },
  ];

  // Calendar state
  let currentDate = $state(new Date());
  let currentMonth = $derived(currentDate.getMonth());
  let currentYear = $derived(currentDate.getFullYear());

  let daysInMonth = $derived(new Date(currentYear, currentMonth + 1, 0).getDate());
  let firstDayOfWeek = $derived(new Date(currentYear, currentMonth, 1).getDay());

  let calendarDays = $derived(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  });

  let monthName = $derived(currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

  function getContentForDay(day: number) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return content.filter(c => {
      if (!c.scheduledAt) return false;
      return c.scheduledAt.startsWith(dateStr);
    });
  }

  function prevMonth() {
    currentDate = new Date(currentYear, currentMonth - 1, 1);
  }

  function nextMonth() {
    currentDate = new Date(currentYear, currentMonth + 1, 1);
  }

  async function fetchContent() {
    loading = true;
    try {
      const res = await fetch(`/api/marketing/content?business=${selectedBusiness}`);
      content = await res.json();
    } catch (e) {
      content = [];
    }
    loading = false;
  }

  onMount(fetchContent);

  $effect(() => {
    selectedBusiness;
    fetchContent();
  });
</script>

<div class="p-8 max-w-6xl mx-auto">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div>
      <a href="/admin/marketing" class="text-zinc-500 text-xs font-mono hover:text-zinc-300 mb-2 inline-block">← Back to Pipeline</a>
      <h1 class="text-2xl font-bold text-white">Content Calendar</h1>
      <p class="text-zinc-500 text-sm mt-1">Schedule and visualize your content across the month</p>
    </div>
    <a href="/admin/marketing/generate" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
      ✨ Generate Content
    </a>
  </div>

  <!-- Business + Month controls -->
  <div class="flex items-center justify-between mb-6">
    <div class="flex gap-2">
      {#each businesses as biz}
        <button
          onclick={() => selectedBusiness = biz.id}
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all {selectedBusiness === biz.id ? 'bg-zinc-700 text-white ring-1 ring-orange-500' : 'bg-zinc-800/50 text-zinc-500 hover:text-white'}"
        >{biz.name}</button>
      {/each}
    </div>
    <div class="flex items-center gap-4">
      <button onclick={prevMonth} class="text-zinc-400 hover:text-white transition-colors">←</button>
      <span class="text-white font-semibold text-sm min-w-[140px] text-center">{monthName}</span>
      <button onclick={nextMonth} class="text-zinc-400 hover:text-white transition-colors">→</button>
    </div>
  </div>

  <!-- Calendar Grid -->
  <div class="bg-zinc-800/30 border border-zinc-700/50 rounded-lg overflow-hidden">
    <!-- Day headers -->
    <div class="grid grid-cols-7 border-b border-zinc-700/50">
      {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
        <div class="px-3 py-2 text-center text-zinc-500 text-xs uppercase tracking-wider font-medium">{day}</div>
      {/each}
    </div>

    <!-- Calendar days -->
    <div class="grid grid-cols-7">
      {#each calendarDays() as day}
        <div class="min-h-[100px] border-b border-r border-zinc-800/50 p-2 {day ? 'bg-zinc-900/20' : 'bg-zinc-900/50'}">
          {#if day}
            <span class="text-zinc-500 text-xs font-mono">{day}</span>
            {#each getContentForDay(day) as item}
              <div class="mt-1 px-2 py-1 rounded text-[10px] truncate {
                item.status === 'scheduled' ? 'bg-purple-900/30 text-purple-400' :
                item.status === 'published' ? 'bg-green-900/30 text-green-400' :
                'bg-zinc-800 text-zinc-400'
              }" title={item.title}>
                {item.title}
              </div>
            {/each}
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Quick Content Suggestions -->
  <div class="mt-8">
    <h2 class="text-lg font-semibold text-white mb-4">Content Ideas This Month</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
        <p class="text-orange-400 text-xs uppercase tracking-wider font-semibold mb-2">Week 1</p>
        <p class="text-zinc-300 text-sm">Menu spotlight posts — feature one item per day with price</p>
      </div>
      <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
        <p class="text-blue-400 text-xs uppercase tracking-wider font-semibold mb-2">Week 2</p>
        <p class="text-zinc-300 text-sm">Behind-the-scenes cooking videos — show prep, plating, and cleanup</p>
      </div>
      <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
        <p class="text-green-400 text-xs uppercase tracking-wider font-semibold mb-2">Week 3-4</p>
        <p class="text-zinc-300 text-sm">Customer features + promos — share reviews, run a weekend deal</p>
      </div>
    </div>
  </div>
</div>
