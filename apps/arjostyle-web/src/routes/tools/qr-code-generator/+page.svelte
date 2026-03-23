<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	type TabType = 'text' | 'wifi' | 'vcard' | 'email';

	let activeTab: TabType = 'text';

	// Text/URL inputs
	let textInput = 'https://arjostyle.com';

	// WiFi inputs
	let wifiSSID = '';
	let wifiPassword = '';
	let wifiEncryption: 'WPA' | 'WEP' | 'None' = 'WPA';

	// vCard inputs
	let vcardName = '';
	let vcardPhone = '';
	let vcardEmail = '';
	let vcardCompany = '';
	let vcardTitle = '';

	// Email inputs
	let emailTo = '';
	let emailSubject = '';
	let emailBody = '';

	// QR Customization
	let qrForeground = '#000000';
	let qrBackground = '#FFFFFF';
	let qrSize = 300;

	// QR Output
	let qrDataUrl = '';
	let qrSvgUrl = '';

	// Generate QR code
	async function generateQR() {
		let content = '';

		if (activeTab === 'text') {
			content = textInput;
		} else if (activeTab === 'wifi') {
			// WiFi format: WIFI:T:WPA;S:SSID;P:password;;
			const escapeWifi = (str: string) => str.replace(/"/g, '\\"').replace(/;/g, '\\;').replace(/:/g, '\\:');
			content = `WIFI:T:${wifiEncryption};S:${escapeWifi(wifiSSID)};P:${escapeWifi(wifiPassword)};;`;
		} else if (activeTab === 'vcard') {
			// vCard format
			const parts = ['BEGIN:VCARD', 'VERSION:3.0'];
			if (vcardName) parts.push(`FN:${vcardName}`);
			if (vcardPhone) parts.push(`TEL:${vcardPhone}`);
			if (vcardEmail) parts.push(`EMAIL:${vcardEmail}`);
			if (vcardCompany) parts.push(`ORG:${vcardCompany}`);
			if (vcardTitle) parts.push(`TITLE:${vcardTitle}`);
			parts.push('END:VCARD');
			content = parts.join('\n');
		} else if (activeTab === 'email') {
			// mailto format
			const params = new URLSearchParams();
			if (emailSubject) params.append('subject', emailSubject);
			if (emailBody) params.append('body', emailBody);
			content = `mailto:${emailTo}${params.toString() ? '?' + params.toString() : ''}`;
		}

		if (!content) return;

		try {
			// Data URL for PNG
			const dataUrl = await QRCode.toDataURL(content, {
				color: {
					dark: qrForeground,
					light: qrBackground
				},
				width: qrSize,
				margin: 2,
				errorCorrectionLevel: 'H'
			});
			qrDataUrl = dataUrl;

			// SVG data URL
			const svgString = await QRCode.toString(content, {
				type: 'image/svg+xml',
				width: qrSize,
				margin: 2,
				color: {
					dark: qrForeground,
					light: qrBackground
				},
				errorCorrectionLevel: 'H'
			});
			qrSvgUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
		} catch (error) {
			console.error('QR generation error:', error);
		}
	}

	// Download functions
	function downloadPNG() {
		if (!qrDataUrl) return;
		const link = document.createElement('a');
		link.href = qrDataUrl;
		link.download = 'qrcode.png';
		link.click();
	}

	function downloadSVG() {
		if (!qrSvgUrl) return;
		const link = document.createElement('a');
		link.href = qrSvgUrl;
		link.download = 'qrcode.svg';
		link.click();
	}

	onMount(() => {
		generateQR();
	});

	// Reactively generate QR on input changes
	$effect(() => {
		generateQR();
	});
</script>

<svelte:head>
	<title>QR Code Generator - Free Online Tool</title>
	<meta name="description" content="Generate QR codes for text, URLs, WiFi, contacts, and emails. Customize colors and size. Download as PNG or SVG." />
</svelte:head>

<div class="min-h-screen bg-surface-900 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-white sm:text-4xl">QR Code Generator</h1>
			<p class="mt-2 text-zinc-400">Create QR codes for text, URLs, WiFi, contacts, and emails.</p>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input Panel -->
			<div class="space-y-6">
				<!-- Tabs -->
				<div class="flex gap-2 border-b border-zinc-700/50">
					{#each ['text', 'wifi', 'vcard', 'email'] as tab}
						<button
							on:click={() => {
								activeTab = tab as TabType;
							}}
							class={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
								activeTab === tab
									? 'border-orange-500 text-orange-500'
									: 'border-transparent text-zinc-400 hover:text-zinc-300'
							}`}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					{/each}
				</div>

				<!-- Tab Content -->
				<div class="space-y-4">
					{#if activeTab === 'text'}
						<div>
							<label class="block text-sm font-medium text-white mb-2">Text or URL</label>
							<textarea
								bind:value={textInput}
								placeholder="Enter text or URL..."
								rows="4"
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
					{:else if activeTab === 'wifi'}
						<div>
							<label class="block text-sm font-medium text-white mb-2">Network Name (SSID)</label>
							<input
								type="text"
								bind:value={wifiSSID}
								placeholder="WiFi network name..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-white mb-2">Password</label>
							<input
								type="password"
								bind:value={wifiPassword}
								placeholder="WiFi password..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-white mb-2">Encryption</label>
							<select
								bind:value={wifiEncryption}
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
							>
								<option value="WPA">WPA</option>
								<option value="WEP">WEP</option>
								<option value="None">None</option>
							</select>
						</div>
					{:else if activeTab === 'vcard'}
						<div>
							<label class="block text-sm font-medium text-white mb-2">Full Name</label>
							<input
								type="text"
								bind:value={vcardName}
								placeholder="John Doe..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-white mb-2">Phone</label>
							<input
								type="tel"
								bind:value={vcardPhone}
								placeholder="+63 123 4567..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-white mb-2">Email</label>
							<input
								type="email"
								bind:value={vcardEmail}
								placeholder="john@example.com..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-white mb-2">Company</label>
							<input
								type="text"
								bind:value={vcardCompany}
								placeholder="Company name..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-white mb-2">Title</label>
							<input
								type="text"
								bind:value={vcardTitle}
								placeholder="Job title..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
					{:else if activeTab === 'email'}
						<div>
							<label class="block text-sm font-medium text-white mb-2">To</label>
							<input
								type="email"
								bind:value={emailTo}
								placeholder="recipient@example.com..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-white mb-2">Subject</label>
							<input
								type="text"
								bind:value={emailSubject}
								placeholder="Email subject..."
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-white mb-2">Message</label>
							<textarea
								bind:value={emailBody}
								placeholder="Email body..."
								rows="3"
								class="w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
							/>
						</div>
					{/if}
				</div>

				<!-- Customization -->
				<div class="space-y-4 border-t border-zinc-700/50 pt-6">
					<h3 class="text-sm font-semibold text-white">Customization</h3>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-2">Foreground Color</label>
							<div class="flex items-center gap-2">
								<input
									type="color"
									bind:value={qrForeground}
									class="h-10 w-10 rounded cursor-pointer border border-zinc-700/50"
								/>
								<span class="text-sm text-zinc-400">{qrForeground}</span>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-zinc-400 mb-2">Background Color</label>
							<div class="flex items-center gap-2">
								<input
									type="color"
									bind:value={qrBackground}
									class="h-10 w-10 rounded cursor-pointer border border-zinc-700/50"
								/>
								<span class="text-sm text-zinc-400">{qrBackground}</span>
							</div>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-zinc-400 mb-2">Size: {qrSize}px</label>
						<input
							type="range"
							min="200"
							max="600"
							step="50"
							bind:value={qrSize}
							class="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
						/>
					</div>
				</div>
			</div>

			<!-- Preview Panel -->
			<div class="space-y-6">
				<div class="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6 flex flex-col items-center justify-center min-h-[400px]">
					{#if qrDataUrl}
						<img src={qrDataUrl} alt="QR Code" class="max-w-full" />
					{:else}
						<div class="text-center text-zinc-500">
							<p class="text-sm">QR code preview</p>
						</div>
					{/if}
				</div>

				<!-- Download Buttons -->
				<div class="grid grid-cols-2 gap-3">
					<button
						on:click={downloadPNG}
						disabled={!qrDataUrl}
						class="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						Download PNG
					</button>
					<button
						on:click={downloadSVG}
						disabled={!qrSvgUrl}
						class="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						Download SVG
					</button>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-12 text-center text-zinc-500 text-sm border-t border-zinc-700/50 pt-6">
			<p>
				Part of <a href="/tools" class="text-orange-500 hover:text-orange-400 transition-colors">ArjoStyle Free Tools</a>
			</p>
		</div>
	</div>
</div>
