import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { lessons } from "@/lib/data/lessons";
import { ageRangeLabel, fa } from "@/lib/utils";
import { Container } from "@/components/ui/Section";
import { LessonPlayer } from "@/features/learning/LessonPlayer";

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = await api.lesson(slug);
  if (!l) return {};
  return { title: `${l.title} | درس ${ageRangeLabel(l.minAge, l.maxAge)}`, description: l.description, alternates: { canonical: `/learn/${l.slug}` } };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await api.lesson(slug);
  if (!lesson) notFound();
  const [{ data: all }, names] = await Promise.all([api.lessons(), api.lookups()]);
  const prerequisites = all.filter((l) => lesson.prerequisiteIds.includes(l.id));

  return (
    <Container className="max-w-5xl py-8">
      <nav aria-label="مسیر" className="mb-6 text-sm font-bold text-ink-500">
        <Link href="/" className="hover:text-ink-900">خانه</Link> / <Link href="/learn" className="hover:text-ink-900">آکادمی یادگیری</Link> / <span className="text-ink-900">{lesson.title}</span>
      </nav>
      {prerequisites.length > 0 && (
        <p className="mb-4 rounded-2xl bg-sun-100 p-3 text-sm font-bold text-sun-700">
          پیشنهاد می‌کنیم اول این درس را ببینید:{" "}
          {prerequisites.map((p) => (
            <Link key={p.id} href={`/learn/${p.slug}`} className="underline">{p.title}</Link>
          ))}
        </p>
      )}
      <LessonPlayer lesson={lesson} exitHref="/learn" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-card border-2 border-ink-900/10 bg-white p-5 md:col-span-2">
          <h1 className="text-2xl font-black">{lesson.title}</h1>
          <p className="mt-2 leading-8 text-ink-700">{lesson.description}</p>
        </div>
        <div className="rounded-card border-2 border-ink-900/10 bg-white p-5">
          <h2 className="font-display font-extrabold">برای والدین</h2>
          <p className="mt-1 text-sm leading-7 text-ink-500">
            مناسب {ageRangeLabel(lesson.minAge, lesson.maxAge)} · حدود {fa(lesson.estimatedMinutes)} دقیقه · تمرین {lesson.skills.map((s) => names.skill(s.skillId)).filter(Boolean).join("، ")}.
          </p>
          {lesson.objectives.length > 0 && (
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-700">
              {lesson.objectives.map((o) => <li key={o}>{o}</li>)}
            </ul>
          )}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: lesson.title,
            description: lesson.description,
            learningResourceType: "Lesson",
            typicalAgeRange: `${lesson.minAge}-${lesson.maxAge}`,
            teaches: lesson.objectives,
            timeRequired: `PT${lesson.estimatedMinutes}M`,
            isAccessibleForFree: lesson.access === "free",
            inLanguage: "fa",
          }),
        }}
      />
    </Container>
  );
}
