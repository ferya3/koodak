# KidsWorld · دنیای بازی و یادگیری کودکان

پلتفرم جامع آموزش، بازی، خلاقیت و کاربرگ برای کودکان ۲ تا ۱۰ سال.
این مخزن شامل **Frontend** (Next.js، سیستم طراحی و هویت بصری)، **Backend** (Laravel، Modular Monolith، پنل مدیریت Filament) و **زیرساخت** (Docker، Nginx، CI) است.

## چه چیزی ساخته شده

| بخش | مسیر | امکانات |
|---|---|---|
| سایت عمومی | `/` | Hero تصویرسازی‌شده، انتخاب سن، ۱۰ دنیا، محبوب‌ها، بخش والدین، امنیت، FAQ (JSON-LD) |
| کتابخانه‌ی کاربرگ | `/worksheets` | جستجو و فیلتر، **Worksheet Generator** (۷ قالب)، پیش‌نمایش A4، چاپ، دانلود PNG/SVG |
| بازی‌ها | `/games` | موتور بازی مشترک + ۳ بازی: باغ حافظه، قطار الگوها، ماهی‌ها را بشمار |
| قصه‌ها | `/stories` | قصه‌خوان تعاملی با انتخاب مسیر، خواندن صوتی، اندازه‌ی متن، نشانک |
| محیط کودک | `/kids` | انتخاب پروفایل، مأموریت روزانه، پیشنهاد هوشمند، دنیاها، مدال‌ها، دروازه‌ی والدین |
| استودیو نقاشی | `/kids/studio` | قلم، مداد شمعی، سطل رنگ، پاک‌کن، Undo/Redo، قالب رنگ‌آمیزی، گالری، خروجی PNG |
| پنل والدین | `/parent` | KPI، نمودار زمان با سقف، مهارت‌ها، پیشنهادها، تاریخچه، تنظیمات زمان و حریم خصوصی، گزارش‌ها |
| سیستم طراحی | `/design-system` | توکن‌ها، تایپوگرافی، دکمه‌ها، کامپوننت‌ها، تصویرسازی، سه تم |

## Backend و پنل مدیریت

| بخش | توضیح |
|---|---|
| API v1 | ۴۸ مسیر در ۱۱ ماژول: احراز هویت، کودکان، محتوا، کاربرگ، بازی، قصه، پیشرفت، پیشنهاد، اشتراک، داشبورد والدین |
| امنیت | توکن والد / توکن محدود جلسه‌ی کودک، کنترل مالکیت، محدودیت نرخ، رضایت‌نامه، حذف و خروجی داده |
| گیمیفیکیشن | ستاره‌ی محاسبه‌شده در سرور، امتیاز، مدال‌های قاعده‌محور، مشاهده‌ی مهارت |
| پنل مدیریت `/admin` | Filament فارسی و راست‌به‌چپ؛ ساخت کاربرگ/بازی/قصه بدون کدنویسی، گردش کار تأیید، نسخه‌بندی |
| تست | ۲۸ تست Feature روی PostgreSQL |

## ساختار مخزن

```
apps/web/          Next.js 16 + TypeScript + Tailwind v4 (+ BFF برای توکن‌ها)
backend/           Laravel 13 – app/Modules/* ، Filament ، تست‌ها
packages/types/    قرارداد داده‌ی مشترک Frontend ⇄ API v1
infrastructure/    Dockerfileها و Nginx
docs/design/       استراتژی UX، نقشه‌ی سایت، جریان‌های کاربری، سیستم طراحی
docs/architecture/ معماری Frontend و Backend + مرجع API
```

## اجرا

**فقط Frontend (حالت نمایشی با داده‌ی نمونه):**

```bash
pnpm install
pnpm dev
```

**کامل (Frontend + API):** ابتدا Backend را طبق [`backend/README.md`](backend/README.md) اجرا کنید، سپس:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 pnpm dev
```

**با Docker:**

```bash
cp backend/.env.docker.example backend/.env.docker
docker compose up -d --build
docker compose exec api php artisan key:generate --force
docker compose exec api php artisan migrate --seed --force
```

## مستندات
- [استراتژی UX](docs/design/01-ux-strategy.md)
- [نقشه‌ی سایت](docs/design/02-sitemap.md)
- [جریان‌های کاربری](docs/design/03-user-flows.md)
- [سیستم طراحی](docs/design/04-design-system.md)
- [معماری Frontend](docs/architecture/frontend.md)
- [معماری Backend و مرجع API](docs/architecture/backend.md)

فونت‌ها: Vazirmatn و Vazirmatn Round-Dots از صابر راستی‌کردار (مجوز SIL OFL 1.1).
