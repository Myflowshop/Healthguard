import type { LucideIcon } from 'lucide-react';

export type MealSlot = 'morning' | 'noon' | 'evening' | 'bedtime';
export type Status = 'normal' | 'watch' | 'alert';

export interface DoseItem {
  id: string;
  slot: MealSlot;
  beforeMeal: boolean;
  medicine: string;
  dosage: string;
  taken: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  purpose: string;
  remaining: number;
  unit: string;
  expiry: string;
  lowStock: boolean;
}

export interface PrepItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Appointment {
  id: string;
  doctor: string;
  department: string;
  hospital: string;
  startsAt: string;
  prep: PrepItem[];
}

export interface PastVisit {
  id: string;
  visitDate: string;
  doctor: string;
  department: string;
  hospital: string;
  diagnosis: string;
  summary: string;
  medicineChanges: string;
  followUpDate: string | null;
}

export type VisitDraft = Omit<PastVisit, 'id'>;
export type MedicineDraft = Omit<Medicine, 'id' | 'lowStock'>;
export type AppointmentDraft = Omit<Appointment, 'id' | 'prep'>;

export interface VitalReading {
  id: string;
  label: string;
  value: string;
  unit: string;
  status: Status;
  note: string;
  trend: number[];
  icon: LucideIcon;
}

export interface LabResult {
  id: string;
  name: string;
  value: string;
  unit: string;
  reference: string;
  status: Status;
}

export type ChatAction =
  | { kind: 'bp'; sys: number; dia: number; pulse?: number; saved: boolean }
  | { kind: 'appointment'; dateText: string; saved: boolean };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  action?: ChatAction;
}
