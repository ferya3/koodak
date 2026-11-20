import type { ToneKey } from "@kidsworld/types";
import { tones } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { WorldIcon } from "@/components/brand/WorldIcon";

/** کاشی رنگی حاوی آیکون تصویرسازی‌شده – واحد پایه‌ی ناوبری تصویری */
export function IconTile({ icon, tone, className, iconClass = "h-10 w-10" }: { icon: string; tone: ToneKey; className?: string; iconClass?: string }) {
  return (
    <span
      className={cn("inline-grid place-items-center rounded-[1.25rem] shadow-soft ring-1 ring-ink-900/5", className ?? "h-16 w-16")}
      style={{ background: `linear-gradient(145deg, #fff, ${tones[tone].hex.soft} 55%, ${tones[tone].hex.mid})` }}
    >
      <WorldIcon name={icon} className={iconClass} />
    </span>
  );
}
