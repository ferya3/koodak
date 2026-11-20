"use client";
/**
 * ذخیره و خواندن بازی‌های ساخت والدین.
 * حالت متصل (Live): API بک‌اند (والد: /parent/custom-games، کودک: /children/{id}/custom-games)
 * حالت نمایشی: localStorage همین مرورگر (برای امتحان بدون سرور)
 */
import type { CustomGame, CustomGameType, Game, ToneKey } from "@kidsworld/types";
import { LIVE } from "@/lib/api/live";

const KEY = "kw.customGames";

async function call<T>(path: string, init: { method?: string; body?: unknown; child?: boolean } = {}): Promise<T> {
  const res = await fetch(`/api/v1${path}`, {
    method: init.method ?? "GET",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(init.child ? { "x-kw-actor": "child" } : {}) },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    credentials: "same-origin",
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const first = data?.errors ? Object.values(data.errors as Record<string, string[]>)[0]?.[0] : null;
    throw new Error(first ?? data?.message ?? `خطای ${res.status}`);
  }
  return data as T;
}

function readLocal(): CustomGame[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as CustomGame[];
  } catch {
    return [];
  }
}
function writeLocal(list: CustomGame[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export type CustomGameInput = Omit<CustomGame, "id" | "updatedAt">;

export const customGames = {
  async list(): Promise<CustomGame[]> {
    return LIVE ? (await call<{ data: CustomGame[] }>("/parent/custom-games")).data : readLocal();
  },
  /** بازی‌هایی که این کودک می‌بیند (محیط کودک) */
  async forChild(childId: string | null): Promise<CustomGame[]> {
    if (!LIVE) return readLocal().filter((g) => !g.childIds?.length || (childId && g.childIds.includes(childId)));
    if (!childId) return [];
    return (await call<{ data: CustomGame[] }>(`/children/${childId}/custom-games`, { child: true })).data;
  },
  async save(input: CustomGameInput, id?: string): Promise<CustomGame> {
    if (LIVE) {
      const body = { ...input, childIds: input.childIds?.map(Number) ?? null };
      return (await call<{ data: CustomGame }>(id ? `/parent/custom-games/${id}` : "/parent/custom-games", { method: id ? "PUT" : "POST", body })).data;
    }
    const list = readLocal();
    const game: CustomGame = { ...input, id: id ?? `local-${Date.now()}`, updatedAt: new Date().toISOString() };
    writeLocal(id ? list.map((g) => (g.id === id ? game : g)) : [game, ...list]);
    return game;
  },
  async remove(id: string): Promise<void> {
    if (LIVE) await call(`/parent/custom-games/${id}`, { method: "DELETE" });
    else writeLocal(readLocal().filter((g) => g.id !== id));
  },
};

export const CUSTOM_TYPES: Record<CustomGameType, { title: string; description: string; icon: string; tone: ToneKey }> = {
  pattern: { title: "قطار الگو", description: "واگن‌ها و الگوی شکل‌ها را خودتان بچینید", icon: "brain", tone: "sun" },
  counting: { title: "تنگ ماهی", description: "تعداد ماهی‌ها (تا ۱۵) را در هر دور تعیین کنید", icon: "growth", tone: "sky" },
  memory: { title: "کارت‌های حافظه", description: "تصویرهای کارت‌ها را خودتان انتخاب کنید", icon: "star", tone: "grape" },
};

/** تبدیل بازی ساخت والدین به «Game» استاندارد تا همان GamePlayer اجرایش کند */
export function toGame(cg: CustomGame): Game {
  const description =
    cg.gameType === "pattern" ? "قطاری که مامان یا بابا برایت ساخته‌اند! واگن‌ها را به ترتیب پر کن." : cg.gameType === "counting" ? "بشمار ببینیم در هر تنگ چندتا هست!" : "جفت کارت‌های یکسان را پیدا کن.";
  return {
    id: `cg-${cg.id}`,
    slug: `custom-${cg.id}`,
    type: "game",
    title: cg.title,
    description,
    categoryId: "c-fun",
    ageGroupIds: [],
    minAge: 3,
    maxAge: 10,
    difficulty: "easy",
    estimatedMinutes: 5,
    access: "free",
    status: "published",
    skills: [],
    tone: cg.tone,
    publishedAt: cg.updatedAt ?? "",
    gameType: cg.gameType,
    engine: "react-svg",
    levels: [{ levelNumber: 1, difficulty: "easy", configuration: cg.config }],
  };
}
