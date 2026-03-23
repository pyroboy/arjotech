<script lang="ts">
  import type { BookingFormData } from '$types/bookings';

  interface Props {
    show: boolean;
    formData: Pick<BookingFormData, 'styleDescription'>;
    handleInputChange: (field: keyof BookingFormData, value: string) => void;
  }

  let { show, formData, handleInputChange }: Props = $props();
</script>

{#if show}
  <div class="space-y-1.5 bg-surface-800 rounded-lg shadow-md p-6 my-8 animate-in fade-in duration-300">
    <label for="styleDescription" class="text-sm font-medium text-zinc-300">
      Style Description (Required for Combination/Other/Custom)
    </label>
    <textarea
      id="styleDescription"
      placeholder="Please describe the style mix, custom idea, or details for 'Other' here. e.g., 'Mix of Neo-Trad lines and Watercolor shading', 'Like artist X's style', 'Geometric patterns combined with realism'."
      value={formData.styleDescription || ''}
      oninput={(e) => handleInputChange('styleDescription', e.currentTarget.value)}
      rows={4}
      required={show}
      class="w-full rounded-lg border border-zinc-700 bg-surface-900 text-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-ink-500 focus:border-transparent"
    ></textarea>
    <p class="text-xs text-zinc-400 pt-1">
      Explain the combination, custom elements, or provide more detail.
    </p>
  </div>
{/if}
