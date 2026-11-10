import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Status } from '@/types';

export const statusMeta: Record<Status, { label: string; badge: string; dot: string }> = {
  normal: {
    label: 'ปกติ',
    badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  watch: {
    label: 'เฝ้าระวัง',
    badge: 'bg-amber-50 text-amber-900 ring-amber-200',
    dot: 'bg-amber-500',
  },
  alert: {
    label: 'ควรพบแพทย์',
    badge: 'bg-rose-50 text-rose-800 ring-rose-200',
    dot: 'bg-rose-500',
  },
};

export const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800 active:scale-[0.98]';

export const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900 transition hover:bg-teal-100 active:scale-[0.98]';

export const fieldInput =
  'w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-100';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70 ${className}`}>
      {children}
    </section>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-semibold text-stone-900">{title}</h2>
      {action}
    </div>
  );
}

export function FormField({
  id,
  label,
  required = false,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-stone-700">
        {label}
        {required ? (
          <span className="text-rose-700"> *</span>
        ) : (
          <span className="font-normal text-stone-500"> (ไม่บังคับ)</span>
        )}
      </label>
      {children}
    </div>
  );
}

export function DialogFrame({
  titleId,
  eyebrow,
  title,
  onClose,
  children,
}: {
  titleId: string;
  eyebrow: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 p-0 sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-teal-800">{eyebrow}</p>
            <h2 id={titleId} className="mt-1 text-lg font-semibold text-stone-900">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="rounded-full p-2 text-stone-600 transition hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const meta = statusMeta[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${meta.badge}`}>
      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? 'bg-teal-700' : 'bg-stone-300'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}
