#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════════
#  KidsWorld · نصب / به‌روزرسانی خودکار روی Ubuntu 24.04
#
#  curl -fsSL https://raw.githubusercontent.com/ferya3/koodak/HEAD/infrastructure/install.sh \
#    | sudo bash -s -- --domain example.com --email you@example.com
#
#  پیش‌نیاز: رکورد DNS از نوع A برای example.com و api.example.com به IP همین سرور.
#  اجرای دوباره = به‌روزرسانی (دریافت کد تازه، ساخت دوباره، اجرای Migrationها).
# ════════════════════════════════════════════════════════════════════
set -Eeuo pipefail

REPO="https://github.com/ferya3/koodak.git"
BRANCH=""
DIR="/opt/kidsworld"
DOMAIN=""
EMAIL=""
ZP_MERCHANT=""
ZP_SANDBOX="false"

usage() {
  cat <<'USAGE'
گزینه‌ها:
  --domain example.com        دامنه‌ی اصلی (الزامی) – پنل مدیریت روی api.example.com
  --email you@example.com     ایمیل برای گواهی HTTPS (الزامی)
  --zarinpal-merchant UUID    کد پذیرنده‌ی زرین‌پال (اختیاری؛ بدون آن بخش اشتراک خاموش است)
  --zarinpal-sandbox          استفاده از محیط آزمایشی زرین‌پال
  --branch NAME               شاخه‌ی گیت (پیش‌فرض: شاخه‌ی اصلی مخزن)
  --dir /opt/kidsworld        مسیر نصب
  --repo URL                  آدرس مخزن
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain) DOMAIN="${2:-}"; shift 2 ;;
    --email) EMAIL="${2:-}"; shift 2 ;;
    --zarinpal-merchant) ZP_MERCHANT="${2:-}"; shift 2 ;;
    --zarinpal-sandbox) ZP_SANDBOX="true"; shift ;;
    --branch) BRANCH="${2:-}"; shift 2 ;;
    --dir) DIR="${2:-}"; shift 2 ;;
    --repo) REPO="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "گزینه‌ی ناشناخته: $1"; usage; exit 1 ;;
  esac
done

c_green='\033[1;32m'; c_yellow='\033[1;33m'; c_red='\033[1;31m'; c_off='\033[0m'
step() { echo -e "\n${c_green}▶ $*${c_off}"; }
warn() { echo -e "${c_yellow}⚠ $*${c_off}"; }
die()  { echo -e "${c_red}✖ $*${c_off}" >&2; exit 1; }
trap 'die "خطا در خط $LINENO. خروجی بالا را بررسی کنید."' ERR

# ── پیش‌بررسی‌ها ──────────────────────────────────────────────
[[ $EUID -eq 0 ]] || die "این اسکریپت باید با sudo اجرا شود."
. /etc/os-release
[[ "${ID:-}" == "ubuntu" ]] || die "فقط Ubuntu پشتیبانی می‌شود (سیستم فعلی: ${PRETTY_NAME:-نامشخص})."
[[ "${VERSION_ID:-}" == "24.04" ]] || warn "این اسکریپت برای Ubuntu 24.04 تست شده است؛ نسخه‌ی فعلی ${VERSION_ID}."

# اگر دامنه/ایمیل داده نشده و ترمینال در دسترس است، پرسیده می‌شود (حتی وقتی از curl | bash اجرا شده)
if [[ -z "$DOMAIN" || -z "$EMAIL" ]] && [[ -r /dev/tty ]]; then
  [[ -n "$DOMAIN" ]] || read -rp "دامنه‌ی اصلی (مثلاً example.com): " DOMAIN </dev/tty
  [[ -n "$EMAIL" ]] || read -rp "ایمیل برای گواهی HTTPS: " EMAIL </dev/tty
fi
[[ -n "$DOMAIN" && -n "$EMAIL" ]] || { usage; die "--domain و --email الزامی هستند."; }
DOMAIN="${DOMAIN,,}"; DOMAIN="${DOMAIN#http://}"; DOMAIN="${DOMAIN#https://}"; DOMAIN="${DOMAIN%%/*}"
[[ "$DOMAIN" =~ ^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]] || die "دامنه معتبر نیست: $DOMAIN"

# ── بسته‌های پایه ─────────────────────────────────────────────
step "نصب بسته‌های پایه"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq ca-certificates curl git openssl dnsutils >/dev/null

# ── Docker Engine + Compose (مخزن رسمی Docker) ───────────────
if ! command -v docker >/dev/null || ! docker compose version >/dev/null 2>&1; then
  step "نصب Docker"
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${UBUNTU_CODENAME:-$VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null
  systemctl enable --now docker >/dev/null
else
  step "Docker از قبل نصب است ($(docker --version | cut -d, -f1))"
fi

# ── Swap برای سرورهای کم‌حافظه (ساخت Next.js و Composer) ─────
mem_mb=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
if (( mem_mb < 3500 )) && ! swapon --show | grep -q .; then
  step "ساخت ۲ گیگابایت Swap (حافظه‌ی سرور: ${mem_mb}MB)"
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# ── فایروال ──────────────────────────────────────────────────
if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
  step "باز کردن پورت‌های 80 و 443 در UFW"
  ufw allow 80/tcp >/dev/null; ufw allow 443/tcp >/dev/null; ufw allow 443/udp >/dev/null
fi

# ── کد برنامه ────────────────────────────────────────────────
if [[ -d "$DIR/.git" ]]; then
  step "به‌روزرسانی کد در $DIR"
  git -C "$DIR" fetch --quiet origin
  [[ -n "$BRANCH" ]] || BRANCH=$(git -C "$DIR" rev-parse --abbrev-ref HEAD)
  git -C "$DIR" checkout --quiet "$BRANCH"
  git -C "$DIR" reset --quiet --hard "origin/$BRANCH"
else
  step "دریافت کد در $DIR"
  git clone --quiet ${BRANCH:+--branch "$BRANCH"} "$REPO" "$DIR"
fi
cd "$DIR"

# ── پیکربندی (فقط بار اول ساخته می‌شود؛ رمزها تصادفی‌اند) ────
rand() { openssl rand -hex "${1:-24}"; }
setenv() { # setenv FILE KEY VALUE
  if grep -q "^$2=" "$1"; then sed -i "s|^$2=.*|$2=$3|" "$1"; else echo "$2=$3" >> "$1"; fi
}

if [[ ! -f .env ]]; then
  step "ساخت تنظیمات و رمزهای تصادفی"
  DB_PASSWORD=$(rand 24)
  cat > .env <<ENV
DOMAIN=$DOMAIN
ACME_EMAIL=$EMAIL
DB_PASSWORD=$DB_PASSWORD
PUBLIC_API_URL=https://api.$DOMAIN
PUBLIC_SITE_URL=https://$DOMAIN
MEILI_MASTER_KEY=$(rand 24)
MINIO_PASSWORD=$(rand 24)
ENV
  chmod 600 .env

  cp backend/.env.docker.example backend/.env.docker
  chmod 600 backend/.env.docker
  setenv backend/.env.docker APP_KEY "base64:$(openssl rand -base64 32)"
  setenv backend/.env.docker APP_URL "https://api.$DOMAIN"
  setenv backend/.env.docker FRONTEND_URL "https://$DOMAIN"
  setenv backend/.env.docker DB_PASSWORD "$DB_PASSWORD"
  setenv backend/.env.docker REPORTS_PDF_DRIVER "gotenberg"
else
  step "تنظیمات موجود حفظ شد (.env و backend/.env.docker)"
  setenv .env DOMAIN "$DOMAIN"
  setenv .env ACME_EMAIL "$EMAIL"
  setenv .env PUBLIC_API_URL "https://api.$DOMAIN"
  setenv .env PUBLIC_SITE_URL "https://$DOMAIN"
  setenv backend/.env.docker APP_URL "https://api.$DOMAIN"
  setenv backend/.env.docker FRONTEND_URL "https://$DOMAIN"
fi

# درگاه پرداخت: بدون کد پذیرنده، بخش اشتراک خاموش می‌ماند (همه‌ی محتوا آزاد است)
if [[ -n "$ZP_MERCHANT" ]]; then
  setenv backend/.env.docker PAYMENT_DRIVER zarinpal
  setenv backend/.env.docker ZARINPAL_MERCHANT_ID "$ZP_MERCHANT"
  setenv backend/.env.docker ZARINPAL_SANDBOX "$ZP_SANDBOX"
  setenv backend/.env.docker KIDSWORLD_FEATURE_SUBSCRIPTIONS true
elif ! grep -q "^ZARINPAL_MERCHANT_ID=..*" backend/.env.docker; then
  setenv backend/.env.docker KIDSWORLD_FEATURE_SUBSCRIPTIONS false
fi

# ── بررسی DNS (فقط هشدار) ─────────────────────────────────────
server_ip=$(curl -4 -fsS --max-time 5 https://api.ipify.org 2>/dev/null || true)
for host in "$DOMAIN" "api.$DOMAIN"; do
  resolved=$(dig +short A "$host" 2>/dev/null | tail -n1 || true)
  if [[ -z "$resolved" ]]; then
    warn "رکورد DNS برای $host پیدا نشد؛ تا تنظیم نشود گواهی HTTPS صادر نمی‌شود."
  elif [[ -n "$server_ip" && "$resolved" != "$server_ip" ]]; then
    warn "$host به $resolved اشاره می‌کند، ولی IP این سرور $server_ip است."
  fi
done

# ── ساخت و اجرا ─────────────────────────────────────────────
COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.prod.yml)
step "ساخت و اجرای سرویس‌ها (بار اول ممکن است ۵ تا ۱۵ دقیقه طول بکشد)"
"${COMPOSE[@]}" up -d --build --remove-orphans

step "اجرای Migrationها (پس از آماده شدن پایگاه داده)"
migrated=0
for _ in $(seq 1 40); do
  if "${COMPOSE[@]}" exec -T api php artisan migrate --force; then migrated=1; break; fi
  sleep 5
done
if (( migrated == 0 )); then die "Migration انجام نشد. لاگ: cd $DIR && ${COMPOSE[*]} logs api postgres"; fi

CREDS=""
if [[ ! -f .installed ]]; then
  step "بارگذاری محتوای اولیه و ساخت حساب مدیر"
  "${COMPOSE[@]}" exec -T api php artisan db:seed --force
  ADMIN_PASS=$(openssl rand -hex 10)
  "${COMPOSE[@]}" exec -T api php artisan kidsworld:admin "admin@$DOMAIN" --password="$ADMIN_PASS" >/dev/null
  umask 077
  printf 'KidsWorld admin panel: https://api.%s/admin\nemail: admin@%s\npassword: %s\n' "$DOMAIN" "$DOMAIN" "$ADMIN_PASS" > /root/kidsworld-credentials.txt
  CREDS="email: admin@$DOMAIN · password: $ADMIN_PASS  (ذخیره‌شده در /root/kidsworld-credentials.txt)"
  date -Iseconds > .installed
fi

# پس از Migration، کش‌ها با تنظیمات تازه ساخته شوند
"${COMPOSE[@]}" restart api queue scheduler >/dev/null

echo -e "\n${c_green}✔ KidsWorld آماده است${c_off}"
echo "  سایت:            https://$DOMAIN"
echo "  پنل مدیریت:      https://api.$DOMAIN/admin"
if [[ -n "$CREDS" ]]; then echo "  حساب مدیر:       $CREDS"; fi
if grep -q "^KIDSWORLD_FEATURE_SUBSCRIPTIONS=false" backend/.env.docker; then
  echo "  اشتراک:          خاموش (برای فعال‌سازی: اجرای دوباره با --zarinpal-merchant <UUID>)"
fi
echo "  به‌روزرسانی:      اجرای دوباره‌ی همین دستور"
echo "  لاگ‌ها:           cd $DIR && ${COMPOSE[*]} logs -f"
