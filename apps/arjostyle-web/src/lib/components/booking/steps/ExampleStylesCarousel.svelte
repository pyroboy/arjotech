<script lang="ts">
	import { TATTOO_STYLES } from '$data/tattooStyleOptions';

	interface Props {
		selectedStyle?: string;
		onStyleSelect?: (styleId: string) => void;
	}

	let { selectedStyle = $bindable(''), onStyleSelect }: Props = $props();

	let imageErrors = $state<Record<string, boolean>>({});

	function handleImageError(styleId: string) {
		imageErrors[styleId] = true;
	}

	function handleStyleClick(styleId: string) {
		selectedStyle = styleId;
		onStyleSelect?.(styleId);
	}

	function getAvatarLetter(name: string): string {
		return name.charAt(0).toUpperCase();
	}
</script>

<div class="overflow-x-auto flex gap-3 pb-4 scrollbar-thin">
	{#each TATTOO_STYLES as style (style.id)}
		<button
			type="button"
			class="flex-shrink-0 w-32 h-40 rounded-lg cursor-pointer overflow-hidden relative border-2 transition-all
			{selectedStyle === style.id ? 'border-ink-500' : 'border-transparent'}"
			onclick={() => handleStyleClick(style.id)}
			title={style.name}
		>
			<div class="relative w-full h-full">
				{#if imageErrors[style.id]}
					<!-- Fallback avatar -->
					<div class="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center h-[70%]">
						<span class="text-3xl font-bold text-slate-300">{getAvatarLetter(style.name)}</span>
					</div>
				{:else}
					<!-- Image -->
					<img
						src={style.imageUrl}
						alt={style.name}
						class="w-full h-[70%] object-cover"
						onerror={() => handleImageError(style.id)}
					/>
				{/if}

				<!-- Text section -->
				<div class="absolute bottom-0 left-0 right-0 h-[30%] bg-surface-900 flex items-center justify-center px-2">
					<p class="text-xs text-slate-300 truncate text-center font-medium">{style.name}</p>
				</div>
			</div>
		</button>
	{/each}
</div>

<style>
	:global(.scrollbar-thin) {
		scrollbar-width: thin;
		scrollbar-color: rgba(100, 116, 139, 0.3) transparent;
	}

	:global(.scrollbar-thin::-webkit-scrollbar) {
		height: 6px;
	}

	:global(.scrollbar-thin::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.scrollbar-thin::-webkit-scrollbar-thumb) {
		background-color: rgba(100, 116, 139, 0.3);
		border-radius: 3px;
	}

	:global(.scrollbar-thin::-webkit-scrollbar-thumb:hover) {
		background-color: rgba(100, 116, 139, 0.5);
	}
</style>
