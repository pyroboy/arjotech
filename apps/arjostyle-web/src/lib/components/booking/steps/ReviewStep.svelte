<script lang="ts">
  import type { BookingFormData } from '$types/bookings';
  import { User, CalendarDays, CreditCard, Clock, Layers, Image as ImageIcon, CheckCircle, AlertTriangle, Send, Info, Loader2, FileImage } from 'lucide-svelte';

  interface Props {
    formData: BookingFormData;
    updateFormData: (data: Partial<BookingFormData>) => void;
    onSubmitSuccess: () => void;
  }

  let { formData, updateFormData, onSubmitSuccess }: Props = $props();

  let isSubmitting = $state(false);
  let submitError = $state<string | null>(null);
  let submissionProgress = $state(0);
  let submissionStatusText = $state('');

  // Helper functions
  function formatDateForDisplay(date: Date | string | null): string {
    if (!date) return 'N/A';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return 'N/A';
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
    } catch {
      return 'N/A';
    }
  }

  function formatCurrency(amount: number | undefined): string {
    if (amount === undefined || isNaN(amount)) return 'N/A';
    return `₱${Math.round(amount).toLocaleString()}`;
  }

  function formatDuration(totalMinutes: number | undefined): string {
    if (!totalMinutes) return 'N/A';
    const rounded = Math.round(totalMinutes / 30) * 30;
    const hours = Math.floor(rounded / 60);
    const minutes = rounded % 60;
    if (hours === 0) return `Approx. ${minutes} min`;
    if (minutes === 0) return `Approx. ${hours} hr${hours > 1 ? 's' : ''}`;
    return `Approx. ${hours} hr${hours > 1 ? 's' : ''} ${minutes} min`;
  }

  function getFreedomDescription(value: number): string {
    if (value <= 20) return 'Follow References Closely';
    if (value <= 40) return 'Mostly Based on References';
    if (value <= 60) return 'Balanced Interpretation';
    if (value <= 80) return 'Mostly Artist\'s Interpretation';
    return 'Full Creative Freedom';
  }

  const complexityLabel = $derived(
    ['Simple', 'Detailed', 'Intricate'][formData.complexity ? formData.complexity - 1 : -1] ?? 'N/A'
  );

  const deposit = $derived(Math.round((formData.pricing?.total || 0) / 2 / 100) * 100);

  // State derivations
  const allTermsChecked = $derived(
    (formData.termsAgreed ?? false) && (formData.medicalConfirmed ?? false) && (formData.ageConfirmed ?? false)
  );

  const isMissingInfo = $derived(
    !formData.name || !formData.email || !formData.phone || !formData.dateOfBirth
  );

  const isSubmissionDisabled = $derived(!allTermsChecked || isMissingInfo || isSubmitting);

  async function handleFinalSubmit() {
    if (isSubmissionDisabled) return;
    isSubmitting = true;
    submitError = null;
    submissionProgress = 10;
    submissionStatusText = 'Preparing request...';

    try {
      submissionStatusText = 'Sending request...';
      submissionProgress = 40;

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dateOfBirth instanceof Date ? formData.dateOfBirth.toISOString() : formData.dateOfBirth,
        size: formData.size,
        isColor: formData.isColor,
        complexity: formData.complexity,
        selectedCategory: formData.selectedCategory,
        currentPlacement: formData.currentPlacement,
        placementIndex: formData.placementIndex,
        isCoverUp: formData.isCoverUp,
        primaryTattooStyle: formData.primaryTattooStyle,
        styleDescription: formData.styleDescription,
        pricing: formData.pricing,
        estimatedDurationMinutes: formData.estimatedDurationMinutes,
        estimatedSessions: formData.estimatedSessions,
        creativeFreedom: formData.creativeFreedom,
        specificRequirements: formData.specificRequirements,
        mustHaveElements: formData.mustHaveElements,
        colorPreferences: formData.colorPreferences,
        placementNotes: formData.placementNotes,
        appointmentDate: formData.appointmentDate instanceof Date ? formData.appointmentDate.toISOString() : formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        urgencyLevel: formData.urgencyLevel,
        termsAgreed: formData.termsAgreed,
        medicalConfirmed: formData.medicalConfirmed,
        ageConfirmed: formData.ageConfirmed,
        instagramHandle: formData.instagramHandle,
        preferredContactMethod: formData.preferredContactMethod,
        referralSource: formData.referralSource,
        painLevel: formData.painLevel,
        painReason: formData.painReason,
        visualComplexityScore: formData.visualComplexityScore,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed. Please try again.');

      submissionProgress = 100;
      submissionStatusText = 'Booking request sent!';

      setTimeout(() => {
        isSubmitting = false;
        onSubmitSuccess();
      }, 2000);
    } catch (err) {
      submitError = err instanceof Error ? err.message : 'Something went wrong.';
      isSubmitting = false;
      submissionProgress = 0;
    }
  }
</script>

<div class="py-8 space-y-8 max-w-6xl mx-auto px-4">
  <!-- Header -->
  <div>
    <h2 class="text-2xl font-bold text-white mb-2">Review Your Booking Request</h2>
    <p class="text-zinc-400">Almost there! Please check the details you've provided.</p>
  </div>

  <!-- Two-column grid -->
  <div class="grid md:grid-cols-2 gap-6">
    <!-- Card A: Contact & Personal Info -->
    <div class="bg-surface-800 border border-zinc-800 rounded-xl p-5 space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <User size={20} class="text-ink-500" />
        <h3 class="text-lg font-semibold text-white">Contact & Personal Info</h3>
      </div>

      <div class="space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-zinc-500">Name:</span>
          <span class={`font-medium text-right ${!formData.name ? 'text-red-400' : 'text-white'}`}>
            {formData.name || 'Missing'}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Email:</span>
          <span class={`font-medium text-right ${!formData.email ? 'text-red-400' : 'text-white'}`}>
            {formData.email || 'Missing'}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Phone:</span>
          <span class={`font-medium text-right ${!formData.phone ? 'text-red-400' : 'text-white'}`}>
            {formData.phone || 'Missing'}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Date of Birth:</span>
          <span class={`font-medium text-right ${!formData.dateOfBirth ? 'text-red-400' : 'text-white'}`}>
            {formatDateForDisplay(formData.dateOfBirth)}
          </span>
        </div>
        {#if formData.preferredContactMethod}
          <div class="flex justify-between">
            <span class="text-zinc-500">Preferred Contact:</span>
            <span class="font-medium text-white text-right capitalize">{formData.preferredContactMethod}</span>
          </div>
        {/if}
        {#if formData.instagramHandle}
          <div class="flex justify-between">
            <span class="text-zinc-500">Instagram:</span>
            <span class="font-medium text-white text-right">@{formData.instagramHandle}</span>
          </div>
        {/if}
        {#if formData.facebookProfile}
          <div class="flex justify-between">
            <span class="text-zinc-500">Facebook:</span>
            <span class="font-medium text-white text-right">{formData.facebookProfile}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Card B: Requested Appointment -->
    <div class="bg-surface-800 border border-zinc-800 rounded-xl p-5 space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <CalendarDays size={20} class="text-ink-500" />
        <h3 class="text-lg font-semibold text-white">Requested Appointment</h3>
      </div>

      <div class="space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-zinc-500">Date:</span>
          <span class="font-medium text-white text-right">
            {#if formData.appointmentDate}
              {formatDateForDisplay(formData.appointmentDate)}
            {:else}
              <span class="text-zinc-500">Not specified</span>
            {/if}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Time:</span>
          <span class="font-medium text-white text-right">
            {formData.appointmentTime || 'Not specified'}
          </span>
        </div>
        {#if formData.artistPreference}
          <div class="flex justify-between">
            <span class="text-zinc-500">Artist Preference:</span>
            <span class="font-medium text-white text-right capitalize">{formData.artistPreference}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Card C: Tattoo Request Summary -->
    <div class="md:col-span-2 bg-surface-800 border border-zinc-800 rounded-xl p-5 space-y-6">
      <div>
        <h3 class="text-lg font-semibold text-white mb-1">Tattoo Request Summary</h3>
        <p class="text-xs text-zinc-500">Review design details and estimates. Estimates subject to artist confirmation.</p>
      </div>

      <!-- Detail Grid -->
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
        <div class="flex justify-between">
          <span class="text-zinc-500">Placement:</span>
          <span class="font-medium text-white text-right">{formData.currentPlacement || 'TBD'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Size:</span>
          <span class="font-medium text-white text-right">
            {#if formData.size}
              Approx. {formData.size} sq in
            {:else}
              TBD
            {/if}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Complexity:</span>
          <span class="font-medium text-white text-right">{complexityLabel}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Color:</span>
          <span class="font-medium text-white text-right">{formData.isColor ? 'Yes' : 'Black & Grey'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Cover-up:</span>
          <span class="font-medium text-white text-right">{formData.isCoverUp ? 'Yes' : 'No'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">References:</span>
          <span class="font-medium text-white text-right flex items-center gap-2">
            {formData.referenceImages.length}
            <FileImage size={16} class="text-ink-500" />
          </span>
        </div>
      </div>

      <!-- Creative Freedom -->
      <div class="pt-2">
        <div class="flex justify-between items-start mb-2">
          <span class="text-sm text-zinc-500">Creative Freedom:</span>
          <span class="text-sm font-medium text-ink-400">{formData.creativeFreedom}%</span>
        </div>
        <div class="bg-zinc-900 rounded h-1.5 overflow-hidden">
          <div
            class="bg-gradient-to-r from-ink-500 to-ink-400 h-full transition-all"
            style="width: {formData.creativeFreedom}%"
          />
        </div>
        <p class="text-xs text-zinc-500 mt-1">{getFreedomDescription(formData.creativeFreedom)}</p>
      </div>

      <!-- Tattoo Style -->
      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm text-zinc-500">Tattoo Style:</span>
          <span class="text-sm font-medium text-white capitalize">{formData.primaryTattooStyle || 'Not specified'}</span>
        </div>
      </div>

      <!-- Style Description -->
      {#if formData.styleDescription}
        <div class="text-sm">
          <p class="text-zinc-500 mb-1">Style Description:</p>
          <p class="text-white bg-zinc-900/50 rounded p-2">{formData.styleDescription}</p>
        </div>
      {/if}

      <!-- Separator -->
      <div class="border-t border-zinc-700" />

      <!-- Estimates Section -->
      <div class="space-y-3">
        <div class="flex items-center gap-2 mb-2">
          <Clock size={16} class="text-ink-500" />
          <h4 class="font-semibold text-white">Time & Cost Estimates</h4>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div class="bg-zinc-900/30 rounded p-3">
            <p class="text-xs text-zinc-500 mb-1">Est. Duration</p>
            <p class="text-white font-semibold">{formatDuration(formData.estimatedDurationMinutes)}</p>
          </div>

          {#if formData.estimatedSessions && formData.estimatedSessions > 1}
            <div class="bg-amber-500/10 border border-amber-500/30 rounded p-3">
              <p class="text-xs text-zinc-500 mb-1">Sessions</p>
              <p class="text-amber-400 font-semibold">Likely requires {formData.estimatedSessions} sessions</p>
            </div>
          {/if}
        </div>

        <div class="bg-zinc-900/30 rounded p-3">
          <p class="text-xs text-zinc-500 mb-1">Est. Price</p>
          <p class="text-ink-400 text-2xl font-bold">{formatCurrency(formData.pricing?.total)}</p>
          <p class="text-xs text-zinc-500 mt-1">50% deposit: {formatCurrency(deposit)}</p>
        </div>

        <div class="bg-blue-500/10 border border-blue-500/30 rounded p-3 flex gap-3">
          <Info size={16} class="text-blue-400 flex-shrink-0 mt-0.5" />
          <p class="text-xs text-blue-300">
            Duration and price are initial estimates based on your specifications. Final details will be confirmed by the artist.
          </p>
        </div>
      </div>

      <!-- Separator -->
      <div class="border-t border-zinc-700" />

      <!-- Notes Section -->
      <div class="space-y-3">
        <h4 class="font-semibold text-white">Your Notes & Requirements</h4>

        {#if formData.specificRequirements || formData.mustHaveElements || formData.colorPreferences || formData.placementNotes}
          <div class="space-y-2">
            {#if formData.specificRequirements}
              <div class="bg-zinc-800/50 rounded p-3 text-sm">
                <p class="text-zinc-500 mb-1 text-xs">Specific Requirements:</p>
                <p class="text-white">{formData.specificRequirements}</p>
              </div>
            {/if}
            {#if formData.mustHaveElements}
              <div class="bg-zinc-800/50 rounded p-3 text-sm">
                <p class="text-zinc-500 mb-1 text-xs">Must-Have Elements:</p>
                <p class="text-white">{formData.mustHaveElements}</p>
              </div>
            {/if}
            {#if formData.colorPreferences}
              <div class="bg-zinc-800/50 rounded p-3 text-sm">
                <p class="text-zinc-500 mb-1 text-xs">Color Preferences:</p>
                <p class="text-white">{formData.colorPreferences}</p>
              </div>
            {/if}
            {#if formData.placementNotes}
              <div class="bg-zinc-800/50 rounded p-3 text-sm">
                <p class="text-zinc-500 mb-1 text-xs">Placement Notes:</p>
                <p class="text-white">{formData.placementNotes}</p>
              </div>
            {/if}
          </div>
        {:else}
          <p class="text-sm text-zinc-500 italic">No specific details provided.</p>
        {/if}
      </div>

      <!-- Reference Images -->
      {#if formData.referenceImages.length > 0}
        <div class="border-t border-zinc-700 pt-4">
          <div class="flex items-center gap-2 mb-3">
            <ImageIcon size={16} class="text-ink-500" />
            <h4 class="font-semibold text-white">Reference Images</h4>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each Array.from({ length: formData.referenceImages.length }) as _, i}
              <div class="inline-flex items-center gap-1 bg-ink-500/20 text-ink-400 px-2 py-1 rounded text-xs font-medium">
                <FileImage size={12} />
                Image {i + 1}
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Card D: Next Steps -->
    <div class="md:col-span-2 bg-ink-500/5 border border-ink-500/30 rounded-xl p-5 space-y-3">
      <div class="flex items-start gap-3">
        <CheckCircle size={20} class="text-ink-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-white mb-1">What Happens Next</h3>
          <ul class="text-sm text-zinc-400 space-y-1">
            <li>✓ We'll review your request and contact you within 24-48 hours</li>
            <li>✓ The artist will confirm all details and finalize pricing</li>
            <li>✓ A 50% non-refundable deposit ({formatCurrency(deposit)}) will be required to secure your appointment</li>
            <li>✓ We'll send you a contract and appointment confirmation</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Agreement Section -->
  <div class="bg-surface-800 border border-zinc-800 rounded-xl p-5 space-y-4">
    <div>
      <h3 class="text-lg font-semibold text-white">Agreement</h3>
      <p class="text-xs text-zinc-500 mt-1">Please review and agree before submitting.</p>
    </div>

    <div class="space-y-3">
      <label class="flex items-start gap-3 cursor-pointer hover:bg-zinc-700/20 p-2 rounded transition">
        <input
          type="checkbox"
          class="mt-1 accent-ink-500"
          checked={formData.termsAgreed ?? false}
          onchange={(e) => updateFormData({ termsAgreed: (e.target as HTMLInputElement).checked })}
        />
        <span class="text-sm text-zinc-400">
          I agree to the <a href="/terms" class="text-ink-400 hover:text-ink-300 underline" target="_blank">Terms & Conditions</a> and
          <a href="/privacy" class="text-ink-400 hover:text-ink-300 underline" target="_blank">Privacy Policy</a>.
        </span>
      </label>

      <label class="flex items-start gap-3 cursor-pointer hover:bg-zinc-700/20 p-2 rounded transition">
        <input
          type="checkbox"
          class="mt-1 accent-ink-500"
          checked={formData.medicalConfirmed ?? false}
          onchange={(e) => updateFormData({ medicalConfirmed: (e.target as HTMLInputElement).checked })}
        />
        <span class="text-sm text-zinc-400">
          I confirm I have no medical conditions that contraindicate tattooing and I will disclose any relevant conditions to the artist before the appointment.
        </span>
      </label>

      <label class="flex items-start gap-3 cursor-pointer hover:bg-zinc-700/20 p-2 rounded transition">
        <input
          type="checkbox"
          class="mt-1 accent-ink-500"
          checked={formData.ageConfirmed ?? false}
          onchange={(e) => updateFormData({ ageConfirmed: (e.target as HTMLInputElement).checked })}
        />
        <span class="text-sm text-zinc-400">
          I confirm I am 18 years of age or older and have a valid government-issued ID available for the appointment.
        </span>
      </label>
    </div>
  </div>

  <!-- Error Messages -->
  {#if submitError}
    <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3">
      <AlertTriangle size={20} class="text-red-400 flex-shrink-0 mt-0.5" />
      <div>
        <p class="text-sm text-red-400 font-medium">Error</p>
        <p class="text-sm text-red-300">{submitError}</p>
      </div>
    </div>
  {/if}

  {#if isMissingInfo}
    <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex gap-3">
      <AlertTriangle size={20} class="text-yellow-400 flex-shrink-0 mt-0.5" />
      <div>
        <p class="text-sm text-yellow-400 font-medium">Complete Your Information</p>
        <p class="text-sm text-yellow-300">Please fill in your name, email, phone, and date of birth to submit.</p>
      </div>
    </div>
  {/if}

  {#if !allTermsChecked}
    <div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex gap-3">
      <Info size={20} class="text-blue-400 flex-shrink-0 mt-0.5" />
      <div>
        <p class="text-sm text-blue-400 font-medium">Review & Agree</p>
        <p class="text-sm text-blue-300">Please review and agree to all terms and conditions before submitting.</p>
      </div>
    </div>
  {/if}

  <!-- Submit Button -->
  <button
    type="button"
    disabled={isSubmissionDisabled}
    onclick={handleFinalSubmit}
    class="w-full py-4 bg-ink-500 text-white rounded-xl font-semibold text-lg transition-all duration-200
      {isSubmissionDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-ink-400 active:scale-95'}
      flex items-center justify-center gap-2"
  >
    {#if isSubmitting}
      <Loader2 size={20} class="animate-spin" />
      Submitting...
    {:else}
      <Send size={20} />
      Submit Booking Request
    {/if}
  </button>
</div>

<!-- Submission Progress Overlay -->
{#if isSubmitting && submissionProgress < 100}
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div class="bg-surface-800 border border-zinc-800 rounded-xl p-6 max-w-sm w-full space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <Loader2 size={24} class="text-ink-500 animate-spin" />
        <h3 class="text-lg font-semibold text-white">Processing Your Request</h3>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between text-xs">
          <span class="text-zinc-400">{submissionStatusText}</span>
          <span class="text-ink-500">{submissionProgress}%</span>
        </div>
        <div class="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            class="bg-ink-500 h-full transition-all duration-300"
            style="width: {submissionProgress}%"
          />
        </div>
      </div>

      <p class="text-sm text-zinc-400">Please wait while we process your booking request...</p>
    </div>
  </div>
{/if}
