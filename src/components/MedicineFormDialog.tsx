import { useState, type ChangeEvent, type FormEvent } from 'react';
import { DialogFrame, FormField, fieldInput, primaryButton, secondaryButton } from '@/components/ui';
import type { MedicineDraft } from '@/types';

const unitOptions = ['เม็ด', 'แคปซูล', 'ซอง', 'มล.'];

interface MedicineFormDialogProps {
  onClose: () => void;
  onSubmit: (draft: MedicineDraft) => void;
}

interface MedicineFormState {
  name: string;
  purpose: string;
  remaining: string;
  unit: string;
  expiryMonth: string;
}

const emptyForm: MedicineFormState = {
  name: '',
  purpose: '',
  remaining: '',
  unit: unitOptions[0],
  expiryMonth: '',
};

export default function MedicineFormDialog({ onClose, onSubmit }: MedicineFormDialogProps) {
  const [form, setForm] = useState<MedicineFormState>(emptyForm);

  const remaining = Number(form.remaining);
  const canSave =
    form.name.trim() !== '' &&
    form.purpose.trim() !== '' &&
    form.remaining.trim() !== '' &&
    Number.isInteger(remaining) &&
    remaining >= 0 &&
    form.expiryMonth !== '';

  const handleChange =
    (key: keyof MedicineFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
    const [year, month] = form.expiryMonth.split('-');
    onSubmit({
      name: form.name.trim(),
      purpose: form.purpose.trim(),
      remaining,
      unit: form.unit,
      expiry: `${month}/${year}`,
    });
  };

  return (
    <DialogFrame titleId="medicine-form-title" eyebrow="ตู้ยาของฉัน" title="เพิ่มยาใหม่" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="medicine-name" label="ชื่อยาและขนาด" required>
          <input
            id="medicine-name"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="เช่น เมตฟอร์มิน 500 มก."
            className={fieldInput}
          />
        </FormField>
        <FormField id="medicine-purpose" label="ใช้รักษาอะไร" required>
          <input
            id="medicine-purpose"
            value={form.purpose}
            onChange={handleChange('purpose')}
            placeholder="เช่น ควบคุมระดับน้ำตาลในเลือด"
            className={fieldInput}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField id="medicine-remaining" label="จำนวนคงเหลือ" required>
            <input
              id="medicine-remaining"
              type="number"
              min={0}
              inputMode="numeric"
              value={form.remaining}
              onChange={handleChange('remaining')}
              className={fieldInput}
            />
          </FormField>
          <FormField id="medicine-unit" label="หน่วย">
            <select id="medicine-unit" value={form.unit} onChange={handleChange('unit')} className={fieldInput}>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField id="medicine-expiry" label="เดือนหมดอายุ" required>
          <input
            id="medicine-expiry"
            type="month"
            value={form.expiryMonth}
            onChange={handleChange('expiryMonth')}
            className={fieldInput}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button type="button" onClick={onClose} className={secondaryButton}>
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className={`${primaryButton} disabled:bg-stone-300 disabled:text-stone-600 disabled:shadow-none`}
          >
            เพิ่มเข้าตู้ยา
          </button>
        </div>
      </form>
    </DialogFrame>
  );
}
