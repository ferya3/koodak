"use client";
import { cn } from "@/lib/utils";

/** کاشی انتخاب درشت و سه‌بعدی؛ فقط یک کلاس پس‌زمینه در هر حالت */
export function ChoiceTile({ state, className, children, ...props }: { state?: "idle" | "right" | "wrong" | "dim" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "grid place-items-center rounded-3xl border-[3px] border-ink-900 font-display font-black btn-3d [--btn-edge:var(--color-ink-900)] transition",
        state === "right" ? "bg-grass-300" : state === "wrong" ? "animate-shake bg-coral-100" : state === "dim" ? "bg-white opacity-40" : "bg-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** منطق مشترک بازی‌های راندی: انتخاب درست → دور بعد، انتخاب غلط → لرزش */
export function nextRound(opts: { round: number; rounds: number; setRound: (n: number) => void; complete: () => void; progress: (v: number) => void; after?: () => void }) {
  setTimeout(() => {
    opts.after?.();
    if (opts.round + 1 >= opts.rounds) opts.complete();
    else {
      opts.setRound(opts.round + 1);
      opts.progress((opts.round + 1) / opts.rounds);
    }
  }, 850);
}
