/**
 * لایه‌ی دسترسی به داده – آینه‌ی قرارداد REST «/api/v1».
 *
 * امروز: داده از Seed محلی خوانده می‌شود (حالت Mock).
 * فردا: با تنظیم NEXT_PUBLIC_API_URL همین توابع به Laravel API وصل می‌شوند،
 * بدون اینکه حتی یک کامپوننت تغییر کند.
 */
import type { ContentFilter, Game, Lesson, Paginated, Story, Subject, Worksheet } from "@kidsworld/types";
import { categories, ageGroups, skills, subjects } from "../data/taxonomy";
import { lessons } from "../data/lessons";
import { games, stories, worksheets } from "../data/content";
import { plans } from "../data/family";

/**
 * هنگام `next build` (مثلاً داخل Docker) هنوز API بالا نیست؛ صفحات ایستا با Seed ساخته می‌شوند
 * و با revalidate (۵ دقیقه) از API واقعی تازه می‌شوند.
 */
const BUILDING = process.env.NEXT_PHASE === "phase-production-build";
const API_URL = BUILDING ? undefined : process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

/** منابع تکی در Laravel داخل { data } هستند؛ 404 = null */
async function one<T>(path: string): Promise<T | null> {
  try {
    return (await http<{ data: T }>(path)).data;
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("API 404")) return null;
    throw e;
  }
}

/**
 * سرور حداکثر ۶۰ مورد در هر صفحه می‌دهد؛ کتابخانه‌ها (صدها کاربرگ و درس) همه را لازم دارند.
 * صفحه‌ی اول تعداد کل را می‌گوید و بقیه موازی گرفته می‌شوند.
 */
async function httpAll<T>(path: string, params: Record<string, string> = {}): Promise<Paginated<T>> {
  const q = (p: number) => `${path}?${new URLSearchParams({ ...params, perPage: "60", page: String(p) })}`;
  const first = await http<Paginated<T>>(q(1));
  const pages = Math.min(Math.ceil(first.meta.total / 60), 20);
  const rest = await Promise.all(Array.from({ length: Math.max(pages - 1, 0) }, (_, i) => http<Paginated<T>>(q(i + 2))));
  const data = [first, ...rest].flatMap((r) => r.data);
  return { data, meta: { page: 1, perPage: data.length, total: first.meta.total } };
}

function matches<T extends Worksheet | Game | Story | Lesson>(item: T, f: ContentFilter) {
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
  categories: async () => (API_URL ? (await http<{ data: typeof categories }>("/categories")).data : categories),
  ageGroups: async () => ageGroups,
  skills: async () => (API_URL ? (await http<{ data: typeof skills }>("/skills")).data : skills),
  /** نگاشت شناسه → عنوان برای مهارت‌ها و دسته‌ها (منبع: API یا Seed) */
  lookups: async () => {
    const [sk, cats] = await Promise.all([api.skills(), api.categories()]);
    return {
      skill: (id: string) => sk.find((x) => x.id === id)?.title ?? "",
      category: (id: string) => cats.find((x) => x.id === id)?.title ?? "",
    };
  },
  /** اگر بخش اشتراک در سرور خاموش باشد (feature flag)، فهرست خالی است */
  plans: async () => (API_URL ? (await http<{ data: typeof plans }>("/plans").catch(() => ({ data: [] }))).data : plans),

  /** قفسه‌های کتابخانه‌ی کاربرگ (موضوع‌های زیر دسته‌ی کاربرگ‌ها) */
  worksheetSubjects: async (): Promise<Subject[]> => {
    if (!API_URL) return subjects.filter((s) => s.categoryId === "c-sheets");
    const cats = (await http<{ data: { id: string; slug: string; subjects?: Subject[] }[] }>("/categories")).data;
    const c = cats.find((x) => x.slug === "worksheets");
    return (c?.subjects ?? []).map((s) => ({ ...s, categoryId: c!.id }));
  },
  worksheets: async (f: ContentFilter = {}) =>
    API_URL ? httpAll<Worksheet>("/worksheets", f as Record<string, string>) : page(worksheets.filter((w) => matches(w, f))),
  worksheet: async (slug: string) => (API_URL ? one<Worksheet>(`/worksheets/${slug}`) : worksheets.find((w) => w.slug === slug) ?? null),

  games: async (f: ContentFilter = {}) => (API_URL ? httpAll<Game>("/games", f as Record<string, string>) : page(games.filter((g) => matches(g, f)))),
  game: async (slug: string) => (API_URL ? one<Game>(`/games/${slug}`) : games.find((g) => g.slug === slug) ?? null),

  /** آکادمی یادگیری */
  subjects: async (): Promise<(Subject & { lessonCount: number })[]> =>
    API_URL
      ? (await http<{ data: (Subject & { lessonCount: number })[] }>("/learning/subjects")).data
      : subjects.map((s) => ({ ...s, lessonCount: lessons.filter((l) => l.subjectId === s.id).length })),
  lessons: async (f: ContentFilter & { subject?: string } = {}) =>
    API_URL
      ? httpAll<Lesson>("/learning/lessons", f as Record<string, string>)
      : page(lessons.filter((l) => matches(l, f) && (!f.subject || l.subjectId === f.subject || subjects.find((s) => s.id === l.subjectId)?.slug === f.subject))),
  lesson: async (slug: string) => (API_URL ? one<Lesson>(`/learning/lessons/${slug}`) : lessons.find((l) => l.slug === slug) ?? null),

  stories: async (f: ContentFilter = {}) => (API_URL ? httpAll<Story>("/stories", f as Record<string, string>) : page(stories.filter((s) => matches(s, f)))),
  story: async (slug: string) => (API_URL ? one<Story>(`/stories/${slug}`) : stories.find((s) => s.slug === slug) ?? null),
};
