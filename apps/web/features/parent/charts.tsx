"use client";
import { useState } from "react";
import { cn, fa } from "@/lib/utils";

/**
 * نمودارهای پنل والدین.
 * اصول: یک رنگ (Sequential تک‌تُن)، میله‌های باریک با سر گرد ۴px متصل به خط پایه،
 * گرید کم‌رنگ، Tooltip روی هر میله، و نمای جدولی برای دسترس‌پذیری.
 * هیچ‌کدام از نمودارها از پالت دسته‌ای استفاده نمی‌کنند؛ هویت با برچسب متنی منتقل می‌شود.
 */

const BAR = "#1fa396"; // ocean-500
const BAR_HOVER = "#0f625a"; // ocean-700
const LIMIT = "#f2553f"; // coral-500 – خط سقف مجاز

export function WeeklyBars({ values, labels, limit, unit = "دقیقه" }: { values: number[]; labels: string[]; limit?: number; unit?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const max = Math.max(...values, limit ?? 0) * 1.15;
  const W = 560;
  const H = 220;
  const padB = 28;
  const padT = 12;
  const plotH = H - padB - padT;
  const slot = W / values.length;
  const bw = Math.min(28, slot * 0.42);
  const y = (v: number) => padT + plotH - (v / max) * plotH;
  const ticks = [0, Math.round(max / 2 / 10) * 10, Math.round((max * 0.9) / 10) * 10];

  return (
    <div>
      {table ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-calm-500">
              <th className="py-1.5 text-start font-medium">روز</th>
              <th className="py-1.5 text-start font-medium">{unit}</th>
            </tr>
          </thead>
          <tbody>
            {values.map((v, i) => (
              <tr key={i} className="border-t border-calm-200">
                <td className="py-1.5">{labels[i]}</td>
                <td className="py-1.5 font-bold tabular-nums">{fa(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`زمان استفاده در هفت روز اخیر: ${values.map((v, i) => `${labels[i]} ${v} ${unit}`).join("، ")}`}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1="0" x2={W} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth="1" />
                <text x={W} y={y(t) - 4} textAnchor="end" fontSize="11" fill="#64748b" direction="ltr">
                  {fa(t)}
                </text>
              </g>
            ))}
            {limit !== undefined && (
              <g>
                <line x1="0" x2={W} y1={y(limit)} y2={y(limit)} stroke={LIMIT} strokeWidth="1.5" strokeDasharray="5 5" />
                <text x="4" y={y(limit) - 5} fontSize="11" fill="#a62e1c" fontWeight="700" textAnchor="end">
                  سقف روزانه {fa(limit)}
                </text>
              </g>
            )}
            {values.map((v, i) => {
              // RTL: روز اول سمت راست
              const cx = W - (i + 0.5) * slot;
              const top = y(v);
              const base = padT + plotH;
              const r = 4;
              return (
                <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} role="listitem" aria-label={`${labels[i]}: ${v} ${unit}`}>
                  <rect x={cx - slot / 2} y={padT} width={slot} height={plotH + padB} fill="transparent" />
                  <path
                    d={`M${cx - bw / 2} ${base} V${top + r} Q${cx - bw / 2} ${top} ${cx - bw / 2 + r} ${top} H${cx + bw / 2 - r} Q${cx + bw / 2} ${top} ${cx + bw / 2} ${top + r} V${base} Z`}
                    fill={hover === i ? BAR_HOVER : BAR}
                    opacity={hover === null || hover === i ? 1 : 0.55}
                  />
                  <text x={cx} y={H - 8} textAnchor="middle" fontSize="12" fill="#334155">
                    {labels[i]}
                  </text>
                </g>
              );
            })}
            <line x1="0" x2={W} y1={padT + plotH} y2={padT + plotH} stroke="#cbd5e1" />
          </svg>
          {hover !== null && (
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-calm-900 px-2.5 py-1.5 text-xs text-white shadow-calm"
              style={{ left: `${((W - (hover + 0.5) * slot) / W) * 100}%`, top: `${(y(values[hover]) / H) * 100}%` }}
            >
              <span className="block text-calm-300">{labels[hover]}</span>
              <span className="font-bold">
                {fa(values[hover])} {unit}
              </span>
            </div>
          )}
        </div>
      )}
      <button type="button" onClick={() => setTable((t) => !t)} className="mt-2 text-xs font-bold text-calm-500 underline-offset-4 hover:text-calm-900 hover:underline">
        {table ? "نمایش نمودار" : "نمایش به‌صورت جدول"}
      </button>
    </div>
  );
}

type Trend = "up" | "down" | "flat";
const trendBadge: Record<Trend, [string, string]> = {
  up: ["↑ رو به رشد", "bg-grass-100 text-grass-700"],
  down: ["↓ تمرین کمتر", "bg-coral-100 text-coral-700"],
  flat: ["→ ثابت", "bg-calm-100 text-calm-700"],
};

/** نمودار میله‌ای افقی تک‌رنگ با برچسب مستقیم (برای تفکیک نوع فعالیت و مهارت‌ها) */
export function BarList({ rows, max = 100 }: { rows: { label: string; value: number; hint?: string; trend?: Trend }[]; max?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <ul className="space-y-3.5">
      {rows.map((r, i) => (
        <li key={r.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-calm-900">{r.label}</span>
            <span className="flex items-center gap-2 text-calm-500">
              {hover === i && r.hint && <span className="hidden text-xs sm:inline">{r.hint}</span>}
              {r.trend && <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] font-bold", trendBadge[r.trend][1])}>{trendBadge[r.trend][0]}</span>}
              <span className="w-8 text-end font-bold tabular-nums text-calm-900">{fa(r.value)}</span>
            </span>
          </div>
          <div className="h-2.5 w-full rounded bg-calm-100" title={r.hint}>
            <div className="h-full rounded transition-[width,background-color] duration-500" style={{ width: `${(r.value / max) * 100}%`, backgroundColor: hover === i ? BAR_HOVER : BAR }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
