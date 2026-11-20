import type { Worksheet } from "@kidsworld/types";
import { art, playIconKeys, type PlayIconKey } from "@/components/brand/PlayIcon";
import { iconThemes, type IconTheme } from "@/lib/data/alphabet";
import { BeginningSound, FindLetter, LetterMatch, LetterTrace, MissingLetter, WordSearch } from "./templates/letters";
import { ClockFaces, Compare, MissingNumber, NumberTrace, Subtraction } from "./templates/math";
import { ColoringTheme, OddOneOut, PatternNext, PictureSudoku, ShapeTrace } from "./templates/logic";
import { Arithmetic, BodyParts, Crossword, FindDifference, FlashCards, GridDrawing, MultiplicationChart, TracingLines, WordScramble, WordTrace } from "./templates/more";
import { tones } from "@/lib/tones";
import { UploadedSheet } from "./UploadedSheet";
import { fa, seeded, shuffle } from "@/lib/utils";

/**
 * Worksheet Generator (نسخه‌ی کلاینت)
 * هر کاربرگ از یک «Template» + «Params» ساخته می‌شود و خروجی یک SVG در ابعاد A4 است.
 * همین SVG برای پیش‌نمایش، چاپ مستقیم و خروجی PNG/SVG استفاده می‌شود.
 * در Backend همین قرارداد با یک Job صف‌شده به PDF تبدیل می‌شود.
 */

import { BODY_BOTTOM, BODY_TOP, H, INK, PAD, TraceRows, W, type TraceRow } from "./kit";

/** توضیح بلند در سربرگ بریده می‌شود تا از کادر بیرون نزند */
const clip = (s: string, n = 64) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function WorksheetSheet({ worksheet, className, id }: { worksheet: Worksheet; className?: string; id?: string }) {
  // کاربرگ آماده (آپلود در پنل مدیریت) به‌جای SVG تولیدی، تصویر/فایل خودش را نشان می‌دهد
  if (worksheet.template === "upload") return <UploadedSheet worksheet={worksheet} className={className} id={id} />;
  const t = tones[worksheet.tone].hex;
  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`پیش‌نمایش کاربرگ ${worksheet.title}`} direction="rtl">
      <style>{`.ws-outline *{fill:#fff !important}.ws-t{font-family:Vazirmatn,Tahoma,sans-serif}`}</style>
      <rect width={W} height={H} fill="#fff" />
      {/* حاشیه‌ی تزئینی (باریک) */}
      <rect x="10" y="10" width={W - 20} height={H - 20} rx="22" fill="none" stroke={t.mid} strokeWidth="4" strokeDasharray="1.5 11" strokeLinecap="round" />

      {/* سربرگ جمع‌وجور */}
      <rect x={PAD} y={PAD} width={W - PAD * 2} height="56" rx="16" fill={t.soft} stroke={INK} strokeWidth="1.6" />
      <text x={W - PAD - 16} y={PAD + 25} textAnchor="start" className="ws-t" fontSize="19" fontWeight="900" fill={INK}>
        {clip(worksheet.title, 40)}
      </text>
      <text x={W - PAD - 16} y={PAD + 44} textAnchor="start" className="ws-t" fontSize="11" fontWeight="500" fill="#3d3766">
        {clip(worksheet.description, 84)}
      </text>
      <g transform={`translate(${PAD + 12} ${PAD + 10})`}>
        <circle cx="18" cy="18" r="17" fill={t.solid} stroke={INK} strokeWidth="1.6" />
        <circle cx="12.5" cy="16.5" r="2" fill={INK} />
        <circle cx="23.5" cy="16.5" r="2" fill={INK} />
        <path d="M12.5 22 Q 18 27 23.5 22" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>

      {/* نام و تاریخ */}
      <text x={W - PAD} y={PAD + 80} className="ws-t" fontSize="12" fontWeight="700" fill={INK}>
        نام:
      </text>
      <line x1={W - PAD - 30} y1={PAD + 82} x2={W / 2 + 20} y2={PAD + 82} stroke="#b9b4d3" strokeWidth="1.2" strokeDasharray="3 3" />
      <text x={W / 2 - 10} y={PAD + 80} className="ws-t" fontSize="12" fontWeight="700" fill={INK}>
        تاریخ:
      </text>
      <line x1={W / 2 - 52} y1={PAD + 82} x2={PAD} y2={PAD + 82} stroke="#b9b4d3" strokeWidth="1.2" strokeDasharray="3 3" />

      <Body ws={worksheet} />

      {/* پاورقی */}
      <text x={W / 2} y={H - 18} textAnchor="middle" className="ws-t" fontSize="8.5" fill="#8a85ab">
        KidsWorld · {`${fa(worksheet.minAge)} تا ${fa(worksheet.maxAge)} سال`} · kidsworld.example
      </text>
    </svg>
  );
}

function Body({ ws }: { ws: Worksheet }) {
  switch (ws.template) {
    case "tracing":
      return <Tracing ws={ws} />;
    case "counting":
      return <Counting ws={ws} />;
    case "maze":
      return <Maze ws={ws} />;
    case "dot-to-dot":
      return <Dots ws={ws} />;
    case "matching":
      return <Matching ws={ws} />;
    case "coloring":
      return ws.params.theme ? <ColoringTheme ws={ws} /> : <Coloring />;
    case "addition":
      return <Addition ws={ws} />;
    case "letter-trace":
      return <LetterTrace ws={ws} />;
    case "find-letter":
      return <FindLetter ws={ws} />;
    case "beginning-sound":
      return <BeginningSound ws={ws} />;
    case "missing-letter":
      return <MissingLetter ws={ws} />;
    case "letter-match":
      return <LetterMatch ws={ws} />;
    case "word-search":
      return <WordSearch ws={ws} />;
    case "number-trace":
      return <NumberTrace ws={ws} />;
    case "missing-number":
      return <MissingNumber ws={ws} />;
    case "subtraction":
      return <Subtraction ws={ws} />;
    case "compare":
      return <Compare ws={ws} />;
    case "clock":
      return <ClockFaces ws={ws} />;
    case "pattern":
      return <PatternNext ws={ws} />;
    case "sudoku":
      return <PictureSudoku ws={ws} />;
    case "odd-one-out":
      return <OddOneOut ws={ws} />;
    case "shapes":
      return <ShapeTrace ws={ws} />;
    case "multiplication":
      return <Arithmetic ws={ws} op="×" />;
    case "division":
      return <Arithmetic ws={ws} op="÷" />;
    case "multiplication-chart":
      return <MultiplicationChart ws={ws} />;
    case "crossword":
      return <Crossword ws={ws} />;
    case "word-scramble":
      return <WordScramble ws={ws} />;
    case "flash-cards":
      return <FlashCards ws={ws} />;
    case "tracing-lines":
      return <TracingLines ws={ws} />;
    case "find-difference":
      return <FindDifference ws={ws} />;
    case "grid-drawing":
      return <GridDrawing ws={ws} />;
    case "word-trace":
      return <WordTrace ws={ws} />;
    case "body-parts":
      return <BodyParts ws={ws} />;
    default:
      return null;
  }
}

function Icon({ name, x, y, size, outline = false }: { name: PlayIconKey; x: number; y: number; size: number; outline?: boolean }) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 64 64">
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" className={outline ? "ws-outline" : undefined}>
        {art[name]}
      </g>
    </svg>
  );
}

/* ── ردگیری (کاربرگ‌های دستی) – فشرده ── */
function Tracing({ ws }: { ws: Worksheet }) {
  const letter = String(ws.params.letter);
  const word = String(ws.params.word ?? "");
  const t = tones[ws.tone].hex;
  // دنباله (مثل «۱۲۳۴۵») به‌صورت ردیف‌های جدا برای هر رقم؛ حرف تکی ۹ ردیف
  const glyphs = letter.length > 1 ? Array.from(letter) : [letter];
  const perGlyph = Math.max(1, Math.floor((word ? 8 : 10) / glyphs.length));
  const rows: TraceRow[] = glyphs.flatMap((g) => Array.from({ length: perGlyph }, (_, k) => ({ text: g, model: k === 0 })));
  if (word) rows.push({ text: word }, { text: word, traced: 1 });
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="14" fontWeight="700" fill={INK}>
        ✏️ با مداد روی نقطه‌چین‌ها بکش؛ ردیف آخر را خودت بنویس.
      </text>
      <TraceRows rows={rows} y0={BODY_TOP + 22} rowH={Math.min(64, (BODY_BOTTOM - BODY_TOP - 30) / rows.length)} lineH={38} tone={t.mid} />
    </g>
  );
}

/* ── شمارش ── */
function Counting({ ws }: { ws: Worksheet }) {
  const rand = seeded(Number(ws.params.seed ?? 1));
  const max = Number(ws.params.max ?? 5);
  // حداقل ۸ ردیف در هر برگه (به‌صرفه برای چاپ)
  const rows = Math.max(8, Number(ws.params.rows ?? 8));
  const pool: PlayIconKey[] = ws.params.theme
    ? ((iconThemes[String(ws.params.theme) as IconTheme] ?? iconThemes.fruits).icons as PlayIconKey[])
    : ["apple", "star", "fish", "flower", "heart", "ball", "mushroom", "leaf"];
  const rowH = (BODY_BOTTOM - BODY_TOP - 22) / rows;
  const values = (() => {
    // اعداد متنوع؛ وقتی ردیف‌ها از max بیشترند، دور دوم با ترتیب تازه
    const out: number[] = [];
    while (out.length < rows) out.push(...shuffle(Array.from({ length: max }, (_, i) => i + 1), rand));
    return out.slice(0, rows);
  })();
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="14" fontWeight="700" fill={INK}>
        🔢 بشمار و عدد را داخل مربع بنویس.
      </text>
      {values.map((n, r) => {
        const icon = pool[r % pool.length];
        const y = BODY_TOP + 16 + r * rowH;
        const inner = rowH - 10;
        const twoLines = n > 7;
        const size = twoLines ? Math.min(30, inner / 2 - 2) : Math.min(42, inner - 12);
        const perRow = twoLines ? Math.ceil(n / 2) : n;
        return (
          <g key={r}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={inner} rx="14" fill="#fffbf3" stroke="#eceaf6" strokeWidth="1.5" />
            {Array.from({ length: n }, (_, i) => {
              const row = Math.floor(i / perRow);
              const col = i % perRow;
              const yy = twoLines ? y + 3 + row * (size + 2) : y + (inner - size) / 2;
              return <Icon key={i} name={icon} x={W - PAD - 14 - size - col * (size + 6)} y={yy} size={size} />;
            })}
            <rect x={PAD + 14} y={y + (inner - 44) / 2} width="48" height="44" rx="10" fill="#fff" stroke={INK} strokeWidth="1.8" />
          </g>
        );
      })}
    </g>
  );
}

/* ── ماز (Recursive Backtracker با seed ثابت) ── */
export function buildMaze(n: number, seed: number) {
  const rand = seeded(seed);
  // walls[y][x] = [top, right, bottom, left]
  const walls = Array.from({ length: n }, () => Array.from({ length: n }, () => [true, true, true, true]));
  const seen = Array.from({ length: n }, () => Array(n).fill(false));
  const stack: [number, number][] = [[0, 0]];
  seen[0][0] = true;
  const dirs: [number, number, number, number][] = [
    [0, -1, 0, 2],
    [1, 0, 1, 3],
    [0, 1, 2, 0],
    [-1, 0, 3, 1],
  ];
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const options = shuffle(dirs, rand).filter(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      return nx >= 0 && ny >= 0 && nx < n && ny < n && !seen[ny][nx];
    });
    if (!options.length) {
      stack.pop();
      continue;
    }
    const [dx, dy, w, ow] = options[0];
    walls[y][x][w] = false;
    walls[y + dy][x + dx][ow] = false;
    seen[y + dy][x + dx] = true;
    stack.push([x + dx, y + dy]);
  }
  return walls;
}

function Maze({ ws }: { ws: Worksheet }) {
  const n = Number(ws.params.size ?? 8);
  const walls = buildMaze(n, Number(ws.params.seed ?? 1));
  const size = 470;
  const cell = size / n;
  const ox = (W - size) / 2;
  const oy = BODY_TOP + 60;
  const t = tones[ws.tone].hex;
  const start = (String(ws.params.start ?? "rabbit")) as PlayIconKey;
  const goal = (String(ws.params.goal ?? "house")) as PlayIconKey;
  const lines: string[] = [];
  walls.forEach((row, y) =>
    row.forEach(([top, right, bottom, left], x) => {
      const X = ox + x * cell;
      const Y = oy + y * cell;
      if (top && !(x === 0 && y === 0)) lines.push(`M${X} ${Y}H${X + cell}`);
      if (left) lines.push(`M${X} ${Y}V${Y + cell}`);
      if (right) lines.push(`M${X + cell} ${Y}V${Y + cell}`);
      if (bottom && !(x === n - 1 && y === n - 1)) lines.push(`M${X} ${Y + cell}H${X + cell}`);
    }),
  );
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="16" fontWeight="700" fill={INK}>
        🧭 از بالا شروع کن و راه رسیدن {String(ws.params.hint ?? "به خانه")} را پیدا کن.
      </text>
      <rect x={ox - 12} y={oy - 12} width={size + 24} height={size + 24} rx="20" fill={t.soft} />
      <path d={lines.join("")} stroke={INK} strokeWidth={n > 12 ? 3 : 4} strokeLinecap="round" fill="none" />
      <Icon name={start} x={ox + cell / 2 - 22} y={oy - 58} size={44} />
      <Icon name={goal} x={ox + size - cell / 2 - 28} y={oy + size + 10} size={56} />
    </g>
  );
}

/* ── نقطه به نقطه ── */
const DOT_SHAPES: Record<string, [number, number][]> = {
  star: Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? 1 : 0.42;
    return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
  }),
  house: [
    [-0.8, 0.9], [-0.8, -0.1], [-1, -0.1], [0, -0.95], [1, -0.1], [0.8, -0.1], [0.8, 0.9], [0.2, 0.9], [0.2, 0.4], [-0.2, 0.4], [-0.2, 0.9],
  ],
  heart: Array.from({ length: 16 }, (_, i) => {
    const t = (Math.PI * 2 * i) / 16 + Math.PI;
    const x = 16 * Math.sin(t) ** 3;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return [x / 17, y / 17] as [number, number];
  }),
  diamond: [[0, -1], [0.45, -0.45], [0.75, 0], [0.4, 0.5], [0, 1], [-0.4, 0.5], [-0.75, 0], [-0.45, -0.45]],
  fish: [[-1, 0], [-0.6, -0.45], [-0.1, -0.55], [0.35, -0.35], [0.6, -0.05], [0.95, -0.45], [0.9, 0], [0.95, 0.45], [0.6, 0.05], [0.35, 0.35], [-0.1, 0.55], [-0.6, 0.45]],
  boat: [[-0.95, 0.2], [0.95, 0.2], [0.65, 0.65], [-0.65, 0.65], [-0.95, 0.2], [-0.05, 0.2], [-0.05, -0.95], [0.7, 0.05], [0.05, 0.05]],
  kite: [[0, -1], [0.6, -0.25], [0, 0.6], [-0.6, -0.25]],
  tree: [[0, -1], [0.45, -0.45], [0.25, -0.45], [0.7, 0.05], [0.4, 0.05], [0.85, 0.55], [0.12, 0.55], [0.12, 0.95], [-0.12, 0.95], [-0.12, 0.55], [-0.85, 0.55], [-0.4, 0.05], [-0.7, 0.05], [-0.25, -0.45], [-0.45, -0.45]],
  crown: [[-0.9, 0.6], [-0.9, -0.5], [-0.45, 0], [0, -0.75], [0.45, 0], [0.9, -0.5], [0.9, 0.6]],
  rocket: [[0, -1], [0.3, -0.6], [0.3, 0.35], [0.6, 0.75], [0.25, 0.65], [0, 0.95], [-0.25, 0.65], [-0.6, 0.75], [-0.3, 0.35], [-0.3, -0.6]],
};

function Dots({ ws }: { ws: Worksheet }) {
  const pts = DOT_SHAPES[String(ws.params.shape)] ?? DOT_SHAPES.star;
  const cx = W / 2;
  const cy = BODY_TOP + 310;
  const R = 230;
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="16" fontWeight="700" fill={INK}>
        ✨ نقطه‌ها را به ترتیب عدد به هم وصل کن. بعد رنگش کن!
      </text>
      <path d={pts.map(([x, y], i) => `${i ? "L" : "M"}${cx + x * R} ${cy + y * R}`).join(" ")} fill="none" stroke="#eceaf6" strokeWidth="2" strokeDasharray={ws.params.hint ? "3 7" : "0 1000"} />
      {pts.map(([x, y], i) => {
        const px = cx + x * R;
        const py = cy + y * R;
        return (
          <g key={i}>
            <circle cx={px} cy={py} r="7" fill={i === 0 ? "#4fcb72" : INK} />
            <text x={px + (x >= 0 ? 14 : -14)} y={py - 10} textAnchor="middle" className="ws-t" fontSize="20" fontWeight="800" fill={INK}>
              {fa(i + 1)}
            </text>
          </g>
        );
      })}
      <Icon name="cloud" x={PAD + 10} y={H - 170} size={90} outline />
      <Icon name="sun" x={W - PAD - 100} y={H - 175} size={90} outline />
    </g>
  );
}

/* ── تطبیق ── */
function Matching({ ws }: { ws: Worksheet }) {
  const rand = seeded(Number(ws.params.seed ?? 1));
  const items: PlayIconKey[] = ws.params.theme
    ? shuffle((iconThemes[String(ws.params.theme) as IconTheme] ?? iconThemes.animals).icons as PlayIconKey[], rand).slice(0, 5)
    : ["star", "heart", "moon", "fish", "apple"];
  const right = shuffle(items, rand);
  const rowH = 112;
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="16" fontWeight="700" fill={INK}>
        🔗 هر شکل را با یک خط به سایه‌ی خودش وصل کن.
      </text>
      {items.map((k, i) => (
        <g key={k}>
          <Icon name={k} x={W - PAD - 100} y={BODY_TOP + 30 + i * rowH} size={82} />
          <circle cx={W - PAD - 120} cy={BODY_TOP + 71 + i * rowH} r="7" fill={INK} />
        </g>
      ))}
      {right.map((k, i) => (
        <g key={k}>
          <svg x={PAD + 20} y={BODY_TOP + 30 + i * rowH} width="82" height="82" viewBox="0 0 64 64">
            <g className="ws-sil" strokeWidth="3" strokeLinejoin="round">
              {art[k]}
            </g>
          </svg>
          <circle cx={PAD + 122} cy={BODY_TOP + 71 + i * rowH} r="7" fill={INK} />
        </g>
      ))}
      <style>{`.ws-sil *{fill:#3d3766 !important;stroke:#3d3766 !important}`}</style>
    </g>
  );
}

/* ── رنگ‌آمیزی ── */
function Coloring() {
  const y0 = BODY_TOP + 40;
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="16" fontWeight="700" fill={INK}>
        🎨 باغ را با رنگ‌های دلخواهت رنگ کن.
      </text>
      <Icon name="sun" x={W - PAD - 150} y={y0} size={140} outline />
      <Icon name="cloud" x={PAD + 20} y={y0 + 10} size={150} outline />
      <Icon name="cloud" x={PAD + 210} y={y0 + 60} size={100} outline />
      <path d={`M${PAD} ${y0 + 380} C 150 ${y0 + 330}, 300 ${y0 + 400}, ${W - PAD} ${y0 + 350}`} stroke={INK} strokeWidth="3" fill="none" />
      {[PAD + 10, PAD + 150, PAD + 290, PAD + 410].map((x, i) => (
        <g key={i}>
          <path d={`M${x + 60} ${y0 + 300} L ${x + 60} ${y0 + 520}`} stroke={INK} strokeWidth="3" />
          <Icon name="leaf" x={x + 60} y={y0 + 400} size={56} outline />
          <Icon name="flower" x={x} y={y0 + 200 + (i % 2) * 30} size={120} outline />
        </g>
      ))}
      <Icon name="mushroom" x={W / 2 - 40} y={y0 + 470} size={90} outline />
    </g>
  );
}

/* ── جمع ── */
function Addition({ ws }: { ws: Worksheet }) {
  const rand = seeded(Number(ws.params.seed ?? 1));
  const max = Number(ws.params.max ?? 10);
  // حداقل ۱۶ مسئله در هر برگه (به‌صرفه برای چاپ)
  const count = Math.max(16, Number(ws.params.count ?? 16));
  const half = Math.ceil(count / 2);
  const rowH = (BODY_BOTTOM - BODY_TOP - 30) / half;
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="14" fontWeight="700" fill={INK}>
        ➕ جمع‌ها را حل کن. می‌توانی از نقطه‌ها برای شمردن کمک بگیری.
      </text>
      {Array.from({ length: count }, (_, i) => {
        const a = 1 + Math.floor(rand() * (max / 2));
        const b = 1 + Math.floor(rand() * (max - a));
        const col = i < half ? 0 : 1;
        const row = i % half;
        const x = col === 0 ? W - PAD - 10 : W / 2 - 20;
        const y = BODY_TOP + 46 + row * rowH;
        return (
          <g key={i} direction="ltr">
            <text x={x} y={y} textAnchor="end" className="ws-t" fontSize="26" fontWeight="800" fill={INK} direction="ltr">
              {`${fa(a)} + ${fa(b)} =`}
            </text>
            <rect x={x - 186} y={y - 30} width="52" height="40" rx="10" fill="#fff" stroke={INK} strokeWidth="1.8" />
            <g>
              {Array.from({ length: Math.min(a + b, 20) }, (_, d) => (
                <circle key={d} cx={x - 6 - (d % 10) * 10} cy={y + 16 + Math.floor(d / 10) * 10} r="3.5" fill={d < a ? "#ff9f8e" : "#8fd3ff"} />
              ))}
            </g>
          </g>
        );
      })}
    </g>
  );
}

export const worksheetIconPool = playIconKeys;
