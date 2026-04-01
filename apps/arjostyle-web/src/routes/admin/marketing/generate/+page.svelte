<script lang="ts">
  let selectedBusiness = $state('silog');
  let contentType = $state('menu_image');
  let platform = $state('facebook');
  let pipelineStage = $state('awareness');
  let generating = $state(false);
  let result = $state<any>(null);

  // Menu item fields
  let menuName = $state('');
  let menuPrice = $state('');
  let menuStyle = $state('overhead food photography');

  // Promo fields
  let promoTitle = $state('');
  let promoDiscount = $state('');
  let promoValidUntil = $state('');

  const businesses = [
    { id: 'silog', name: "Kuya's Silog & Lugaw" },
    { id: 'sweetytreats', name: 'SweetyTreats' },
    { id: 'foodhub', name: 'FoodHub' },
    { id: 'dorm', name: 'Dorm Living' },
    { id: 'arjostyle', name: 'ArjoStyle' },
  ];

  const contentTypes = [
    { id: 'menu_image', label: 'Menu Image + Caption' },
    { id: 'promo_graphic', label: 'Promo Graphic' },
    { id: 'social_caption', label: 'Social Caption' },
    { id: 'story_post', label: 'Story Post' },
  ];

  const platforms = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'google_business', label: 'Google Business' },
  ];

  const pipelineStages = [
    { id: 'awareness', label: 'Awareness' },
    { id: 'interest', label: 'Interest' },
    { id: 'conversion', label: 'Conversion' },
    { id: 'retention', label: 'Retention' },
    { id: 'advocacy', label: 'Advocacy' },
  ];

  async function generate() {
    generating = true;
    result = null;

    const body: any = {
      business: selectedBusiness,
      contentType,
      platform,
      pipelineStage,
    };

    if (contentType === 'menu_image') {
      body.menuItem = { name: menuName, price: menuPrice, style: menuStyle };
    } else if (contentType === 'promo_graphic') {
      body.promoDetails = { title: promoTitle, discount: promoDiscount, validUntil: promoValidUntil };
    }

    try {
      const res = await fetch('/api/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      result = await res.json();
    } catch (e) {
      console.error('Generation failed:', e);
    }
    generating = false;
  }
</script>

<div class="p-4 sm:p-8 max-w-4xl mx-auto">
  <!-- Header -->
  <div class="mb-6 sm:mb-8">
    <a href="/admin/marketing" class="text-zinc-500 text-xs font-mono hover:text-zinc-300 mb-2 inline-block">← Back to Pipeline</a>
    <h1 class="text-xl sm:text-2xl font-bold text-white">Content Generator</h1>
    <p class="text-zinc-500 text-xs sm:text-sm mt-1">Generate AI-powered captions, image prompts, and social content</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
    <!-- Input Form -->
    <div class="space-y-6">
      <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 sm:p-6 space-y-5">
        <h2 class="text-white font-semibold text-sm uppercase tracking-wider">Configuration</h2>

        <!-- Business -->
        <div>
          <label class="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Business
          <select bind:value={selectedBusiness} class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            {#each businesses as biz}
              <option value={biz.id}>{biz.name}</option>
            {/each}
          </select>
</label>
        </div>

        <!-- Content Type -->
        <div>
          <span class="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Content Type</span>
          <div class="grid grid-cols-2 gap-2">
            {#each contentTypes as ct}
              <button
                onclick={() => contentType = ct.id}
                class="px-3 py-2 rounded-lg text-xs font-medium transition-all text-left {contentType === ct.id ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500' : 'bg-zinc-900 text-zinc-400 hover:text-white'}"
              >{ct.label}</button>
            {/each}
          </div>
        </div>

        <!-- Platform -->
        <div>
          <span class="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Platform</span>
          <div class="flex gap-2 flex-wrap">
            {#each platforms as p}
              <button
                onclick={() => platform = p.id}
                class="px-3 py-2 rounded-lg text-xs font-medium transition-all {platform === p.id ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500' : 'bg-zinc-900 text-zinc-400 hover:text-white'}"
              >{p.label}</button>
            {/each}
          </div>
        </div>

        <!-- Pipeline Stage -->
        <div>
          <label class="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Pipeline Stage
          <select bind:value={pipelineStage} class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            {#each pipelineStages as ps}
              <option value={ps.id}>{ps.label}</option>
            {/each}
          </select>
</label>
        </div>
      </div>

      <!-- Conditional Fields -->
      {#if contentType === 'menu_image'}
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 sm:p-6 space-y-4">
          <h2 class="text-white font-semibold text-sm uppercase tracking-wider">Menu Item Details</h2>
          <div>
            <label class="block text-zinc-400 text-xs mb-1.5">Item Name
            <input bind:value={menuName} placeholder="e.g. Tapsilog, Longsilog, Cornsilog" class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-xs mb-1.5">Price (₱)
            <input bind:value={menuPrice} placeholder="e.g. 99" class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-xs mb-1.5">Photo Style
            <select bind:value={menuStyle} class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="overhead food photography">Overhead / Flat Lay</option>
              <option value="45-degree angle food photography">45° Angle</option>
              <option value="close-up macro food photography">Close-up Macro</option>
              <option value="lifestyle food photography with hands">Lifestyle with Hands</option>
              <option value="dark moody food photography">Dark & Moody</option>
            </select>
</label>
          </div>
        </div>
      {/if}

      {#if contentType === 'promo_graphic'}
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 sm:p-6 space-y-4">
          <h2 class="text-white font-semibold text-sm uppercase tracking-wider">Promo Details</h2>
          <div>
            <label class="block text-zinc-400 text-xs mb-1.5">Promo Title
            <input bind:value={promoTitle} placeholder="e.g. Payday Weekend Special" class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-xs mb-1.5">Discount
            <input bind:value={promoDiscount} placeholder="e.g. 20%, Buy 1 Take 1" class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
</label>
          </div>
          <div>
            <label class="block text-zinc-400 text-xs mb-1.5">Valid Until
            <input type="date" bind:value={promoValidUntil} class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
</label>
          </div>
        </div>
      {/if}

      <!-- Generate Button -->
      <button
        onclick={generate}
        disabled={generating}
        class="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors text-sm"
      >
        {generating ? 'Generating...' : '✨ Generate Content'}
      </button>
    </div>

    <!-- Preview Panel -->
    <div>
      {#if result}
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden sticky top-8">
          <div class="p-4 border-b border-zinc-700/50 flex items-center justify-between">
            <h2 class="text-white font-semibold text-sm">Generated Content</h2>
            <span class="text-xs px-2 py-1 rounded-full bg-green-900/30 text-green-400">{result.status}</span>
          </div>

          <div class="p-4 sm:p-6 space-y-4">
            <div>
              <p class="text-zinc-500 text-xs uppercase tracking-wider mb-1">Title</p>
              <p class="text-white font-medium">{result.title}</p>
            </div>

            {#if result.caption}
              <div>
                <p class="text-zinc-500 text-xs uppercase tracking-wider mb-1">Caption</p>
                <div class="bg-zinc-900 rounded-lg p-4 text-zinc-300 text-sm whitespace-pre-wrap">{result.caption}</div>
              </div>
            {/if}

            {#if result.imagePrompt}
              <div>
                <p class="text-zinc-500 text-xs uppercase tracking-wider mb-1">Image Prompt (for AI generation)</p>
                <div class="bg-zinc-900 rounded-lg p-4 text-zinc-400 text-xs font-mono whitespace-pre-wrap">{result.imagePrompt}</div>
                <p class="text-zinc-600 text-xs mt-2 italic">Copy this prompt to Midjourney, DALL-E, or your n8n workflow to generate the image.</p>
              </div>
            {/if}

            {#if result.hashtags?.length}
              <div>
                <p class="text-zinc-500 text-xs uppercase tracking-wider mb-1">Hashtags</p>
                <div class="flex flex-wrap gap-1.5">
                  {#each result.hashtags as tag}
                    <span class="text-xs px-2 py-1 bg-zinc-900 text-blue-400 rounded">{tag}</span>
                  {/each}
                </div>
              </div>
            {/if}

            <div class="flex gap-2 pt-4 border-t border-zinc-700/50">
              <button onclick={() => navigator.clipboard.writeText(result.caption || '')} class="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs transition-colors">
                📋 Copy Caption
              </button>
              <button onclick={() => navigator.clipboard.writeText(result.imagePrompt || '')} class="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs transition-colors">
                🎨 Copy Image Prompt
              </button>
            </div>
          </div>
        </div>
      {:else}
        <div class="bg-zinc-800/30 border border-dashed border-zinc-700 rounded-lg p-8 sm:p-12 text-center sticky top-8">
          <p class="text-zinc-600 text-4xl mb-4">✨</p>
          <p class="text-zinc-500 text-sm">Configure options and hit generate</p>
          <p class="text-zinc-600 text-xs mt-2">AI will create captions, hashtags, and image prompts</p>
        </div>
      {/if}
    </div>
  </div>
</div>
