import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { worksheets } from "@/lib/data/content";
import { difficultyLabel } from "@/lib/data/taxonomy";
import { tones } from "@/lib/tones";
import { ageRangeLabel, cn, fa, faNumber } from "@/lib/utils";
import { Container } from "@/components/ui/Section";
import { Badge, PremiumBadge } from "@/components/ui/Badge";
import { WorksheetSheet } from "@/features/worksheets/WorksheetSheet";
import { WorksheetActions } from "@/features/worksheets/WorksheetActions";
import { templateLabel } from "@/features/worksheets/labels";
import { ContentCard } from "@/features/content/ContentCard";
import { ButtonLink } from "@/components/ui/Button";

export function generateStaticParams() {
  return worksheets.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = await api.worksheet(slug);
  if (!w) return {};
  return {
    title: `${w.title} | کاربرگ ${ageRangeLabel(w.minAge, w.maxAge)}`,
    description: w.description,
    alternates: { canonical: `/worksheets/${w.slug}` },
    openGraph: { title: w.title, description: w.description, type: "article" },
  };
}

export default async function WorksheetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = await api.worksheet(slug);
  if (!w) notFound();
  const [{ data: sameTemplate }, names] = await Promise.all([api.worksheets({ template: w.template }), api.lookups()]);
  const related = sameTemplate.filter((x) => x.id !== w.id).slice(0, 3);
  const t = tones[w.tone];

  return (
    <>
      <Container className="py-8">
        <nav aria-label="مسیر" className="mb-6 text-sm font-bold text-ink-500">
          <Link href="/" className="hover:text-ink-900">خانه</Link> <span aria-hidden="true">/</span>{" "}
          <Link href="/worksheets" className="hover:text-ink-900">کاربرگ‌ها</Link> <span aria-hidden="true">/</span>{" "}
          <span className="text-ink-900">{w.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className={cn("rounded-[2rem] border-2 border-ink-900 p-4 sm:p-10", t.soft)}>
            <WorksheetSheet id="worksheet-svg" worksheet={w} className="print-area mx-auto w-full max-w-[620px] rounded-xl bg-white shadow-lift" />
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge tone={w.tone}>{templateLabel[w.template]}</Badge>
                {w.access === "premium" ? <PremiumBadge /> : <Badge tone="grass">رایگان</Badge>}
              </div>
              <h1 className="text-3xl font-black leading-tight sm:text-4xl">{w.title}</h1>
              <p className="mt-3 text-lg leading-8 text-ink-700">{w.description}</p>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              {([
                ["گروه سنی", ageRangeLabel(w.minAge, w.maxAge)],
                ["سطح", difficultyLabel[w.difficulty]],
                ["زمان تقریبی", `${fa(w.estimatedMinutes)} دقیقه`],
                ["قطع کاغذ", <>{fa(w.pageCount)} صفحه · <span dir="ltr">{w.paperSize}</span></>],
              ] as [string, React.ReactNode][]).map(([k, v]) => (
                <div key={k} className="rounded-2xl border-2 border-ink-900/10 bg-white p-3">
                  <dt className="text-xs font-bold text-ink-500">{k}</dt>
                  <dd className="mt-0.5 font-display text-lg font-extrabold">{v}</dd>
                </div>
              ))}
            </dl>

            <div>
              <h2 className="mb-2 font-display font-extrabold">مهارت‌هایی که تمرین می‌شود</h2>
              <div className="flex flex-wrap gap-2">
                {w.skills.map((s) => (
                  <span key={s.skillId} className="rounded-full border-2 border-ink-900 bg-white px-3 py-1 text-sm font-bold">
                    {names.skill(s.skillId)}
                  </span>
                ))}
              </div>
            </div>

            {w.access === "premium" ? (
              <div className="rounded-3xl border-2 border-ink-900 bg-ink-900 p-5 text-white">
                <p className="font-display text-lg font-black">این کاربرگ مخصوص اشتراک خانواده است</p>
                <p className="mt-1 text-sm text-ink-200">پیش‌نمایش رایگان است؛ برای چاپ و دانلود نامحدود اشتراک بگیرید.</p>
                <ButtonLink href="/pricing" variant="kid" tone="sun" className="mt-4 w-full">مشاهده‌ی اشتراک‌ها</ButtonLink>
              </div>
            ) : (
              <WorksheetActions svgId="worksheet-svg" slug={w.slug} />
            )}

            <p className="text-sm text-ink-500">
              {faNumber(w.downloadCount)} بار دانلود شده · دسته‌ی {names.category(w.categoryId)}
            </p>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <Container className="py-10">
          <h2 className="mb-6 text-2xl font-black">کاربرگ‌های مشابه</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ContentCard key={r.id} content={r} />
            ))}
          </div>
        </Container>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: w.title,
            description: w.description,
            learningResourceType: "Worksheet",
            educationalLevel: ageRangeLabel(w.minAge, w.maxAge),
            typicalAgeRange: `${w.minAge}-${w.maxAge}`,
            isAccessibleForFree: w.access === "free",
            inLanguage: "fa",
          }),
        }}
      />
    </>
  );
}
