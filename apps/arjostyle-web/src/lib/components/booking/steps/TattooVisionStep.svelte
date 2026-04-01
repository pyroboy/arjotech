<script lang="ts">
	import type { BookingFormData } from '$types/bookings';
	import { Pencil, Palette, Sparkles } from 'lucide-svelte';

	interface Props {
		formData: BookingFormData;
		updateFormData: (data: Partial<BookingFormData>) => void;
	}

	let { formData, updateFormData }: Props = $props();

	let uploading = $state(false);
	let uploadError = $state('');

	const creativeFreedomOptions = [
		{ label: 'Exactly as I described', value: 0, icon: Pencil },
		{ label: 'Add your artistic touch', value: 50, icon: Palette },
		{ label: 'Surprise me!', value: 100, icon: Sparkles }
	] as const;

	async function handleCoverUpUpload(files: FileList | null) {
		if (!files) return;

		uploadError = '';

		for (const file of Array.from(files)) {
			if ((formData.coverUpPhoto ?? []).length >= 2) {
				uploadError = 'Maximum 2 images allowed';
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
					const current = formData.coverUpPhoto ?? [];
					updateFormData({ coverUpPhoto: [...current, url] });
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

	function removeCoverUpImage(index: number) {
		const newImages = (formData.coverUpPhoto ?? []).filter((_, i) => i !== index);
		updateFormData({ coverUpPhoto: newImages });
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'copy';
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const files = e.dataTransfer?.files;
		if (files) {
			handleCoverUpUpload(files);
		}
	}
</script>

<div class="py-6 space-y-8 max-w-2xl mx-auto">
	<!-- Section A: Describe Your Vision -->
	<div class="border-b border-zinc-800 pb-6">
		<label class="booking-section-title mb-3 block" for="tattooDescription">
			Describe Your Vision
		</label>
		<textarea
			id="tattooDescription"
			class="w-full bg-surface-800 border border-zinc-700 text-zinc-100 rounded-lg p-3 focus:border-ink-500 focus:outline-none resize-none input-focus-glow"
			placeholder="Describe your vision — style details, specific elements, color preferences, anything the artist should know..."
			rows={5}
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

	<!-- Section B: Creative Freedom -->
	<div class="border-b border-zinc-800 pb-6">
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

	<!-- Section C: Cover-up Photo (conditional) -->
	{#if formData.isCoverUp}
		<div class="border-b border-zinc-800 pb-6">
			<h3 class="booking-section-title mb-2">Upload a photo of your existing tattoo</h3>
			<p class="text-xs text-zinc-400 mb-4">Up to 2 images, 5MB each</p>

			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="border-2 border-dashed border-zinc-700 hover:border-ink-500 hover:bg-ink-500/5 rounded-xl p-6 text-center transition-colors cursor-pointer"
				role="button"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						document.getElementById('coverUpInput')?.click();
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
					id="coverUpInput"
					onchange={(e) => handleCoverUpUpload((e.target as HTMLInputElement).files)}
					disabled={uploading}
				/>
				<label for="coverUpInput" class="cursor-pointer block">
					<p class="text-zinc-300 font-medium mb-1">
						{uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
					</p>
					<p class="text-xs text-zinc-500">PNG, JPG, GIF up to 5MB</p>
				</label>
			</div>

			{#if uploadError}
				<div class="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
					<p class="text-xs text-red-400">{uploadError}</p>
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
</div>
