<script lang="ts">
  import { onMount } from 'svelte';

  interface SizePreset {
    label: string;
    min: number;
    max: number;
  }

  interface BodyPlacement {
    name: string;
    painLevel: number;
  }

  const sizePresets: SizePreset[] = [
    { label: 'TINY', min: 1, max: 4 },
    { label: 'SMALL', min: 4, max: 16 },
    { label: 'MED', min: 16, max: 36 },
    { label: 'LARGE', min: 36, max: 64 },
    { label: 'XL', min: 64, max: 100 }
  ];

  const bodyPlacements: BodyPlacement[] = [
    { name: 'Arm', painLevel: 2 },
    { name: 'Forearm', painLevel: 2 },
    { name: 'Wrist', painLevel: 3 },
    { name: 'Back', painLevel: 2 },
    { name: 'Chest', painLevel: 3 },
    { name: 'Ribs', painLevel: 5 },
    { name: 'Thigh', painLevel: 2 },
    { name: 'Calf', painLevel: 2 },
    { name: 'Ankle', painLevel: 4 },
    { name: 'Neck', painLevel: 4 },
    { name: 'Hand', painLevel: 4 },
    { name: 'Finger', painLevel: 4 }
  ];

  const complexityMultipliers = {
    'Simple line work': 1,
    'Moderate detail': 1.5,
    'High detail': 2,
    'Photo-realistic': 3
  };

  let size = $state(16);
  let selectedPlacement = $state('Arm');
  let complexity = $state<keyof typeof complexityMultipliers>('Moderate detail');
  let isFullColor = $state(false);
  let isCoverup = $state(false);

  let estimatedPrice = $derived.by(() => {
    const basePrice = 1000;
    const sizeMultiplier = Math.min(4.5, 1 + (size - 1) * 0.025);
    const complexityMultiplier = complexityMultipliers[complexity];
    const colorMultiplier = isFullColor ? 1.5 : 1;
    const coverupMultiplier = isCoverup ? 2 : 1;

    const totalPrice =
      basePrice * sizeMultiplier * complexityMultiplier * colorMultiplier * coverupMultiplier;
    return Math.round(totalPrice);
  });

  let priceRange = $derived.by(() => {
    const low = Math.round(estimatedPrice * 0.8);
    const high = Math.round(estimatedPrice * 1.2);
    return { low, high };
  });

  let sessionEstimate = $derived.by(() => {
    const sqInchesPerHour = 4;
    const maxHoursPerSession = 6;
    const totalHours = size / sqInchesPerHour;
    const sessions = Math.ceil(totalHours / maxHoursPerSession);
    return { sessions, totalHours: Math.round(totalHours * 10) / 10 };
  });

  let depositAmount = $derived(Math.round(estimatedPrice * 0.5));

  const currentPlacement = $derived(bodyPlacements.find((p) => p.name === selectedPlacement));
  const painDots = $derived(currentPlacement?.painLevel || 2);

  function setSize(preset: SizePreset) {
    size = preset.min + (preset.max - preset.min) / 2;
  }

  function formatPrice(price: number): string {
    return price.toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
</script>

<svelte:head>
  <title>Tattoo Price Estimator — ArjoStyle Free Tools</title>
  <meta
    name="description"
    content="Free tattoo price estimator. Calculate tattoo cost based on size, complexity, placement, and color. Get deposit and session estimates."
  />
</svelte:head>

<div class="min-h-screen bg-dark pt-20 pb-16 px-4 md:px-8 border-b border-border">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-wide">TATTOO PRICE ESTIMATOR</h1>
      <p class="text-zinc-500 font-mono text-sm">
        Get a realistic price estimate for your custom tattoo design
      </p>
    </div>

    <!-- Main Content -->
    <div class="grid md:grid-cols-3 gap-8 mb-12">
      <!-- Input Panel -->
      <div class="md:col-span-2 space-y-2">
        <!-- Size Section -->
        <div class="bg-elevated border border-border p-6">
          <h2 class="text-white font-display text-lg mb-4 tracking-wide">SIZE</h2>
          <p class="text-zinc-500 font-mono text-sm mb-4">{size} sq inches</p>

          <!-- Presets -->
          <div class="grid grid-cols-5 gap-1 mb-6">
            {#each sizePresets as preset (preset.label)}
              <button
                onclick={() => setSize(preset)}
                class="py-2 px-3 text-sm font-mono font-medium transition-all duration-150 {size >=
                preset.min && size <= preset.max
                  ? 'bg-white text-dark font-bold'
                  : 'bg-dark text-zinc-500 border border-border hover:border-border-light hover:text-white'}"
              >
                {preset.label}
              </button>
            {/each}
          </div>

          <!-- Slider -->
          <input
            type="range"
            min="1"
            max="100"
            bind:value={size}
            class="w-full h-2 bg-dark appearance-none cursor-pointer accent-ink"
          />
          <div class="flex justify-between text-[10px] font-mono text-zinc-600 mt-2">
            <span>1</span>
            <span>100</span>
          </div>
        </div>

        <!-- Placement Section -->
        <div class="bg-elevated border border-border p-6">
          <h2 class="text-white font-display text-lg mb-4 tracking-wide">BODY PLACEMENT</h2>
          <select
            bind:value={selectedPlacement}
            class="w-full px-4 py-3 bg-dark border border-border text-white text-sm font-mono mb-4 focus:outline-none focus:border-ink"
          >
            {#each bodyPlacements as placement (placement.name)}
              <option value={placement.name}>{placement.name}</option>
            {/each}
          </select>
          <div class="flex items-center gap-2 text-zinc-500 text-sm font-mono">
            <span>PAIN LEVEL:</span>
            <div class="flex gap-1">
              {#each Array(5) as _, i}
                <span class={i < painDots ? 'text-ink' : 'text-border'}>●</span>
              {/each}
            </div>
          </div>
        </div>

        <!-- Complexity Section -->
        <div class="bg-elevated border border-border p-6">
          <h2 class="text-white font-display text-lg mb-4 tracking-wide">COMPLEXITY</h2>
          <div class="space-y-3">
            {#each Object.keys(complexityMultipliers) as option}
              <label class="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="complexity"
                  value={option}
                  bind:group={complexity}
                  class="w-4 h-4 accent-ink cursor-pointer"
                />
                <span class="text-zinc-300 group-hover:text-white transition-colors font-mono text-sm">{option.toUpperCase()}</span>
              </label>
            {/each}
          </div>
        </div>

        <!-- Color & Coverup Section -->
        <div class="grid md:grid-cols-2 gap-2">
          <div class="bg-elevated border border-border p-6">
            <h2 class="text-white font-display text-lg mb-4 tracking-wide">COLOR</h2>
            <label class="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="radio"
                name="color"
                value={false}
                bind:group={isFullColor}
                class="w-4 h-4 accent-ink cursor-pointer"
              />
              <span class="text-zinc-300 font-mono text-sm">BLACK & GREY</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="color"
                value={true}
                bind:group={isFullColor}
                class="w-4 h-4 accent-ink cursor-pointer"
              />
              <span class="text-zinc-300 font-mono text-sm">FULL COLOR (1.5x)</span>
            </label>
          </div>

          <div class="bg-elevated border border-border p-6">
            <h2 class="text-white font-display text-lg mb-4 tracking-wide">COVER-UP</h2>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={isCoverup}
                class="w-4 h-4 accent-ink cursor-pointer"
              />
              <span class="text-zinc-300 font-mono text-sm">{isCoverup ? 'YES (2x)' : 'NO'}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Results Panel -->
      <div class="space-y-2">
        <!-- Price Card -->
        <div class="bg-elevated border border-ink/30 p-6">
          <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
            ESTIMATED PRICE RANGE
          </p>
          <div class="text-3xl font-display text-white mb-1">
            {formatPrice(priceRange.low)} — {formatPrice(priceRange.high)}
          </div>
          <p class="text-zinc-600 font-mono text-sm">±20% depending on details</p>
        </div>

        <!-- Sessions Card -->
        <div class="bg-elevated border border-border p-6">
          <div class="mb-4">
            <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">SESSIONS</p>
            <p class="text-2xl font-display text-white">{sessionEstimate.sessions}</p>
          </div>
          <div class="pt-4 border-t border-border">
            <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">TOTAL HOURS</p>
            <p class="text-xl font-display text-white">{sessionEstimate.totalHours}</p>
          </div>
        </div>

        <!-- Deposit Card -->
        <div class="bg-elevated border border-border p-6">
          <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">50% DEPOSIT</p>
          <p class="text-2xl font-display text-ink">{formatPrice(depositAmount)}</p>
        </div>

        <!-- Specs Summary -->
        <div class="bg-dark border border-border p-4 text-sm space-y-2">
          <div class="flex justify-between text-zinc-400 font-mono text-sm">
            <span>Size:</span>
            <span class="text-white font-medium">{size} sq in</span>
          </div>
          <div class="flex justify-between text-zinc-400 font-mono text-sm">
            <span>Placement:</span>
            <span class="text-white font-medium">{selectedPlacement}</span>
          </div>
          <div class="flex justify-between text-zinc-400 font-mono text-sm">
            <span>Complexity:</span>
            <span class="text-white font-medium">{complexity}</span>
          </div>
          <div class="flex justify-between text-zinc-400 font-mono text-sm">
            <span>Color:</span>
            <span class="text-white font-medium">{isFullColor ? 'Full Color' : 'B&W'}</span>
          </div>
          <div class="flex justify-between text-zinc-400 font-mono text-sm">
            <span>Cover-up:</span>
            <span class="text-white font-medium">{isCoverup ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="text-center pt-8 border-t border-border">
      <p class="text-zinc-500 font-mono text-sm mb-4">Ready to book? Book your tattoo session now.</p>
      <a
        href="/book"
        class="inline-flex items-center gap-2 px-8 py-3 bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all duration-150"
      >
        BOOK NOW →
      </a>
    </div>

    <!-- Footer -->
    <div class="mt-12 pt-8 border-t border-border text-center">
      <a href="/tools" class="text-zinc-600 font-mono text-sm hover:text-white transition-colors"
        >← BACK TO FREE TOOLS</a
      >
    </div>
  </div>
</div>