<script lang="ts">
	import { enhance } from '$app/forms';
	import { ExternalLink, Clock, CheckCircle, XCircle, MessageSquare, Star, AlertCircle, Ghost, Trophy, Eye, Plus, Trash2, ToggleLeft, ToggleRight, Search, Tag } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let activeTab = $state<'jobs' | 'sources' | 'keywords' | 'tags'>('jobs');

	let newSource = $state({ name: '', baseUrl: '', searchPath: '' });
	let newKeyword = $state({ keyword: '', sourceId: '' });
	let newTag = $state({ name: '', color: '#fbbf24', category: '' });

	const fitConfig = [
		{ key: 'strong', label: 'Strong Fit', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24', dot: '#fbbf24' },
		{ key: 'good', label: 'Good Fit', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', text: '#4ade80', dot: '#4ade80' },
		{ key: 'stretch', label: 'Stretch', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', text: '#60a5fa', dot: '#60a5fa' },
		{ key: 'weak', label: 'Weak Fit', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', text: '#f87171', dot: '#f87171' }
	];

	const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
		new: { label: 'New', icon: Clock, color: '#fbbf24' },
		viewed: { label: 'Viewed', icon: Eye, color: '#60a5fa' },
		applied: { label: 'Applied', icon: CheckCircle, color: '#4ade80' },
		screening: { label: 'Screening', icon: MessageSquare, color: '#c084fc' },
		interview: { label: 'Interview', icon: Trophy, color: '#fbbf24' },
		offer: { label: 'Offer', icon: Star, color: '#4ade80' },
		rejected: { label: 'Rejected', icon: XCircle, color: '#f87171' },
		ghosted: { label: 'Ghosted', icon: Ghost, color: '#a1a1aa' }
	};

	const sourceColors: Record<string, string> = {
		hackernews: '#f97316',
		weworkremotely: '#3b82f6',
		remoteok: '#1a1a1a',
		remotive: '#6b7280',
		arcdev: '#8b5cf6',
		linkedin: '#0077b5',
		other: '#6b7280'
	};

	function getJobsByFit(fit: string) {
		return (data.jobs || []).filter((j: any) => j.fit === fit);
	}

	let totalCount = $derived((data.jobs || []).length);
	let strongCount = $derived(getJobsByFit('strong').length);
	let newCount = $derived(getJobsByFit('strong').length + getJobsByFit('good').length);

	function handleStatusUpdate(jobId: string, status: string) {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/updateStatus';
		const idInput = document.createElement('input');
		idInput.name = 'id';
		idInput.value = jobId;
		form.appendChild(idInput);
		const statusInput = document.createElement('input');
		statusInput.name = 'status';
		statusInput.value = status;
		form.appendChild(statusInput);
		document.body.appendChild(form);
		form.submit();
	}
</script>

<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;">

	<div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
		<div>
			<p style="font-size: 10px; font-family: monospace; letter-spacing: 0.2em; color: #71717a; text-transform: uppercase; margin-bottom: 4px;">
				Career Ops
			</p>
			<h1 style="font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 0; letter-spacing: 0.05em;">
				Job Tracker
			</h1>
		</div>

		<div style="display: flex; gap: 0.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 0.75rem; padding: 4px;">
			<button
				type="button"
				onclick={() => activeTab = 'jobs'}
				style="padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 12px; font-family: monospace; font-weight: 500; transition: all 150ms; border: none; cursor: pointer; background: {activeTab === 'jobs' ? 'rgba(245,158,11,0.15)' : 'transparent'}; color: {activeTab === 'jobs' ? '#fbbf24' : '#71717a'};"
			>
				Jobs ({totalCount})
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'sources'}
				style="padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 12px; font-family: monospace; font-weight: 500; transition: all 150ms; border: none; cursor: pointer; background: {activeTab === 'sources' ? 'rgba(245,158,11,0.15)' : 'transparent'}; color: {activeTab === 'sources' ? '#fbbf24' : '#71717a'};"
			>
				Sources ({(data.sources || []).length})
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'keywords'}
				style="padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 12px; font-family: monospace; font-weight: 500; transition: all 150ms; border: none; cursor: pointer; background: {activeTab === 'keywords' ? 'rgba(245,158,11,0.15)' : 'transparent'}; color: {activeTab === 'keywords' ? '#fbbf24' : '#71717a'};"
			>
				Keywords ({(data.keywords || []).length})
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'tags'}
				style="padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 12px; font-family: monospace; font-weight: 500; transition: all 150ms; border: none; cursor: pointer; background: {activeTab === 'tags' ? 'rgba(245,158,11,0.15)' : 'transparent'}; color: {activeTab === 'tags' ? '#fbbf24' : '#71717a'};"
			>
				Tags ({(data.tags || []).length})
			</button>
		</div>
	</div>

	{#if activeTab === 'jobs'}
		<div style="display: flex; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
			<div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 0.75rem; padding: 0.75rem 1rem; text-align: right;">
				<p style="font-size: 10px; font-family: monospace; letter-spacing: 0.1em; color: #71717a; text-transform: uppercase; margin-bottom: 2px;">Strong</p>
				<p style="font-size: 1.25rem; font-weight: 700; font-family: monospace; color: #fbbf24; margin: 0;">{strongCount}</p>
			</div>
			<div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 0.75rem; padding: 0.75rem 1rem; text-align: right;">
				<p style="font-size: 10px; font-family: monospace; letter-spacing: 0.1em; color: #71717a; text-transform: uppercase; margin-bottom: 2px;">New</p>
				<p style="font-size: 1.25rem; font-weight: 700; font-family: monospace; color: #4ade80; margin: 0;">{newCount}</p>
			</div>
		</div>

		<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; min-width: 0;">
			{#each fitConfig as fit (fit.key)}
				{@const jobs = getJobsByFit(fit.key)}
				<div style="background: {fit.bg}; border: 1px solid {fit.border}; border-radius: 0.75rem; display: flex; flex-direction: column; min-height: 500px; overflow: hidden;">
					<div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
						<span style="width: 8px; height: 8px; border-radius: 50%; background: {fit.dot}; flex-shrink: 0;"></span>
						<span style="font-size: 11px; font-family: monospace; font-weight: 600; color: {fit.text}; text-transform: uppercase; letter-spacing: 0.1em;">{fit.label}</span>
						<span style="margin-left: auto; font-size: 11px; font-family: monospace; color: #71717a; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 9999px;">{jobs.length}</span>
					</div>

					<div style="flex: 1; overflow-y: auto; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.625rem;">
						{#each jobs as job (job.id)}
							<div role="listitem" style="background: rgba(24,24,27,0.8); border: 1px solid rgba(255,255,255,0.06); border-radius: 0.625rem; padding: 0.875rem; transition: all 150ms;"
								onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.3)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'; }}
								onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
								<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
									<span style="font-size: 11px; font-family: monospace; font-weight: 700; color: #e4e4e7; letter-spacing: 0.05em;">{job.company}</span>
									<span style="font-size: 9px; font-family: monospace; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: {(sourceColors[job.source] || '#6b7280')}22; color: {sourceColors[job.source] || '#6b7280'}; border: 1px solid {(sourceColors[job.source] || '#6b7280')}44; letter-spacing: 0.05em;">{job.source}</span>
								</div>
								<p style="font-size: 12px; font-weight: 500; color: #fafafa; line-height: 1.4; margin: 0 0 8px 0;">{job.title}</p>
								{#if job.yourTags}
									<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
										{#each job.yourTags.split(',').map((t: string) => t.trim()) as tag}
											<span style="font-size: 9px; font-family: monospace; background: rgba(245,158,11,0.1); color: #fbbf24; padding: 2px 6px; border-radius: 3px; border: 1px solid rgba(245,158,11,0.2);">{tag}</span>
										{/each}
									</div>
								{/if}
								{#if job.payRange || job.remote || job.jobType}
									<div style="font-size: 10px; font-family: monospace; color: #71717a; margin-bottom: 8px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
										{#if job.payRange}<span style="color: #4ade80; font-weight: 600;">{job.payRange}</span>{/if}
										{#if job.payRange && job.remote}<span>·</span>{/if}
										{#if job.remote}<span>{job.remote}</span>{/if}
									</div>
								{/if}
								<div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05);">
									<span style="font-size: 10px; font-family: monospace; color: {statusConfig[job.status]?.color || '#71717a'}; display: flex; align-items: center; gap: 4px;">{statusConfig[job.status]?.label || job.status}</span>
									<a href={job.url} target="_blank" rel="noopener noreferrer" style="font-size: 10px; font-family: monospace; font-weight: 600; color: #fbbf24; text-decoration: none; display: flex; align-items: center; gap: 3px;">Apply <ExternalLink size={10} /></a>
								</div>
							</div>
						{/each}
						{#if jobs.length === 0}
							<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1rem; text-align: center;">
								<p style="font-size: 11px; font-family: monospace; color: #3f3f46;">No {fit.label.toLowerCase()} jobs</p>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if activeTab === 'sources'}
		<div style="background: rgba(24,24,27,0.8); border: 1px solid rgba(255,255,255,0.06); border-radius: 0.75rem; padding: 1.5rem;">
			<h2 style="font-size: 14px; font-weight: 600; color: #fafafa; margin: 0 0 1rem 0; font-family: monospace;">Add Job Source</h2>
			<form method="POST" action="?/addSource" use:enhance style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-end; margin-bottom: 1.5rem;">
				<div>
					<label for="source-name" style="font-size: 10px; font-family: monospace; color: #71717a; text-transform: uppercase; display: block; margin-bottom: 4px;">Name</label>
					<input id="source-name" type="text" name="name" placeholder="HackerNews" required style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: #fafafa; font-size: 13px; font-family: monospace; width: 140px;" />
				</div>
				<div>
					<label for="source-base-url" style="font-size: 10px; font-family: monospace; color: #71717a; text-transform: uppercase; display: block; margin-bottom: 4px;">Base URL</label>
					<input id="source-base-url" type="url" name="baseUrl" placeholder="https://news.ycombinator.com" required style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: #fafafa; font-size: 13px; font-family: monospace; width: 260px;" />
				</div>
				<div>
					<label for="source-search-path" style="font-size: 10px; font-family: monospace; color: #71717a; text-transform: uppercase; display: block; margin-bottom: 4px;">Search Path</label>
					<input id="source-search-path" type="text" name="searchPath" placeholder="/jobs?search=" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: #fafafa; font-size: 13px; font-family: monospace; width: 160px;" />
				</div>
				<button type="submit" style="background: #fbbf24; color: #000; border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; font-size: 12px; font-weight: 600; font-family: monospace; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
					<Plus size={14} /> Add
				</button>
			</form>

			<div style="display: grid; gap: 0.5rem;">
				{#each (data.sources || []) as source (source.id)}
					<div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 0.5rem;">
						<div style="display: flex; align-items: center; gap: 1rem;">
							<span style="width: 8px; height: 8px; border-radius: 50%; background: {source.isActive ? '#4ade80' : '#52525b'}; flex-shrink: 0;"></span>
							<div>
								<p style="font-size: 13px; font-weight: 600; color: #fafafa; margin: 0; font-family: monospace;">{source.name}</p>
								<p style="font-size: 11px; color: #71717a; margin: 2px 0 0 0; font-family: monospace;">{source.baseUrl}{source.searchPath || ''}</p>
							</div>
						</div>
						<div style="display: flex; align-items: center; gap: 0.5rem;">
							<form method="POST" action="?/toggleSource" use:enhance>
								<input type="hidden" name="id" value={source.id} />
								<input type="hidden" name="isActive" value={String(source.isActive)} />
								<button type="submit" title={source.isActive ? 'Disable' : 'Enable'} style="background: transparent; border: none; cursor: pointer; color: {source.isActive ? '#4ade80' : '#52525b'}; padding: 0.25rem;">
									{#if source.isActive}<ToggleRight size={20} />{:else}<ToggleLeft size={20} />{/if}
								</button>
							</form>
							<form method="POST" action="?/deleteSource" use:enhance>
								<input type="hidden" name="id" value={source.id} />
								<button type="submit" title="Delete" onclick={(e) => { if (!confirm('Delete this source?')) e.preventDefault(); }} style="background: transparent; border: none; cursor: pointer; color: #ef4444; padding: 0.25rem;">
									<Trash2 size={16} />
								</button>
							</form>
						</div>
					</div>
				{/each}
				{#if (data.sources || []).length === 0}
					<p style="font-size: 12px; color: #52525b; font-family: monospace; text-align: center; padding: 2rem;">No sources configured</p>
				{/if}
			</div>
		</div>
	{/if}

	{#if activeTab === 'keywords'}
		<div style="background: rgba(24,24,27,0.8); border: 1px solid rgba(255,255,255,0.06); border-radius: 0.75rem; padding: 1.5rem;">
			<h3 style="font-size: 14px; font-weight: 600; color: #fafafa; margin: 0 0 1rem 0; font-family: monospace;">Add Search Keyword</h3>
			<form method="POST" action="?/addKeyword" use:enhance style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-end; margin-bottom: 1.5rem;">
				<div>
					<label for="keyword-input" style="font-size: 10px; font-family: monospace; color: #71717a; text-transform: uppercase; display: block; margin-bottom: 4px;">Keyword</label>
					<input id="keyword-input" type="text" name="keyword" placeholder="full-stack engineer" required style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: #fafafa; font-size: 13px; font-family: monospace; width: 200px;" />
				</div>
				<div>
					<label for="keyword-source" style="font-size: 10px; font-family: monospace; color: #71717a; text-transform: uppercase; display: block; margin-bottom: 4px;">Source (optional)</label>
					<select id="keyword-source" name="sourceId" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: #fafafa; font-size: 13px; font-family: monospace; min-width: 160px;">
						<option value="">Any source</option>
						{#each (data.sources || []) as source}
							<option value={source.id}>{source.name}</option>
						{/each}
					</select>
				</div>
				<button type="submit" style="background: #fbbf24; color: #000; border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; font-size: 12px; font-weight: 600; font-family: monospace; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
					<Plus size={14} /> Add
				</button>
			</form>

			<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
				{#each (data.keywords || []) as kw (kw.id)}
					<div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 9999px;">
						<Search size={12} style="color: #71717a;" />
						<span style="font-size: 12px; color: #fafafa; font-family: monospace;">{kw.keyword}</span>
						{#if kw.sourceId}
							{@const src = (data.sources || []).find((s: any) => s.id === kw.sourceId)}
							{#if src}
								<span style="font-size: 10px; color: #71717a; font-family: monospace;">({src.name})</span>
							{/if}
						{/if}
						<form method="POST" action="?/deleteKeyword" use:enhance style="display: inline;">
							<input type="hidden" name="id" value={kw.id} />
							<button type="submit" style="background: transparent; border: none; cursor: pointer; color: #ef4444; padding: 0; display: flex; align-items: center;">
								<Trash2 size={12} />
							</button>
						</form>
					</div>
				{/each}
				{#if (data.keywords || []).length === 0}
					<p style="font-size: 12px; color: #52525b; font-family: monospace; width: 100%; text-align: center; padding: 2rem;">No keywords configured</p>
				{/if}
			</div>
		</div>
	{/if}

	{#if activeTab === 'tags'}
		<div style="background: rgba(24,24,27,0.8); border: 1px solid rgba(255,255,255,0.06); border-radius: 0.75rem; padding: 1.5rem;">
			<h3 style="font-size: 14px; font-weight: 600; color: #fafafa; margin: 0 0 1rem 0; font-family: monospace;">Add Job Tag</h3>
			<form method="POST" action="?/addTag" use:enhance style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-end; margin-bottom: 1.5rem;">
				<div>
					<label for="tag-name" style="font-size: 10px; font-family: monospace; color: #71717a; text-transform: uppercase; display: block; margin-bottom: 4px;">Tag Name</label>
					<input id="tag-name" type="text" name="name" placeholder="SvelteKit" required style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: #fafafa; font-size: 13px; font-family: monospace; width: 140px;" />
				</div>
				<div>
					<label for="tag-color" style="font-size: 10px; font-family: monospace; color: #71717a; text-transform: uppercase; display: block; margin-bottom: 4px;">Color</label>
					<input id="tag-color" type="color" name="color" value="#fbbf24" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.25rem; width: 60px; height: 38px; cursor: pointer;" />
				</div>
				<div>
					<label for="tag-category" style="font-size: 10px; font-family: monospace; color: #71717a; text-transform: uppercase; display: block; margin-bottom: 4px;">Category</label>
					<input id="tag-category" type="text" name="category" placeholder="tech, role, domain" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: #fafafa; font-size: 13px; font-family: monospace; width: 140px;" />
				</div>
				<button type="submit" style="background: #fbbf24; color: #000; border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; font-size: 12px; font-weight: 600; font-family: monospace; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
					<Tag size={14} /> Add
				</button>
			</form>

			<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
				{#each (data.tags || []) as tag (tag.id)}
					<div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: {tag.color}15; border: 1px solid {tag.color}40; border-radius: 9999px;">
						<span style="width: 8px; height: 8px; border-radius: 50%; background: {tag.color}; flex-shrink: 0;"></span>
						<span style="font-size: 12px; color: {tag.color}; font-family: monospace; font-weight: 500;">{tag.name}</span>
						{#if tag.category}
							<span style="font-size: 10px; color: #71717a; font-family: monospace;">({tag.category})</span>
						{/if}
						<form method="POST" action="?/deleteTag" use:enhance style="display: inline;">
							<input type="hidden" name="id" value={tag.id} />
							<button type="submit" style="background: transparent; border: none; cursor: pointer; color: #ef4444; padding: 0; display: flex; align-items: center;">
								<Trash2 size={12} />
							</button>
						</form>
					</div>
				{/each}
				{#if (data.tags || []).length === 0}
					<p style="font-size: 12px; color: #52525b; font-family: monospace; width: 100%; text-align: center; padding: 2rem;">No tags configured</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
