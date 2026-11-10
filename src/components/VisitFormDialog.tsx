import { useState, type ChangeEvent, type FormEvent } from 'react';
import { DialogFrame, FormField, fieldInput, primaryButton, secondaryButton } from '@/components/ui';
import { todayIsoDate } from '@/lib/thaiDate';
import type { VisitDraft } from '@/types';

interface VisitFormDialogProps {
  departments: string[];
  onClose: () => void;
  onSubmit: (draft: VisitDraft) => void;
}

interface VisitFormState {
  visitDate: string;
  doctor: string;
  department: string;
  hospital: string;
  diagnosis: string;
  summary: string;
  medicineChanges: string;
  followUpDate: string;
}

const emptyForm = (): VisitFormState => ({
  visitDate: todayIsoDate(),
  doctor: '',
  department: '',
  hospital: '',
  diagnosis: '',
  summary: '',
  medicineChanges: '',
  followUpDate: '',
});

export default function VisitFormDialog({ departments, onClose, onSubmit }: VisitFormDialogProps) {
  const [form, setForm] = useState<VisitFormState>(emptyForm);

  const canSave =
    form.visitDate !== '' &&
    form.doctor.trim() !== '' &&
    form.department.trim() !== '' &&
    form.summary.trim() !== '';

  const handleChange =
    (key: keyof VisitFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
    onSubmit({
      visitDate: form.visitDate,
      doctor: form.doctor.trim(),
      department: form.department.trim(),
      hospital: form.hospital.trim(),
      diagnosis: form.diagnosis.trim(),
      summary: form.summary.trim(),
      medicineChanges: form.medicineChanges.trim(),
      followUpDate: form.followUpDate || null,
    });
  };

  return (
    <DialogFrame
      titleId="visit-form-title"
      eyebrow="บันทึกประวัติ"
      title="สรุปผลการพบแพทย์"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="visit-date" label="วันที่พบแพทย์" required>
          <input id="visit-date" type="date" value={form.visitDate} onChange={handleChange('visitDate')} className={fieldInput} />
        </FormField>
        <FormField id="visit-doctor" label="แพทย์ผู้ตรวจ" required>
          <input id="visit-doctor" value={form.doctor} onChange={handleChange('doctor')} placeholder="เช่น นพ. วิชัย สุขใจ" className={fieldInput} />
        </FormField>
        <FormField id="visit-department" label="แผนก" required>
          <input
            id="visit-department"
            list="visit-department-options"
            value={form.department}
            onChange={handleChange('department')}
            placeholder="เช่น อายุรกรรม"
            className={fieldInput}
          />
          <datalist id="visit-department-options">
            {departments.map((department) => (
              <option key={department} value={department} />
            ))}
          </datalist>
        </FormField>
        <FormField id="visit-hospital" label="โรงพยาบาลหรือคลินิก">
          <input id="visit-hospital" value={form.hospital} onChange={handleChange('hospital')} className={fieldInput} />
        </FormField>
        <FormField id="visit-diagnosis" label="การวินิจฉัยของแพทย์">
          <input id="visit-diagnosis" value={form.diagnosis} onChange={handleChange('diagnosis')} className={fieldInput} />
        </FormField>
        <FormField id="visit-summary" label="สรุปผลการพบแพทย์" required>
          <textarea
            id="visit-summary"
            rows={3}
            value={form.summary}
            onChange={handleChange('summary')}
            placeholder="คำแนะนำและสิ่งที่แพทย์บอกไว้"
            className={`${fieldInput} resize-none`}
          />
        </FormField>
        <FormField id="visit-medicine" label="การเปลี่ยนแปลงยา">
          <textarea
            id="visit-medicine"
            rows={2}
            value={form.medicineChanges}
            onChange={handleChange('medicineChanges')}
            className={`${fieldInput} resize-none`}
          />
        </FormField>
        <FormField id="visit-followup" label="วันนัดติดตามผล">
          <input id="visit-followup" type="date" value={form.followUpDate} onChange={handleChange('followUpDate')} className={fieldInput} />
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
            บันทึกประวัติ
          </button>
        </div>
      </form>
    </DialogFrame>
  );
}
