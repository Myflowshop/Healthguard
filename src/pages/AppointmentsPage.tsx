import { useState } from 'react';
import { Building2, CalendarPlus, ChevronDown, ChevronRight, Clock, Plus, Stethoscope } from 'lucide-react';
import AppointmentFormDialog from '@/components/AppointmentFormDialog';
import type { TabId } from '@/components/BottomNav';
import { Card, primaryButton, SectionTitle, secondaryButton } from '@/components/ui';
import { formatThaiDate, formatThaiDateTime } from '@/lib/thaiDate';
import type { Appointment, AppointmentDraft, PastVisit } from '@/types';

interface AppointmentsPageProps {
  appointments: Appointment[];
  visits: PastVisit[];
  onNavigate: (tab: TabId) => void;
  onNotify: (text: string) => void;
  onAddAppointment: (draft: AppointmentDraft) => void;
  onTogglePrep: (appointmentId: string, prepId: string) => void;
}

const RECENT_VISIT_COUNT = 2;

export default function AppointmentsPage({
  appointments,
  visits,
  onNavigate,
  onNotify,
  onAddAppointment,
  onTogglePrep,
}: AppointmentsPageProps) {
  const [openId, setOpenId] = useState<string | null>(appointments[0]?.id ?? null);
  const [formOpen, setFormOpen] = useState(false);

  const recentVisits = visits.slice(0, RECENT_VISIT_COUNT);

  return (
    <div className="space-y-5 px-5 pb-32 pt-8">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">นัดหมายแพทย์</h1>
        <p className="mt-1 text-sm text-stone-600">เตรียมตัวก่อนพบแพทย์ไม่ให้พลาดข้อปฏิบัติ</p>
      </header>

      <button type="button" onClick={() => setFormOpen(true)} className={`${primaryButton} w-full`}>
        <Plus className="h-4 w-4" />
        เพิ่มนัดหมายใหม่
      </button>

      <section className="space-y-3">
        <SectionTitle title="กำลังจะถึง" />
        {appointments.map((appointment) => {
          const isOpen = openId === appointment.id;
          const doneCount = appointment.prep.filter((item) => item.done).length;
          return (
            <Card key={appointment.id} className="overflow-hidden p-0">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : appointment.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-stone-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-900">{appointment.doctor}</p>
                  <p className="mt-0.5 text-xs text-stone-600">{appointment.department}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-800">
                    <Clock className="h-3.5 w-3.5" />
                    {formatThaiDateTime(appointment.startsAt)}
                  </p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-stone-500 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="space-y-5 border-t border-stone-100 px-5 pb-5 pt-4">
                  <div className="space-y-2 text-sm text-stone-700">
                    <p className="flex items-start gap-2">
                      <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
                      {appointment.department}
                    </p>
                    <p className="flex items-start gap-2">
                      <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
                      {appointment.hospital}
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-stone-900">ข้อปฏิบัติก่อนพบแพทย์</p>
                      <p className="text-xs font-medium text-teal-800">
                        เตรียมแล้ว {doneCount}/{appointment.prep.length}
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {appointment.prep.map((item) => (
                        <li key={item.id}>
                          <label className="flex cursor-pointer items-start gap-3 rounded-xl p-2 transition hover:bg-stone-50">
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => onTogglePrep(appointment.id, item.id)}
                              className="mt-0.5 h-4 w-4 shrink-0 accent-teal-700"
                            />
                            <span className={`text-sm ${item.done ? 'text-stone-500 line-through' : 'text-stone-800'}`}>
                              {item.text}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNotify('เพิ่มนัดหมายและการแจ้งเตือนลงในปฏิทินแล้ว')}
                    className={`${primaryButton} w-full`}
                  >
                    <CalendarPlus className="h-4 w-4" />
                    เพิ่มลงปฏิทินมือถือ
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </section>

      <section>
        <SectionTitle
          title="ประวัติล่าสุด"
          action={
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="flex items-center gap-1 text-sm font-medium text-teal-800 transition hover:text-teal-950"
            >
              ดูทั้งหมด
              <ChevronRight className="h-4 w-4" />
            </button>
          }
        />
        <div className="space-y-3">
          {recentVisits.map((visit) => (
            <Card key={visit.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-stone-900">{visit.department}</p>
                <p className="shrink-0 text-xs text-stone-600">{formatThaiDate(visit.visitDate)}</p>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-700">{visit.summary}</p>
            </Card>
          ))}
        </div>
        <button type="button" onClick={() => onNavigate('history')} className={`${secondaryButton} mt-3 w-full`}>
          เปิดประวัติการรักษาทั้งหมด
        </button>
      </section>

      {formOpen && (
        <AppointmentFormDialog
          onClose={() => setFormOpen(false)}
          onSubmit={(draft) => {
            onAddAppointment(draft);
            setFormOpen(false);
          }}
        />
      )}
    </div>
  );
}
