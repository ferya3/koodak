# KidsWorld · دنیای بازی و یادگیری کودکان

پلتفرم جامع آموزش، بازی، خلاقیت و کاربرگ برای کودکان ۲ تا ۱۰ سال.
این مخزن شامل **Frontend** (Next.js، سیستم طراحی و هویت بصری)، **Backend** (Laravel، Modular Monolith، پنل مدیریت Filament) و **زیرساخت** (Docker، Nginx، CI) است.

## چه چیزی ساخته شده

| بخش | مسیر | امکانات |
|---|---|---|
| سایت عمومی | `/` | Hero تصویرسازی‌شده، انتخاب سن، ۱۰ دنیا، محبوب‌ها، بخش والدین، امنیت، FAQ (JSON-LD) |
| آکادمی یادگیری | `/learn` | **۷۲ درس** چندگامی تصویری و صوتی: ۳۲ حرف الفبای فارسی (با شکل‌های اول/وسط/آخر)، ۲۶ حرف انگلیسی، اعداد ۱ تا ۱۰، شکل‌ها، ریاضی، علوم |
| کتابخانه‌ی کاربرگ | `/worksheets` | **۴۶۸ کاربرگ** در ۹ قفسه (الفبای فارسی و انگلیسی، اعداد، ریاضی و ضرب و تقسیم، منطق، ماز و ردگیری خط، نقاشی و رنگ‌آمیزی، جدول متقاطع و واژه، فلش‌کارت)؛ **Worksheet Generator** با ۳۳ قالب + **کاربرگ آماده** (آپلود PDF/تصویر در پنل مدیریت)؛ مگامنوی دسته‌بندی، جستجو، فیلتر، «نمایش بیشتر»، چاپ، دانلود |
| بازی‌ها | `/games` | موتور بازی مشترک + ۸ نوع بازی در ۱۳ بازی: حافظه (۴ تم)، الگو، شمارش، صدای اول حروف (فارسی/انگلیسی)، شکار حرف، کدام فرق دارد، حباب‌های عدد، بیشتر/کمتر |
| قصه‌ها | `/stories` | ۶ قصه‌ی مصور؛ قصه‌خوان تعاملی با انتخاب مسیر، خواندن صوتی، اندازه‌ی متن، نشانک |
| محیط کودک | `/kids` | انتخاب پروفایل، مأموریت روزانه، پیشنهاد هوشمند، دنیاها، مدال‌ها، دروازه‌ی والدین |
| استودیو نقاشی | `/kids/studio` | قلم، مداد شمعی، سطل رنگ، پاک‌کن، Undo/Redo، قالب رنگ‌آمیزی، گالری، خروجی PNG |
| پنل والدین | `/parent` | KPI، نمودار زمان با سقف، مهارت‌ها، پیشنهادها، تاریخچه، تنظیمات زمان و حریم خصوصی، گزارش‌ها، **بازی‌ساز خانواده** (`/parent/games`: قطار الگو با ۶ تا ۱۲ واگن و الگوی ۲ تا ۴ شکلی، تنگ ماهی تا ۱۵ شیء، کارت‌های حافظه با تصویر دلخواه؛ فقط برای کودکان همان خانواده) |
| سیستم طراحی | `/design-system` | توکن‌ها، تایپوگرافی، دکمه‌ها، کامپوننت‌ها، تصویرسازی، سه تم |

## Backend و پنل مدیریت

| بخش | توضیح |
|---|---|
| API v1 | بیش از ۵۰ مسیر در ۱۲ ماژول: احراز هویت، کودکان، محتوا، کاربرگ، بازی، قصه، درس، پیشرفت، پیشنهاد، اشتراک، داشبورد والدین |
| پرداخت | درگاه زرین‌پال (REST v4) با تأیید سمت سرور؛ صفحه‌ی اشتراک و پرداخت در پنل والدین |
| گزارش | گزارش PDF فارسی (Gotenberg یا Chromium) در صف پردازش |
| امنیت | توکن والد / توکن محدود جلسه‌ی کودک، کنترل مالکیت، محدودیت نرخ، رضایت‌نامه، حذف و خروجی داده |
| گیمیفیکیشن | ستاره‌ی محاسبه‌شده در سرور، امتیاز، مدال‌های قاعده‌محور، مشاهده‌ی مهارت |
| پنل مدیریت `/admin` | Filament فارسی و راست‌به‌چپ؛ ساخت کاربرگ/بازی/قصه بدون کدنویسی، آپلود کاربرگ آماده (PDF/تصویر تا ۳۰ مگابایت، ذخیره‌ی خصوصی)، گردش کار تأیید، نسخه‌بندی |
| تست | ۵۱ تست Feature روی PostgreSQL |

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

**نصب روی سرور Ubuntu 24.04 (یک خط، با HTTPS خودکار):**

```bash
curl -fsSL https://raw.githubusercontent.com/ferya3/koodak/HEAD/infrastructure/install.sh | sudo bash -s -- --domain example.com --email you@example.com
```

جزئیات: [`docs/deploy.md`](docs/deploy.md)

**با Docker (محلی):**

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
