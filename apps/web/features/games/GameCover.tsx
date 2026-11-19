import type { Game } from "@kidsworld/types";
import { art } from "@/components/brand/PlayIcon";
import { tones } from "@/lib/tones";

const INK = "#1f1a3d";

/** کاور تصویرسازی‌شده‌ی هر نوع بازی (برای کارت‌ها و صفحه‌ی شروع بازی) */
export function GameCover({ game, className }: { game: Game; className?: string }) {
  const t = tones[game.tone].hex;
  return (
    <svg viewBox="0 0 400 300" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="300" fill={t.soft} />
      <circle cx="340" cy="40" r="90" fill={t.mid} opacity="0.5" />
      <circle cx="40" cy="280" r="110" fill={t.mid} opacity="0.4" />
      {game.gameType === "memory" && <MemoryArt />}
      {game.gameType === "pattern" && <PatternArt />}
      {game.gameType === "counting" && <CountingArt />}
    </svg>
  );
}

function Card({ x, y, r, children, back }: { x: number; y: number; r: number; children?: React.ReactNode; back?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x="-42" y="-54" width="84" height="108" rx="14" fill={back ? "#9b7bff" : "#fff"} stroke={INK} strokeWidth="4" />
      {back ? (
        <g fill="#bfa5ff">
          <circle cx="-16" cy="-24" r="6" />
          <circle cx="16" cy="0" r="6" />
          <circle cx="-16" cy="24" r="6" />
        </g>
      ) : (
        <svg x="-30" y="-30" width="60" height="60" viewBox="0 0 64 64">
          <g stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">{children}</g>
        </svg>
      )}
    </g>
  );
}

function MemoryArt() {
  return (
    <g>
      <Card x={120} y={160} r={-12}>{art.apple}</Card>
      <Card x={200} y={140} r={0} back />
      <Card x={280} y={160} r={12}>{art.apple}</Card>
      <path d="M150 70 C 170 50, 230 50, 250 70" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="2 10" />
      <polygon points="200,48 205,60 218,60 208,68 212,80 200,72 188,80 192,68 182,60 195,60" fill="#ffce3d" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

function PatternArt() {
  const cars: [string, "circle" | "square"][] = [["#ff7a66", "circle"], ["#4fb8f5", "square"], ["#ff7a66", "circle"], ["#4fb8f5", "square"]];
  return (
    <g>
      <path d="M0 220 L 400 220" stroke={INK} strokeWidth="4" />
      <path d="M0 232 L 400 232" stroke={INK} strokeWidth="4" strokeDasharray="10 14" />
      {/* لوکوموتیو */}
      <g transform="translate(300 140)">
        <rect x="0" y="10" width="76" height="60" rx="10" fill="#ffce3d" stroke={INK} strokeWidth="4" />
        <rect x="40" y="-14" width="22" height="26" rx="4" fill="#ff73b3" stroke={INK} strokeWidth="4" />
        <rect x="10" y="22" width="24" height="20" rx="4" fill="#ddf3ff" stroke={INK} strokeWidth="3" />
        <circle cx="20" cy="76" r="11" fill="#fff" stroke={INK} strokeWidth="4" />
        <circle cx="58" cy="76" r="11" fill="#fff" stroke={INK} strokeWidth="4" />
      </g>
      {cars.map(([c, s], i) => (
        <g key={i} transform={`translate(${222 - i * 74} 160)`}>
          <rect x="0" y="0" width="66" height="50" rx="10" fill="#fff" stroke={INK} strokeWidth="4" />
          {s === "circle" ? <circle cx="33" cy="25" r="14" fill={c} stroke={INK} strokeWidth="3" /> : <rect x="19" y="11" width="28" height="28" rx="5" fill={c} stroke={INK} strokeWidth="3" />}
          <circle cx="16" cy="56" r="9" fill="#fff" stroke={INK} strokeWidth="4" />
          <circle cx="50" cy="56" r="9" fill="#fff" stroke={INK} strokeWidth="4" />
        </g>
      ))}
      <g transform="translate(-74 160)">
        <rect x="0" y="0" width="66" height="50" rx="10" fill="#fff" stroke={INK} strokeWidth="4" strokeDasharray="8 8" />
      </g>
      <text x="10" y="196" fontSize="42" fontWeight="900" fill={INK} fontFamily="sans-serif">?</text>
    </g>
  );
}

function CountingArt() {
  const fish: [number, number, number][] = [[90, 110, 1], [190, 80, 0.9], [280, 130, 1.1], [140, 190, 1], [260, 210, 0.9]];
  return (
    <g>
      <rect x="40" y="40" width="320" height="230" rx="30" fill="#ddf3ff" stroke={INK} strokeWidth="4" />
      <path d="M40 90 C 120 70, 280 110, 360 80" stroke="#8fd3ff" strokeWidth="6" fill="none" />
      <path d="M70 270 C 70 240, 80 220, 90 210 M90 270 C 92 250, 100 236, 110 230" stroke="#4fcb72" strokeWidth="6" fill="none" strokeLinecap="round" />
      {fish.map(([x, y, s], i) => (
        <svg key={i} x={x - 32 * s} y={y - 32 * s} width={64 * s} height={64 * s} viewBox="0 0 64 64">
          <g stroke={INK} strokeWidth="3" strokeLinejoin="round">{art.fish}</g>
        </svg>
      ))}
      <circle cx="330" cy="60" r="6" fill="#fff" stroke={INK} strokeWidth="2" />
      <circle cx="320" cy="40" r="4" fill="#fff" stroke={INK} strokeWidth="2" />
    </g>
  );
}
