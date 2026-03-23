import { parseISO, isWithinInterval, addMinutes, isEqual } from 'date-fns';

export interface TimeSlot {
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // "HH:MM" format
}

export interface BookedAppointment {
  appointmentDate: string;
  appointmentTime: string;
  estimatedDurationMinutes: number;
}

export function checkConflicts(
  proposedSlot: TimeSlot,
  durationMinutes: number,
  existingAppointments: BookedAppointment[]
): boolean {
  if (!proposedSlot.date || !proposedSlot.time || !durationMinutes) return false;

  const proposedStart = parseISO(`${proposedSlot.date}T${proposedSlot.time}`);
  const proposedEnd = addMinutes(proposedStart, durationMinutes);

  return existingAppointments.some((appt) => {
    if (!appt.appointmentDate || !appt.appointmentTime) return false;

    const existingStart = parseISO(`${appt.appointmentDate}T${appt.appointmentTime}`);
    const existingEnd = addMinutes(existingStart, appt.estimatedDurationMinutes || 60);

    // Check if proposed start is within existing appointment
    const proposedStartConflicts =
      isWithinInterval(proposedStart, { start: existingStart, end: existingEnd }) ||
      isEqual(proposedStart, existingStart);

    // Check if existing start is within proposed appointment
    const existingStartConflicts =
      isWithinInterval(existingStart, { start: proposedStart, end: proposedEnd }) ||
      isEqual(existingStart, proposedStart);

    return proposedStartConflicts || existingStartConflicts;
  });
}

export const ALL_DAY_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00"
];
