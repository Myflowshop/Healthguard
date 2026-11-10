import { CalendarClock, Package, Pill, TriangleAlert, Watch, type LucideIcon } from 'lucide-react';
import type { TabId } from '@/components/BottomNav';
import { statusMeta } from '@/components/ui';
import { labResults, mealSlots, vitalReadings } from '@/data/mockData';
import { formatThaiDateTime } from '@/lib/thaiDate';
import type { Appointment, DoseItem, Medicine, Status } from '@/types';

interface HomeSummaryProps {
  doses: DoseItem[];
  medicines: Medicine[];
  appointments: Appointment[];
  onNavigate: (tab: TabId) => void;
}

interface AlertItem {
  id: string;
  tone: Status | 'info';
  title: string;
  detail: string;
  tab: TabId;
}

const toneDot: Record<Status | 'info', string> = {
  normal: statusMeta.normal.dot,
  watch: statusMeta.watch.dot,
  alert: statusMeta.alert.dot,
  info: 'bg-teal-600',
};

const DAY_MS = 86_400_000;

export default function HomeSummary({ doses, medicines, appointments, onNavigate }: HomeSummaryProps) {
  const takenCount = doses.filter((dose) => dose.taken).length;
  const pendingDoses = doses.filter((dose) => !dose.taken);
  const nextAppointment = appointments[0];
  const daysUntilNext = Math.max(0, Math.ceil((new Date(nextAppointment.startsAt).getTime() - Date.now()) / DAY_MS));
  const watchItems = [...vitalReadings, ...labResults].filter((item) => item.status !== 'normal');
  const lowStockMedicines = medicines.filter((medicine) => medicine.lowStock);

  const alerts: AlertItem[] = [
    ...labResults
      .filter((lab) => lab.status === 'alert')
      .map((lab) => ({ id: lab.id, tone: 'alert' as const, title: `${lab.name} ควรพบแพทย์`, detail: `ค่า ${lab.value} ${lab.unit}`, tab: 'vitals' as const })),
    ...vitalReadings
      .filter((reading) => reading.status !== 'normal')
      .map((reading) => ({ id: reading.id, tone: reading.status, title: `${reading.label} ${statusMeta[reading.status].label}`, detail: reading.note, tab: 'vitals' as const })),
    ...lowStockMedicines.map((medicine) => ({
      id: medicine.id,
      tone: 'watch' as const,
      title: `${medicine.name} ใกล้หมด`,
      detail: `เหลือ ${medicine.remaining} ${medicine.unit} ควรไปรับยาเพิ่ม`,
      tab: 'medication' as const,
    })),
    ...(pendingDoses.length > 0
      ? [
          {
            id: 'doses',
            tone: 'info' as const,
            title: `ยังไม่ได้ทานยา ${pendingDoses.length} มื้อ`,
            detail: mealSlots.find((slot) => slot.id === pendingDoses[0].slot)?.label ?? '',
            tab: 'medication' as const,
          },
        ]
      : []),
    {
      id: nextAppointment.id,
      tone: 'info' as const,
      title: `นัด ${nextAppointment.doctor}`,
      detail: `${formatThaiDateTime(nextAppointment.startsAt)} เตรียมตัวตามข้อปฏิบัติ`,
      tab: 'appointments' as const,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <SummaryTile
          tone="primary"
          icon={Pill}
          label="ยาวันนี้"
          value={`${takenCount}/${doses.length}`}
          hint="มื้อที่ทานแล้ว"
          onClick={() => onNavigate('medication')}
        />
        <SummaryTile
          tone="neutral"
          icon={CalendarClock}
          label="นัดถัดไป"
          value={`อีก ${daysUntilNext} วัน`}
          hint={nextAppointment.doctor}
          onClick={() => onNavigate('appointments')}
        />
        <SummaryTile
          tone="warning"
          icon={Watch}
          label="ค่าที่ต้องติดตาม"
          value={`${watchItems.length} รายการ`}
          hint="ดูค่าวัดและผลแล็บ"
          onClick={() => onNavigate('vitals')}
        />
        <SummaryTile
          tone="alert"
          icon={Package}
          label="ยาใกล้หมด"
          value={`${lowStockMedicines.length} รายการ`}
          hint="ควรเตรียมรับยาเพิ่ม"
          onClick={() => onNavigate('medication')}
        />
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-stone-700" />
            <h2 className="text-base font-semibold text-stone-900">การแจ้งเตือน</h2>
          </div>
          <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-800">
            {alerts.length} รายการ
          </span>
        </div>
        <ul className="divide-y divide-stone-100">
          {alerts.map((alert) => (
            <li key={alert.id}>
              <button
                type="button"
                onClick={() => onNavigate(alert.tab)}
                className="flex w-full items-start gap-3 py-3 text-left transition hover:bg-stone-50"
              >
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${toneDot[alert.tone]}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-stone-900">{alert.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-600">{alert.detail}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const tileStyles = {
  primary: 'bg-teal-700 text-white ring-teal-700',
  neutral: 'bg-white text-stone-900 ring-stone-200/70',
  warning: 'bg-amber-50 text-amber-950 ring-amber-200',
  alert: 'bg-rose-50 text-rose-950 ring-rose-200',
} as const;

function SummaryTile({
  tone,
  icon: Icon,
  label,
  value,
  hint,
  onClick,
}: {
  tone: keyof typeof tileStyles;
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  onClick: () => void;
}) {
  const isPrimary = tone === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-3 rounded-3xl p-4 text-left shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] ${tileStyles[tone]}`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isPrimary ? 'bg-white/15' : 'bg-white/80'}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className={`text-xs font-medium ${isPrimary ? 'text-teal-50' : 'text-stone-700'}`}>{label}</p>
        <p className="mt-0.5 text-lg font-semibold leading-tight">{value}</p>
        <p className={`mt-1 text-[11px] leading-snug ${isPrimary ? 'text-teal-50' : 'text-stone-600'}`}>{hint}</p>
      </div>
    </button>
  );
}
