import type { Worksheet } from "@kidsworld/types";
import { tones } from "@/lib/tones";
import { cn } from "@/lib/utils";

/** آدرس‌های کاربرگ آماده (از طریق BFF هم‌مبدأ؛ توکن والد با کوکی httpOnly فرستاده می‌شود) */
export const uploadUrls = (slug: string) => ({
  preview: `/api/v1/worksheets/${slug}/preview-image`,
  file: `/api/v1/worksheets/${slug}/file`,
  inline: `/api/v1/worksheets/${slug}/file?inline=1`,
});

export const isPdf = (w: Worksheet) => w.file?.mime === "application/pdf";

/**
 * پیش‌نمایش کاربرگ آماده (PDF/تصویر آپلودشده در پنل مدیریت) با همان نسبت A4 کاربرگ‌های تولیدی.
 * اگر تصویر پیش‌نمایش نباشد، یک جلد ساده با نوع فایل نشان داده می‌شود.
 */
export function UploadedSheet({ worksheet: w, className, id }: { worksheet: Worksheet; className?: string; id?: string }) {
  const t = tones[w.tone].hex;
  if (w.hasPreview) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- تصویر از API می‌آید و ابعادش متغیر است
      <img id={id} src={uploadUrls(w.slug).preview} alt={`پیش‌نمایش کاربرگ ${w.title}`} loading="lazy" className={cn("aspect-[595/842] bg-white object-cover object-top", className)} />
    );
  }
  return (
    <svg id={id} viewBox="0 0 595 842" className={className} role="img" aria-label={`کاربرگ ${w.title}`}>
      <rect width="595" height="842" fill="#fff" />
      <rect x="14" y="14" width="567" height="814" rx="28" fill="none" stroke={t.mid} strokeWidth="6" strokeDasharray="2 14" strokeLinecap="round" />
      <rect x="40" y="40" width="515" height="120" rx="24" fill={t.soft} stroke="#1f1a3d" strokeWidth="2.5" />
      <text x="530" y="112" textAnchor="start" direction="rtl" fontFamily="Vazirmatn, sans-serif" fontSize="30" fontWeight="900" fill="#1f1a3d">
        {w.title.length > 26 ? `${w.title.slice(0, 25)}…` : w.title}
      </text>
      <g transform="translate(197 260)">
        <path d="M0 0 H150 L200 50 V280 H0 Z" fill="#fff" stroke="#1f1a3d" strokeWidth="5" strokeLinejoin="round" />
        <path d="M150 0 V50 H200" fill={t.mid} stroke="#1f1a3d" strokeWidth="5" strokeLinejoin="round" />
        <rect x="30" y="170" width="140" height="60" rx="14" fill={t.solid} stroke="#1f1a3d" strokeWidth="4" />
        <text x="100" y="212" textAnchor="middle" fontFamily="sans-serif" fontSize="30" fontWeight="900" fill="#1f1a3d">
          {isPdf(w) ? "PDF" : "IMG"}
        </text>
        {[80, 105, 130].map((y) => (
          <line key={y} x1="30" y1={y} x2="170" y2={y} stroke="#d8d4ea" strokeWidth="8" strokeLinecap="round" />
        ))}
      </g>
      <text x="297" y="640" textAnchor="middle" direction="rtl" fontFamily="Vazirmatn, sans-serif" fontSize="22" fontWeight="700" fill="#6e6893">
        کاربرگ آماده‌ی چاپ
      </text>
    </svg>
  );
}
