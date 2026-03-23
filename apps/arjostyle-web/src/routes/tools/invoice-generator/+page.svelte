<script lang="ts">
	type Currency = 'PHP' | 'USD' | 'EUR' | 'GBP';

	interface LineItem {
		id: string;
		description: string;
		quantity: number;
		unitPrice: number;
		amount: number;
	}

	// From section
	let fromBusiness = '';
	let fromAddress = '';
	let fromEmail = '';
	let fromPhone = '';

	// To section
	let toClient = '';
	let toAddress = '';
	let toEmail = '';

	// Invoice details
	let invoiceNumber = 'INV-001';
	let invoiceDate = new Date().toISOString().split('T')[0];
	let dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

	// Line items
	let lineItems: LineItem[] = [
		{ id: '1', description: 'Service', quantity: 1, unitPrice: 0, amount: 0 }
	];

	// Tax and discount
	let taxPercent = 12;
	let discountAmount = 0;
	let discountType: 'fixed' | 'percent' = 'fixed';

	// Notes
	let notes = '';

	// Currency
	let currency: Currency = 'PHP';

	const currencySymbols: Record<Currency, string> = {
		PHP: '₱',
		USD: '$',
		EUR: '€',
		GBP: '£'
	};

	function addLineItem() {
		const newId = String(Math.max(...lineItems.map(item => parseInt(item.id) || 0)) + 1);
		lineItems = [...lineItems, { id: newId, description: '', quantity: 1, unitPrice: 0, amount: 0 }];
	}

	function removeLineItem(id: string) {
		if (lineItems.length > 1) {
			lineItems = lineItems.filter(item => item.id !== id);
		}
	}

	function updateLineItem(id: string, field: string, value: any) {
		lineItems = lineItems.map(item => {
			if (item.id === id) {
				const updated = { ...item, [field]: value };
				if (field === 'quantity' || field === 'unitPrice') {
					updated.amount = updated.quantity * updated.unitPrice;
				}
				return updated;
			}
			return item;
		});
	}

	function calculateSubtotal(): number {
		return lineItems.reduce((sum, item) => sum + item.amount, 0);
	}

	function calculateDiscount(): number {
		const subtotal = calculateSubtotal();
		if (discountType === 'percent') {
			return subtotal * (discountAmount / 100);
		}
		return discountAmount;
	}

	function calculateTaxable(): number {
		return calculateSubtotal() - calculateDiscount();
	}

	function calculateTax(): number {
		return calculateTaxable() * (taxPercent / 100);
	}

	function calculateTotal(): number {
		return calculateTaxable() + calculateTax();
	}

	function formatCurrency(amount: number): string {
		return `${currencySymbols[currency]}${amount.toFixed(2)}`;
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	function handlePrint() {
		window.print();
	}
</script>

<svelte:head>
	<title>Invoice Generator - Free Online Tool</title>
	<meta name="description" content="Create professional invoices instantly. Customize items, tax, discount, and download as PDF." />
</svelte:head>

<div class="min-h-screen bg-surface-900 px-4 py-8 sm:px-6 lg:px-8 print:bg-white">
	<div class="mx-auto max-w-7xl">
		<!-- Header (hidden in print) -->
		<div class="mb-8 print:hidden">
			<h1 class="text-3xl font-bold text-white sm:text-4xl">Invoice Generator</h1>
			<p class="mt-2 text-zinc-400">Create and customize professional invoices.</p>
		</div>

		<div class="grid gap-8 lg:grid-cols-3 print:gap-0 print:block">
			<!-- Form Panel (hidden in print) -->
			<div class="space-y-6 lg:col-span-2 print:hidden">
				<!-- From Section -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
					<h2 class="text-lg font-semibold text-white mb-4">From</h2>
					<div class="space-y-3">
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-1">Business Name</label>
							<input
								type="text"
								bind:value={fromBusiness}
								placeholder="Your business name..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-1">Address</label>
							<input
								type="text"
								bind:value={fromAddress}
								placeholder="Business address..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label class="block text-sm font-medium text-zinc-400 mb-1">Email</label>
								<input
									type="email"
									bind:value={fromEmail}
									placeholder="email@example.com..."
									class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-zinc-400 mb-1">Phone</label>
								<input
									type="tel"
									bind:value={fromPhone}
									placeholder="+63 123 4567..."
									class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- To Section -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
					<h2 class="text-lg font-semibold text-white mb-4">Bill To</h2>
					<div class="space-y-3">
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-1">Client Name</label>
							<input
								type="text"
								bind:value={toClient}
								placeholder="Client name..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-1">Address</label>
							<input
								type="text"
								bind:value={toAddress}
								placeholder="Client address..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-1">Email</label>
							<input
								type="email"
								bind:value={toEmail}
								placeholder="client@example.com..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
					</div>
				</div>

				<!-- Invoice Details -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
					<h2 class="text-lg font-semibold text-white mb-4">Invoice Details</h2>
					<div class="grid grid-cols-3 gap-3">
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-1">Invoice #</label>
							<input
								type="text"
								bind:value={invoiceNumber}
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-1">Invoice Date</label>
							<input
								type="date"
								bind:value={invoiceDate}
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-1">Due Date</label>
							<input
								type="date"
								bind:value={dueDate}
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
							/>
						</div>
					</div>
				</div>

				<!-- Line Items -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
					<h2 class="text-lg font-semibold text-white mb-4">Line Items</h2>
					<div class="space-y-3">
						{#each lineItems as item (item.id)}
							<div class="grid grid-cols-12 gap-2 items-end">
								<input
									type="text"
									placeholder="Description..."
									value={item.description}
									on:input={(e) => updateLineItem(item.id, 'description', e.currentTarget.value)}
									class="col-span-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-2 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
								/>
								<input
									type="number"
									placeholder="Qty"
									value={item.quantity}
									on:input={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.currentTarget.value) || 0)}
									class="col-span-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-2 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
								/>
								<input
									type="number"
									placeholder="Price"
									value={item.unitPrice}
									on:input={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.currentTarget.value) || 0)}
									class="col-span-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-2 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
								/>
								<button
									on:click={() => removeLineItem(item.id)}
									class="col-span-2 rounded-lg bg-red-500/20 border border-red-500/50 px-2 py-2 text-sm text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={lineItems.length === 1}
								>
									Remove
								</button>
							</div>
						{/each}
					</div>
					<button
						on:click={addLineItem}
						class="mt-4 w-full rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 transition-colors"
					>
						+ Add Item
					</button>
				</div>

				<!-- Tax & Discount -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
					<h2 class="text-lg font-semibold text-white mb-4">Tax & Discount</h2>
					<div class="grid grid-cols-2 gap-3 mb-3">
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-1">Tax %</label>
							<input
								type="number"
								bind:value={taxPercent}
								min="0"
								max="100"
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-1">Discount Type</label>
							<select
								bind:value={discountType}
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
							>
								<option value="fixed">Fixed Amount</option>
								<option value="percent">Percentage</option>
							</select>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-zinc-400 mb-1">
							Discount {discountType === 'percent' ? '(%)' : `(${currencySymbols[currency]})`}
						</label>
						<input
							type="number"
							bind:value={discountAmount}
							min="0"
							class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
						/>
					</div>
				</div>

				<!-- Currency Selection -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
					<label class="block text-sm font-medium text-zinc-400 mb-2">Currency</label>
					<select
						bind:value={currency}
						class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
					>
						<option value="PHP">Philippine Peso (₱)</option>
						<option value="USD">US Dollar ($)</option>
						<option value="EUR">Euro (€)</option>
						<option value="GBP">British Pound (£)</option>
					</select>
				</div>

				<!-- Notes -->
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6">
					<label class="block text-sm font-medium text-white mb-2">Notes</label>
					<textarea
						bind:value={notes}
						placeholder="Payment terms, thank you message, etc..."
						rows="3"
						class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
					/>
				</div>

				<!-- Print Button -->
				<button
					on:click={handlePrint}
					class="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 transition-colors"
				>
					Print / Save as PDF
				</button>
			</div>

			<!-- Invoice Preview -->
			<div class="lg:col-span-1">
				<div class="rounded-lg bg-white text-black p-8 print:bg-white print:p-0 print:rounded-none print:border-none shadow-lg print:shadow-none print:m-0">
					<!-- Invoice Header -->
					<div class="mb-8 pb-6 border-b-2 border-gray-300">
						<div class="mb-4 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
							Logo Placeholder
						</div>
						<h1 class="text-3xl font-bold text-gray-900">INVOICE</h1>
						{#if fromBusiness}
							<p class="text-gray-700 font-semibold mt-2">{fromBusiness}</p>
						{/if}
					</div>

					<!-- Invoice Meta -->
					<div class="mb-8 grid grid-cols-2 gap-4 text-sm print:grid-cols-2">
						<div>
							<p class="text-gray-600">Invoice #:</p>
							<p class="font-semibold text-gray-900">{invoiceNumber}</p>
						</div>
						<div>
							<p class="text-gray-600">Invoice Date:</p>
							<p class="font-semibold text-gray-900">{formatDate(invoiceDate)}</p>
						</div>
						<div>
							<p class="text-gray-600">Due Date:</p>
							<p class="font-semibold text-gray-900">{formatDate(dueDate)}</p>
						</div>
					</div>

					<!-- From/To -->
					<div class="mb-8 grid grid-cols-2 gap-8 text-sm">
						<div>
							<p class="text-gray-600 font-semibold mb-1">From:</p>
							<div class="text-gray-900 leading-relaxed">
								{#if fromBusiness}
									<p class="font-semibold">{fromBusiness}</p>
								{/if}
								{#if fromAddress}
									<p>{fromAddress}</p>
								{/if}
								{#if fromEmail}
									<p>{fromEmail}</p>
								{/if}
								{#if fromPhone}
									<p>{fromPhone}</p>
								{/if}
							</div>
						</div>
						<div>
							<p class="text-gray-600 font-semibold mb-1">Bill To:</p>
							<div class="text-gray-900 leading-relaxed">
								{#if toClient}
									<p class="font-semibold">{toClient}</p>
								{/if}
								{#if toAddress}
									<p>{toAddress}</p>
								{/if}
								{#if toEmail}
									<p>{toEmail}</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Items Table -->
					<div class="mb-8">
						<table class="w-full text-sm border-collapse">
							<thead>
								<tr class="bg-gray-100">
									<th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">Description</th>
									<th class="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-900 w-12">Qty</th>
									<th class="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-900 w-20">Price</th>
									<th class="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-900 w-20">Amount</th>
								</tr>
							</thead>
							<tbody>
								{#each lineItems as item}
									<tr>
										<td class="border border-gray-300 px-3 py-2 text-gray-900">{item.description}</td>
										<td class="border border-gray-300 px-3 py-2 text-right text-gray-900">{item.quantity}</td>
										<td class="border border-gray-300 px-3 py-2 text-right text-gray-900">{formatCurrency(item.unitPrice)}</td>
										<td class="border border-gray-300 px-3 py-2 text-right text-gray-900">{formatCurrency(item.amount)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Totals -->
					<div class="mb-8 text-sm space-y-2 flex flex-col items-end">
						<div class="flex gap-16">
							<span class="text-gray-600">Subtotal:</span>
							<span class="w-24 text-right text-gray-900">{formatCurrency(calculateSubtotal())}</span>
						</div>
						{#if calculateDiscount() > 0}
							<div class="flex gap-16">
								<span class="text-gray-600">Discount:</span>
								<span class="w-24 text-right text-gray-900">-{formatCurrency(calculateDiscount())}</span>
							</div>
						{/if}
						<div class="flex gap-16">
							<span class="text-gray-600">Tax ({taxPercent}%):</span>
							<span class="w-24 text-right text-gray-900">{formatCurrency(calculateTax())}</span>
						</div>
						<div class="flex gap-16 border-t-2 border-gray-300 pt-2">
							<span class="font-bold text-gray-900">Total:</span>
							<span class="w-24 text-right font-bold text-gray-900 text-lg">{formatCurrency(calculateTotal())}</span>
						</div>
					</div>

					<!-- Notes -->
					{#if notes}
						<div class="border-t-2 border-gray-300 pt-4 text-sm text-gray-900">
							<p class="font-semibold mb-2">Notes:</p>
							<p class="whitespace-pre-wrap">{notes}</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Footer (hidden in print) -->
		<div class="mt-12 text-center text-zinc-500 text-sm border-t border-zinc-700/50 pt-6 print:hidden">
			<p>
				Part of <a href="/tools" class="text-orange-500 hover:text-orange-400 transition-colors">ArjoStyle Free Tools</a>
			</p>
		</div>
	</div>
</div>

<style>
	@media print {
		:global(*) {
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		}

		:global(body) {
			background: white;
			margin: 0;
			padding: 0;
		}

		:global(.print\:hidden) {
			display: none !important;
		}

		:global(.print\:bg-white) {
			background: white !important;
		}

		:global(.print\:shadow-none) {
			box-shadow: none !important;
		}
	}
</style>
