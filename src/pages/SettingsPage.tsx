import { useState } from 'react';
import { CloudUpload, Fingerprint, Lock } from 'lucide-react';
import { Card, primaryButton, SectionTitle, Switch } from '@/components/ui';
import type { TabId } from '@/components/BottomNav';

interface SettingsPageProps {
  onNavigate: (tab: TabId) => void;
  onNotify: (text: string) => void;
}

const reminderSeed = [
  { id: 'r1', label: 'มื้อเช้า', time: '07:00', enabled: true },
  { id: 'r2', label: 'มื้อกลางวัน', time: '11:30', enabled: true },
  { id: 'r3', label: 'มื้อเย็น', time: '17:30', enabled: false },
  { id: 'r4', label: 'ก่อนนอน', time: '21:30', enabled: true },
];

const themeOptions = ['สว่าง', 'มืด', 'ตามระบบ'] as const;

export default function SettingsPage({ onNavigate, onNotify }: SettingsPageProps) {
  const [reminders, setReminders] = useState(reminderSeed);
  const [autoBackup, setAutoBackup] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [theme, setTheme] = useState<(typeof themeOptions)[number]>('สว่าง');

  const toggleReminder = (id: string, enabled: boolean) =>
    setReminders((prev) => prev.map((item) => (item.id === id ? { ...item, enabled } : item)));

  return (
    <div className="space-y-5 px-5 pb-12 pt-8">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-800 ring-1 ring-stone-200 transition hover:bg-stone-100"
        >
          กลับ
        </button>
        <h1 className="text-2xl font-semibold text-stone-900">ตั้งค่า</h1>
      </header>

      <Card className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 text-lg font-semibold text-white">
          ส
        </span>
        <div>
          <p className="text-base font-semibold text-stone-900">คุณสมชาย ใจดี</p>
          <p className="text-sm text-stone-600">อายุ 58 ปี · หมู่เลือด O</p>
          <p className="mt-1 text-xs text-stone-600">โรคประจำตัว: เบาหวานชนิดที่ 2, ความดันโลหิตสูง</p>
        </div>
      </Card>

      <section>
        <SectionTitle title="การแจ้งเตือนการทานยา" />
        <Card className="divide-y divide-stone-100 p-0">
          {reminders.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-stone-900">{item.label}</p>
                <p className="text-xs text-stone-600">เตือนเวลา {item.time} น.</p>
              </div>
              <Switch
                checked={item.enabled}
                onChange={(value) => toggleReminder(item.id, value)}
                label={`แจ้งเตือน${item.label}`}
              />
            </div>
          ))}
        </Card>
      </section>

      <section>
        <SectionTitle title="สำรองข้อมูล" />
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-stone-900">สำรองอัตโนมัติทุกคืน</p>
              <p className="text-xs text-stone-600">บันทึกไปยัง Google Drive ส่วนตัวของคุณ</p>
            </div>
            <Switch checked={autoBackup} onChange={setAutoBackup} label="สำรองข้อมูลอัตโนมัติ" />
          </div>
          <p className="text-xs text-stone-600">สำรองล่าสุด 09 พ.ย. 2569 เวลา 21:00 น.</p>
          <button
            type="button"
            onClick={() => onNotify('สำรองข้อมูลไปยัง Google Drive เรียบร้อยแล้ว')}
            className={`${primaryButton} w-full`}
          >
            <CloudUpload className="h-4 w-4" />
            สำรองข้อมูลตอนนี้
          </button>
        </Card>
      </section>

      <section>
        <SectionTitle title="ความเป็นส่วนตัว" />
        <Card className="divide-y divide-stone-100 p-0">
          <div className="flex items-center gap-3 px-5 py-4">
            <Lock className="h-5 w-5 shrink-0 text-teal-800" />
            <p className="text-sm text-stone-800">ข้อมูลทั้งหมดเก็บอยู่ในเครื่องนี้ ใช้งานได้แม้ไม่มีอินเทอร์เน็ต</p>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-5 w-5 shrink-0 text-teal-800" />
              <p className="text-sm font-medium text-stone-900">ล็อกแอปด้วยลายนิ้วมือ</p>
            </div>
            <Switch checked={biometric} onChange={setBiometric} label="ล็อกแอปด้วยลายนิ้วมือ" />
          </div>
        </Card>
      </section>

      <section>
        <SectionTitle title="ธีมการแสดงผล" />
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-stone-200/70 p-1">
          {themeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              aria-pressed={theme === option}
              className={`rounded-xl py-2 text-sm font-medium transition ${
                theme === option ? 'bg-white text-teal-900 shadow-sm' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
