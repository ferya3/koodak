import type { Metadata } from "next";
import { api } from "@/lib/api";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ContentCard } from "@/features/content/ContentCard";
import { Mascot } from "@/components/brand/Mascot";
import { WorldIcon } from "@/components/brand/WorldIcon";
import { fa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "آکادمی یادگیری: الفبا، اعداد، ریاضی و علوم",
  description: "درس‌های کوتاه، تصویری و صوتی برای کودکان ۳ تا ۹ سال؛ هر درس با پرسش‌های بازی‌گونه و بازخورد فوری.",
  alternates: { canonical: "/learn" },
};

export default async function LearnPage() {
  const [subjects, { data: lessons }] = await Promise.all([api.subjects(), api.lessons()]);
  const bySubject = subjects
    .map((s) => ({ subject: s, items: lessons.filter((l) => l.subjectId === s.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <section className="border-b-2 border-ink-900/5 bg-sky-100">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-10">
          <div>
            <h1 className="text-4xl font-black sm:text-5xl">آکادمی یادگیری</h1>
            <p className="mt-3 max-w-xl text-lg leading-8 text-ink-700">
              درس‌های کوتاه چندگامی: اول با تصویر و صدا یاد می‌گیری، بعد با پرسش‌های بازی‌گونه تمرین می‌کنی. {fa(lessons.length)} درس در {fa(bySubject.length)} موضوع.
            </p>
          </div>
          <div className="flex items-end gap-2">
            <WorldIcon name="academy" className="h-24 w-24 -rotate-6" />
            <Mascot mood="happy" className="h-28 w-28" />
          </div>
        </Container>
      </section>
      <Container className="py-10">
        <nav className="mb-10 flex flex-wrap gap-2" aria-label="موضوع‌ها">
          {bySubject.map(({ subject, items }) => (
            <a key={subject.id} href={`#${subject.slug}`} className="rounded-full border-2 border-ink-200 bg-white px-4 py-2 text-sm font-bold hover:border-ink-900">
              {subject.title} <span className="text-ink-300">· {fa(items.length)}</span>
            </a>
          ))}
        </nav>
        {bySubject.map(({ subject, items }) => (
          <section key={subject.id} id={subject.slug} className="mb-12 scroll-mt-24">
            <SectionHeading title={subject.title} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((l) => (
                <ContentCard key={l.id} content={l} />
              ))}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
