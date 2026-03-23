<script lang="ts">
  interface Color {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    complement?: Color;
  }

  let uploadedImage: {
    preview: string;
    width: number;
    height: number;
  } | null = $state(null);

  let extractedColors = $state<Color[]>([]);
  let showComplements = $state(false);
  let generatedRandomPalette = $state<Color[]>([]);
  let dragActive = $state(false);
  let copiedColor = $state<string | null>(null);
  let exportFormat = $state<'css' | 'tailwind' | null>(null);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragActive = false;
    if (e.dataTransfer?.files?.[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  }

  function handleFileSelect(files: FileList | null) {
    if (files?.[0]) {
      processImage(files[0]);
    }
  }

  function processImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      const img = new window.Image();
      img.onload = () => {
        uploadedImage = {
          preview: e.target!.result as string,
          width: img.width,
          height: img.height
        };
        extractPalette(img);
      };
      img.src = e.target.result as string;
    };
    reader.readAsDataURL(file);
  }

  function extractPalette(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const colorFreq = new Map<string, number>();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const hex = rgbToHex(r, g, b);
      colorFreq.set(hex, (colorFreq.get(hex) || 0) + 1);
    }

    const sortedColors = Array.from(colorFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([hex]) => hexToColor(hex));

    extractedColors = sortedColors.map((color) => ({
      ...color,
      complement: getComplement(color)
    }));
  }

  function rgbToHex(r: number, g: number, b: number): string {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
        .toUpperCase()
    );
  }

  function hexToColor(hex: string): Color {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgb = {
      r: parseInt(result![1], 16),
      g: parseInt(result![2], 16),
      b: parseInt(result![3], 16)
    };
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return {
      hex,
      rgb,
      hsl
    };
  }

  function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  function getComplement(color: Color): Color {
    const hsl = { ...color.hsl };
    hsl.h = (hsl.h + 180) % 360;
    return hslToColor(hsl);
  }

  function hslToColor(hsl: { h: number; s: number; l: number }): Color {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const rgb = {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };

    return {
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      hsl
    };
  }

  function generateRandomPalette() {
    const colors: Color[] = [];
    const hues = generateHarmonousHues();

    hues.forEach((hue) => {
      const saturation = 60 + Math.random() * 30;
      const lightness = 45 + Math.random() * 20;
      colors.push(hslToColor({ h: hue, s: saturation, l: lightness }));
    });

    generatedRandomPalette = colors;
  }

  function generateHarmonousHues(): number[] {
    const baseHue = Math.random() * 360;
    return [
      baseHue,
      (baseHue + 60) % 360,
      (baseHue + 120) % 360,
      (baseHue + 180) % 360,
      (baseHue + 240) % 360
    ];
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    copiedColor = text;
    setTimeout(() => (copiedColor = null), 2000);
  }

  function exportAsCSS(colors: Color[]): string {
    let css = ':root {\n';
    colors.forEach((color, i) => {
      css += `  --color-${i + 1}: ${color.hex};\n`;
    });
    css += '}';
    return css;
  }

  function exportAsTailwind(colors: Color[]): string {
    let config = 'colors: {\n';
    colors.forEach((color, i) => {
      config += `  'palette-${i + 1}': '${color.hex}',\n`;
    });
    config += '}';
    return config;
  }

  function downloadExport(content: string, filename: string) {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const activePalette = $derived(
    showComplements && extractedColors.length > 0
      ? extractedColors.flatMap((color) => [color, color.complement!])
      : extractedColors
  );
</script>

<svelte:head>
  <title>Color Palette Generator — ArjoStyle Free Tools</title>
  <meta
    name="description"
    content="Extract dominant colors from images or generate harmonious color palettes. Export as CSS or Tailwind config."
  />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-400">
  <div class="max-w-6xl mx-auto px-4 py-12 md:py-16">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-3">
        Color Palette Generator
      </h1>
      <p class="text-zinc-400 text-lg max-w-2xl">
        Extract dominant colors from images or generate harmonious palettes. Export as CSS or Tailwind.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <!-- Controls -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Upload Area -->
        <div
          class="bg-zinc-800/50 border-2 {dragActive
            ? 'border-orange-500 bg-orange-500/5'
            : 'border-dashed border-zinc-600'} rounded-xl p-8 text-center transition cursor-pointer"
          ondrop={handleDrop}
          ondragover={(e) => {
            e.preventDefault();
            dragActive = true;
          }}
          ondragleave={() => (dragActive = false)}
          role="button"
          tabindex="0"
        >
          <p class="text-white font-semibold mb-2">Drop image here</p>
          <p class="text-zinc-500 text-sm mb-4">or click to select</p>
          <input
            type="file"
            accept="image/*"
            onchange={(e) => handleFileSelect(e.currentTarget.files)}
            class="hidden"
            id="file-input"
          />
          <label for="file-input">
            <button
              type="button"
              onclick={() => document.getElementById('file-input')?.click()}
              class="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-400 transition"
            >
              Choose Image
            </button>
          </label>
        </div>

        {#if extractedColors.length > 0}
          <!-- Options -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={showComplements}
                class="w-4 h-4 rounded border-zinc-600 bg-surface-800 text-orange-500"
              />
              <span class="text-white font-semibold text-sm">Show Complements</span>
            </label>
          </div>

          <!-- Export -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6 space-y-3">
            <h3 class="text-white font-bold text-sm">Export Palette</h3>
            <button
              onclick={() => {
                downloadExport(exportAsCSS(extractedColors), 'palette.css');
              }}
              class="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg hover:bg-zinc-600 transition text-sm font-semibold"
            >
              Export as CSS
            </button>
            <button
              onclick={() => {
                downloadExport(
                  exportAsTailwind(extractedColors),
                  'tailwind-palette.js'
                );
              }}
              class="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg hover:bg-zinc-600 transition text-sm font-semibold"
            >
              Export as Tailwind
            </button>
          </div>
        {/if}

        <!-- Random Generator -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
          <h3 class="text-white font-bold mb-3 text-sm">Random Palette</h3>
          <p class="text-zinc-500 text-xs mb-4">
            Generate harmonious colors without uploading
          </p>
          <button
            onclick={generateRandomPalette}
            class="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-400 transition"
          >
            Generate Colors
          </button>
        </div>
      </div>

      <!-- Preview & Colors -->
      <div class="lg:col-span-2">
        {#if !uploadedImage && generatedRandomPalette.length === 0}
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-12 text-center h-full flex items-center justify-center">
            <div>
              <p class="text-zinc-500 text-lg mb-2">No palette generated</p>
              <p class="text-zinc-600 text-sm">
                Upload an image or generate random colors
              </p>
            </div>
          </div>
        {:else}
          <div class="space-y-6">
            <!-- Image Preview -->
            {#if uploadedImage}
              <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
                <h3 class="text-white font-semibold mb-3 text-sm">Source Image</h3>
                <img
                  src={uploadedImage.preview}
                  alt="Source"
                  class="w-full max-h-64 object-contain rounded-lg bg-surface-900"
                />
              </div>
            {/if}

            <!-- Color Swatches -->
            <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
              <h3 class="text-white font-semibold mb-4 text-sm">
                {showComplements ? 'Colors with Complements' : 'Extracted Colors'}
              </h3>
              <div class="space-y-3">
                {#each activePalette as color (color.hex)}
                  <div class="bg-surface-900 rounded-lg p-4 border border-zinc-700">
                    <!-- Swatch -->
                    <div class="flex gap-4 items-center mb-3">
                      <div
                        class="w-16 h-16 rounded-lg border border-zinc-600"
                        style="background-color: {color.hex}"
                      ></div>
                      <div class="flex-1">
                        <p class="text-white font-mono font-bold text-lg">
                          {color.hex}
                        </p>
                        <p class="text-zinc-500 text-sm">
                          RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </p>
                      </div>
                    </div>

                    <!-- Values -->
                    <div class="space-y-2 mb-3">
                      <p class="text-zinc-400 text-sm">
                        <span class="text-zinc-500">HSL:</span>
                        {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                      </p>
                    </div>

                    <!-- Copy Buttons -->
                    <div class="grid grid-cols-3 gap-2">
                      <button
                        onclick={() => copyToClipboard(color.hex)}
                        class="bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded text-xs transition {copiedColor ===
                        color.hex
                          ? 'bg-green-600'
                          : ''}"
                      >
                        {copiedColor === color.hex ? 'Copied!' : 'HEX'}
                      </button>
                      <button
                        onclick={() =>
                          copyToClipboard(
                            `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
                          )}
                        class="bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded text-xs transition"
                      >
                        RGB
                      </button>
                      <button
                        onclick={() =>
                          copyToClipboard(
                            `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
                          )}
                        class="bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded text-xs transition"
                      >
                        HSL
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center text-zinc-500 text-sm border-t border-zinc-800 pt-8">
      <p>
        Part of <a href="/tools" class="text-orange-500 hover:text-orange-400 transition">
          ArjoStyle Free Tools
        </a>
      </p>
    </div>
  </div>
</div>
