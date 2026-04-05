<script lang="ts">
	import { onMount } from 'svelte';

	let input = $state('{}');
	let output = $state('');
	let error = $state('');
	let indentSize: 2 | 4 = $state(2);
	let useSpaces = $state(true);
	let showStats = $state(false);

	interface JsonStats {
		characters: number;
		lines: number;
		keys: number;
		depth: number;
	}

	let stats: JsonStats | null = $state(null);

	function tryParseJSON(str: string): any {
		try {
			return JSON.parse(str);
		} catch {
			return null;
		}
	}

	function countKeys(obj: any): number {
		if (typeof obj !== 'object' || obj === null) return 0;
		let count = 0;
		if (Array.isArray(obj)) {
			for (const item of obj) {
				count += countKeys(item);
			}
		} else {
			count = Object.keys(obj).length;
			for (const value of Object.values(obj)) {
				count += countKeys(value);
			}
		}
		return count;
	}

	function getMaxDepth(obj: any, currentDepth = 0): number {
		if (typeof obj !== 'object' || obj === null) return currentDepth;
		let maxDepth = currentDepth;
		if (Array.isArray(obj)) {
			for (const item of obj) {
				maxDepth = Math.max(maxDepth, getMaxDepth(item, currentDepth + 1));
			}
		} else {
			for (const value of Object.values(obj)) {
				maxDepth = Math.max(maxDepth, getMaxDepth(value, currentDepth + 1));
			}
		}
		return maxDepth;
	}

	function format() {
		error = '';
		const parsed = tryParseJSON(input);

		if (parsed === null) {
			error = 'Invalid JSON - unable to parse';
			output = '';
			stats = null;
			return;
		}

		const indent = useSpaces ? ' '.repeat(indentSize) : '\t';
		output = JSON.stringify(parsed, null, indent);
		showStats = true;

		// Calculate stats
		stats = {
			characters: output.length,
			lines: output.split('\n').length,
			keys: countKeys(parsed),
			depth: getMaxDepth(parsed)
		};
	}

	function minify() {
		error = '';
		const parsed = tryParseJSON(input);

		if (parsed === null) {
			error = 'Invalid JSON - unable to parse';
			output = '';
			stats = null;
			return;
		}

		output = JSON.stringify(parsed);
		showStats = true;

		stats = {
			characters: output.length,
			lines: 1,
			keys: countKeys(parsed),
			depth: getMaxDepth(parsed)
		};
	}

	function validate() {
		error = '';
		const parsed = tryParseJSON(input);

		if (parsed === null) {
			error = 'Invalid JSON - syntax error';
			output = '';
			stats = null;
		} else {
			error = '';
			output = 'Valid JSON!';
			stats = {
				characters: input.length,
				lines: input.split('\n').length,
				keys: countKeys(parsed),
				depth: getMaxDepth(parsed)
			};
		}
	}

	function clear() {
		input = '';
		output = '';
		error = '';
		stats = null;
		showStats = false;
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(output);
			alert('Copied to clipboard!');
		} catch {
			alert('Failed to copy');
		}
	}

	async function pasteFromClipboard() {
		try {
			const text = await navigator.clipboard.readText();
			input = text;
			format();
		} catch {
			alert('Failed to paste from clipboard');
		}
	}

	function highlightJSON(json: string): string {
		return json
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
				let cls = 'number';
				if (/^"/.test(match)) {
					if (/:$/.test(match)) {
						cls = 'key';
					} else {
						cls = 'string';
					}
				} else if (/true|false/.test(match)) {
					cls = 'boolean';
				} else if (/null/.test(match)) {
					cls = 'null';
				}
				return `<span class="json-${cls}">${match}</span>`;
			});
	}

	onMount(() => {
		format();
	});
</script>

<svelte:head>
	<title>JSON Formatter - Free Online Tool</title>
	<meta name="description" content="Format, minify, validate, and syntax highlight JSON. Free online JSON formatter and validator." />
</svelte:head>

<div class="min-h-screen bg-surface-900 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-white sm:text-4xl">JSON Formatter & Validator</h1>
			<p class="mt-2 text-zinc-400">Format, minify, validate, and highlight JSON data.</p>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input Section -->
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold text-white">Input</h2>
					<button
						onclick={pasteFromClipboard}
						class="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700 transition-colors"
					>
						Paste from Clipboard
					</button>
				</div>
				<textarea
					bind:value={input}
					placeholder={'{"key": "value"}'}
					rows="20"
					class="w-full rounded-lg bg-zinc-900 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none font-mono text-sm"
				></textarea>
			</div>

			<!-- Output Section -->
			<div class="space-y-3">
				<h2 class="text-lg font-semibold text-white">Output</h2>

				{#if error}
					<div class="rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-400">
						<p class="font-medium">Error:</p>
						<p>{error}</p>
					</div>
				{/if}

				{#if output}
					<div class="rounded-lg bg-zinc-900 border border-zinc-700/50 px-3 py-2 text-white font-mono text-sm min-h-96 max-h-96 overflow-auto whitespace-pre-wrap break-words">
						{#if output === 'Valid JSON!'}
							<p class="text-green-400">{output}</p>
						{:else}
							<!-- Syntax highlighting -->
							<div class="json-output">
								{@html highlightJSON(output)}
							</div>
						{/if}
					</div>
				{/if}

				<!-- Stats -->
				{#if stats && showStats}
					<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-3 grid grid-cols-2 gap-2 text-xs">
						<div>
							<p class="text-zinc-400">Characters</p>
							<p class="text-white font-semibold">{stats.characters}</p>
						</div>
						<div>
							<p class="text-zinc-400">Lines</p>
							<p class="text-white font-semibold">{stats.lines}</p>
						</div>
						<div>
							<p class="text-zinc-400">Keys</p>
							<p class="text-white font-semibold">{stats.keys}</p>
						</div>
						<div>
							<p class="text-zinc-400">Depth</p>
							<p class="text-white font-semibold">{stats.depth}</p>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Controls -->
		<div class="mt-8 space-y-4">
			<!-- Indent Options -->
			<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-4">
				<h3 class="text-sm font-semibold text-white mb-3">Indent Options</h3>
				<div class="flex flex-wrap gap-3">
					<label class="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer hover:text-zinc-300">
						<input type="radio" bind:group={useSpaces} value={true} class="accent-orange-500" />
						Spaces
					</label>
					<label class="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer hover:text-zinc-300">
						<input type="radio" bind:group={useSpaces} value={false} class="accent-orange-500" />
						Tabs
					</label>
					{#if useSpaces}
						<select
							bind:value={indentSize}
							class="ml-auto rounded bg-zinc-700 border border-zinc-600 px-2 py-1 text-sm text-white focus:outline-none focus:border-orange-500"
						>
							<option value={2}>2 spaces</option>
							<option value={4}>4 spaces</option>
						</select>
					{/if}
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<button
					onclick={format}
					class="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 transition-colors"
				>
					Format
				</button>
				<button
					onclick={minify}
					class="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 transition-colors"
				>
					Minify
				</button>
				<button
					onclick={validate}
					class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
				>
					Validate
				</button>
				<button
					onclick={clear}
					class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 transition-colors"
				>
					Clear
				</button>
			</div>

			<!-- Copy Button -->
			{#if output && output !== 'Valid JSON!'}
				<button
					onclick={copy}
					class="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition-colors"
				>
					Copy Output
				</button>
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

<style>
	:global(.json-output) {
		white-space: pre-wrap;
		word-break: break-word;
	}

	:global(.json-key) {
		color: rgb(96, 165, 250); /* blue */
	}

	:global(.json-string) {
		color: rgb(134, 239, 172); /* green */
	}

	:global(.json-number) {
		color: rgb(251, 146, 60); /* orange */
	}

	:global(.json-boolean) {
		color: rgb(217, 70, 239); /* purple */
	}

	:global(.json-null) {
		color: rgb(156, 163, 175); /* gray */
	}
</style>
