import type { Worksheet } from "@kidsworld/types";
import type { PlayIconKey } from "@/components/brand/PlayIcon";
import { iconThemes, type IconTheme } from "@/lib/data/alphabet";
import { tones } from "@/lib/tones";
import { seeded, shuffle } from "@/lib/utils";
import { AnswerBox, BODY_BOTTOM, BODY_TOP, digits, Icon, INK, Instruction, num, PAD, str, TraceRows, W, type TraceRow } from "../kit";

/* قالب‌های اعداد و ریاضی */

const FA_NAMES = ["صفر", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده"];
const EN_NAMES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const script = (ws: Worksheet) => (str(ws.params.script, "fa") === "en" ? "en" : "fa");
const themeIcons = (ws: Worksheet, fallback: IconTheme = "fruits") => (iconThemes[str(ws.params.theme, fallback) as IconTheme] ?? iconThemes[fallback]).icons as PlayIconKey[];

/* ── ۱. ردگیری عدد (۰ تا ۱۰) – فشرده: ۱۰ ردیف ── */
export function NumberTrace({ ws }: { ws: Worksheet }) {
  const n = num(ws.params.digit, 1);
  const sc = script(ws);
  const t = tones[ws.tone].hex;
  const icons = themeIcons(ws);
  const icon = icons[n % icons.length];
  const top = BODY_TOP - 10;
  const glyph = digits(n, sc);
  const rows: TraceRow[] = Array.from({ length: 10 }, (_, k) => ({ text: glyph, model: k % 5 === 0 }));
  return (
    <g>
      <rect x={PAD} y={top} width={W - PAD * 2} height="70" rx="16" fill={t.soft} stroke={INK} strokeWidth="1.4" />
      <text x={W - PAD - 46} y={top + 52} textAnchor="middle" direction="ltr" className="ws-t" fontSize="54" fontWeight="900" fill={INK}>
        {glyph}
      </text>
      <text x={W - PAD - 104} y={top + 42} textAnchor="middle" direction={sc === "en" ? "ltr" : undefined} className="ws-t" fontSize="16" fontWeight="800" fill="#6e6893">
        {sc === "en" ? EN_NAMES[n] : FA_NAMES[n]}
      </text>
      {/* n شیء برای شمردن */}
      {Array.from({ length: n }, (_, k) => (
        <Icon key={k} name={icon} x={W - PAD - 170 - (k % 10) * 32} y={top + 19} size={30} />
      ))}
      {n === 0 && (
        <text x={W / 2 - 40} y={top + 42} textAnchor="middle" className="ws-t" fontSize="15" fontWeight="700" fill="#6e6893">
          هیچ‌چیز! سبد خالی است.
        </text>
      )}
      <TraceRows rows={rows} y0={top + 86} rowH={56} lineH={38} tone={t.mid} rtl={sc === "fa"} />
    </g>
  );
}

/* ── ۲. عدد جاافتاده / شمارش چندتایی ── */
export function MissingNumber({ ws }: { ws: Worksheet }) {
  const sc = script(ws);
  const max = num(ws.params.max, 20);
  const step = num(ws.params.step, 1);
  const rand = seeded(num(ws.params.seed, 9));
  const rowsN = 10;
  const len = 7;
  const rowH = (BODY_BOTTOM - BODY_TOP - 24) / rowsN;
  const cell = (W - PAD * 2 - 20) / len;
  return (
    <g>
      <Instruction>{step === 1 ? "🔢 عددهای جاافتاده را بنویس." : `🔢 ${digits(step)} تا ${digits(step)} تا بشمار و عددهای جاافتاده را بنویس.`}</Instruction>
      {Array.from({ length: rowsN }, (_, r) => {
        const maxStart = Math.max(0, Math.floor((max - step * (len - 1)) / step));
        const start = step * (step === 1 ? 1 + Math.floor(rand() * Math.max(1, max - len)) : Math.floor(rand() * (maxStart + 1)));
        const blanks = new Set(shuffle([1, 2, 3, 4, 5, 6], rand).slice(0, 3));
        const y = BODY_TOP + 20 + r * rowH;
        return (
          <g key={r}>
            {Array.from({ length: len }, (_, k) => {
              const x = sc === "fa" ? W - PAD - 10 - cell * (k + 1) + 6 : PAD + 10 + cell * k + 6;
              return (
                <g key={k}>
                  <rect x={x} y={y} width={cell - 12} height={rowH - 16} rx={(rowH - 16) / 2} fill={blanks.has(k) ? "#fff" : "#ddf7e3"} stroke={INK} strokeWidth={blanks.has(k) ? 1.8 : 1.2} strokeDasharray={blanks.has(k) ? "5 4" : undefined} />
                  {!blanks.has(k) && (
                    <text x={x + (cell - 12) / 2} y={y + (rowH - 16) / 2 + 8} textAnchor="middle" direction="ltr" className="ws-t" fontSize="22" fontWeight="800" fill={INK}>
                      {digits(start + step * k, sc)}
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

/* ── ۳. تفریق با خط زدن ── */
export function Subtraction({ ws }: { ws: Worksheet }) {
  const max = num(ws.params.max, 10);
  const rand = seeded(num(ws.params.seed, 13));
  const sc = script(ws);
  const icons = themeIcons(ws);
  const rowsN = 8;
  const rowH = (BODY_BOTTOM - BODY_TOP - 24) / rowsN;
  return (
    <g>
      <Instruction>➖ تفریق کن. می‌توانی تصویرهایی را که کم می‌شوند خط بزنی.</Instruction>
      {Array.from({ length: rowsN }, (_, r) => {
        const a = 2 + Math.floor(rand() * (max - 1));
        const b = 1 + Math.floor(rand() * (a - 1));
        const y = BODY_TOP + 18 + r * rowH;
        const icon = icons[r % icons.length];
        const size = 24;
        return (
          <g key={r}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={rowH - 12} rx="18" fill="#fffbf3" stroke="#eceaf6" strokeWidth="2" />
            {a <= 12 &&
              Array.from({ length: a }, (_, k) => (
                <Icon key={k} name={icon} x={W - PAD - 12 - size - (k % 6) * (size + 3)} y={y + 6 + Math.floor(k / 6) * (size + 3)} size={size} />
              ))}
            <text x={PAD + 210} y={y + rowH / 2 + 4} textAnchor="end" direction="ltr" className="ws-t" fontSize="26" fontWeight="800" fill={INK}>
              {`${digits(a, sc)} − ${digits(b, sc)} =`}
            </text>
            <AnswerBox x={PAD + 12} y={y + rowH / 2 - 26} w={50} h={40} />
          </g>
        );
      })}
    </g>
  );
}

/* ── ۴. مقایسه: بزرگ‌تر، کوچک‌تر، مساوی ── */
export function Compare({ ws }: { ws: Worksheet }) {
  const max = num(ws.params.max, 10);
  const groups = str(ws.params.mode, "numbers") === "groups";
  const rand = seeded(num(ws.params.seed, 17));
  const sc = script(ws);
  const icons = themeIcons(ws, "animals");
  const rowsN = groups ? 9 : 11;
  const rowH = (BODY_BOTTOM - BODY_TOP - 30) / rowsN;
  return (
    <g>
      <Instruction>{groups ? "⚖️ کدام طرف بیشتر است؟ علامت > یا < یا = را در دایره بنویس." : "⚖️ علامت > یا < یا = را در دایره بنویس."}</Instruction>
      <text x={W / 2} y={BODY_TOP + 24} textAnchor="middle" direction="ltr" className="ws-t" fontSize="13" fill="#6e6893">
        {`${digits(5, sc)} > ${digits(3, sc)}   ·   ${digits(2, sc)} < ${digits(4, sc)}   ·   ${digits(3, sc)} = ${digits(3, sc)}`}
      </text>
      {Array.from({ length: rowsN }, (_, r) => {
        let a = 1 + Math.floor(rand() * max);
        let b = 1 + Math.floor(rand() * max);
        if (r === 3) b = a; // حداقل یک «مساوی»
        if (groups) {
          a = Math.min(a, 8);
          b = Math.min(b, 8);
        }
        const y = BODY_TOP + 26 + r * rowH;
        const icon = icons[r % icons.length];
        // چپ و راست در SVG: «a» سمت چپ، «b» سمت راست تا علامت ریاضی به همان ترتیب خوانده شود
        return (
          <g key={r}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={rowH - 12} rx="18" fill="#fffbf3" stroke="#eceaf6" strokeWidth="2" />
            {groups ? (
              <>
                {Array.from({ length: a }, (_, k) => <Icon key={`a${k}`} name={icon} x={PAD + 12 + (k % 4) * 27} y={y + 4 + Math.floor(k / 4) * 27} size={25} />)}
                {Array.from({ length: b }, (_, k) => <Icon key={`b${k}`} name={icon} x={W - PAD - 37 - (k % 4) * 27} y={y + 4 + Math.floor(k / 4) * 27} size={25} />)}
              </>
            ) : (
              <>
                <text x={W / 2 - 100} y={y + (rowH - 12) / 2 + 10} textAnchor="middle" direction="ltr" className="ws-t" fontSize="28" fontWeight="900" fill={INK}>{digits(a, sc)}</text>
                <text x={W / 2 + 100} y={y + (rowH - 12) / 2 + 10} textAnchor="middle" direction="ltr" className="ws-t" fontSize="28" fontWeight="900" fill={INK}>{digits(b, sc)}</text>
              </>
            )}
            <circle cx={W / 2} cy={y + (rowH - 12) / 2} r={Math.min(20, (rowH - 16) / 2)} fill="#fff" stroke={INK} strokeWidth="1.8" />
          </g>
        );
      })}
    </g>
  );
}

/* ── ۵. ساعت: خواندن زمان ── */
export function ClockFaces({ ws }: { ws: Worksheet }) {
  const mode = str(ws.params.mode, "hour"); // hour | half | quarter
  const rand = seeded(num(ws.params.seed, 23));
  const sc = script(ws);
  const minutesPool = mode === "hour" ? [0] : mode === "half" ? [0, 30] : [0, 15, 30, 45];
  const times = Array.from({ length: 9 }, () => ({ h: 1 + Math.floor(rand() * 12), m: minutesPool[Math.floor(rand() * minutesPool.length)] }));
  const r = 50;
  return (
    <g>
      <Instruction>🕒 ساعت چند است؟ زمان را زیر هر ساعت بنویس.</Instruction>
      {times.map(({ h, m }, k) => {
        const col = k % 3;
        const row = Math.floor(k / 3);
        const cx = W - PAD - (W - PAD * 2) / 6 - col * ((W - PAD * 2) / 3);
        const cy = BODY_TOP + 80 + row * ((BODY_BOTTOM - BODY_TOP - 40) / 3);
        const ha = ((h % 12) + m / 60) * 30 * (Math.PI / 180);
        const ma = m * 6 * (Math.PI / 180);
        return (
          <g key={k}>
            <circle cx={cx} cy={cy} r={r + 8} fill="#ddf3ff" stroke={INK} strokeWidth="3" />
            <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth="1.5" />
            {Array.from({ length: 12 }, (_, i) => {
              const ang = ((i + 1) * 30 * Math.PI) / 180;
              return (
                <text key={i} x={cx + Math.sin(ang) * (r - 13)} y={cy - Math.cos(ang) * (r - 13) + 5} textAnchor="middle" direction="ltr" className="ws-t" fontSize="13" fontWeight="800" fill={INK}>
                  {digits(i + 1, sc)}
                </text>
              );
            })}
            <line x1={cx} y1={cy} x2={cx + Math.sin(ha) * (r * 0.5)} y2={cy - Math.cos(ha) * (r * 0.5)} stroke="#ff7a66" strokeWidth="6" strokeLinecap="round" />
            <line x1={cx} y1={cy} x2={cx + Math.sin(ma) * (r * 0.78)} y2={cy - Math.cos(ma) * (r * 0.78)} stroke={INK} strokeWidth="4" strokeLinecap="round" />
            <circle cx={cx} cy={cy} r="5" fill={INK} />
            <rect x={cx - 48} y={cy + r + 16} width="96" height="34" rx="10" fill="#fff" stroke={INK} strokeWidth="1.6" />
            <text x={cx} y={cy + r + 40} textAnchor="middle" className="ws-t" fontSize="20" fontWeight="800" fill="#d9d6ea">
              :
            </text>
          </g>
        );
      })}
    </g>
  );
}
