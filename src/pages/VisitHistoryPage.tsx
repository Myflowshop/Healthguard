import { useMemo, useState } from 'react';
import { ArrowLeft, Building2, CalendarClock, ChevronDown, Pill, Plus, Search, Stethoscope, type LucideIcon } from 'lucide-react';
import VisitFormDialog from '@/components/VisitFormDialog';
import { Card, primaryButton } from '@/components/ui';
import { formatThaiDate } from '@/lib/thaiDate';
import type { PastVisit, VisitDraft } from '@/types';

interface VisitHistoryPageProps {
  visits: PastVisit[];
  onBack: () => void;
  onAddVisit: (draft: VisitDraft) => void;
}

const ALL_DEPARTMENTS = 'ทั้งหมด';

export default function VisitHistoryPage({ visits, onBack, onAddVisit }: VisitHistoryPageProps) {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState(ALL_DEPARTMENTS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const departments = useMemo(() => Array.from(new Set(visits.map((visit) => visit.department))), [visits]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = visits.filter((visit) => {
    if (department !== ALL_DEPARTMENTS && visit.department !== department) return false;
    if (!normalizedQuery) return true;
    return [visit.doctor, visit.hospital, visit.diagnosis, visit.summary, visit.medicineChanges].some((field) =>
      field.toLowerCase().includes(normalizedQuery),
    );
  });

  return (
    <div className="space-y-5 px-5 pb-12 pt-8">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="กลับไปหน้านัดหมอ"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-stone-800 ring-1 ring-stone-200 transition hover:bg-stone-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold text-stone-900">ประวัติการรักษา</h1>
          <p className="text-sm text-stone-600">ค้นหาสรุปผลการพบแพทย์ย้อนหลัง</p>
        </div>
      </header>

      <button type="button" onClick={() => setFormOpen(true)} className={`${primaryButton} w-full`}>
        <Plus className="h-4 w-4" />
        บันทึกการพบแพทย์ใหม่
      </button>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหาแพทย์ โรค หรือยา"
          aria-label="ค้นหาประวัติการรักษา"
          className="w-full rounded-2xl border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {[ALL_DEPARTMENTS, ...departments].map((option) => {
          const isActive = option === department;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setDepartment(option)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 transition ${
                isActive
                  ? 'bg-teal-700 text-white ring-teal-700'
                  : 'bg-white text-stone-800 ring-stone-200 hover:bg-stone-100'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-stone-600">พบ {filtered.length} รายการ</p>

      {filtered.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="text-sm font-medium text-stone-800">ไม่พบประวัติที่ตรงกับคำค้นหา</p>
          <p className="mt-1 text-xs text-stone-600">ลองเปลี่ยนคำค้นหาหรือเลือกแผนกอื่น</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {filtered.map((visit) => (
            <li key={visit.id}>
              <VisitEntry
                visit={visit}
                isOpen={openId === visit.id}
                onToggle={() => setOpenId(openId === visit.id ? null : visit.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {formOpen && (
        <VisitFormDialog
          departments={departments}
          onClose={() => setFormOpen(false)}
          onSubmit={(draft) => {
            onAddVisit(draft);
            setFormOpen(false);
          }}
        />
      )}
    </div>
  );
}

function VisitEntry({ visit, isOpen, onToggle }: { visit: PastVisit; isOpen: boolean; onToggle: () => void }) {
  return (
    <Card className="overflow-hidden p-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-stone-50"
      >
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs font-medium text-teal-800">
            <CalendarClock className="h-3.5 w-3.5" />
            {formatThaiDate(visit.visitDate)}
          </p>
          <p className="mt-1.5 text-sm font-semibold text-stone-900">{visit.department}</p>
          <p className="mt-0.5 text-xs text-stone-600">{visit.doctor}</p>
          {!isOpen && <p className="mt-2 line-clamp-2 text-sm text-stone-700">{visit.summary}</p>}
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-stone-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-stone-100 px-5 pb-5 pt-4">
          <DetailRow icon={Stethoscope} label="การวินิจฉัย" value={visit.diagnosis || 'ไม่ได้ระบุ'} />
          <DetailRow icon={Building2} label="สถานที่" value={visit.hospital || 'ไม่ได้ระบุ'} />
          <DetailRow icon={Pill} label="การเปลี่ยนแปลงยา" value={visit.medicineChanges || 'ไม่มีการเปลี่ยนแปลงยา'} />
          <div>
            <p className="mb-1 text-xs font-medium text-stone-600">สรุปผลการพบแพทย์</p>
            <p className="text-sm leading-relaxed text-stone-800">{visit.summary}</p>
          </div>
          {visit.followUpDate && (
            <div className="rounded-2xl bg-teal-50 px-4 py-3">
              <p className="text-sm font-medium text-teal-900">นัดติดตามผล {formatThaiDate(visit.followUpDate)}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
      <div>
        <p className="text-xs font-medium text-stone-600">{label}</p>
        <p className="text-sm text-stone-800">{value}</p>
      </div>
    </div>
  );
}
