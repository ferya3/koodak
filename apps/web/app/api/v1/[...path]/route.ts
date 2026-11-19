import { NextRequest, NextResponse } from "next/server";
import { backendFetch, CHILD_COOKIE, cookieOptions } from "@/lib/server/backend";

/**
 * پراکسی هم‌مبدأ به Laravel API v1.
 * - درخواست‌های محیط کودک با هدر x-kw-actor: child از توکن کودک استفاده می‌کنند.
 * - پاسخ «شروع جلسه‌ی کودک» توکن را در کوکی httpOnly ذخیره و از بدنه حذف می‌کند.
 */
async function handle(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const actor = req.headers.get("x-kw-actor") === "child" ? "child" : "parent";
  const target = `/${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`;
  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();

  const res = await backendFetch(target, {
    method: req.method,
    body,
    actor,
    headers: { "Content-Type": req.headers.get("content-type") ?? "application/json", "X-Locale": req.headers.get("x-locale") ?? "fa" },
  });

  const isChildSession = req.method === "POST" && /^children\/\d+\/session$/.test(path.join("/"));
  if (isChildSession && res.ok) {
    const data = await res.json();
    const out = NextResponse.json({ ...data, token: undefined }, { status: res.status });
    out.cookies.set(CHILD_COOKIE, data.token, cookieOptions(12 * 60 * 60));
    return out;
  }

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
      ...(res.headers.get("content-disposition") ? { "Content-Disposition": res.headers.get("content-disposition")! } : {}),
    },
  });
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
