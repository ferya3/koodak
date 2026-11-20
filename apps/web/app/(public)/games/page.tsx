import type { Metadata } from "next";
import { api } from "@/lib/api";
import { upcomingGames } from "@/lib/data/content";
import { tones } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ContentCard } from "@/features/content/ContentCard";
import { WorldIcon } from "@/components/brand/WorldIcon";
import { Mascot } from "@/components/brand/Mascot";

export const metadata: Metadata = {
  title: "بازی‌های آموزشی و فکری کودکان",
  description: "بازی‌های رایگان حافظه، تشخیص الگو و شمارش برای کودکان ۳ تا ۹ سال؛ بدون تبلیغ و مناسب سن.",
  alternates: { canonical: "/games" },
};

export default async function GamesPage() {
  const { data } = await api.games();
  return (
    <>
      <section className="mesh relative -mt-19 overflow-hidden pt-19 [--hero:var(--color-grape-300)]">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-10">
          <div>
            <h1 className="text-4xl font-black sm:text-5xl">بازی‌ها</h1>
            <p className="mt-3 max-w-xl text-lg leading-8 text-ink-700">
              هر بازی چند مرحله دارد و مهارت مشخصی را تمرین می‌دهد: حافظه، تمرکز، الگو و درک عدد. ستاره‌ها جمع می‌شوند و والدین روند را می‌بینند.
            </p>
          </div>
          <Mascot mood="wow" className="h-32 w-32" />
        </Container>
      </section>
      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((g) => (
            <ContentCard key={g.id} content={g} />
          ))}
        </div>

        <SectionHeading eyebrow="در کارگاه پیکو" title="به‌زودی…" className="mt-16" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {upcomingGames.map((g) => (
            <div key={g.slug} className={cn("relative flex flex-col items-center gap-3 rounded-card border-2 border-dashed border-ink-300 p-6 text-center", tones[g.tone].soft)}>
              <WorldIcon name={g.icon} className="h-16 w-16 opacity-70 grayscale-[30%]" />
              <p className="font-display font-black text-ink-700">{g.title}</p>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-ink-500">به‌زودی</span>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
