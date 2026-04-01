import { browser } from '$app/environment';
import { initialFormData } from '$data/bookingInitialData';
import type { BookingFormData } from '$types/bookings';
import type { BodyPartMappings, BodyPartMappingData } from '$types/mapping';
import { defaultBodyPartMappings as defaultMappings } from '$data/defaultMappings';

const STORAGE_KEY_FORM = 'arjo_booking_form';
const STORAGE_KEY_STEP = 'arjo_booking_step';

// Svelte 5 rune-based store using a class pattern
class BookingStore {
  formData = $state<BookingFormData>(this.loadForm());
  currentStepIndex = $state(this.loadStep());
  isTransitioning = $state(false);
  liveBodyPartMappings = $state<BodyPartMappings>(structuredClone(defaultMappings));
  editMode = $state(false);
  referenceGuideSeen = $state(false);

  readonly steps = [
    { id: 'tattoo-design', title: 'Your Tattoo' },
    { id: 'contact-schedule', title: 'Book Session' },
    { id: 'review', title: 'Review' },
  ] as const;

  private loadForm(): BookingFormData {
    if (!browser) return structuredClone(initialFormData);
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FORM);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Restore Date objects that were serialized as strings
        if (parsed.appointmentDate) parsed.appointmentDate = new Date(parsed.appointmentDate);
        if (parsed.dateOfBirth) parsed.dateOfBirth = new Date(parsed.dateOfBirth);
        return { ...structuredClone(initialFormData), ...parsed };
      }
    } catch {
      // Ignore corrupt/unavailable storage
    }
    return structuredClone(initialFormData);
  }

  private loadStep(): number {
    if (!browser) return 0;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STEP);
      if (raw) {
        const step = Number(raw) || 0;
        if (step >= this.steps.length) {
          localStorage.setItem(STORAGE_KEY_STEP, '0');
          return 0;
        }
        return step;
      }
    } catch {
      // Ignore
    }
    return 0;
  }

  private saveForm() {
    if (!browser) return;
    try {
      localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(this.formData));
    } catch {
      // Ignore quota errors
    }
  }

  private saveStep() {
    if (!browser) return;
    try {
      localStorage.setItem(STORAGE_KEY_STEP, String(this.currentStepIndex));
    } catch {
      // Ignore
    }
  }

  updateFormData(data: Partial<BookingFormData>) {
    this.formData = { ...this.formData, ...data };
    this.saveForm();
  }

  reset() {
    this.formData = structuredClone(initialFormData);
    this.currentStepIndex = 0;
    this.isTransitioning = false;
    this.editMode = false;
    this.referenceGuideSeen = false;
    this.liveBodyPartMappings = structuredClone(defaultMappings);
    if (browser) {
      try {
        localStorage.removeItem(STORAGE_KEY_FORM);
        localStorage.removeItem(STORAGE_KEY_STEP);
      } catch {
        // Ignore
      }
    }
  }

  isStepComplete(index: number, data: BookingFormData): boolean {
    const isNonEmpty = (v: string | null | undefined) => !!v?.trim();
    const isValidEmail = (e: string | null | undefined) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e ?? '');

    switch (index) {
      case 0:
        return (
          data.primaryTattooStyle !== null &&
          data.bodyRegion !== null &&
          data.bodyArea !== null &&
          data.sizeCategory !== null
        );
      case 1:
        return (
          isNonEmpty(data.name) &&
          isValidEmail(data.email) &&
          (data.ageConfirmed === true)
        );
      case 2: return true;
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
      this.saveStep();
    }, 300);
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

  updateMapping(category: string, placement: string, update: Partial<BodyPartMappingData>) {
    if (!this.editMode) return;
    const newMappings = structuredClone(this.liveBodyPartMappings);
    if (!newMappings[category]) newMappings[category] = {};
    newMappings[category][placement] = {
      ...newMappings[category][placement],
      ...update,
    };
    this.liveBodyPartMappings = newMappings;
  }

  /** Load mappings from KV API — falls back to defaults on error */
  async loadMappingsFromKV() {
    try {
      const res = await fetch('/api/mappings');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          this.liveBodyPartMappings = data;
        }
      }
    } catch {
      // Silently fall back to defaults
    }
  }
}

export const bookingStore = new BookingStore();
