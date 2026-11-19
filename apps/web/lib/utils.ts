import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** تبدیل ارقام لاتین به فارسی برای نمایش */
export function fa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** قالب‌بندی عدد با جداکننده‌ی هزارگان فارسی */
export function faNumber(n: number): string {
  return fa(n.toLocaleString("en-US")).replace(/,/g, "٬");
}

export function ageRangeLabel(min: number, max: number) {
  return `${fa(min)} تا ${fa(max)} سال`;
}

export function minutesLabel(m: number) {
  if (m < 60) return `${fa(m)} دقیقه`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${fa(h)} ساعت و ${fa(r)} دقیقه` : `${fa(h)} ساعت`;
}

/** مولد عدد شبه‌تصادفی قابل تکرار (برای ماز و کاربرگ‌ها – خروجی ثابت با seed ثابت) */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
