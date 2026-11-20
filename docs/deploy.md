# استقرار روی سرور (Ubuntu 24.04)

## پیش‌نیازها
- یک سرور Ubuntu 24.04 با حداقل ۲ گیگابایت RAM و ۲۰ گیگابایت دیسک (برای حافظه‌ی کمتر از ۳.۵ گیگ، اسکریپت خودش Swap می‌سازد).
- دو رکورد DNS از نوع **A** به IP سرور: `example.com` و `api.example.com`.
- پورت‌های 80 و 443 باز.

## نصب (یک خط)

```bash
curl -fsSL https://raw.githubusercontent.com/ferya3/koodak/HEAD/infrastructure/install.sh | sudo bash -s -- --domain example.com --email you@example.com
```

با درگاه زرین‌پال:

```bash
curl -fsSL https://raw.githubusercontent.com/ferya3/koodak/HEAD/infrastructure/install.sh | sudo bash -s -- --domain example.com --email you@example.com --zarinpal-merchant YOUR-MERCHANT-UUID
```

(برای تست، `--zarinpal-sandbox` را هم اضافه کنید.)

## اسکریپت چه می‌کند
1. نصب Docker Engine و Compose از مخزن رسمی Docker.
2. ساخت Swap روی سرورهای کم‌حافظه و باز کردن پورت‌ها در UFW (اگر فعال باشد).
3. دریافت کد در `/opt/kidsworld`.
4. ساخت `.env` و `backend/.env.docker` با **رمزهای تصادفی** (فقط بار اول؛ دسترسی 600).
5. ساخت و اجرای سرویس‌ها با `docker-compose.yml` + `docker-compose.prod.yml`:
   PostgreSQL · Redis · API (PHP-FPM) · Queue · Scheduler · Next.js · Gotenberg (PDF) · **Caddy** (HTTPS خودکار Let's Encrypt).
6. اجرای Migrationها، بارگذاری محتوای اولیه و ساخت حساب مدیر (فقط بار اول). رمز مدیر در `/root/kidsworld-credentials.txt` ذخیره می‌شود.

| آدرس | سرویس |
|---|---|
| `https://example.com` | سایت، محیط کودک، پنل والدین |
| `https://api.example.com/admin` | پنل مدیریت محتوا |
| `https://api.example.com/api/v1` | API |

## به‌روزرسانی
همان دستور نصب را دوباره اجرا کنید: کد تازه دریافت، سرویس‌ها دوباره ساخته و Migrationها اجرا می‌شوند. تنظیمات، رمزها و داده‌ها حفظ می‌شوند و محتوای اولیه دوباره بارگذاری نمی‌شود.

اگر به‌روزرسانی محتوای تولیدی (کاربرگ‌ها، درس‌ها، بازی‌ها) هم آمده است، بعد از آن این دستور را بزنید (بی‌خطر و قابل تکرار؛ محتوای ساخته‌شده در پنل مدیریت دست نمی‌خورد):

```bash
cd /opt/kidsworld && docker compose -f docker-compose.yml -f docker-compose.prod.yml exec api php artisan db:seed --class='Database\Seeders\CatalogSeeder' --force
```

به‌روزرسانی دستی (بدون نصاب) سه مرحله است: `git fetch` و `git reset --hard origin/<branch>`، سپس `up -d --build`، سپس `exec api php artisan migrate --force` و در صورت نیاز Seed بالا.

## آپلود کاربرگ آماده (PDF یا تصویر)
۱. در `/admin` ← محتواها ← ایجاد: نوع «کاربرگ»، دسته «کاربرگ‌ها» و موضوع (قفسه) را انتخاب کنید.
۲. در زبانه‌ی «جزئیات فعالیت» قالب را «فایل آماده» بگذارید، فایل (PDF/PNG/JPG/WebP تا ۳۰ مگابایت) و یک تصویر پیش‌نمایش آپلود کنید. تعداد صفحه‌های PDF خودکار شمرده می‌شود.
۳. در «انتشار و سئو» وضعیت را «منتشرشده» کنید. کاربرگ در قفسه و جستجو ظاهر می‌شود (حداکثر ۵ دقیقه کش).

فایل‌ها روی دیسک خصوصی (Volume `api-storage`) ذخیره می‌شوند و فقط از مسیر API تحویل داده می‌شوند؛ کاربرگ «ویژه» را فقط والد دارای اشتراک دانلود می‌کند. تصویر پیش‌نمایش برای همه عمومی است، پس برای کاربرگ ویژه نسخه‌ی کم‌کیفیت یا واترمارک‌دار بگذارید. فقط محتوایی آپلود کنید که خودتان ساخته‌اید یا مجوز انتشارش را دارید.

## دستورهای مفید

```bash
cd /opt/kidsworld && docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

```bash
cd /opt/kidsworld && docker compose -f docker-compose.yml -f docker-compose.prod.yml exec api php artisan kidsworld:admin another-admin@example.com
```

```bash
cd /opt/kidsworld && docker compose -f docker-compose.yml -f docker-compose.prod.yml exec -T postgres pg_dump -U kidsworld kidsworld | gzip > ~/kidsworld-$(date +%F).sql.gz
```

## نکته‌های امنیتی
- بدون `--zarinpal-merchant`، بخش اشتراک خاموش است و همه‌ی محتوا رایگان در دسترس است (دکمه‌ی خرید نمایش داده نمی‌شود).
- دامنه‌ی `api.example.com` باید همان دامنه‌ی ثبت‌شده در پنل زرین‌پال باشد.
- پشتیبان‌گیری منظم از پایگاه داده (دستور بالا) و Volumeها را برنامه‌ریزی کنید؛ اسکریپت آن را خودکار نمی‌کند.
- Laravel فقط از شبکه‌ی داخلی Docker به هدر `X-Forwarded-For` اعتماد می‌کند؛ پورت داخلی 8080 Caddy به اینترنت باز نیست.
