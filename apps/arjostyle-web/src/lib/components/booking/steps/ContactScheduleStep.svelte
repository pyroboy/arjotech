<script lang="ts">
  import type { BookingFormData } from '$types/bookings';
  import { ALL_DAY_TIME_SLOTS } from '$types/appointments';

  interface Props {
    formData: BookingFormData;
    updateFormData: (data: Partial<BookingFormData>) => void;
  }

  let { formData, updateFormData }: Props = $props();

  const today = new Date().toISOString().split('T')[0];

  let selectedDateStr = $derived(
    formData.appointmentDate instanceof Date
      ? formData.appointmentDate.toISOString().split('T')[0]
      : ''
  );
</script>

<div class="py-6 space-y-8 max-w-lg mx-auto">
  <div>
    <h2 class="booking-title">Book Your Session</h2>
    <p class="text-zinc-400 mt-1">Just a few details so we can get you booked.</p>
  </div>

  <!-- Contact Info Section -->
  <div class="space-y-4">
    <h3 class="booking-section-title">Contact Info</h3>

    <!-- Name -->
    <div>
      <label class="block booking-label mb-1" for="name">Full Name *</label>
      <input
        id="name"
        type="text"
        class="w-full bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-base min-h-[48px] placeholder-zinc-600 input-focus-glow transition-colors"
        placeholder="Your full name"
        value={formData.name ?? ''}
        oninput={(e) => updateFormData({ name: (e.target as HTMLInputElement).value })}
      />
    </div>

    <!-- Email -->
    <div>
      <label class="block booking-label mb-1" for="email">Email Address *</label>
      <input
        id="email"
        type="email"
        class="w-full bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-base min-h-[48px] placeholder-zinc-600 input-focus-glow transition-colors"
        placeholder="your@email.com"
        value={formData.email ?? ''}
        oninput={(e) => updateFormData({ email: (e.target as HTMLInputElement).value })}
      />
    </div>

    <!-- Phone (optional) -->
    <div>
      <label class="block booking-label mb-1" for="phone">Phone Number <span class="text-zinc-600">(optional)</span></label>
      <input
        id="phone"
        type="tel"
        class="w-full bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-base min-h-[48px] placeholder-zinc-600 input-focus-glow transition-colors"
        placeholder="+63 9XX XXX XXXX"
        value={formData.phone ?? ''}
        oninput={(e) => updateFormData({ phone: (e.target as HTMLInputElement).value })}
      />
    </div>

    <!-- Age Confirmation Checkbox -->
    <div>
      <label class="flex items-center gap-3 cursor-pointer hover:bg-zinc-700/20 p-3 rounded-xl border border-zinc-700 transition-colors {formData.ageConfirmed ? 'border-ink-500/50 bg-ink-500/5' : ''}">
        <input
          type="checkbox"
          class="mt-0.5 accent-ink-500 w-4 h-4"
          checked={formData.ageConfirmed ?? false}
          onchange={(e) => updateFormData({ ageConfirmed: (e.target as HTMLInputElement).checked })}
        />
        <span class="text-sm text-zinc-300">I confirm I am 18 years or older *</span>
      </label>
    </div>
  </div>

  <!-- Preferred Date Section -->
  <div class="space-y-4">
    <h3 class="booking-section-title">Scheduling <span class="text-zinc-500 normal-case font-normal text-xs">(optional)</span></h3>
    <p class="text-xs text-zinc-500">Pick a preferred date and time, or leave blank and we'll contact you to schedule.</p>

    <div>
      <label class="block booking-label mb-2" for="preferred-date">Preferred Date</label>
      <input
        id="preferred-date"
        type="date"
        min={today}
        class="w-full bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-base min-h-[48px] input-focus-glow transition-colors"
        value={selectedDateStr}
        onchange={(e) => {
          const val = (e.target as HTMLInputElement).value;
          updateFormData({ appointmentDate: val ? new Date(val) : null });
        }}
      />
    </div>

    <!-- Time Slots -->
    <div>
      <span id="time-label" class="block booking-label mb-3">Preferred Time</span>
      <div class="grid grid-cols-3 gap-2" role="group" aria-labelledby="time-label">
        <button
          type="button"
          class="py-2.5 rounded-xl text-sm border transition-colors card-interactive min-h-[44px]
            {!formData.appointmentTime || formData.appointmentTime === 'flexible'
              ? 'bg-ink-500/20 border-ink-500/50 text-ink-400'
              : 'bg-surface-800 border-zinc-700 text-zinc-400'}"
          onclick={() => updateFormData({ appointmentTime: 'flexible' })}
        >
          Flexible
        </button>
        {#each ALL_DAY_TIME_SLOTS as slot}
          <button
            type="button"
            class="py-2.5 rounded-xl text-sm border transition-colors card-interactive min-h-[44px]
              {formData.appointmentTime === slot
                ? 'bg-ink-500/20 border-ink-500/50 text-ink-400'
                : 'bg-surface-800 border-zinc-700 text-zinc-400'}"
            onclick={() => updateFormData({ appointmentTime: slot })}
          >
            {slot}
          </button>
        {/each}
      </div>
    </div>
  </div>

</div>
