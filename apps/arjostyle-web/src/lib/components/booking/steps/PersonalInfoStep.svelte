<script lang="ts">
  import type { BookingFormData } from '$types/bookings';

  interface Props {
    formData: BookingFormData;
    updateFormData: (data: Partial<BookingFormData>) => void;
  }

  let { formData, updateFormData }: Props = $props();

  const contactMethods = ['sms', 'email', 'whatsapp', 'facebook', 'instagram'];
</script>

<div class="py-6 space-y-6 max-w-lg mx-auto">
  <h2 class="font-display text-2xl text-white">Personal Information</h2>
  <p class="text-zinc-400">We need your details to confirm your booking and reach out about your session.</p>

  <div class="space-y-4">
    <!-- Name -->
    <div>
      <label class="block text-sm text-zinc-400 mb-1" for="name">Full Name *</label>
      <input
        id="name"
        type="text"
        class="w-full bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-ink-500 transition-colors"
        placeholder="Your full name"
        value={formData.name ?? ''}
        oninput={(e) => updateFormData({ name: (e.target as HTMLInputElement).value })}
      />
    </div>

    <!-- Email -->
    <div>
      <label class="block text-sm text-zinc-400 mb-1" for="email">Email Address *</label>
      <input
        id="email"
        type="email"
        class="w-full bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-ink-500 transition-colors"
        placeholder="your@email.com"
        value={formData.email ?? ''}
        oninput={(e) => updateFormData({ email: (e.target as HTMLInputElement).value })}
      />
    </div>

    <!-- Phone -->
    <div>
      <label class="block text-sm text-zinc-400 mb-1" for="phone">Phone Number *</label>
      <input
        id="phone"
        type="tel"
        class="w-full bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-ink-500 transition-colors"
        placeholder="+63 9XX XXX XXXX"
        value={formData.phone ?? ''}
        oninput={(e) => updateFormData({ phone: (e.target as HTMLInputElement).value })}
      />
    </div>

    <!-- Date of Birth -->
    <div>
      <label class="block text-sm text-zinc-400 mb-1" for="dob">Date of Birth * (must be 18+)</label>
      <input
        id="dob"
        type="date"
        class="w-full bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ink-500 transition-colors"
        value={formData.dateOfBirth instanceof Date
          ? formData.dateOfBirth.toISOString().split('T')[0]
          : (formData.dateOfBirth ?? '')}
        onchange={(e) => updateFormData({ dateOfBirth: new Date((e.target as HTMLInputElement).value) })}
      />
    </div>

    <!-- Preferred Contact -->
    <div>
      <span id="contact-method-label" class="block text-sm text-zinc-400 mb-2">Preferred Contact Method</span>
      <div class="flex flex-wrap gap-2" role="group" aria-labelledby="contact-method-label">
        {#each contactMethods as method}
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg text-sm border transition-colors capitalize
              {formData.preferredContactMethod === method
                ? 'bg-ink-500/20 border-ink-500/50 text-ink-400'
                : 'bg-surface-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
            onclick={() => updateFormData({ preferredContactMethod: method })}
          >
            {method}
          </button>
        {/each}
      </div>
    </div>

    <!-- Instagram handle (optional) -->
    <div>
      <label class="block text-sm text-zinc-400 mb-1" for="instagram">Instagram Handle (optional)</label>
      <input
        id="instagram"
        type="text"
        class="w-full bg-surface-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-ink-500 transition-colors"
        placeholder="@yourusername"
        value={formData.instagramHandle ?? ''}
        oninput={(e) => updateFormData({ instagramHandle: (e.target as HTMLInputElement).value })}
      />
    </div>
  </div>
</div>
