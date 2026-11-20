import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { stories } from "@/lib/data/content";
import { StoryReader } from "@/features/stories/StoryReader";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export default async function KidsStory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await api.story(slug);
  if (!story) notFound();
  return (
    <div className="space-y-4">
      <Link href="/kids/home" className="inline-flex h-12 items-center gap-2 rounded-2xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white px-4 text-lg font-black btn-3d [--btn-edge:var(--color-ink-200)]">
        → برگشت
      </Link>
      <StoryReader story={story} />
    </div>
  );
}
