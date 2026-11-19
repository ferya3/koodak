import { cn } from "@/lib/utils";

/**
 * آیکون‌های تصویرسازی‌شده‌ی «دنیاها» و نشان‌ها.
 * سبک: خط دور تیره (۳px)، گوشه‌های گرد، رنگ‌های تخت دوتُنه، یک هایلایت سفید.
 * هر آیکون در یک viewBox ‏۶۴×۶۴ طراحی شده تا در همه‌ی اندازه‌ها هماهنگ باشد.
 */
const INK = "#1f1a3d";
const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export type IconKey =
  | "academy" | "brain" | "studio" | "worksheet" | "fun" | "discover" | "story" | "music" | "life" | "growth"
  | "rocket" | "drum" | "bubble" | "dino" | "palette" | "book" | "fire" | "abacus" | "trophy" | "star" | "lock" | "parent" | "shield" | "printer" | "sparkle" | "clock";

export function WorldIcon({ name, className }: { name: IconKey | string; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} aria-hidden="true">
      {icons[name as IconKey] ?? icons.star}
    </svg>
  );
}

const icons: Record<IconKey, React.ReactNode> = {
  academy: (
    <g {...S}>
      <path d="M8 18 C 18 14, 26 14, 32 20 C 38 14, 46 14, 56 18 L 56 50 C 46 46, 38 46, 32 52 C 26 46, 18 46, 8 50 Z" fill="#fff" />
      <path d="M32 20 L 32 52" />
      <path d="M14 26 L 26 26 M14 32 L 24 32" stroke="#4fb8f5" />
      <text x="36" y="38" fontSize="12" fontWeight="900" fill="#ff7a66" stroke="none" fontFamily="sans-serif" direction="ltr" textAnchor="start">AB</text>
      <path d="M44 8 L 46 14 L 52 14 L 47 18 L 49 24 L 44 20 L 39 24 L 41 18 L 36 14 L 42 14 Z" fill="#ffce3d" />
    </g>
  ),
  brain: (
    <g {...S}>
      <path d="M12 28 C 12 16, 22 10, 32 12 C 42 10, 52 16, 52 28 C 56 32, 56 42, 50 46 C 48 54, 38 56, 32 52 C 26 56, 16 54, 14 46 C 8 42, 8 32, 12 28 Z" fill="#bfa5ff" />
      <path d="M32 12 L 32 52 M20 24 C 24 24, 26 28, 24 32 M44 24 C 40 24, 38 28, 40 32 M18 40 C 22 38, 26 40, 26 44 M46 40 C 42 38, 38 40, 38 44" fill="none" />
      <path d="M18 18 C 20 15, 23 14, 26 14" stroke="#fff" strokeWidth="3" />
    </g>
  ),
  studio: (
    <g {...S}>
      <path d="M32 8 C 48 8, 58 18, 58 30 C 58 38, 52 40, 46 38 C 40 36, 36 40, 38 46 C 40 52, 36 56, 30 56 C 16 56, 6 46, 6 32 C 6 18, 18 8, 32 8 Z" fill="#fff3c4" />
      <circle cx="20" cy="26" r="5" fill="#ff7a66" />
      <circle cx="32" cy="18" r="5" fill="#4fb8f5" />
      <circle cx="44" cy="24" r="5" fill="#4fcb72" />
      <circle cx="18" cy="40" r="5" fill="#9b7bff" />
    </g>
  ),
  worksheet: (
    <g {...S}>
      <path d="M14 8 L 42 8 L 52 18 L 52 56 L 14 56 Z" fill="#fff" />
      <path d="M42 8 L 42 18 L 52 18" fill="#fce8c6" />
      <path d="M20 26 L 40 26 M20 34 L 44 34 M20 42 L 34 42" stroke="#b9b4d3" />
      <path d="M38 52 L 54 30 L 60 34 L 44 56 L 37 58 Z" fill="#ffce3d" />
      <path d="M54 30 L 60 34" stroke={INK} />
    </g>
  ),
  fun: (
    <g {...S}>
      <path d="M10 28 C 10 20, 16 18, 22 18 L 42 18 C 48 18, 54 20, 54 28 L 58 44 C 60 52, 52 56, 46 50 L 40 44 L 24 44 L 18 50 C 12 56, 4 52, 6 44 Z" fill="#ff9f8e" />
      <path d="M20 26 L 20 36 M15 31 L 25 31" />
      <circle cx="42" cy="28" r="2.5" fill={INK} />
      <circle cx="48" cy="34" r="2.5" fill={INK} />
    </g>
  ),
  discover: (
    <g {...S}>
      <circle cx="30" cy="34" r="18" fill="#3fc4b6" />
      <path d="M20 26 C 24 30, 30 26, 34 30 C 38 34, 34 40, 40 44 M18 40 C 22 40, 24 44, 22 48" fill="none" stroke="#fff" strokeWidth="3" />
      <ellipse cx="30" cy="34" rx="28" ry="8" fill="none" transform="rotate(-20 30 34)" />
      <path d="M50 6 L 52 12 L 58 12 L 53 16 L 55 22 L 50 18 L 45 22 L 47 16 L 42 12 L 48 12 Z" fill="#ffce3d" />
    </g>
  ),
  story: (
    <g {...S}>
      <path d="M6 20 C 16 16, 24 16, 32 22 C 40 16, 48 16, 58 20 L 58 52 C 48 48, 40 48, 32 54 C 24 48, 16 48, 6 52 Z" fill="#e0c4ff" />
      <path d="M32 22 L 32 54" />
      <path d="M44 8 C 38 10, 36 18, 40 22 C 44 26, 50 24, 52 20 C 46 22, 42 16, 44 8 Z" fill="#ffce3d" />
      <circle cx="16" cy="30" r="1.8" fill={INK} stroke="none" />
      <circle cx="22" cy="36" r="1.8" fill={INK} stroke="none" />
    </g>
  ),
  music: (
    <g {...S}>
      <path d="M24 46 L 24 14 L 52 8 L 52 40" fill="none" />
      <path d="M24 20 L 52 14" />
      <ellipse cx="18" cy="46" rx="8" ry="6" fill="#ff9f4a" />
      <ellipse cx="46" cy="40" rx="8" ry="6" fill="#ff9f4a" />
      <path d="M8 18 C 10 14, 12 14, 14 18" fill="none" stroke="#ff73b3" />
    </g>
  ),
  life: (
    <g {...S}>
      <path d="M32 54 C 18 44, 6 34, 6 22 C 6 14, 12 8, 20 8 C 26 8, 30 12, 32 16 C 34 12, 38 8, 44 8 C 52 8, 58 14, 58 22 C 58 34, 46 44, 32 54 Z" fill="#4fcb72" />
      <path d="M14 18 C 15 15, 17 14, 20 14" stroke="#fff" />
      <path d="M22 28 Q 32 38 42 28" fill="none" />
      <circle cx="24" cy="22" r="2" fill={INK} stroke="none" />
      <circle cx="40" cy="22" r="2" fill={INK} stroke="none" />
    </g>
  ),
  growth: (
    <g {...S}>
      <path d="M16 44 L 48 44 L 44 58 L 20 58 Z" fill="#ff9f4a" />
      <path d="M32 44 L 32 24" />
      <path d="M32 30 C 22 30, 14 24, 14 14 C 24 14, 32 20, 32 30 Z" fill="#6fdcb2" />
      <path d="M32 24 C 32 14, 40 8, 52 8 C 52 18, 44 24, 32 24 Z" fill="#4fcb72" />
    </g>
  ),
  rocket: (
    <g {...S}>
      <path d="M32 6 C 44 14, 46 30, 42 44 L 22 44 C 18 30, 20 14, 32 6 Z" fill="#fff" />
      <circle cx="32" cy="24" r="6" fill="#4fb8f5" />
      <path d="M22 36 L 12 46 L 22 46 Z M42 36 L 52 46 L 42 46 Z" fill="#ff7a66" />
      <path d="M26 48 C 26 54, 32 60, 32 60 C 32 60, 38 54, 38 48 Z" fill="#ffce3d" />
    </g>
  ),
  drum: (
    <g {...S}>
      <ellipse cx="32" cy="26" rx="22" ry="8" fill="#fff" />
      <path d="M10 26 L 10 46 C 10 52, 54 52, 54 46 L 54 26" fill="#ff9f4a" />
      <path d="M10 26 C 10 32, 54 32, 54 26" fill="none" />
      <path d="M18 34 L 26 46 L 34 34 L 42 46 L 48 36" fill="none" stroke="#fff" />
      <path d="M40 8 L 50 22 M24 8 L 14 22" />
    </g>
  ),
  bubble: (
    <g {...S}>
      <circle cx="26" cy="30" r="18" fill="#ffa3cf" />
      <circle cx="48" cy="44" r="10" fill="#bfa5ff" />
      <circle cx="46" cy="14" r="6" fill="#8fd3ff" />
      <path d="M16 22 C 18 18, 22 16, 26 16" stroke="#fff" />
      <text x="19" y="36" fontSize="14" fontWeight="900" fill={INK} stroke="none" fontFamily="sans-serif">ب</text>
    </g>
  ),
  dino: (
    <g {...S}>
      <path d="M8 48 C 12 36, 20 32, 28 34 L 34 18 C 36 10, 48 10, 50 18 C 52 24, 46 26, 42 26 L 40 40 C 46 42, 50 48, 58 46 C 54 54, 44 56, 36 54 L 34 58 L 28 58 L 28 54 L 20 54 L 20 58 L 14 58 L 14 52 Z" fill="#4fcb72" />
      <circle cx="44" cy="17" r="2" fill={INK} stroke="none" />
      <path d="M24 34 L 26 28 L 30 32" fill="#ffce3d" />
    </g>
  ),
  palette: (
    <g {...S}>
      <path d="M32 8 C 48 8, 58 18, 58 30 C 58 38, 52 40, 46 38 C 40 36, 36 40, 38 46 C 40 52, 36 56, 30 56 C 16 56, 6 46, 6 32 C 6 18, 18 8, 32 8 Z" fill="#ffe3f1" />
      <circle cx="20" cy="26" r="5" fill="#ff7a66" />
      <circle cx="32" cy="18" r="5" fill="#ffce3d" />
      <circle cx="44" cy="24" r="5" fill="#4fb8f5" />
    </g>
  ),
  book: (
    <g {...S}>
      <path d="M12 10 L 46 10 C 50 10, 52 12, 52 16 L 52 56 L 18 56 C 14 56, 12 54, 12 50 Z" fill="#9b7bff" />
      <path d="M12 50 C 12 46, 14 44, 18 44 L 52 44" fill="none" />
      <path d="M24 22 L 42 22 M24 30 L 38 30" stroke="#fff" />
    </g>
  ),
  fire: (
    <g {...S}>
      <path d="M32 58 C 18 58, 12 48, 14 38 C 16 28, 24 24, 24 12 C 32 16, 36 22, 36 30 C 40 28, 42 24, 42 20 C 50 28, 52 36, 50 44 C 48 52, 42 58, 32 58 Z" fill="#ff7a66" />
      <path d="M32 58 C 26 58, 22 54, 24 48 C 26 42, 32 42, 32 36 C 38 40, 42 46, 40 52 C 38 56, 36 58, 32 58 Z" fill="#ffce3d" />
    </g>
  ),
  abacus: (
    <g {...S}>
      <rect x="8" y="10" width="48" height="44" rx="6" fill="#fff" />
      <path d="M8 22 L 56 22 M8 32 L 56 32 M8 42 L 56 42" />
      <circle cx="18" cy="22" r="4" fill="#ff7a66" />
      <circle cx="27" cy="22" r="4" fill="#ff7a66" />
      <circle cx="40" cy="32" r="4" fill="#4fb8f5" />
      <circle cx="22" cy="42" r="4" fill="#4fcb72" />
      <circle cx="46" cy="42" r="4" fill="#4fcb72" />
    </g>
  ),
  trophy: (
    <g {...S}>
      <path d="M18 8 L 46 8 L 46 24 C 46 34, 40 40, 32 40 C 24 40, 18 34, 18 24 Z" fill="#ffce3d" />
      <path d="M18 14 L 8 14 C 8 24, 12 28, 18 28 M46 14 L 56 14 C 56 24, 52 28, 46 28" fill="none" />
      <path d="M28 40 L 28 48 L 36 48 L 36 40" fill="#ffce3d" />
      <rect x="20" y="48" width="24" height="8" rx="2" fill="#9b7bff" />
      <path d="M24 14 C 24 20, 26 24, 28 26" stroke="#fff" />
    </g>
  ),
  star: (
    <g {...S}>
      <path d="M32 6 L 39 23 L 58 24 L 43 36 L 48 55 L 32 45 L 16 55 L 21 36 L 6 24 L 25 23 Z" fill="#ffce3d" />
      <path d="M22 28 L 28 28" stroke="#fff" />
    </g>
  ),
  lock: (
    <g {...S}>
      <path d="M20 28 L 20 20 C 20 12, 26 8, 32 8 C 38 8, 44 12, 44 20 L 44 28" fill="none" />
      <rect x="12" y="28" width="40" height="28" rx="8" fill="#ffce3d" />
      <circle cx="32" cy="40" r="4" fill={INK} stroke="none" />
      <path d="M32 42 L 32 48" />
    </g>
  ),
  parent: (
    <g {...S}>
      <circle cx="22" cy="18" r="8" fill="#ffbe85" />
      <path d="M8 52 C 8 38, 14 30, 22 30 C 30 30, 36 38, 36 52 Z" fill="#4fb8f5" />
      <circle cx="44" cy="30" r="6" fill="#ffbe85" />
      <path d="M34 54 C 34 44, 38 40, 44 40 C 50 40, 56 44, 56 54 Z" fill="#ff73b3" />
    </g>
  ),
  shield: (
    <g {...S}>
      <path d="M32 6 L 54 14 L 54 30 C 54 44, 44 54, 32 58 C 20 54, 10 44, 10 30 L 10 14 Z" fill="#3fc4b6" />
      <path d="M22 32 L 30 40 L 44 24" fill="none" stroke="#fff" strokeWidth="4" />
    </g>
  ),
  printer: (
    <g {...S}>
      <rect x="18" y="8" width="28" height="16" rx="2" fill="#fff" />
      <rect x="8" y="24" width="48" height="22" rx="6" fill="#4fb8f5" />
      <rect x="18" y="38" width="28" height="18" rx="2" fill="#fff" />
      <path d="M24 46 L 40 46 M24 51 L 34 51" stroke="#b9b4d3" />
      <circle cx="48" cy="32" r="2.5" fill="#ffce3d" />
    </g>
  ),
  sparkle: (
    <g {...S}>
      <path d="M32 6 C 34 22, 42 30, 58 32 C 42 34, 34 42, 32 58 C 30 42, 22 34, 6 32 C 22 30, 30 22, 32 6 Z" fill="#ffce3d" />
    </g>
  ),
  clock: (
    <g {...S}>
      <circle cx="32" cy="34" r="22" fill="#fff" />
      <path d="M32 20 L 32 34 L 42 40" fill="none" />
      <path d="M14 12 L 22 8 M50 12 L 42 8" />
      <circle cx="32" cy="34" r="2.5" fill={INK} stroke="none" />
    </g>
  ),
};
