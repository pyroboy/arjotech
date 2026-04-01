<script lang="ts">
	import type { BookingFormData } from '$types/bookings';
	import ExampleStylesCarousel from './ExampleStylesCarousel.svelte';

	interface Props {
		formData: BookingFormData;
		updateFormData: (data: Partial<BookingFormData>) => void;
	}

	let { formData, updateFormData }: Props = $props();

	let uploading = $state(false);
	let uploadError = $state('');

	// Derived creative freedom description
	let creativeFreedomLabel = $derived.by(() => {
		const value = formData.creativeFreedom || 0;
		if (value <= 20) return 'Very Specific';
		if (value <= 40) return 'Mostly Specific';
		if (value <= 60) return 'Balanced';
		if (value <= 80) return 'Mostly Free';
		return 'Full Creative Freedom';
	});

	async function handleFileUpload(files: FileList | null) {
		if (!files) return;

		uploadError = '';

		for (const file of Array.from(files)) {
			if (formData.referenceImages.length >= 5) {
				uploadError = 'Maximum 5 images allowed';
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
						// Already has string URLs
						newImages.push(url);
					} else {
						// Convert File[] to string[] with new URL
						updateFormData({ referenceImages: [url] });
						return;
					}
					updateFormData({ referenceImages: newImages });
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

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'copy';
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const files = e.dataTransfer?.files;
		if (files) {
			handleFileUpload(files);
		}
	}
</script>

<div class="py-6 space-y-8 max-w-2xl mx-auto">
	<!-- Section A: Style Selection -->
	<div class="border-b border-slate-800 pb-6">
		<h3 class="text-slate-200 font-semibold text-sm uppercase tracking-wide mb-4">What's your tattoo style?</h3>
		<ExampleStylesCarousel
			selectedStyle={formData.primaryTattooStyle ?? ''}
			onStyleSelect={(styleId) => updateFormData({ primaryTattooStyle: styleId })}
		/>
	</div>

	<!-- Section B: Style Description (shows after style selected) -->
	{#if formData.primaryTattooStyle}
		<div class="border-b border-slate-800 pb-6">
			<label class="block text-slate-200 font-semibold text-sm uppercase tracking-wide mb-3" for="styleDesc">
				Describe your vision <span class="text-zinc-500">(optional)</span>
			</label>
			<textarea
				id="styleDesc"
				class="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-3 focus:border-ink-500 focus:outline-none resize-none"
				placeholder="Describe specific details, inspirations, or any unique elements you want..."
				rows={4}
				maxlength={500}
				value={formData.styleDescription ?? ''}
				oninput={(e) => {
					const val = (e.target as HTMLTextAreaElement).value;
					updateFormData({ styleDescription: val });
				}}
			></textarea>
			<p class="text-xs text-slate-500 mt-2">
				{(formData.styleDescription ?? '').length} / 500 characters
			</p>
		</div>
	{/if}

	<!-- Section C: Reference Images Upload -->
	<div class="border-b border-slate-800 pb-6">
		<h3 class="text-slate-200 font-semibold text-sm uppercase tracking-wide mb-2">Upload Reference Images</h3>
		<p class="text-xs text-slate-400 mb-4">Up to 5 images, 5MB each</p>

		<!-- Upload zone -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="border-2 border-dashed border-slate-600 hover:border-ink-500 rounded-xl p-6 text-center transition-colors cursor-pointer"
			role="button"
			tabindex="0"
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					document.getElementById('fileInput')?.click();
				}
			}}
			onfocus={(e) => e.currentTarget.classList.add('border-ink-500')}
			onblur={(e) => e.currentTarget.classList.remove('border-ink-500')}
			onmouseover={(e) => {
				if (!(e.target as HTMLElement).closest('input')) {
					e.currentTarget.classList.add('border-ink-500');
				}
			}}
			onmouseout={(e) => {
				if (!(e.target as HTMLElement).closest('input')) {
					e.currentTarget.classList.remove('border-ink-500');
				}
			}}
			ondragover={handleDragOver}
			ondrop={handleDrop}
		>
			<input
				type="file"
				multiple
				accept="image/*"
				class="hidden"
				id="fileInput"
				onchange={(e) => handleFileUpload((e.target as HTMLInputElement).files)}
				disabled={uploading}
			/>
			<label for="fileInput" class="cursor-pointer block">
				<p class="text-slate-300 font-medium mb-1">
					{uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
				</p>
				<p class="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
			</label>
		</div>

		<!-- Error message -->
		{#if uploadError}
			<div class="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
				<p class="text-xs text-red-400">{uploadError}</p>
			</div>
		{/if}

		<!-- Image previews -->
		{#if formData.referenceImages.length > 0}
			<div class="mt-4 flex flex-wrap gap-3">
				{#each formData.referenceImages as image, index (index)}
					<div class="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700">
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
							<span class="text-white text-lg font-bold">×</span>
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Section D: Creative Freedom Slider -->
	<div class="border-b border-slate-800 pb-6">
		<label class="block text-slate-200 font-semibold text-sm uppercase tracking-wide mb-4" for="creativeFreedom">Creative Freedom</label>
		<div class="flex items-center gap-4">
			<span class="text-xs text-slate-400 whitespace-nowrap">Specific</span>
			<input
				id="creativeFreedom"
				type="range"
				min="0"
				max="100"
				step="5"
				class="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
				value={formData.creativeFreedom ?? 50}
				oninput={(e) => updateFormData({ creativeFreedom: parseInt((e.target as HTMLInputElement).value) })}
			/>
			<span class="text-xs text-slate-400 whitespace-nowrap">Full Freedom</span>
		</div>
		<div class="mt-3 text-center">
			<p class="text-sm text-slate-300 font-medium">{creativeFreedomLabel}</p>
			<p class="text-xs text-slate-500 mt-1">{formData.creativeFreedom ?? 50}%</p>
		</div>
	</div>

	<!-- Section E: Must-Have Elements (optional) -->
	<div class="border-b border-slate-800 pb-6">
		<label class="block text-slate-200 font-semibold text-sm uppercase tracking-wide mb-3" for="mustHave">
			Must-Have Elements <span class="text-zinc-500">(optional)</span>
		</label>
		<textarea
			id="mustHave"
			class="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-3 focus:border-ink-500 focus:outline-none resize-none"
			placeholder="e.g., specific dates, names, symbols that must be included"
			rows={3}
			maxlength={300}
			value={formData.mustHaveElements ?? ''}
			oninput={(e) => {
				const val = (e.target as HTMLTextAreaElement).value;
				updateFormData({ mustHaveElements: val });
			}}
		></textarea>
		<p class="text-xs text-slate-500 mt-2">
			{(formData.mustHaveElements ?? '').length} / 300 characters
		</p>
	</div>

	<!-- Section F: Color Preferences (only if isColor === true) -->
	{#if formData.isColor}
		<div class="border-b border-slate-800 pb-6">
			<label class="block text-slate-200 font-semibold text-sm uppercase tracking-wide mb-3" for="colorPref">
				Color Preferences
			</label>
			<textarea
				id="colorPref"
				class="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-3 focus:border-ink-500 focus:outline-none resize-none"
				placeholder="e.g., earth tones, vibrant, black and grey accents..."
				rows={3}
				maxlength={300}
				value={formData.colorPreferences ?? ''}
				oninput={(e) => {
					const val = (e.target as HTMLTextAreaElement).value;
					updateFormData({ colorPreferences: val });
				}}
			></textarea>
			<p class="text-xs text-slate-500 mt-2">
				{(formData.colorPreferences ?? '').length} / 300 characters
			</p>
		</div>
	{/if}
</div>

<style>
	:global(.slider) {
		-webkit-appearance: none;
		appearance: none;
		background: linear-gradient(to right, rgb(249, 115, 22), rgb(6, 182, 212)) padding-box, transparent border-box;
		border: 2px solid transparent;
		border-radius: 9999px;
	}

	:global(.slider::-webkit-slider-thumb) {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: rgb(249, 115, 22);
		cursor: pointer;
		box-shadow: 0 0 10px rgba(249, 115, 22, 0.4);
	}

	:global(.slider::-moz-range-thumb) {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: rgb(249, 115, 22);
		cursor: pointer;
		border: none;
		box-shadow: 0 0 10px rgba(249, 115, 22, 0.4);
	}

	:global(.slider::-moz-range-track) {
		background: transparent;
		border: none;
	}

	:global(.slider::-moz-range-progress) {
		background: linear-gradient(to right, rgb(249, 115, 22), rgb(6, 182, 212));
		border-radius: 9999px;
		height: 8px;
	}
</style>
