import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { games } from "@/lib/data/content";
import { GamePlayer } from "@/features/games/GamePlayer";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export default async function KidsPlay({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await api.game(slug);
  if (!game) notFound();
  return <GamePlayer game={game} exitHref="/kids/home" variant="kids" />;
}
