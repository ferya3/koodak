import type { Worksheet } from "@kidsworld/types";
import { playIconNames, playIconNamesEn, type PlayIconKey } from "@/components/brand/PlayIcon";
import { enLetters, faLetters, iconThemes, type IconTheme } from "@/lib/data/alphabet";
import { PIXEL_ART } from "@/lib/data/pixelArt";
import { tones } from "@/lib/tones";
import { seeded, shuffle } from "@/lib/utils";
import { AnswerBox, BODY_BOTTOM, BODY_TOP, digits, H, Icon, INK, Instruction, num, PAD, SOFT_INK, str, TraceRows, W } from "../kit";

/*
 * قالب‌های تکمیلی کاربرگ:
 * ضرب، جدول ضرب، تقسیم، جدول متقاطع، کلمه‌ی درهم، فلش‌کارت، ردگیری خط،
 * تفاوت‌ها، نقاشی شطرنجی (کپی/قرینه)، ردگیری کلمه، اعضای بدن.
 */

const lang = (ws: Worksheet) => (str(ws.params.lang, "fa") === "en" ? "en" : "fa");
const themeOf = (ws: Worksheet, d: IconTheme = "animals") => (iconThemes[str(ws.params.theme, d) as IconTheme] ?? iconThemes[d]).icons as PlayIconKey[];
/** نام تصویر بدون نیم‌فاصله و فاصله (برای جدول‌ها: هر خانه یک حرف) */
const wordOf = (icon: PlayIconKey, l: "fa" | "en") => (l === "fa" ? playIconNames[icon] : playIconNamesEn[icon]).replace(/‌/g, "");
const lettersOf = (w: string) => Array.from(w);
const TONE_FILL = { r: "#ff7a66", o: "#ff9f4a", y: "#ffce3d", g: "#4fcb72", b: "#4fb8f5", p: "#ff73b3", v: "#9b7bff", n: "#a5714a", w: "#dfe6ee", k: INK } as const;

/* ───────────── ۱. ضرب و تقسیم ───────────── */
export function Arithmetic({ ws, op }: { ws: Worksheet; op: "×" | "÷" }) {
  const rand = seeded(num(ws.params.seed, 5));
  const table = num(ws.params.table, 0);
  const max = num(ws.params.max, 10);
  const problems: [number, number][] = [];
  if (op === "×") {
    // جدول: هر ضرب دو بار با ترتیب متفاوت (۲۰ مسئله)
    if (table) [...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rand), ...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rand)].forEach((b) => problems.push([table, b]));
    else for (let i = 0; i < 20; i++) problems.push([1 + Math.floor(rand() * max), 1 + Math.floor(rand() * max)]);
  } else {
    for (let i = 0; i < 20; i++) {
      const b = table || 2 + Math.floor(rand() * (max - 1));
      const q = 1 + Math.floor(rand() * 10);
      problems.push([b * q, b]);
    }
  }
  const half = Math.ceil(problems.length / 2);
  const rowH = (BODY_BOTTOM - BODY_TOP - 30) / half;
  return (
    <g>
      <Instruction>{op === "×" ? (table ? `✖️ جدول ضرب ${digits(table)}: جواب‌ها را بنویس.` : "✖️ ضرب‌ها را حل کن.") : "➗ تقسیم‌ها را حل کن. (چند تا در آن جا می‌شود؟)"}</Instruction>
      {problems.map(([a, b], i) => {
        const col = i < half ? 0 : 1;
        const x = col === 0 ? W - PAD - 14 : W / 2 - 24;
        const y = BODY_TOP + 52 + (i % half) * rowH;
        return (
          <g key={i}>
            <text x={x} y={y} textAnchor="end" direction="ltr" className="ws-t" fontSize="24" fontWeight="800" fill={INK}>
              {`${digits(a)} ${op} ${digits(b)} =`}
            </text>
            <AnswerBox x={x - 196} y={y - 30} w={56} h={40} />
          </g>
        );
      })}
    </g>
  );
}

/* ───────────── ۲. جدول ضرب (مرجع یا با خانه‌ی خالی) ───────────── */
export function MultiplicationChart({ ws }: { ws: Worksheet }) {
  const n = num(ws.params.size, 10);
  const blanks = num(ws.params.blanks, 0);
  const rand = seeded(num(ws.params.seed, 3));
  const t = tones[ws.tone].hex;
  const cell = Math.min(46, (W - PAD * 2) / (n + 1));
  const top = BODY_TOP + 24;
  const hidden = new Set(
    shuffle(
      Array.from({ length: n * n }, (_, k) => k),
      rand,
    ).slice(0, blanks),
  );
  return (
    <g>
      <Instruction>{blanks ? "✖️ خانه‌های خالی جدول ضرب را پر کن." : "✖️ جدول ضرب: سطر و ستون را دنبال کن تا به جواب برسی."}</Instruction>
      {Array.from({ length: n + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => {
          const x = W - PAD - (j + 1) * cell;
          const y = top + i * cell;
          const header = i === 0 || j === 0;
          const blank = !header && hidden.has((i - 1) * n + (j - 1));
          const v = i === 0 && j === 0 ? "×" : header ? digits(i || j) : blank ? "" : digits(i * j);
          return (
            <g key={`${i}-${j}`}>
              <rect x={x} y={y} width={cell} height={cell} fill={header ? t.mid : i === j ? t.soft : "#fff"} stroke={INK} strokeWidth={header ? 2 : 1.2} />
              <text x={x + cell / 2} y={y + cell / 2 + 7} textAnchor="middle" direction="ltr" className="ws-t" fontSize={header ? 20 : 17} fontWeight={header ? 900 : 700} fill={INK}>
                {v}
              </text>
            </g>
          );
        }),
      )}
    </g>
  );
}

/* ───────────── ۳. جدول متقاطع تصویری ───────────── */
interface Placed {
  word: string;
  icon: PlayIconKey;
  r: number;
  c: number;
  across: boolean;
}

/** چیدن کلمه‌ها با تقاطع (الگوریتم حریصانه‌ی قطعی با seed) */
export function buildCrossword(icons: PlayIconKey[], l: "fa" | "en", seed: number, max = 7): Placed[] {
  const rand = seeded(seed);
  const pool = shuffle(icons, rand)
    .map((icon) => ({ icon, word: wordOf(icon, l).toLowerCase() }))
    .filter((x) => !/\s/.test(x.word) && lettersOf(x.word).length >= 3 && lettersOf(x.word).length <= 8)
    .sort((a, b) => lettersOf(b.word).length - lettersOf(a.word).length);
  const cells = new Map<string, { ch: string; across: boolean[] }>();
  const placed: Placed[] = [];
  const key = (r: number, c: number) => `${r},${c}`;

  const can = (w: string[], r: number, c: number, across: boolean) => {
    const [dr, dc] = across ? [0, 1] : [1, 0];
    if (cells.has(key(r - dr, c - dc)) || cells.has(key(r + dr * w.length, c + dc * w.length))) return false;
    let cross = 0;
    for (let i = 0; i < w.length; i++) {
      const rr = r + dr * i;
      const cc = c + dc * i;
      const hit = cells.get(key(rr, cc));
      if (hit) {
        if (hit.ch !== w[i] || hit.across.includes(across)) return false;
        cross++;
      } else if (cells.has(key(rr + dc, cc + dr)) || cells.has(key(rr - dc, cc - dr))) return false;
    }
    return cross > 0 && cross < w.length;
  };
  const put = (p: Placed) => {
    const w = lettersOf(p.word);
    const [dr, dc] = p.across ? [0, 1] : [1, 0];
    w.forEach((ch, i) => {
      const k = key(p.r + dr * i, p.c + dc * i);
      const hit = cells.get(k);
      if (hit) hit.across.push(p.across);
      else cells.set(k, { ch, across: [p.across] });
    });
    placed.push(p);
  };

  for (const { icon, word } of pool) {
    if (placed.length >= max) break;
    const w = lettersOf(word);
    if (!placed.length) {
      put({ word, icon, r: 0, c: 0, across: true });
      continue;
    }
    const options: Placed[] = [];
    for (const [k, v] of cells) {
      const [r, c] = k.split(",").map(Number);
      w.forEach((ch, i) => {
        if (ch !== v.ch) return;
        if (can(w, r, c - i, true)) options.push({ word, icon, r, c: c - i, across: true });
        if (can(w, r - i, c, false)) options.push({ word, icon, r: r - i, c, across: false });
      });
    }
    if (options.length) put(options[Math.floor(rand() * options.length)]);
  }
  const minR = Math.min(...placed.map((p) => p.r));
  const minC = Math.min(...placed.map((p) => p.c));
  return placed.map((p) => ({ ...p, r: p.r - minR, c: p.c - minC }));
}

export function Crossword({ ws }: { ws: Worksheet }) {
  const l = lang(ws);
  const hint = str(ws.params.hint, "1") !== "0";
  const words = buildCrossword(themeOf(ws), l, num(ws.params.seed, 1));
  const t = tones[ws.tone].hex;
  const rows = Math.max(...words.map((p) => p.r + (p.across ? 1 : lettersOf(p.word).length)));
  const cols = Math.max(...words.map((p) => p.c + (p.across ? lettersOf(p.word).length : 1)));
  const areaTop = BODY_TOP + 20;
  // شبکه + دو کادر سرنخ (۲×۱۱۶ + فاصله) باید بالای پاورقی تمام شوند
  const cell = Math.min(40, (W - PAD * 2) / cols, (BODY_BOTTOM - areaTop - 24 - 242) / rows);
  const gridW = cols * cell;
  const x0 = (W - gridW) / 2;
  /** فارسی: کلمه‌ی افقی از راست به چپ نوشته می‌شود → ستون منطقی قرینه می‌شود */
  const cx = (c: number) => (l === "fa" ? x0 + (cols - 1 - c) * cell : x0 + c * cell);

  // شماره‌گذاری: ردیف به ردیف، در هر ردیف به ترتیب خواندن
  const starts = [...new Set(words.map((p) => `${p.r},${p.c}`))].sort((a, b) => {
    const [ar, ac] = a.split(",").map(Number);
    const [br, bc] = b.split(",").map(Number);
    return ar - br || ac - bc;
  });
  const numberOf = (p: Placed) => starts.indexOf(`${p.r},${p.c}`) + 1;
  const cells = new Map<string, string>();
  words.forEach((p) => lettersOf(p.word).forEach((ch, i) => cells.set(p.across ? `${p.r},${p.c + i}` : `${p.r + i},${p.c}`, ch)));
  const firsts = new Set(words.map((p) => `${p.r},${p.c}`));

  const clueTop = Math.max(areaTop + rows * cell + 24, BODY_BOTTOM - 242);
  const groups = [
    { title: l === "fa" ? "افقی ←" : "Across →", items: words.filter((p) => p.across) },
    { title: "عمودی ↓", items: words.filter((p) => !p.across) },
  ];
  return (
    <g>
      <Instruction>🧩 اسم هر تصویر را در خانه‌های جدول بنویس.</Instruction>
      {[...cells.entries()].map(([k, ch]) => {
        const [r, c] = k.split(",").map(Number);
        const x = cx(c);
        const y = areaTop + r * cell;
        const n = starts.indexOf(k) + 1;
        return (
          <g key={k}>
            <rect x={x} y={y} width={cell} height={cell} fill="#fff" stroke={INK} strokeWidth="2" />
            {n > 0 && (
              <text x={l === "fa" ? x + cell - 4 : x + 4} y={y + 12} textAnchor={l === "fa" ? "start" : "start"} direction={l === "fa" ? "rtl" : "ltr"} className="ws-t" fontSize="10" fontWeight="800" fill={t.deep}>
                {digits(n)}
              </text>
            )}
            {hint && firsts.has(k) && (
              <text x={x + cell / 2} y={y + cell * 0.72} textAnchor="middle" className="ws-t" fontSize={cell * 0.5} fontWeight="800" fill="#c9c5df">
                {ch}
              </text>
            )}
          </g>
        );
      })}
      {groups.map((g, gi) => {
        const y = clueTop + gi * 126;
        const step = Math.min(118, (W - PAD * 2 - 90) / Math.max(g.items.length, 1));
        return (
          <g key={gi}>
            <rect x={PAD} y={y} width={W - PAD * 2} height="116" rx="20" fill={gi ? "#f6f3ff" : t.soft} stroke="#e4e0f3" strokeWidth="2" />
            <text x={W - PAD - 16} y={y + 30} className="ws-t" fontSize="17" fontWeight="900" fill={INK}>
              {g.title}
            </text>
            {g.items.map((p, i) => {
              const x = W - PAD - 100 - i * step;
              return (
                <g key={p.word}>
                  <Icon name={p.icon} x={x + step / 2 - 32} y={y + 40} size={64} />
                  <circle cx={x + step / 2 + 26} cy={y + 46} r="13" fill="#fff" stroke={INK} strokeWidth="2" />
                  <text x={x + step / 2 + 26} y={y + 51} textAnchor="middle" className="ws-t" fontSize="13" fontWeight="900" fill={INK}>
                    {digits(numberOf(p))}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

/* ───────────── ۴. کلمه‌ی درهم ───────────── */
export function WordScramble({ ws }: { ws: Worksheet }) {
  const l = lang(ws);
  const rand = seeded(num(ws.params.seed, 2));
  const items = shuffle(themeOf(ws), rand)
    .map((icon) => ({ icon, word: wordOf(icon, l).toLowerCase() }))
    .filter((x) => !/\s/.test(x.word) && lettersOf(x.word).length >= 2 && lettersOf(x.word).length <= 8)
    .slice(0, 6);
  const t = tones[ws.tone].hex;
  const rowH = (BODY_BOTTOM - BODY_TOP - 30) / 6;
  const tile = 34;
  return (
    <g>
      <Instruction>🔀 حرف‌ها به‌هم ریخته‌اند! کلمه‌ی درست را در خانه‌ها بنویس.</Instruction>
      {items.map(({ icon, word }, r) => {
        const letters = lettersOf(word);
        let mixed = shuffle(letters, rand);
        for (let k = 0; k < 4 && mixed.join("") === letters.join(""); k++) mixed = shuffle(letters, rand);
        const y = BODY_TOP + 20 + r * rowH;
        const right = W - PAD - 110;
        return (
          <g key={icon}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={rowH - 10} rx="18" fill={r % 2 ? "#fff" : "#fffbf3"} stroke="#eceaf6" strokeWidth="2" />
            <Icon name={icon} x={W - PAD - 92} y={y + (rowH - 10) / 2 - 38} size={76} />
            {mixed.map((ch, i) => (
              <g key={i}>
                <circle cx={l === "fa" ? right - i * (tile + 6) - tile / 2 : right - (letters.length - 1 - i) * (tile + 6) - tile / 2} cy={y + 28} r={tile / 2} fill={t.soft} stroke={INK} strokeWidth="2" />
                <text x={l === "fa" ? right - i * (tile + 6) - tile / 2 : right - (letters.length - 1 - i) * (tile + 6) - tile / 2} y={y + 36} textAnchor="middle" className="ws-t" fontSize="20" fontWeight="900" fill={INK}>
                  {ch}
                </text>
              </g>
            ))}
            {letters.map((_, i) => (
              <rect key={i} x={right - (i + 1) * (tile + 6)} y={y + 52} width={tile} height={tile} rx="7" fill="#fff" stroke={INK} strokeWidth="2" />
            ))}
          </g>
        );
      })}
    </g>
  );
}

/* ───────────── ۵. فلش‌کارت (۶ کارت برای بریدن) ───────────── */
type Card = { big: string; ltr?: boolean; icon?: PlayIconKey; icons?: number; caption: string; sub?: string };

function cardsFor(ws: Worksheet): Card[] {
  const kind = str(ws.params.kind, "fa-letters");
  const from = num(ws.params.from, 0);
  if (kind === "en-letters") return enLetters.slice(from, from + 6).map((x) => ({ big: `${x.upper}${x.upper.toLowerCase()}`, ltr: true, icon: x.icon as PlayIconKey, caption: x.word }));
  if (kind === "numbers")
    return Array.from({ length: 6 }, (_, k) => from + k).map((n) => ({ big: digits(n), icon: themeOf(ws, "fruits")[n % themeOf(ws, "fruits").length], icons: n, caption: ["صفر", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده", "یازده"][n] ?? "" }));
  if (kind === "words") return themeOf(ws).slice(0, 6).map((icon) => ({ big: "", icon, caption: playIconNames[icon], sub: playIconNamesEn[icon] }));
  return faLetters.slice(from, from + 6).map((x) => ({ big: x.char, icon: x.icon as PlayIconKey, caption: x.word }));
}

export function FlashCards({ ws }: { ws: Worksheet }) {
  const cards = cardsFor(ws);
  const t = tones[ws.tone].hex;
  const top = BODY_TOP + 14;
  const cw = (W - PAD * 2) / 2;
  const ch = (BODY_BOTTOM - top) / 3;
  return (
    <g>
      <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="14" fontWeight="700" fill="#6e6893">
        ✂️ کارت‌ها را از روی خط‌چین ببُر. پشت هر کارت را می‌توانی رنگ کنی.
      </text>
      {cards.map((c, i) => {
        const x = W - PAD - (i % 2 + 1) * cw;
        const y = top + Math.floor(i / 2) * ch;
        const big = c.big !== "";
        return (
          <g key={i}>
            <rect x={x + 8} y={y + 8} width={cw - 16} height={ch - 16} rx="20" fill={i % 3 === 1 ? "#fff" : t.soft} stroke={INK} strokeWidth="2.5" />
            {big ? (
              <>
                <text x={x + cw - 70} y={y + ch / 2 + 30} textAnchor="middle" direction={c.ltr ? "ltr" : undefined} className="ws-t" fontSize={c.ltr ? 64 : 92} fontWeight="900" fill={INK}>
                  {c.big}
                </text>
                {c.icons !== undefined ? (
                  Array.from({ length: c.icons }, (_, k) => <Icon key={k} name={c.icon!} x={x + 22 + (k % 4) * 28} y={y + 34 + Math.floor(k / 4) * 30} size={28} />)
                ) : (
                  <Icon name={c.icon!} x={x + 26} y={y + 26} size={86} />
                )}
              </>
            ) : (
              <Icon name={c.icon!} x={x + cw / 2 - 50} y={y + 22} size={100} />
            )}
            <text x={big ? x + 70 : x + cw / 2} y={y + ch - 30} textAnchor="middle" direction={c.ltr ? "ltr" : undefined} className="ws-t" fontSize="20" fontWeight="900" fill={INK}>
              {c.caption}
            </text>
            {c.sub && (
              <text x={x + cw / 2} y={y + ch - 30 - 24} textAnchor="middle" direction="ltr" className="ws-t" fontSize="15" fontWeight="700" fill="#6e6893">
                {c.sub}
              </text>
            )}
          </g>
        );
      })}
      {/* خطوط برش */}
      <g stroke={SOFT_INK} strokeWidth="1.5" strokeDasharray="7 6">
        <line x1={W / 2} y1={top} x2={W / 2} y2={top + ch * 3} />
        <line x1={PAD} y1={top + ch} x2={W - PAD} y2={top + ch} />
        <line x1={PAD} y1={top + ch * 2} x2={W - PAD} y2={top + ch * 2} />
        <rect x={PAD} y={top} width={W - PAD * 2} height={ch * 3} fill="none" />
      </g>
    </g>
  );
}

/* ───────────── ۶. ردگیری خط (آمادگی نوشتن) ───────────── */
const LINE_PAIRS: [PlayIconKey, PlayIconKey][] = [
  ["rabbit", "carrot"], ["cat", "fish"], ["car", "house"], ["rocket", "moon"], ["bee", "flower"], ["bird", "nest"], ["dog", "ball"], ["chick", "egg"], ["boat", "sun"],
];
type LineKind = "straight" | "wave" | "zigzag" | "arches" | "steps" | "loops" | "spikes";
const LINE_LEVELS: Record<number, LineKind[]> = {
  1: ["straight", "straight", "wave", "arches", "wave", "zigzag"],
  2: ["zigzag", "arches", "steps", "wave", "spikes", "steps"],
  3: ["loops", "spikes", "steps", "loops", "zigzag", "loops"],
};

function linePath(kind: LineKind, x1: number, x2: number, y: number) {
  const L = x1 - x2;
  const pts: [number, number][] = [];
  const k = 4;
  const A = 18;
  for (let i = 0; i <= 240; i++) {
    const t = i / 240;
    const th = 2 * Math.PI * k * t;
    let dx = L * t;
    let dy = 0;
    if (kind === "wave") dy = A * Math.sin(th);
    if (kind === "zigzag") dy = A * (2 / Math.PI) * Math.asin(Math.sin(th));
    if (kind === "spikes") dy = -A * 1.4 * Math.abs((2 / Math.PI) * Math.asin(Math.sin(th / 2))) + A * 0.7;
    if (kind === "arches") dy = -A * 1.6 * Math.abs(Math.sin(th / 2)) + A * 0.8;
    if (kind === "steps") dy = Math.sin(th) >= 0 ? -A : A;
    if (kind === "loops") {
      dx = L * t - 22 * Math.sin(th);
      dy = -22 * Math.cos(th) + 4;
    }
    pts.push([x1 - dx, y + dy]);
  }
  return pts.map(([x, yy], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${yy.toFixed(1)}`).join(" ");
}

export function TracingLines({ ws }: { ws: Worksheet }) {
  const level = Math.min(3, Math.max(1, num(ws.params.level, 1)));
  const rand = seeded(num(ws.params.seed, level));
  const pairs = shuffle(LINE_PAIRS, rand);
  const t = tones[ws.tone].hex;
  const rowH = (BODY_BOTTOM - BODY_TOP - 20) / 6;
  return (
    <g>
      <Instruction>✏️ از روی خط‌چین‌ها برو و هر کدام را به خانه‌اش برسان.</Instruction>
      {LINE_LEVELS[level].map((kind, r) => {
        const y = BODY_TOP + 22 + r * rowH + rowH / 2;
        const [from, to] = pairs[r % pairs.length];
        const x1 = W - PAD - 74;
        const x2 = PAD + 74;
        return (
          <g key={r}>
            <rect x={PAD} y={y - rowH / 2 + 4} width={W - PAD * 2} height={rowH - 8} rx="18" fill={r % 2 ? "#fff" : t.soft} stroke="#eceaf6" strokeWidth="2" />
            <path d={linePath(kind, x1, x2, y)} fill="none" stroke={SOFT_INK} strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={x1} cy={y} r="6" fill="#4fcb72" stroke={INK} strokeWidth="2" />
            <Icon name={from} x={W - PAD - 68} y={y - 30} size={60} />
            <Icon name={to} x={PAD + 8} y={y - 30} size={60} />
          </g>
        );
      })}
    </g>
  );
}

/* ───────────── ۷. تفاوت‌ها را پیدا کن ───────────── */
type Diff = "remove" | "swap" | "size" | "add";

export function FindDifference({ ws }: { ws: Worksheet }) {
  const rand = seeded(num(ws.params.seed, 4));
  const icons = themeOf(ws);
  const count = num(ws.params.count, 5);
  const t = tones[ws.tone].hex;
  const pw = W - PAD * 2;
  const ph = 262;
  // ۱۰ تصویر در شبکه‌ی ۵×۲ با جابه‌جایی تصادفی
  const items = Array.from({ length: 10 }, (_, i) => ({
    icon: icons[Math.floor(rand() * icons.length)],
    x: (i % 5) * (pw / 5) + 14 + rand() * 18,
    y: Math.floor(i / 5) * 118 + 24 + rand() * 14,
    s: 62 + rand() * 18,
  }));
  const kinds: Diff[] = ["remove", "swap", "size", "add", "swap", "remove", "size"];
  const changed = shuffle(Array.from({ length: 10 }, (_, i) => i), rand).slice(0, count);
  const diffOf = new Map(changed.map((idx, k) => [idx, kinds[k % kinds.length]]));
  const extra = shuffle(["star", "heart", "flower", "leaf"] as PlayIconKey[], rand)[0];

  const panel = (y: number, second: boolean) => (
    <g>
      <rect x={PAD} y={y} width={pw} height={ph} rx="24" fill={t.soft} stroke={INK} strokeWidth="2.5" />
      <path d={`M${PAD + 2} ${y + ph - 40} C ${PAD + 150} ${y + ph - 60}, ${PAD + 350} ${y + ph - 30}, ${W - PAD - 2} ${y + ph - 50} L ${W - PAD - 2} ${y + ph - 24} Q ${W - PAD - 2} ${y + ph - 2} ${W - PAD - 24} ${y + ph - 2} L ${PAD + 24} ${y + ph - 2} Q ${PAD + 2} ${y + ph - 2} ${PAD + 2} ${y + ph - 24} Z`} fill="#c8f0d2" />
      {items.map((it, i) => {
        const d = second ? diffOf.get(i) : undefined;
        if (d === "remove") return null;
        const icon = d === "swap" ? icons[(icons.indexOf(it.icon) + 1 + i) % icons.length] === it.icon ? (extra as PlayIconKey) : icons[(icons.indexOf(it.icon) + 1 + i) % icons.length] : it.icon;
        const s = d === "size" ? it.s * 0.58 : it.s;
        return (
          <g key={i}>
            <Icon name={icon} x={PAD + it.x + (it.s - s) / 2} y={y + it.y + (it.s - s) / 2} size={s} />
            {d === "add" && <Icon name={extra} x={PAD + it.x + it.s - 6} y={y + it.y - 12} size={30} />}
          </g>
        );
      })}
    </g>
  );
  return (
    <g>
      <Instruction>{`🔍 ${digits(count)} تفاوت بین دو تصویر پیدا کن و دورش خط بکش.`}</Instruction>
      {panel(BODY_TOP + 18, false)}
      {panel(BODY_TOP + 18 + ph + 20, true)}
      <g>
        {Array.from({ length: count }, (_, k) => (
          <circle key={k} cx={W / 2 + (k - (count - 1) / 2) * 34} cy={BODY_TOP + 18 + ph * 2 + 48} r="12" fill="#fff" stroke={INK} strokeWidth="2" />
        ))}
      </g>
    </g>
  );
}

/* ───────────── ۸. نقاشی شطرنجی: کپی یا قرینه ───────────── */

function PixelGrid({ x, y, cell, rows, cols, fill, colLabels }: { x: number; y: number; cell: number; rows: number; cols: number; fill?: (r: number, c: number) => string | null; colLabels?: boolean }) {
  return (
    <g>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const f = fill?.(r, c);
          return <rect key={`${r}-${c}`} x={x + c * cell} y={y + r * cell} width={cell} height={cell} fill={f ?? "#fff"} stroke={f ? INK : "#bdb8d6"} strokeWidth={f ? 1.4 : 1} />;
        }),
      )}
      <rect x={x} y={y} width={cols * cell} height={rows * cell} fill="none" stroke={INK} strokeWidth="2.5" />
      {colLabels &&
        Array.from({ length: cols }, (_, c) => (
          <text key={c} x={x + c * cell + cell / 2} y={y - 6} textAnchor="middle" className="ws-t" fontSize="10" fontWeight="700" fill="#6e6893">
            {digits(c + 1)}
          </text>
        ))}
    </g>
  );
}

export function GridDrawing({ ws }: { ws: Worksheet }) {
  const pic = PIXEL_ART[str(ws.params.pic, "heart")] ?? PIXEL_ART.heart;
  const mirror = str(ws.params.mode, "copy") === "mirror" && pic.symmetric;
  const colorAt = (r: number, c: number) => {
    const ch = pic.rows[r]?.[c] as keyof typeof TONE_FILL | ".";
    return ch && ch !== "." ? TONE_FILL[ch] : null;
  };
  const used = [...new Set(pic.rows.join("").replace(/\./g, ""))] as (keyof typeof TONE_FILL)[];
  if (mirror) {
    const cell = 40;
    const gx = (W - cell * 10) / 2;
    const gy = BODY_TOP + 34;
    return (
      <g>
        <Instruction>🪞 نیمه‌ی دیگر تصویر را قرینه بکش و رنگ کن.</Instruction>
        <PixelGrid x={gx} y={gy} cell={cell} rows={10} cols={10} colLabels fill={(r, c) => (c >= 5 ? colorAt(r, c) : null)} />
        <line x1={gx + cell * 5} y1={gy - 16} x2={gx + cell * 5} y2={gy + cell * 10 + 16} stroke="#ff7a66" strokeWidth="3.5" strokeDasharray="8 6" />
        <Palette used={used} y={gy + cell * 10 + 52} />
      </g>
    );
  }
  const cell = 24;
  const gw = cell * 10;
  const gy = BODY_TOP + 70;
  return (
    <g>
      <Instruction>{`🎨 «${pic.title}» را خانه به خانه در جدول خالی بکش و رنگ کن.`}</Instruction>
      <text x={W - PAD - gw / 2} y={gy - 28} textAnchor="middle" className="ws-t" fontSize="15" fontWeight="800" fill="#6e6893">
        نمونه
      </text>
      <PixelGrid x={W - PAD - gw} y={gy} cell={cell} rows={10} cols={10} colLabels fill={colorAt} />
      <text x={PAD + gw / 2} y={gy - 28} textAnchor="middle" className="ws-t" fontSize="15" fontWeight="800" fill="#6e6893">
        نقاشی من
      </text>
      <PixelGrid x={PAD} y={gy} cell={cell} rows={10} cols={10} colLabels />
      <text x={W / 2} y={gy + gw + 56} textAnchor="middle" className="ws-t" fontSize="15" fontWeight="800" fill={INK}>
        رنگ‌هایی که لازم داری:
      </text>
      <Palette used={used} y={gy + gw + 92} />
      <rect x={PAD} y={gy + gw + 130} width={W - PAD * 2} height={BODY_BOTTOM - (gy + gw + 130)} rx="22" fill="#fffbf3" stroke="#eceaf6" strokeWidth="2" />
      <text x={W - PAD - 18} y={gy + gw + 160} className="ws-t" fontSize="14" fontWeight="700" fill="#6e6893">
        اینجا هر چه دوست داری کنارش بکش ✨
      </text>
    </g>
  );
}

function Palette({ used, y }: { used: (keyof typeof TONE_FILL)[]; y: number }) {
  const step = 44;
  const x0 = W / 2 + ((used.length - 1) * step) / 2;
  return (
    <g>
      {used.map((u, i) => (
        <circle key={u} cx={x0 - i * step} cy={y} r="14" fill={TONE_FILL[u]} stroke={INK} strokeWidth="2" />
      ))}
    </g>
  );
}

/* ───────────── ۹. ردگیری کلمه – هر کلمه: یک ردیف ردگیری + یک ردیف نوشتن ───────────── */
export function WordTrace({ ws }: { ws: Worksheet }) {
  const l = lang(ws);
  const from = num(ws.params.from, 0);
  const list: { word: string; icon: PlayIconKey }[] =
    l === "en" ? enLetters.slice(from, from + 6).map((x) => ({ word: x.word, icon: x.icon as PlayIconKey })) : faLetters.slice(from, from + 6).map((x) => ({ word: x.word, icon: x.icon as PlayIconKey }));
  const t = tones[ws.tone].hex;
  const blockH = (BODY_BOTTOM - BODY_TOP - 22) / 6;
  const iconW = 58;
  return (
    <g>
      <Instruction>✏️ کلمه را روی نقطه‌چین بنویس، بعد در خط پایین خودت بنویس.</Instruction>
      {list.map(({ word, icon }, r) => {
        const y = BODY_TOP + 18 + r * blockH;
        const iconX = l === "en" ? PAD : W - PAD - iconW + 6;
        return (
          <g key={word}>
            <Icon name={icon} x={iconX} y={y + 14} size={iconW - 10} />
            <TraceRows
              rows={[{ text: word, model: true }, { text: word, traced: 0 }]}
              y0={y + 4}
              rowH={blockH / 2}
              lineH={30}
              tone={t.mid}
              x1={l === "en" ? PAD + iconW : PAD}
              x2={l === "en" ? W - PAD : W - PAD - iconW}
            />
          </g>
        );
      })}
    </g>
  );
}

/* ───────────── ۱۰. اعضای بدن ───────────── */
const BODY_PARTS: { fa: string; en: string; x: number; y: number }[] = [
  { fa: "مو", en: "hair", x: 297, y: 246 },
  { fa: "چشم", en: "eye", x: 317, y: 296 },
  { fa: "گوش", en: "ear", x: 352, y: 306 },
  { fa: "بینی", en: "nose", x: 297, y: 314 },
  { fa: "دهان", en: "mouth", x: 297, y: 334 },
  { fa: "گردن", en: "neck", x: 297, y: 364 },
  { fa: "دست", en: "hand", x: 395, y: 512 },
  { fa: "شکم", en: "tummy", x: 297, y: 462 },
  { fa: "زانو", en: "knee", x: 321, y: 636 },
  { fa: "پا", en: "foot", x: 336, y: 712 },
];

function Kid({ t }: { t: { soft: string; mid: string; solid: string } }) {
  const limb = (x1: number, y1: number, x2: number, y2: number, c: string, w = 22) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={w + 5} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round" />
    </g>
  );
  const skin = "#ffd9b8";
  return (
    <g strokeLinejoin="round">
      {limb(275, 560, 268, 700, skin)}
      {limb(319, 560, 326, 700, skin)}
      <ellipse cx="260" cy="712" rx="28" ry="13" fill={t.solid} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="334" cy="712" rx="28" ry="13" fill={t.solid} stroke={INK} strokeWidth="2.5" />
      {limb(250, 392, 205, 498, t.mid)}
      {limb(344, 392, 389, 498, t.mid)}
      <circle cx="202" cy="512" r="15" fill={skin} stroke={INK} strokeWidth="2.5" />
      <circle cx="392" cy="512" r="15" fill={skin} stroke={INK} strokeWidth="2.5" />
      <rect x="252" y="515" width="90" height="56" rx="14" fill="#4fb8f5" stroke={INK} strokeWidth="2.5" />
      <rect x="244" y="374" width="106" height="152" rx="34" fill={t.mid} stroke={INK} strokeWidth="2.5" />
      <rect x="285" y="350" width="24" height="28" fill={skin} stroke={INK} strokeWidth="2.5" />
      <circle cx="243" cy="306" r="13" fill={skin} stroke={INK} strokeWidth="2.5" />
      <circle cx="351" cy="306" r="13" fill={skin} stroke={INK} strokeWidth="2.5" />
      <circle cx="297" cy="302" r="55" fill={skin} stroke={INK} strokeWidth="2.5" />
      <path d="M244 292 C 240 240, 300 228, 330 244 C 352 254, 354 276, 350 292 C 330 270, 300 262, 270 272 C 258 276, 250 284, 244 292 Z" fill="#7a4b2a" stroke={INK} strokeWidth="2.5" />
      <circle cx="277" cy="298" r="5" fill={INK} />
      <circle cx="317" cy="298" r="5" fill={INK} />
      <path d="M297 306 Q 303 316 296 318" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M283 330 Q 297 342 311 330" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="266" cy="318" r="7" fill="#ffb3c6" opacity="0.7" />
      <circle cx="328" cy="318" r="7" fill="#ffb3c6" opacity="0.7" />
    </g>
  );
}

export function BodyParts({ ws }: { ws: Worksheet }) {
  const l = lang(ws);
  const rand = seeded(num(ws.params.seed, 6));
  const t = tones[ws.tone].hex;
  const order = shuffle(BODY_PARTS, rand);
  const left = order.slice(0, 5);
  const right = order.slice(5);
  const rowY = (i: number) => BODY_TOP + 70 + i * 104;
  const label = (p: (typeof BODY_PARTS)[number], i: number, side: "l" | "r") => {
    const bx = side === "l" ? PAD : W - PAD - 110;
    const dotX = side === "l" ? bx + 124 : bx - 14;
    return (
      <g key={p.fa}>
        <rect x={bx} y={rowY(i) - 24} width="110" height="44" rx="14" fill={t.soft} stroke={INK} strokeWidth="2" />
        <text x={bx + 55} y={rowY(i) + 6} textAnchor="middle" direction={l === "en" ? "ltr" : undefined} className="ws-t" fontSize="20" fontWeight="900" fill={INK}>
          {l === "en" ? p.en : p.fa}
        </text>
        <circle cx={dotX} cy={rowY(i)} r="6" fill={INK} />
      </g>
    );
  };
  return (
    <g>
      <Instruction>🧒 هر کلمه را با یک خط به عضو درست بدن وصل کن.</Instruction>
      <Kid t={t} />
      {BODY_PARTS.map((p) => (
        <circle key={p.fa} cx={p.x} cy={p.y} r="5" fill="#ff7a66" stroke={INK} strokeWidth="1.5" />
      ))}
      {left.map((p, i) => label(p, i, "l"))}
      {right.map((p, i) => label(p, i, "r"))}
    </g>
  );
}
