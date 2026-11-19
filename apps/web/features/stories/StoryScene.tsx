/**
 * صحنه‌های تصویرسازی‌شده‌ی قصه‌ها.
 * در نسخه‌ی تولیدی، هر صحنه یک media_asset (WebP/AVIF) است که از CMS بارگذاری می‌شود؛
 * این SVGها هم نمونه‌ی سبک بصری‌اند و هم Fallback سبک و سریع.
 */
const INK = "#1f1a3d";

export function StoryScene({ scene, className }: { scene: string; className?: string }) {
  return (
    <svg viewBox="0 0 400 260" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {scenes[scene] ?? scenes["night-sky"]}
    </svg>
  );
}

function Stars({ pts }: { pts: [number, number, number][] }) {
  return (
    <g fill="#ffe07a">
      {pts.map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y - r} C ${x + r * 0.2} ${y - r * 0.2}, ${x + r * 0.2} ${y - r * 0.2}, ${x + r} ${y} C ${x + r * 0.2} ${y + r * 0.2}, ${x + r * 0.2} ${y + r * 0.2}, ${x} ${y + r} C ${x - r * 0.2} ${y + r * 0.2}, ${x - r * 0.2} ${y + r * 0.2}, ${x - r} ${y} C ${x - r * 0.2} ${y - r * 0.2}, ${x - r * 0.2} ${y - r * 0.2}, ${x} ${y - r} Z`} />
      ))}
    </g>
  );
}

function LittleCloud({ x, y, s = 1, mood = "happy" }: { x: number; y: number; s?: number; mood?: "happy" | "wow" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-40 20 C -56 20, -60 4, -48 -2 C -48 -18, -30 -26, -18 -18 C -10 -34, 16 -34, 24 -18 C 40 -22, 54 -8, 46 6 C 56 12, 50 24, 38 20 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="-12" cy="0" r="4" fill={INK} />
      <circle cx="14" cy="0" r="4" fill={INK} />
      {mood === "happy" ? <path d="M-6 8 Q 1 14 8 8" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" /> : <ellipse cx="1" cy="10" rx="3.5" ry="4.5" fill={INK} />}
      <ellipse cx="-22" cy="8" rx="5" ry="3" fill="#ff73b3" opacity="0.6" />
      <ellipse cx="26" cy="8" rx="5" ry="3" fill="#ff73b3" opacity="0.6" />
    </g>
  );
}

const nightBg = (
  <>
    <defs>
      <linearGradient id="kw-night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2c2566" />
        <stop offset="1" stopColor="#5b47b8" />
      </linearGradient>
    </defs>
    <rect width="400" height="260" fill="url(#kw-night)" />
    <Stars pts={[[40, 40, 6], [110, 70, 4], [180, 30, 5], [260, 60, 4], [330, 30, 6], [370, 90, 4], [70, 120, 3]]} />
  </>
);

const scenes: Record<string, React.ReactNode> = {
  "night-sky": (
    <>
      {nightBg}
      <path d="M0 210 L 60 170 L 100 190 L 160 140 L 230 200 L 290 160 L 400 210 L 400 260 L 0 260 Z" fill="#1f1a3d" />
      <g fill="#ffe07a">
        <rect x="70" y="200" width="10" height="12" rx="2" />
        <rect x="300" y="208" width="10" height="12" rx="2" />
      </g>
      <LittleCloud x={200} y={100} s={1.2} mood="wow" />
    </>
  ),
  mountains: (
    <>
      {nightBg}
      <path d="M0 260 L 90 120 L 160 200 L 250 90 L 400 260 Z" fill="#8a7de0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M250 90 L 228 122 L 246 116 L 260 128 L 272 112 Z" fill="#fff" />
      <LittleCloud x={140} y={70} s={0.95} />
    </>
  ),
  "owl-tree": (
    <>
      {nightBg}
      <path d="M260 260 L 270 120 L 300 120 L 310 260 Z" fill="#8a5a3c" stroke={INK} strokeWidth="4" />
      <path d="M200 130 C 200 70, 380 70, 380 130 C 400 160, 360 170, 340 150 C 300 170, 240 170, 220 150 C 190 160, 180 140, 200 130 Z" fill="#2ead55" stroke={INK} strokeWidth="4" />
      <path d="M180 170 L 380 170" stroke="#8a5a3c" strokeWidth="10" strokeLinecap="round" />
      <g transform="translate(320 140)">
        <ellipse cx="0" cy="0" rx="26" ry="30" fill="#c98a4b" stroke={INK} strokeWidth="4" />
        <ellipse cx="0" cy="10" rx="16" ry="16" fill="#f2c79a" />
        <circle cx="-10" cy="-8" r="9" fill="#fff" stroke={INK} strokeWidth="3" />
        <circle cx="10" cy="-8" r="9" fill="#fff" stroke={INK} strokeWidth="3" />
        <circle cx="-10" cy="-8" r="4" fill={INK} />
        <circle cx="10" cy="-8" r="4" fill={INK} />
        <path d="M-4 2 L 4 2 L 0 8 Z" fill="#ff9f4a" stroke={INK} strokeWidth="2" />
        <path d="M-22 -24 L -14 -32 L -10 -22 M22 -24 L 14 -32 L 10 -22" stroke={INK} strokeWidth="3" fill="#c98a4b" />
      </g>
      <LittleCloud x={100} y={110} s={0.9} />
    </>
  ),
  "moon-rise": (
    <>
      {nightBg}
      <circle cx="260" cy="150" r="60" fill="#fff7d6" stroke={INK} strokeWidth="4" />
      <circle cx="240" cy="140" r="5" fill={INK} />
      <circle cx="276" cy="140" r="5" fill={INK} />
      <path d="M244 160 Q 258 172 272 160" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="232" cy="120" r="8" fill="#f1e3a8" />
      <path d="M0 260 L 0 210 L 120 170 L 200 220 L 300 190 L 400 230 L 400 260 Z" fill="#1f1a3d" />
      <LittleCloud x={110} y={90} s={0.95} />
      <g stroke="#8fd3ff" strokeWidth="4" strokeLinecap="round">
        <path d="M90 130 L 86 142" />
        <path d="M110 136 L 106 148" />
        <path d="M130 130 L 126 142" />
      </g>
    </>
  ),
  underground: (
    <>
      <rect width="400" height="90" fill="#ddf3ff" />
      <rect y="90" width="400" height="170" fill="#8a5a3c" />
      <path d="M0 90 C 80 80, 160 100, 240 88 C 300 80, 360 96, 400 88" stroke="#4fcb72" strokeWidth="12" fill="none" />
      <g fill="#6e4630">
        <circle cx="60" cy="150" r="8" />
        <circle cx="330" cy="200" r="10" />
        <circle cx="120" cy="230" r="6" />
      </g>
      <g transform="translate(200 180)">
        <ellipse cx="0" cy="0" rx="30" ry="22" fill="#f2c79a" stroke={INK} strokeWidth="4" />
        <path d="M-12 -2 Q -8 2 -4 -2 M4 -2 Q 8 2 12 -2" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-4 8 Q 0 10 4 8" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  rain: (
    <>
      <rect width="400" height="110" fill="#b5ddf5" />
      <rect y="110" width="400" height="150" fill="#8a5a3c" />
      <path d="M0 110 C 80 100, 160 120, 240 108 C 300 100, 360 116, 400 108" stroke="#4fcb72" strokeWidth="12" fill="none" />
      <g transform="translate(260 40) scale(0.9)">
        <path d="M-60 20 C -76 20, -80 4, -68 -2 C -68 -18, -50 -26, -38 -18 C -30 -34, 6 -34, 14 -18 C 30 -22, 44 -8, 36 6 C 46 12, 40 24, 28 20 Z" fill="#fff" stroke={INK} strokeWidth="4" />
      </g>
      <g fill="#4fb8f5" stroke={INK} strokeWidth="2.5">
        <path d="M220 80 C 214 92, 214 98, 220 100 C 226 98, 226 92, 220 80 Z" />
        <path d="M250 90 C 244 102, 244 108, 250 110 C 256 108, 256 102, 250 90 Z" />
        <path d="M200 160 C 192 176, 192 184, 200 186 C 208 184, 208 176, 200 160 Z" />
      </g>
      <g transform="translate(200 200)">
        <ellipse cx="0" cy="0" rx="30" ry="22" fill="#f2c79a" stroke={INK} strokeWidth="4" />
        <circle cx="-9" cy="-3" r="3.5" fill={INK} />
        <circle cx="9" cy="-3" r="3.5" fill={INK} />
        <path d="M-5 7 Q 0 11 5 7" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  sprout: (
    <>
      <rect width="400" height="170" fill="#fff3c4" />
      <circle cx="330" cy="60" r="34" fill="#ffce3d" stroke={INK} strokeWidth="4" />
      <rect y="170" width="400" height="90" fill="#8a5a3c" />
      <path d="M0 170 C 80 160, 160 180, 240 168 C 300 160, 360 176, 400 168" stroke="#4fcb72" strokeWidth="12" fill="none" />
      <path d="M200 180 L 200 110" stroke="#2ead55" strokeWidth="8" strokeLinecap="round" />
      <path d="M200 130 C 170 130, 150 110, 150 90 C 176 90, 200 104, 200 130 Z" fill="#4fcb72" stroke={INK} strokeWidth="4" />
      <path d="M200 116 C 200 92, 220 76, 250 76 C 250 100, 230 116, 200 116 Z" fill="#8be0a0" stroke={INK} strokeWidth="4" />
      <circle cx="186" cy="104" r="3" fill={INK} />
      <circle cx="226" cy="94" r="3" fill={INK} />
    </>
  ),
};
