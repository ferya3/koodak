import "server-only";
import { cookies } from "next/headers";

/**
 * BFF (Backend-for-Frontend): توکن‌ها هرگز به جاوااسکریپت مرورگر نمی‌رسند.
 *   kw_parent → توکن والد (ability: parent)
 *   kw_child  → توکن جلسه‌ی کودک (ability: child:{id})، کوتاه‌عمر
 * هر دو httpOnly + SameSite=Lax هستند و فقط سرور Next آن‌ها را به Laravel می‌فرستد.
 */
export const API_ORIGIN = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
export const PARENT_COOKIE = "kw_parent";
export const CHILD_COOKIE = "kw_child";

export function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function backendFetch(path: string, init: RequestInit & { actor?: "parent" | "child" } = {}) {
  const jar = await cookies();
  const token = init.actor === "child" ? jar.get(CHILD_COOKIE)?.value : jar.get(PARENT_COOKIE)?.value;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_ORIGIN}/api/v1${path}`, { ...init, headers, cache: "no-store" });
}
