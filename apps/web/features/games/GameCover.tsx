import type { Game } from "@kidsworld/types";
import { art, type PlayIconKey } from "@/components/brand/PlayIcon";
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
      {game.gameType === "memory" && <MemoryArt icon={memoryIcon(game)} />}
      {game.gameType === "letter-sound" && <LetterSoundArt game={game} />}
      {game.gameType === "letter-hunt" && <LetterHuntArt game={game} />}
      {game.gameType === "odd-one-out" && <OddArt />}
      {game.gameType === "number-order" && <BubblesArt />}
      {game.gameType === "more-less" && <MoreLessArt />}
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

const memoryIcon = (g: Game) => {
  const theme = g.levels[0]?.configuration?.theme as string | undefined;
  return theme === "animals" ? "cat" : theme === "sky" ? "rocket" : theme === "fruits" ? "strawberry" : "apple";
};

function Sticker({ icon, x, y, s = 90 }: { icon: PlayIconKey; x: number; y: number; s?: number }) {
  return (
    <svg x={x - s / 2} y={y - s / 2} width={s} height={s} viewBox="0 0 64 64">
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">{art[icon]}</g>
    </svg>
  );
}

function Tile({ x, y, children, size = 74, fill = "#fff" }: { x: number; y: number; children: React.ReactNode; size?: number; fill?: string }) {
  return (
    <g>
      <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx="16" fill={fill} stroke={INK} strokeWidth="4" />
      <text x={x} y={y + size * 0.2} textAnchor="middle" fontSize={size * 0.55} fontWeight="900" fill={INK} fontFamily="Vazirmatn, sans-serif">
        {children}
      </text>
    </g>
  );
}

function LetterSoundArt({ game }: { game: Game }) {
  const en = game.levels[0]?.configuration?.alphabet === "en";
  return (
    <g>
      <rect x="40" y="50" width="150" height="190" rx="26" fill="#fff3c4" stroke={INK} strokeWidth="4" />
      <Sticker icon={en ? "kite" : "balloon"} x={115} y={130} s={110} />
      <Tile x={250} y={110}>{en ? "K" : "ب"}</Tile>
      <Tile x={330} y={150} fill="#ddf7e3">{en ? "B" : "ت"}</Tile>
      <Tile x={260} y={200} fill="#ffe3f1">{en ? "S" : "پ"}</Tile>
    </g>
  );
}

function LetterHuntArt({ game }: { game: Game }) {
  const en = game.levels[0]?.configuration?.alphabet === "en";
  const L = en ? ["A", "M", "A", "T", "O", "A"] : ["س", "ش", "س", "ص", "س", "ش"];
  return (
    <g>
      {L.map((c, i) => (
        <Tile key={i} x={120 + (i % 3) * 80} y={110 + Math.floor(i / 3) * 90} fill={c === L[0] ? "#8be0a0" : "#fff"}>{c}</Tile>
      ))}
      <circle cx="330" cy="70" r="26" fill="#ffce3d" stroke={INK} strokeWidth="4" />
      <path d="M348 88 L 370 110" stroke={INK} strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

function OddArt() {
  return (
    <g>
      <Sticker icon="apple" x={90} y={150} />
      <Sticker icon="banana" x={170} y={150} />
      <Sticker icon="car" x={250} y={150} />
      <Sticker icon="pear" x={330} y={150} />
      <circle cx="250" cy="150" r="54" fill="none" stroke="#ff7a66" strokeWidth="6" strokeDasharray="10 8" />
    </g>
  );
}

function BubblesArt() {
  const b: [number, number, string][] = [[90, 100, "#ff9f8e"], [180, 180, "#ffe07a"], [260, 90, "#8be0a0"], [320, 200, "#8fd3ff"], [130, 220, "#bfa5ff"]];
  return (
    <g>
      {b.map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="36" fill={c} stroke={INK} strokeWidth="4" />
          <text x={x} y={y + 13} textAnchor="middle" fontSize="36" fontWeight="900" fill={INK} fontFamily="Vazirmatn, sans-serif">{"۱۲۳۴۵"[i]}</text>
        </g>
      ))}
    </g>
  );
}

function MoreLessArt() {
  return (
    <g>
      <rect x="30" y="60" width="160" height="180" rx="24" fill="#fff" stroke={INK} strokeWidth="4" />
      <rect x="210" y="60" width="160" height="180" rx="24" fill="#ddf7e3" stroke={INK} strokeWidth="4" />
      <Sticker icon="strawberry" x={110} y={150} s={70} />
      {[[250, 110], [330, 110], [250, 190], [330, 190]].map(([x, y], i) => <Sticker key={i} icon="strawberry" x={x} y={y} s={62} />)}
    </g>
  );
}

function MemoryArt({ icon }: { icon: PlayIconKey }) {
  return (
    <g>
      <Card x={120} y={160} r={-12}>{art[icon]}</Card>
      <Card x={200} y={140} r={0} back />
      <Card x={280} y={160} r={12}>{art[icon]}</Card>
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
