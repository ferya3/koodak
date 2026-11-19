import type { Worksheet } from "@kidsworld/types";
import { art, playIconKeys, type PlayIconKey } from "@/components/brand/PlayIcon";
import { tones } from "@/lib/tones";
import { fa, seeded, shuffle } from "@/lib/utils";

/**
 * Worksheet Generator (نسخه‌ی کلاینت)
 * هر کاربرگ از یک «Template» + «Params» ساخته می‌شود و خروجی یک SVG در ابعاد A4 است.
 * همین SVG برای پیش‌نمایش، چاپ مستقیم و خروجی PNG/SVG استفاده می‌شود.
 * در Backend همین قرارداد با یک Job صف‌شده به PDF تبدیل می‌شود.
 */

const W = 595;
const H = 842;
const INK = "#1f1a3d";
const PAD = 40;
const BODY_TOP = 190;

export function WorksheetSheet({ worksheet, className, id }: { worksheet: Worksheet; className?: string; id?: string }) {
  const t = tones[worksheet.tone].hex;
  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`پیش‌نمایش کاربرگ ${worksheet.title}`} direction="rtl">
      <style>{`.ws-outline *{fill:#fff !important}.ws-t{font-family:Vazirmatn,Tahoma,sans-serif}`}</style>
      <rect width={W} height={H} fill="#fff" />
      {/* حاشیه‌ی تزئینی */}
      <rect x="14" y="14" width={W - 28} height={H - 28} rx="28" fill="none" stroke={t.mid} strokeWidth="6" strokeDasharray="2 14" strokeLinecap="round" />

      {/* سربرگ */}
      <rect x={PAD} y={PAD} width={W - PAD * 2} height="86" rx="22" fill={t.soft} stroke={INK} strokeWidth="2.5" />
      <text x={W - PAD - 24} y={PAD + 40} textAnchor="start" className="ws-t" fontSize="26" fontWeight="900" fill={INK}>
        {worksheet.title}
      </text>
      <text x={W - PAD - 24} y={PAD + 68} textAnchor="start" className="ws-t" fontSize="14" fontWeight="500" fill="#3d3766">
        {worksheet.description}
      </text>
      <g transform={`translate(${PAD + 18} ${PAD + 16})`}>
        <circle cx="27" cy="27" r="25" fill={t.solid} stroke={INK} strokeWidth="2.5" />
        <circle cx="19" cy="25" r="3" fill={INK} />
        <circle cx="35" cy="25" r="3" fill={INK} />
        <path d="M19 33 Q 27 40 35 33" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* نام و تاریخ */}
      <text x={W - PAD} y={PAD + 122} className="ws-t" fontSize="15" fontWeight="700" fill={INK}>
        نام:
      </text>
      <line x1={W - PAD - 40} y1={PAD + 124} x2={W / 2 + 20} y2={PAD + 124} stroke="#b9b4d3" strokeWidth="2" strokeDasharray="4 4" />
      <text x={W / 2 - 10} y={PAD + 122} className="ws-t" fontSize="15" fontWeight="700" fill={INK}>
        تاریخ:
      </text>
      <line x1={W / 2 - 60} y1={PAD + 124} x2={PAD} y2={PAD + 124} stroke="#b9b4d3" strokeWidth="2" strokeDasharray="4 4" />

      <Body ws={worksheet} />

      {/* پاورقی */}
      <text x={W / 2} y={H - 30} textAnchor="middle" className="ws-t" fontSize="11" fill="#6e6893">
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
      return <Coloring />;
    case "addition":
      return <Addition ws={ws} />;
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

/* ── ردگیری ── */
function Tracing({ ws }: { ws: Worksheet }) {
  const letter = String(ws.params.letter);
  const word = String(ws.params.word ?? "");
  const rows = Number(ws.params.rows ?? 4);
  const isSequence = letter.length > 1;
  const rowH = 118;
  const t = tones[ws.tone].hex;
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="16" fontWeight="700" fill={INK}>
        ✏️ با مداد روی خط‌چین‌ها بکش. از نقطه‌ی سبز شروع کن.
      </text>
      {Array.from({ length: rows }, (_, r) => {
        const y = BODY_TOP + 30 + r * rowH;
        const glyphs = isSequence ? letter.split("") : Array.from({ length: 5 }, () => letter);
        return (
          <g key={r}>
            <line x1={PAD} y1={y + 20} x2={W - PAD} y2={y + 20} stroke="#eceaf6" strokeWidth="2" />
            <line x1={PAD} y1={y + 92} x2={W - PAD} y2={y + 92} stroke={t.mid} strokeWidth="2.5" />
            <line x1={PAD} y1={y + 56} x2={W - PAD} y2={y + 56} stroke="#eceaf6" strokeWidth="1.5" strokeDasharray="6 6" />
            {glyphs.map((g, i) => {
              const x = W - PAD - 50 - i * ((W - PAD * 2 - 40) / glyphs.length);
              const solid = r === 0 && i === 0;
              return (
                <g key={i}>
                  <text
                    x={x}
                    y={y + 88}
                    textAnchor="middle"
                    className="ws-t"
                    fontSize="78"
                    fontWeight="800"
                    fill={solid ? INK : "none"}
                    stroke={solid ? "none" : "#9a95b8"}
                    strokeWidth="2.2"
                    strokeDasharray="5 5"
                  >
                    {g}
                  </text>
                  {!solid && i === 0 && <circle cx={x + 18} cy={y + 30} r="5" fill="#4fcb72" />}
                </g>
              );
            })}
          </g>
        );
      })}
      {word && (
        <g>
          <text x={W - PAD} y={BODY_TOP + 30 + rows * rowH + 10} className="ws-t" fontSize="16" fontWeight="700" fill={INK}>
            حالا کلمه را ردگیری کن:
          </text>
          <text x={W / 2} y={BODY_TOP + 30 + rows * rowH + 90} textAnchor="middle" className="ws-t" fontSize="68" fontWeight="800" fill="none" stroke="#9a95b8" strokeWidth="2.2" strokeDasharray="5 5">
            {word}
          </text>
        </g>
      )}
    </g>
  );
}

/* ── شمارش ── */
function Counting({ ws }: { ws: Worksheet }) {
  const rand = seeded(Number(ws.params.seed ?? 1));
  const max = Number(ws.params.max ?? 5);
  const rows = Number(ws.params.rows ?? 5);
  const pool: PlayIconKey[] = ["apple", "star", "fish", "flower", "heart", "ball", "mushroom", "leaf"];
  const rowH = 112;
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="16" fontWeight="700" fill={INK}>
        🔢 بشمار و عدد را داخل مربع بنویس.
      </text>
      {(() => {
        // اعداد متنوع و بدون تکرار پشت‌سرهم
        const values = shuffle(Array.from({ length: max }, (_, i) => i + 1), rand);
        return Array.from({ length: rows }, (_, r) => values[r % values.length]);
      })().map((n, r) => {
        const icon = pool[r % pool.length];
        const y = BODY_TOP + 24 + r * rowH;
        const size = n > 6 ? 38 : 50;
        const perRow = n > 6 ? Math.ceil(n / 2) : n;
        return (
          <g key={r}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={rowH - 14} rx="18" fill="#fffbf3" stroke="#eceaf6" strokeWidth="2" />
            {Array.from({ length: n }, (_, i) => {
              const row = Math.floor(i / perRow);
              const col = i % perRow;
              const yy = n > 6 ? y + 6 + row * 44 : y + 22;
              return <Icon key={i} name={icon} x={W - PAD - 20 - size - col * (size + 8)} y={yy} size={size} />;
            })}
            <rect x={PAD + 20} y={y + 18} width="62" height="62" rx="14" fill="#fff" stroke={INK} strokeWidth="2.5" />
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
        🐰 از بالا شروع کن و راه رسیدن به خانه را پیدا کن.
      </text>
      <rect x={ox - 12} y={oy - 12} width={size + 24} height={size + 24} rx="20" fill={t.soft} />
      <path d={lines.join("")} stroke={INK} strokeWidth={n > 12 ? 3 : 4} strokeLinecap="round" fill="none" />
      <Icon name="heart" x={ox + cell / 2 - 18} y={oy - 52} size={36} />
      <text x={ox + cell / 2} y={oy - 58} textAnchor="middle" className="ws-t" fontSize="13" fontWeight="800" fill={INK}>
        شروع
      </text>
      {/* خانه */}
      <g transform={`translate(${ox + size - cell / 2 - 26} ${oy + size + 14})`}>
        <path d="M4 22 L 26 4 L 48 22 L 48 50 L 4 50 Z" fill="#ff9f8e" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <rect x="19" y="30" width="14" height="20" fill="#ffce3d" stroke={INK} strokeWidth="2.5" />
      </g>
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
  const items: PlayIconKey[] = ["star", "heart", "moon", "fish", "apple"];
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
  const count = Number(ws.params.count ?? 8);
  const half = Math.ceil(count / 2);
  const rowH = (H - BODY_TOP - 120) / half;
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="16" fontWeight="700" fill={INK}>
        ➕ جمع‌ها را حل کن. می‌توانی از نقطه‌ها برای شمردن کمک بگیری.
      </text>
      {Array.from({ length: count }, (_, i) => {
        const a = 1 + Math.floor(rand() * (max / 2));
        const b = 1 + Math.floor(rand() * (max - a));
        const col = i < half ? 0 : 1;
        const row = i % half;
        const x = col === 0 ? W - PAD - 10 : W / 2 - 20;
        const y = BODY_TOP + 70 + row * rowH;
        return (
          <g key={i} direction="ltr">
            <text x={x} y={y} textAnchor="end" className="ws-t" fontSize="34" fontWeight="800" fill={INK} direction="ltr">
              {`${fa(a)} + ${fa(b)} =`}
            </text>
            <rect x={x - 205} y={y - 38} width="58" height="52" rx="12" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <g>
              {Array.from({ length: Math.min(a + b, 20) }, (_, d) => (
                <circle key={d} cx={x - 8 - (d % 10) * 13} cy={y + 24 + Math.floor(d / 10) * 13} r="4.5" fill={d < a ? "#ff9f8e" : "#8fd3ff"} />
              ))}
            </g>
          </g>
        );
      })}
    </g>
  );
}

export const worksheetIconPool = playIconKeys;
