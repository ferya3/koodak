import type { Worksheet } from "@kidsworld/types";
import type { PlayIconKey } from "@/components/brand/PlayIcon";
import { iconThemes, type IconTheme } from "@/lib/data/alphabet";
import { tones } from "@/lib/tones";
import { seeded, shuffle } from "@/lib/utils";
import { BODY_TOP, Icon, INK, Instruction, num, PAD, SOFT_INK, str, W } from "../kit";

/* قالب‌های منطق، الگو و حرکات ظریف */

const theme = (ws: Worksheet, d: IconTheme) => (iconThemes[str(ws.params.theme, d) as IconTheme] ?? iconThemes[d]).icons as PlayIconKey[];

/* ── ۱. الگو: بعدی چیست؟ ── */
const PATTERNS = { 1: ["AB", "AAB", "ABB"], 2: ["ABC", "AABB", "ABAC"], 3: ["ABCD", "AABC", "ABBCC"] } as const;
export function PatternNext({ ws }: { ws: Worksheet }) {
  const level = Math.min(3, Math.max(1, num(ws.params.level, 1))) as 1 | 2 | 3;
  const rand = seeded(num(ws.params.seed, 31));
  const pool = theme(ws, "fruits");
  const rowH = 96;
  return (
    <g>
      <Instruction>🧩 الگو را ادامه بده: کدام تصویر بعدی است؟ آن را دور بگیر.</Instruction>
      {Array.from({ length: 6 }, (_, r) => {
        const tpl = PATTERNS[level][r % PATTERNS[level].length];
        const letters = [...new Set(tpl)];
        const chosen = shuffle(pool, rand).slice(0, letters.length);
        const map = Object.fromEntries(letters.map((l, i) => [l, chosen[i]])) as Record<string, PlayIconKey>;
        const seq = Array.from({ length: 6 }, (_, i) => map[tpl[i % tpl.length]]);
        const answer = map[tpl[6 % tpl.length]];
        const options = shuffle([answer, ...shuffle(pool.filter((p) => p !== answer), rand).slice(0, 2)], rand);
        const y = BODY_TOP + 26 + r * rowH;
        return (
          <g key={r}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={rowH - 12} rx="18" fill="#fffbf3" stroke="#eceaf6" strokeWidth="2" />
            {seq.map((ic, i) => <Icon key={i} name={ic} x={W - PAD - 58 - i * 46} y={y + 20} size={42} />)}
            <rect x={W - PAD - 58 - 6 * 46} y={y + 18} width="46" height="46" rx="10" fill="#fff" stroke={INK} strokeWidth="2" strokeDasharray="5 4" />
            <line x1={PAD + 150} y1={y + 12} x2={PAD + 150} y2={y + rowH - 24} stroke="#d9d6ea" strokeWidth="2" />
            {options.map((ic, i) => <Icon key={`o${i}`} name={ic} x={PAD + 12 + i * 46} y={y + 22} size={38} />)}
          </g>
        );
      })}
    </g>
  );
}

/* ── ۲. سودوکوی تصویری ۴×۴ ── */
export function PictureSudoku({ ws }: { ws: Worksheet }) {
  const rand = seeded(num(ws.params.seed, 41));
  const blanks = num(ws.params.blanks, 6);
  const icons = shuffle(theme(ws, "fruits"), rand).slice(0, 4);
  // مربع لاتین معتبر برای جعبه‌های ۲×۲، سپس جابه‌جایی ردیف‌ها/ستون‌ها درون باندها
  const base = [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]];
  const rowOrder = [...shuffle([0, 1], rand), ...shuffle([2, 3], rand)];
  const colOrder = [...shuffle([0, 1], rand), ...shuffle([2, 3], rand)];
  const grid = rowOrder.map((r) => colOrder.map((c) => base[r][c]));
  const hidden = new Set(shuffle(Array.from({ length: 16 }, (_, i) => i), rand).slice(0, blanks));
  const cell = 104;
  const gx = (W - cell * 4) / 2;
  const gy = BODY_TOP + 30;
  return (
    <g>
      <Instruction>🧠 هر ردیف، هر ستون و هر مربع کوچک باید هر چهار تصویر را داشته باشد. خانه‌های خالی را بکش.</Instruction>
      {grid.map((row, r) =>
        row.map((v, c) => {
          const x = gx + c * cell;
          const y = gy + r * cell;
          return (
            <g key={`${r}-${c}`}>
              <rect x={x} y={y} width={cell} height={cell} fill={hidden.has(r * 4 + c) ? "#fff" : "#fffbf3"} stroke="#b9b4d3" strokeWidth="1.5" />
              {!hidden.has(r * 4 + c) && <Icon name={icons[v]} x={x + 16} y={y + 16} size={cell - 32} />}
            </g>
          );
        }),
      )}
      <rect x={gx} y={gy} width={cell * 4} height={cell * 4} fill="none" stroke={INK} strokeWidth="4" rx="6" />
      <path d={`M${gx + cell * 2} ${gy} V${gy + cell * 4} M${gx} ${gy + cell * 2} H${gx + cell * 4}`} stroke={INK} strokeWidth="4" />
      <text x={W / 2} y={gy + cell * 4 + 50} textAnchor="middle" className="ws-t" fontSize="16" fontWeight="700" fill={INK}>
        تصویرها:
      </text>
      {icons.map((ic, i) => <Icon key={ic} name={ic} x={W / 2 - 150 + i * 80} y={gy + cell * 4 + 66} size={60} />)}
    </g>
  );
}

/* ── ۳. کدام فرق دارد؟ ── */
const ODD_GROUPS: IconTheme[] = ["animals", "fruits", "vehicles", "birds", "food", "things", "sky"];
export function OddOneOut({ ws }: { ws: Worksheet }) {
  const rand = seeded(num(ws.params.seed, 51));
  const rowH = 96;
  return (
    <g>
      <Instruction>🤔 در هر ردیف یکی با بقیه فرق دارد. آن را دور بگیر و بگو چرا!</Instruction>
      {Array.from({ length: 6 }, (_, r) => {
        const [g1, g2] = shuffle(ODD_GROUPS, rand);
        const same = shuffle(iconThemes[g1].icons as PlayIconKey[], rand).slice(0, 3);
        const odd = shuffle((iconThemes[g2].icons as PlayIconKey[]).filter((i) => !same.includes(i)), rand)[0];
        const items = shuffle([...same, odd], rand);
        const y = BODY_TOP + 26 + r * rowH;
        return (
          <g key={r}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={rowH - 12} rx="18" fill="#fffbf3" stroke="#eceaf6" strokeWidth="2" />
            {items.map((ic, i) => <Icon key={i} name={ic} x={W - PAD - 110 - i * 120} y={y + 8} size={68} />)}
          </g>
        );
      })}
    </g>
  );
}

/* ── ۴. ردگیری شکل‌ها ── */
const SHAPE_PATHS: Record<string, { name: string; d: (s: number) => string }> = {
  circle: { name: "دایره", d: (s) => `M${s / 2} 0 A${s / 2} ${s / 2} 0 1 1 ${s / 2 - 0.1} 0 Z` },
  square: { name: "مربع", d: (s) => `M0 0 H${s} V${s} H0 Z` },
  triangle: { name: "مثلث", d: (s) => `M${s / 2} 0 L${s} ${s} L0 ${s} Z` },
  rectangle: { name: "مستطیل", d: (s) => `M0 ${s * 0.22} H${s} V${s * 0.78} H0 Z` },
  star: {
    name: "ستاره",
    d: (s) => Array.from({ length: 10 }, (_, i) => {
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const rr = i % 2 === 0 ? s / 2 : s / 4.6;
      return `${i ? "L" : "M"}${s / 2 + rr * Math.cos(a)} ${s / 2 + rr * Math.sin(a)}`;
    }).join(" ") + " Z",
  },
  heart: { name: "قلب", d: (s) => `M${s / 2} ${s} C ${-s * 0.2} ${s * 0.45}, ${s * 0.15} ${-s * 0.15}, ${s / 2} ${s * 0.25} C ${s * 0.85} ${-s * 0.15}, ${s * 1.2} ${s * 0.45}, ${s / 2} ${s} Z` },
  diamond: { name: "لوزی", d: (s) => `M${s / 2} 0 L${s} ${s / 2} L${s / 2} ${s} L0 ${s / 2} Z` },
  oval: { name: "بیضی", d: (s) => `M0 ${s / 2} A${s / 2} ${s * 0.32} 0 1 1 ${s} ${s / 2} A${s / 2} ${s * 0.32} 0 1 1 0 ${s / 2} Z` },
};
export function ShapeTrace({ ws }: { ws: Worksheet }) {
  const shapes = str(ws.params.shapes, "circle,square,triangle,star").split(",").filter((s) => SHAPE_PATHS[s]);
  const t = tones[ws.tone].hex;
  const rowH = Math.min(150, (842 - BODY_TOP - 90) / shapes.length);
  const size = rowH - 50;
  return (
    <g>
      <Instruction>✏️ روی خط‌چین‌ها بکش و هر شکل را رنگ کن.</Instruction>
      {shapes.map((s, r) => {
        const y = BODY_TOP + 24 + r * rowH;
        return (
          <g key={s}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={rowH - 12} rx="18" fill="#fffbf3" stroke="#eceaf6" strokeWidth="2" />
            <path d={SHAPE_PATHS[s].d(size)} transform={`translate(${W - PAD - 30 - size} ${y + 19})`} fill={t.mid} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <text x={W - PAD - 40 - size} y={y + rowH / 2 + 6} textAnchor="start" className="ws-t" fontSize="18" fontWeight="800" fill={INK}>
              {SHAPE_PATHS[s].name}
            </text>
            {[0, 1, 2].map((k) => (
              <path key={k} d={SHAPE_PATHS[s].d(size)} transform={`translate(${PAD + 20 + k * (size + 24)} ${y + 19})`} fill="none" stroke={SOFT_INK} strokeWidth="3" strokeDasharray="7 6" strokeLinejoin="round" />
            ))}
          </g>
        );
      })}
    </g>
  );
}

/* ── ۵. رنگ‌آمیزی موضوعی ── */
export function ColoringTheme({ ws }: { ws: Worksheet }) {
  const icons = theme(ws, "animals");
  const rand = seeded(num(ws.params.seed, 61));
  const picks = shuffle(icons, rand).slice(0, 6);
  const big = picks[0];
  return (
    <g>
      <Instruction>🎨 تصویرها را با رنگ‌های دلخواهت رنگ کن.</Instruction>
      <Icon name={big} x={W / 2 - 150} y={BODY_TOP + 20} size={300} outline />
      {picks.slice(1).map((ic, i) => (
        <Icon key={ic} name={ic} x={PAD + 10 + i * 104} y={BODY_TOP + 360} size={96} outline />
      ))}
      <path d={`M${PAD} ${BODY_TOP + 480} C 160 ${BODY_TOP + 450}, 420 ${BODY_TOP + 510}, ${W - PAD} ${BODY_TOP + 470}`} stroke={INK} strokeWidth="3" fill="none" />
      {picks.slice(1, 4).map((ic, i) => (
        <Icon key={`b${ic}`} name={ic} x={PAD + 70 + i * 160} y={BODY_TOP + 500} size={110} outline />
      ))}
    </g>
  );
}
