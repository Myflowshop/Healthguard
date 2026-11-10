import {
  Bell,
  Building2,
  ScanLine,
  Settings,
  Sparkles,
  Stethoscope,
  Watch,
  type LucideIcon,
} from 'lucide-react';
import Countdown from '@/components/Countdown';
import HomeSummary from '@/components/HomeSummary';
import type { TabId } from '@/components/BottomNav';
import { Card, primaryButton, SectionTitle } from '@/components/ui';
import { mealSlots } from '@/data/mockData';
import type { Appointment, DoseItem, Medicine } from '@/types';

interface HomePageProps {
  doses: DoseItem[];
  medicines: Medicine[];
  appointments: Appointment[];
  onNavigate: (tab: TabId) => void;
  onScan: () => void;
  onNotify: (text: string) => void;
}

export default function HomePage({ doses, medicines, appointments, onNavigate, onScan, onNotify }: HomePageProps) {
  const nextAppointment = appointments[0];
  const takenCount = doses.filter((dose) => dose.taken).length;
  const percent = Math.round((takenCount / doses.length) * 100);
  const nextDose = doses.find((dose) => !dose.taken);
  const nextSlotLabel = nextDose && mealSlots.find((slot) => slot.id === nextDose.slot)?.label;

  return (
    <div className="space-y-5 px-5 pb-32 pt-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-600">วันอังคารที่ 10 พ.ย. 2569</p>
          <h1 className="mt-0.5 text-2xl font-semibold text-stone-900">สวัสดี คุณสมชาย</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="การแจ้งเตือน"
            onClick={() => onNotify('ตอนนี้ไม่มีการแจ้งเตือนใหม่')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-700 ring-1 ring-stone-200 transition hover:bg-stone-100"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="ตั้งค่า"
            onClick={() => onNavigate('settings')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-700 ring-1 ring-stone-200 transition hover:bg-stone-100"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      <HomeSummary doses={doses} medicines={medicines} appointments={appointments} onNavigate={onNavigate} />

      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 to-teal-900 p-5 text-white shadow-lg">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-100">นัดหมายที่ใกล้ที่สุด</p>
        <h2 className="mt-2 text-lg font-semibold">{nextAppointment.doctor}</h2>
        <div className="mt-2 space-y-1 text-sm text-teal-50">
          <p className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            {nextAppointment.department}
          </p>
          <p className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {nextAppointment.hospital}
          </p>
        </div>
        <div className="mt-5">
          <Countdown target={nextAppointment.startsAt} />
        </div>
      </section>

      <Card>
        <SectionTitle title="ยาวันนี้" />
        <div className="flex items-end justify-between">
          <p className="text-3xl font-semibold text-stone-900">
            {takenCount}
            <span className="text-base font-medium text-stone-500"> / {doses.length} ครั้ง</span>
          </p>
          <p className="text-sm font-medium text-teal-800">{percent}%</p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-stone-700">
          {nextDose
            ? `ถัดไป: ${nextDose.medicine} ${nextDose.beforeMeal ? 'ก่อนอาหาร' : 'หลังอาหาร'} (${nextSlotLabel})`
            : 'ทานยาครบทุกมื้อแล้ววันนี้'}
        </p>
        <button type="button" onClick={() => onNavigate('medication')} className={`${primaryButton} mt-4 w-full`}>
          ดูตารางยาและบันทึกการทาน
        </button>
      </Card>

      <section>
        <SectionTitle title="ทางลัด" />
        <div className="grid grid-cols-3 gap-3">
          <QuickAction icon={ScanLine} label="สแกนเอกสาร" onClick={onScan} />
          <QuickAction
            icon={Watch}
            label="ซิงค์สายรัดข้อมือ"
            onClick={() => onNotify('ซิงค์ข้อมูลจากสายรัดข้อมือแล้ว')}
          />
          <QuickAction icon={Sparkles} label="ถามผู้ช่วย AI" onClick={() => onNavigate('assistant')} />
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center ring-1 ring-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-xs font-medium leading-tight text-stone-800">{label}</span>
    </button>
  );
}
