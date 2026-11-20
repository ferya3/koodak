import { art, type PlayIconKey } from "@/components/brand/PlayIcon";
import { isLatinText, LATIN, LATIN_GAP, LATIN_SPACE, strokeStarts } from "@/lib/handwriting/latin";
import { PERSIAN_CENTERLINES } from "@/lib/handwriting/persian";

/** ابعاد و ابزارهای مشترک قالب‌های کاربرگ (A4 = 595×842 پوینت) */
export const W = 595;
export const H = 842;
export const INK = "#1f1a3d";
export const SOFT_INK = "#9a95b8";
/** حاشیه‌ی کم و سربرگ جمع‌وجور تا بیشترِ برگه‌ی A4 صرف تمرین شود (به‌صرفه برای چاپ) */
export const PAD = 28;
export const BODY_TOP = 134;
export const BODY_BOTTOM = H - 36;

export function Icon({ name, x, y, size, outline = false }: { name: PlayIconKey; x: number; y: number; size: number; outline?: boolean }) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 64 64">
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" className={outline ? "ws-outline" : undefined}>
        {art[name]}
      </g>
    </svg>
  );
}

/** خط دستورالعمل بالای بدنه‌ی کاربرگ */
export function Instruction({ children }: { children: React.ReactNode }) {
  // متن بلند کوچک‌تر می‌شود تا از کادر بیرون نزند (~۶۸ نویسه در اندازه‌ی ۱۶ با Vazirmatn)
  const len = typeof children === "string" ? children.length : 0;
  const size = len > 76 ? Math.max(11, (14 * 76) / len) : 14;
  return (
    <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize={size} fontWeight="700" fill={INK}>
      {children}
    </text>
  );
}

/** متن خط‌چین برای ردگیری */
export function TraceText({ x, y, size, children, anchor = "middle", ltr = false, solid = false }: { x: number; y: number; size: number; children: React.ReactNode; anchor?: "start" | "middle" | "end"; ltr?: boolean; solid?: boolean }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      direction={ltr ? "ltr" : undefined}
      className="ws-t"
      fontSize={size}
      fontWeight="800"
      fill={solid ? INK : "none"}
      stroke={solid ? "none" : SOFT_INK}
      strokeWidth={solid ? 0 : 2}
      strokeDasharray={solid ? undefined : "5 5"}
    >
      {children}
    </text>
  );
}

/** سه خط راهنمای نوشتن (بالا، وسط خط‌چین، کف) */
export function WritingLines({ y, height, tone }: { y: number; height: number; tone: string }) {
  return (
    <g>
      <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#eceaf6" strokeWidth="2" />
      <line x1={PAD} y1={y + height / 2} x2={W - PAD} y2={y + height / 2} stroke="#eceaf6" strokeWidth="1.5" strokeDasharray="6 6" />
      <line x1={PAD} y1={y + height} x2={W - PAD} y2={y + height} stroke={tone} strokeWidth="2.5" />
    </g>
  );
}

export function AnswerBox({ x, y, w = 58, h = 52 }: { x: number; y: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="12" fill="#fff" stroke={INK} strokeWidth="2.5" />;
}

/** ارقام فارسی یا انگلیسی */
export const digits = (n: number | string, script: "fa" | "en" = "fa") =>
  script === "en" ? String(n) : String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/** پارامترهای کاربرگ */
export const num = (v: unknown, d: number) => (v === undefined || v === null || v === "" ? d : Number(v));
export const str = (v: unknown, d: string) => (v === undefined || v === null || v === "" ? d : String(v));

/**
 * حرف/کلمه‌ی «تک‌خطی» برای ردگیری: یک خط نقطه‌چین روی مسیر نوشتن (نه دور شکل حرف).
 * - انگلیسی و ارقام لاتین: حروف دست‌طراحی‌شده‌ی تحریری استاندارد با نقطه‌ی شروع هر ضربه
 * - فارسی: خط مرکزی استخراج‌شده از Vazirmatn
 * y = خط کرسی. size برای فارسی = اندازه‌ی فونت؛ برای انگلیسی ارتفاع حرف بزرگ = size × ۰٫۷
 * اگر برای متنی خط مرکزی موجود نباشد، به ردگیری قدیمی (دور حرف) برمی‌گردد.
 */
export function TraceGlyphs({ text, x, y, size, anchor = "middle", solid = false, maxWidth, startDots = true }: { text: string; x: number; y: number; size: number; anchor?: "start" | "middle" | "end"; solid?: boolean; maxWidth?: number; startDots?: boolean }) {
  const latin = isLatinText(text);
  const fa = latin ? null : PERSIAN_CENTERLINES[text];
  if (!latin && !fa) {
    // تخمین پهنا (~۰٫۶ em برای هر نویسه) تا متن جایگزین هم از maxWidth بیرون نزند
    const fit = maxWidth ? Math.min(size, maxWidth / Math.max(1, text.length * 0.6)) : size;
    return (
      <TraceText x={x} y={y - 4} size={fit} anchor={anchor} solid={solid}>
        {text}
      </TraceText>
    );
  }
  // اجزا: [مسیر، نقطه‌ها، جابه‌جایی افقی] در واحد طراحی
  const parts: { d: string; dots: [number, number][]; dx: number; dy: number }[] = [];
  let width = 0;
  let unit: number;
  if (latin) {
    unit = (size * 0.7) / 100;
    for (const ch of text) {
      if (ch === " ") {
        width += LATIN_SPACE;
        continue;
      }
      const g = LATIN[ch];
      if (!g) continue;
      parts.push({ d: g.d, dots: g.dots ?? [], dx: width, dy: -100 });
      width += g.w + LATIN_GAP;
    }
    width -= LATIN_GAP;
  } else {
    unit = size / 100;
    parts.push({ d: fa!.d, dots: fa!.dots, dx: 0, dy: 0 });
    width = fa!.w;
  }
  if (maxWidth && width * unit > maxWidth) unit = maxWidth / width;
  const px = width * unit;
  // «start» در متن راست‌به‌چپ = لبه‌ی راست
  const left = anchor === "middle" ? x - px / 2 : (anchor === "start") === latin ? x : x - px;
  const scaleK = unit / (latin ? (size * 0.7) / 100 : size / 100); // کوچک‌شدن به‌خاطر maxWidth
  const lineW = Math.max(1.8, size * scaleK * (solid ? 0.065 : 0.042)) / unit;
  const dotGap = Math.max(4.2, size * scaleK * 0.07) / unit;
  /** نقطه‌ی حروف فارسی درشت‌تر از ضخامت خط (مثل نقطه‌ی واقعی Vazirmatn) */
  const nukta = (latin ? lineW * 0.9 : Math.max(2.4, size * scaleK * 0.045) / unit) * (solid ? 1.05 : 1);
  // نقطه‌چینِ ردگیری کمی پررنگ‌تر از خطوط راهنما تا در چاپ سیاه‌وسفید هم دیده شود
  const ink = solid ? INK : "#7d77a3";
  return (
    <g transform={`translate(${left} ${y}) scale(${unit})`}>
      {parts.map((p, i) => (
        <g key={i} transform={`translate(${p.dx} ${p.dy})`}>
          <path d={p.d} fill="none" stroke={ink} strokeWidth={lineW} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={solid ? undefined : `0 ${dotGap}`} />
          {p.dots.map(([dx, dy], k) => (
            <circle key={k} cx={dx} cy={dy} r={nukta} fill={ink} />
          ))}
          {latin && !solid && startDots &&
            strokeStarts(p.d).map(([sx, sy], k) => <circle key={`s${k}`} cx={sx} cy={sy} r={lineW * 1.25} fill="#4fcb72" />)}
        </g>
      ))}
    </g>
  );
}

/** سه خط راهنمای نوشتن بین x1 و x2: بالا، وسط (خط‌چین)، کرسی (رنگی) */
export function GuideLines({ x1 = PAD, x2 = W - PAD, y, h, tone }: { x1?: number; x2?: number; y: number; h: number; tone: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#e4e1f1" strokeWidth="1.2" />
      <line x1={x1} y1={y + h / 2} x2={x2} y2={y + h / 2} stroke="#e4e1f1" strokeWidth="1" strokeDasharray="4 4" />
      <line x1={x1} y1={y + h} x2={x2} y2={y + h} stroke={tone} strokeWidth="1.6" />
    </g>
  );
}

/** پهنای تقریبی یک متن ردگیری در اندازه‌ی داده‌شده */
export function traceWidth(text: string, size: number) {
  if (isLatinText(text)) {
    const u = (size * 0.7) / 100;
    return [...text].reduce((w, ch) => w + (ch === " " ? LATIN_SPACE : (LATIN[ch]?.w ?? 60) + LATIN_GAP), -LATIN_GAP) * u;
  }
  const g = PERSIAN_CENTERLINES[text];
  return g ? (g.w * size) / 100 : text.length * size * 0.55;
}

/** اندازه‌ی فونت ردگیری برای ارتفاع خط h: لاتین = ارتفاع حرف بزرگ؛ فارسی کمی بزرگ‌تر (کرسی تا سرِ الف) */
export const traceSize = (text: string, h: number) => (isLatinText(text) ? h / 0.7 : h * 1.22);

export interface TraceRow {
  text: string;
  /** اولین نمونه‌ی ردیف پررنگ (الگو) باشد */
  model?: boolean;
  /** فقط این تعداد ردگیری؛ بقیه‌ی ردیف خالی برای نوشتن آزاد */
  traced?: number;
}

/**
 * ردیف‌های فشرده‌ی ردگیری: هر ردیف تا جایی که جا دارد تکرار می‌شود (حداکثر ۱۰).
 * فارسی از راست، انگلیسی و ارقام لاتین از چپ.
 */
export function TraceRows({ rows, y0, rowH = 56, lineH = 36, tone, x1 = PAD, x2 = W - PAD, rtl }: { rows: TraceRow[]; y0: number; rowH?: number; lineH?: number; tone: string; x1?: number; x2?: number; rtl?: boolean }) {
  return (
    <g>
      {rows.map((r, i) => {
        const y = y0 + i * rowH;
        const size = traceSize(r.text, lineH);
        const fromRight = rtl ?? !isLatinText(r.text);
        const avail = x2 - x1 - 16;
        const gw = traceWidth(r.text, size);
        const n = Math.max(1, Math.min(10, Math.floor(avail / (gw + 22))));
        const step = avail / n;
        return (
          <g key={i}>
            <GuideLines x1={x1} x2={x2} y={y} h={lineH} tone={tone} />
            {Array.from({ length: Math.min(n, r.traced ?? n) }, (_, k) => {
              const cx = fromRight ? x2 - 8 - step * k - step / 2 : x1 + 8 + step * k + step / 2;
              return <TraceGlyphs key={k} text={r.text} x={cx} y={y + lineH} size={size} solid={!!r.model && k === 0} maxWidth={step - 6} />;
            })}
          </g>
        );
      })}
    </g>
  );
}
