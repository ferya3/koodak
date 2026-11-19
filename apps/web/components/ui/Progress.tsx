import type { ToneKey } from "@kidsworld/types";
import { tones } from "@/lib/tones";
import { cn } from "@/lib/utils";

export function ProgressBar({ value, tone = "grass", className, label }: { value: number; tone?: ToneKey; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-4 w-full overflow-hidden rounded-full border-2 border-ink-900 bg-white", className)}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-500", tones[tone].solid)} style={{ width: `${v}%` }} />
    </div>
  );
}
