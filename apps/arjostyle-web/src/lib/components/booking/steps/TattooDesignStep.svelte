<script lang="ts">
	import type { BookingFormData } from '$types/bookings';
	import { defaultBodyPartMappings } from '$data/defaultMappings';
	import { SIZE_CATEGORIES, sizeCategoryToSqInches, getPriceRange } from '$data/sizeCategoryMap';
	import ExampleStylesCarousel from './ExampleStylesCarousel.svelte';
	import { Sparkles, Search, ExternalLink, Pencil, Palette } from 'lucide-svelte';
	import { onDestroy } from 'svelte';

	interface Props {
		formData: BookingFormData;
		updateFormData: (data: Partial<BookingFormData>) => void;
	}

	let { formData, updateFormData }: Props = $props();

	// Body placement state – initialised once from the prop; user interactions update it afterwards
	// svelte-ignore state_referenced_locally
	let selectedRegion = $state<string | null>(formData.bodyRegion ?? null);

	let regions = $derived(Object.keys(defaultBodyPartMappings));
	let placements = $derived(
		selectedRegion ? Object.keys(defaultBodyPartMappings[selectedRegion] ?? {}) : []
	);

	// Additional areas toggle
	let showAdditionalAreas = $state(false);

	// Inspiration search
	let showInspiration = $state(false);
	let showInspirationModal = $state(false);
	let inspirationQuery = $derived.by(() => {
		const style = formData.primaryTattooStyle && formData.primaryTattooStyle !== 'not-sure'
			? formData.primaryTattooStyle : '';
		const placement = formData.bodyArea ?? '';
		const parts = [placement, style, 'tattoo'].filter(Boolean);
		return parts.join(' ');
	});
	let customQuery = $state('');

	function getSearchQuery() {
		return customQuery || inspirationQuery;
	}

	let showSearchTip = $state(false);

	let searchTipPlatform = $state('');
	let pendingSearchUrl = $state('');

	function openSearch(platform: 'google' | 'pinterest' | 'instagram') {
		const q = encodeURIComponent(getSearchQuery());
		const urls = {
			google: `https://www.google.com/search?q=${q}&tbm=isch`,
			pinterest: `https://www.pinterest.com/search/pins/?q=${q}`,
			instagram: `https://www.instagram.com/explore/tags/${q.replace(/\s+/g, '')}`,
		};
		const platformNames = { google: 'Google Images', pinterest: 'Pinterest', instagram: 'Instagram' };
		searchTipPlatform = platformNames[platform];
		pendingSearchUrl = urls[platform];
		showSearchTip = true;
	}

	let portalEl: HTMLDivElement | null = null;

	function confirmAndOpenSearch() {
		removePortal();
		if (pendingSearchUrl) {
			window.open(pendingSearchUrl, '_blank', 'noopener');
			pendingSearchUrl = '';
		}
	}

	function removePortal() {
		showSearchTip = false;
		if (portalEl && portalEl.parentNode) {
			portalEl.parentNode.removeChild(portalEl);
			portalEl = null;
		}
	}

	$effect(() => {
		if (showSearchTip && typeof document !== 'undefined') {
			portalEl = document.createElement('div');
			portalEl.innerHTML = `
				<div style="position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:1.5rem;">
					<div id="portal-backdrop" style="position:absolute;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);cursor:pointer;"></div>
					<div style="position:relative;z-index:10;background:#18181b;border:1px solid rgba(16,185,129,0.3);border-radius:1rem;padding:1.5rem;max-width:20rem;width:100%;text-align:center;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
						<div style="width:3.5rem;height:3.5rem;margin:0 auto 1rem;border-radius:50%;background:rgba(16,185,129,0.15);display:flex;align-items:center;justify-content:center;">
							<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
						</div>
						<h3 style="font-size:1.125rem;font-weight:700;color:white;margin-bottom:0.5rem;">Before you go to ${searchTipPlatform}</h3>
						<p style="font-size:0.875rem;color:#d4d4d8;margin-bottom:0.25rem;">Screenshot or save images you like!</p>
						<p style="font-size:0.75rem;color:#71717a;margin-bottom:1rem;">Then come back to this tab and upload them as references. No rush — finish your booking when you're ready.</p>
						<button id="portal-got-it-btn" style="width:100%;padding:0.75rem;border-radius:0.75rem;background:#10b981;color:white;font-size:0.875rem;font-weight:700;border:none;cursor:pointer;">
							Got It — Open ${searchTipPlatform}
						</button>
						<button id="portal-cancel-btn" style="width:100%;padding:0.5rem;margin-top:0.5rem;border-radius:0.75rem;background:transparent;color:#71717a;font-size:0.75rem;border:1px solid #3f3f46;cursor:pointer;">
							Cancel
						</button>
					</div>
				</div>
			`;
			document.body.appendChild(portalEl);
			portalEl.querySelector('#portal-got-it-btn')?.addEventListener('click', confirmAndOpenSearch);
			portalEl.querySelector('#portal-cancel-btn')?.addEventListener('click', removePortal);
			portalEl.querySelector('#portal-backdrop')?.addEventListener('click', removePortal);
		}
	});

	onDestroy(removePortal);

	// Auto-update custom query when placement/style changes
	$effect(() => {
		if (inspirationQuery) customQuery = inspirationQuery;
	});

	// Creative freedom options
	const creativeFreedomOptions = [
		{ label: 'Exactly as I described', value: 0, icon: Pencil },
		{ label: 'Add your artistic touch', value: 50, icon: Palette },
		{ label: 'Surprise me!', value: 100, icon: Sparkles }
	] as const;

	// Cover-up photo upload
	let coverUpUploading = $state(false);
	let coverUpUploadError = $state('');

	async function handleCoverUpUpload(files: FileList | null) {
		if (!files) return;
		coverUpUploadError = '';
		for (const file of Array.from(files)) {
			if ((formData.coverUpPhoto ?? []).length >= 2) {
				coverUpUploadError = 'Maximum 2 images allowed';
				break;
			}
			if (file.size > 5 * 1024 * 1024) {
				coverUpUploadError = `${file.name} is too large (max 5MB)`;
				continue;
			}
			coverUpUploading = true;
			try {
				const fd = new FormData();
				fd.append('file', file);
				const res = await fetch('/api/upload', { method: 'POST', body: fd });
				if (res.ok) {
					const { url } = await res.json();
					const current = formData.coverUpPhoto ?? [];
					updateFormData({ coverUpPhoto: [...current, url] });
				} else {
					coverUpUploadError = 'Upload failed. Please try again.';
				}
			} catch {
				coverUpUploadError = 'Upload failed. Please try again.';
			} finally {
				coverUpUploading = false;
			}
		}
	}

	function removeCoverUpImage(index: number) {
		const newImages = (formData.coverUpPhoto ?? []).filter((_, i) => i !== index);
		updateFormData({ coverUpPhoto: newImages });
	}

	// Reference image upload
	let uploading = $state(false);
	let uploadError = $state('');

	// Live price estimate based on current selections
	const priceRange = $derived(getPriceRange(formData.sizeCategory ?? null, formData.isColor, formData.isCoverUp));

	function selectRegion(region: string) {
		selectedRegion = region;
		// Auto-select the first body part so the 3D model always responds
		const parts = Object.keys(defaultBodyPartMappings[region] ?? {});
		if (parts.length > 0) {
			selectPlacement(parts[0]);
		}
	}

	function selectPlacement(area: string) {
		if (!selectedRegion) return;
		const mapping = defaultBodyPartMappings[selectedRegion]?.[area];
		if (!mapping) return;

		const placementKeys = Object.keys(defaultBodyPartMappings[selectedRegion]);
		const index = placementKeys.indexOf(area);

		updateFormData({
			bodyRegion: selectedRegion,
			bodyArea: area,
			selectedCategory: selectedRegion,
			currentPlacement: area,
			placementIndex: index,
			placementSliderTouched: true,
			painLevel: mapping.placementPainInfo?.level,
			painReason: mapping.placementPainInfo?.reason
		});
	}

	function selectSize(id: string) {
		updateFormData({
			sizeCategory: id,
			size: sizeCategoryToSqInches(id),
			sizeSliderTouched: true
		});
	}

	async function handleFileUpload(files: FileList | null) {
		if (!files) return;
		uploadError = '';

		for (const file of Array.from(files)) {
			if (formData.referenceImages.length >= 3) {
				uploadError = 'Maximum 3 images allowed';
				break;
			}
			if (file.size > 5 * 1024 * 1024) {
				uploadError = `${file.name} is too large (max 5MB)`;
				continue;
			}

			uploading = true;
			try {
				const fd = new FormData();
				fd.append('file', file);
				const res = await fetch('/api/upload', { method: 'POST', body: fd });
				if (res.ok) {
					const { url } = await res.json();
					const newImages = [...formData.referenceImages];
					if (typeof newImages[0] === 'string') {
						newImages.push(url);
					} else {
						updateFormData({ referenceImages: [url] });
						return;
					}
					updateFormData({ referenceImages: newImages });
				} else {
					uploadError = 'Upload failed. Please try again.';
				}
			} catch {
				uploadError = 'Upload failed. Please try again.';
			} finally {
				uploading = false;
			}
		}
	}

	function removeImage(index: number) {
		const newImages = formData.referenceImages.filter((_, i) => i !== index);
		updateFormData({ referenceImages: newImages });
	}

	// Section pagination — 5 distinct sections
	const sections = [
		{ id: 'start', label: 'Start' },
		{ id: 'style', label: 'Style' },
		{ id: 'placement', label: 'Where' },
		{ id: 'size', label: 'Size' },
		{ id: 'price', label: 'Price' },
		{ id: 'color', label: 'Color' },
		{ id: 'details', label: 'Vision' },
		{ id: 'freedom', label: 'Creativity' },
		{ id: 'refs', label: 'Refs' },
	];
	let activeSection = $state(0);
	let scrollContainerEl: HTMLDivElement;

	function scrollToSection(index: number) {
		const el = document.getElementById(`section-${sections[index].id}`);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	// Track scroll via scroll event on the nearest scrollable parent
	function setupScrollTracking() {
		if (typeof window === 'undefined') return;
		let scrollParent = scrollContainerEl?.parentElement;
		while (scrollParent && scrollParent.scrollHeight <= scrollParent.clientHeight) {
			scrollParent = scrollParent.parentElement;
		}
		if (!scrollParent) return;

		scrollParent.addEventListener('scroll', () => {
			const parentRect = scrollParent!.getBoundingClientRect();
			const checkY = parentRect.top + parentRect.height * 0.3;
			let closest = 0;
			let closestDist = Infinity;
			for (let i = 0; i < sections.length; i++) {
				const el = document.getElementById(`section-${sections[i].id}`);
				if (!el) continue;
				const rect = el.getBoundingClientRect();
				const dist = Math.abs(rect.top - checkY);
				if (rect.top <= checkY + 50 && dist < closestDist) {
					closestDist = dist;
					closest = i;
				}
			}
			activeSection = closest;
		}, { passive: true });
	}

	$effect(() => {
		if (scrollContainerEl) setupScrollTracking();
	});
</script>

<!-- Section dot indicators -->
<div class="sticky top-0 z-30 bg-surface-900/90 backdrop-blur-sm pb-2 pt-1 px-2 -mx-4 sm:-mx-6">
	<div class="flex items-center justify-center gap-1">
		{#each sections as sec, i}
			<button
				type="button"
				class="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-medium transition-all
					{activeSection === i ? 'bg-ink-500/20 text-ink-400' : 'text-zinc-600 hover:text-zinc-400'}"
				onclick={() => scrollToSection(i)}
			>
				<span class="w-1.5 h-1.5 rounded-full transition-colors {activeSection === i ? 'bg-ink-500' : 'bg-zinc-700'}"></span>
				{#if activeSection === i}
					<span>{sec.label}</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<div bind:this={scrollContainerEl} class="py-4 space-y-8 max-w-2xl mx-auto">
	<!-- Section 0: First Tattoo? -->
	<div id="section-start" class="border-b border-zinc-800 pb-6 scroll-mt-12" style="scroll-snap-align: start;">
		<h3 class="booking-section-title mb-4">Is this your first tattoo?</h3>
		<div class="flex gap-3">
			<button
				type="button"
				class="flex-1 py-3 rounded-xl text-sm font-medium transition-all
					{formData.firstTattoo === true
						? 'bg-ink-500 text-white shadow-lg shadow-ink-500/25 ring-2 ring-ink-500/50'
						: 'bg-surface-900 text-slate-300 border border-zinc-700 hover:border-zinc-500'}"
				onclick={() => updateFormData({ firstTattoo: true })}
			>
				Yes, first time!
			</button>
			<button
				type="button"
				class="flex-1 py-3 rounded-xl text-sm font-medium transition-all
					{formData.firstTattoo === false
						? 'bg-ink-500 text-white shadow-lg shadow-ink-500/25 ring-2 ring-ink-500/50'
						: 'bg-surface-900 text-slate-300 border border-zinc-700 hover:border-zinc-500'}"
				onclick={() => updateFormData({ firstTattoo: false })}
			>
				I've been inked before
			</button>
		</div>
	</div>

	<!-- Section 1: Style Selection -->
	<div id="section-style" class="border-b border-zinc-800 pb-6 scroll-mt-12" style="scroll-snap-align: start;">
		<h3 class="booking-section-title mb-4">What style?</h3>
		<ExampleStylesCarousel
			selectedStyle={formData.primaryTattooStyle ?? ''}
			onStyleSelect={(styleId) => updateFormData({ primaryTattooStyle: styleId })}
		/>
	</div>

	<!-- Section 2: Body Placement (2-level) -->
	<div id="section-placement" class="border-b border-zinc-800 pb-6 scroll-mt-12" style="scroll-snap-align: start;">
		<h3 class="booking-section-title mb-4">Where on your body?</h3>

		<!-- Region pills -->
		<div class="flex flex-wrap gap-2 mb-4">
			{#each regions as region}
				<button
					type="button"
					class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border hover:scale-[1.02]
						{selectedRegion === region
							? 'bg-ink-500 border-ink-500 text-white'
							: 'bg-surface-900 border-zinc-700 text-slate-300 hover:border-ink-500/50'}"
					onclick={() => selectRegion(region)}
				>
					{region}
				</button>
			{/each}
		</div>

		<!-- Area pills (second level) -->
		{#if selectedRegion && placements.length > 0}
			<div class="flex flex-wrap gap-2 mt-3">
				{#each placements as area}
					<button
						type="button"
						class="px-3 py-1.5 rounded-lg text-sm transition-all duration-200 border hover:scale-[1.02]
							{formData.bodyArea === area && formData.bodyRegion === selectedRegion
								? 'bg-ink-500/20 border-ink-500 text-ink-400'
								: 'bg-surface-900 border-zinc-700 text-slate-400 hover:border-zinc-500'}"
						onclick={() => selectPlacement(area)}
					>
						{area}
					</button>
				{/each}
			</div>
		{/if}

		{#if formData.bodyArea && formData.painLevel}
			<div class="mt-3 bg-zinc-800/50 rounded-lg p-3 border border-zinc-800 space-y-1">
				<p class="text-xs text-slate-500">
					Pain level: {formData.painLevel}/10 — {formData.painReason}
				</p>
				{#if formData.firstTattoo}
					<p class="text-xs text-emerald-400/80">
						Most people say the pain is less than expected. We also offer numbing cream for extra comfort.
					</p>
				{/if}
			</div>
		{/if}

		<!-- Additional areas toggle -->
		<div class="mt-3">
			<button
				type="button"
				class="text-xs text-ink-400 hover:text-ink-300 transition-colors"
				onclick={() => showAdditionalAreas = !showAdditionalAreas}
			>
				{showAdditionalAreas ? '− Hide' : '+ Planning multiple tattoos or a large piece?'}
			</button>
			{#if showAdditionalAreas}
				<div class="mt-2">
					<textarea
						class="w-full bg-surface-800 border border-zinc-700 text-zinc-100 rounded-lg p-3 text-sm resize-none input-focus-glow"
						placeholder="Describe additional tattoo ideas or areas you'd like covered (e.g., 'also want a small rose on my ankle' or 'full sleeve from shoulder to wrist')"
						rows={3}
						maxlength={500}
						value={formData.additionalAreas ?? ''}
						oninput={(e) => updateFormData({ additionalAreas: (e.target as HTMLTextAreaElement).value })}
					></textarea>
					<p class="text-[10px] text-zinc-500 mt-1">The artist will discuss all placements at consultation</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Inspiration Search (optional, only shows after placement selected) -->
	{#if formData.bodyArea}
		<div class="border-b border-zinc-800 pb-6">
			<button
				type="button"
				class="flex items-center gap-2 text-xs text-zinc-500 hover:text-ink-400 transition-colors"
				onclick={() => { showInspiration = !showInspiration; }}
			>
				<Search class="w-3.5 h-3.5" />
				{showInspiration ? '− Hide inspiration search' : '+ Need inspiration? Search for ideas'}
			</button>

			{#if showInspiration}
				<div class="mt-3 space-y-3">
					<p class="text-[10px] text-zinc-500">Search for tattoo ideas, save images you like, then upload them as references below</p>

					<!-- Auto-generated search query (editable) -->
					<input
						type="text"
						class="w-full bg-surface-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm input-focus-glow"
						placeholder="e.g., inner forearm fineline tattoo"
						bind:value={customQuery}
					/>

					<!-- Search buttons — open in new tab -->
					<div class="flex gap-2">
						<button
							type="button"
							onclick={() => openSearch('google')}
							class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs font-medium transition-colors"
						>
							<span class="text-sm">G</span> Google
							<ExternalLink class="w-3 h-3 text-zinc-500" />
						</button>
						<button
							type="button"
							onclick={() => openSearch('pinterest')}
							class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-red-500/50 text-zinc-300 text-xs font-medium transition-colors"
						>
							<span class="text-red-500 text-sm font-bold">P</span> Pinterest
							<ExternalLink class="w-3 h-3 text-zinc-500" />
						</button>
						<button
							type="button"
							onclick={() => openSearch('instagram')}
							class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-purple-500/50 text-zinc-300 text-xs font-medium transition-colors"
						>
							<span class="text-pink-500 text-sm font-bold">I</span> Instagram
							<ExternalLink class="w-3 h-3 text-zinc-500" />
						</button>
					</div>

				</div>
			{/if}
		</div>
	{/if}

	<!-- Section 3: Size Categories -->
	<div id="section-size" class="border-b border-zinc-800 pb-6 scroll-mt-12" style="scroll-snap-align: start;">
		<h3 class="booking-section-title mb-4">How big?</h3>
		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
			{#each SIZE_CATEGORIES as cat}
				<button
					type="button"
					class="card-interactive p-3 rounded-lg border text-left transition-all
						{formData.sizeCategory === cat.id
							? 'bg-ink-500/15 border-ink-500 ring-1 ring-ink-500/30'
							: 'bg-surface-900 border-zinc-700'}"
					onclick={() => selectSize(cat.id)}
				>
					<p class="text-sm font-semibold text-slate-200">{cat.label}</p>
					<p class="text-xs text-slate-400 mt-1">{cat.description}</p>
					<p class="text-xs text-slate-500 mt-0.5">{cat.example}</p>
				</button>
			{/each}
		</div>
	</div>

	<!-- Live Price Estimate -->
	<div id="section-price" class="scroll-mt-12" style="scroll-snap-align: start;">
	{#if priceRange.min > 0}
		{#key priceRange.min}
			<div class="animate-fade-in-up bg-ink-500/5 border border-ink-500/20 rounded-xl p-4 flex items-center justify-between">
				<div>
					<p class="text-xs text-zinc-400 uppercase tracking-wide">Estimated Price Range</p>
					<p class="text-ink-400 text-xl font-bold mt-1">
						₱{priceRange.min.toLocaleString()} — ₱{priceRange.max.toLocaleString()}
					</p>
				</div>
				<p class="text-xs text-zinc-500 max-w-[140px] text-right">Final price confirmed at consultation</p>
			</div>
		{/key}
	{:else}
		<div class="bg-zinc-800/30 border border-zinc-800 rounded-xl p-4 text-center">
			<p class="text-xs text-zinc-500">Select a size to see your price estimate</p>
		</div>
	{/if}
	</div>

	<!-- Section 4: Color & Options -->
	<div id="section-color" class="border-b border-zinc-800 pb-6 scroll-mt-12" style="scroll-snap-align: start;">
		<div class="flex flex-col sm:flex-row gap-6">
			<!-- Color toggle -->
			<div>
				<h3 class="booking-section-title mb-3">Color</h3>
				<div class="flex gap-2">
					<button
						type="button"
						class="px-4 py-2 rounded-full text-sm font-medium border transition-all
							{!formData.isColor
								? 'bg-ink-500 border-ink-500 text-white'
								: 'bg-surface-900 border-zinc-700 text-slate-300 hover:border-zinc-500'}"
						onclick={() => updateFormData({ isColor: false })}
					>
						Black & Grey
					</button>
					<button
						type="button"
						class="px-4 py-2 rounded-full text-sm font-medium border transition-all
							{formData.isColor
								? 'bg-ink-500 border-ink-500 text-white'
								: 'bg-surface-900 border-zinc-700 text-slate-300 hover:border-zinc-500'}"
						onclick={() => updateFormData({ isColor: true })}
					>
						Color
					</button>
				</div>
			</div>

			<!-- Cover-up toggle (only for returning clients — first-timers can't have a tattoo to cover) -->
			{#if formData.firstTattoo === false}
				<div>
					<h3 class="booking-section-title mb-3">Cover-up?</h3>
					<div class="flex gap-2">
						<button
							type="button"
							class="px-4 py-2 rounded-full text-sm font-medium border transition-all
								{!formData.isCoverUp
									? 'bg-ink-500 border-ink-500 text-white'
									: 'bg-surface-900 border-zinc-700 text-slate-300 hover:border-zinc-500'}"
							onclick={() => updateFormData({ isCoverUp: false })}
						>
							No
						</button>
						<button
							type="button"
							class="px-4 py-2 rounded-full text-sm font-medium border transition-all
								{formData.isCoverUp
									? 'bg-ink-500 border-ink-500 text-white'
									: 'bg-surface-900 border-zinc-700 text-slate-300 hover:border-zinc-500'}"
							onclick={() => updateFormData({ isCoverUp: true })}
						>
							Yes
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Section 5: Describe Your Vision (optional) -->
	<div id="section-details" class="border-b border-zinc-800 pb-6 scroll-mt-12" style="scroll-snap-align: start;">
		<label class="booking-section-title mb-3 block" for="tattooDescription">
			Describe Your Vision <span class="text-zinc-500 normal-case font-normal">(optional)</span>
		</label>
		<textarea
			id="tattooDescription"
			class="w-full bg-surface-800 border border-zinc-700 text-zinc-100 rounded-lg p-3 focus:border-ink-500 focus:outline-none resize-none input-focus-glow"
			placeholder="Describe your vision — style details, specific elements, color preferences, anything the artist should know..."
			rows={4}
			maxlength={1000}
			value={formData.tattooDescription ?? ''}
			oninput={(e) => {
				const val = (e.target as HTMLTextAreaElement).value;
				updateFormData({ tattooDescription: val });
			}}
		></textarea>
		<p class="text-xs text-zinc-500 mt-2">
			{(formData.tattooDescription ?? '').length} / 1000 characters
		</p>
	</div>

	<!-- Section 6: Creative Freedom -->
	<div id="section-freedom" class="border-b border-zinc-800 pb-6 scroll-mt-12" style="scroll-snap-align: start;">
		<h3 class="booking-section-title mb-4">How closely should the artist follow your idea?</h3>
		<div class="flex flex-col gap-2">
			{#each creativeFreedomOptions as option}
				<button
					type="button"
					class="w-full {formData.creativeFreedom === option.value
						? 'bg-ink-500/15 border-ink-500 ring-1 ring-ink-500/30 rounded-xl px-4 py-3 flex items-center gap-3'
						: 'bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center gap-3 transition-all hover:border-zinc-500'}"
					onclick={() => updateFormData({ creativeFreedom: option.value })}
				>
					<option.icon
						size={18}
						class={formData.creativeFreedom === option.value ? 'text-ink-500' : 'text-zinc-400'}
					/>
					<span class="text-sm font-medium {formData.creativeFreedom === option.value ? 'text-ink-400' : 'text-zinc-300'}">
						{option.label}
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Section 7: Cover-up Photo (conditional) -->
	{#if formData.isCoverUp}
		<div class="border-b border-zinc-800 pb-6">
			<h3 class="booking-section-title mb-2">Upload a photo of your existing tattoo</h3>
			<p class="text-xs text-zinc-400 mb-4">Up to 2 images, 5MB each</p>

			<label
				class="group block border-2 border-dashed border-zinc-700 hover:border-ink-500/50 hover:bg-ink-500/5 rounded-xl p-6 text-center transition-colors cursor-pointer"
			>
				<input
					type="file"
					multiple
					accept="image/*"
					class="hidden"
					onchange={(e) => handleCoverUpUpload((e.target as HTMLInputElement).files)}
					disabled={coverUpUploading || (formData.coverUpPhoto ?? []).length >= 2}
				/>
				<p class="text-slate-300 font-medium text-sm">
					{coverUpUploading ? 'Uploading...' : 'Click to upload'}
				</p>
				<p class="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB</p>
			</label>

			{#if coverUpUploadError}
				<div class="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
					<p class="text-xs text-red-400">{coverUpUploadError}</p>
				</div>
			{/if}

			{#if (formData.coverUpPhoto ?? []).length > 0}
				<div class="mt-4 flex flex-wrap gap-3">
					{#each formData.coverUpPhoto ?? [] as image, index (index)}
						<div class="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-700">
							<img src={image} alt="Cover-up {index + 1}" class="w-full h-full object-cover" />
							<button
								type="button"
								class="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
								onclick={() => removeCoverUpImage(index)}
								title="Remove image"
							>
								<span class="text-white text-lg font-bold">&times;</span>
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Section 8: Reference Images (optional) -->
	<div id="section-refs" class="scroll-mt-12" style="scroll-snap-align: start;">
		<h3 class="booking-section-title mb-2">
			Add reference images <span class="text-zinc-500 normal-case font-normal">(optional, max 3)</span>
		</h3>

		<label
			class="group block border-2 border-dashed border-zinc-700 group-hover:border-ink-500/50 group-hover:bg-ink-500/5 rounded-xl p-6 text-center transition-colors cursor-pointer hover:border-ink-500/50 hover:bg-ink-500/5"
		>
			<input
				type="file"
				multiple
				accept="image/*"
				class="hidden"
				onchange={(e) => handleFileUpload((e.target as HTMLInputElement).files)}
				disabled={uploading || formData.referenceImages.length >= 3}
			/>
			<p class="text-slate-300 font-medium text-sm">
				{uploading ? 'Uploading...' : 'Click to upload'}
			</p>
			<p class="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB</p>
		</label>

		{#if uploadError}
			<div class="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
				<p class="text-xs text-red-400">{uploadError}</p>
			</div>
		{/if}

		{#if formData.referenceImages.length > 0}
			<div class="mt-4 flex flex-wrap gap-3">
				{#each formData.referenceImages as image, index (index)}
					<div class="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-700">
						{#if typeof image === 'string'}
							<img src={image} alt="Reference {index + 1}" class="w-full h-full object-cover" />
						{:else}
							<img src={URL.createObjectURL(image)} alt="Reference {index + 1}" class="w-full h-full object-cover" />
						{/if}
						<button
							type="button"
							class="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
							onclick={() => removeImage(index)}
							title="Remove image"
						>
							<span class="text-white text-lg font-bold">&times;</span>
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>



