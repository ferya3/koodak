/**
 * لایه‌ی دسترسی به داده – آینه‌ی قرارداد REST «/api/v1».
 *
 * امروز: داده از Seed محلی خوانده می‌شود (حالت Mock).
 * فردا: با تنظیم NEXT_PUBLIC_API_URL همین توابع به Laravel API وصل می‌شوند،
 * بدون اینکه حتی یک کامپوننت تغییر کند.
 */
import type { ContentFilter, Game, Paginated, Story, Worksheet } from "@kidsworld/types";
import { categories, ageGroups, skills } from "../data/taxonomy";
import { games, stories, worksheets } from "../data/content";
import { plans } from "../data/family";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

function matches<T extends Worksheet | Game | Story>(item: T, f: ContentFilter) {
  if (f.q && !`${item.title} ${item.description}`.includes(f.q)) return false;
  if (f.age && (f.age < item.minAge || f.age > item.maxAge)) return false;
  if (f.difficulty && item.difficulty !== f.difficulty) return false;
  if (f.access && item.access !== f.access) return false;
  if (f.categoryId && item.categoryId !== f.categoryId) return false;
  if (f.template && item.type === "worksheet" && (item as Worksheet).template !== f.template) return false;
  return true;
}

function page<T>(data: T[]): Paginated<T> {
  return { data, meta: { page: 1, perPage: data.length, total: data.length } };
}

export const api = {
  categories: async () => (API_URL ? http<typeof categories>("/categories") : categories),
  ageGroups: async () => ageGroups,
  skills: async () => skills,
  plans: async () => (API_URL ? http<typeof plans>("/plans") : plans),

  worksheets: async (f: ContentFilter = {}) =>
    API_URL ? http<Paginated<Worksheet>>(`/worksheets?${new URLSearchParams(f as Record<string, string>)}`) : page(worksheets.filter((w) => matches(w, f))),
  worksheet: async (slug: string) => (API_URL ? http<Worksheet>(`/worksheets/${slug}`) : worksheets.find((w) => w.slug === slug) ?? null),

  games: async (f: ContentFilter = {}) => (API_URL ? http<Paginated<Game>>("/games") : page(games.filter((g) => matches(g, f)))),
  game: async (slug: string) => (API_URL ? http<Game>(`/games/${slug}`) : games.find((g) => g.slug === slug) ?? null),

  stories: async (f: ContentFilter = {}) => (API_URL ? http<Paginated<Story>>("/stories") : page(stories.filter((s) => matches(s, f)))),
  story: async (slug: string) => (API_URL ? http<Story>(`/stories/${slug}`) : stories.find((s) => s.slug === slug) ?? null),
};
