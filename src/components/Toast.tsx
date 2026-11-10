import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface ToastMessage {
  id: number;
  text: string;
}

export default function Toast({ toast, onDismiss }: { toast: ToastMessage | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 2600);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 transition-all duration-300 ${
        toast ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-stone-900 px-4 py-3 text-sm text-white shadow-xl">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
        <span>{toast?.text}</span>
      </div>
    </div>
  );
}
