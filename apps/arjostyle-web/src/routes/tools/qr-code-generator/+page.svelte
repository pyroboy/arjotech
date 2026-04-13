<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	type TabType = 'text' | 'wifi' | 'vcard' | 'email';

	let activeTab: TabType = $state('text');

	// Text/URL inputs
	let textInput = $state('https://arjostyle.com');

	// WiFi inputs
	let wifiSSID = $state('');
	let wifiPassword = $state('');
	let wifiEncryption: 'WPA' | 'WEP' | 'None' = $state('WPA');

	// vCard inputs
	let vcardName = $state('');
	let vcardPhone = $state('');
	let vcardEmail = $state('');
	let vcardCompany = $state('');
	let vcardTitle = $state('');

	// Email inputs
	let emailTo = $state('');
	let emailSubject = $state('');
	let emailBody = $state('');

	// QR Customization
	let qrForeground = $state('#000000');
	let qrBackground = $state('#FFFFFF');
	let qrSize = $state(300);

	// QR Output
	let qrDataUrl = $state('');
	let qrSvgUrl = $state('');

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
				type: 'svg',
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

<div class="min-h-screen px-4 py-8 sm:px-6 lg:px-8" style="background-color: var(--bg-dark);">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<div class="mb-8">
			<div class="mb-3">
				<a href="/tools" class="text-mono-label hover:text-ink transition-colors">← ALL TOOLS</a>
			</div>
			<p class="text-mono-label mb-2">UTILITY TOOL</p>
			<h1 class="font-display text-display-sm text-white tracking-wide">QR CODE GENERATOR</h1>
			<p class="mt-2 font-mono text-sm" style="color: var(--text-secondary);">Create QR codes for text, URLs, WiFi, contacts, and emails.</p>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input Panel -->
			<div class="space-y-6">
				<!-- Tabs -->
				<div class="flex gap-0 border-b" style="border-color: var(--border);">
					{#each ['text', 'wifi', 'vcard', 'email'] as tab}
						<button
							onclick={() => {
								activeTab = tab as TabType;
							}}
							class="px-4 py-3 text-sm font-mono font-medium transition-all duration-150 border-b-2 -mb-[2px] {activeTab === tab
								? 'border-ink text-white'
								: 'border-transparent hover:text-white'}"
							style={activeTab !== tab ? `color: var(--text-secondary);` : ''}
						>
							{tab.toUpperCase()}
						</button>
					{/each}
				</div>

				<!-- Tab Content -->
				<div class="space-y-4">
					{#if activeTab === 'text'}
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">TEXT OR URL
								<textarea
									bind:value={textInput}
									placeholder="Enter text or URL..."
									rows="4"
									class="brutal-input w-full mt-2"
								></textarea>
							</label>
						</div>
					{:else if activeTab === 'wifi'}
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">NETWORK NAME (SSID)
								<input
									type="text"
									bind:value={wifiSSID}
									placeholder="WiFi network name..."
									class="brutal-input w-full mt-2"
								/>
							</label>
						</div>
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">PASSWORD
								<input
									type="password"
									bind:value={wifiPassword}
									placeholder="WiFi password..."
									class="brutal-input w-full mt-2"
								/>
							</label>
						</div>
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">ENCRYPTION
								<select
									bind:value={wifiEncryption}
									class="brutal-input w-full mt-2"
								>
									<option value="WPA">WPA</option>
									<option value="WEP">WEP</option>
									<option value="None">NONE</option>
								</select>
							</label>
						</div>
					{:else if activeTab === 'vcard'}
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">FULL NAME
								<input
									type="text"
									bind:value={vcardName}
									placeholder="John Doe..."
									class="brutal-input w-full mt-2"
								/>
							</label>
						</div>
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">PHONE
								<input
									type="tel"
									bind:value={vcardPhone}
									placeholder="+63 123 4567..."
									class="brutal-input w-full mt-2"
								/>
							</label>
						</div>
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">EMAIL
								<input
									type="email"
									bind:value={vcardEmail}
									placeholder="john@example.com..."
									class="brutal-input w-full mt-2"
								/>
							</label>
						</div>
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">COMPANY
								<input
									type="text"
									bind:value={vcardCompany}
									placeholder="Company name..."
									class="brutal-input w-full mt-2"
								/>
							</label>
						</div>
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">TITLE
								<input
									type="text"
									bind:value={vcardTitle}
									placeholder="Job title..."
									class="brutal-input w-full mt-2"
								/>
							</label>
						</div>
					{:else if activeTab === 'email'}
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">TO
								<input
									type="email"
									bind:value={emailTo}
									placeholder="recipient@example.com..."
									class="brutal-input w-full mt-2"
								/>
							</label>
						</div>
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">SUBJECT
								<input
									type="text"
									bind:value={emailSubject}
									placeholder="Email subject..."
									class="brutal-input w-full mt-2"
								/>
							</label>
						</div>
						<div>
							<label class="block text-sm font-mono font-medium text-white mb-2">MESSAGE
								<textarea
									bind:value={emailBody}
									placeholder="Email body..."
									rows="3"
									class="brutal-input w-full mt-2"
								></textarea>
							</label>
						</div>
					{/if}
				</div>

				<!-- Customization -->
				<div class="space-y-4 pt-6" style="border-top: 1px solid var(--border);">
					<h2 class="text-sm font-mono font-semibold text-white uppercase tracking-widest">CUSTOMIZATION</h2>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="qr-fg-color" class="block text-sm font-mono font-medium mb-2" style="color: var(--text-secondary);">FOREGROUND COLOR</label>
							<div class="flex items-center gap-2">
								<input
									type="color"
									bind:value={qrForeground}
									class="h-10 w-10 cursor-pointer border"
									style="background-color: var(--bg-dark); border-color: var(--border);"
								/>
								<span class="text-sm font-mono" style="color: var(--text-secondary);">{qrForeground}</span>
							</div>
						</div>

						<div>
							<label for="qr-bg-color" class="block text-sm font-mono font-medium mb-2" style="color: var(--text-secondary);">BACKGROUND COLOR</label>
							<div class="flex items-center gap-2">
								<input
									type="color"
									bind:value={qrBackground}
									class="h-10 w-10 cursor-pointer border"
									style="background-color: var(--bg-dark); border-color: var(--border);"
								/>
								<span class="text-sm font-mono" style="color: var(--text-secondary);">{qrBackground}</span>
							</div>
						</div>
					</div>

					<div>
						<label class="block text-sm font-mono font-medium mb-2" style="color: var(--text-secondary);">SIZE: {qrSize}px
							<input
								type="range"
								min="200"
								max="600"
								step="50"
								bind:value={qrSize}
								class="w-full h-2 mt-2 appearance-none cursor-pointer"
								style="background-color: var(--bg-dark); accent-color: var(--ink);"
							/>
						</label>
					</div>
				</div>
			</div>

			<!-- Preview Panel -->
			<div class="space-y-6">
				<div class="brutal-card p-6 flex flex-col items-center justify-center min-h-[400px]">
					{#if qrDataUrl}
						<img src={qrDataUrl} alt="QR Code" class="max-w-full" />
					{:else}
						<div class="text-center" style="color: var(--text-muted);">
							<p class="text-sm font-mono">QR CODE PREVIEW</p>
						</div>
					{/if}
				</div>

				<!-- Download Buttons -->
				<div class="grid grid-cols-2 gap-2">
					<button
						onclick={downloadPNG}
						disabled={!qrDataUrl}
						class="brutal-btn brutal-btn-ink disabled:opacity-50 disabled:cursor-not-allowed"
					>
						DOWNLOAD PNG
					</button>
					<button
						onclick={downloadSVG}
						disabled={!qrSvgUrl}
						class="brutal-btn brutal-btn-ink disabled:opacity-50 disabled:cursor-not-allowed"
					>
						DOWNLOAD SVG
					</button>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-12 text-center pt-6" style="border-top: 1px solid var(--border);">
			<a href="/tools" class="text-mono-label hover:text-ink transition-colors">← BACK TO FREE TOOLS</a>
		</div>
	</div>
</div>