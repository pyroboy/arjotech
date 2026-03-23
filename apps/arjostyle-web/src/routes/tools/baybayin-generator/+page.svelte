<script lang="ts">
	import { onMount } from 'svelte';

	interface CharMapping {
		latin: string;
		baybayin: string;
	}

	let input = '';
	let canvasElement: HTMLCanvasElement;

	const baybayinMap: Record<string, string> = {
		// Vowels
		a: 'ᜀ',
		e: 'ᜁ',
		i: 'ᜁ',
		o: 'ᜂ',
		u: 'ᜂ',
		// Consonants (with inherent 'a')
		k: 'ᜃ',
		g: 'ᜄ',
		ng: 'ᜅ',
		t: 'ᜆ',
		d: 'ᜇ',
		n: 'ᜈ',
		p: 'ᜉ',
		b: 'ᜊ',
		m: 'ᜋ',
		y: 'ᜌ',
		l: 'ᜍ',
		r: 'ᜍ',
		w: 'ᜎ',
		s: 'ᜏ',
		h: 'ᜐ'
	};

	const vowelMarkUpper = 'ᜒ'; // for i, e
	const vowelMarkLower = 'ᜓ'; // for u, o
	const virama = '᜔'; // cancel vowel / final consonant

	const popularWords = [
		{ latin: 'Pilipinas', baybayin: 'ᜉᜒᜎᜒᜉᜒᜈᜏ᜔' },
		{ latin: 'Maganda', baybayin: 'ᜋᜄᜈ᜔ᜇ' },
		{ latin: 'Mahal', baybayin: 'ᜋᜐᜎ᜔' },
		{ latin: 'Bayani', baybayin: 'ᜊᜌᜈᜒ' },
		{ latin: 'Kalayaan', baybayin: 'ᜃᜎᜌᜀᜈ᜔' },
		{ latin: 'Liwanag', baybayin: 'ᜎᜒᜎᜈᜄ᜔' },
		{ latin: 'Salamat', baybayin: 'ᜏᜎᜋᜆ᜔' },
		{ latin: 'Bahala na', baybayin: 'ᜊᜐᜎ ᜈ' },
		{ latin: 'Mabuhay', baybayin: 'ᜋᜊᜓᜐᜌ᜔' },
		{ latin: 'Lakambini', baybayin: 'ᜎᜃᜋ᜔ᜊᜒᜈᜒ' },
		{ latin: 'Diwata', baybayin: 'ᜇᜒᜎᜆ' },
		{ latin: 'Bathala', baybayin: 'ᜊᜆ᜔ᜐᜎ' },
		{ latin: 'Araw', baybayin: 'ᜀᜍᜎ᜔' },
		{ latin: 'Buwan', baybayin: 'ᜊᜓᜎᜈ᜔' },
		{ latin: 'Tala', baybayin: 'ᜆᜎ' },
		{ latin: 'Ginhawa', baybayin: 'ᜄᜒᜈ᜔ᜐᜎ' },
		{ latin: 'Tagumpay', baybayin: 'ᜆᜄᜓᜋ᜔ᜉᜌ᜔' },
		{ latin: 'Kapayapaan', baybayin: 'ᜃᜉᜌᜉᜀᜈ᜔' },
		{ latin: 'Pag-asa', baybayin: 'ᜉᜄ᜔ᜀᜏ' },
		{ latin: 'Bayanihan', baybayin: 'ᜊᜌᜈᜒᜐᜈ᜔' }
	];

	function transliterateText(text: string): string {
		if (!text) return '';

		const lower = text.toLowerCase();
		let result = '';
		let i = 0;

		while (i < lower.length) {
			const char = lower[i];
			const nextTwo = lower.substring(i, i + 2);
			const nextChar = lower[i + 1];

			// Skip spaces and special chars
			if (char === ' ' || char === '-') {
				result += char;
				i++;
				continue;
			}

			// Handle 'ng' as a single consonant
			if (nextTwo === 'ng' && (i + 2 >= lower.length || !isVowel(lower[i + 2]))) {
				result += baybayinMap['ng'];
				i += 2;
				continue;
			}

			// Handle consonants
			if (isConsonant(char)) {
				result += baybayinMap[char] || '';

				// Look ahead for vowel modifiers
				if (nextChar === 'i' || nextChar === 'e') {
					result += vowelMarkUpper;
					i += 2;
					continue;
				} else if (nextChar === 'u' || nextChar === 'o') {
					result += vowelMarkLower;
					i += 2;
					continue;
				} else if (isVowel(nextChar)) {
					// Consonant followed by 'a' - just use the consonant (inherent 'a')
					i += 2;
					continue;
				} else {
					// Consonant at end or before another consonant - add virama
					result += virama;
					i++;
					continue;
				}
			}

			// Handle standalone vowels
			if (isVowel(char)) {
				result += baybayinMap[char] || '';
				i++;
				continue;
			}

			// Unknown character - skip with suggestion
			i++;
		}

		return result;
	}

	function isVowel(char: string): boolean {
		return ['a', 'e', 'i', 'o', 'u'].includes(char);
	}

	function isConsonant(char: string): boolean {
		return Object.keys(baybayinMap).some((key) => key.length === 1 && key === char);
	}

	function getCharacterMapping(text: string): CharMapping[] {
		const mappings: CharMapping[] = [];
		const lower = text.toLowerCase();
		let i = 0;

		while (i < lower.length) {
			const char = lower[i];
			const nextTwo = lower.substring(i, i + 2);
			const nextChar = lower[i + 1];

			if (char === ' ') {
				i++;
				continue;
			}

			// Handle 'ng'
			if (nextTwo === 'ng' && (i + 2 >= lower.length || !isVowel(lower[i + 2]))) {
				mappings.push({ latin: 'ng', baybayin: baybayinMap['ng'] + virama });
				i += 2;
				continue;
			}

			// Handle consonants with vowels
			if (isConsonant(char)) {
				let fullSyllable = char;
				let baybayin = baybayinMap[char];

				if (nextChar === 'i' || nextChar === 'e') {
					fullSyllable += nextChar;
					baybayin += vowelMarkUpper;
					i += 2;
				} else if (nextChar === 'u' || nextChar === 'o') {
					fullSyllable += nextChar;
					baybayin += vowelMarkLower;
					i += 2;
				} else if (nextChar === 'a') {
					fullSyllable += nextChar;
					// No mark needed for 'a' (inherent)
					i += 2;
				} else {
					baybayin += virama;
					i++;
				}
				mappings.push({ latin: fullSyllable, baybayin });
				continue;
			}

			// Handle standalone vowels
			if (isVowel(char)) {
				mappings.push({ latin: char, baybayin: baybayinMap[char] || '' });
				i++;
				continue;
			}

			i++;
		}

		return mappings;
	}

	let baybayinOutput = $derived(transliterateText(input));
	let characterMappings = $derived(getCharacterMapping(input));

	function fillFromPopular(word: string) {
		input = word;
	}

	function copyBaybayin() {
		navigator.clipboard.writeText(baybayinOutput).then(() => {
			const btn = document.querySelector('[data-copy-btn]') as HTMLButtonElement;
			if (btn) {
				const originalText = btn.textContent;
				btn.textContent = 'Copied!';
				setTimeout(() => {
					btn.textContent = originalText;
				}, 2000);
			}
		});
	}

	function downloadAsImage() {
		if (!baybayinOutput || !canvasElement) return;

		const ctx = canvasElement.getContext('2d');
		if (!ctx) return;

		const width = 800;
		const height = 400;
		canvasElement.width = width;
		canvasElement.height = height;

		// Background
		ctx.fillStyle = '#0f172a';
		ctx.fillRect(0, 0, width, height);

		// Baybayin text
		ctx.font = 'bold 120px "Noto Sans Tagalog", sans-serif';
		ctx.fillStyle = '#f97316';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(baybayinOutput, width / 2, height / 2);

		// Download
		canvasElement.toBlob((blob) => {
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `baybayin-${Date.now()}.png`;
			link.click();
			URL.revokeObjectURL(url);
		});
	}

	onMount(() => {
		canvasElement = document.createElement('canvas');
	});
</script>

<svelte:head>
	<title>Baybayin Generator - Ancient Filipino Script Transliterator</title>
	<meta
		name="description"
		content="Convert Filipino/Tagalog text to Baybayin ancient script. Learn about the traditional writing system."
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tagalog&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen bg-surface-900 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-5xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-white sm:text-4xl">Baybayin Generator</h1>
			<p class="mt-2 text-zinc-400">Convert Filipino text to the ancient Baybayin script</p>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input & Controls -->
			<div class="space-y-6">
				<!-- Text Input -->
				<div>
					<label class="block text-sm font-medium text-white mb-2">Enter Text (Filipino/Tagalog)</label>
					<textarea
						bind:value={input}
						placeholder="Type or paste Filipino text..."
						rows="6"
						class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
					/>
				</div>

				<!-- Popular Words -->
				<div>
					<h3 class="text-sm font-medium text-white mb-3">Popular Words</h3>
					<div class="grid grid-cols-2 gap-2">
						{#each popularWords as word}
							<button
								on:click={() => fillFromPopular(word.latin)}
								class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-orange-500/50 hover:bg-zinc-800 px-3 py-2 text-xs sm:text-sm text-zinc-300 hover:text-orange-400 transition-colors text-left truncate"
								title={word.latin}
							>
								{word.latin}
							</button>
						{/each}
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-2">
					<button
						on:click={copyBaybayin}
						data-copy-btn
						disabled={!baybayinOutput}
						class="flex-1 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 font-medium text-white transition-colors text-sm"
					>
						Copy Baybayin
					</button>
					<button
						on:click={downloadAsImage}
						disabled={!baybayinOutput}
						class="flex-1 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 font-medium text-white transition-colors text-sm"
					>
						Download
					</button>
				</div>
			</div>

			<!-- Output & Info -->
			<div class="space-y-6">
				<!-- Baybayin Display -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-8 min-h-[200px] flex items-center justify-center">
					{#if baybayinOutput}
						<div
							style="font-family: 'Noto Sans Tagalog', sans-serif;"
							class="text-6xl sm:text-7xl text-orange-500 text-center leading-relaxed break-words"
						>
							{baybayinOutput}
						</div>
					{:else}
						<p class="text-center text-zinc-500">Your Baybayin text will appear here...</p>
					{/if}
				</div>

				<!-- Character Breakdown -->
				{#if characterMappings.length > 0}
					<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 overflow-hidden">
						<div class="px-4 py-3 border-b border-zinc-700/50 bg-zinc-800">
							<h3 class="text-sm font-medium text-white">Character Mapping</h3>
						</div>
						<div class="max-h-64 overflow-y-auto">
							<div class="divide-y divide-zinc-700/50">
								{#each characterMappings as mapping}
									<div class="px-4 py-3 flex items-center justify-between text-sm">
										<span class="text-zinc-400 font-mono">{mapping.latin}</span>
										<span class="text-orange-500" style="font-family: 'Noto Sans Tagalog', sans-serif;">
											{mapping.baybayin}
										</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Education -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-4">
					<h3 class="text-sm font-medium text-white mb-2">What is Baybayin?</h3>
					<p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">
						Baybayin (also known as Alibata) is an ancient script used by pre-colonial Filipinos to write
						their indigenous languages. It was one of the first writing systems in Southeast Asia. Today,
						Baybayin is experiencing a cultural revival, being used in tattoos, artwork, and cultural
						expressions across the Philippines and the diaspora.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<div class="mt-12 text-center text-zinc-500 text-sm border-t border-zinc-700/50 pt-6">
		<p>
			Part of <a href="/tools" class="text-orange-500 hover:text-orange-400 transition-colors"
				>ArjoStyle Free Tools</a
			>
		</p>
	</div>
</div>

<canvas bind:this={canvasElement} class="hidden" />
