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
