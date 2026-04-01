<script lang="ts">
  interface Tool {
    path: string;
    title: string;
    description: string;
    icon: string;
    category: 'business' | 'image' | 'developer' | 'utility';
  }

  const categories = [
    { key: 'business', label: 'Business Calculators', icon: '💼' },
    { key: 'image', label: 'Image Tools', icon: '🖼️' },
    { key: 'developer', label: 'Developer Tools', icon: '🛠️' },
    { key: 'utility', label: 'Utility Tools', icon: '⚡' },
  ];

  const tools: Tool[] = [
    {
      path: '/tools/tattoo-price-estimator',
      title: 'Tattoo Price Estimator',
      description: 'Estimate tattoo costs by size, complexity, placement, and color. Get session counts and deposit amounts.',
      icon: '🎨',
      category: 'business'
    },
    {
      path: '/tools/tattoo-calculator',
      title: 'Tattoo Calculator',
      description: 'Interactive 3D body placement with real-time pricing, pain level info, and session estimates.',
      icon: '🖋️',
      category: 'business'
    },
    {
      path: '/tools/cookie-costing-calculator',
      title: 'Cookie Costing Calculator',
      description: 'Calculate ingredient costs, pricing, and profit margins for baked goods with monthly projections.',
      icon: '🍪',
      category: 'business'
    },
    {
      path: '/tools/silog-profit-calculator',
      title: 'Silog Profit Calculator',
      description: 'Analyze profit margins for silog variants with daily/monthly projections and break-even analysis.',
      icon: '🍚',
      category: 'business'
    },
    {
      path: '/tools/food-business-startup-calculator',
      title: 'Food Business Startup Calculator',
      description: 'Estimate startup costs, OPEX, break-even timeline, and ROI for food businesses.',
      icon: '🏪',
      category: 'business'
    },
    {
      path: '/tools/rental-property-roi',
      title: 'Rental Property ROI Calculator',
      description: 'Calculate rental income, net yield, break-even period, and 5-year projections.',
      icon: '🏠',
      category: 'business'
    },
    {
      path: '/tools/invoice-generator',
      title: 'Invoice Generator',
      description: 'Create professional invoices with line items, tax, discounts. Print or save as PDF.',
      icon: '🧾',
      category: 'business'
    },
    {
      path: '/tools/image-format-converter',
      title: 'Image Format Converter',
      description: 'Convert images between PNG, JPEG, and WEBP. Batch support with quality control.',
      icon: '🔄',
      category: 'image'
    },
    {
      path: '/tools/image-resizer',
      title: 'Image Resizer',
      description: 'Resize images to custom dimensions or social media presets. Instagram, Facebook, YouTube, and more.',
      icon: '📐',
      category: 'image'
    },
    {
      path: '/tools/color-palette-generator',
      title: 'Color Palette Generator',
      description: 'Extract dominant colors from images or generate random palettes. Export as CSS or Tailwind.',
      icon: '🎨',
      category: 'image'
    },
    {
      path: '/tools/qr-code-generator',
      title: 'QR Code Generator',
      description: 'Generate QR codes for URLs, WiFi, contacts, and email. Custom colors and sizes.',
      icon: '📱',
      category: 'utility'
    },
    {
      path: '/tools/youtube-transcript',
      title: 'YouTube Transcript Extractor',
      description: 'Extract transcripts from YouTube videos. Copy or download as text with timestamps.',
      icon: '📺',
      category: 'utility'
    },
    {
      path: '/tools/baybayin-generator',
      title: 'Baybayin Script Generator',
      description: 'Transliterate Filipino words to ancient Baybayin script. Popular words included.',
      icon: '🇵🇭',
      category: 'utility'
    },
    {
      path: '/tools/tip-calculator',
      title: 'Tip Calculator (PH)',
      description: 'Split bills, calculate tips in Philippine Peso. Service ratings and Kuripot mode.',
      icon: '💸',
      category: 'utility'
    },
    {
      path: '/tools/json-formatter',
      title: 'JSON Formatter & Validator',
      description: 'Format, minify, and validate JSON with syntax highlighting and error detection.',
      icon: '{ }',
      category: 'developer'
    },
    {
      path: '/tools/password-generator',
      title: 'Password Generator',
      description: 'Generate secure passwords with strength meter, entropy display, and bulk generation.',
      icon: '🔒',
      category: 'developer'
    },
  ];

  let activeCategory = $state<string | null>(null);

  const filteredTools = $derived(
    activeCategory ? tools.filter(t => t.category === activeCategory) : tools
  );
</script>

<svelte:head>
  <title>Free Online Tools — ArjoStyle</title>
  <meta
    name="description"
    content="15 free online tools: tattoo price estimator, image converter, QR code generator, invoice maker, Baybayin translator, password generator, and more. No signup needed."
  />
</svelte:head>

<div class="min-h-screen bg-surface-900 pt-20 pb-16 px-4 md:px-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Free Online Tools</h1>
      <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
        {tools.length} free tools — calculators, image editors, generators, and more. No signup, no ads, runs in your browser.
      </p>
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap justify-center gap-3 mb-12">
      <button
        onclick={() => activeCategory = null}
        class="px-4 py-2 rounded-full text-sm font-medium transition-all {activeCategory === null
          ? 'bg-orange-500 text-white'
          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}"
      >
        All ({tools.length})
      </button>
      {#each categories as cat}
        {@const count = tools.filter(t => t.category === cat.key).length}
        <button
          onclick={() => activeCategory = activeCategory === cat.key ? null : cat.key}
          class="px-4 py-2 rounded-full text-sm font-medium transition-all {activeCategory === cat.key
            ? 'bg-orange-500 text-white'
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}"
        >
          {cat.icon} {cat.label} ({count})
        </button>
      {/each}
    </div>

    <!-- Tools Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
      {#each filteredTools as tool}
        <a
          href={tool.path}
          class="group relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 rounded-lg p-6 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 rounded-lg transition-all duration-300 pointer-events-none"></div>

          <div class="relative z-10">
            <div class="text-3xl mb-3 inline-block">{tool.icon}</div>

            <h2 class="text-white font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors">
              {tool.title}
            </h2>

            <p class="text-zinc-400 text-sm leading-relaxed mb-4">{tool.description}</p>

            <div class="flex items-center gap-2 text-orange-400 group-hover:gap-3 transition-all">
              <span class="text-sm font-medium">Open Tool</span>
              <span class="text-lg">→</span>
            </div>
          </div>
        </a>
      {/each}
    </div>

    <!-- Features Section -->
    <div class="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-8 mb-16">
      <h2 class="text-white font-semibold text-2xl mb-8 text-center">Why Use These Tools?</h2>

      <div class="grid md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-2xl mb-3">🆓</div>
          <h3 class="text-white font-semibold mb-2">100% Free</h3>
          <p class="text-zinc-400 text-sm">No signup, no ads, no hidden fees.</p>
        </div>
        <div class="text-center">
          <div class="text-2xl mb-3">🔒</div>
          <h3 class="text-white font-semibold mb-2">Private</h3>
          <p class="text-zinc-400 text-sm">Everything runs in your browser. Data never leaves your device.</p>
        </div>
        <div class="text-center">
          <div class="text-2xl mb-3">⚡</div>
          <h3 class="text-white font-semibold mb-2">Instant</h3>
          <p class="text-zinc-400 text-sm">No loading screens. Results calculated in real-time.</p>
        </div>
        <div class="text-center">
          <div class="text-2xl mb-3">📱</div>
          <h3 class="text-white font-semibold mb-2">Mobile-Friendly</h3>
          <p class="text-zinc-400 text-sm">Works on any device — phone, tablet, or desktop.</p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="text-center">
      <p class="text-zinc-500 text-sm mb-4">Built by <a href="/" class="text-orange-400 hover:text-orange-300">ArjoStyle</a></p>
      <a
        href="/"
        class="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
      >
        ← Back to ArjoStyle
      </a>
    </div>
  </div>
</div>
