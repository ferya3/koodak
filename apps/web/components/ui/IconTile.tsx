import type { ToneKey } from "@kidsworld/types";
import { tones } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { WorldIcon } from "@/components/brand/WorldIcon";

/** کاشی رنگی حاوی آیکون تصویرسازی‌شده – واحد پایه‌ی ناوبری تصویری */
export function IconTile({ icon, tone, className, iconClass = "h-10 w-10" }: { icon: string; tone: ToneKey; className?: string; iconClass?: string }) {
  return (
    <span className={cn("inline-grid place-items-center rounded-2xl border-2 border-ink-900", tones[tone].soft, className ?? "h-16 w-16")}>
      <WorldIcon name={icon} className={iconClass} />
    </span>
  );
}
