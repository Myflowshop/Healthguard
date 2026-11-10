import { useState, type ChangeEvent, type FormEvent } from 'react';
import { DialogFrame, FormField, fieldInput, primaryButton, secondaryButton } from '@/components/ui';
import { toBangkokIsoDateTime } from '@/lib/thaiDate';
import type { AppointmentDraft } from '@/types';

interface AppointmentFormDialogProps {
  onClose: () => void;
  onSubmit: (draft: AppointmentDraft) => void;
}

interface AppointmentFormState {
  doctor: string;
  department: string;
  hospital: string;
  startsAt: string;
}

const emptyForm: AppointmentFormState = {
  doctor: '',
  department: '',
  hospital: '',
  startsAt: '',
};

export default function AppointmentFormDialog({ onClose, onSubmit }: AppointmentFormDialogProps) {
  const [form, setForm] = useState<AppointmentFormState>(emptyForm);

  const canSave =
    form.doctor.trim() !== '' && form.department.trim() !== '' && form.hospital.trim() !== '' && form.startsAt !== '';

  const handleChange =
    (key: keyof AppointmentFormState) => (event: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
    onSubmit({
      doctor: form.doctor.trim(),
      department: form.department.trim(),
      hospital: form.hospital.trim(),
      startsAt: toBangkokIsoDateTime(form.startsAt),
    });
  };

  return (
    <DialogFrame titleId="appointment-form-title" eyebrow="นัดหมายแพทย์" title="เพิ่มนัดหมายใหม่" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="appointment-doctor" label="แพทย์ผู้นัด" required>
          <input
            id="appointment-doctor"
            value={form.doctor}
            onChange={handleChange('doctor')}
            placeholder="เช่น นพ. วิชัย สุขใจ"
            className={fieldInput}
          />
        </FormField>
        <FormField id="appointment-department" label="แผนก" required>
          <input
            id="appointment-department"
            value={form.department}
            onChange={handleChange('department')}
            placeholder="เช่น อายุรกรรม"
            className={fieldInput}
          />
        </FormField>
        <FormField id="appointment-hospital" label="โรงพยาบาลหรือคลินิก" required>
          <input
            id="appointment-hospital"
            value={form.hospital}
            onChange={handleChange('hospital')}
            className={fieldInput}
          />
        </FormField>
        <FormField id="appointment-starts" label="วันและเวลานัด" required>
          <input
            id="appointment-starts"
            type="datetime-local"
            value={form.startsAt}
            onChange={handleChange('startsAt')}
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
            บันทึกนัดหมาย
          </button>
        </div>
      </form>
    </DialogFrame>
  );
}
