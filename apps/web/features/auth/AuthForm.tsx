"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ApiError, live, LIVE } from "@/lib/api/live";
import { Mascot } from "@/components/brand/Mascot";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function Field({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      <input
        {...props}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-12 w-full rounded-2xl border-2 bg-white px-4 font-sans focus:outline-none focus:ring-4 focus:ring-sky-300",
          error ? "border-coral-500" : "border-ink-200 focus:border-ink-900",
        )}
      />
      {error && <span className="mt-1 block text-sm font-bold text-coral-700">{error}</span>}
    </label>
  );
}

/** فرم ورود / ثبت‌نام والدین – فقط بزرگسالان (کودک هرگز به این صفحه هدایت نمی‌شود) */
export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/parent";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setErrors({});
    try {
      if (mode === "login") await live.login(String(f.get("email")), String(f.get("password")));
      else
        await live.register({
          name: String(f.get("name")),
          email: String(f.get("email")),
          password: String(f.get("password")),
          password_confirmation: String(f.get("password_confirmation")),
          accept_terms: f.get("accept_terms") === "on",
        });
      router.push(next.startsWith("/") ? next : "/parent");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        const flat = Object.fromEntries(Object.entries(err.errors ?? {}).map(([k, v]) => [k, v[0]]));
        setErrors(Object.keys(flat).length ? flat : { form: err.message });
      } else setErrors({ form: "ارتباط با سرور برقرار نشد." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-12 lg:grid-cols-2">
      <div className="hidden flex-col items-center text-center lg:flex">
        <Mascot mood={mode === "login" ? "happy" : "cheer"} className="h-56 w-56 animate-float" />
        <p className="mt-4 max-w-sm text-lg leading-8 text-ink-700">
          {mode === "login" ? "خوش برگشتید! روند یادگیری فرزندتان منتظر شماست." : "حساب والدین، کلید دنیای امن کودک شماست. فقط چند ثانیه طول می‌کشد."}
        </p>
      </div>
      <form onSubmit={submit} className="rounded-[2rem] bg-white p-6 shadow-float ring-1 ring-ink-900/5 sm:p-8" noValidate>
        <h1 className="text-3xl font-black">{mode === "login" ? "ورود والدین" : "ساخت حساب والدین"}</h1>
        <p className="mt-1 text-sm text-ink-500">این بخش فقط برای بزرگسالان است.</p>

        {!LIVE && (
          <p className="mt-4 rounded-2xl bg-sun-100 p-3 text-sm leading-7 text-sun-700">
            حالت نمایشی: اتصال به سرور فعال نیست. برای اتصال، <code dir="ltr">NEXT_PUBLIC_API_URL</code> را تنظیم کنید. تا آن زمان می‌توانید{" "}
            <Link href="/parent" className="font-bold underline">پنل نمونه</Link> را ببینید.
          </p>
        )}
        {errors.form && <p role="alert" className="mt-4 rounded-2xl bg-coral-100 p-3 text-sm font-bold text-coral-700">{errors.form}</p>}

        <div className="mt-6 space-y-4">
          {mode === "register" && <Field label="نام شما" name="name" autoComplete="name" required error={errors.name} />}
          <Field label="ایمیل" name="email" type="email" dir="ltr" autoComplete="email" required error={errors.email} />
          <Field label="رمز عبور" name="password" type="password" dir="ltr" autoComplete={mode === "login" ? "current-password" : "new-password"} required error={errors.password} />
          {mode === "register" && (
            <>
              <Field label="تکرار رمز عبور" name="password_confirmation" type="password" dir="ltr" autoComplete="new-password" required />
              <label className="flex items-start gap-3 text-sm leading-7">
                <input type="checkbox" name="accept_terms" className="mt-1.5 h-5 w-5 accent-grass-500" required />
                <span>
                  تأیید می‌کنم بزرگسال هستم و <Link href="/privacy" className="font-bold underline">قوانین و سیاست حریم خصوصی کودکان</Link> را پذیرفته‌ام.
                  {errors.accept_terms && <span className="block font-bold text-coral-700">{errors.accept_terms}</span>}
                </span>
              </label>
            </>
          )}
        </div>
        <Button type="submit" variant="kid" tone="coral" size="lg" className="mt-6 w-full" disabled={busy || !LIVE}>
          {busy ? "لطفاً صبر کنید…" : mode === "login" ? "ورود" : "ساخت حساب"}
        </Button>
        <p className="mt-4 text-center text-sm text-ink-500">
          {mode === "login" ? (
            <>حساب ندارید؟ <Link href="/auth/register" className="font-bold text-ink-900 underline">ثبت‌نام رایگان</Link></>
          ) : (
            <>حساب دارید؟ <Link href="/auth/login" className="font-bold text-ink-900 underline">ورود</Link></>
          )}
        </p>
      </form>
    </div>
  );
}
