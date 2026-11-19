import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { stories } from "@/lib/data/content";
import { ageRangeLabel } from "@/lib/utils";
import { Container } from "@/components/ui/Section";
import { StoryReader } from "@/features/stories/StoryReader";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await api.story(slug);
  if (!s) return {};
  return { title: `${s.title} | قصه ${ageRangeLabel(s.minAge, s.maxAge)}`, description: s.description, alternates: { canonical: `/stories/${s.slug}` } };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await api.story(slug);
  if (!story) notFound();
  return (
    <Container className="max-w-5xl py-8">
      <nav aria-label="مسیر" className="mb-6 text-sm font-bold text-ink-500">
        <Link href="/" className="hover:text-ink-900">خانه</Link> / <Link href="/stories" className="hover:text-ink-900">قصه‌ها</Link> / <span className="text-ink-900">{story.title}</span>
      </nav>
      <h1 className="mb-5 text-3xl font-black sm:text-4xl">{story.title}</h1>
      <StoryReader story={story} />
    </Container>
  );
}
