import Link from "next/link";
import type { Content } from "@kidsworld/types";
import { tones } from "@/lib/tones";
import { cn, ageRangeLabel, fa } from "@/lib/utils";
import { difficultyLabel, contentTypeLabel } from "@/lib/data/taxonomy";
import { Badge, PremiumBadge } from "@/components/ui/Badge";
import { WorksheetSheet } from "@/features/worksheets/WorksheetSheet";
import { GameCover } from "@/features/games/GameCover";
import { StoryScene } from "@/features/stories/StoryScene";

const hrefFor = (c: Content) =>
  c.type === "worksheet" ? `/worksheets/${c.slug}` : c.type === "game" ? `/games/${c.slug}` : `/stories/${c.slug}`;

/** کارت محتوای مشترک برای کاربرگ، بازی و قصه (سایت عمومی) */
export function ContentCard({ content, className }: { content: Content; className?: string }) {
  const t = tones[content.tone];
  return (
    <Link
      href={hrefFor(content)}
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border-2 border-ink-900 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className={cn("relative grid aspect-[4/3] place-items-center overflow-hidden border-b-2 border-ink-900", t.soft)}>
        {content.type === "worksheet" && (
          <WorksheetSheet worksheet={content} className="w-[62%] translate-y-6 rotate-[-3deg] rounded-md shadow-lift transition duration-300 group-hover:rotate-0" />
        )}
        {content.type === "game" && <GameCover game={content} className="h-full w-full" />}
        {content.type === "story" && <StoryScene scene={content.chapters[0].scene} className="h-full w-full" />}
        <div className="absolute right-3 top-3 flex gap-1.5">
          <Badge tone={content.tone} className="border border-ink-900/10 bg-white/90">
            {contentTypeLabel[content.type]}
          </Badge>
          {content.access === "premium" && <PremiumBadge />}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-extrabold leading-snug text-ink-900">{content.title}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-ink-500">{content.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2 text-xs font-bold text-ink-500">
          <span className="rounded-full bg-ink-50 px-2 py-1">{ageRangeLabel(content.minAge, content.maxAge)}</span>
          <span className="rounded-full bg-ink-50 px-2 py-1">{difficultyLabel[content.difficulty]}</span>
          <span className="rounded-full bg-ink-50 px-2 py-1">{fa(content.estimatedMinutes)} دقیقه</span>
        </div>
      </div>
    </Link>
  );
}
