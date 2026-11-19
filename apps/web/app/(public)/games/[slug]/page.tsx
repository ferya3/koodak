import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { games } from "@/lib/data/content";
import { skillById } from "@/lib/data/taxonomy";
import { ageRangeLabel } from "@/lib/utils";
import { Container } from "@/components/ui/Section";
import { GamePlayer } from "@/features/games/GamePlayer";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = await api.game(slug);
  if (!g) return {};
  return { title: `${g.title} | بازی ${ageRangeLabel(g.minAge, g.maxAge)}`, description: g.description, alternates: { canonical: `/games/${g.slug}` } };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await api.game(slug);
  if (!game) notFound();
  return (
    <Container className="py-8">
      <nav aria-label="مسیر" className="mb-6 text-sm font-bold text-ink-500">
        <Link href="/" className="hover:text-ink-900">خانه</Link> / <Link href="/games" className="hover:text-ink-900">بازی‌ها</Link> / <span className="text-ink-900">{game.title}</span>
      </nav>
      <GamePlayer game={game} exitHref="/games" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-card border-2 border-ink-900/10 bg-white p-5 md:col-span-2">
          <h1 className="text-2xl font-black">{game.title}</h1>
          <p className="mt-2 leading-8 text-ink-700">{game.description}</p>
        </div>
        <div className="rounded-card border-2 border-ink-900/10 bg-white p-5">
          <h2 className="font-display font-extrabold">برای والدین</h2>
          <p className="mt-1 text-sm leading-7 text-ink-500">
            مناسب {ageRangeLabel(game.minAge, game.maxAge)} · تمرین {game.skills.map((s) => skillById(s.skillId).title).join("، ")}.
            نتایج در پنل والدین ثبت می‌شود.
          </p>
        </div>
      </div>
    </Container>
  );
}
