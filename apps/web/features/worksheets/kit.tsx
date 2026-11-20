import { art, type PlayIconKey } from "@/components/brand/PlayIcon";

/** ابعاد و ابزارهای مشترک قالب‌های کاربرگ (A4 = 595×842 پوینت) */
export const W = 595;
export const H = 842;
export const INK = "#1f1a3d";
export const SOFT_INK = "#9a95b8";
export const PAD = 40;
export const BODY_TOP = 190;
export const BODY_BOTTOM = H - 60;

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
  return (
    <text x={W - PAD} y={BODY_TOP} className="ws-t" fontSize="16" fontWeight="700" fill={INK}>
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
