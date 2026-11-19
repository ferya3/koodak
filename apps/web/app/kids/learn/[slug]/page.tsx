import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { lessons } from "@/lib/data/lessons";
import { LessonPlayer } from "@/features/learning/LessonPlayer";

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export default async function KidsLesson({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await api.lesson(slug);
  if (!lesson) notFound();
  return <LessonPlayer lesson={lesson} exitHref="/kids/learn" variant="kids" />;
}
