import { useCallback, useState } from 'react';
import BottomNav, { type TabId } from '@/components/BottomNav';
import ScanReviewDialog from '@/components/ScanReviewDialog';
import Toast, { type ToastMessage } from '@/components/Toast';
import {
  defaultPrepItems,
  initialDoses,
  LOW_STOCK_THRESHOLD,
  medicines as seedMedicines,
  pastVisits as seedVisits,
  upcomingAppointments as seedAppointments,
} from '@/data/mockData';
import AppointmentsPage from '@/pages/AppointmentsPage';
import AssistantPage from '@/pages/AssistantPage';
import HomePage from '@/pages/HomePage';
import MedicationPage from '@/pages/MedicationPage';
import SettingsPage from '@/pages/SettingsPage';
import VisitHistoryPage from '@/pages/VisitHistoryPage';
import VitalsPage from '@/pages/VitalsPage';
import type {
  Appointment,
  AppointmentDraft,
  DoseItem,
  Medicine,
  MedicineDraft,
  PastVisit,
  VisitDraft,
} from '@/types';

const FULL_SCREEN_TABS: TabId[] = ['settings', 'history'];

const byStartsAt = (a: Appointment, b: Appointment) => a.startsAt.localeCompare(b.startsAt);

export default function App() {
  const [tab, setTab] = useState<TabId>('home');
  const [doses, setDoses] = useState<DoseItem[]>(initialDoses);
  const [medicines, setMedicines] = useState<Medicine[]>(seedMedicines);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [visits, setVisits] = useState<PastVisit[]>(seedVisits);
  const [scanOpen, setScanOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const notify = useCallback((text: string) => setToast({ id: Date.now(), text }), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const toggleDose = (id: string) =>
    setDoses((prev) => prev.map((dose) => (dose.id === id ? { ...dose, taken: !dose.taken } : dose)));

  const addVisit = (draft: VisitDraft) => {
    setVisits((prev) =>
      [{ id: `v-${Date.now()}`, ...draft }, ...prev].sort((a, b) => b.visitDate.localeCompare(a.visitDate)),
    );
    notify('บันทึกประวัติการพบแพทย์แล้ว');
  };

  const addMedicine = (draft: MedicineDraft) => {
    setMedicines((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, ...draft, lowStock: draft.remaining <= LOW_STOCK_THRESHOLD },
    ]);
    notify('เพิ่มยาเข้าตู้ยาแล้ว');
  };

  const addAppointment = (draft: AppointmentDraft) => {
    setAppointments((prev) =>
      [...prev, { id: `a-${Date.now()}`, ...draft, prep: defaultPrepItems() }].sort(byStartsAt),
    );
    notify('บันทึกนัดหมายแล้ว');
  };

  const togglePrep = (appointmentId: string, prepId: string) =>
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              prep: appointment.prep.map((item) => (item.id === prepId ? { ...item, done: !item.done } : item)),
            }
          : appointment,
      ),
    );

  const renderPage = () => {
    switch (tab) {
      case 'home':
        return (
          <HomePage
            doses={doses}
            medicines={medicines}
            appointments={appointments}
            onNavigate={setTab}
            onScan={() => setScanOpen(true)}
            onNotify={notify}
          />
        );
      case 'medication':
        return (
          <MedicationPage
            doses={doses}
            medicines={medicines}
            onToggleDose={toggleDose}
            onAddMedicine={addMedicine}
          />
        );
      case 'appointments':
        return (
          <AppointmentsPage
            appointments={appointments}
            visits={visits}
            onNavigate={setTab}
            onNotify={notify}
            onAddAppointment={addAppointment}
            onTogglePrep={togglePrep}
          />
        );
      case 'history':
        return <VisitHistoryPage visits={visits} onBack={() => setTab('appointments')} onAddVisit={addVisit} />;
      case 'vitals':
        return <VitalsPage onNotify={notify} />;
      case 'assistant':
        return <AssistantPage onNotify={notify} />;
      case 'settings':
        return <SettingsPage onNavigate={setTab} onNotify={notify} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-200/60">
      <main className="mx-auto min-h-screen max-w-md bg-stone-50 text-stone-900 shadow-xl">{renderPage()}</main>

      {!FULL_SCREEN_TABS.includes(tab) && <BottomNav active={tab} onChange={setTab} />}

      {scanOpen && (
        <ScanReviewDialog onClose={() => setScanOpen(false)} onConfirm={() => notify('บันทึกผลตรวจลงในสมุดสุขภาพแล้ว')} />
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
