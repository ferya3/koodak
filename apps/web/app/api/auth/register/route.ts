import { NextRequest, NextResponse } from "next/server";
import { backendFetch, cookieOptions, PARENT_COOKIE } from "@/lib/server/backend";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await backendFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, device_name: "web" }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });
  const out = NextResponse.json({ user: data.user }, { status: 201 });
  out.cookies.set(PARENT_COOKIE, data.token, cookieOptions(30 * 24 * 60 * 60));
  return out;
}
