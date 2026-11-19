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
      <Link href="/kids/home" className="inline-flex h-12 items-center gap-2 rounded-2xl border-[3px] border-ink-900 bg-white px-4 text-lg font-black btn-3d [--btn-edge:var(--color-ink-900)]">
        → برگشت
      </Link>
      <StoryReader story={story} />
    </div>
  );
}
