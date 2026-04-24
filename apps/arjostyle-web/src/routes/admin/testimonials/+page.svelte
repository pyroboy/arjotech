<script lang="ts">
	import {
		Star,
		Plus,
		Pencil,
		Trash2,
		X,
		Check,
		Upload,
		Image,
		Quote,
		Calendar,
		User,
		Globe,
		MessageSquare
	} from 'lucide-svelte';

	type Testimonial = {
		id: string;
		createdAt: string;
		updatedAt: string;
		clientName: string;
		clientHandle: string | null;
		rating: number;
		quote: string;
		tattooStyle: string | null;
		tattooImageUrl: string | null;
		date: string;
		source: 'google' | 'instagram' | 'facebook' | 'direct';
		isFeatured: boolean;
		displayOrder: number;
	};

	const SOURCES = [
		{ value: 'google', label: 'Google', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
		{ value: 'instagram', label: 'Instagram', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
		{ value: 'facebook', label: 'Facebook', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
		{ value: 'direct', label: 'Direct', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' }
	];

	let testimonials = $state<Testimonial[]>([]);
	let loading = $state(false);
	let errorMsg = $state('');
	let successMsg = $state('');

	// Form state
	let showForm = $state(false);
	let editingId = $state<string | null>(null);
	let deleteConfirmId = $state<string | null>(null);

	// Form fields
	let formClientName = $state('');
	let formClientHandle = $state('');
	let formRating = $state(5);
	let formQuote = $state('');
	let formTattooStyle = $state('');
	let formTattooImageUrl = $state('');
	let formDate = $state(new Date().toISOString().split('T')[0]);
	let formSource = $state<'google' | 'instagram' | 'facebook' | 'direct'>('direct');
	let formIsFeatured = $state(false);
	let formDisplayOrder = $state(0);

	// Image upload state
	let uploadingImage = $state(false);
	let imagePreview = $state<string | null>(null);

	function getSourceBadge(source: string) {
		return SOURCES.find((s) => s.value === source) ?? SOURCES[3];
	}

	function renderStars(rating: number, size = 'w-4 h-4') {
		return Array.from({ length: 5 }, (_, i) => i < rating);
	}

	function resetForm() {
		formClientName = '';
		formClientHandle = '';
		formRating = 5;
		formQuote = '';
		formTattooStyle = '';
		formTattooImageUrl = '';
		formDate = new Date().toISOString().split('T')[0];
		formSource = 'direct';
		formIsFeatured = false;
		formDisplayOrder = 0;
		imagePreview = null;
		editingId = null;
	}

	function openAddForm() {
		resetForm();
		showForm = true;
	}

	function openEditForm(t: Testimonial) {
		editingId = t.id;
		formClientName = t.clientName;
		formClientHandle = t.clientHandle ?? '';
		formRating = t.rating;
		formQuote = t.quote;
		formTattooStyle = t.tattooStyle ?? '';
		formTattooImageUrl = t.tattooImageUrl ?? '';
		formDate = t.date;
		formSource = t.source;
		formIsFeatured = t.isFeatured;
		formDisplayOrder = t.displayOrder;
		imagePreview = t.tattooImageUrl;
		showForm = true;
	}

	function closeForm() {
		showForm = false;
		resetForm();
	}

	async function fetchTestimonials() {
		loading = true;
		errorMsg = '';
		try {
			const res = await fetch('/api/testimonials');
			const data = await res.json();
			if (!res.ok) throw new Error(data.error ?? 'Failed to load');
			testimonials = data.testimonials;
		} catch (e: unknown) {
			errorMsg = e instanceof Error ? e.message : 'Failed to load testimonials';
		} finally {
			loading = false;
		}
	}

	async function handleImageUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploadingImage = true;
		errorMsg = '';
		try {
			const fd = new FormData();
			fd.append('file', file);
			fd.append('category', 'testimonial');
			const res = await fetch('/api/assets', { method: 'POST', body: fd });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error ?? 'Upload failed');
			formTattooImageUrl = data.url;
			imagePreview = data.url;
		} catch (e: unknown) {
			errorMsg = e instanceof Error ? e.message : 'Upload failed';
		} finally {
			uploadingImage = false;
			input.value = '';
		}
	}

	async function saveTestimonial() {
		if (!formClientName.trim()) {
			errorMsg = 'Client name is required';
			return;
		}
		if (!formQuote.trim()) {
			errorMsg = 'Quote is required';
			return;
		}
		if (!formDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
			errorMsg = 'Date must be YYYY-MM-DD';
			return;
		}

		errorMsg = '';
		try {
			const body = {
				clientName: formClientName.trim(),
				clientHandle: formClientHandle.trim() || undefined,
				rating: formRating,
				quote: formQuote.trim(),
				tattooStyle: formTattooStyle.trim() || undefined,
				tattooImageUrl: formTattooImageUrl || undefined,
				date: formDate,
				source: formSource,
				isFeatured: formIsFeatured,
				displayOrder: formDisplayOrder
			};

			let res: Response;
			if (editingId) {
				res = await fetch(`/api/testimonials/${editingId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});
			} else {
				res = await fetch('/api/testimonials', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});
			}

			const data = await res.json();
			if (!res.ok) throw new Error(data.error ?? 'Save failed');

			if (editingId) {
				testimonials = testimonials.map((t) => (t.id === editingId ? { ...t, ...data } : t));
				successMsg = 'Testimonial updated!';
			} else {
				testimonials = [data, ...testimonials];
				successMsg = 'Testimonial created!';
			}

			closeForm();
			setTimeout(() => (successMsg = ''), 3000);
		} catch (e: unknown) {
			errorMsg = e instanceof Error ? e.message : 'Save failed';
		}
	}

	async function deleteTestimonial(id: string) {
		try {
			const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error ?? 'Delete failed');
			}
			testimonials = testimonials.filter((t) => t.id !== id);
			successMsg = 'Testimonial deleted!';
			setTimeout(() => (successMsg = ''), 3000);
		} catch (e: unknown) {
			errorMsg = e instanceof Error ? e.message : 'Delete failed';
		} finally {
			deleteConfirmId = null;
		}
	}

	$effect(() => {
		fetchTestimonials();
	});
</script>

<svelte:head>
	<title>Testimonials — Admin</title>
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-100 p-6">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center gap-3">
				<MessageSquare class="w-6 h-6 text-ink-500" />
				<h1 class="text-2xl font-display font-bold">Testimonials</h1>
				<span class="text-zinc-500 text-sm">({testimonials.length})</span>
			</div>
			<button
				onclick={openAddForm}
				class="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-500/20 border border-ink-500/40 text-ink-400 hover:bg-ink-500/30 transition-colors text-sm font-medium"
			>
				<Plus class="w-4 h-4" />
				Add Testimonial
			</button>
		</div>

		<!-- Alerts -->
		{#if errorMsg}
			<div class="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
				<span>{errorMsg}</span>
				<button onclick={() => (errorMsg = '')} class="opacity-60 hover:opacity-100">
					<X class="w-4 h-4" />
				</button>
			</div>
		{/if}

		{#if successMsg}
			<div class="mb-4 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between">
				<span>{successMsg}</span>
				<button onclick={() => (successMsg = '')} class="opacity-60 hover:opacity-100">
					<X class="w-4 h-4" />
				</button>
			</div>
		{/if}

		<!-- Testimonials Table -->
		{#if loading}
			<div class="space-y-3">
				{#each Array(3) as _}
					<div class="h-24 rounded-xl bg-zinc-800 animate-pulse"></div>
				{/each}
			</div>
		{:else if testimonials.length === 0}
			<div class="text-center py-20 text-zinc-500">
				<MessageSquare class="w-12 h-12 mx-auto mb-3 opacity-30" />
				<p>No testimonials yet. Add your first one!</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each testimonials as t (t.id)}
					{@const badge = getSourceBadge(t.source)}
					<div class="rounded-xl bg-zinc-800/50 border border-zinc-700 p-4 hover:border-zinc-600 transition-colors">
						<div class="flex gap-4">
							<!-- Tattoo Image (if exists) -->
							{#if t.tattooImageUrl}
								<div class="flex-shrink-0">
									<img
										src={t.tattooImageUrl}
										alt="Tattoo by {t.clientName}"
										class="w-20 h-20 object-cover rounded-lg"
									/>
								</div>
							{/if}

							<!-- Content -->
							<div class="flex-1 min-w-0">
								<div class="flex items-start justify-between gap-4 mb-2">
									<div class="flex items-center gap-3">
										<div class="flex items-center gap-1">
											{#each renderStars(t.rating) as filled}
												<Star
													class="w-4 h-4 {filled ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}"
												/>
											{/each}
										</div>
										<span class="font-medium text-zinc-100">{t.clientName}</span>
										{#if t.clientHandle}
											<span class="text-zinc-500 text-sm">@{t.clientHandle}</span>
										{/if}
									</div>

									<div class="flex items-center gap-2 flex-shrink-0">
										<span class="px-2 py-0.5 rounded-full text-xs border {badge.color}">
											{badge.label}
										</span>
										{#if t.isFeatured}
											<span class="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
												Featured
											</span>
										{/if}
									</div>
								</div>

								<blockquote class="text-zinc-300 text-sm mb-2 italic">"{t.quote}"</blockquote>

								<div class="flex items-center gap-4 text-xs text-zinc-500">
									{#if t.tattooStyle}
										<span class="flex items-center gap-1">
											<Image class="w-3 h-3" />
											{t.tattooStyle}
										</span>
									{/if}
									<span class="flex items-center gap-1">
										<Calendar class="w-3 h-3" />
										{t.date}
									</span>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex items-center gap-1 flex-shrink-0">
								<button
									onclick={() => openEditForm(t)}
									class="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
									title="Edit"
								>
									<Pencil class="w-4 h-4" />
								</button>
								{#if deleteConfirmId === t.id}
									<div class="flex items-center gap-1 ml-1">
										<button
											onclick={() => deleteTestimonial(t.id)}
											class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors"
										>
											Delete?
										</button>
										<button
											onclick={() => (deleteConfirmId = null)}
											class="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs transition-colors"
										>
											Cancel
										</button>
									</div>
								{:else}
									<button
										onclick={() => (deleteConfirmId = t.id)}
										class="p-2 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
										title="Delete"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Add/Edit Modal -->
{#if showForm}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
		onclick={(e) => { if (e.target === e.currentTarget) closeForm(); }}
		onkeydown={(e) => { if (e.key === 'Escape') closeForm(); }}
	>
		<div class="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-4 border-b border-zinc-700">
				<h2 class="text-lg font-display font-bold">
					{editingId ? 'Edit Testimonial' : 'Add Testimonial'}
				</h2>
				<button onclick={closeForm} class="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100">
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Form -->
			<form onsubmit={(e) => { e.preventDefault(); saveTestimonial(); }} class="p-4 space-y-4">
				<!-- Client Name -->
				<div>
					<label class="block text-sm font-medium text-zinc-300 mb-1.5">
						<User class="w-4 h-4 inline mr-1" />
						Client Name <span class="text-red-400">*</span>
					</label>
					<input
						type="text"
						bind:value={formClientName}
						required
						placeholder="Maria Santos"
						class="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-ink-500"
					/>
				</div>

				<!-- Client Handle -->
				<div>
					<label class="block text-sm font-medium text-zinc-300 mb-1.5">
						Instagram Handle <span class="text-zinc-500">(optional)</span>
					</label>
					<input
						type="text"
						bind:value={formClientHandle}
						placeholder="@maria_santos"
						class="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-ink-500"
					/>
				</div>

				<!-- Star Rating -->
				<div>
					<label class="block text-sm font-medium text-zinc-300 mb-1.5">
						<Star class="w-4 h-4 inline mr-1" />
						Rating <span class="text-red-400">*</span>
					</label>
					<div class="flex gap-2">
						{#each [1, 2, 3, 4, 5] as star}
							<button
								type="button"
								onclick={() => (formRating = star)}
								class="p-2 rounded-lg transition-colors {formRating >= star ? 'bg-yellow-500/20' : 'bg-zinc-800 hover:bg-zinc-700'}"
							>
								<Star
									class="w-6 h-6 {formRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}"
								/>
							</button>
						{/each}
					</div>
				</div>

				<!-- Quote -->
				<div>
					<label class="block text-sm font-medium text-zinc-300 mb-1.5">
						<Quote class="w-4 h-4 inline mr-1" />
						Quote <span class="text-red-400">*</span>
					</label>
					<textarea
						bind:value={formQuote}
						required
						rows="3"
						placeholder="The tattoo came out amazing! Best artist ever..."
						class="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-ink-500 resize-none"
					></textarea>
				</div>

				<!-- Two columns: Date + Source -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-zinc-300 mb-1.5">
							<Calendar class="w-4 h-4 inline mr-1" />
							Date <span class="text-red-400">*</span>
						</label>
						<input
							type="date"
							bind:value={formDate}
							required
							class="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-ink-500"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-zinc-300 mb-1.5">
							<Globe class="w-4 h-4 inline mr-1" />
							Source
						</label>
						<select
							bind:value={formSource}
							class="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-ink-500"
						>
							{#each SOURCES as source}
								<option value={source.value}>{source.label}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Tattoo Style -->
				<div>
					<label class="block text-sm font-medium text-zinc-300 mb-1.5">
						<Image class="w-4 h-4 inline mr-1" />
						Tattoo Style <span class="text-zinc-500">(optional)</span>
					</label>
					<input
						type="text"
						bind:value={formTattooStyle}
						placeholder="Neo-traditional, Realism, Japanese..."
						class="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-ink-500"
					/>
				</div>

				<!-- Tattoo Image Upload -->
				<div>
					<label class="block text-sm font-medium text-zinc-300 mb-1.5">
						<Image class="w-4 h-4 inline mr-1" />
						Tattoo Image <span class="text-zinc-500">(optional)</span>
					</label>

					{#if imagePreview}
						<div class="relative inline-block mb-2">
							<img
								src={imagePreview}
								alt="Tattoo preview"
								class="w-32 h-32 object-cover rounded-lg border border-zinc-600"
							/>
							<button
								type="button"
								onclick={() => { formTattooImageUrl = ''; imagePreview = null; }}
								class="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-400"
							>
								<X class="w-3 h-3" />
							</button>
						</div>
					{/if}

					<label
						class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 hover:border-zinc-500 transition-colors text-sm text-zinc-300 w-fit"
					>
						{#if uploadingImage}
							<span class="animate-pulse">Uploading…</span>
						{:else}
							<Upload class="w-4 h-4" />
							{imagePreview ? 'Replace image' : 'Upload image'}
						{/if}
						<input
							type="file"
							accept="image/jpeg,image/png,image/webp"
							disabled={uploadingImage}
							onchange={handleImageUpload}
							class="hidden"
						/>
					</label>
				</div>

				<!-- Featured + Display Order -->
				<div class="flex items-center gap-6">
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={formIsFeatured}
							class="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500"
						/>
						<span class="text-sm text-zinc-300">Featured testimonial</span>
					</label>

					<div class="flex items-center gap-2">
						<label class="text-sm text-zinc-300">Order:</label>
						<input
							type="number"
							bind:value={formDisplayOrder}
							min="0"
							class="w-20 bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1 text-zinc-100 focus:outline-none focus:border-ink-500"
						/>
					</div>
				</div>

				<!-- Form Actions -->
				<div class="flex items-center justify-end gap-3 pt-4 border-t border-zinc-700">
					<button
						type="button"
						onclick={closeForm}
						class="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-500 hover:bg-ink-400 text-white text-sm font-medium transition-colors"
					>
						<Check class="w-4 h-4" />
						{editingId ? 'Save Changes' : 'Create Testimonial'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
