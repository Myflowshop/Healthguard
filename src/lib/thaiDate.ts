const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

export function formatThaiDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${day} ${thaiMonths[month - 1]} ${year + 543}`;
}

export function formatThaiDateTime(isoDateTime: string): string {
  const [datePart, timePart] = isoDateTime.split('T');
  return `${formatThaiDate(datePart)} เวลา ${timePart.slice(0, 5)} น.`;
}

export function toBangkokIsoDateTime(localValue: string): string {
  return `${localValue}:00+07:00`;
}

export function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
