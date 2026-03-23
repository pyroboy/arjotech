<script lang="ts">
	type RatingType = 'poor' | 'okay' | 'good' | 'great' | 'amazing';

	let billAmount = 0;
	let tipPercentage = 15;
	let customTip = '';
	let numPeople = 1;
	let serviceRating: RatingType | null = null;
	let roundingOption: '0' | '5' | '10' | '50' = '0';
	let kuripotMode = false;

	const ratingToTip: Record<RatingType, number> = {
		poor: 5,
		okay: 10,
		good: 15,
		great: 18,
		amazing: 20
	};

	function handleRatingChange(rating: RatingType) {
		serviceRating = serviceRating === rating ? null : rating;
		if (serviceRating) {
			tipPercentage = ratingToTip[serviceRating];
		}
	}

	function handleKuripotToggle() {
		kuripotMode = !kuripotMode;
		if (kuripotMode) {
			tipPercentage = 5;
		}
	}

	let finalTipPercentage = $derived(customTip ? parseFloat(customTip) : tipPercentage);

	let tipAmount = $derived((billAmount * finalTipPercentage) / 100);

	let totalBeforeRounding = $derived(billAmount + tipAmount);

	let totalWithTip = $derived.by(() => {
		let rounded = totalBeforeRounding;
		if (roundingOption === '5') {
			rounded = Math.ceil(totalBeforeRounding / 5) * 5;
		} else if (roundingOption === '10') {
			rounded = Math.ceil(totalBeforeRounding / 10) * 10;
		} else if (roundingOption === '50') {
			rounded = Math.ceil(totalBeforeRounding / 50) * 50;
		}
		return rounded;
	});

	let adjustedTipAmount = $derived(totalWithTip - billAmount);

	let perPersonAmount = $derived(totalWithTip / (numPeople || 1));

	function formatPeso(amount: number): string {
		return new Intl.NumberFormat('en-PH', {
			style: 'currency',
			currency: 'PHP',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Philippine Tip Calculator - Meal Splitter & Tip Guide</title>
	<meta
		name="description"
		content="Calculate tips and split bills in Philippine Peso. Includes service rating guide and tipping etiquette for restaurants, Grab drivers, and hotel staff."
	/>
</svelte:head>

<div class="min-h-screen bg-surface-900 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-white sm:text-4xl">Philippine Tip Calculator</h1>
			<p class="mt-2 text-zinc-400">Calculate tips and split bills. Perfect for restaurants, Grab drivers, and service staff.</p>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input Panel -->
			<div class="space-y-6">
				<!-- Bill Amount -->
				<div>
					<label class="block text-sm font-medium text-white mb-2">Bill Amount (₱)</label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">₱</span>
						<input
							type="number"
							bind:value={billAmount}
							min="0"
							step="0.50"
							placeholder="0.00"
							class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 pl-7 pr-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
						/>
					</div>
				</div>

				<!-- Service Rating -->
				<div>
					<label class="block text-sm font-medium text-white mb-3">Service Rating (Optional)</label>
					<div class="grid grid-cols-5 gap-2">
						{#each ['poor', 'okay', 'good', 'great', 'amazing'] as rating}
							<button
								on:click={() => handleRatingChange(rating as RatingType)}
								class={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
									serviceRating === rating
										? 'bg-orange-500 text-white'
										: 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:border-orange-500/50'
								}`}
							>
								{rating}
							</button>
						{/each}
					</div>
				</div>

				<!-- Tip Percentage -->
				<div>
					<label class="block text-sm font-medium text-white mb-3">Tip Percentage</label>
					<div class="grid grid-cols-4 gap-2 mb-4">
						{#each [5, 10, 15, 20] as percent}
							<button
								on:click={() => {
									tipPercentage = percent;
									customTip = '';
									serviceRating = null;
								}}
								class={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
									tipPercentage === percent && !customTip
										? 'bg-orange-500 text-white'
										: 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:border-orange-500/50'
								}`}
							>
								{percent}%
							</button>
						{/each}
					</div>
					<div class="flex gap-2">
						<input
							type="number"
							bind:value={customTip}
							min="0"
							step="0.5"
							placeholder="Custom %"
							class="flex-1 rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none text-sm"
						/>
						<span class="text-white text-sm">%</span>
					</div>
				</div>

				<!-- Rounding -->
				<div>
					<label class="block text-sm font-medium text-white mb-3">Rounding</label>
					<div class="grid grid-cols-4 gap-2">
						{#each ['0', '5', '10', '50'] as rounding}
							<button
								on:click={() => (roundingOption = rounding as '0' | '5' | '10' | '50')}
								class={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
									roundingOption === rounding
										? 'bg-orange-500 text-white'
										: 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:border-orange-500/50'
								}`}
							>
								{rounding === '0' ? 'Exact' : `₱${rounding}`}
							</button>
						{/each}
					</div>
				</div>

				<!-- Number of People -->
				<div>
					<label class="block text-sm font-medium text-white mb-2">Split Between (People)</label>
					<input
						type="number"
						bind:value={numPeople}
						min="1"
						max="20"
						class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
					/>
				</div>

				<!-- Kuripot Mode -->
				<div class="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
					<input
						type="checkbox"
						id="kuripot"
						checked={kuripotMode}
						on:change={handleKuripotToggle}
						class="cursor-pointer"
					/>
					<label for="kuripot" class="text-white text-sm cursor-pointer">
						🤑 Kuripot Mode (Cheapskate)
					</label>
				</div>
			</div>

			<!-- Results Panel -->
			<div class="space-y-6">
				<!-- Summary Cards -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6 space-y-4">
					<div>
						<p class="text-zinc-400 text-sm">Bill Amount</p>
						<p class="text-2xl font-bold text-white">{formatPeso(billAmount)}</p>
					</div>

					<div>
						<p class="text-zinc-400 text-sm">Tip ({finalTipPercentage}%)</p>
						<p class="text-2xl font-bold text-orange-500">{formatPeso(adjustedTipAmount)}</p>
					</div>

					<div class="border-t border-zinc-700/50 pt-4">
						<p class="text-zinc-400 text-sm">Total with Tip</p>
						<p class="text-3xl font-bold text-white">{formatPeso(totalWithTip)}</p>
					</div>

					{#if numPeople > 1}
						<div class="border-t border-zinc-700/50 pt-4">
							<p class="text-zinc-400 text-sm">Per Person</p>
							<p class="text-2xl font-bold text-orange-500">{formatPeso(perPersonAmount)}</p>
						</div>
					{/if}
				</div>

				<!-- Large Display -->
				{#if billAmount > 0}
					<div class="rounded-lg bg-orange-500/10 border border-orange-500/30 p-8 text-center">
						<p class="text-zinc-400 text-sm mb-2">Each person pays</p>
						<p class="text-4xl font-bold text-orange-500">{formatPeso(perPersonAmount)}</p>
					</div>
				{/if}

				<!-- Tipping Guide -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-4">
					<h3 class="text-sm font-medium text-white mb-3">Philippine Tipping Guide</h3>
					<div class="space-y-2 text-xs sm:text-sm text-zinc-400">
						<p>
							<strong class="text-white">Restaurants:</strong> 10-15% for good service is standard. Round up for casual dining.
						</p>
						<p>
							<strong class="text-white">Grab/Taxi Drivers:</strong> ₱20-50 is customary. More for long trips or help with luggage.
						</p>
						<p>
							<strong class="text-white">Hotels:</strong> Bell hop ₱50-100, housekeeper ₱50-100 per night.
						</p>
						<p>
							<strong class="text-white">Culture Note:</strong> Tipping is appreciated but not mandatory. Always tip in cash
							when possible.
						</p>
					</div>
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
