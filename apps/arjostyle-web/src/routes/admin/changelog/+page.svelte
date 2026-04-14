<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const changelog = [
    {
      version: data.version,
      date: new Date().toISOString().split('T')[0],
      commit: data.commitSha,
      changes: [
        { type: 'feat', label: 'Feature', color: '#4ade80', text: 'Added changelog page to admin panel' },
        { type: 'feat', label: 'Feature', color: '#4ade80', text: 'Added version + commit SHA display to admin layout footer' },
        { type: 'feat', label: 'Feature', color: '#4ade80', text: 'Added version + commit SHA to admin/login header' },
        { type: 'fix', label: 'Fix', color: '#f87171', text: 'Fixed TypeScript errors in admin/login page server' },
        { type: 'fix', label: 'Fix', color: '#f87171', text: 'Fixed accessibility warnings in admin/jobs page' },
      ]
    },
    {
      version: '0.1.0',
      date: '2025-01-01',
      commit: 'a1b2c3d',
      changes: [
        { type: 'feat', label: 'Feature', color: '#4ade80', text: 'Initial admin panel launch' },
        { type: 'feat', label: 'Feature', color: '#4ade80', text: 'Job tracking with source and keyword management' },
        { type: 'feat', label: 'Feature', color: '#4ade80', text: 'Marketing pipeline with lead scoring' },
        { type: 'feat', label: 'Feature', color: '#4ade80', text: '3D model viewer with Three.js integration' },
      ]
    }
  ];
</script>

<svelte:head>
  <title>Changelog | ArjoStyle Admin</title>
</svelte:head>

<div style="padding: 2rem; max-width: 900px; margin: 0 auto;">
  <div style="margin-bottom: 2rem;">
    <p style="font-size: 10px; font-family: monospace; letter-spacing: 0.2em; color: #71717a; text-transform: uppercase; margin-bottom: 4px;">
      ArjoStyle Admin
    </p>
    <h1 style="font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 0; letter-spacing: 0.05em;">
      Changelog
    </h1>
    <p style="color: #71717a; font-size: 0.875rem; margin-top: 0.5rem;">
      Version history and release notes for the admin panel
    </p>
  </div>

  <div style="position: relative; padding-left: 2rem;">
    <!-- Timeline line -->
    <div style="position: absolute; left: 7px; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.06);"></div>

    {#each changelog as release, i}
      <div style="position: relative; margin-bottom: 3rem;">
        <!-- Timeline dot -->
        <div style="position: absolute; left: -2rem; top: 1.5rem; width: 16px; height: 16px; border-radius: 50%; background: {i === 0 ? '#4ade80' : '#3f3f46'}; border: 2px solid {i === 0 ? '#4ade80' : '#27272a'}; box-shadow: {i === 0 ? '0 0 12px rgba(74,222,128,0.3)' : 'none'};"></div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 1rem; padding: 1.5rem;">
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.25rem; font-weight: 700; color: #fafafa; font-family: monospace;">
                v{release.version}
              </span>
              {#if i === 0}
                <span style="background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.2); color: #4ade80; font-size: 10px; font-family: monospace; letter-spacing: 0.1em; padding: 2px 8px; border-radius: 9999px; text-transform: uppercase;">
                  Latest
                </span>
              {/if}
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="color: #52525b; font-size: 0.75rem; font-family: monospace;">
                {release.date}
              </span>
              <span style="color: #3f3f46; font-size: 0.7rem; font-family: monospace; background: rgba(255,255,255,0.04); padding: 2px 6px; border-radius: 4px;">
                {release.commit}
              </span>
            </div>
          </div>

          <!-- Changes list -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            {#each release.changes as change}
              <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <span style="min-width: 48px; font-size: 10px; font-family: monospace; letter-spacing: 0.05em; padding: 2px 6px; border-radius: 4px; text-align: center; background: {change.color}15; border: 1px solid {change.color}30; color: {change.color}; text-transform: uppercase; font-weight: 600;">
                  {change.type}
                </span>
                <span style="color: #a1a1aa; font-size: 0.875rem; line-height: 1.5;">
                  {change.text}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
