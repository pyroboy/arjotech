<script lang="ts">
  import type { BookingFormData } from '$types/bookings';
  import { SIZE_CATEGORIES, getPriceRange, sizeCategoryToSqInches } from '$lib/data/sizeCategoryMap';
  import { User, CalendarDays, CheckCircle, AlertTriangle, Send, Info, Loader2, FileImage, Image as ImageIcon, Pencil } from 'lucide-svelte';

  interface Props {
    formData: BookingFormData;
    updateFormData: (data: Partial<BookingFormData>) => void;
    onSubmitSuccess: () => void;
    onBookAnother: () => void;
    onEditStep?: (stepIndex: number) => void;
  }

  let { formData, updateFormData, onSubmitSuccess, onBookAnother, onEditStep }: Props = $props();

  let isSubmitting = $state(false);
  let submitError = $state<string | null>(null);
  let submissionProgress = $state(0);
  let submissionStatusText = $state('');
  let showConfirmation = $state(false);

  // Snapshot booking details before they get cleared
  let confirmedName = $state('');
  let confirmedEmail = $state('');
  let confirmedStyle = $state('');
  let confirmedPlacement = $state('');
  let confirmedSize = $state('');

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

  function getFreedomDescription(value: number): string {
    if (value <= 20) return 'Exactly as described';
    if (value <= 60) return 'Add artistic touch';
    return 'Surprise me!';
  }

  const priceRange = $derived(getPriceRange(formData.sizeCategory ?? null, formData.isColor, formData.isCoverUp));

  const sizeCategoryLabel = $derived(
    SIZE_CATEGORIES.find(c => c.id === formData.sizeCategory)?.label ?? 'Not specified'
  );

  // State derivations
  const allTermsChecked = $derived(formData.termsAgreed ?? false);

  const isMissingInfo = $derived(
    !formData.name || !formData.email || !formData.ageConfirmed
  );

  // Determine which card has missing info
  const contactCardMissing = $derived(!formData.name || !formData.email || !formData.ageConfirmed);

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
        dob: null,
        ageConfirmed: formData.ageConfirmed ?? false,
        size: sizeCategoryToSqInches(formData.sizeCategory ?? null),
        isColor: formData.isColor,
        complexity: 1,
        selectedCategory: formData.bodyRegion ?? formData.selectedCategory,
        currentPlacement: formData.bodyArea ?? formData.currentPlacement,
        isCoverUp: formData.isCoverUp,
        primaryTattooStyle: formData.primaryTattooStyle,
        styleDescription: formData.tattooDescription,
        pricing: { basePriceRaw: 0, complexityPrice: 0, placementPrice: 0, colorPrice: 0, coverUpPrice: 0, total: 0 },
        creativeFreedom: formData.creativeFreedom,
        specificRequirements: formData.tattooDescription,
        mustHaveElements: null,
        colorPreferences: null,
        appointmentDate: formData.appointmentDate instanceof Date ? formData.appointmentDate.toISOString() : formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        termsAgreed: formData.termsAgreed,
        medicalConfirmed: true,
        referralSource: formData.referralSource,
        painLevel: formData.painLevel,
        painReason: formData.painReason,
        numbingCream: formData.numbingCream ?? false,
        firstTattoo: formData.firstTattoo,
        additionalAreas: formData.additionalAreas,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed. Please try again.');

      submissionProgress = 100;
      submissionStatusText = 'Booking request sent!';

      // Snapshot details for confirmation screen
      confirmedName = formData.name || '';
      confirmedEmail = formData.email || '';
      confirmedStyle = formData.primaryTattooStyle || 'Not specified';
      confirmedPlacement = formData.bodyArea || formData.currentPlacement || 'TBD';
      confirmedSize = SIZE_CATEGORIES.find(c => c.id === formData.sizeCategory)?.label ?? 'Not specified';

      setTimeout(() => {
        isSubmitting = false;
        showConfirmation = true;
      }, 2000);
    } catch (err) {
      submitError = err instanceof Error ? err.message : 'Something went wrong.';
      isSubmitting = false;
      submissionProgress = 0;
    }
  }
</script>

{#if showConfirmation}
<div class="py-12 max-w-lg mx-auto px-4 text-center space-y-8">
  <!-- Green checkmark -->
  <div class="flex justify-center">
    <div class="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
      <CheckCircle size={40} class="text-emerald-400" />
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold text-white mb-2">Booking Request Sent!</h2>
    <p class="text-zinc-400">I'll contact you within 24 hours to confirm your appointment.</p>
  </div>

  <!-- Booking summary -->
  <div class="bg-surface-800 border border-zinc-800 rounded-xl p-5 text-left space-y-3 text-sm">
    <h3 class="text-lg font-semibold text-white mb-3">Booking Summary</h3>
    <div class="flex justify-between">
      <span class="text-zinc-500">Name:</span>
      <span class="text-white font-medium">{confirmedName}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-zinc-500">Email:</span>
      <span class="text-white font-medium">{confirmedEmail}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-zinc-500">Style:</span>
      <span class="text-white font-medium capitalize">{confirmedStyle}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-zinc-500">Placement:</span>
      <span class="text-white font-medium capitalize">{confirmedPlacement}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-zinc-500">Size:</span>
      <span class="text-white font-medium">{confirmedSize}</span>
    </div>
  </div>

  <!-- What happens next -->
  <div class="bg-ink-500/5 border border-ink-500/30 rounded-xl p-5 text-left">
    <h3 class="font-semibold text-white mb-3">What happens next</h3>
    <ol class="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
      <li>I'll review your request and reach out within 24 hours</li>
      <li>We'll finalize the design details and confirm pricing</li>
      <li>A 50% deposit secures your appointment slot</li>
      <li>You'll receive a confirmation with your appointment date</li>
    </ol>
  </div>

  <!-- Action buttons -->
  <div class="flex flex-col sm:flex-row gap-3">
    <button
      type="button"
      onclick={() => { showConfirmation = false; onBookAnother(); }}
      class="flex-1 py-3 border border-zinc-700 text-zinc-300 rounded-xl font-medium hover:bg-zinc-800 transition-colors"
    >
      Book Another
    </button>
    <button
      type="button"
      onclick={() => { onSubmitSuccess(); }}
      class="flex-1 py-3 bg-ink-500 text-white rounded-xl font-semibold hover:bg-ink-400 transition-colors"
    >
      Done
    </button>
  </div>
</div>
{:else}
<div class="py-8 space-y-8 max-w-6xl mx-auto px-4">
  <!-- Header -->
  <div>
    <h2 class="text-2xl font-bold text-white mb-2">Review Your Booking Request</h2>
    <p class="text-zinc-400">
      <span class="text-ink-400 font-medium">Step 3 of 3</span> — Almost there! Review your details below.
    </p>
  </div>

  <!-- Single compact review card -->
  <div class="space-y-6">
    <!-- Contact + Appointment Card -->
    <div class="bg-surface-800 border rounded-xl p-5 space-y-4 {contactCardMissing ? 'border-red-500/50 shadow-lg shadow-red-500/10' : 'border-zinc-800'}">
      <div class="flex items-center gap-3 mb-2">
        <User size={20} class="text-ink-500" />
        <h3 class="text-lg font-semibold text-white flex-1">Your Details & Schedule</h3>
        {#if onEditStep}
          <button type="button" onclick={() => onEditStep?.(1)} class="text-xs text-ink-400 hover:text-ink-300 cursor-pointer flex items-center gap-1 transition-colors">
            <Pencil size={12} />
            Edit
          </button>
        {/if}
      </div>

      <div class="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
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
          <span class={`font-medium text-right ${!formData.phone ? 'text-zinc-500' : 'text-white'}`}>
            {formData.phone || 'Not provided'}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">18+ Confirmed:</span>
          <span class={`font-medium text-right ${!formData.ageConfirmed ? 'text-red-400' : 'text-emerald-400'}`}>
            {formData.ageConfirmed ? 'Yes' : 'Not confirmed'}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Date:</span>
          <span class="font-medium text-white text-right">
            {#if formData.appointmentDate}
              {formatDateForDisplay(formData.appointmentDate)}
            {:else}
              <span class="text-zinc-500">I'll contact you</span>
            {/if}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Time:</span>
          <span class="font-medium text-white text-right">
            {formData.appointmentTime === 'flexible' ? 'Flexible' : formData.appointmentTime || 'We\'ll contact you'}
          </span>
        </div>
      </div>
    </div>

    <!-- Tattoo Request Summary -->
    <div class="bg-surface-800 border border-zinc-800 rounded-xl p-5 space-y-6">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-semibold text-white mb-1">Tattoo Request Summary</h3>
          <p class="text-xs text-zinc-500">Review design details. Final pricing confirmed by the artist at consultation.</p>
        </div>
        {#if onEditStep}
          <button type="button" onclick={() => onEditStep?.(0)} class="text-xs text-ink-400 hover:text-ink-300 cursor-pointer flex items-center gap-1 transition-colors flex-shrink-0 mt-1">
            <Pencil size={12} />
            Edit
          </button>
        {/if}
      </div>

      <!-- Detail Grid -->
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
        <div class="flex justify-between">
          <span class="text-zinc-500">Body Region:</span>
          <span class="font-medium text-white text-right capitalize">{formData.bodyRegion || formData.selectedCategory || 'TBD'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Area:</span>
          <span class="font-medium text-white text-right capitalize">{formData.bodyArea || formData.currentPlacement || 'TBD'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Size:</span>
          <span class="font-medium text-white text-right">{sizeCategoryLabel}</span>
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
          <span class="text-zinc-500">First Tattoo:</span>
          <span class="font-medium text-white text-right">{formData.firstTattoo === true ? 'Yes' : formData.firstTattoo === false ? 'No' : 'Not specified'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-500">Numbing Cream:</span>
          <span class="font-medium text-right {formData.numbingCream ? 'text-emerald-400' : 'text-white'}">
            {formData.numbingCream ? 'Yes (+₱500–1,000)' : 'No'}
          </span>
        </div>
      </div>

      <!-- Tattoo Style -->
      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm text-zinc-500">Tattoo Style:</span>
          <span class="text-sm font-medium text-white capitalize">{formData.primaryTattooStyle || 'Not specified'}</span>
        </div>
      </div>

      <!-- Creative Freedom -->
      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm text-zinc-500">Creative Freedom:</span>
          <span class="text-sm font-medium text-ink-400">{getFreedomDescription(formData.creativeFreedom)}</span>
        </div>
      </div>

      <!-- Tattoo Description -->
      {#if formData.tattooDescription}
        <div class="text-sm">
          <p class="text-zinc-500 mb-1">Your Tattoo Idea:</p>
          <p class="text-white bg-zinc-900/50 rounded p-2">{formData.tattooDescription}</p>
        </div>
      {/if}

      {#if formData.additionalAreas}
        <div class="text-sm">
          <p class="text-zinc-500 mb-1">Additional Areas:</p>
          <p class="text-white bg-zinc-900/50 rounded p-2">{formData.additionalAreas}</p>
        </div>
      {/if}

      <!-- Separator -->
      <div class="border-t border-zinc-700"></div>

      <!-- Estimated Price Range -->
      <div class="space-y-3">
        <div class="bg-zinc-900/30 rounded p-3">
          <p class="text-xs text-zinc-500 mb-1">Estimated Price Range</p>
          {#if priceRange.min > 0}
            <p class="text-ink-400 text-2xl font-bold">
              ₱{priceRange.min.toLocaleString()} — ₱{priceRange.max.toLocaleString()}
            </p>
          {:else}
            <p class="text-zinc-400 text-lg">Select a size to see estimate</p>
          {/if}
        </div>

        <div class="bg-blue-500/10 border border-blue-500/30 rounded p-3 flex gap-3">
          <Info size={16} class="text-blue-400 flex-shrink-0 mt-0.5" />
          <p class="text-xs text-blue-300">
            This is an estimated range. Final pricing will be confirmed by the artist at consultation.
          </p>
        </div>
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

    <!-- Next Steps -->
    <div class="bg-ink-500/5 border border-ink-500/30 rounded-xl p-5 space-y-3">
      <div class="flex items-start gap-3">
        <CheckCircle size={20} class="text-ink-500 flex-shrink-0 mt-0.5 animate-pulse" />
        <div>
          <h3 class="font-semibold text-white mb-1">What Happens Next</h3>
          <ul class="text-sm text-zinc-400 space-y-1">
            <li>I'll review your request and contact you within 24-48 hours</li>
            <li>I'll confirm all details and finalize pricing</li>
            <li>A deposit will be required to secure your appointment</li>
            <li>I'll send you a contract and appointment confirmation</li>
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

    </div>
  </div>

  <!-- Numbing Cream Option -->
  <div class="bg-gradient-to-r from-surface-800 to-surface-800/50 border border-zinc-800 rounded-xl p-5 space-y-3">
    <label class="flex items-start gap-3 cursor-pointer hover:bg-zinc-700/20 p-2 rounded transition">
      <input
        type="checkbox"
        class="mt-1 accent-ink-500"
        checked={formData.numbingCream ?? false}
        onchange={(e) => updateFormData({ numbingCream: (e.target as HTMLInputElement).checked })}
      />
      <div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-white font-medium">Add numbing cream for my session</span>
          {#if formData.firstTattoo}
            <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Recommended for first-timers</span>
          {/if}
        </div>
        <p class="text-xs text-zinc-400 mt-1">
          Topical anesthesia applied before your session for a more comfortable experience.
          Additional ₱500–1,000 depending on area size.
        </p>
        {#if formData.firstTattoo}
          <p class="text-xs text-emerald-400/80 mt-1">
            70% of clients report a more comfortable experience with numbing cream — popular choice for first-timers.
          </p>
        {/if}
      </div>
    </label>
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
      <p class="text-sm text-yellow-300">Name, email, and age confirmation are required to submit.</p>
    </div>
  {/if}

  {#if !allTermsChecked}
    <div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex gap-3">
      <Info size={20} class="text-blue-400 flex-shrink-0 mt-0.5" />
      <div>
        <p class="text-sm text-blue-400 font-medium">Review & Agree</p>
        <p class="text-sm text-blue-300">Please agree to the terms and conditions before submitting.</p>
      </div>
    </div>
  {/if}

  <!-- Submit Button -->
  <button
    type="button"
    disabled={isSubmissionDisabled}
    onclick={handleFinalSubmit}
    class="w-full py-5 bg-ink-500 text-white rounded-xl font-semibold text-lg transition-all duration-200
      {isSubmissionDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-ink-400 active:scale-[0.98] shadow-lg shadow-ink-500/25 hover:shadow-xl hover:shadow-ink-500/30'}
      flex items-center justify-center gap-2"
  >
    {#if isSubmitting}
      <Loader2 size={20} class="animate-spin" />
      Submitting...
    {:else}
      <Send size={20} />
      Book My Tattoo
    {/if}
  </button>
</div>
{/if}

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
          ></div>
        </div>
      </div>

      <p class="text-sm text-zinc-400">Please wait while we process your booking request...</p>
    </div>
  </div>
{/if}
