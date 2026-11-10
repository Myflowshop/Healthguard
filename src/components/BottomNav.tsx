import { Activity, CalendarDays, Home, Pill, Sparkles, type LucideIcon } from 'lucide-react';

export type TabId = 'home' | 'medication' | 'appointments' | 'history' | 'vitals' | 'assistant' | 'settings';

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'หน้าหลัก', icon: Home },
  { id: 'medication', label: 'ยา', icon: Pill },
  { id: 'appointments', label: 'นัดหมอ', icon: CalendarDays },
  { id: 'vitals', label: 'ค่าวัด', icon: Activity },
  { id: 'assistant', label: 'ผู้ช่วย AI', icon: Sparkles },
];

export default function BottomNav({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-stone-200 bg-white/95 px-2 pb-2 pt-2 backdrop-blur">
      <ul className="grid grid-cols-5">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl py-1 text-[11px] font-medium transition ${
                  isActive ? 'text-teal-800' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition ${
                    isActive ? 'bg-teal-100' : ''
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
