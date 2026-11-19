import { cn } from "@/lib/utils";

/** عناصر تزئینی پس‌زمینه – همیشه aria-hidden */

export function Cloud({ className, fill = "#fff" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
      <path d="M20 54 C 8 54, 2 46, 6 38 C 8 32, 16 30, 22 32 C 24 18, 40 8, 56 14 C 64 6, 82 6, 90 18 C 104 16, 116 26, 114 40 C 112 50, 104 54, 96 54 Z" fill={fill} />
    </svg>
  );
}

export function Sparkle({ className, fill = "#ffce3d" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0 C 13 7, 17 11, 24 12 C 17 13, 13 17, 12 24 C 11 17, 7 13, 0 12 C 7 11, 11 7, 12 0 Z" fill={fill} />
    </svg>
  );
}

export function Blob({ className, fill }: { className?: string; fill: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        d="M44 -58 C 58 -46, 70 -30, 72 -12 C 74 6, 66 26, 52 42 C 38 58, 18 70, -4 72 C -26 74, -48 64, -62 48 C -76 32, -80 8, -74 -12 C -68 -32, -52 -48, -34 -60 C -16 -72, 6 -78, 24 -74 C 34 -72, 38 -64, 44 -58 Z"
        transform="translate(100 100)"
        fill={fill}
      />
    </svg>
  );
}

/** منظره‌ی تپه‌ها برای پایین Hero و صفحه‌ی کودک */
export function Hills({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className={cn("block w-full", className)} aria-hidden="true">
      <path d="M0 120 C 160 60, 320 60, 480 110 C 640 160, 800 70, 960 80 C 1120 90, 1280 150, 1440 110 L 1440 220 L 0 220 Z" fill="#8be0a0" />
      <path d="M0 160 C 200 110, 380 130, 560 160 C 740 190, 940 120, 1120 140 C 1260 156, 1360 170, 1440 160 L 1440 220 L 0 220 Z" fill="#4fcb72" />
      <g fill="#2ead55">
        <circle cx="240" cy="150" r="4" />
        <circle cx="780" cy="176" r="4" />
        <circle cx="1220" cy="160" r="4" />
      </g>
    </svg>
  );
}

/** موج جداکننده‌ی بخش‌ها */
export function Wave({ className, fill = "#fff", flip = false }: { className?: string; fill?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={cn("block h-10 w-full sm:h-16", flip && "rotate-180", className)} aria-hidden="true">
      <path d="M0 40 C 240 0, 480 80, 720 40 C 960 0, 1200 80, 1440 40 L 1440 80 L 0 80 Z" fill={fill} />
    </svg>
  );
}

export function Squiggle({ className, stroke = "#ff7a66" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 120 16" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d="M2 8 C 12 0, 22 16, 32 8 C 42 0, 52 16, 62 8 C 72 0, 82 16, 92 8 C 102 0, 112 16, 118 8" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
