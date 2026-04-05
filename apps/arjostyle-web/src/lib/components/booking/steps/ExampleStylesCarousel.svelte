<script lang="ts">
	import { TATTOO_STYLES, STYLE_CATEGORIES } from '$data/tattooStyleOptions';
	import type { TattooStyle } from '$data/tattooStyleOptions';
	import { HelpCircle, Grid, Search } from 'lucide-svelte';

	interface Props {
		selectedStyle?: string;
		onStyleSelect?: (styleId: string) => void;
	}

	let { selectedStyle = $bindable(''), onStyleSelect }: Props = $props();

	let showGallery = $state(false);
	let activeCategory = $state<string>('All');
	let searchQuery = $state('');
	let imageErrors = $state<Record<string, boolean>>({});

	const filteredStyles = $derived.by(() => {
		let styles = activeCategory === 'All'
			? TATTOO_STYLES
			: TATTOO_STYLES.filter((s) => s.category === activeCategory);
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			styles = styles.filter((s) =>
				s.name.toLowerCase().includes(q) ||
				s.description?.toLowerCase().includes(q) ||
				s.category?.toLowerCase().includes(q) ||
				s.tags?.some((t) => t.toLowerCase().includes(q))
			);
		}
		return styles;
	});

	// Get matched tags for display
	function getMatchedTags(style: TattooStyle): string[] {
		if (!searchQuery.trim()) return [];
		const q = searchQuery.toLowerCase().trim();
		return (style.tags ?? []).filter((t: string) => t.toLowerCase().includes(q)).slice(0, 3);
	}

	function handleImageError(styleId: string) {
		imageErrors[styleId] = true;
	}

	function handleStyleClick(styleId: string) {
		selectedStyle = styleId;
		onStyleSelect?.(styleId);
	}

	// Portal action: moves element to document.body to escape overflow-hidden containers
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}
</script>

<!-- Style selection trigger -->
{#if selectedStyle && selectedStyle !== ''}
	{@const selected = TATTOO_STYLES.find((s) => s.id === selectedStyle)}
	<button
		type="button"
		class="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-700 hover:border-ink-500/50 transition-all text-left"
		onclick={() => (showGallery = true)}
	>
		{#if selected?.imageUrl && selected.id !== 'not-sure'}
			<img
				src={selected.imageUrl}
				alt={selected.name}
				class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
			/>
		{:else}
			<div
				class="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0"
			>
				<HelpCircle size={20} class="text-zinc-400" />
			</div>
		{/if}
		<div class="flex-1 min-w-0">
			<p class="text-sm font-medium text-white truncate">{selected?.name ?? 'Not sure yet'}</p>
			<p class="text-[10px] text-zinc-400 truncate">{selected?.description ?? ''}</p>
		</div>
		<span class="text-xs text-ink-400 flex-shrink-0">Change</span>
	</button>
{:else}
	<button
		type="button"
		class="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-zinc-700 hover:border-ink-500/50 hover:bg-ink-500/5 transition-all"
		onclick={() => (showGallery = true)}
	>
		<Grid size={18} class="text-zinc-400" />
		<span class="text-sm font-medium text-zinc-300">Browse Tattoo Styles</span>
	</button>
{/if}

<!-- Full-screen style gallery overlay -->
{#if showGallery}
	<div use:portal class="fixed inset-0 z-[200] bg-surface-900/95 backdrop-blur-sm flex flex-col">
		<!-- Gallery header -->
		<div class="flex-shrink-0 px-4 sm:px-6 py-3 border-b border-zinc-800 space-y-3">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-bold text-white">Choose Your Style</h2>
				<button
					type="button"
					class="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
					onclick={() => (showGallery = false)}
				>&#10005;</button>
			</div>
			<!-- Search bar -->
			<div class="relative">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
				<input
					type="text"
					class="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg pl-9 pr-3 py-2 text-sm placeholder-zinc-500 focus:border-ink-500 focus:outline-none transition-colors"
					placeholder="Search styles... (e.g., bold, minimal, color)"
					bind:value={searchQuery}
				/>
			</div>
			{#if searchQuery.trim()}
				<div class="flex items-center gap-2 flex-wrap">
					<span class="text-[10px] text-zinc-500">{filteredStyles.length} result{filteredStyles.length !== 1 ? 's' : ''} for</span>
					<span class="text-[10px] bg-ink-500/15 text-ink-400 px-2 py-0.5 rounded-full">"{searchQuery.trim()}"</span>
					{#if filteredStyles.length > 0}
						<span class="text-[10px] text-zinc-600">—</span>
						{#each [...new Set(filteredStyles.map(s => s.category))].slice(0, 3) as cat}
							<span class="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{cat}</span>
						{/each}
					{/if}
				</div>
			{/if}
		</div>

		<!-- Category filter tabs -->
		<div class="flex-shrink-0 px-4 sm:px-6 py-3 overflow-x-auto">
			<div class="flex gap-2">
				{#each STYLE_CATEGORIES as cat}
					<button
						type="button"
						class="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
							{activeCategory === cat
							? 'bg-ink-500 text-white'
							: 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}"
						onclick={() => (activeCategory = cat)}
					>
						{cat}
					</button>
				{/each}
			</div>
		</div>

		<!-- Gallery grid (scrollable) -->
		<div class="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
				{#each filteredStyles as style (style.id)}
					<button
						type="button"
						class="group relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all
							{selectedStyle === style.id
							? 'border-ink-500 ring-2 ring-ink-500/30 shadow-lg shadow-ink-500/20'
							: 'border-transparent hover:border-zinc-600'}"
						onclick={() => {
							handleStyleClick(style.id);
							showGallery = false;
						}}
					>
						{#if style.id === 'not-sure' || !style.imageUrl}
							<!-- "Not Sure" card -->
							<div
								class="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-800 flex flex-col items-center justify-center gap-2 p-4"
							>
								<HelpCircle size={32} class="text-zinc-400" />
								<span class="text-sm font-medium text-zinc-300 text-center">{style.name}</span>
								<span class="text-[10px] text-zinc-500 text-center">{style.description}</span>
							</div>
						{:else}
							{#if imageErrors[style.id]}
								<div
									class="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center"
								>
									<span class="text-3xl font-bold text-zinc-300">{style.name.charAt(0)}</span>
								</div>
							{:else}
								<img
									src={style.imageUrl}
									alt={style.name}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									onerror={() => handleImageError(style.id)}
								/>
							{/if}
							<!-- Name overlay at bottom -->
							<div
								class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8"
							>
								<p class="text-sm font-medium text-white">{style.name}</p>
								<p class="text-[10px] text-zinc-300 line-clamp-2">{style.description}</p>
								{#if searchQuery.trim()}
									<div class="flex flex-wrap gap-1 mt-1">
										{#each getMatchedTags(style) as tag}
											<span class="text-[8px] bg-ink-500/20 text-ink-400 px-1.5 py-0.5 rounded">{tag}</span>
										{/each}
									</div>
								{/if}
							</div>
						{/if}

						<!-- Selected checkmark -->
						{#if selectedStyle === style.id}
							<div
								class="absolute top-2 right-2 w-6 h-6 bg-ink-500 rounded-full flex items-center justify-center"
							>
								<span class="text-white text-xs font-bold">&#10003;</span>
							</div>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}
