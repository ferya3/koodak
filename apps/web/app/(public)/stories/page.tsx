import type { Metadata } from "next";
import { api } from "@/lib/api";
import { Container } from "@/components/ui/Section";
import { ContentCard } from "@/features/content/ContentCard";
import { Mascot } from "@/components/brand/Mascot";
import { Cloud, Sparkle } from "@/components/brand/Decor";

export const metadata: Metadata = {
  title: "قصه‌های تصویری و صوتی کودکان",
  description: "قصه‌های کوتاه، تعاملی و قبل از خواب برای کودکان؛ با تصویرسازی، صدای گوینده و انتخاب مسیر داستان.",
  alternates: { canonical: "/stories" },
};

export default async function StoriesPage() {
  const { data } = await api.stories();
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2c2566] to-[#5b47b8] text-white">
        <Sparkle className="absolute right-[20%] top-8 w-6" />
        <Sparkle className="absolute left-[30%] top-20 w-4" />
        <Cloud className="absolute -left-6 bottom-4 w-40 opacity-20" />
        <Container className="relative flex flex-wrap items-center justify-between gap-6 py-12">
          <div>
            <h1 className="text-4xl font-black sm:text-5xl">دنیای قصه</h1>
            <p className="mt-3 max-w-xl text-lg leading-8 text-lilac-100">قصه‌هایی که می‌شود دید، شنید و حتی مسیرشان را انتخاب کرد. مخصوص لحظه‌های آرام قبل از خواب.</p>
          </div>
          <Mascot mood="sleepy" className="h-36 w-36" />
        </Container>
      </section>
      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((s) => (
            <ContentCard key={s.id} content={s} />
          ))}
        </div>
      </Container>
    </>
  );
}
