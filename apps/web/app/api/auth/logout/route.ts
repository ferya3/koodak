import { NextResponse } from "next/server";
import { backendFetch, CHILD_COOKIE, PARENT_COOKIE } from "@/lib/server/backend";

export async function POST() {
  await backendFetch("/auth/logout", { method: "POST" }).catch(() => null);
  const out = NextResponse.json({ ok: true });
  out.cookies.delete(PARENT_COOKIE);
  out.cookies.delete(CHILD_COOKIE);
  return out;
}
