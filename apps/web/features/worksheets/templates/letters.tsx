import type { Worksheet } from "@kidsworld/types";
import { playIconNames, playIconNamesEn, type PlayIconKey } from "@/components/brand/PlayIcon";
import { enLetters, faForms, faLetters, iconThemes, type IconTheme } from "@/lib/data/alphabet";
import { tones } from "@/lib/tones";
import { PERSIAN_CENTERLINES } from "@/lib/handwriting/persian";
import { LATIN } from "@/lib/handwriting/latin";
import { seeded, shuffle } from "@/lib/utils";
import { AnswerBox, BODY_TOP, Icon, INK, Instruction, num, PAD, str, TraceRows, W, type TraceRow } from "../kit";

/* قالب‌های حروف الفبا – هر دو الفبای فارسی (راست‌به‌چپ) و انگلیسی (چپ‌به‌راست) */

type Alpha = "fa" | "en";
const alpha = (ws: Worksheet): Alpha => (str(ws.params.alphabet, "fa") === "en" ? "en" : "fa");
const letterOf = (a: Alpha, i: number) => (a === "fa" ? faLetters[i].char : enLetters[i].upper);
/** لنگر متنی که از x به سمت چپ ادامه پیدا کند (فارسی: start در rtl، انگلیسی: end در ltr) */
const leftward = (a: Alpha) => (a === "fa" ? "start" : "end");
const count = (a: Alpha) => (a === "fa" ? faLetters.length : enLetters.length);

/* ── ۱. ردگیری حرف با شکل‌ها و کلمه‌ی نمونه (فشرده برای چاپ به‌صرفه) ── */
export function LetterTrace({ ws }: { ws: Worksheet }) {
  const a = alpha(ws);
  const i = num(ws.params.index, 0);
  const t = tones[ws.tone].hex;
  const top = BODY_TOP - 10;
  const fa = a === "fa" ? faLetters[i] : null;
  const en = a === "en" ? enLetters[i] : null;
  const icon = (fa?.icon ?? en?.icon)!;
  const word = fa?.word ?? en?.word ?? "";
  // ۸ ردیف حرف: هر شکل دو بار (حروف دوشکلی هر شکل چهار بار؛ انگلیسی: بزرگ ×۴، کوچک ×۴)
  const forms = fa ? faForms(fa) : [en!.upper, en!.lower];
  const per = 8 / forms.length;
  const glyphRows: TraceRow[] = forms.flatMap((g) => Array.from({ length: per }, (_, k) => ({ text: g, model: k === 0 })));
  const y0 = top + 76;
  const rowH = 56;
  const wordRows: TraceRow[] = [{ text: word }, { text: word, traced: 1 }];

  return (
    <g>
      {/* کارت معرفی کوچک */}
      <rect x={PAD} y={top} width={W - PAD * 2} height="60" rx="16" fill={t.soft} stroke={INK} strokeWidth="1.4" />
      <text x={W - PAD - 44} y={top + 46} textAnchor="middle" className="ws-t" fontSize={en ? 40 : 50} fontWeight="900" fill={INK} direction={en ? "ltr" : undefined}>
        {fa ? fa.char : `${en!.upper}${en!.lower}`}
      </text>
      <Icon name={icon} x={W / 2 + 20} y={top + 6} size={48} />
      <text x={W / 2 + 6} y={top + 38} textAnchor={leftward(a)} className="ws-t" fontSize="20" fontWeight="800" fill={INK} direction={en ? "ltr" : undefined}>
        {word}
      </text>
      {fa && (
        <text x={PAD + 14} y={top + 38} textAnchor="start" direction="ltr" className="ws-t" fontSize="15" fontWeight="700" fill="#6e6893">
          {faForms(fa).slice().reverse().join("   ")}
        </text>
      )}
      <TraceRows rows={glyphRows} y0={y0} rowH={rowH} lineH={36} tone={t.mid} />
      <TraceRows rows={wordRows} y0={y0 + glyphRows.length * rowH} rowH={rowH} lineH={36} tone={t.mid} />
    </g>
  );
}

/* ── ۲. پیدا کن و دور بگیر ── */
export function FindLetter({ ws }: { ws: Worksheet }) {
  const a = alpha(ws);
  const i = num(ws.params.index, 0);
  const rand = seeded(num(ws.params.seed, i + 7));
  const target = letterOf(a, i);
  const cols = 7;
  const rowsN = 7;
  const total = cols * rowsN;
  const hits = new Set(shuffle(Array.from({ length: total }, (_, k) => k), rand).slice(0, 12));
  const others = Array.from({ length: count(a) }, (_, k) => letterOf(a, k)).filter((c) => c !== target);
  const cell = (W - PAD * 2) / cols;
  const t = tones[ws.tone].hex;
  return (
    <g>
      <Instruction>🔍 هر «{target}» را پیدا کن و دورش خط بکش. چندتا پیدا کردی؟</Instruction>
      {Array.from({ length: total }, (_, k) => {
        const row = Math.floor(k / cols);
        const col = k % cols;
        const x = a === "fa" ? W - PAD - cell * col - cell / 2 : PAD + cell * col + cell / 2;
        const y = BODY_TOP + 40 + row * 70;
        const ch = hits.has(k) ? target : others[Math.floor(rand() * others.length)];
        return (
          <g key={k}>
            <circle cx={x} cy={y + 24} r="28" fill={(row + col) % 2 ? "#fffbf3" : t.soft} />
            <text x={x} y={y + 38} textAnchor="middle" direction={a === "en" ? "ltr" : undefined} className="ws-t" fontSize="38" fontWeight="800" fill={INK}>
              {ch}
            </text>
          </g>
        );
      })}
      <text x={W - PAD} y={BODY_TOP + 40 + rowsN * 70 + 46} className="ws-t" fontSize="18" fontWeight="800" fill={INK}>
        تعداد «{target}»ها:
      </text>
      <AnswerBox x={W - PAD - 220} y={BODY_TOP + 40 + rowsN * 70 + 10} w={70} h={52} />
    </g>
  );
}

/* ── ۳. صدای اول: تصویر → حرف ── */
export function BeginningSound({ ws }: { ws: Worksheet }) {
  const a = alpha(ws);
  const from = num(ws.params.from, 0);
  const size = num(ws.params.size, 6);
  const rand = seeded(num(ws.params.seed, from + 11));
  const idx = Array.from({ length: size }, (_, k) => (from + k) % count(a));
  const rowH = 96;
  return (
    <g>
      <Instruction>🖍️ هر تصویر با کدام حرف شروع می‌شود؟ حرف درست را دور بگیر.</Instruction>
      {idx.map((li, k) => {
        const y = BODY_TOP + 24 + k * rowH;
        const correct = letterOf(a, li);
        const icon = a === "fa" ? faLetters[li].icon : enLetters[li].icon;
        const pool = shuffle(Array.from({ length: count(a) }, (_, j) => j).filter((j) => j !== li), rand).slice(0, 2).map((j) => letterOf(a, j));
        const options = shuffle([correct, ...pool], rand);
        return (
          <g key={k}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={rowH - 12} rx="18" fill="#fffbf3" stroke="#eceaf6" strokeWidth="2" />
            <Icon name={icon} x={W - PAD - 92} y={y + 6} size={72} />
            <text x={W - PAD - 106} y={y + 50} textAnchor={leftward(a)} className="ws-t" fontSize="16" fontWeight="700" fill="#6e6893" direction={a === "en" ? "ltr" : undefined}>
              {a === "fa" ? playIconNames[icon] : playIconNamesEn[icon]}
            </text>
            {options.map((o, j) => (
              <g key={j}>
                <circle cx={PAD + 60 + j * 90} cy={y + 42} r="32" fill="#fff" stroke={INK} strokeWidth="2.5" />
                <text x={PAD + 60 + j * 90} y={y + 57} textAnchor="middle" className="ws-t" fontSize="40" fontWeight="800" fill={INK} direction={a === "en" ? "ltr" : undefined}>
                  {a === "en" ? o.toLowerCase() : o}
                </text>
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
}

/* ── ۴. حرف جاافتاده ── */
export function MissingLetter({ ws }: { ws: Worksheet }) {
  const a = alpha(ws);
  const rand = seeded(num(ws.params.seed, 3));
  const rowsN = 7;
  const len = 6;
  const cell = (W - PAD * 2 - 20) / len;
  return (
    <g>
      <Instruction>✏️ حرف‌های جاافتاده را به ترتیب الفبا در خانه‌های خالی بنویس.</Instruction>
      {Array.from({ length: rowsN }, (_, r) => {
        const start = Math.floor(rand() * (count(a) - len));
        const blanks = new Set(shuffle([1, 2, 3, 4, 5], rand).slice(0, 2));
        const y = BODY_TOP + 30 + r * 82;
        return (
          <g key={r}>
            {Array.from({ length: len }, (_, k) => {
              const x = a === "fa" ? W - PAD - 10 - cell * (k + 1) + 6 : PAD + 10 + cell * k + 6;
              const ch = letterOf(a, start + k);
              return (
                <g key={k}>
                  <rect x={x} y={y} width={cell - 12} height="62" rx="14" fill={blanks.has(k) ? "#fff" : "#fff3c4"} stroke={INK} strokeWidth={blanks.has(k) ? 2.5 : 1.5} strokeDasharray={blanks.has(k) ? "6 5" : undefined} />
                  {!blanks.has(k) && (
                    <text x={x + (cell - 12) / 2} y={y + 46} textAnchor="middle" className="ws-t" fontSize="36" fontWeight="800" fill={INK} direction={a === "en" ? "ltr" : undefined}>
                      {ch}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

/* ── ۵. وصل کن: بزرگ↔کوچک (انگلیسی) یا حرف↔تصویر (فارسی) ── */
export function LetterMatch({ ws }: { ws: Worksheet }) {
  const a = alpha(ws);
  const from = num(ws.params.from, 0);
  const rand = seeded(num(ws.params.seed, from + 5));
  const idx = Array.from({ length: 6 }, (_, k) => (from + k) % count(a));
  const right = shuffle(idx, rand);
  const rowH = 96;
  return (
    <g>
      <Instruction>{a === "en" ? "🔗 هر حرف بزرگ را به حرف کوچکش وصل کن." : "🔗 هر حرف را به تصویری که با آن شروع می‌شود وصل کن."}</Instruction>
      {idx.map((li, k) => {
        const y = BODY_TOP + 30 + k * rowH;
        return (
          <g key={`l${k}`}>
            <rect x={W - PAD - 90} y={y} width="80" height="74" rx="16" fill="#fff3c4" stroke={INK} strokeWidth="2" />
            <text x={W - PAD - 50} y={y + 54} textAnchor="middle" className="ws-t" fontSize="44" fontWeight="900" fill={INK} direction={a === "en" ? "ltr" : undefined}>
              {letterOf(a, li)}
            </text>
            <circle cx={W - PAD - 110} cy={y + 37} r="7" fill={INK} />
          </g>
        );
      })}
      {right.map((li, k) => {
        const y = BODY_TOP + 30 + k * rowH;
        return (
          <g key={`r${k}`}>
            <circle cx={PAD + 110} cy={y + 37} r="7" fill={INK} />
            {a === "en" ? (
              <>
                <rect x={PAD + 10} y={y} width="80" height="74" rx="16" fill="#ddf3ff" stroke={INK} strokeWidth="2" />
                <text x={PAD + 50} y={y + 54} textAnchor="middle" direction="ltr" className="ws-t" fontSize="44" fontWeight="900" fill={INK}>
                  {enLetters[li].lower}
                </text>
              </>
            ) : (
              <Icon name={faLetters[li].icon} x={PAD + 14} y={y} size={74} />
            )}
          </g>
        );
      })}
    </g>
  );
}

/* ── ۶. جدول کلمات (Word Search) ── */
export function WordSearch({ ws }: { ws: Worksheet }) {
  const a = alpha(ws);
  const theme = str(ws.params.theme, "animals") as IconTheme;
  const rand = seeded(num(ws.params.seed, 21));
  const n = a === "fa" ? 9 : 10;
  const clean = (s: string) => s.replace(/[\s‌'-]/g, "");
  const icons = (iconThemes[theme]?.icons ?? iconThemes.animals.icons) as PlayIconKey[];
  const candidates = icons
    .map((ic) => ({ icon: ic, word: a === "fa" ? clean(playIconNames[ic]) : clean(playIconNamesEn[ic]).toUpperCase() }))
    .filter((w) => w.word.length >= 2 && w.word.length <= n);

  const grid: (string | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));
  const placed: typeof candidates = [];
  for (const w of shuffle(candidates, rand)) {
    if (placed.length >= 6) break;
    const letters = Array.from(w.word);
    for (let attempt = 0; attempt < 60; attempt++) {
      const vertical = rand() < 0.4;
      const r0 = Math.floor(rand() * (vertical ? n - letters.length + 1 : n));
      const c0 = Math.floor(rand() * (vertical ? n : n - letters.length + 1));
      const cells = letters.map((_, k) => (vertical ? [r0 + k, c0] : [r0, c0 + k]));
      if (cells.every(([r, c], k) => grid[r][c] === null || grid[r][c] === letters[k])) {
        cells.forEach(([r, c], k) => (grid[r][c] = letters[k]));
        placed.push(w);
        break;
      }
    }
  }
  const fill = a === "fa" ? faLetters.map((l) => l.char) : enLetters.map((l) => l.upper);
  const cell = Math.min(a === "en" ? 40 : 46, (W - PAD * 2 - 20) / n);
  const gridW = cell * n;
  const gx = (W - gridW) / 2;
  const gy = BODY_TOP + 20;
  return (
    <g>
      <Instruction>{a === "fa" ? "🔎 کلمه‌های پایین را در جدول پیدا کن (از راست به چپ یا از بالا به پایین)." : "🔎 کلمه‌های انگلیسی را در جدول پیدا کن (از چپ به راست یا از بالا به پایین)."}</Instruction>
      <rect x={gx - 10} y={gy - 10} width={gridW + 20} height={gridW + 20} rx="18" fill="#fffbf3" stroke={INK} strokeWidth="2" />
      {grid.map((row, r) =>
        row.map((ch, c) => {
          // فارسی: خانه‌ی صفرم در سمت راست تا کلمه‌ها از راست خوانده شوند
          const x = a === "fa" ? gx + gridW - cell * c - cell / 2 : gx + cell * c + cell / 2;
          return (
            <text key={`${r}-${c}`} x={x} y={gy + r * cell + cell * 0.72} textAnchor="middle" direction={a === "en" ? "ltr" : undefined} className="ws-t" fontSize={cell * 0.6} fontWeight="800" fill={INK}>
              {ch ?? fill[Math.floor(rand() * fill.length)]}
            </text>
          );
        }),
      )}
      {placed.map((w, k) => {
        // انگلیسی: کلمه‌های بلندتر → دو ستون
        const cols = a === "en" ? 2 : 3;
        const col = k % cols;
        const row = Math.floor(k / cols);
        const x = W - PAD - 20 - col * (a === "en" ? 260 : 175);
        const y = gy + gridW + 30 + row * (a === "en" ? 52 : 70);
        return (
          <g key={w.word}>
            <Icon name={w.icon} x={x - 48} y={y} size={a === "en" ? 44 : 52} />
            <text x={x - 58} y={y + 30} textAnchor={leftward(a)} direction={a === "en" ? "ltr" : undefined} className="ws-t" fontSize={a === "en" ? 17 : 20} fontWeight="800" fill={INK}>
              {a === "fa" ? playIconNames[w.icon] : w.word}
            </text>
          </g>
        );
      })}
    </g>
  );
}
