import { initialFormData } from '$data/bookingInitialData';
import type { BookingFormData } from '$types/bookings';
import type { BodyPartMappings } from '$types/mapping';
import { defaultBodyPartMappings as defaultMappings } from '$data/defaultMappings';

// Svelte 5 rune-based store using a class pattern
class BookingStore {
  formData = $state<BookingFormData>(structuredClone(initialFormData));
  currentStepIndex = $state(0);
  isTransitioning = $state(false);
  liveBodyPartMappings = $state<BodyPartMappings>(structuredClone(defaultMappings));
  editMode = $state(false);
  referenceGuideSeen = $state(false);

  readonly steps = [
    { id: 'age-verification', title: 'Age Verification' },
    { id: 'tattoo-calculator', title: 'Tattoo Estimate' },
    { id: 'references', title: 'References & Details' },
    { id: 'personal-info', title: 'Personal Info' },
    { id: 'scheduling', title: 'Scheduling' },
    { id: 'review', title: 'Review & Submit' },
  ] as const;

  updateFormData(data: Partial<BookingFormData>) {
    this.formData = { ...this.formData, ...data };
  }

  reset() {
    this.formData = structuredClone(initialFormData);
    this.currentStepIndex = 0;
    this.isTransitioning = false;
    this.editMode = false;
    this.referenceGuideSeen = false;
    this.liveBodyPartMappings = structuredClone(defaultMappings);
  }

  isStepComplete(index: number, data: BookingFormData): boolean {
    const isNonEmpty = (v: string | null | undefined) => !!v?.trim();
    const isValidEmail = (e: string | null | undefined) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e ?? '');

    function isEighteenOrOlder(dob: string | Date | null | undefined): boolean {
      if (!dob) return false;
      const d = typeof dob === 'string' ? new Date(dob) : dob;
      if (isNaN(d.getTime())) return false;
      const today = new Date();
      let age = today.getFullYear() - d.getFullYear();
      const m = today.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
      return age >= 18;
    }

    switch (index) {
      case 0: return true;
      case 1:
        return (
          data.size !== null &&
          data.size > 0 &&
          !!data.currentPlacement &&
          data.placementSliderTouched &&
          data.sizeSliderTouched
        );
      case 2:
        return (
          (data.primaryTattooStyle !== null && !!data.primaryTattooStyle) ||
          data.referenceImages.length > 0
        );
      case 3:
        return (
          isNonEmpty(data.name) &&
          isValidEmail(data.email) &&
          isNonEmpty(data.phone) &&
          isEighteenOrOlder(data.dateOfBirth)
        );
      case 4:
        return (
          data.appointmentDate instanceof Date &&
          isNonEmpty(data.appointmentTime)
        );
      case 5: return true;
      default: return false;
    }
  }

  get maxAllowedStep(): number {
    let i = 0;
    while (i < this.steps.length - 1 && this.isStepComplete(i, this.formData)) i++;
    return i;
  }

  get canProceed(): boolean {
    return this.isStepComplete(this.currentStepIndex, this.formData);
  }

  changeStep(newIndex: number) {
    this.isTransitioning = true;
    setTimeout(() => {
      this.currentStepIndex = newIndex;
      this.isTransitioning = false;
    }, 150);
  }

  next() {
    if (this.canProceed && this.currentStepIndex < this.steps.length - 1) {
      this.changeStep(this.currentStepIndex + 1);
    }
  }

  previous(onClose: () => void) {
    if (this.currentStepIndex === 0) {
      onClose();
    } else {
      this.changeStep(this.currentStepIndex - 1);
    }
  }

  updateMapping(category: string, placement: string, update: Partial<BodyPartMappings>) {
    if (!this.editMode) return;
    const newMappings = structuredClone(this.liveBodyPartMappings);
    if (!newMappings[category]) newMappings[category] = {};
    newMappings[category][placement] = {
      ...newMappings[category][placement],
      ...update,
    };
    this.liveBodyPartMappings = newMappings;
  }
}

export const bookingStore = new BookingStore();
