import { useEffect, useState } from 'react';

export default function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);
  const units = [
    { value: Math.floor(diff / 86_400_000), label: 'วัน' },
    { value: Math.floor((diff % 86_400_000) / 3_600_000), label: 'ชั่วโมง' },
    { value: Math.floor((diff % 3_600_000) / 60_000), label: 'นาที' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {units.map((unit) => (
        <div key={unit.label} className="rounded-2xl bg-white/15 px-2 py-3 text-center backdrop-blur-sm">
          <p className="text-2xl font-semibold tabular-nums">{String(unit.value).padStart(2, '0')}</p>
          <p className="mt-0.5 text-[11px] text-teal-50">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}
