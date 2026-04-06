<script lang="ts">
	import { onMount } from 'svelte';

	interface PasswordEntry {
		password: string;
		timestamp: Date;
	}

	let length = $state(16);
	let useUppercase = $state(true);
	let useLowercase = $state(true);
	let useNumbers = $state(true);
	let useSymbols = $state(true);
	let excludeAmbiguous = $state(true);

	let password = $state('');
	let passwordHistory: PasswordEntry[] = $state([]);
	let copied = $state(false);
	let bulkCount = $state(5);
	let bulkPasswords: string[] = $state([]);

	type StrengthLevel = 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';

	interface PasswordStats {
		strength: StrengthLevel;
		entropy: number;
		crackTime: string;
	}

	let stats = $state<PasswordStats | null>(null);

	const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
	const NUMBERS = '0123456789';
	const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
	const AMBIGUOUS = 'il1Lo0O';

	function getCharset(): string {
		let charset = '';
		if (useUppercase) charset += UPPERCASE;
		if (useLowercase) charset += LOWERCASE;
		if (useNumbers) charset += NUMBERS;
		if (useSymbols) charset += SYMBOLS;

		if (excludeAmbiguous) {
			charset = charset
				.split('')
				.filter(char => !AMBIGUOUS.includes(char))
				.join('');
		}

		return charset;
	}

	function generatePassword(): string {
		const charset = getCharset();
		if (!charset) return '';

		const passwordArray = new Uint8Array(length);
		crypto.getRandomValues(passwordArray);

		let result = '';
		for (let i = 0; i < length; i++) {
			result += charset[passwordArray[i] % charset.length];
		}

		return result;
	}

	function calculateEntropy(): number {
		const charset = getCharset();
		if (!charset) return 0;
		return length * Math.log2(charset.length);
	}

	function getStrength(entropy: number): StrengthLevel {
		if (entropy < 40) return 'Weak';
		if (entropy < 60) return 'Fair';
		if (entropy < 80) return 'Good';
		if (entropy < 100) return 'Strong';
		return 'Very Strong';
	}

	function estimateCrackTime(entropy: number): string {
		// Assuming 1 trillion guesses per second (modern GPU)
		const guessesPerSecond = 1e12;
		const combinations = Math.pow(2, entropy);
		const secondsNeeded = combinations / (guessesPerSecond * 2); // Average half the combinations

		if (secondsNeeded < 1) return 'Less than a second';
		if (secondsNeeded < 60) return Math.round(secondsNeeded) + ' seconds';
		if (secondsNeeded < 3600) return Math.round(secondsNeeded / 60) + ' minutes';
		if (secondsNeeded < 86400) return Math.round(secondsNeeded / 3600) + ' hours';
		if (secondsNeeded < 31536000) return Math.round(secondsNeeded / 86400) + ' days';
		if (secondsNeeded < 31536000 * 1000) return Math.round(secondsNeeded / 31536000) + ' years';
		return '> 1000 years';
	}

	function updateStats() {
		const entropy = calculateEntropy();
		stats = {
			strength: getStrength(entropy),
			entropy: Math.round(entropy * 10) / 10,
			crackTime: estimateCrackTime(entropy)
		};
	}

	function generateNew() {
		password = generatePassword();
		if (password) {
			passwordHistory.unshift({ password, timestamp: new Date() });
			if (passwordHistory.length > 5) {
				passwordHistory = passwordHistory.slice(0, 5);
			}
		}
		updateStats();
		copied = false;
		bulkPasswords = [];
	}

	async function copyPassword() {
		if (!password) return;
		try {
			await navigator.clipboard.writeText(password);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			alert('Failed to copy');
		}
	}

	function generateBulk() {
		bulkPasswords = Array.from({ length: bulkCount }, () => generatePassword());
	}

	async function copyBulk() {
		try {
			await navigator.clipboard.writeText(bulkPasswords.join('\n'));
			alert('Copied all passwords to clipboard!');
		} catch {
			alert('Failed to copy');
		}
	}

	function getStrengthColor(strength: StrengthLevel): string {
		switch (strength) {
			case 'Weak':
				return 'bg-red-500';
			case 'Fair':
				return 'bg-orange-500';
			case 'Good':
				return 'bg-yellow-500';
			case 'Strong':
				return 'bg-lime-500';
			case 'Very Strong':
				return 'bg-green-500';
			default:
				return 'bg-gray-500';
		}
	}

	function getStrengthTextColor(strength: StrengthLevel): string {
		switch (strength) {
			case 'Weak':
				return 'text-red-500';
			case 'Fair':
				return 'text-orange-500';
			case 'Good':
				return 'text-yellow-500';
			case 'Strong':
				return 'text-lime-500';
			case 'Very Strong':
				return 'text-green-500';
			default:
				return 'text-gray-500';
		}
	}

	onMount(() => {
		generateNew();
	});

	// Reactively generate on option changes
	$effect(() => {
		if (password) {
			updateStats();
		}
	});
</script>

<svelte:head>
	<title>Password Generator - Free Online Tool</title>
	<meta name="description" content="Generate secure random passwords. Customize length, character types, and check strength. Free online password generator." />
</svelte:head>

<div class="min-h-screen bg-surface-900 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-white sm:text-4xl">Password Generator</h1>
			<p class="mt-2 text-zinc-400">Create secure, random passwords instantly.</p>
		</div>

		<div class="space-y-6">
			<!-- Password Display -->
			<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-8">
				<div class="mb-4 text-center">
					<p class="text-zinc-400 text-sm mb-2">Your Password</p>
					<p class="font-mono text-3xl font-bold text-white break-all">{password || '---'}</p>
				</div>

				<div class="flex gap-2 justify-center">
					<button
						onclick={generateNew}
						class="flex-1 rounded-lg bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600 transition-colors"
					>
						Generate
					</button>
					<button
						onclick={copyPassword}
						disabled={!password}
						class="flex-1 rounded-lg bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{copied ? 'Copied!' : 'Copy'}
					</button>
				</div>
			</div>

			<!-- Strength Meter -->
			{#if stats}
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
					<div class="mb-4">
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm font-medium text-zinc-400">Strength</span>
							<span class={`text-sm font-semibold ${getStrengthTextColor(stats.strength)}`}>{stats.strength}</span>
						</div>
						<div class="h-2 bg-zinc-700 rounded-full overflow-hidden">
							<div
								class={`h-full ${getStrengthColor(stats.strength)} transition-all`}
								style={`width: ${Math.min(100, (stats.entropy / 100) * 100)}%`}
							></div>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p class="text-zinc-400 mb-1">Entropy</p>
							<p class="text-white font-semibold">{stats.entropy} bits</p>
						</div>
						<div>
							<p class="text-zinc-400 mb-1">Crack Time (1T guesses/sec)</p>
							<p class="text-white font-semibold">{stats.crackTime}</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Length Slider -->
			<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
				<div class="flex items-center justify-between mb-4">
					<label for="length" class="text-sm font-medium text-zinc-400">Length: <span class="text-white text-lg">{length}</span></label>
				</div>
				<input
					id="length"
					type="range"
					min="8"
					max="128"
					bind:value={length}
					class="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
				/>
				<div class="flex justify-between text-xs text-zinc-500 mt-2">
					<span>8</span>
					<span>128</span>
				</div>
			</div>

			<!-- Character Options -->
			<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
				<h2 class="text-sm font-semibold text-white mb-4">Character Types</h2>
				<div class="space-y-3">
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={useUppercase}
							onchange={() => generateNew()}
							class="w-4 h-4 rounded accent-orange-500 cursor-pointer"
						/>
						<span class="text-sm text-zinc-400">Uppercase (A-Z)</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={useLowercase}
							onchange={() => generateNew()}
							class="w-4 h-4 rounded accent-orange-500 cursor-pointer"
						/>
						<span class="text-sm text-zinc-400">Lowercase (a-z)</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={useNumbers}
							onchange={() => generateNew()}
							class="w-4 h-4 rounded accent-orange-500 cursor-pointer"
						/>
						<span class="text-sm text-zinc-400">Numbers (0-9)</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={useSymbols}
							onchange={() => generateNew()}
							class="w-4 h-4 rounded accent-orange-500 cursor-pointer"
						/>
						<span class="text-sm text-zinc-400">Symbols (!@#$%^&*)</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={excludeAmbiguous}
							onchange={() => generateNew()}
							class="w-4 h-4 rounded accent-orange-500 cursor-pointer"
						/>
						<span class="text-sm text-zinc-400">Exclude Ambiguous (i, l, 1, L, o, 0, O)</span>
					</label>
				</div>
			</div>

			<!-- Bulk Generation -->
			<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
				<h2 class="text-sm font-semibold text-white mb-4">Bulk Generate</h2>
				<div class="flex gap-2 mb-4">
					<select
						bind:value={bulkCount}
						class="rounded-lg bg-zinc-700 border border-zinc-600 px-3 py-2 text-white focus:outline-none focus:border-orange-500"
					>
						<option value={5}>5 passwords</option>
						<option value={10}>10 passwords</option>
						<option value={20}>20 passwords</option>
					</select>
					<button
						onclick={generateBulk}
						class="flex-1 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 transition-colors"
					>
						Generate Bulk
					</button>
				</div>

				{#if bulkPasswords.length > 0}
					<div class="bg-zinc-900 border border-zinc-700/50 rounded-lg p-3 font-mono text-sm text-green-400 max-h-48 overflow-auto mb-3">
						{#each bulkPasswords as pwd}
							<div>{pwd}</div>
						{/each}
					</div>
					<button
						onclick={copyBulk}
						class="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition-colors"
					>
						Copy All
					</button>
				{/if}
			</div>

			<!-- Password History -->
			{#if passwordHistory.length > 0}
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
					<h2 class="text-sm font-semibold text-white mb-4">Recent Passwords</h2>
					<div class="space-y-2">
						{#each passwordHistory as entry}
							<div class="flex items-center justify-between bg-zinc-900 rounded-lg p-3">
								<span class="font-mono text-sm text-green-400 break-all">{entry.password}</span>
								<button
									onclick={() => navigator.clipboard.writeText(entry.password)}
									class="ml-2 px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors flex-shrink-0"
								>
									Copy
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="mt-12 text-center text-zinc-500 text-sm border-t border-zinc-700/50 pt-6">
			<p>
				Part of <a href="/tools" class="text-orange-500 hover:text-orange-400 transition-colors">ArjoStyle Free Tools</a>
			</p>
		</div>
	</div>
</div>
