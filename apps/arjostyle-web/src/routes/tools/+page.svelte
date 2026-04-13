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

<div class="min-h-screen pt-20 pb-16 px-4 md:px-8" style="background-color: var(--bg-dark);">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-12 text-center">
      <p class="text-mono-label mb-4">FREE ONLINE TOOLS</p>
      <h1 class="font-display text-display-md text-white mb-6 tracking-wide">
        {tools.length} FREE TOOLS
      </h1>
      <p class="text-sm max-w-2xl mx-auto" style="color: var(--text-secondary); font-family: var(--font-mono);">
        Calculators, image editors, generators, and more. No signup, no ads, runs in your browser.
      </p>
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap justify-center gap-1 mb-12">
      <button
        onclick={() => activeCategory = null}
        class="brutal-btn {activeCategory === null ? 'brutal-btn-primary' : 'brutal-btn-secondary'}"
      >
        ALL ({tools.length})
      </button>
      {#each categories as cat}
        {@const count = tools.filter(t => t.category === cat.key).length}
        <button
          onclick={() => activeCategory = activeCategory === cat.key ? null : cat.key}
          class="brutal-btn {activeCategory === cat.key ? 'brutal-btn-primary' : 'brutal-btn-secondary'}"
        >
          {cat.icon} {cat.label} ({count})
        </button>
      {/each}
    </div>

    <!-- Tools Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-16 stagger-children">
      {#each filteredTools as tool}
        <a
          href={tool.path}
          class="group brutal-card p-6"
        >
          <div class="text-3xl mb-3">{tool.icon}</div>

          <h2 class="text-white font-display text-lg mb-2 group-hover:text-ink transition-colors tracking-wide">
            {tool.title.toUpperCase()}
          </h2>

          <p class="text-sm leading-relaxed mb-4" style="color: var(--text-secondary);">{tool.description}</p>

          <div class="flex items-center gap-2 font-mono text-sm group-hover:gap-3 transition-all" style="color: var(--ink);">
            <span>OPEN TOOL</span>
            <span>→</span>
          </div>
        </a>
      {/each}
    </div>

    <!-- Features Section -->
    <div class="brutal-card p-8 mb-16">
      <h2 class="text-white font-display text-2xl mb-8 text-center tracking-wide">WHY USE THESE TOOLS?</h2>

      <div class="grid md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-2xl mb-3">🆓</div>
          <h3 class="text-white font-semibold mb-2 font-display tracking-wide">100% FREE</h3>
          <p class="text-sm" style="color: var(--text-secondary);">No signup, no ads, no hidden fees.</p>
        </div>
        <div class="text-center">
          <div class="text-2xl mb-3">🔒</div>
          <h3 class="text-white font-semibold mb-2 font-display tracking-wide">PRIVATE</h3>
          <p class="text-sm" style="color: var(--text-secondary);">Everything runs in your browser. Data never leaves your device.</p>
        </div>
        <div class="text-center">
          <div class="text-2xl mb-3">⚡</div>
          <h3 class="text-white font-semibold mb-2 font-display tracking-wide">INSTANT</h3>
          <p class="text-sm" style="color: var(--text-secondary);">No loading screens. Results calculated in real-time.</p>
        </div>
        <div class="text-center">
          <div class="text-2xl mb-3">📱</div>
          <h3 class="text-white font-semibold mb-2 font-display tracking-wide">MOBILE-FRIENDLY</h3>
          <p class="text-sm" style="color: var(--text-secondary);">Works on any device — phone, tablet, or desktop.</p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="text-center">
      <p class="text-sm font-mono mb-4" style="color: var(--text-muted);">Built by <a href="/" style="color: var(--ink);" class="hover:opacity-80">ArjoStyle</a></p>
      <a
        href="/"
        class="inline-flex items-center gap-2 font-mono text-sm transition-colors hover:text-white"
        style="color: var(--text-secondary);"
      >
        ← BACK TO ARJOSTYLE
      </a>
    </div>
  </div>
</div>
