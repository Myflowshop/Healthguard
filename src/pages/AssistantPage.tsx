import { useEffect, useRef, useState } from 'react';
import { Check, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { assistantSuggestions, initialChat } from '@/data/mockData';
import type { ChatAction, ChatMessage } from '@/types';

interface AssistantPageProps {
  onNotify: (text: string) => void;
}

const newId = () => `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const bpPattern = /(\d{2,3})\s*\/\s*(\d{2,3})/;
const pulsePattern = /ชีพจร\s*(\d{2,3})/;
const datePattern = /\d{1,2}\s*(?:พ\.ย\.|ธ\.ค\.|ม\.ค\.|ก\.พ\.|มี\.ค\.)/;

function buildReply(input: string): Omit<ChatMessage, 'id'> {
  const bp = input.match(bpPattern);
  if (bp) {
    const pulse = input.match(pulsePattern);
    const action: ChatAction = {
      kind: 'bp',
      sys: Number(bp[1]),
      dia: Number(bp[2]),
      pulse: pulse ? Number(pulse[1]) : undefined,
      saved: false,
    };
    return {
      role: 'assistant',
      text: 'พบค่าความดันในข้อความของคุณ ต้องการบันทึกลงสมุดสุขภาพไหม',
      action,
    };
  }

  const date = input.match(datePattern);
  if (input.includes('นัด') && date) {
    return {
      role: 'assistant',
      text: 'พบวันนัดหมอในข้อความ ต้องการเพิ่มลงในปฏิทินของแอปไหม',
      action: { kind: 'appointment', dateText: date[0], saved: false },
    };
  }

  if (input.includes('ผลเลือด') || input.includes('ผลแล็บ')) {
    return {
      role: 'assistant',
      text: 'จากผลตรวจวันที่ 5 พ.ย. 2569 น้ำตาลขณะอดอาหารอยู่ที่ 102 mg/dL (เกณฑ์ 70-99) และ HbA1c อยู่ที่ 6.4% ซึ่งควรให้แพทย์ประเมินเพิ่มเติม แนะนำให้นำผลนี้ไปปรึกษาแพทย์ในวันนัด',
    };
  }

  if (input.includes('นม')) {
    return {
      role: 'assistant',
      text: 'การทานยาพร้อมนมขึ้นอยู่กับชนิดของยา โดยทั่วไปควรสอบถามเภสัชกรก่อนทานยาพร้อมนมหรือผลิตภัณฑ์จากนม',
    };
  }

  return {
    role: 'assistant',
    text: 'ได้รับข้อมูลแล้ว ตอนนี้เป็นเวอร์ชันสาธิต ผู้ช่วยจะตอบจากข้อมูลสุขภาพจริงของคุณเมื่อเปิดใช้งานเต็มรูปแบบ',
  };
}

export default function AssistantPage({ onNotify }: AssistantPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [draft, setDraft] = useState('');
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = buildReply(trimmed);
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: 'user', text: trimmed },
      { id: newId(), ...reply },
    ]);
    setDraft('');
  };

  const confirmAction = (messageId: string) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== messageId || !message.action || message.action.saved) return message;
        return { ...message, action: { ...message.action, saved: true } };
      }),
    );
    const target = messages.find((message) => message.id === messageId)?.action;
    onNotify(
      target?.kind === 'bp' ? 'บันทึกค่าความดันลงสมุดสุขภาพแล้ว' : 'เพิ่มวันนัดหมายลงปฏิทินแล้ว',
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-5 pb-3 pt-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-700" />
          <h1 className="text-2xl font-semibold text-stone-900">ผู้ช่วย AI</h1>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          ข้อมูลสุขภาพเก็บในเครื่องของคุณ ไม่ใช่การวินิจฉัยโรค
        </p>
      </header>

      <div className="flex-1 space-y-4 px-5 pb-6">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} onConfirm={() => confirmAction(message.id)} />
        ))}
        <div ref={listEndRef} />
      </div>

      <div className="sticky bottom-[72px] z-30 border-t border-stone-200 bg-stone-50/95 px-4 pb-4 pt-3 backdrop-blur">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {assistantSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => sendMessage(suggestion)}
              className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-teal-900 ring-1 ring-stone-200 transition hover:bg-teal-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(draft);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="พิมพ์คำถามหรือค่าที่วัดได้..."
            aria-label="ข้อความถึงผู้ช่วย"
            className="min-w-0 flex-1 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
          <button
            type="submit"
            aria-label="ส่งข้อความ"
            disabled={!draft.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-white transition hover:bg-teal-800 disabled:bg-stone-300 disabled:text-stone-600"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function ChatBubble({ message, onConfirm }: { message: ChatMessage; onConfirm: () => void }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[85%] space-y-3">
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'rounded-br-md bg-teal-700 text-white'
              : 'rounded-bl-md bg-white text-stone-800 ring-1 ring-stone-200/70'
          }`}
        >
          {message.text}
        </div>
        {message.action && <ActionCard action={message.action} onConfirm={onConfirm} />}
      </div>
    </div>
  );
}

function ActionCard({ action, onConfirm }: { action: ChatAction; onConfirm: () => void }) {
  const details =
    action.kind === 'bp'
      ? `ความดัน ${action.sys}/${action.dia} mmHg${action.pulse ? ` · ชีพจร ${action.pulse}` : ''}`
      : `วันนัด ${action.dateText}`;
  const title = action.kind === 'bp' ? 'บันทึกค่าวัด' : 'เพิ่มวันนัดหมอ';

  return (
    <div className="rounded-2xl bg-teal-50 p-4 ring-1 ring-teal-200">
      <p className="text-xs font-medium text-teal-900">{title}</p>
      <p className="mt-1 text-sm font-semibold text-stone-900">{details}</p>
      {action.saved ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-teal-900">
          <Check className="h-4 w-4" />
          บันทึกแล้ว
        </p>
      ) : (
        <button
          type="button"
          onClick={onConfirm}
          className="mt-3 w-full rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 active:scale-[0.98]"
        >
          ยืนยันบันทึก
        </button>
      )}
    </div>
  );
}
