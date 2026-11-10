import { useState } from 'react';
import { Check, Moon, Pill, Sun, Sunrise, Sunset, Plus } from 'lucide-react';
import MedicineFormDialog from '@/components/MedicineFormDialog';
import { Card, SectionTitle } from '@/components/ui';
import { mealSlots, weeklyAdherence } from '@/data/mockData';
import type { DoseItem, Medicine, MedicineDraft } from '@/types';

interface MedicationPageProps {
  doses: DoseItem[];
  medicines: Medicine[];
  onToggleDose: (id: string) => void;
  onAddMedicine: (draft: MedicineDraft) => void;
}

const slotIcons = {
  morning: Sunrise,
  noon: Sun,
  evening: Sunset,
  bedtime: Moon,
} as const;

export default function MedicationPage({ doses, medicines, onToggleDose, onAddMedicine }: MedicationPageProps) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-5 px-5 pb-32 pt-8">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">ตารางยา</h1>
        <p className="mt-1 text-sm text-stone-600">แตะวงกลมเพื่อบันทึกว่าทานยาแล้ว</p>
      </header>

      <AdherenceCard />

      <section className="space-y-3">
        <SectionTitle title="ตารางทานยาวันนี้" />
        {mealSlots.map((slot) => {
          const slotDoses = doses.filter((dose) => dose.slot === slot.id);
          if (slotDoses.length === 0) return null;
          const SlotIcon = slotIcons[slot.id];
          return (
            <Card key={slot.id} className="p-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
                  <SlotIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{slot.label}</p>
                  <p className="text-xs text-stone-600">{slot.time}</p>
                </div>
              </div>
              <ul className="divide-y divide-stone-100">
                {slotDoses.map((dose) => (
                  <li key={dose.id} className="flex items-center gap-3 py-3">
                    <button
                      type="button"
                      onClick={() => onToggleDose(dose.id)}
                      aria-pressed={dose.taken}
                      aria-label={`บันทึกการทาน ${dose.medicine}`}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition duration-200 active:scale-90 ${
                        dose.taken
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-stone-300 bg-white text-transparent hover:border-teal-500'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${dose.taken ? 'text-stone-500 line-through' : 'text-stone-900'}`}>
                        {dose.medicine}
                      </p>
                      <p className="text-xs text-stone-600">
                        {dose.dosage} · {dose.beforeMeal ? 'ก่อนอาหาร' : 'หลังอาหาร'}
                      </p>
                    </div>
                    {dose.taken && <span className="text-xs font-medium text-teal-800">ทานแล้ว</span>}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </section>

      <section>
        <SectionTitle
          title="ตู้ยาของฉัน"
          action={
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-1 text-sm font-medium text-teal-800 transition hover:text-teal-950"
            >
              <Plus className="h-4 w-4" />
              เพิ่มยา
            </button>
          }
        />
        <div className="space-y-3">
          {medicines.map((medicine) => (
            <Card key={medicine.id} className="flex items-center gap-4 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
                <Pill className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-stone-900">{medicine.name}</p>
                <p className="text-xs text-stone-600">{medicine.purpose}</p>
                <p className="mt-1 text-xs text-stone-600">
                  หมดอายุ {medicine.expiry}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-semibold text-stone-900">
                  {medicine.remaining}
                  <span className="text-xs font-medium text-stone-600"> {medicine.unit}</span>
                </p>
                {medicine.lowStock && (
                  <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-900 ring-1 ring-amber-200">
                    ใกล้หมด
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {formOpen && (
        <MedicineFormDialog
          onClose={() => setFormOpen(false)}
          onSubmit={(draft) => {
            onAddMedicine(draft);
            setFormOpen(false);
          }}
        />
      )}
    </div>
  );
}

function AdherenceCard() {
  const average = Math.round(
    weeklyAdherence.reduce((sum, day) => sum + day.percent, 0) / weeklyAdherence.length,
  );
  const grade = average >= 90 ? 'A' : average >= 80 ? 'B' : 'C';
  const circumference = 2 * Math.PI * 40;

  return (
    <Card>
      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 96 96" className="h-full w-full -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" strokeWidth="8" className="stroke-stone-100" />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className="stroke-teal-600 transition-all duration-700"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - average / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-stone-900">{average}%</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-stone-600">ความตรงเวลาสัปดาห์นี้</p>
          <p className="mt-1 text-lg font-semibold text-stone-900">เกรด {grade}</p>
          <p className="mt-1 text-xs text-stone-600">ทานยาตรงเวลาอย่างสม่ำเสมอ รักษาต่อไปนะ</p>
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between gap-2">
        {weeklyAdherence.map((day) => (
          <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-16 w-full items-end overflow-hidden rounded-xl bg-stone-100">
              <div
                className="w-full rounded-xl bg-teal-500 transition-all duration-500"
                style={{ height: `${day.percent}%` }}
              />
            </div>
            <span className="text-[11px] text-stone-600">{day.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
