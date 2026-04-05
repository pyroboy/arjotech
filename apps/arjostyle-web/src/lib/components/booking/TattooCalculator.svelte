<script lang="ts">
	import type {
		BodyPartMappings,
		PlacementSizeLimits,
		PlacementPainInfo
	} from '$types/mapping';
	// Human3DViewer is handled by TattooPreviewInfo in BookingFlow

	// Constants (preserve exactly)
	const MINIMUM_BASE_PRICE = 1000;
	const BASE_PAIN_LEVEL = 1;
	const PAIN_DIFFICULTY_FACTOR = 0.02;
	const PAIN_WARNING_THRESHOLD = 6;
	const COVER_UP_MULTIPLIER = 2;
	const COLOR_MULTIPLIER = 2;
	const SIZE_PRICE_BRACKETS = [
		{ maxSize: 2, priceMultiplier: 1.0 },
		{ maxSize: 4, priceMultiplier: 1 },
		{ maxSize: 8, priceMultiplier: 1.5 },
		{ maxSize: 12, priceMultiplier: 3.5 },
		{ maxSize: Infinity, priceMultiplier: 4.5 }
	];
	const TRUE_BASE_MINUTES_PER_INCH = 10;
	const SIZE_DURATION_BRACKETS = [
		{ maxSize: 2, durationMultiplier: 1.3 },
		{ maxSize: 4, durationMultiplier: 1.0 },
		{ maxSize: 8, durationMultiplier: 1.0 },
		{ maxSize: Infinity, durationMultiplier: 1.1 }
	];
	const COMPLEXITY_MULTIPLIERS = [1, 1.5, 1.8];
	const COMPLEXITY_DURATION_MULTIPLIERS = [1, 2, 2.6];
	const PAIN_DURATION_FACTOR = 0.15;
	const COLOR_DURATION_MULTIPLIER = 1.4;
	const COVERUP_DURATION_MULTIPLIER = 1.3;
	const MINIMUM_DURATION_MINUTES = 30;
	const MAX_SESSION_HOURS = 6;
	const DEFAULT_SIZE_LIMITS: PlacementSizeLimits = { min: 0.5, max: 12, multiplier: 1.0 };
	const DEFAULT_PAIN_INFO: PlacementPainInfo = { level: 1 };

	interface Props {
		bodyPartMappings: BodyPartMappings | null | undefined;
		initialValues?: {
			size: number;
			isColor: boolean;
			selectedCategory: string;
			placementIndex: number;
			isCoverUp: boolean;
			sizeSliderTouched: boolean;
			placementSliderTouched: boolean;
		};
		onchange?: (values: TattooCalculatorChangePayload) => void;
		modelUrl?: string; // kept for API compat, not used (TattooPreviewInfo handles 3D)
	}

	type TattooCalculatorChangePayload = {
		size: number;
		isColor: boolean;
		selectedCategory: string;
		placementIndex: number;
		currentPlacement: string | null;
		painLevel: number | null;
		painReason?: string;
		isCoverUp: boolean;
		pricing: {
			basePriceRaw: number;
			sizeAdjustmentPrice: number;
			complexityPrice: number;
			placementPrice: number;
			colorPrice: number;
			coverUpPrice: number;
			hourlyMinimumAdjustment: number;
			total: number;
			downpayment: number;
		};
		estimatedDurationMinutes: number;
		estimatedSessions: number;
		complexity: number;
		visualComplexityScore: number;
		sizeSliderTouched: boolean;
		placementSliderTouched: boolean;
	};

	let {
		bodyPartMappings,
		initialValues,
		onchange,
		modelUrl = undefined
	}: Props = $props();

	// State — intentionally captured once from initialValues (not reactive to prop changes)
	// svelte-ignore state_referenced_locally
	let size = $state(initialValues?.size ?? 0);
	// svelte-ignore state_referenced_locally
	let isColor = $state(initialValues?.isColor ?? false);
	// svelte-ignore state_referenced_locally
	let selectedCategory = $state(initialValues?.selectedCategory ?? '');
	// svelte-ignore state_referenced_locally
	let placementIndex = $state(initialValues?.placementIndex ?? 0);
	// svelte-ignore state_referenced_locally
	let isCoverUp = $state(initialValues?.isCoverUp ?? false);
	// svelte-ignore state_referenced_locally
	let sizeSliderTouched = $state(initialValues?.sizeSliderTouched ?? false);
	// svelte-ignore state_referenced_locally
	let placementSliderTouched = $state(initialValues?.placementSliderTouched ?? false);

	// Derived
	const categoryKeys = $derived(['', ...Object.keys(bodyPartMappings ?? {})]);
	const activeCategoryKeys = $derived(categoryKeys.filter((k) => k !== ''));

	const currentPlacements = $derived.by(() => {
		if (!bodyPartMappings || !selectedCategory) return [];
		const placements = bodyPartMappings[selectedCategory];
		if (!placements) return [];
		return Object.keys(placements).sort();
	});

	const safePlacementIndex = $derived.by(() => {
		if (currentPlacements.length === 0) return 0;
		return Math.max(0, Math.min(placementIndex, currentPlacements.length - 1));
	});

	const currentPlacement = $derived(currentPlacements[safePlacementIndex] ?? null);

	const currentPlacementData = $derived.by(() => {
		if (!bodyPartMappings || !selectedCategory || !currentPlacement) return null;
		return bodyPartMappings[selectedCategory]?.[currentPlacement] ?? null;
	});

	const currentSizeLimits = $derived(
		currentPlacementData?.placementSizeLimits ?? DEFAULT_SIZE_LIMITS
	);

	const currentPainInfo = $derived(currentPlacementData?.placementPainInfo ?? DEFAULT_PAIN_INFO);

	const currentPainLevel = $derived(currentPainInfo?.level ?? null);

	const painMultiplier = $derived(
		1 + Math.max(0, (currentPainLevel ?? 0) - BASE_PAIN_LEVEL) * PAIN_DIFFICULTY_FACTOR
	);

	const effectivePlacementMultiplier = $derived(
		parseFloat((currentSizeLimits.multiplier * painMultiplier).toFixed(2))
	);

	const isCalculatorDisabled = $derived(!bodyPartMappings);
	const isPlacementDisabled = $derived(!selectedCategory || isCalculatorDisabled);

	const isSizeDisabled = $derived(
		!currentPlacement || isCalculatorDisabled
	);

	const areBaseSelectionsMade = $derived(
		!isCalculatorDisabled &&
			selectedCategory &&
			currentPlacement &&
			placementSliderTouched &&
			sizeSliderTouched &&
			size >= currentSizeLimits.min
	);

	const calculationsEnabled = $derived(
		!isCalculatorDisabled && sizeSliderTouched && currentPlacement && size >= currentSizeLimits.min
	);

	const visualComplexityScore = $derived.by(() => {
		if (!calculationsEnabled) return 1;
		let score = 1;
		if (size > 10) score += 4;
		else if (size > 6) score += 3;
		else if (size > 3) score += 1;
		if (isColor) score += 3;
		if (isCoverUp) score += 4;
		return Math.max(1, Math.min(10, score));
	});

	const effectiveComplexityLevel = $derived.by(() => {
		if (!calculationsEnabled) return 1;
		if (visualComplexityScore >= 7) return 3;
		if (visualComplexityScore >= 4) return 2;
		return 1;
	});

	const estimatedDurationMinutes = $derived.by(() => {
		if (!calculationsEnabled) return MINIMUM_DURATION_MINUTES;

		let baseDuration = size * TRUE_BASE_MINUTES_PER_INCH;

		// Size bracket duration multiplier
		const sizeDurationBracket = SIZE_DURATION_BRACKETS.find((b) => size <= b.maxSize);
		if (sizeDurationBracket) {
			baseDuration *= sizeDurationBracket.durationMultiplier;
		}

		// Complexity duration multiplier
		const complexity = effectiveComplexityLevel;
		baseDuration *= COMPLEXITY_DURATION_MULTIPLIERS[complexity - 1] ?? 1;

		// Pain duration factor
		const painDurationFactor = (currentPainLevel ?? BASE_PAIN_LEVEL) * PAIN_DURATION_FACTOR;
		baseDuration *= 1 + painDurationFactor;

		// Color and cover-up multipliers
		if (isColor) baseDuration *= COLOR_DURATION_MULTIPLIER;
		if (isCoverUp) baseDuration *= COVERUP_DURATION_MULTIPLIER;

		// Round to nearest 30 and enforce minimum
		const rounded = Math.max(MINIMUM_DURATION_MINUTES, Math.round(baseDuration / 30) * 30);
		return rounded;
	});

	const estimatedSessions = $derived(
		Math.max(1, Math.ceil(estimatedDurationMinutes / 60 / MAX_SESSION_HOURS))
	);

	const pricing = $derived.by(() => {
		const result = {
			basePriceRaw: 0,
			sizeAdjustmentPrice: 0,
			complexityPrice: 0,
			placementPrice: 0,
			colorPrice: 0,
			coverUpPrice: 0,
			hourlyMinimumAdjustment: 0,
			total: 0,
			downpayment: 0
		};

		if (!calculationsEnabled) return result;

		// Base price
		const basePriceRaw = MINIMUM_BASE_PRICE;
		result.basePriceRaw = basePriceRaw;

		// Size adjustment
		const sizeBracket = SIZE_PRICE_BRACKETS.find((b) => size <= b.maxSize);
		const sizeMultiplier = sizeBracket?.priceMultiplier ?? 1;
		const sizeAdjustmentPrice = basePriceRaw * (sizeMultiplier - 1);
		result.sizeAdjustmentPrice = Math.max(0, sizeAdjustmentPrice);

		// Complexity
		const complexity = effectiveComplexityLevel;
		const complexityMultiplier = COMPLEXITY_MULTIPLIERS[complexity - 1] ?? 1;
		const complexityPrice = basePriceRaw * (complexityMultiplier - 1);
		result.complexityPrice = Math.max(0, complexityPrice);

		// Placement with pain
		const placementPrice = basePriceRaw * effectivePlacementMultiplier;
		result.placementPrice = placementPrice;

		// Color
		const colorPrice = isColor ? basePriceRaw * (COLOR_MULTIPLIER - 1) : 0;
		result.colorPrice = Math.max(0, colorPrice);

		// Cover-up
		const coverUpPrice = isCoverUp ? basePriceRaw * (COVER_UP_MULTIPLIER - 1) : 0;
		result.coverUpPrice = Math.max(0, coverUpPrice);

		// Feature-based total
		const featureBasedTotal =
			basePriceRaw +
			result.sizeAdjustmentPrice +
			result.complexityPrice +
			result.placementPrice +
			result.colorPrice +
			result.coverUpPrice;

		// Hourly minimum enforcement
		const durationInHours = estimatedDurationMinutes / 60;
		const hourlyMinimumPrice = durationInHours * MINIMUM_BASE_PRICE;

		const preRoundedTotal = Math.max(MINIMUM_BASE_PRICE, featureBasedTotal, hourlyMinimumPrice);
		const finalTotalRounded = Math.round(preRoundedTotal / 100) * 100;
		const featureTotalRoundedForComparison = Math.max(
			MINIMUM_BASE_PRICE,
			Math.round(featureBasedTotal / 100) * 100
		);
		const hourlyMinimumAdjustment = Math.max(0, finalTotalRounded - featureTotalRoundedForComparison);

		result.hourlyMinimumAdjustment = hourlyMinimumAdjustment;
		result.total = finalTotalRounded;

		// Downpayment
		const halfAmount = finalTotalRounded / 2;
		const downpayment = Math.max(
			500,
			halfAmount >= 1000 ? Math.round(halfAmount / 500) * 500 : Math.round(halfAmount / 100) * 100
		);
		result.downpayment = downpayment;

		return result;
	});

	// Effects — clamp size to limits when placement changes (use untrack to avoid loops)
	let lastPlacement: string | null = null;
	$effect(() => {
		const placement = currentPlacement;
		if (placement && placement !== lastPlacement && sizeSliderTouched) {
			lastPlacement = placement;
			const limits = currentSizeLimits;
			const clamped = Math.max(limits.min, Math.min(size, limits.max));
			if (clamped !== size) {
				size = clamped;
			}
		}
	});

	$effect(() => {
		if (selectedCategory && currentPlacements.length === 0) {
			placementIndex = 0;
			placementSliderTouched = false;
			sizeSliderTouched = false;
			size = 0;
		}
	});

	// Live onchange: pushes state to parent so 3D model updates immediately.
	// Captures reactive values first, then calls onchange outside tracking
	// to prevent infinite loop (onchange → store update → props change → re-trigger).
	$effect(() => {
		// Read all reactive values to subscribe to slider changes
		const _size = size;
		const _isColor = isColor;
		const _cat = selectedCategory;
		const _pi = placementIndex;
		const _cp = currentPlacement;
		const _pain = currentPainLevel;
		const _painR = currentPainInfo?.reason;
		const _cover = isCoverUp;
		const _pricing = pricing;
		const _dur = estimatedDurationMinutes;
		const _sess = estimatedSessions;
		const _comp = effectiveComplexityLevel;
		const _vis = visualComplexityScore;
		const _st = sizeSliderTouched;
		const _pt = placementSliderTouched;

		if (!onchange) return;
		// Fire outside Svelte's tracking via microtask to break the cycle
		queueMicrotask(() => {
			onchange({
				size: _size, isColor: _isColor, selectedCategory: _cat,
				placementIndex: _pi, currentPlacement: _cp,
				painLevel: _pain, painReason: _painR, isCoverUp: _cover,
				pricing: _pricing, estimatedDurationMinutes: _dur,
				estimatedSessions: _sess, complexity: _comp,
				visualComplexityScore: _vis,
				sizeSliderTouched: _st, placementSliderTouched: _pt,
			});
		});
	});

	// Event handlers
	function handleCategoryChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const index = parseInt(input.value, 10);
		selectedCategory = activeCategoryKeys[index] ?? '';
		placementIndex = 0;
		placementSliderTouched = false;
		sizeSliderTouched = false;
		size = 0;
	}

	function handlePlacementInput(e: Event) {
		const input = e.target as HTMLInputElement;
		placementIndex = parseInt(input.value, 10);
		placementSliderTouched = true;
	}

	function handlePlacementCommit(e: Event) {
		const input = e.target as HTMLInputElement;
		placementIndex = parseInt(input.value, 10);
		placementSliderTouched = true;
		sizeSliderTouched = false;
		size = 0;
	}

	function handleSizeChange(e: Event) {
		const input = e.target as HTMLInputElement;
		size = parseFloat(input.value);
		sizeSliderTouched = true;
	}

	function handleCoverUpToggle(e: Event) {
		if (areBaseSelectionsMade) {
			const input = e.target as HTMLInputElement;
			isCoverUp = input.checked;
		}
	}

	function handleColorToggle(e: Event) {
		if (areBaseSelectionsMade) {
			const input = e.target as HTMLInputElement;
			isColor = input.checked;
		}
	}

	function formatDuration(totalMinutes: number): string {
		if (!totalMinutes || isNaN(totalMinutes) || totalMinutes < MINIMUM_DURATION_MINUTES) {
			return `Approx. ${MINIMUM_DURATION_MINUTES} min`;
		}
		const roundedMinutes = Math.max(MINIMUM_DURATION_MINUTES, Math.round(totalMinutes / 30) * 30);
		const hours = Math.floor(roundedMinutes / 60);
		const minutes = roundedMinutes % 60;
		let result = '';
		if (hours > 0) result += `${hours} hr${hours > 1 ? 's' : ''}`;
		if (minutes > 0) {
			if (result) result += ' ';
			result += `${minutes} min`;
		}
		return result ? `Approx. ${result}` : `Approx. ${MINIMUM_DURATION_MINUTES} min`;
	}

	// Slider fill percentages for range indicator
	const categoryMax = $derived(Math.max(0, activeCategoryKeys.length - 1));
	const categoryIndex = $derived(activeCategoryKeys.indexOf(selectedCategory));
	const categoryFillPct = $derived(categoryMax > 0 ? (categoryIndex / categoryMax) * 100 : 0);

	const placementMax = $derived(Math.max(0, currentPlacements.length - 1));
	const placementFillPct = $derived(placementMax > 0 ? (safePlacementIndex / placementMax) * 100 : 0);

	const sizeRange = $derived(currentSizeLimits.max - currentSizeLimits.min);
	const sizeFillPct = $derived(sizeRange > 0 ? ((size - currentSizeLimits.min) / sizeRange) * 100 : 0);
	const sizeTickCount = $derived(Math.min(Math.floor(sizeRange / 0.5) + 1, 25));

	function getPainColor(): string {
		if (currentPainLevel === null) return 'bg-slate-700 text-slate-300';
		if (currentPainLevel <= 3) return 'bg-green-900 text-green-200';
		if (currentPainLevel <= 5) return 'bg-yellow-900 text-yellow-200';
		if (currentPainLevel <= 7) return 'bg-orange-900 text-orange-200';
		return 'bg-red-900 text-red-200';
	}

	function getPrerequisiteMessage(): string {
		if (isCalculatorDisabled) {
			return 'Loading body part mappings...';
		}
		if (!selectedCategory) {
			return 'Select a tattoo category to begin.';
		}
		if (!currentPlacement) {
			return 'Select a placement location.';
		}
		if (!sizeSliderTouched) {
			return 'Specify the tattoo size to calculate pricing.';
		}
		if (size < currentSizeLimits.min) {
			return `Minimum size for this placement is ${currentSizeLimits.min} sq. in.`;
		}
		return 'Please complete selections above.';
	}
</script>

<div class="pt-4 pb-10 {isCalculatorDisabled ? 'opacity-50 pointer-events-none' : ''}">
	<!-- == Sliders + Pricing (Pain/Validation handled by TattooPreviewInfo) == -->

	<!-- Category Slider -->
	<div class="flex items-center gap-x-3 sm:gap-x-4 pl-4 relative transition-opacity duration-300 {!selectedCategory && !isCalculatorDisabled ? 'rounded-lg' : ''}">
		<span class="flex items-center justify-center w-24 sm:w-28 h-12 flex-shrink-0 overflow-hidden">
			<span class="font-bold text-base text-slate-300 leading-tight line-clamp-2 w-full">
				{selectedCategory ? String(selectedCategory) : 'Category'}
			</span>
		</span>
		<div class="flex-grow relative {!selectedCategory && !isCalculatorDisabled ? 'rounded-md' : ''}">
			<div class="relative slider-wrapper">
				<div class="slider-track-bg">
					<div class="slider-track-fill" style="width: {categoryFillPct}%"></div>
					{#each activeCategoryKeys as _, i}
						<div class="slider-tick" style="left: {categoryMax > 0 ? (i / categoryMax) * 100 : 0}%"></div>
					{/each}
				</div>
				<input
					type="range"
					min="0"
					max={categoryMax}
					step="1"
					value={categoryIndex}
					oninput={handleCategoryChange}
					disabled={isCalculatorDisabled}
					class={`w-full cursor-pointer slider-input ${isCalculatorDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${!selectedCategory && !isCalculatorDisabled ? 'glow-pulse' : ''}`}
				/>
			</div>
		</div>
	</div>

	<!-- Placement Slider -->
	<div>
		<div class="flex items-center gap-x-3 sm:gap-x-4 pl-4 relative transition-opacity duration-300 {isPlacementDisabled ? 'opacity-50 pointer-events-none' : ''} {!isPlacementDisabled && !placementSliderTouched ? 'rounded-lg' : ''}">
			<span class="flex items-center justify-center w-24 sm:w-28 h-12 flex-shrink-0 overflow-hidden">
				<span class="font-bold text-base text-slate-300 leading-tight line-clamp-2 w-full">
					{currentPlacement ? `${currentPlacement}` : 'Placement'}
				</span>
			</span>
			<div class="flex-grow relative {!isPlacementDisabled && !placementSliderTouched ? 'rounded-md' : ''}">
				<div class="relative slider-wrapper">
					<div class="slider-track-bg">
						<div class="slider-track-fill" style="width: {placementFillPct}%"></div>
						{#each currentPlacements as _, i}
							<div class="slider-tick" style="left: {placementMax > 0 ? (i / placementMax) * 100 : 0}%"></div>
						{/each}
					</div>
					<input
						type="range"
						min="0"
						max={Math.max(0, currentPlacements.length - 1)}
						step="1"
						value={safePlacementIndex}
						oninput={handlePlacementInput}
						onchange={handlePlacementCommit}
						disabled={isPlacementDisabled || currentPlacements.length <= 1}
						class={`w-full cursor-pointer slider-input transition-opacity ${
							isPlacementDisabled || currentPlacements.length <= 1
								? 'opacity-40 cursor-not-allowed'
								: ''
						}`}
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Size Slider -->
	<div class="pb-4">
		<div class="flex items-start gap-x-3 sm:gap-x-4 pl-4 pt-4 relative transition-opacity duration-300 {isSizeDisabled ? 'opacity-50 pointer-events-none' : ''}">
			<span class="block w-24 sm:w-28 flex-shrink-0 overflow-hidden">
				<span class="font-bold text-base text-slate-300 leading-tight line-clamp-2 w-full">
					{size !== undefined && size > 0 ? `${size} sq. in` : 'Est. Size'}
				</span>
			</span>
			<div class="flex-grow relative">
				<div class="rounded-md {!isSizeDisabled && !sizeSliderTouched ? '' : ''}">
					<div class="relative slider-wrapper">
						<div class="slider-track-bg">
							<div class="slider-track-fill" style="width: {sizeFillPct}%"></div>
							{#each {length: sizeTickCount} as _, i}
								{#if currentSizeLimits.min + i * 0.5 <= currentSizeLimits.max}
									<div class="slider-tick" style="left: {sizeRange > 0 ? ((i * 0.5) / sizeRange) * 100 : 0}%"></div>
								{/if}
							{/each}
						</div>
						<input
							type="range"
							min={currentSizeLimits.min}
							max={currentSizeLimits.max}
							step="0.5"
							value={size}
							oninput={handleSizeChange}
							disabled={isSizeDisabled}
							class={`w-full cursor-pointer slider-input ${isSizeDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${!isSizeDisabled && !sizeSliderTouched ? 'glow-pulse' : ''}`}
						/>
					</div>
				</div>
				<div class="flex justify-between text-xs text-slate-500 mt-1 px-1 pt-2 min-h-[1rem]">
					{#if isSizeDisabled}
						<span class="invisible">-</span>
					{:else}
						<span>{currentSizeLimits.min}in²</span>
						<span>{currentSizeLimits.max}in²</span>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- == Optional Selections Area (Switches) == -->
	<div class="transition-all duration-500 ease-in-out {areBaseSelectionsMade && !isCalculatorDisabled ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}">
		<div class="mt-3 border-t pt-4 border-slate-700/50">
			<h3 class="text-lg font-semibold text-slate-100 mb-5">Optional Enhancements:</h3>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<!-- Cover-up Toggle Card -->
				<button
					type="button"
					class="bg-slate-800/40 border border-slate-700/70 hover:border-blue-600/70 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer rounded-lg overflow-hidden group relative text-left w-full {!areBaseSelectionsMade ? 'opacity-60 pointer-events-none' : ''}"
					onclick={() => { if (areBaseSelectionsMade) isCoverUp = !isCoverUp; }}
				>
					<div class="absolute h-1 w-full top-0 left-0 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent transition-opacity duration-300 {isCoverUp ? 'opacity-100' : 'opacity-0'}"></div>
					<div class="p-4 flex items-center justify-between space-x-3">
						<div class="flex items-center space-x-3 flex-1 min-w-0">
							<div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 {isCoverUp ? 'bg-blue-600/30 group-hover:bg-blue-600/40' : 'bg-slate-700/60 group-hover:bg-slate-700'}">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-colors duration-300 {isCoverUp ? 'text-blue-300' : 'text-slate-300 group-hover:text-slate-100'}"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
							</div>
							<span class="font-medium text-base text-slate-200 truncate">Cover-up / Enhancement</span>
						</div>
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<label class="relative inline-flex items-center cursor-pointer flex-shrink-0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
							<input
								type="checkbox"
								checked={isCoverUp}
								onchange={handleCoverUpToggle}
								class="sr-only peer"
								disabled={!areBaseSelectionsMade}
							/>
							<div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
						</label>
					</div>
				</button>

				<!-- Color Toggle Card -->
				<button
					type="button"
					class="bg-slate-800/40 border border-slate-700/70 hover:border-blue-600/70 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer rounded-lg overflow-hidden group relative text-left w-full {!areBaseSelectionsMade ? 'opacity-60 pointer-events-none' : ''}"
					onclick={() => { if (areBaseSelectionsMade) isColor = !isColor; }}
				>
					<div class="absolute h-1 w-full top-0 left-0 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent transition-opacity duration-300 {isColor ? 'opacity-100' : 'opacity-0'}"></div>
					<div class="p-4 flex items-center justify-between space-x-3">
						<div class="flex items-center space-x-3 flex-1 min-w-0">
							<div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 {isColor ? 'bg-blue-600/30 group-hover:bg-blue-600/40' : 'bg-slate-700/60 group-hover:bg-slate-700'}">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-colors duration-300 {isColor ? 'text-blue-300' : 'text-slate-300 group-hover:text-slate-100'}"><circle cx="13.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="10.5" r="2.5"></circle><circle cx="8.5" cy="7.5" r="2.5"></circle><circle cx="6.5" cy="12.5" r="2.5"></circle><path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10c0 .926-.13 1.82-.37 2.67l-7.3-4.04a2.5 2.5 0 1 0-2.66 4.24l7.3 4.04A10.09 10.09 0 0 1 12 22z"></path></svg>
							</div>
							<span class="font-medium text-base text-slate-200 truncate">Color Tattoo</span>
						</div>
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<label class="relative inline-flex items-center cursor-pointer flex-shrink-0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
							<input
								type="checkbox"
								checked={isColor}
								onchange={handleColorToggle}
								class="sr-only peer"
								disabled={!areBaseSelectionsMade}
							/>
							<div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
						</label>
					</div>
				</button>
			</div>
		</div>
	</div>

	<!-- == Results / Placeholder Area == -->
	{#if areBaseSelectionsMade && calculationsEnabled}
		<!-- Results Card -->
		<div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950/80 border border-slate-700/80 shadow-xl mt-6 rounded-xl">
			<div class="p-6 sm:p-8">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
					<!-- Pricing Side -->
					<div class="flex flex-col justify-between space-y-4">
						<!-- Downpayment & Pain Level -->
						<div class="text-center md:text-left">
							<p class="text-sm font-medium text-blue-400 uppercase tracking-wider">Required Downpayment</p>
							<div class="text-4xl sm:text-5xl font-bold text-white mt-1">
								₱{pricing.downpayment.toLocaleString()}
							</div>
							{#if currentPainLevel !== null}
								<div class="mt-3">
									<span class="text-xs font-medium inline-flex items-center gap-1 px-2.5 py-1 rounded-full {currentPainLevel >= 8 ? 'bg-red-900/70 text-red-300 border border-red-700/50' : currentPainLevel >= PAIN_WARNING_THRESHOLD ? 'bg-amber-900/70 text-amber-300 border border-amber-700/50' : 'bg-sky-900/70 text-sky-300 border border-sky-700/50'}">
										<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
										Pain Level: {currentPainLevel}/10
									</span>
									{#if currentPainInfo?.reason && currentPainLevel >= PAIN_WARNING_THRESHOLD}
										<p class="text-xs text-slate-400 italic mt-1.5 ml-1">({currentPainInfo.reason})</p>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Price Breakdown -->
						<div class="space-y-2 border-t border-slate-700/60 pt-4 text-sm">
							<div class="flex justify-between text-slate-400">
								<span>Base Price ({size} sq. in)</span>
								<span class="font-medium text-slate-300">₱{pricing.basePriceRaw.toLocaleString()}</span>
							</div>
							{#if pricing.sizeAdjustmentPrice > 0}
								<div class="flex justify-between text-slate-400">
									<span>+ Size Adjustment</span>
									<span class="font-medium text-slate-300">₱{pricing.sizeAdjustmentPrice.toLocaleString()}</span>
								</div>
							{/if}
							{#if pricing.complexityPrice > 0}
								<div class="flex justify-between text-slate-400">
									<span>+ Complexity ({['Simple', 'Detailed', 'Intricate'][effectiveComplexityLevel - 1]})</span>
									<span class="font-medium text-slate-300">₱{pricing.complexityPrice.toLocaleString()}</span>
								</div>
							{/if}
							{#if pricing.placementPrice > 0 && currentPlacement}
								<div class="flex justify-between text-slate-400">
									<span>+ Placement ({currentPlacement})</span>
									<span class="font-medium text-slate-300">₱{pricing.placementPrice.toLocaleString()}</span>
								</div>
							{/if}
							{#if pricing.colorPrice > 0}
								<div class="flex justify-between text-slate-400">
									<span>+ Color</span>
									<span class="font-medium text-slate-300">₱{pricing.colorPrice.toLocaleString()}</span>
								</div>
							{/if}
							{#if pricing.coverUpPrice > 0}
								<div class="flex justify-between text-slate-400">
									<span>+ Cover-up / Enhancement</span>
									<span class="font-medium text-slate-300">₱{pricing.coverUpPrice.toLocaleString()}</span>
								</div>
							{/if}
							{#if pricing.hourlyMinimumAdjustment > 0}
								<div class="flex justify-between text-amber-400/80">
									<span class="italic">+ Hourly Rate Adjustment</span>
									<span class="font-medium text-amber-300/90 italic">₱{pricing.hourlyMinimumAdjustment.toLocaleString()}</span>
								</div>
							{/if}
						</div>

						<!-- Total Price -->
						<div class="border-t border-slate-700/60 pt-4 mt-4 text-center md:text-left">
							<p class="text-sm font-medium text-blue-400 uppercase tracking-wider">Total Estimated Price</p>
							<div class="text-4xl sm:text-5xl font-bold text-white mt-1">
								₱{pricing.total.toLocaleString()}
							</div>
						</div>
					</div>

					<!-- Duration Side -->
					<div class="space-y-4 md:border-l border-slate-700/60 md:pl-8 pt-6 md:pt-0 border-t md:border-t-0">
						<div class="text-center md:text-left">
							<p class="text-sm font-medium text-blue-400 uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
								Estimated Duration
							</p>
							<div class="text-3xl font-semibold text-white mt-1">
								{formatDuration(estimatedDurationMinutes)}
							</div>
						</div>
						{#if estimatedSessions > 1}
							<div class="mt-3 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg text-center md:text-left">
								<p class="text-sm font-medium text-amber-300">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-1.5 -mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
									Likely requires <span class="font-bold">{estimatedSessions} sessions</span> (~{MAX_SESSION_HOURS} hrs max each).
								</p>
							</div>
						{/if}
						<p class="text-xs text-slate-500 text-center md:text-left pt-2">
							Actual time may vary based on final design details, your pain tolerance, required breaks, etc.
						</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Placeholder Message -->
		<div class="text-center py-12 px-8 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center justify-center w-full mx-auto mt-6">
			<div class="mb-8 bg-gradient-to-br from-amber-400/20 to-amber-600/20 p-5 rounded-full border border-amber-500/30 shadow-md">
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
			</div>
			<div class="mb-6 max-w-sm">
				<h3 class="text-lg sm:text-xl font-semibold mb-3 text-amber-400">
					{getPrerequisiteMessage()}
				</h3>
				{#if areBaseSelectionsMade && size < currentSizeLimits.min}
					<p class="text-sm text-slate-300 mb-2">
						Adjust the size slider above to meet the minimum requirement for this placement.
					</p>
				{/if}
			</div>
			<div class="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent my-2"></div>
			<p class="text-xs text-slate-400 mt-4 italic">
				{isCalculatorDisabled
					? 'Estimator is currently unavailable.'
					: 'Once requirements are met, pricing and duration estimates will appear here.'}
			</p>
		</div>
	{/if}

	<!-- == Disclaimer == -->
	<div class="text-xs text-slate-500 text-center px-4 pt-6">
		* All estimates are approximate. Final price and duration depend on the final design, details, and are confirmed during consultation.
		Minimum price is ₱{MINIMUM_BASE_PRICE.toLocaleString()}.
		Location: Tagbilaran City, Bohol, Philippines.
	</div>
</div>

<style>
	/* Slider wrapper for layered track + input */
	.slider-wrapper {
		position: relative;
		height: 24px;
		display: flex;
		align-items: center;
	}

	/* Background track with tick marks */
	.slider-track-bg {
		position: absolute;
		left: 0;
		right: 0;
		height: 6px;
		background: #334155;
		border-radius: 3px;
		overflow: visible;
		pointer-events: none;
	}

	/* Orange fill (progress indicator) */
	.slider-track-fill {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background: linear-gradient(90deg, #f97316, #fb923c);
		border-radius: 3px;
		transition: width 0.05s ease-out;
	}

	/* Tick marks */
	.slider-tick {
		position: absolute;
		top: -3px;
		width: 1px;
		height: 12px;
		background: rgba(148, 163, 184, 0.3);
		transform: translateX(-50%);
		pointer-events: none;
	}

	/* Range input on top, transparent track */
	.slider-input {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 6px;
		background: transparent;
		border-radius: 3px;
		outline: none;
		position: relative;
		z-index: 2;
	}

	.slider-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 20px;
		height: 20px;
		background: #f97316;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}

	.slider-input::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: #f97316;
		border-radius: 50%;
		cursor: pointer;
		border: none;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}

	.slider-input:disabled::-webkit-slider-thumb {
		background: #475569;
		cursor: not-allowed;
		box-shadow: none;
	}

	.slider-input:disabled::-moz-range-thumb {
		background: #475569;
		cursor: not-allowed;
		box-shadow: none;
	}

	.glow-pulse {
		animation: glowPulse 3s infinite ease-in-out;
	}

	@keyframes glowPulse {
		0%,
		100% {
			box-shadow: 0 0 0px rgba(249, 115, 22, 0);
		}
		50% {
			box-shadow: 0 0 12px rgba(249, 115, 22, 0.4);
		}
	}
</style>
