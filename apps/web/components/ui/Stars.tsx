import { cn } from "@/lib/utils";

/** نمایش ۰ تا ۳ ستاره – بازخورد اصلی نتیجه‌ی بازی برای کودک */
export function Stars({ value, max = 3, className, size = "h-6 w-6" }: { value: number; max?: number; className?: string; size?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value} از ${max} ستاره`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={size} aria-hidden="true">
          <path
            d="M12 2.5 L 14.8 8.6 L 21.5 9.3 L 16.5 13.8 L 17.9 20.4 L 12 17 L 6.1 20.4 L 7.5 13.8 L 2.5 9.3 L 9.2 8.6 Z"
            fill={i < value ? "#ffce3d" : "#eceaf6"}
            stroke={i < value ? "#1f1a3d" : "#b9b4d3"}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}
