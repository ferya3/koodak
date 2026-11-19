import type { AvatarKey } from "@kidsworld/types";
import { cn } from "@/lib/utils";

/**
 * آواتارهای حیوانی کودک.
 * به‌جای عکس واقعی کودک (حریم خصوصی) فقط از این شخصیت‌ها استفاده می‌شود.
 */
const INK = "#1f1a3d";

export const avatarMeta: Record<AvatarKey, { name: string; bg: string }> = {
  fox: { name: "روباه", bg: "#ffe9d6" },
  bunny: { name: "خرگوش", bg: "#ffe3f1" },
  bear: { name: "خرس", bg: "#fff3c4" },
  cat: { name: "گربه", bg: "#ede5ff" },
  panda: { name: "پاندا", bg: "#ddf7e3" },
  frog: { name: "قورباغه", bg: "#ddf3ff" },
};

export function Avatar({ kind, className, ring = true }: { kind: AvatarKey; className?: string; ring?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("shrink-0", className)} role="img" aria-label={avatarMeta[kind].name}>
      <circle cx="50" cy="50" r="48" fill={avatarMeta[kind].bg} stroke={ring ? INK : "none"} strokeWidth="3" />
      <g strokeLinejoin="round" strokeLinecap="round">{faces[kind]}</g>
    </svg>
  );
}

const eyes = (y = 52, gap = 12) => (
  <>
    <circle cx={50 - gap} cy={y} r="4.5" fill={INK} />
    <circle cx={50 + gap} cy={y} r="4.5" fill={INK} />
    <circle cx={51.5 - gap} cy={y - 1.6} r="1.5" fill="#fff" />
    <circle cx={51.5 + gap} cy={y - 1.6} r="1.5" fill="#fff" />
  </>
);
const cheeks = (y = 62, gap = 20, c = "#ff73b3") => (
  <>
    <ellipse cx={50 - gap} cy={y} rx="5" ry="3" fill={c} opacity="0.5" />
    <ellipse cx={50 + gap} cy={y} rx="5" ry="3" fill={c} opacity="0.5" />
  </>
);
const smile = (y = 64) => <path d={`M44 ${y} Q 50 ${y + 6} 56 ${y}`} stroke={INK} strokeWidth="3" fill="none" />;

const faces: Record<AvatarKey, React.ReactNode> = {
  fox: (
    <>
      <path d="M22 22 L 36 40 L 26 46 Z M78 22 L 64 40 L 74 46 Z" fill="#ff9f4a" stroke={INK} strokeWidth="3" />
      <path d="M20 46 C 20 30, 36 28, 50 28 C 64 28, 80 30, 80 46 C 80 66, 66 82, 50 82 C 34 82, 20 66, 20 46 Z" fill="#ff9f4a" stroke={INK} strokeWidth="3" />
      <path d="M30 60 C 36 60, 44 64, 50 80 C 56 64, 64 60, 70 60 C 70 72, 60 82, 50 82 C 40 82, 30 72, 30 60 Z" fill="#fff" />
      {eyes(52, 13)}
      <ellipse cx="50" cy="66" rx="5" ry="3.5" fill={INK} />
    </>
  ),
  bunny: (
    <>
      <path d="M34 40 C 26 20, 28 6, 36 6 C 44 6, 44 22, 42 40 Z M66 40 C 74 20, 72 6, 64 6 C 56 6, 56 22, 58 40 Z" fill="#fff" stroke={INK} strokeWidth="3" />
      <path d="M36 34 C 32 22, 33 12, 36 12 M64 34 C 68 22, 67 12, 64 12" stroke="#ffa3cf" strokeWidth="5" fill="none" />
      <circle cx="50" cy="56" r="28" fill="#fff" stroke={INK} strokeWidth="3" />
      {eyes(52)}
      {cheeks(62, 18)}
      <path d="M46 62 L 54 62 L 50 66 Z" fill="#ff73b3" stroke={INK} strokeWidth="2" />
      <path d="M50 66 L 50 70 M50 70 Q 45 74 42 70 M50 70 Q 55 74 58 70" stroke={INK} strokeWidth="2.5" fill="none" />
    </>
  ),
  bear: (
    <>
      <circle cx="28" cy="32" r="11" fill="#c98a4b" stroke={INK} strokeWidth="3" />
      <circle cx="72" cy="32" r="11" fill="#c98a4b" stroke={INK} strokeWidth="3" />
      <circle cx="28" cy="32" r="5" fill="#f2c79a" />
      <circle cx="72" cy="32" r="5" fill="#f2c79a" />
      <circle cx="50" cy="54" r="29" fill="#c98a4b" stroke={INK} strokeWidth="3" />
      <ellipse cx="50" cy="66" rx="14" ry="11" fill="#f2c79a" />
      {eyes(50, 13)}
      <ellipse cx="50" cy="61" rx="5" ry="3.5" fill={INK} />
      {smile(67)}
    </>
  ),
  cat: (
    <>
      <path d="M24 44 L 26 16 L 44 32 Z M76 44 L 74 16 L 56 32 Z" fill="#9b7bff" stroke={INK} strokeWidth="3" />
      <circle cx="50" cy="56" r="29" fill="#9b7bff" stroke={INK} strokeWidth="3" />
      <path d="M30 26 L 32 34 M70 26 L 68 34" stroke="#ffa3cf" strokeWidth="4" />
      {eyes(52, 12)}
      {cheeks(62, 19)}
      <path d="M47 60 L 53 60 L 50 63 Z" fill="#ff73b3" />
      <path d="M50 63 Q 46 68 42 65 M50 63 Q 54 68 58 65" stroke={INK} strokeWidth="2.5" fill="none" />
      <path d="M22 58 L 34 60 M22 66 L 34 64 M78 58 L 66 60 M78 66 L 66 64" stroke={INK} strokeWidth="2" />
    </>
  ),
  panda: (
    <>
      <circle cx="27" cy="30" r="11" fill={INK} />
      <circle cx="73" cy="30" r="11" fill={INK} />
      <circle cx="50" cy="54" r="30" fill="#fff" stroke={INK} strokeWidth="3" />
      <ellipse cx="37" cy="51" rx="8" ry="10" fill={INK} transform="rotate(-20 37 51)" />
      <ellipse cx="63" cy="51" rx="8" ry="10" fill={INK} transform="rotate(20 63 51)" />
      <circle cx="38" cy="50" r="3" fill="#fff" />
      <circle cx="62" cy="50" r="3" fill="#fff" />
      <ellipse cx="50" cy="63" rx="5" ry="3.5" fill={INK} />
      {smile(68)}
      {cheeks(66, 22)}
    </>
  ),
  frog: (
    <>
      <circle cx="33" cy="34" r="13" fill="#4fcb72" stroke={INK} strokeWidth="3" />
      <circle cx="67" cy="34" r="13" fill="#4fcb72" stroke={INK} strokeWidth="3" />
      <path d="M16 60 C 16 42, 30 38, 50 38 C 70 38, 84 42, 84 60 C 84 76, 68 84, 50 84 C 32 84, 16 76, 16 60 Z" fill="#4fcb72" stroke={INK} strokeWidth="3" />
      <circle cx="33" cy="34" r="7" fill="#fff" />
      <circle cx="67" cy="34" r="7" fill="#fff" />
      <circle cx="34" cy="35" r="4" fill={INK} />
      <circle cx="68" cy="35" r="4" fill={INK} />
      <path d="M32 62 Q 50 76 68 62" stroke={INK} strokeWidth="3" fill="none" />
      {cheeks(64, 24)}
    </>
  ),
};

export const avatarKeys = Object.keys(avatarMeta) as AvatarKey[];
