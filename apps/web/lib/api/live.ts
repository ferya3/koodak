"use client";
/**
 * کلاینت مرورگر برای حالت متصل (Live).
 * همه‌ی درخواست‌ها هم‌مبدأ به BFF (/api/v1/*) می‌روند؛ توکن در کوکی httpOnly است.
 * actor="child" یعنی درخواست با توکن جلسه‌ی کودک ارسال شود.
 */
import type { Awards, ChildProfile, Content, DashboardResponse, GameSessionResult, LessonResult, ParentSettings, UserView } from "@kidsworld/types";

export const LIVE = Boolean(process.env.NEXT_PUBLIC_API_URL);

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

async function call<T>(path: string, init: { method?: string; body?: unknown; actor?: "parent" | "child"; base?: string } = {}): Promise<T> {
  const res = await fetch(`${init.base ?? "/api/v1"}${path}`, {
    method: init.method ?? "GET",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(init.actor === "child" ? { "x-kw-actor": "child" } : {}) },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    credentials: "same-origin",
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data?.message ?? `خطای ${res.status}`, data?.errors);
  return data as T;
}

export const live = {
  login: (email: string, password: string) => call<{ user: UserView }>("/login", { method: "POST", body: { email, password }, base: "/api/auth" }),
  register: (body: { name: string; email: string; password: string; password_confirmation: string; accept_terms: boolean }) =>
    call<{ user: UserView }>("/register", { method: "POST", body, base: "/api/auth" }),
  logout: () => call("/logout", { method: "POST", base: "/api/auth" }),
  me: () => call<{ data: UserView }>("/auth/me"),

  children: () => call<{ data: ChildProfile[] }>("/children"),
  createChild: (body: { display_name: string; birth_year_month: string; avatar: string; consent: boolean }) =>
    call<{ data: ChildProfile }>("/children", { method: "POST", body }),
  startChildSession: (childId: string) => call<{ child: { data: ChildProfile } | ChildProfile; settings: unknown }>(`/children/${childId}/session`, { method: "POST" }),
  updateSettings: (childId: string, body: Record<string, unknown>) => call<{ data: ParentSettings }>(`/children/${childId}/settings`, { method: "PUT", body }),
  deleteChild: (childId: string) => call(`/children/${childId}`, { method: "DELETE" }),

  checkout: (planId: string, billingPeriod: "monthly" | "yearly") =>
    call<{ paymentId: string; redirectUrl: string }>("/subscriptions/checkout", { method: "POST", body: { planId: Number(planId), billingPeriod } }),
  subscription: () =>
    call<{
      subscription: { plan: { name: string; slug: string }; status: string; billingPeriod: string; startsAt: string; expiresAt: string } | null;
      entitlements: { maxChildren: number; premiumContent: boolean };
    }>("/subscriptions/current"),
  payments: () =>
    call<{ data: { id: string; amount: number; status: string; refId: string | null; plan: string | null; billingPeriod: string | null; paidAt: string | null; createdAt: string }[] }>("/payments"),

  dashboard: (childId?: string) => call<DashboardResponse>(`/parent/dashboard${childId ? `?childId=${childId}` : ""}`),
  reports: (childId: string) => call<{ data: { id: string; type: string; periodStart: string; periodEnd: string; status: string; format?: string }[] }>(`/parent/reports?childId=${childId}`),
  generateReport: (childId: string, type: "weekly" | "monthly" = "weekly") => call(`/parent/reports/generate`, { method: "POST", body: { childId: Number(childId), type } }),

  game: {
    start: (slug: string, childId: string, level: number) =>
      call<{ sessionId: string }>(`/games/${slug}/sessions`, { method: "POST", body: { childId: Number(childId), level }, actor: "child" }),
    events: (sessionId: string, events: { type: string; at: number; data?: unknown }[]) =>
      call(`/games/sessions/${sessionId}/events`, { method: "POST", body: { events }, actor: "child" }),
    complete: (sessionId: string, body: { correct: number; mistakes: number; durationSeconds: number }) =>
      call<{ result: GameSessionResult; awards: Awards }>(`/games/sessions/${sessionId}/complete`, { method: "POST", body, actor: "child" }),
  },

  recommendations: (childId: string, limit = 3) =>
    call<{ data: { content: Content; reason: string; score: number }[] }>(`/children/${childId}/recommendations?limit=${limit}&types[]=game&types[]=story&types[]=lesson`, { actor: "child" }),
  achievements: (childId: string) =>
    call<{ data: { id: string; slug: string; title: string; description: string; icon: string; points: number; earnedAt: string | null }[] }>(`/children/${childId}/achievements`, { actor: "child" }),
  progress: (childId: string) => call<{ points: number; stars: number; streakDays: number }>(`/children/${childId}/progress`, { actor: "child" }),

  lessonComplete: (slug: string, childId: string, answers: Record<string, string>, durationSeconds: number) =>
    call<{ result: LessonResult; awards: Awards }>(`/learning/lessons/${slug}/complete`, { method: "POST", body: { childId: Number(childId), answers, durationSeconds }, actor: "child" }),

  activity: (childId: string, body: { type: "story" | "drawing" | "worksheet" | "lesson"; contentId?: number; durationSeconds: number; title?: string }) =>
    call<{ awards: Awards }>(`/children/${childId}/activities`, { method: "POST", body, actor: "child" }),
};
