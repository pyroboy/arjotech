export type AppointmentStatus =
  | 'Available'
  | 'Pending'
  | 'Confirmed'
  | 'Rejected'
  | 'Completed'
  | 'Needs Info'
  | 'Conflict';

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  status: AppointmentStatus;
  clientName: string;
  service?: string;
  durationMinutes: number;
}

export const statusColors: Record<AppointmentStatus, string> = {
  Available: 'bg-zinc-700 border-zinc-600 text-zinc-100',
  Pending: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  'Needs Info': 'bg-orange-500/20 border-orange-500/40 text-orange-300',
  Confirmed: 'bg-green-500/20 border-green-500/40 text-green-300',
  Completed: 'bg-tech-500/20 border-tech-500/40 text-tech-400',
  Rejected: 'bg-red-500/20 border-red-500/40 text-red-300',
  Conflict: 'bg-red-600/30 border-red-600/50 text-red-200'
};

export const ALL_DAY_TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];
