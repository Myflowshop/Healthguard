import { Droplet, HeartPulse, Moon } from 'lucide-react';
import type {
  Appointment,
  ChatMessage,
  DoseItem,
  LabResult,
  MealSlot,
  Medicine,
  PastVisit,
  PrepItem,
  VitalReading,
} from '@/types';

export const mealSlots: { id: MealSlot; label: string; time: string }[] = [
  { id: 'morning', label: 'มื้อเช้า', time: '07:00 - 09:00' },
  { id: 'noon', label: 'มื้อกลางวัน', time: '11:30 - 13:00' },
  { id: 'evening', label: 'มื้อเย็น', time: '17:30 - 19:00' },
  { id: 'bedtime', label: 'ก่อนนอน', time: '21:30 - 22:30' },
];

export const initialDoses: DoseItem[] = [
  { id: 'd1', slot: 'morning', beforeMeal: true, medicine: 'เมตฟอร์มิน 500 มก.', dosage: '1 เม็ด', taken: true },
  { id: 'd2', slot: 'morning', beforeMeal: false, medicine: 'แอมโลดิปีน 5 มก.', dosage: '1 เม็ด', taken: true },
  { id: 'd3', slot: 'noon', beforeMeal: false, medicine: 'วิตามินดี 1000 IU', dosage: '1 เม็ด', taken: false },
  { id: 'd4', slot: 'evening', beforeMeal: true, medicine: 'เมตฟอร์มิน 500 มก.', dosage: '1 เม็ด', taken: false },
  { id: 'd5', slot: 'bedtime', beforeMeal: false, medicine: 'อะทอร์วาสแตติน 10 มก.', dosage: '1 เม็ด', taken: false },
];

export const weeklyAdherence = [
  { day: 'จ', percent: 100 },
  { day: 'อ', percent: 100 },
  { day: 'พ', percent: 88 },
  { day: 'พฤ', percent: 100 },
  { day: 'ศ', percent: 75 },
  { day: 'ส', percent: 92 },
  { day: 'อา', percent: 95 },
];

export const LOW_STOCK_THRESHOLD = 5;

export const medicines: Medicine[] = [
  { id: 'm1', name: 'เมตฟอร์มิน 500 มก.', purpose: 'ควบคุมระดับน้ำตาลในเลือด', remaining: 18, unit: 'เม็ด', expiry: '03/2028', lowStock: false },
  { id: 'm2', name: 'แอมโลดิปีน 5 มก.', purpose: 'ควบคุมความดันโลหิต', remaining: 4, unit: 'เม็ด', expiry: '08/2027', lowStock: true },
  { id: 'm3', name: 'อะทอร์วาสแตติน 10 มก.', purpose: 'ลดไขมันในเลือด', remaining: 24, unit: 'เม็ด', expiry: '11/2027', lowStock: false },
  { id: 'm4', name: 'วิตามินดี 1000 IU', purpose: 'เสริมวิตามินดี', remaining: 60, unit: 'เม็ด', expiry: '05/2028', lowStock: false },
];

export const upcomingAppointments: Appointment[] = [
  {
    id: 'a1',
    doctor: 'นพ. วิชัย สุขใจ',
    department: 'อายุรกรรม (ตรวจโรคเบาหวาน)',
    hospital: 'โรงพยาบาลเมืองใหม่ อาคาร B ชั้น 4',
    startsAt: '2026-11-16T09:30:00+07:00',
    prep: [
      { id: 'p1', text: 'งดน้ำและอาหาร 8 ชั่วโมงก่อนเจาะเลือด', done: false },
      { id: 'p2', text: 'นำยาเดิมและสมุดยาทั้งหมดมาด้วย', done: false },
      { id: 'p3', text: 'นำผลตรวจเลือดครั้งก่อนมาด้วย', done: true },
      { id: 'p4', text: 'แจ้งอาหารเสริมที่ทานประจำให้แพทย์ทราบ', done: false },
    ],
  },
  {
    id: 'a2',
    doctor: 'ทพ. ปรียา มั่นคง',
    department: 'ทันตกรรมทั่วไป',
    hospital: 'คลินิกทันตกรรมยิ้มสวย ชั้น 2',
    startsAt: '2026-11-28T14:00:00+07:00',
    prep: [
      { id: 'p5', text: 'แปรงฟันและใช้ไหมขัดฟันก่อนมา', done: false },
      { id: 'p6', text: 'นำบัตรประชาชนมาด้วย', done: false },
    ],
  },
];

export function defaultPrepItems(): PrepItem[] {
  return [
    { id: `p-${Date.now()}-1`, text: 'นำยาเดิมและสมุดยาทั้งหมดมาด้วย', done: false },
    { id: `p-${Date.now()}-2`, text: 'นำผลตรวจครั้งก่อนมาด้วย', done: false },
  ];
}

export const pastVisits: PastVisit[] = [
  {
    id: 'v1',
    visitDate: '2026-10-02',
    doctor: 'นพ. วิชัย สุขใจ',
    department: 'อายุรกรรม',
    hospital: 'โรงพยาบาลเมืองใหม่ อาคาร B',
    diagnosis: 'เบาหวานชนิดที่ 2 ควบคุมได้ไม่เต็มที่',
    summary: 'ระดับน้ำตาลเริ่มดีขึ้นแต่ยังสูงกว่าเกณฑ์ แนะนำควบคุมอาหารคาร์โบไฮเดรตและออกกำลังกายสม่ำเสมอ',
    medicineChanges: 'ปรับขนาดเมตฟอร์มิน 500 มก. เป็นวันละ 2 ครั้ง (เช้าและเย็น)',
    followUpDate: '2026-11-16',
  },
  {
    id: 'v2',
    visitDate: '2026-08-14',
    doctor: 'นพ. สุรเชษฐ์ ใจงาม',
    department: 'ตรวจสุขภาพประจำปี',
    hospital: 'ศูนย์ตรวจสุขภาพเมืองใหม่',
    diagnosis: 'ไขมันในเลือดสูงเล็กน้อย',
    summary: 'ผลตรวจเลือดโดยรวมดี ค่า LDL สูงกว่าเกณฑ์เล็กน้อย ควรติดตามผลอีกครั้ง',
    medicineChanges: 'เริ่มทานอะทอร์วาสแตติน 10 มก. ก่อนนอน',
    followUpDate: '2026-10-02',
  },
  {
    id: 'v3',
    visitDate: '2026-05-20',
    doctor: 'นพ. วิชัย สุขใจ',
    department: 'อายุรกรรม',
    hospital: 'โรงพยาบาลเมืองใหม่ อาคาร B',
    diagnosis: 'ความดันโลหิตสูง',
    summary: 'ความดันสูงเกินเกณฑ์ต่อเนื่อง ต้องเริ่มยาควบคุมความดัน และลดปริมาณเกลือในอาหาร',
    medicineChanges: 'เริ่มทานแอมโลดิปีน 5 มก. วันละ 1 ครั้งตอนเช้า',
    followUpDate: '2026-08-14',
  },
  {
    id: 'v4',
    visitDate: '2026-02-11',
    doctor: 'ทพ. ปรียา มั่นคง',
    department: 'ทันตกรรม',
    hospital: 'คลินิกทันตกรรมยิ้มสวย ชั้น 2',
    diagnosis: 'หินปูนสะสมบริเวณฟันล่าง',
    summary: 'ขูดหินปูนและตรวจฟันแล้ว ไม่พบฟันผุ แนะนำใช้ไหมขัดฟันทุกวัน',
    medicineChanges: '',
    followUpDate: null,
  },
];

export const vitalReadings: VitalReading[] = [
  {
    id: 'bp',
    label: 'ความดันโลหิต',
    value: '118/76',
    unit: 'mmHg',
    status: 'normal',
    note: 'อยู่ในเกณฑ์ปกติ ควบคุมได้ดีต่อเนื่อง 7 วัน',
    trend: [122, 120, 124, 119, 121, 118, 118],
    icon: HeartPulse,
  },
  {
    id: 'pulse',
    label: 'ชีพจร',
    value: '72',
    unit: 'ครั้ง/นาที',
    status: 'normal',
    note: 'จังหวะการเต้นสม่ำเสมอ',
    trend: [74, 70, 76, 72, 71, 73, 72],
    icon: HeartPulse,
  },
  {
    id: 'glucose',
    label: 'น้ำตาลในเลือด',
    value: '128',
    unit: 'mg/dL',
    status: 'watch',
    note: 'สูงกว่าเกณฑ์ก่อนอาหาร (70-99) ควรติดตามต่อเนื่อง',
    trend: [110, 118, 124, 119, 131, 126, 128],
    icon: Droplet,
  },
  {
    id: 'sleep',
    label: 'การนอนหลับ',
    value: '5 ชม. 40 นาที',
    unit: 'เฉลี่ย 7 วัน',
    status: 'watch',
    note: 'นอนน้อยกว่า 7 ชั่วโมง ลองเข้านอนให้เป็นเวลา',
    trend: [7.2, 6.5, 5.8, 6.1, 5.5, 6.0, 5.7],
    icon: Moon,
  },
];

export const labResults: LabResult[] = [
  { id: 'l1', name: 'น้ำตาลขณะอดอาหาร', value: '102', unit: 'mg/dL', reference: '70 - 99', status: 'watch' },
  { id: 'l2', name: 'HbA1c', value: '6.4', unit: '%', reference: 'ต่ำกว่า 5.7', status: 'alert' },
  { id: 'l3', name: 'LDL คอเลสเตอรอล', value: '138', unit: 'mg/dL', reference: 'ต่ำกว่า 130', status: 'watch' },
  { id: 'l4', name: 'HDL คอเลสเตอรอล', value: '52', unit: 'mg/dL', reference: 'มากกว่า 40', status: 'normal' },
  { id: 'l5', name: 'ครีเอตินีน', value: '0.9', unit: 'mg/dL', reference: '0.6 - 1.2', status: 'normal' },
];

export const labDateLabel = '05 พ.ย. 2569';

export const assistantSuggestions = [
  'ผลเลือดล่าสุดเป็นยังไงบ้าง',
  'วัดความดันได้ 120/80 ชีพจร 70',
  'หมอนัดวันที่ 16 พ.ย.',
  'ยาเมตฟอร์มินทานพร้อมนมได้ไหม',
];

export const initialChat: ChatMessage[] = [
  {
    id: 'c0',
    role: 'assistant',
    text: 'สวัสดี ผมคือผู้ช่วยสุขภาพของคุณ ถามเรื่องผลตรวจ ยา หรือพิมพ์ค่าที่วัดได้ เพื่อบันทึกลงสมุดสุขภาพได้เลย',
  },
];
