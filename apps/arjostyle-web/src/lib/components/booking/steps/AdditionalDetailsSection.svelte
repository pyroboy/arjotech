<script lang="ts">
  interface Props {
    formData: {
      primaryTattooStyle?: string;
      specificRequirements?: string;
      mustHaveElements?: string;
      colorPreferences?: string;
      placementNotes?: string;
    };
    handleInputChange: (field: string, value: string | number) => void;
  }

  let { formData, handleInputChange }: Props = $props();
</script>

<div>
  <div class="bg-surface-800 rounded-lg shadow-md space-y-6">
    <div class="space-y-1.5">
      <label for="specificRequirements" class="text-sm font-medium text-zinc-300">
        Specific Requirements / Overall Idea
      </label>
      <textarea
        id="specificRequirements"
        placeholder="Describe the main subject matter (e.g., lion, flower, abstract shape), concept, and any specific details unrelated to style..."
        value={formData.specificRequirements || ''}
        oninput={(e) => handleInputChange('specificRequirements', e.currentTarget.value)}
        rows={4}
        class="w-full rounded-lg border border-zinc-700 bg-surface-900 text-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-ink-500 focus:border-transparent"
      ></textarea>
    </div>
    <div class="space-y-1.5">
      <label for="mustHaveElements" class="text-sm font-medium text-zinc-300">Must-Have Elements</label>
      <input
        id="mustHaveElements"
        placeholder="e.g., Specific flower type, a meaningful date/quote, a particular symbol"
        value={formData.mustHaveElements || ''}
        oninput={(e) => handleInputChange('mustHaveElements', e.currentTarget.value)}
        class="w-full rounded-lg border border-zinc-700 bg-surface-900 text-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-ink-500 focus:border-transparent"
      />
    </div>
    <div class="space-y-1.5">
      <label for="colorPreferences" class="text-sm font-medium text-zinc-300">Color Preferences</label>
      <input
        id="colorPreferences"
        placeholder="e.g., Black and grey only, vibrant blues and purples, pops of red"
        value={formData.colorPreferences || ''}
        oninput={(e) => handleInputChange('colorPreferences', e.currentTarget.value)}
        class="w-full rounded-lg border border-zinc-700 bg-surface-900 text-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-ink-500 focus:border-transparent"
      />
    </div>
    <div class="space-y-1.5">
      <label for="placementNotes" class="text-sm font-medium text-zinc-300">Placement Notes</label>
      <textarea
        id="placementNotes"
        placeholder="Any specific notes about placement? e.g., 'Avoid stretch marks on stomach', 'Integrate with existing tattoo on left shoulder', 'Curve with muscle flow'"
        value={formData.placementNotes || ''}
        oninput={(e) => handleInputChange('placementNotes', e.currentTarget.value)}
        rows={3}
        class="w-full rounded-lg border border-zinc-700 bg-surface-900 text-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-ink-500 focus:border-transparent"
      ></textarea>
    </div>
  </div>
</div>
