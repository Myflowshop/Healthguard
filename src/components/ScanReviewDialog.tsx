import { useState } from 'react';
import { ScanLine } from 'lucide-react';
import { DialogFrame, fieldInput, primaryButton, secondaryButton } from '@/components/ui';

interface ExtractedField {
  id: string;
  label: string;
  unit: string;
  value: string;
}

const initialFields: ExtractedField[] = [
  { id: 'date', label: 'วันที่ตรวจ', unit: '', value: '05/11/2569' },
  { id: 'glucose', label: 'น้ำตาลขณะอดอาหาร', unit: 'mg/dL', value: '102' },
  { id: 'ldl', label: 'LDL คอเลสเตอรอล', unit: 'mg/dL', value: '138' },
  { id: 'hba1c', label: 'HbA1c', unit: '%', value: '6.4' },
];

export default function ScanReviewDialog({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [fields, setFields] = useState<ExtractedField[]>(initialFields);

  const updateField = (id: string, value: string) =>
    setFields((prev) => prev.map((field) => (field.id === id ? { ...field, value } : field)));

  return (
    <DialogFrame
      titleId="scan-review-title"
      eyebrow="ตรวจทานก่อนบันทึก"
      title="ผลตรวจเลือดจากเอกสาร"
      onClose={onClose}
    >
      <div className="mb-5 flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-teal-300 bg-teal-50/60 text-teal-900">
        <ScanLine className="h-7 w-7" />
        <p className="text-sm font-medium">ภาพเอกสารที่สแกน</p>
      </div>

      <p className="mb-3 text-sm text-stone-700">AI อ่านค่าต่อไปนี้ได้ กรุณาตรวจสอบและแก้ไขให้ตรงกับเอกสาร</p>

      <ul className="space-y-3">
        {fields.map((field) => (
          <li key={field.id}>
            <label htmlFor={`field-${field.id}`} className="mb-1 block text-xs font-medium text-stone-700">
              {field.label}
              {field.unit && <span className="text-stone-500"> ({field.unit})</span>}
            </label>
            <input
              id={`field-${field.id}`}
              value={field.value}
              onChange={(event) => updateField(field.id, event.target.value)}
              className={fieldInput}
            />
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" onClick={onClose} className={secondaryButton}>
          ยกเลิก
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={primaryButton}
        >
          ยืนยันบันทึก
        </button>
      </div>
    </DialogFrame>
  );
}
