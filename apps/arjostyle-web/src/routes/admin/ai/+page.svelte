<script lang="ts">
  import { Settings, Crosshair, FileText, MessageSquare, Copy, Check, AlertCircle, Sparkles } from 'lucide-svelte';

  interface AiPrompt {
    id: string;
    name: string;
    description: string;
    content: string;
    category: string;
    variables: string[];
    lastModified: Date;
  }

  let activeTab = $state<'system' | 'placement' | 'quotation' | 'chat'>('system');
  let hasUnsavedChanges = $state(false);
  let saveStatus = $state<'idle' | 'saving' | 'saved'>('idle');
  let copyFeedback = $state<string | null>(null);

  const tabs = [
    { id: 'system', label: 'System Prompt', icon: Settings },
    { id: 'placement', label: 'Placement AI', icon: Crosshair },
    { id: 'quotation', label: 'Quotation Generator', icon: FileText },
    { id: 'chat', label: 'Client Chat', icon: MessageSquare },
  ] as const;

  let prompts = $state<Record<string, AiPrompt>>({
    system: {
      id: 'system',
      name: 'System Prompt',
      description: 'Base system prompt that defines the AI assistant behavior',
      content: `You are ArjoStyle AI, a tattoo consultation assistant for ArjoStyle tattoo studio based in the Philippines. You help clients:

1. Choose optimal tattoo placements based on their preferences, pain tolerance, and body anatomy
2. Estimate pricing using the studio's pricing engine
3. Suggest tattoo styles that match their vision
4. Provide aftercare guidance

Always be professional, warm, and knowledgeable. Use the 3D body model data to make accurate placement suggestions. Quote prices in Philippine Pesos (₱).

Studio owner: Arjo Magno
Location: Philippines
Specialties: Fine line, blackwork, color realism, custom designs
Minimum price: ₱1,000`,
      category: 'system',
      variables: ['{{studio_name}}', '{{artist_name}}', '{{minimum_price}}', '{{currency}}'],
      lastModified: new Date(),
    },
    placement: {
      id: 'placement',
      name: 'Placement Suggestion Prompt',
      description: 'Generates tattoo placement recommendations using 3D body model data',
      content: `Given the following client preferences:
- Desired tattoo style: {{tattoo_style}}
- Approximate size: {{size}} square inches
- Pain tolerance: {{pain_tolerance}} (1-10 scale)
- Design description: {{design_description}}

Using the available body part mappings data, suggest the top 3 optimal placements. For each suggestion, provide:
1. Body category and specific placement name
2. Why this placement suits their design
3. Pain level warning if above 6/10
4. Size compatibility (min/max for that area)
5. Camera position data for 3D preview: { azimuth, polar, distance }

Format the response as structured JSON for the 3D viewer API.`,
      category: 'placement',
      variables: ['{{tattoo_style}}', '{{size}}', '{{pain_tolerance}}', '{{design_description}}', '{{body_part_mappings}}'],
      lastModified: new Date(),
    },
    quotation: {
      id: 'quotation',
      name: 'Quotation Generator Prompt',
      description: 'Generates professional quotation documents for clients',
      content: `Generate a professional tattoo quotation for the following booking:

Client: {{client_name}}
Design: {{design_description}}
Style: {{tattoo_style}}
Placement: {{placement}} ({{category}})
Size: {{size}} square inches
Color: {{is_color}}
Cover-up: {{is_cover_up}}

Pricing breakdown:
- Base price: {{base_price}}
- Size adjustment: {{size_price}}
- Complexity ({{complexity_level}}): {{complexity_price}}
- Placement factor: {{placement_price}}
- Color addition: {{color_price}}
- Cover-up addition: {{coverup_price}}
- Total estimate: {{total_price}}
- Required deposit (50%): {{deposit}}

Generate a warm, professional quotation message that:
1. Thanks the client for their interest
2. Summarizes the design concept
3. Breaks down the pricing clearly
4. Explains the deposit and booking process
5. Mentions aftercare will be provided
6. Includes studio contact information`,
      category: 'quotation',
      variables: ['{{client_name}}', '{{design_description}}', '{{tattoo_style}}', '{{placement}}', '{{category}}', '{{size}}', '{{is_color}}', '{{is_cover_up}}', '{{base_price}}', '{{size_price}}', '{{complexity_level}}', '{{complexity_price}}', '{{placement_price}}', '{{color_price}}', '{{coverup_price}}', '{{total_price}}', '{{deposit}}'],
      lastModified: new Date(),
    },
    chat: {
      id: 'chat',
      name: 'Client Chat Prompt',
      description: 'Prompt for the interactive client consultation chat',
      content: `You are having a consultation conversation with a potential tattoo client. Guide them through:

1. Understanding their tattoo idea
2. Suggesting appropriate styles
3. Recommending placements (use the 3D model)
4. Providing a price estimate
5. Answering aftercare questions

Be conversational but professional. If the client seems unsure, offer options and explain tradeoffs (e.g., pain vs. visibility, size vs. detail level).

Current context:
- Client name: {{client_name}}
- Previous messages: {{chat_history}}
- Available body mappings: {{available_placements}}`,
      category: 'chat',
      variables: ['{{client_name}}', '{{chat_history}}', '{{available_placements}}'],
      lastModified: new Date(),
    },
  });

  let currentPrompt = $derived(prompts[activeTab]);

  function updatePromptContent(content: string) {
    prompts[activeTab] = { ...prompts[activeTab], content, lastModified: new Date() };
    hasUnsavedChanges = true;
  }

  function updatePromptName(name: string) {
    prompts[activeTab] = { ...prompts[activeTab], name, lastModified: new Date() };
    hasUnsavedChanges = true;
  }

  function updatePromptDescription(description: string) {
    prompts[activeTab] = { ...prompts[activeTab], description, lastModified: new Date() };
    hasUnsavedChanges = true;
  }

  async function savePrompt() {
    saveStatus = 'saving';
    // TODO: Save to database via API
    // For now, simulate save
    await new Promise(r => setTimeout(r, 800));
    saveStatus = 'saved';
    hasUnsavedChanges = false;
    setTimeout(() => { saveStatus = 'idle'; }, 2000);
  }

  function resetPrompt() {
    // Reset to original values - for now just clear unsaved flag
    hasUnsavedChanges = false;
  }

  function insertVariable(variable: string) {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = currentPrompt.content;
      const newText = text.substring(0, start) + ' ' + variable + ' ' + text.substring(end);
      updatePromptContent(newText);
      // Set cursor position after the variable
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length + 2;
        textarea.focus();
      }, 0);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    copyFeedback = 'Copied!';
    setTimeout(() => { copyFeedback = null; }, 2000);
  }
</script>

<svelte:head>
  <title>AI Prompt Editor — Admin</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-surface-900 to-surface-800 p-8">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 mb-2">
        <Sparkles class="w-8 h-8 text-ink-500" />
        <h1 class="text-4xl font-bold text-white">AI Prompt Editor</h1>
      </div>
    </div>
    <p class="text-zinc-400 mb-6">Manage prompts for the tattoo placement AI and quotation generator</p>

    <!-- Status Badge -->
    <div class="inline-flex items-center px-3 py-1 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs font-medium">
      Coming Soon — Chatbot Under Development
    </div>
  </div>

  <!-- Tab Navigation -->
  <div class="mb-8 border-b border-zinc-800 bg-surface-800 rounded-t-xl">
    <div class="flex gap-0">
      {#each tabs as tab}
        <button
          onclick={() => {
            activeTab = tab.id;
            hasUnsavedChanges = false;
          }}
          class="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all {activeTab === tab.id
            ? 'border-ink-500 text-white'
            : 'border-transparent text-zinc-500 hover:text-zinc-300'}"
        >
          <svelte:component this={tab.icon} class="w-4 h-4" />
          {tab.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Content Area -->
  <div class="grid grid-cols-[1fr_280px] gap-6">
    <!-- Left: Editor -->
    <div class="space-y-4">
      <!-- Prompt Name Input -->
      <div>
        <label class="block text-xs font-semibold text-zinc-400 uppercase mb-2">Prompt Name</label>
        <input
          type="text"
          value={currentPrompt.name}
          oninput={(e) => updatePromptName(e.currentTarget.value)}
          class="w-full bg-surface-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-ink-500 transition-colors"
          placeholder="Enter prompt name..."
        />
      </div>

      <!-- Prompt Description Input -->
      <div>
        <label class="block text-xs font-semibold text-zinc-400 uppercase mb-2">Description</label>
        <input
          type="text"
          value={currentPrompt.description}
          oninput={(e) => updatePromptDescription(e.currentTarget.value)}
          class="w-full bg-surface-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-ink-500 transition-colors"
          placeholder="Brief description of this prompt's purpose..."
        />
      </div>

      <!-- Large Textarea for Prompt Content -->
      <div>
        <label class="block text-xs font-semibold text-zinc-400 uppercase mb-2">Prompt Content</label>
        <textarea
          value={currentPrompt.content}
          oninput={(e) => updatePromptContent(e.currentTarget.value)}
          class="w-full min-h-[400px] bg-slate-800 border border-slate-700 rounded-xl p-4 text-zinc-200 font-mono text-sm leading-relaxed resize-y focus:border-ink-500 focus:outline-none transition-colors"
          placeholder="Enter your prompt here..."
          spellcheck="false"
        ></textarea>

        <!-- Character and Line Count -->
        <div class="flex justify-between text-xs text-zinc-600 mt-2 px-1">
          <span>{currentPrompt.content.length} characters</span>
          <span>{currentPrompt.content.split('\n').length} lines</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-4">
        <button
          onclick={savePrompt}
          disabled={!hasUnsavedChanges || saveStatus === 'saving'}
          class="flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 {saveStatus === 'saved'
            ? 'bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 text-green-400'
            : 'bg-ink-500/10 hover:bg-ink-500/20 border border-ink-500/30 hover:border-ink-500/50 text-ink-400 disabled:opacity-50 disabled:cursor-not-allowed'}"
        >
          {#if saveStatus === 'saving'}
            <div class="w-4 h-4 border-2 border-ink-400/30 border-t-ink-400 rounded-full animate-spin"></div>
            Saving...
          {:else if saveStatus === 'saved'}
            <Check class="w-4 h-4" />
            Saved
          {:else}
            Save Changes
          {/if}
        </button>

        <button
          onclick={resetPrompt}
          disabled={!hasUnsavedChanges}
          class="px-6 py-3 rounded-lg font-medium transition-all border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>

        <div class="relative">
          <button
            disabled
            title="Coming soon"
            class="px-6 py-3 rounded-lg font-medium transition-all border border-zinc-700 text-zinc-500 cursor-not-allowed opacity-50 flex items-center gap-2"
          >
            <span class="w-4 h-4">▶</span>
            Test Prompt
          </button>
          <div class="absolute bottom-full right-0 mb-2 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-400 whitespace-nowrap pointer-events-none">
            Coming soon
          </div>
        </div>
      </div>

      <!-- Unsaved Changes Indicator -->
      {#if hasUnsavedChanges}
        <div class="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          You have unsaved changes
        </div>
      {/if}
    </div>

    <!-- Right: Variables Panel -->
    <div class="bg-surface-800 border border-zinc-800 rounded-xl p-4 h-fit sticky top-8 space-y-4">
      <div>
        <h3 class="font-semibold text-white text-sm mb-1">Template Variables</h3>
        <p class="text-xs text-zinc-500">Click to insert at cursor position</p>
      </div>

      <div class="space-y-1.5">
        {#each currentPrompt.variables as variable}
          <button
            onclick={() => insertVariable(variable)}
            class="w-full text-left px-3 py-2 rounded-lg text-xs font-mono bg-zinc-800 text-tech-400 hover:bg-zinc-700 hover:text-tech-300 transition-colors flex items-center justify-between group"
          >
            <span>{variable}</span>
            <Copy class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        {/each}
      </div>

      <!-- Quick Copy Buttons -->
      <div class="pt-3 border-t border-zinc-700 space-y-2">
        <button
          onclick={() => copyToClipboard(currentPrompt.content)}
          class="w-full px-3 py-2 rounded-lg text-xs font-medium bg-tech-500/10 hover:bg-tech-500/20 text-tech-400 border border-tech-500/30 hover:border-tech-500/50 transition-all flex items-center justify-center gap-2"
        >
          <Copy class="w-3 h-3" />
          {copyFeedback || 'Copy Prompt'}
        </button>
      </div>

      <!-- Last Modified Timestamp -->
      <div class="pt-3 border-t border-zinc-800">
        <p class="text-xs text-zinc-600 mb-1">Last modified</p>
        <p class="text-xs text-zinc-500">
          {currentPrompt.lastModified.toLocaleDateString('en-PH')}
          <br />
          {currentPrompt.lastModified.toLocaleTimeString('en-PH')}
        </p>
      </div>

      <!-- Info Section -->
      <div class="pt-3 border-t border-zinc-800 bg-zinc-900/50 rounded-lg p-3">
        <p class="text-xs text-zinc-400 leading-relaxed">
          Variables are templates that get replaced with real data when the prompt is executed. Use them to keep prompts flexible and reusable.
        </p>
      </div>
    </div>
  </div>
</div>
