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

<div class="min-h-screen px-4 py-8 sm:px-6 lg:px-8" style="background-color: var(--bg-dark);">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8">
			<div class="mb-3">
				<a href="/tools" class="text-mono-label hover:text-ink transition-colors">← ALL TOOLS</a>
			</div>
			<p class="text-mono-label mb-2">DEVELOPER TOOL</p>
			<h1 class="font-display text-display-sm text-white tracking-wide">PASSWORD GENERATOR</h1>
			<p class="mt-2 text-sm" style="color: var(--text-secondary);">Create secure, random passwords instantly.</p>
		</div>

		<div class="space-y-6">
			<!-- Password Display -->
			<div class="brutal-card p-8">
				<div class="mb-4 text-center">
					<p class="text-sm mb-2 font-mono" style="color: var(--text-secondary);">Your Password</p>
					<p class="font-mono text-3xl font-bold text-white break-all">{password || '---'}</p>
				</div>

				<div class="flex gap-2 justify-center">
					<button
						onclick={generateNew}
						class="brutal-btn brutal-btn-ink flex-1"
					>
						GENERATE
					</button>
					<button
						onclick={copyPassword}
						disabled={!password}
						class="brutal-btn brutal-btn-ink flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{copied ? 'COPIED!' : 'COPY'}
					</button>
				</div>
			</div>

			<!-- Strength Meter -->
			{#if stats}
				<div class="brutal-card p-6">
					<div class="mb-4">
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm font-medium" style="color: var(--text-secondary);">Strength</span>
							<span class={`text-sm font-semibold`} style={stats.strength === 'Weak' ? 'color: var(--red);' : stats.strength === 'Fair' ? 'color: #f97316;' : stats.strength === 'Good' ? 'color: #eab308;' : 'color: #22c55e;'}>{stats.strength}</span>
						</div>
						<div class="h-2 w-full" style="background-color: var(--bg-dark);">
							<div
								class="h-full transition-all"
								style={`width: ${Math.min(100, (stats.entropy / 100) * 100)}%; ${stats.strength === 'Weak' ? 'background-color: var(--red);' : stats.strength === 'Fair' ? 'background-color: #f97316;' : stats.strength === 'Good' ? 'background-color: #eab308;' : stats.strength === 'Strong' ? 'background-color: #84cc16;' : 'background-color: #22c55e;'}`}
							></div>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p class="mb-1 font-mono" style="color: var(--text-secondary);">Entropy</p>
							<p class="text-white font-semibold">{stats.entropy} bits</p>
						</div>
						<div>
							<p class="mb-1 font-mono" style="color: var(--text-secondary);">Crack Time (1T/sec)</p>
							<p class="text-white font-semibold">{stats.crackTime}</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Length Slider -->
			<div class="brutal-card p-6">
				<div class="flex items-center justify-between mb-4">
					<label for="length" class="text-sm font-medium" style="color: var(--text-secondary);">Length: <span class="text-white text-lg">{length}</span></label>
				</div>
				<input
					id="length"
					type="range"
					min="8"
					max="128"
					bind:value={length}
					class="w-full h-2 appearance-none cursor-pointer"
					style="background-color: var(--bg-dark); accent-color: var(--ink);"
				/>
				<div class="flex justify-between text-xs mt-2 font-mono" style="color: var(--text-muted);">
					<span>8</span>
					<span>128</span>
				</div>
			</div>

			<!-- Character Options -->
			<div class="brutal-card p-6">
				<h2 class="text-sm font-semibold text-white mb-4">CHARACTER TYPES</h2>
				<div class="space-y-3">
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={useUppercase}
							onchange={() => generateNew()}
							class="w-4 h-4 cursor-pointer"
							style="accent-color: var(--ink);"
						/>
						<span class="text-sm" style="color: var(--text-secondary);">Uppercase (A-Z)</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={useLowercase}
							onchange={() => generateNew()}
							class="w-4 h-4 cursor-pointer"
							style="accent-color: var(--ink);"
						/>
						<span class="text-sm" style="color: var(--text-secondary);">Lowercase (a-z)</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={useNumbers}
							onchange={() => generateNew()}
							class="w-4 h-4 cursor-pointer"
							style="accent-color: var(--ink);"
						/>
						<span class="text-sm" style="color: var(--text-secondary);">Numbers (0-9)</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={useSymbols}
							onchange={() => generateNew()}
							class="w-4 h-4 cursor-pointer"
							style="accent-color: var(--ink);"
						/>
						<span class="text-sm" style="color: var(--text-secondary);">Symbols (!@#$%^&*)</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={excludeAmbiguous}
							onchange={() => generateNew()}
							class="w-4 h-4 cursor-pointer"
							style="accent-color: var(--ink);"
						/>
						<span class="text-sm" style="color: var(--text-secondary);">Exclude Ambiguous (i, l, 1, L, o, 0, O)</span>
					</label>
				</div>
			</div>

			<!-- Bulk Generation -->
			<div class="brutal-card p-6">
				<h2 class="text-sm font-semibold text-white mb-4">BULK GENERATE</h2>
				<div class="flex gap-2 mb-4">
					<select
						bind:value={bulkCount}
						class="brutal-input flex-1"
					>
						<option value={5}>5 passwords</option>
						<option value={10}>10 passwords</option>
						<option value={20}>20 passwords</option>
					</select>
					<button
						onclick={generateBulk}
						class="brutal-btn brutal-btn-ink flex-1"
					>
						GENERATE BULK
					</button>
				</div>

				{#if bulkPasswords.length > 0}
					<div class="p-3 font-mono text-sm max-h-48 overflow-auto mb-3" style="background-color: var(--bg-dark); border: 1px solid var(--border); color: #22c55e;">
						{#each bulkPasswords as pwd}
							<div>{pwd}</div>
						{/each}
					</div>
					<button
						onclick={copyBulk}
						class="brutal-btn brutal-btn-primary w-full"
					>
						COPY ALL
					</button>
				{/if}
			</div>

			<!-- Password History -->
			{#if passwordHistory.length > 0}
				<div class="brutal-card p-6">
					<h2 class="text-sm font-semibold text-white mb-4">RECENT PASSWORDS</h2>
					<div class="space-y-2">
						{#each passwordHistory as entry}
							<div class="flex items-center justify-between p-3" style="background-color: var(--bg-dark); border: 1px solid var(--border);">
								<span class="font-mono text-sm break-all" style="color: #22c55e;">{entry.password}</span>
								<button
									onclick={() => navigator.clipboard.writeText(entry.password)}
									class="brutal-btn brutal-btn-secondary text-xs flex-shrink-0 ml-2"
								>
									COPY
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="mt-12 text-center text-sm pt-6" style="border-top: 1px solid var(--border);">
			<p style="color: var(--text-muted);">
				Part of <a href="/tools" style="color: var(--ink);" class="hover:opacity-80 transition-colors">ArjoStyle Free Tools</a>
			</p>
		</div>
	</div>
</div>
