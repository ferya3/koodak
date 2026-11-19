# KidsWorld API

Laravel 13 · Modular Monolith · PostgreSQL · Redis · Sanctum · Filament 5

مستند کامل معماری و مرجع API: [`docs/architecture/backend.md`](../docs/architecture/backend.md)

## راه‌اندازی محلی

```bash
composer install
cp .env.example .env && php artisan key:generate
php artisan migrate --seed
php artisan serve
php artisan queue:work      # برای ساخت گزارش‌ها
php artisan schedule:work   # انتشار زمان‌بندی‌شده و حذف داده‌ها
```

حساب‌های نمایشی (فقط محیط توسعه):

| نقش | ایمیل | رمز |
|---|---|---|
| مدیر (پنل `/admin`) | admin@kidsworld.test | password |
| کارشناس محتوا | editor@kidsworld.test | password |
| والد (دو فرزند + یک هفته سابقه) | parent@kidsworld.test | password |

## تست

```bash
php artisan test        # پایگاه داده‌ی kidsworld_test روی PostgreSQL
./vendor/bin/pint --test
```

## ساختار

```
app/Modules/<Module>/
  Database/Migrations/   جداول متعلق به ماژول
  Models/ Http/ Policies/ Support/ Events/ Listeners/ Jobs/
  routes.php             زیر /api/v1
  <Module>ServiceProvider.php
app/Filament/            پنل مدیریت محتوا
database/seeders/data/   داده‌ی نمونه‌ی مشترک با Frontend (JSON)
```
