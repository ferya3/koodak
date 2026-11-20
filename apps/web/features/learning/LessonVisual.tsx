import type { LessonVisual as Visual } from "@kidsworld/types";
import { PlayIcon, playIconKeys, type PlayIconKey } from "@/components/brand/PlayIcon";
import { StoryScene } from "@/features/stories/StoryScene";
import { cn, fa } from "@/lib/utils";

const INK = "#1f1a3d";

/** شکل‌های پایه برای درس‌های هندسه (هم‌سبک با آیکون‌های بازی) */
function Shape({ name, className }: { name: string; className?: string }) {
  const S = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={{ circle: "دایره", square: "مربع", triangle: "مثلث", plus: "به‌علاوه" }[name] ?? name}>
      {name === "circle" && <circle cx="32" cy="32" r="24" fill="#ff7a66" {...S} />}
      {name === "square" && <rect x="9" y="9" width="46" height="46" rx="6" fill="#4fb8f5" {...S} />}
      {name === "triangle" && <path d="M32 7 L 58 55 L 6 55 Z" fill="#4fcb72" {...S} />}
      {name === "plus" && <path d="M32 14 V50 M14 32 H50" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
    </svg>
  );
}

function Icon({ name, className }: { name: string; className?: string }) {
  return playIconKeys.includes(name as PlayIconKey) ? <PlayIcon name={name as PlayIconKey} className={className} /> : <Shape name={name} className={className} />;
}

/** رندر تصویر هر گام درس از روی داده (بدون فایل تصویری) */
export function LessonVisual({ visual, size = "lg", className }: { visual: Visual; size?: "sm" | "md" | "lg"; className?: string }) {
  const icon = { sm: "h-8 w-8", md: "h-12 w-12", lg: "h-16 w-16 sm:h-24 sm:w-24" }[size];

  switch (visual.kind) {
    case "letter":
      return (
        <div className={cn("flex flex-col items-center", className)}>
          <span className={cn("font-display font-black leading-none text-ink-900", size === "lg" ? "text-[7rem] sm:text-[10rem]" : size === "md" ? "text-6xl" : "text-4xl")}>{visual.value}</span>
          {visual.word && size === "lg" && <span className="mt-2 rounded-full bg-white/80 px-4 py-1 font-display text-2xl font-black text-ink-700">{visual.word}</span>}
        </div>
      );
    case "number":
      return (
        <div className={cn("flex flex-col items-center gap-3", className)}>
          <span className={cn("font-display font-black leading-none", size === "lg" ? "text-8xl" : "text-5xl")}>{fa(visual.value)}</span>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: visual.value }, (_, i) => (
              <Icon key={i} name={visual.icon ?? "star"} className={cn(icon, "animate-pop")} />
            ))}
          </div>
        </div>
      );
    case "icons":
      return (
        <div className={cn("flex flex-wrap items-center justify-center gap-2 sm:gap-3", className)}>
          {visual.icons.map((n, i) => (
            <Icon key={i} name={n} className={n === "plus" ? (size === "lg" ? "h-10 w-10" : "h-6 w-6") : icon} />
          ))}
        </div>
      );
    case "forms":
      return (
        <div className={cn("flex flex-wrap items-center justify-center gap-3", className)} dir={visual.ltr ? "ltr" : "rtl"}>
          {visual.forms.map((f, i) => (
            <span key={i} className={cn("grid place-items-center rounded-2xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white font-display font-black leading-none", size === "lg" ? "h-24 min-w-24 px-3 text-6xl" : "h-14 min-w-14 px-2 text-3xl")}>
              {f}
            </span>
          ))}
        </div>
      );
    case "scene":
      return <StoryScene scene={visual.scene} className={cn("w-full rounded-3xl", size === "lg" ? "aspect-[16/9] max-w-xl" : "aspect-[4/3]", className)} />;
  }
}
