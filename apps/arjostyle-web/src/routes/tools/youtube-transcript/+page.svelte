<script lang="ts">
  interface Segment {
    start: number;
    duration: number;
    text: string;
  }

  let urlInput = $state('');
  let loading = $state(false);
  let error = $state('');
  let videoTitle = $state('');
  let videoId = $state('');
  let segments = $state<Segment[]>([]);
  let showTimestamps = $state(false);
  let copyFeedback = $state(false);

  const fullTranscript = $derived(segments.map((s) => s.text).join(' '));
  const wordCount = $derived(
    fullTranscript
      .split(/\s+/)
      .filter((w) => w.length > 0).length
  );
  const readingTimeMinutes = $derived(Math.ceil(wordCount / 250));
  const videoDuration = $derived(
    segments.length > 0
      ? formatTime(segments[segments.length - 1].start + segments[segments.length - 1].duration)
      : '0:00'
  );

  async function extractTranscript() {
    if (!urlInput.trim()) {
      error = 'Please enter a YouTube URL';
      return;
    }

    loading = true;
    error = '';
    videoTitle = '';
    videoId = '';
    segments = [];

    try {
      const res = await fetch(`/tools/youtube-transcript?url=${encodeURIComponent(urlInput.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        error = data.error || 'Failed to extract transcript';
        return;
      }

      videoTitle = data.title;
      videoId = data.videoId || '';
      segments = data.segments;
    } catch {
      error = 'Network error. Please check your connection and try again.';
    } finally {
      loading = false;
    }
  }

  function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function getTranscriptText(): string {
    if (showTimestamps) {
      return segments.map((s) => `[${formatTime(s.start)}] ${s.text}`).join('\n');
    }
    return fullTranscript;
  }

  async function copyTranscript() {
    try {
      await navigator.clipboard.writeText(getTranscriptText());
      copyFeedback = true;
      setTimeout(() => (copyFeedback = false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = getTranscriptText();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copyFeedback = true;
      setTimeout(() => (copyFeedback = false), 2000);
    }
  }

  function downloadTranscript() {
    const text = getTranscriptText();
    const filename = `${(videoTitle || 'transcript').replace(/[^a-zA-Z0-9 ]/g, '').trim()}.txt`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function pasteUrl() {
    try {
      const text = await navigator.clipboard.readText();
      urlInput = text.trim();
    } catch {
      // Clipboard API not available
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') extractTranscript();
  }

  function clearAll() {
    urlInput = '';
    videoTitle = '';
    videoId = '';
    segments = [];
    error = '';
  }
</script>

<svelte:head>
  <title>YouTube Transcript Extractor — Free Online Tool | ArjoStyle</title>
  <meta
    name="description"
    content="Extract transcripts from any YouTube video for free. Copy text, download as file, toggle timestamps. No signup needed."
  />
</svelte:head>

<div class="min-h-screen bg-surface-900 px-4 py-8 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <a href="/tools" class="text-sm text-zinc-500 hover:text-zinc-400 transition-colors mb-4 inline-block">← All Tools</a>
      <h1 class="text-3xl font-bold text-white sm:text-4xl">YouTube Transcript Extractor</h1>
      <p class="mt-2 text-zinc-400">Paste a YouTube URL to extract the full transcript. Works with auto-generated and manual captions.</p>
    </div>

    <!-- Input -->
    <div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6 mb-6">
      <label class="block text-sm font-medium text-zinc-300 mb-2">YouTube URL or Video ID</label>
      <div class="flex gap-2 mb-4">
        <input
          type="text"
          bind:value={urlInput}
          onkeydown={handleKeydown}
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          class="flex-1 rounded-lg bg-zinc-900 border border-zinc-700/50 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none text-sm"
        />
        <button
          onclick={pasteUrl}
          class="rounded-lg bg-zinc-700 hover:bg-zinc-600 border border-zinc-700/50 px-4 py-3 text-zinc-300 transition-colors text-sm font-medium"
        >
          Paste
        </button>
      </div>

      <button
        onclick={extractTranscript}
        disabled={loading || !urlInput.trim()}
        class="w-full rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed px-4 py-3 font-semibold text-white transition-colors"
      >
        {#if loading}
          <span class="inline-flex items-center gap-2">
            <span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Extracting transcript...
          </span>
        {:else}
          Extract Transcript
        {/if}
      </button>

      {#if error}
        <div class="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm">
          {error}
        </div>
      {/if}
    </div>

    <!-- Results -->
    {#if segments.length > 0}
      <!-- Video Info -->
      <div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6 mb-4">
        <div class="flex flex-col sm:flex-row sm:items-start gap-4">
          {#if videoId}
            <img
              src="https://i.ytimg.com/vi/{videoId}/mqdefault.jpg"
              alt={videoTitle}
              class="w-full sm:w-40 rounded-lg object-cover"
            />
          {/if}
          <div class="flex-1">
            <h2 class="text-xl font-bold text-white mb-3">{videoTitle}</h2>
            <div class="flex flex-wrap gap-3">
              <span class="inline-flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1.5 rounded-full text-xs text-zinc-400">
                {wordCount.toLocaleString()} words
              </span>
              <span class="inline-flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1.5 rounded-full text-xs text-zinc-400">
                ~{readingTimeMinutes} min read
              </span>
              <span class="inline-flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1.5 rounded-full text-xs text-zinc-400">
                {segments.length} segments
              </span>
              <span class="inline-flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1.5 rounded-full text-xs text-zinc-400">
                {videoDuration} duration
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" bind:checked={showTimestamps} class="rounded accent-orange-500" />
          <span class="text-sm text-zinc-300">Show timestamps</span>
        </label>

        <div class="flex gap-2">
          <button
            onclick={copyTranscript}
            class="rounded-lg {copyFeedback ? 'bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            {copyFeedback ? '✓ Copied!' : 'Copy Text'}
          </button>
          <button
            onclick={downloadTranscript}
            class="rounded-lg bg-zinc-700 hover:bg-zinc-600 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors"
          >
            Download .txt
          </button>
          <button
            onclick={clearAll}
            class="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Transcript -->
      <div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6 max-h-[32rem] overflow-y-auto">
        {#if showTimestamps}
          <div class="space-y-1.5">
            {#each segments as segment}
              <div class="flex gap-3 text-sm hover:bg-zinc-700/20 rounded px-2 py-1 -mx-2 transition-colors">
                <span class="text-orange-500 font-mono text-xs mt-0.5 flex-shrink-0 w-14 text-right">
                  {formatTime(segment.start)}
                </span>
                <span class="text-zinc-300">{segment.text}</span>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-zinc-300 leading-relaxed text-sm whitespace-pre-wrap">{fullTranscript}</p>
        {/if}
      </div>
    {/if}

    <!-- How it works -->
    {#if segments.length === 0 && !loading}
      <div class="rounded-lg bg-zinc-800/30 border border-zinc-700/50 p-6 mt-8">
        <h2 class="text-lg font-semibold text-white mb-4">How it works</h2>
        <div class="grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <div class="text-orange-500 font-bold text-lg mb-1">1</div>
            <p class="text-zinc-400">Paste any YouTube URL or video ID above</p>
          </div>
          <div>
            <div class="text-orange-500 font-bold text-lg mb-1">2</div>
            <p class="text-zinc-400">We extract the auto-generated or manual captions</p>
          </div>
          <div>
            <div class="text-orange-500 font-bold text-lg mb-1">3</div>
            <p class="text-zinc-400">Copy the transcript or download as a text file</p>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  <div class="mt-12 text-center text-zinc-500 text-sm border-t border-zinc-800/50 pt-6 max-w-4xl mx-auto">
    Part of <a href="/tools" class="text-orange-500 hover:text-orange-400 transition-colors">ArjoStyle Free Tools</a>
  </div>
</div>
