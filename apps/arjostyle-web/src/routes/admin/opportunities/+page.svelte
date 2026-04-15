<script lang="ts">
	import { ExternalLink, Clock, CheckCircle, XCircle, MessageSquare, Star, AlertCircle, Ghost, Trophy, Eye, Filter, Search, X, ChevronDown, Briefcase, TrendingUp, Zap } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedFit = $state<string | null>(null);
	let selectedSource = $state<string | null>(null);
	let selectedStatus = $state<string | null>(null);
	let showFilters = $state(false);
	let selectedOpp = $state<any>(null);

	const fitConfig = [
		{ key: 'strong', label: 'Strong Fit', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24', dot: '#fbbf24', badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
		{ key: 'good', label: 'Good Fit', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', text: '#4ade80', dot: '#4ade80', badge: 'bg-green-500/10 border-green-500/30 text-green-400' },
		{ key: 'stretch', label: 'Stretch', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', text: '#60a5fa', dot: '#60a5fa', badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
		{ key: 'weak', label: 'Weak Fit', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', text: '#f87171', dot: '#f87171', badge: 'bg-red-500/10 border-red-500/30 text-red-400' },
	];

	const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
		new: { label: 'New', icon: Clock, color: '#fbbf24', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
		viewed: { label: 'Viewed', icon: Eye, color: '#60a5fa', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
		applied: { label: 'Applied', icon: CheckCircle, color: '#4ade80', bg: 'bg-green-500/10 border-green-500/30 text-green-400' },
		screening: { label: 'Screening', icon: MessageSquare, color: '#c084fc', bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
		interview: { label: 'Interview', icon: Trophy, color: '#fbbf24', bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
		offer: { label: 'Offer', icon: Star, color: '#4ade80', bg: 'bg-green-500/10 border-green-500/30 text-green-400' },
		rejected: { label: 'Rejected', icon: XCircle, color: '#f87171', bg: 'bg-red-500/10 border-red-500/30 text-red-400' },
		ghosted: { label: 'Ghosted', icon: Ghost, color: '#a1a1aa', bg: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400' },
	};

	const sourceConfig: Record<string, { label: string; color: string }> = {
		hackernews: { label: 'YC HN', color: '#f97316' },
		weworkremotely: { label: 'WWR', color: '#3b82f6' },
		remoteok: { label: 'RemoteOK', color: '#1a1a1a' },
		remotive: { label: 'Remotive', color: '#6b7280' },
		arcdev: { label: 'Arc.dev', color: '#8b5cf6' },
		linkedin: { label: 'LinkedIn', color: '#0077b5' },
		other: { label: 'Other', color: '#6b7280' },
	};

	let filteredOpps = $derived.by(() => {
		return (data.opportunities || []).filter((opp: any) => {
			const q = searchQuery.toLowerCase();
			const matchesSearch =
				!q ||
				opp.title?.toLowerCase().includes(q) ||
				opp.company?.toLowerCase().includes(q) ||
				opp.yourTags?.toLowerCase().includes(q) ||
				opp.notes?.toLowerCase().includes(q);

			const matchesFit = !selectedFit || opp.fit === selectedFit;
			const matchesSource = !selectedSource || opp.source === selectedSource;
			const matchesStatus = !selectedStatus || opp.status === selectedStatus;

			return matchesSearch && matchesFit && matchesSource && matchesStatus;
		});
	});

	let stats = $derived.by(() => {
		const opps = data.opportunities || [];
		const strong = opps.filter((o: any) => o.fit === 'strong').length;
		const applied = opps.filter((o: any) => o.status === 'applied' || o.status === 'interview' || o.status === 'offer').length;
		const newCount = opps.filter((o: any) => o.status === 'new').length;
		const total = opps.length;
		return { strong, applied, newCount, total };
	});

	function getFitConfig(fit: string | null) {
		return fitConfig.find((f) => f.key === fit) || fitConfig[3];
	}

	function clearFilters() {
		selectedFit = null;
		selectedSource = null;
		selectedStatus = null;
		searchQuery = '';
	}

	let hasActiveFilters = $derived(!!selectedFit || !!selectedSource || !!selectedStatus || !!searchQuery);
</script>

<div class="min-h-screen bg-[#09090b] text-zinc-100">
	<!-- Header -->
	<div class="border-b border-zinc-800/60 bg-[#09090b] px-6 py-5">
		<div class="max-w-[1600px] mx-auto">
			<div class="flex items-center justify-between mb-1">
				<div>
					<p class="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-1">Career Ops</p>
					<h1 class="text-2xl font-bold text-white font-display tracking-wide">Opportunities</h1>
				</div>
				<div class="flex items-center gap-3">
					<span class="text-xs font-mono text-zinc-500">{filteredOpps.length} of {data.opportunities?.length || 0}</span>
					<button
						onclick={() => { showFilters = !showFilters; }}
						class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all"
						style="background: {showFilters ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)'}; border-color: {showFilters ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}; color: {showFilters ? '#fbbf24' : '#71717a'};"
					>
						<Filter size={13} />
						Filters
						{#if hasActiveFilters}
							<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
						{/if}
					</button>
				</div>
			</div>

			<!-- Stats row -->
			<div class="flex items-center gap-3 mt-4">
				<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25">
					<Zap size={12} class="text-amber-400" />
					<span class="text-xs font-mono text-amber-400 font-semibold">{stats.strong} Strong</span>
				</div>
				<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25">
					<Briefcase size={12} class="text-blue-400" />
					<span class="text-xs font-mono text-blue-400 font-semibold">{stats.total} Total</span>
				</div>
				<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/25">
					<TrendingUp size={12} class="text-green-400" />
					<span class="text-xs font-mono text-green-400 font-semibold">{stats.applied} In Process</span>
				</div>
				<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/40">
					<Clock size={12} class="text-zinc-400" />
					<span class="text-xs font-mono text-zinc-400">{stats.newCount} New</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Search bar (always visible) -->
	<div class="border-b border-zinc-800/60 px-6 py-3">
		<div class="max-w-[1600px] mx-auto">
			<div class="relative">
				<Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search by title, company, or tags..."
					class="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 font-mono focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-all"
				/>
				{#if searchQuery}
					<button onclick={() => { searchQuery = ''; }} class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
						<X size={13} />
					</button>
				{/if}
			</div>

			<!-- Filter row -->
			{#if showFilters}
				<div class="flex items-center gap-3 mt-3 flex-wrap">
					<span class="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Fit:</span>
					{#each fitConfig as fit}
						<button
							onclick={() => { selectedFit = selectedFit === fit.key ? null : fit.key; }}
							class="px-3 py-1 rounded-full text-[11px] font-mono border transition-all"
							style="background: {selectedFit === fit.key ? fit.bg : 'transparent'}; border-color: {selectedFit === fit.key ? fit.border : 'rgba(255,255,255,0.08)'}; color: {selectedFit === fit.key ? fit.text : '#71717a'};"
						>
							{fit.label}
						</button>
					{/each}

					<div class="h-4 w-px bg-zinc-800 mx-1"></div>
					<span class="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Source:</span>
					{#each Object.entries(sourceConfig) as [key, src]}
						<button
							onclick={() => { selectedSource = selectedSource === key ? null : key; }}
							class="px-3 py-1 rounded-full text-[11px] font-mono border transition-all"
							style="background: {selectedSource === key ? src.color + '22' : 'transparent'}; border-color: {selectedSource === key ? src.color + '55' : 'rgba(255,255,255,0.08)'}; color: {selectedSource === key ? src.color : '#71717a'};"
						>
							{src.label}
						</button>
					{/each}

					<div class="h-4 w-px bg-zinc-800 mx-1"></div>
					<span class="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Status:</span>
					{#each Object.entries(statusConfig) as [key, st]}
						<button
							onclick={() => { selectedStatus = selectedStatus === key ? null : key; }}
							class="px-3 py-1 rounded-full text-[11px] font-mono border transition-all"
							style="background: {selectedStatus === key ? st.color + '18' : 'transparent'}; border-color: {selectedStatus === key ? st.color + '44' : 'rgba(255,255,255,0.08)'}; color: {selectedStatus === key ? st.color : '#71717a'};"
						>
							{st.label}
						</button>
					{/each}

					{#if hasActiveFilters}
						<button onclick={clearFilters} class="ml-auto px-3 py-1 rounded-full text-[11px] font-mono text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all">
							Clear all
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Main content: list + detail panel -->
	<div class="flex h-[calc(100vh-160px)]">
		<!-- Opportunities list -->
		<div class="flex-1 overflow-y-auto">
			<div class="max-w-[1600px] mx-auto p-6">
				{#if data.error}
					<div class="flex flex-col items-center justify-center py-20 text-center">
						<AlertCircle size={32} class="text-red-400 mb-3" />
						<p class="text-zinc-400 font-mono text-sm">{data.error}</p>
					</div>
				{:else if filteredOpps.length === 0}
					<div class="flex flex-col items-center justify-center py-20 text-center">
						<Briefcase size={32} class="text-zinc-600 mb-3" />
						<p class="text-zinc-500 font-mono text-sm">
							{hasActiveFilters ? 'No opportunities match your filters' : 'No opportunities found in Neon'}
						</p>
						{#if hasActiveFilters}
							<button onclick={clearFilters} class="mt-3 text-amber-400 font-mono text-xs hover:underline">Clear filters</button>
						{/if}
					</div>
				{:else}
					<div class="space-y-2">
						{#each filteredOpps as opp (opp.id)}
							{@const fit = getFitConfig(opp.fit)}
							{@const source = sourceConfig[opp.source] || sourceConfig.other}
							{@const status = statusConfig[opp.status] || statusConfig.new}
							<button
								onclick={() => { selectedOpp = selectedOpp?.id === opp.id ? null : opp; }}
								class="w-full text-left rounded-xl border transition-all duration-150 overflow-hidden"
								style="background: {selectedOpp?.id === opp.id ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)'}; border-color: {selectedOpp?.id === opp.id ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.06)'};"
							>
								<div class="p-4">
									<div class="flex items-start justify-between gap-3">
										<div class="flex-1 min-w-0">
											<div class="flex items-center gap-2 mb-1 flex-wrap">
												<span class="font-mono font-bold text-sm text-zinc-200">{opp.company}</span>
												<span
													class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold border"
													style="background: {source.color}18; border-color: {source.color}44; color: {source.color};"
												>
													{source.label}
												</span>
												<span
													class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold border"
													style="background: {fit.bg}; border-color: {fit.border}; color: {fit.text};"
												>
													{fit.label}
												</span>
											</div>
											<p class="text-sm font-medium text-white mb-2 leading-snug">{opp.title}</p>

											<div class="flex items-center gap-3 flex-wrap">
												{#if opp.payRange}
													<span class="text-xs font-mono text-green-400 font-semibold">{opp.payRange}</span>
												{/if}
												{#if opp.remote && opp.remote !== 'Unknown'}
													<span class="text-xs font-mono text-zinc-500">{opp.remote}</span>
												{/if}
												{#if opp.location && opp.location !== 'Unknown'}
													<span class="text-xs font-mono text-zinc-500">{opp.location}</span>
												{/if}
												{#if opp.jobType}
													<span class="text-xs font-mono text-zinc-600">{opp.jobType}</span>
												{/if}
											</div>

											{#if opp.yourTags}
												<div class="flex flex-wrap gap-1.5 mt-2.5">
													{#each opp.yourTags.split(',').map((t: string) => t.trim()).filter(Boolean) as tag}
														<span class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 border border-amber-500/25 text-amber-400/80">{tag}</span>
													{/each}
												</div>
											{/if}
										</div>

										<div class="flex flex-col items-end gap-2 shrink-0">
											<span
												class="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border"
												style="background: {status.bg.replace('border', 'bg').split(' ')[0]}18; {status.bg.includes('border') ? '' : 'background: rgba(255,255,255,0.04);'}; border-color: {status.color}44; color: {status.color};"
											>
												{status.label}
											</span>
											{#if opp.appliedAt}
												<span class="text-[10px] font-mono text-zinc-600">
													Applied {new Date(opp.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
												</span>
											{/if}
											<ChevronDown
												size={14}
												class="transition-transform duration-200 text-zinc-600"
												style="transform: rotate({selectedOpp?.id === opp.id ? '180deg' : '0deg'});"
											/>
										</div>
									</div>

									<!-- Expanded detail -->
									{#if selectedOpp?.id === opp.id}
										<div class="mt-4 pt-4 border-t border-zinc-800/60 grid grid-cols-1 md:grid-cols-2 gap-4">
											{#if opp.fitSummary}
												<div>
													<p class="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-1.5">Fit Analysis</p>
													<p class="text-xs font-mono text-zinc-300 leading-relaxed">{opp.fitSummary}</p>
												</div>
											{/if}
											{#if opp.notes}
												<div>
													<p class="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-1.5">Notes</p>
													<p class="text-xs font-mono text-zinc-300 leading-relaxed">{opp.notes}</p>
												</div>
											{/if}
											{#if opp.jdSnippet}
												<div class="md:col-span-2">
													<p class="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-1.5">JD Snippet</p>
													<p class="text-xs font-mono text-zinc-400 leading-relaxed italic">"{opp.jdSnippet}"</p>
												</div>
											{/if}
											<div class="flex items-center gap-3 md:col-span-2">
												<a
													href={opp.url}
													target="_blank"
													rel="noopener noreferrer"
													class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-mono font-semibold hover:bg-amber-500/25 transition-all"
													onclick={(e) => e.stopPropagation()}
												>
													<ExternalLink size={13} />
													Apply / View Listing
												</a>
												{#if opp.foundAt}
													<span class="text-[11px] font-mono text-zinc-600">
														Found {new Date(opp.foundAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
													</span>
												{/if}
											</div>
										</div>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
