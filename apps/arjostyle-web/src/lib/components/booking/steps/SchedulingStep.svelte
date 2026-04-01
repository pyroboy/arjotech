<script lang="ts">
  import type { BookingFormData } from '$types/bookings';
  import { ALL_DAY_TIME_SLOTS } from '$types/appointments';

  interface Props {
    formData: BookingFormData;
    updateFormData: (data: Partial<BookingFormData>) => void;
  }

  let { formData, updateFormData }: Props = $props();

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Get next 60 days for date picker guidance
  let selectedDateStr = $derived(
    formData.appointmentDate instanceof Date
      ? formData.appointmentDate.toISOString().split('T')[0]
      : ''
  );
</script>

<div class="py-6 space-y-6 max-w-lg mx-auto">
  <h2 class="font-display text-2xl text-white">Schedule Your Session</h2>
  <p class="text-zinc-400">Select a preferred date and time. Final confirmation will be via your preferred contact method.</p>

  <!-- Date Picker -->
  <div>
    <label class="block text-sm text-zinc-400 mb-2" for="date">Preferred Date *</label>
    <input
      id="date"
      type="date"
      min={today}
      class="w-full bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ink-500 transition-colors"
      value={selectedDateStr}
      onchange={(e) => {
        const val = (e.target as HTMLInputElement).value;
        updateFormData({ appointmentDate: val ? new Date(val) : null });
      }}
    />
  </div>

  <!-- Time Slots -->
  {#if formData.appointmentDate}
    <div>
      <span id="time-label" class="block text-sm text-zinc-400 mb-3">Preferred Time *</span>
      <div class="grid grid-cols-3 gap-2" role="group" aria-labelledby="time-label">
        {#each ALL_DAY_TIME_SLOTS as slot}
          <button
            type="button"
            class="py-2.5 rounded-xl text-sm border transition-colors
              {formData.appointmentTime === slot
                ? 'bg-ink-500/20 border-ink-500/50 text-ink-400'
                : 'bg-surface-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
            onclick={() => updateFormData({ appointmentTime: slot })}
          >
            {slot}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Urgency -->
  <div>
    <span id="urgency-label" class="block text-sm text-zinc-400 mb-2">Urgency</span>
    <div class="flex gap-3" role="group" aria-labelledby="urgency-label">
      {#each ['normal', 'soon', 'urgent'] as level}
        <button
          type="button"
          class="flex-1 py-2 rounded-xl text-sm border transition-colors capitalize
            {formData.urgencyLevel === level
              ? 'bg-tech-500/20 border-tech-500/40 text-tech-400'
              : 'bg-surface-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
          onclick={() => updateFormData({ urgencyLevel: level })}
        >
          {level}
        </button>
      {/each}
    </div>
  </div>
</div>
