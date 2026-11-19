# ── KidsWorld API (Laravel + PHP-FPM) ──
FROM php:8.3-fpm-alpine AS base

RUN apk add --no-cache icu-libs libzip libpng libjpeg-turbo freetype postgresql-libs \
 && apk add --no-cache --virtual .build $PHPIZE_DEPS icu-dev libzip-dev libpng-dev libjpeg-turbo-dev freetype-dev postgresql-dev linux-headers \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j$(nproc) pdo_pgsql intl zip gd opcache pcntl bcmath \
 && pecl install redis && docker-php-ext-enable redis \
 && apk del .build

COPY infrastructure/docker/php/php.ini /usr/local/etc/php/conf.d/zz-kidsworld.ini
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html

# ── وابستگی‌ها (لایه‌ی جداگانه برای کش) ──
FROM base AS vendor
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# ── ایمیج نهایی ──
FROM base AS app
COPY --from=vendor /var/www/html/vendor ./vendor
COPY backend/ ./
RUN composer dump-autoload --optimize --no-dev \
 && php artisan filament:assets \
 && chown -R www-data:www-data storage bootstrap/cache
USER www-data
EXPOSE 9000
CMD ["php-fpm"]
