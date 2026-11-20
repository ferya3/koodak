import type { ToneKey } from "@kidsworld/types";
import { tones } from "@/lib/tones";
import { cn } from "@/lib/utils";

export function Badge({ tone = "sun", className, children }: { tone?: ToneKey; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", tones[tone].soft, tones[tone].text, className)}>
      {children}
    </span>
  );
}

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-gradient-to-l from-sun-400 to-peach-400 px-2.5 py-1 text-xs font-extrabold text-ink-900 shadow-soft", className)}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M3 8 L 7 12 L 12 5 L 17 12 L 21 8 L 19 19 L 5 19 Z" fill="currentColor" />
      </svg>
      ویژه
    </span>
  );
}

/** Chip قابل انتخاب برای فیلترها */
export function Chip({
  active,
  className,
  children,
  ...props
}: { active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition",
        active ? "bg-ink-900 text-white shadow-soft" : "bg-white text-ink-700 ring-1 ring-ink-900/10 hover:bg-ink-50 hover:ring-ink-900/20",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
