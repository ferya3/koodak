import { cn } from "@/lib/utils";

const INK = "#1f1a3d";

/** نماد برند: سیاره‌ای خندان با مدار و ستاره – نماد «دنیای» کودک */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M6 38 C 2 30, 14 22, 32 20 C 50 18, 64 22, 60 32" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="32" r="20" fill="#ffce3d" stroke={INK} strokeWidth="3.5" />
      <path d="M17 26 C 20 18, 28 14, 36 14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.8" />
      <circle cx="25" cy="31" r="2.6" fill={INK} />
      <circle cx="39" cy="31" r="2.6" fill={INK} />
      <path d="M26 38 Q 32 44 38 38" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="21" cy="37" r="2.6" fill="#ff73b3" opacity="0.6" />
      <circle cx="43" cy="37" r="2.6" fill="#ff73b3" opacity="0.6" />
      <path d="M60 32 C 56 42, 44 46, 30 46 C 18 46, 8 43, 6 38" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <polygon points="54,8 56,13 61,13 57,16 59,21 54,18 49,21 51,16 47,13 52,13" fill="#ff7a66" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/** لوگوی کامل: نماد + نام. رنگ هر حرف از پالت دنیاهاست. */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const letters: [string, string][] = [
    ["K", "#ff7a66"], ["i", "#ffce3d"], ["d", "#4fcb72"], ["s", "#4fb8f5"],
    ["W", "#9b7bff"], ["o", "#ff73b3"], ["r", "#ff9f4a"], ["l", "#3fc4b6"], ["d", "#ff7a66"],
  ];
  return (
    <span className={cn("inline-flex items-center gap-2", className)} dir="ltr">
      <LogoMark className="h-10 w-10 shrink-0" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.6rem] font-black tracking-tight" style={{ WebkitTextStroke: `1px ${INK}` }}>
            {letters.map(([ch, c], i) => (
              <span key={i} style={{ color: c }}>
                {ch}
              </span>
            ))}
          </span>
          <span className="font-display text-[0.7rem] font-bold text-ink-500" dir="rtl">
            دنیای بازی و یادگیری
          </span>
        </span>
      )}
    </span>
  );
}
