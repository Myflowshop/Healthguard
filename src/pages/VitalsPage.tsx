import { Watch } from 'lucide-react';
import { Card, primaryButton, SectionTitle, StatusBadge, statusMeta } from '@/components/ui';
import { labDateLabel, labResults, vitalReadings } from '@/data/mockData';
import type { VitalReading } from '@/types';

interface VitalsPageProps {
  onNotify: (text: string) => void;
}

export default function VitalsPage({ onNotify }: VitalsPageProps) {
  return (
    <div className="space-y-5 px-5 pb-32 pt-8">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">ค่าวัดและผลแล็บ</h1>
        <p className="mt-1 text-sm text-stone-600">ติดตามสุขภาพของคุณผ่านสีไฟจราจร</p>
      </header>

      <button
        type="button"
        onClick={() => onNotify('ซิงค์ข้อมูลจากสายรัดข้อมือแล้ว')}
        className={`${primaryButton} w-full`}
      >
        <Watch className="h-4 w-4" />
        ซิงค์ข้อมูลจากสายรัดข้อมือ
      </button>

      <section>
        <SectionTitle title="ค่าวัดล่าสุด" />
        <div className="grid gap-3 sm:grid-cols-2">
          {vitalReadings.map((reading) => (
            <VitalCard key={reading.id} reading={reading} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="ผลแล็บ" action={<span className="text-xs text-stone-600">ตรวจเมื่อ {labDateLabel}</span>} />
        <Card className="divide-y divide-stone-100 p-0">
          {labResults.map((lab) => (
            <div key={lab.id} className="flex items-center gap-3 px-5 py-4">
              <span className={`h-3 w-3 shrink-0 rounded-full ${statusMeta[lab.status].dot}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-900">{lab.name}</p>
                <p className="text-xs text-stone-600">เกณฑ์: {lab.reference}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-stone-900">
                  {lab.value} <span className="text-xs font-medium text-stone-600">{lab.unit}</span>
                </p>
                <div className="mt-1">
                  <StatusBadge status={lab.status} />
                </div>
              </div>
            </div>
          ))}
        </Card>
      </section>

      <Card>
        <p className="text-sm font-semibold text-stone-900">ความหมายของสีไฟจราจร</p>
        <ul className="mt-3 space-y-2 text-sm text-stone-700">
          <li className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500" /> ปกติ ปลอดภัย
          </li>
          <li className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-amber-500" /> เฝ้าระวัง ใกล้เคียงเกณฑ์เสี่ยง
          </li>
          <li className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-rose-500" /> ผิดปกติ ควรพบแพทย์
          </li>
        </ul>
      </Card>
    </div>
  );
}

function VitalCard({ reading }: { reading: VitalReading }) {
  const Icon = reading.icon;
  const min = Math.min(...reading.trend);
  const max = Math.max(...reading.trend);
  const range = max - min || 1;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
            <Icon className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-stone-800">{reading.label}</p>
        </div>
        <StatusBadge status={reading.status} />
      </div>

      <p className="mt-4 text-2xl font-semibold text-stone-900">
        {reading.value}
        <span className="ml-1 text-xs font-medium text-stone-600">{reading.unit}</span>
      </p>
      <p className="mt-1 text-xs leading-relaxed text-stone-700">{reading.note}</p>

      <div className="mt-4 flex h-14 items-end gap-1.5">
        {reading.trend.map((value, index) => {
          const height = 25 + ((value - min) / range) * 75;
          return (
            <div
              key={index}
              className={`flex-1 rounded-t-md transition-all duration-500 ${statusMeta[reading.status].dot}`}
              style={{ height: `${height}%`, opacity: 0.35 + (index / reading.trend.length) * 0.65 }}
            />
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-stone-500">แนวโน้ม 7 วันล่าสุด</p>
    </Card>
  );
}
