import type { Metadata } from "next";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/Section";
import { WorldIcon } from "@/components/brand/WorldIcon";
import { WorksheetLibrary } from "@/features/worksheets/WorksheetLibrary";
import { fa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "کتابخانه‌ی کاربرگ‌های قابل چاپ",
  description: "کاربرگ‌های رایگان و قابل چاپ برای کودکان ۲ تا ۱۰ سال: ردگیری حروف، شمارش، ماز، نقطه به نقطه، رنگ‌آمیزی و ریاضی.",
  alternates: { canonical: "/worksheets" },
};

export default async function WorksheetsPage({ searchParams }: { searchParams: Promise<{ age?: string; subject?: string }> }) {
  const { age, subject } = await searchParams;
  const [{ data }, shelves] = await Promise.all([api.worksheets(), api.worksheetSubjects()]);
  const initialAge = age && /^\d+$/.test(age) ? Number(age) : undefined;
  return (
    <>
      <section className="border-b-2 border-ink-900/5 bg-sun-100">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-10">
          <div>
            <nav aria-label="مسیر" className="mb-2 text-sm font-bold text-ink-500">
              <a href="/" className="hover:text-ink-900">خانه</a> <span aria-hidden="true">/</span> کاربرگ‌ها
            </nav>
            <h1 className="text-4xl font-black sm:text-5xl">کتابخانه‌ی کاربرگ‌ها</h1>
            <p className="mt-3 max-w-xl text-lg leading-8 text-ink-700">
              {fa(data.length)} کاربرگ آماده‌ی چاپ در {fa(shelves.length)} قفسه: الفبای فارسی و انگلیسی، اعداد، ریاضی، منطق، ماز و رنگ‌آمیزی؛ هر کدام با گروه سنی، سطح دشواری و مهارت هدف مشخص.
            </p>
          </div>
          <div className="flex gap-3">
            <WorldIcon name="worksheet" className="h-24 w-24 -rotate-6" />
            <WorldIcon name="printer" className="h-24 w-24 rotate-6" />
          </div>
        </Container>
      </section>
      <Container className="py-10">
        <WorksheetLibrary items={data} shelves={shelves} initialAge={initialAge} initialShelf={shelves.find((x) => x.slug === subject)?.id} />
      </Container>
    </>
  );
}
