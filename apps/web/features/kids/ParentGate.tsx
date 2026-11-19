"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fa } from "@/lib/utils";

/**
 * Parent Gate – دروازه‌ی بزرگسالان
 * خروج از محیط کودک (به پنل والدین، خرید، لینک بیرونی) فقط با حل یک سؤال ساده‌ی
 * بزرگسالانه ممکن است. سؤال نوشتاری است تا کودکِ هنوز‌نخوان نتواند حدسی رد شود.
 */
const WORDS = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];

export function ParentGate({ href, onClose }: { href: string; onClose: () => void }) {
  const router = useRouter();
  const q = useMemo(() => {
    const a = 3 + Math.floor(Math.random() * 7);
    const b = 3 + Math.floor(Math.random() * 7);
    return { a, b, answer: a * b };
  }, []);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
    if (Number(normalized) === q.answer) router.push(href);
    else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-6 font-sans shadow-lift">
        <h2 id="gate-title" className="font-display text-xl font-black">
          فقط برای بزرگ‌ترها
        </h2>
        <p className="mt-2 text-sm leading-7 text-ink-500">برای ادامه، حاصل این عبارت را به عدد بنویسید:</p>
        <p className="mt-3 rounded-2xl bg-ink-50 p-4 text-center text-lg font-bold">
          {WORDS[q.a]} ضرب در {WORDS[q.b]}
        </p>
        <input
          autoFocus
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          className="mt-3 h-12 w-full rounded-xl border-2 border-ink-200 px-4 text-center text-lg font-bold focus:border-ink-900 focus:outline-none"
          aria-label="پاسخ"
          aria-invalid={error}
        />
        {error && <p className="mt-2 text-sm font-bold text-coral-500">پاسخ درست نبود. دوباره امتحان کنید.</p>}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={onClose} className="h-11 rounded-xl border-2 border-ink-200 font-bold">
            انصراف
          </button>
          <button type="submit" className="h-11 rounded-xl bg-ink-900 font-bold text-white">
            ادامه
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-ink-300">مثال: {fa(3)} ضرب در {fa(4)} = {fa(12)}</p>
      </form>
    </div>
  );
}
