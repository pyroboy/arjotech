<script lang="ts">
	import { ExternalLink, Clock, CheckCircle, XCircle, MessageSquare, Star, AlertCircle, Ghost, Trophy, Eye } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const fitConfig = [
		{
			key: 'strong',
			label: 'Strong Fit',
			bg: 'rgba(245,158,11,0.08)',
			border: 'rgba(245,158,11,0.25)',
			text: '#fbbf24',
			dot: '#fbbf24'
		},
		{
			key: 'good',
			label: 'Good Fit',
			bg: 'rgba(34,197,94,0.08)',
			border: 'rgba(34,197,94,0.25)',
			text: '#4ade80',
			dot: '#4ade80'
		},
		{
			key: 'stretch',
			label: 'Stretch',
			bg: 'rgba(59,130,246,0.08)',
			border: 'rgba(59,130,246,0.25)',
			text: '#60a5fa',
			dot: '#60a5fa'
		},
		{
			key: 'weak',
			label: 'Weak Fit',
			bg: 'rgba(239,68,68,0.08)',
			border: 'rgba(239,68,68,0.25)',
			text: '#f87171',
			dot: '#f87171'
		}
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

	const sourceLabels: Record<string, string> = {
		hackernews: 'HN',
		weworkremotely: 'WWR',
		remoteok: 'RemoteOK',
		remotive: 'Remotive',
		arcdev: 'Arc.dev',
		linkedin: 'LinkedIn',
		other: 'Other'
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
</script>

<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;">

	<!-- Header -->
	<div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap;">
		<div>
			<p style="font-size: 10px; font-family: monospace; letter-spacing: 0.2em; color: #71717a; text-transform: uppercase; margin-bottom: 4px;">
				Career Ops
			</p>
			<h1 style="font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 0; letter-spacing: 0.05em;">
				Job Tracker
			</h1>
			<p style="color: #71717a; font-size: 0.8rem; font-family: monospace; margin-top: 4px;">
				{totalCount} opportunities found today &mdash; {strongCount} strong fit
			</p>
		</div>

		<div style="display: flex; gap: 0.75rem; flex-shrink: 0;">
			<div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 0.75rem; padding: 0.75rem 1rem; text-align: right;">
				<p style="font-size: 10px; font-family: monospace; letter-spacing: 0.1em; color: #71717a; text-transform: uppercase; margin-bottom: 2px;">Strong</p>
				<p style="font-size: 1.25rem; font-weight: 700; font-family: monospace; color: #fbbf24; margin: 0;">{strongCount}</p>
			</div>
			<div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 0.75rem; padding: 0.75rem 1rem; text-align: right;">
				<p style="font-size: 10px; font-family: monospace; letter-spacing: 0.1em; color: #71717a; text-transform: uppercase; margin-bottom: 2px;">New</p>
				<p style="font-size: 1.25rem; font-weight: 700; font-family: monospace; color: #4ade80; margin: 0;">{newCount}</p>
			</div>
		</div>
	</div>

	<!-- Kanban columns -->
	<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; min-width: 0;">
		{#each fitConfig as fit (fit.key)}
			{@const jobs = getJobsByFit(fit.key)}
			<div style="background: {fit.bg}; border: 1px solid {fit.border}; border-radius: 0.75rem; display: flex; flex-direction: column; min-height: 500px; overflow: hidden;">

				<!-- Column header -->
				<div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
					<span style="width: 8px; height: 8px; border-radius: 50%; background: {fit.dot}; flex-shrink: 0;"></span>
					<span style="font-size: 11px; font-family: monospace; font-weight: 600; color: {fit.text}; text-transform: uppercase; letter-spacing: 0.1em;">
						{fit.label}
					</span>
					<span style="margin-left: auto; font-size: 11px; font-family: monospace; color: #71717a; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 9999px;">
						{jobs.length}
					</span>
				</div>

				<!-- Cards -->
				<div style="flex: 1; overflow-y: auto; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.625rem;">
					{#each jobs as job (job.id)}
						<div style="
							background: rgba(24,24,27,0.8);
							border: 1px solid rgba(255,255,255,0.06);
							border-radius: 0.625rem;
							padding: 0.875rem;
							transition: all 150ms ease;
							cursor: default;
						"
						onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.3)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'; }}
						onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
						>
							<!-- Company + source -->
							<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
								<span style="font-size: 11px; font-family: monospace; font-weight: 700; color: #e4e4e7; letter-spacing: 0.05em;">
									{job.company}
								</span>
								<span style="
									font-size: 9px;
									font-family: monospace;
									font-weight: 600;
									padding: 2px 6px;
									border-radius: 4px;
									background: {sourceColors[job.source] || '#6b7280'}22;
									color: {sourceColors[job.source] || '#6b7280'};
									border: 1px solid {sourceColors[job.source] || '#6b7280'}44;
									letter-spacing: 0.05em;
								">
									{sourceLabels[job.source] || job.source}
								</span>
							</div>

							<!-- Title -->
							<p style="font-size: 12px; font-weight: 500; color: #fafafa; line-height: 1.4; margin: 0 0 8px 0;">
								{job.title}
							</p>

							<!-- Tags -->
							{#if job.yourTags}
								<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
									{#each job.yourTags.split(',').map((t: string) => t.trim()) as tag}
										<span style="font-size: 9px; font-family: monospace; background: rgba(245,158,11,0.1); color: #fbbf24; padding: 2px 6px; border-radius: 3px; border: 1px solid rgba(245,158,11,0.2);">
											{tag}
										</span>
									{/each}
								</div>
							{/if}

							<!-- Pay + Remote + Type -->
							{#if job.payRange || job.remote || job.jobType}
								<div style="font-size: 10px; font-family: monospace; color: #71717a; margin-bottom: 8px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
									{#if job.payRange}
										<span style="color: #4ade80; font-weight: 600;">{job.payRange}</span>
									{/if}
									{#if job.remote}
										{#if job.payRange}<span>·</span>{/if}
										<span>{job.remote}</span>
									{/if}
									{#if job.jobType}
										{#if job.payRange || job.remote}<span>·</span>{/if}
										<span>{job.jobType}</span>
									{/if}
								</div>
							{/if}

							<!-- Fit summary -->
							{#if job.fitSummary}
								<p style="font-size: 10px; color: #52525b; font-family: monospace; font-style: italic; margin: 0 0 8px 0; line-height: 1.4;">
									"{job.fitSummary}"
								</p>
							{/if}

							<!-- JD snippet -->
							{#if job.jdSnippet}
								<p style="font-size: 9px; color: #3f3f46; font-family: monospace; margin: 0 0 8px 0; line-height: 1.4;">
									&ldquo;{job.jdSnippet}&rdquo;
								</p>
							{/if}

							<!-- Status + Apply -->
							<div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05);">
								<span style="font-size: 10px; font-family: monospace; color: {statusConfig[job.status]?.color || '#71717a'}; display: flex; align-items: center; gap: 4px;">
									<Clock size={10} />
									{statusConfig[job.status]?.label || job.status}
								</span>
								<a
									href={job.url}
									target="_blank"
									rel="noopener noreferrer"
									style="
										font-size: 10px;
										font-family: monospace;
										font-weight: 600;
										color: #fbbf24;
										text-decoration: none;
										display: flex;
										align-items: center;
										gap: 3px;
										transition: color 150ms ease;
									"
									onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f59e0b'; }}
									onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.color = '#fbbf24'; }}
								>
									Apply
									<ExternalLink size={10} />
								</a>
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
</div>
