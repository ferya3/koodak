#!/bin/sh
# KidsWorld API entrypoint
# ۱) فایل‌های public (assetهای Filament و index.php) را با Volume مشترک وب‌سرور همگام می‌کند
# ۲) کش پیکربندی، مسیرها و قالب‌ها را با متغیرهای محیطی همین اجرا می‌سازد
set -e

if [ -d /var/www/public-shared ] && [ -w /var/www/public-shared ]; then
  cp -a /var/www/html/public/. /var/www/public-shared/
fi

php artisan config:cache >/dev/null
php artisan route:cache >/dev/null
php artisan view:cache >/dev/null

exec "$@"
