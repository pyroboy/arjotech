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
    <h2 class="booking-title uppercase tracking-wide">Book Your Session</h2>
    <p class="text-zinc-500 font-mono text-sm mt-1">JUST A FEW DETAILS SO WE CAN GET YOU BOOKED.</p>
  </div>

  <!-- Contact Info Section -->
  <div class="space-y-4">
    <h3 class="booking-section-title uppercase tracking-wide">Contact Info</h3>

    <!-- Name -->
    <div>
      <label class="block booking-label mb-1 uppercase tracking-wide" for="name">Full Name *</label>
      <input
        id="name"
        type="text"
        class="w-full bg-dark border border-border px-4 py-3 text-white text-base font-mono min-h-[48px] placeholder-zinc-700 transition-colors"
        placeholder="YOUR FULL NAME"
        value={formData.name ?? ''}
        oninput={(e) => updateFormData({ name: (e.target as HTMLInputElement).value })}
      />
    </div>

    <!-- Email -->
    <div>
      <label class="block booking-label mb-1 uppercase tracking-wide" for="email">Email Address *</label>
      <input
        id="email"
        type="email"
        class="w-full bg-dark border border-border px-4 py-3 text-white text-base font-mono min-h-[48px] placeholder-zinc-700 transition-colors"
        placeholder="YOUR@EMAIL.COM"
        value={formData.email ?? ''}
        oninput={(e) => updateFormData({ email: (e.target as HTMLInputElement).value })}
      />
    </div>

    <!-- Phone (optional) -->
    <div>
      <label class="block booking-label mb-1 uppercase tracking-wide" for="phone">Phone Number <span class="text-zinc-700">(OPTIONAL)</span></label>
      <input
        id="phone"
        type="tel"
        class="w-full bg-dark border border-border px-4 py-3 text-white text-base font-mono min-h-[48px] placeholder-zinc-700 transition-colors"
        placeholder="+63 9XX XXX XXXX"
        value={formData.phone ?? ''}
        oninput={(e) => updateFormData({ phone: (e.target as HTMLInputElement).value })}
      />
    </div>

    <!-- Age Confirmation Checkbox -->
    <div>
      <label class="flex items-center gap-3 cursor-pointer hover:bg-elevated/50 p-3 border border-border transition-colors {formData.ageConfirmed ? 'border-ink bg-ink/10' : ''}">
        <input
          type="checkbox"
          class="mt-0.5 accent-ink w-4 h-4"
          checked={formData.ageConfirmed ?? false}
          onchange={(e) => updateFormData({ ageConfirmed: (e.target as HTMLInputElement).checked })}
        />
        <span class="text-sm font-mono text-zinc-300">I CONFIRM I AM 18 YEARS OR OLDER *</span>
      </label>
    </div>
  </div>

  <!-- Preferred Date Section -->
  <div class="space-y-4">
    <h3 class="booking-section-title uppercase tracking-wide">Scheduling <span class="text-zinc-700 normal-case font-mono text-xs">(OPTIONAL)</span></h3>
    <p class="text-xs font-mono text-zinc-600">PICK A PREFERRED DATE AND TIME, OR LEAVE BLANK AND WE'LL CONTACT YOU TO SCHEDULE.</p>

    <div>
      <label class="block booking-label mb-2 uppercase tracking-wide" for="preferred-date">Preferred Date</label>
      <input
        id="preferred-date"
        type="date"
        min={today}
        class="w-full bg-dark border border-border px-4 py-3 text-white text-base font-mono min-h-[48px] transition-colors"
        value={selectedDateStr}
        onchange={(e) => {
          const val = (e.target as HTMLInputElement).value;
          updateFormData({ appointmentDate: val ? new Date(val) : null });
        }}
      />
    </div>

    <!-- Time Slots -->
    <div>
      <span id="time-label" class="block booking-label mb-3 uppercase tracking-wide">Preferred Time</span>
      <div class="grid grid-cols-3 gap-2" role="group" aria-labelledby="time-label">
        <button
          type="button"
          class="py-2.5 text-sm font-mono border transition-colors min-h-[44px]
            {!formData.appointmentTime || formData.appointmentTime === 'flexible'
              ? 'bg-ink border-ink text-dark font-bold'
              : 'bg-elevated border-border text-zinc-500 hover:border-border-light hover:text-white'}"
          onclick={() => updateFormData({ appointmentTime: 'flexible' })}
        >
          FLEXIBLE
        </button>
        {#each ALL_DAY_TIME_SLOTS as slot}
          <button
            type="button"
            class="py-2.5 text-sm font-mono border transition-colors min-h-[44px]
              {formData.appointmentTime === slot
                ? 'bg-ink border-ink text-dark font-bold'
                : 'bg-elevated border-border text-zinc-500 hover:border-border-light hover:text-white'}"
            onclick={() => updateFormData({ appointmentTime: slot })}
          >
            {slot}
          </button>
        {/each}
      </div>
    </div>
  </div>

</div>
