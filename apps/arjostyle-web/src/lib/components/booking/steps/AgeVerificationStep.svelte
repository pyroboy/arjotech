<script lang="ts">
  import type { BookingFormData } from '$types/bookings';

  interface Props {
    formData: BookingFormData;
    updateFormData: (data: Partial<BookingFormData>) => void;
  }

  let { formData, updateFormData }: Props = $props();
</script>

<div class="space-y-4 sm:space-y-6 p-2 sm:p-4">
  <div class="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
    <h2 class="text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.6em] uppercase mb-3 sm:mb-4 text-white">
      Tattoo Booking
    </h2>
    <p class="text-base sm:text-lg md:text-xl text-zinc-400">
      Welcome! This booking process will guide you in getting your custom tattoo. Since tattooing is a permanent procedure, you must be at least 18 years old. By continuing, you confirm that you meet this age requirement and understand the lasting nature of the service.
    </p>
  </div>
</div>
