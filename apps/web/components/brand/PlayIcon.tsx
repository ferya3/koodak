import { cn } from "@/lib/utils";
import { extraArt, extraIconNames, type ExtraIconKey } from "./icons/extra";

/**
 * آیکون‌های «اشیای بازی» – در بازی حافظه، شمارش و کاربرگ‌ها مشترکاً استفاده می‌شوند.
 * طراحی ساده، شکل‌های کاملاً متمایز و رنگ‌های متضاد تا برای کودک ۳ ساله هم قابل تشخیص باشند.
 */
const INK = "#1f1a3d";
const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

type BaseIconKey = "apple" | "star" | "heart" | "moon" | "sun" | "flower" | "fish" | "mushroom" | "cloud" | "leaf" | "ball" | "car";
export type PlayIconKey = BaseIconKey | ExtraIconKey;

const baseNames: Record<BaseIconKey, readonly [string, string]> = {
  apple: ["سیب", "apple"], star: ["ستاره", "star"], heart: ["قلب", "heart"], moon: ["ماه", "moon"], sun: ["خورشید", "sun"],
  flower: ["گل", "flower"], fish: ["ماهی", "fish"], mushroom: ["قارچ", "mushroom"], cloud: ["ابر", "cloud"], leaf: ["برگ", "leaf"],
  ball: ["توپ", "ball"], car: ["ماشین", "car"],
};

const allNames = { ...baseNames, ...extraIconNames } as Record<PlayIconKey, readonly [string, string]>;

/** نام فارسی هر شیء */
export const playIconNames = Object.fromEntries(Object.entries(allNames).map(([k, v]) => [k, v[0]])) as Record<PlayIconKey, string>;
/** نام انگلیسی هر شیء */
export const playIconNamesEn = Object.fromEntries(Object.entries(allNames).map(([k, v]) => [k, v[1]])) as Record<PlayIconKey, string>;

export const playIconKeys = Object.keys(allNames) as PlayIconKey[];
export const isPlayIcon = (k: string): k is PlayIconKey => k in allNames;

export function PlayIcon({ name, className }: { name: PlayIconKey; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} role="img" aria-label={playIconNames[name]}>
      <g {...S}>
        {art[name]}
      </g>
    </svg>
  );
}

const baseArt: Record<BaseIconKey, React.ReactNode> = {
  apple: (
    <>
      <path d="M32 20 C 22 12, 8 16, 8 32 C 8 46, 18 58, 26 58 C 29 58, 30 56, 32 56 C 34 56, 35 58, 38 58 C 46 58, 56 46, 56 32 C 56 16, 42 12, 32 20 Z" fill="#ff7a66" />
      <path d="M32 20 C 32 14, 34 10, 38 6" fill="none" />
      <path d="M34 14 C 38 8, 46 8, 48 12 C 44 16, 38 16, 34 14 Z" fill="#4fcb72" />
      <path d="M16 30 C 16 26, 18 24, 22 22" stroke="#fff" />
    </>
  ),
  star: <path d="M32 6 L 39 23 L 58 24 L 43 36 L 48 55 L 32 45 L 16 55 L 21 36 L 6 24 L 25 23 Z" fill="#ffce3d" />,
  heart: (
    <>
      <path d="M32 56 C 18 46, 6 36, 6 22 C 6 14, 12 8, 20 8 C 26 8, 30 12, 32 16 C 34 12, 38 8, 44 8 C 52 8, 58 14, 58 22 C 58 36, 46 46, 32 56 Z" fill="#ff73b3" />
      <path d="M14 20 C 14 16, 16 14, 20 14" stroke="#fff" />
    </>
  ),
  moon: (
    <>
      <path d="M40 6 C 24 8, 14 20, 14 34 C 14 48, 26 58, 40 58 C 48 58, 54 54, 58 48 C 40 50, 28 40, 28 26 C 28 18, 32 10, 40 6 Z" fill="#9b7bff" />
      <circle cx="26" cy="42" r="2.5" fill={INK} stroke="none" />
    </>
  ),
  sun: (
    <>
      <path d="M32 2 L 32 10 M32 54 L 32 62 M2 32 L 10 32 M54 32 L 62 32 M11 11 L 17 17 M47 47 L 53 53 M53 11 L 47 17 M11 53 L 17 47" />
      <circle cx="32" cy="32" r="16" fill="#ff9f4a" />
      <path d="M26 36 Q 32 41 38 36" fill="none" />
    </>
  ),
  flower: (
    <>
      <circle cx="32" cy="16" r="10" fill="#ffa3cf" />
      <circle cx="47" cy="27" r="10" fill="#ffa3cf" />
      <circle cx="41" cy="45" r="10" fill="#ffa3cf" />
      <circle cx="23" cy="45" r="10" fill="#ffa3cf" />
      <circle cx="17" cy="27" r="10" fill="#ffa3cf" />
      <circle cx="32" cy="32" r="9" fill="#ffce3d" />
    </>
  ),
  fish: (
    <>
      <path d="M6 32 C 14 18, 32 14, 44 22 L 58 12 L 56 32 L 58 52 L 44 42 C 32 50, 14 46, 6 32 Z" fill="#4fb8f5" />
      <circle cx="18" cy="30" r="3" fill={INK} stroke="none" />
      <path d="M28 22 C 32 28, 32 36, 28 42" fill="none" />
    </>
  ),
  mushroom: (
    <>
      <path d="M24 34 L 22 56 L 42 56 L 40 34 Z" fill="#fff3c4" />
      <path d="M4 34 C 4 18, 18 6, 32 6 C 46 6, 60 18, 60 34 Z" fill="#ff7a66" />
      <circle cx="20" cy="22" r="4" fill="#fff" />
      <circle cx="38" cy="16" r="5" fill="#fff" />
      <circle cx="46" cy="28" r="3" fill="#fff" />
    </>
  ),
  cloud: (
    <path d="M16 48 C 8 48, 4 42, 6 36 C 8 30, 14 28, 18 30 C 18 20, 28 12, 38 16 C 46 18, 50 24, 50 30 C 56 30, 60 34, 60 40 C 60 46, 56 48, 50 48 Z" fill="#8fd3ff" />
  ),
  leaf: (
    <>
      <path d="M8 56 C 8 28, 24 8, 56 8 C 56 40, 36 56, 8 56 Z" fill="#4fcb72" />
      <path d="M8 56 C 22 42, 34 30, 46 18" fill="none" />
    </>
  ),
  ball: (
    <>
      <circle cx="32" cy="32" r="24" fill="#ffce3d" />
      <path d="M8 32 C 20 26, 44 26, 56 32 M32 8 C 24 20, 24 44, 32 56" fill="none" />
      <path d="M18 18 C 22 14, 26 12, 30 12" stroke="#fff" />
    </>
  ),
  car: (
    <>
      <path d="M6 42 L 6 32 L 14 30 L 22 18 L 42 18 L 50 30 L 58 32 L 58 42 Z" fill="#3fc4b6" />
      <path d="M26 22 L 22 30 L 46 30 L 40 22 Z" fill="#ddf3ff" />
      <circle cx="18" cy="44" r="7" fill="#fff" />
      <circle cx="46" cy="44" r="7" fill="#fff" />
    </>
  ),
};

export const art: Record<PlayIconKey, React.ReactNode> = { ...baseArt, ...extraArt };
