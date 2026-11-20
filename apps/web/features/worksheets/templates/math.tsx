import type { Worksheet } from "@kidsworld/types";
import type { PlayIconKey } from "@/components/brand/PlayIcon";
import { iconThemes, type IconTheme } from "@/lib/data/alphabet";
import { tones } from "@/lib/tones";
import { seeded, shuffle } from "@/lib/utils";
import { AnswerBox, BODY_TOP, digits, Icon, INK, Instruction, num, PAD, str, TraceText, W, WritingLines } from "../kit";

/* قالب‌های اعداد و ریاضی */

const FA_NAMES = ["صفر", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده"];
const EN_NAMES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const script = (ws: Worksheet) => (str(ws.params.script, "fa") === "en" ? "en" : "fa");
const themeIcons = (ws: Worksheet, fallback: IconTheme = "fruits") => (iconThemes[str(ws.params.theme, fallback) as IconTheme] ?? iconThemes[fallback]).icons as PlayIconKey[];

/* ── ۱. ردگیری عدد (۰ تا ۱۰) ── */
export function NumberTrace({ ws }: { ws: Worksheet }) {
  const n = num(ws.params.digit, 1);
  const sc = script(ws);
  const t = tones[ws.tone].hex;
  const icon = themeIcons(ws)[n % themeIcons(ws).length];
  const top = BODY_TOP + 10;
  const glyph = digits(n, sc);
  return (
    <g>
      <rect x={PAD} y={top - 20} width={W - PAD * 2} height="150" rx="22" fill={t.soft} stroke={INK} strokeWidth="2" />
      <text x={W - PAD - 70} y={top + 92} textAnchor="middle" direction="ltr" className="ws-t" fontSize="120" fontWeight="900" fill={INK}>
        {glyph}
      </text>
      <text x={W - PAD - 70} y={top + 122} textAnchor="middle" direction={sc === "en" ? "ltr" : undefined} className="ws-t" fontSize="20" fontWeight="800" fill="#6e6893">
        {sc === "en" ? EN_NAMES[n] : FA_NAMES[n]}
      </text>
      {/* n شیء برای شمردن */}
      {Array.from({ length: n }, (_, k) => {
        const perRow = 5;
        const x = W - PAD - 170 - (k % perRow) * 62;
        const y = top - 6 + Math.floor(k / perRow) * 64;
        return <Icon key={k} name={icon} x={x - 54} y={y} size={54} />;
      })}
      {n === 0 && (
        <text x={W / 2 - 40} y={top + 70} textAnchor="middle" className="ws-t" fontSize="18" fontWeight="700" fill="#6e6893">
          هیچ‌چیز! سبد خالی است.
        </text>
      )}
      {Array.from({ length: 4 }, (_, ri) => {
        const y = top + 170 + ri * 100;
        const per = 7;
        const step = (W - PAD * 2 - 40) / per;
        return (
          <g key={ri}>
            <WritingLines y={y} height={72} tone={t.mid} />
            {Array.from({ length: per }, (_, k) => (
              <TraceText key={k} x={(sc === "fa" ? W - PAD - 30 - step * k - step / 2 : PAD + 30 + step * k + step / 2)} y={y + 66} size={72} ltr solid={ri === 0 && k === 0}>
                {glyph}
              </TraceText>
            ))}
          </g>
        );
      })}
    </g>
  );
}

/* ── ۲. عدد جاافتاده / شمارش چندتایی ── */
export function MissingNumber({ ws }: { ws: Worksheet }) {
  const sc = script(ws);
  const max = num(ws.params.max, 20);
  const step = num(ws.params.step, 1);
  const rand = seeded(num(ws.params.seed, 9));
  const rowsN = 7;
  const len = 6;
  const cell = (W - PAD * 2 - 20) / len;
  return (
    <g>
      <Instruction>{step === 1 ? "🔢 عددهای جاافتاده را بنویس." : `🔢 ${digits(step)} تا ${digits(step)} تا بشمار و عددهای جاافتاده را بنویس.`}</Instruction>
      {Array.from({ length: rowsN }, (_, r) => {
        const maxStart = Math.max(0, Math.floor((max - step * (len - 1)) / step));
        const start = step * (step === 1 ? 1 + Math.floor(rand() * Math.max(1, max - len)) : Math.floor(rand() * (maxStart + 1)));
        const blanks = new Set(shuffle([1, 2, 3, 4, 5], rand).slice(0, 2));
        const y = BODY_TOP + 30 + r * 82;
        return (
          <g key={r}>
            {Array.from({ length: len }, (_, k) => {
              const x = sc === "fa" ? W - PAD - 10 - cell * (k + 1) + 6 : PAD + 10 + cell * k + 6;
              return (
                <g key={k}>
                  <rect x={x} y={y} width={cell - 12} height="62" rx="31" fill={blanks.has(k) ? "#fff" : "#ddf7e3"} stroke={INK} strokeWidth={blanks.has(k) ? 2.5 : 1.5} strokeDasharray={blanks.has(k) ? "6 5" : undefined} />
                  {!blanks.has(k) && (
                    <text x={x + (cell - 12) / 2} y={y + 44} textAnchor="middle" direction="ltr" className="ws-t" fontSize="30" fontWeight="800" fill={INK}>
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
  const rowsN = 6;
  const rowH = 96;
  return (
    <g>
      <Instruction>➖ تفریق کن. می‌توانی تصویرهایی را که کم می‌شوند خط بزنی.</Instruction>
      {Array.from({ length: rowsN }, (_, r) => {
        const a = 2 + Math.floor(rand() * (max - 1));
        const b = 1 + Math.floor(rand() * (a - 1));
        const y = BODY_TOP + 30 + r * rowH;
        const icon = icons[r % icons.length];
        const size = a > 8 ? 26 : 32;
        return (
          <g key={r}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={rowH - 12} rx="18" fill="#fffbf3" stroke="#eceaf6" strokeWidth="2" />
            {a <= 12 &&
              Array.from({ length: a }, (_, k) => (
                <Icon key={k} name={icon} x={W - PAD - 16 - size - (k % 6) * (size + 4)} y={y + 6 + Math.floor(k / 6) * (size + 4)} size={size} />
              ))}
            <text x={PAD + 250} y={y + 54} textAnchor="end" direction="ltr" className="ws-t" fontSize="34" fontWeight="800" fill={INK}>
              {`${digits(a, sc)} − ${digits(b, sc)} =`}
            </text>
            <AnswerBox x={PAD + 14} y={y + 16} />
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
  const rowsN = 7;
  const rowH = 82;
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
        const y = BODY_TOP + 40 + r * rowH;
        const icon = icons[r % icons.length];
        // چپ و راست در SVG: «a» سمت چپ، «b» سمت راست تا علامت ریاضی به همان ترتیب خوانده شود
        return (
          <g key={r}>
            <rect x={PAD} y={y} width={W - PAD * 2} height={rowH - 12} rx="18" fill="#fffbf3" stroke="#eceaf6" strokeWidth="2" />
            {groups ? (
              <>
                {Array.from({ length: a }, (_, k) => <Icon key={`a${k}`} name={icon} x={PAD + 12 + (k % 4) * 30} y={y + 4 + Math.floor(k / 4) * 30} size={28} />)}
                {Array.from({ length: b }, (_, k) => <Icon key={`b${k}`} name={icon} x={W - PAD - 40 - (k % 4) * 30} y={y + 4 + Math.floor(k / 4) * 30} size={28} />)}
              </>
            ) : (
              <>
                <text x={W / 2 - 110} y={y + 50} textAnchor="middle" direction="ltr" className="ws-t" fontSize="40" fontWeight="900" fill={INK}>{digits(a, sc)}</text>
                <text x={W / 2 + 110} y={y + 50} textAnchor="middle" direction="ltr" className="ws-t" fontSize="40" fontWeight="900" fill={INK}>{digits(b, sc)}</text>
              </>
            )}
            <circle cx={W / 2} cy={y + 35} r="26" fill="#fff" stroke={INK} strokeWidth="2.5" />
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
  const times = Array.from({ length: 6 }, () => ({ h: 1 + Math.floor(rand() * 12), m: minutesPool[Math.floor(rand() * minutesPool.length)] }));
  const r = 56;
  return (
    <g>
      <Instruction>🕒 ساعت چند است؟ زمان را زیر هر ساعت بنویس.</Instruction>
      {times.map(({ h, m }, k) => {
        const col = k % 2;
        const row = Math.floor(k / 2);
        const cx = col === 0 ? W - PAD - 125 : PAD + 125;
        const cy = BODY_TOP + 90 + row * 192;
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
            <rect x={cx - 56} y={cy + r + 18} width="112" height="40" rx="12" fill="#fff" stroke={INK} strokeWidth="2" />
            <text x={cx} y={cy + r + 45} textAnchor="middle" className="ws-t" fontSize="22" fontWeight="800" fill="#d9d6ea">
              :
            </text>
          </g>
        );
      })}
    </g>
  );
}
