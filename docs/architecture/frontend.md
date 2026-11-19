# معماری Frontend (apps/web)

## پشته
Next.js 16 (App Router, RSC, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · pnpm workspaces

## ساختار

```
apps/web/
├── app/
│   ├── (public)/            سایت عمومی – SSR/SSG، SEO
│   │   ├── page.tsx         خانه
│   │   ├── worksheets/      کتابخانه + [slug]
│   │   ├── games/           فهرست + [slug]
│   │   ├── stories/         فهرست + [slug]
│   │   ├── pricing/ privacy/ design-system/
│   ├── kids/                محیط کودک (noindex) – layout مستقل
│   ├── parent/              پنل والدین (noindex) – layout مستقل
│   ├── robots.ts  sitemap.ts  not-found.tsx
│   ├── globals.css          Design Tokens
│   └── fonts/               Vazirmatn + Vazirmatn Round-Dots (OFL)
├── components/
│   ├── ui/                  اجزای پایه‌ی سیستم طراحی
│   ├── brand/               لوگو، پیکو، آواتار، آیکون‌ها (SVG)
│   └── layout/              هدر و فوتر سایت
├── features/                ماژول‌های محصول (هم‌راستا با ماژول‌های Backend)
│   ├── games/               موتور بازی + بازی‌ها
│   ├── worksheets/          Worksheet Generator + کتابخانه + خروجی
│   ├── stories/             قصه‌خوان + صحنه‌ها
│   ├── studio/              بوم نقاشی + قالب‌های رنگ‌آمیزی
│   ├── kids/                نوار بالا، دروازه‌ی والدین، hook کودک فعال
│   ├── parent/              نمودارها، تنظیمات، انتخاب فرزند
│   └── content/             کارت محتوای مشترک
└── lib/
    ├── api/                 کلاینت API v1 (Mock ⇄ Laravel با NEXT_PUBLIC_API_URL)
    ├── data/                Seed نمونه (taxonomy / content / family)
    ├── recommend.ts         Recommendation Engine v1 (Rule-Based)
    ├── progress.ts          ذخیره‌ی محلی پیشرفت / صف آفلاین
    └── tones.ts utils.ts
packages/types/              قرارداد مشترک داده (Resourceهای API v1)
```

## اتصال به Backend (دو حالت)

| | حالت نمایشی | حالت متصل |
|---|---|---|
| فعال‌سازی | بدون متغیر | `NEXT_PUBLIC_API_URL` (+ `API_URL` داخلی در Docker) |
| محتوای عمومی (SSR) | Seed محلی | `lib/api` ← Laravel `/api/v1` |
| داشبورد/تنظیمات/گزارش والد | داده‌ی نمونه | `LiveDashboard` / `LiveSettings` / `LiveReports` |
| محیط کودک | پیشرفت در localStorage | توکن جلسه‌ی کودک؛ بازی/قصه/نقاشی در سرور ثبت می‌شود |

**BFF و امنیت توکن:** مرورگر هرگز توکن نمی‌بیند. `app/api/auth/*` ورود/ثبت‌نام را انجام و توکن والد را در کوکی httpOnly (`kw_parent`) ذخیره می‌کند. `app/api/v1/[...path]` پراکسی هم‌مبدأ است؛ درخواست‌های محیط کودک با هدر `x-kw-actor: child` از کوکی `kw_child` استفاده می‌کنند که هنگام انتخاب پروفایل صادر می‌شود.

تایپ‌ها در `@kidsworld/types` آینه‌ی API Resourceها هستند و باید هم‌زمان با Backend نسخه‌بندی شوند.

## موتور بازی (Game Engine)

```
GamePlayer (پوسته)
├── Game Registry      engine/registry.ts  – gameType → کامپوننت + قاعده‌ی ستاره/امتیاز
├── Level Manager      انتخاب مرحله، باز شدن ترتیبی در محیط کودک
├── Timer System       زمان جلسه
├── Scoring System     def.stars(stats, level) / def.score(stats)
├── Audio Manager      engine/audio.ts – Web Audio، بدون فایل
├── Event Tracker      start / correct / wrong / level_complete → GameEvent[]
└── Progress Manager   lib/progress.ts → (متصل) POST /games/sessions/{id}/complete
```

**قرارداد بازی:** هر بازی یک کامپوننت `({ level, runtime, seed })` است و فقط `runtime.correct/wrong/progress/complete/sfx` را صدا می‌زند. افزودن بازی جدید = یک کامپوننت + یک خط در Registry + تعریف مراحل در CMS. بازی‌های پیچیده‌تر (Phaser) با همین قرارداد در یک wrapper اجرا می‌شوند.

## Worksheet Generator
`features/worksheets/WorksheetSheet.tsx` از `template + params` یک SVG A4 تولید می‌کند (ردگیری، شمارش، ماز با seed، نقطه‌به‌نقطه، تطبیق، رنگ‌آمیزی، جمع). خروجی PNG/SVG با فونت جاسازی‌شده در کلاینت؛ PDF چندصفحه‌ای در Backend با Job صف‌شده.

## اجرای محلی
```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
```

## گام‌های بعدی پیشنهادی
1. Backend لاراول: ماژول‌های Auth, Children, Content, Games, Progress طبق ERD سند + Filament.
2. احراز هویت والدین و جلسه‌ی کودک (توکن کودک با دسترسی محدود، بدون رمز).
3. i18n با مسیر `/en` و فایل‌های پیام (ساختار `content_translations` آماده است).
4. Playwright E2E برای سناریوهای کلیدی + Lighthouse در CI.
5. PWA/Offline برای بازی‌ها (Service Worker + صف همگام‌سازی نتایج).
