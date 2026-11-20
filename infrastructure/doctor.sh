#!/usr/bin/env bash
# KidsWorld · عیب‌یابی سرور (فقط خواندنی؛ هیچ چیزی را تغییر نمی‌دهد و رمزها را چاپ نمی‌کند)
# اجرا: bash /opt/kidsworld/infrastructure/doctor.sh [domain]
# خروجی در /tmp/kidsworld-doctor.txt هم ذخیره می‌شود.
set -u
DIR=/opt/kidsworld
cd "$DIR" 2>/dev/null || { echo "پوشه‌ی $DIR پیدا نشد"; exit 1; }
DOMAIN="${1:-$(grep -E '^DOMAIN=' .env 2>/dev/null | cut -d= -f2- | tr -d '"')}"
DC=(docker compose -f docker-compose.yml -f docker-compose.prod.yml)
OUT=/tmp/kidsworld-doctor.txt

section() { printf '\n========== %s ==========\n' "$1"; }
probe() { # url [extra curl args...]
  local u="$1"; shift
  printf '%-90s ' "$u"
  curl -s -m 60 -o /tmp/kw-probe.out -w '%{http_code} %{size_download}B %{time_total}s\n' "$@" "$u" || echo "curl failed"
  if grep -qiE "couldn.t load|server error|Application error|Internal Server Error" /tmp/kw-probe.out 2>/dev/null; then
    echo "   ⚠ متن خطا در صفحه:"; grep -oiE ".{0,80}(couldn.t load|server error|Application error|Internal Server Error).{0,80}" /tmp/kw-probe.out | head -3
  fi
}

{
section "نسخه و وضعیت"
date; echo "domain: ${DOMAIN:-نامشخص}"
git log --oneline -1; git status --short | head -5
"${DC[@]}" ps --format 'table {{.Service}}\t{{.Status}}'
free -m | head -2; df -h / | tail -1

section "صفحه‌های سایت (از خود سرور)"
for p in "/" "/worksheets" "/worksheets?subject=english-letters&type=letter-trace" "/worksheets?subject=math&type=clock" "/worksheets/fa-trace-be" "/learn"; do
  probe "https://$DOMAIN$p"
done
echo "-- ناوبری داخلی (درخواست RSC، همان چیزی که کلیک روی منو می‌فرستد):"
probe "https://$DOMAIN/worksheets?subject=english-letters&type=letter-trace&_rsc=doctor" -H "RSC: 1"

section "API از داخل کانتینر web (مسیری که سرور سایت استفاده می‌کند)"
API_INTERNAL=$("${DC[@]}" exec -T web printenv API_URL 2>/dev/null | tr -d '\r')
echo "API_URL داخل web: ${API_INTERNAL:-خالی!}"
for p in "/api/v1/categories" "/api/v1/worksheets?perPage=60&page=1" "/api/v1/worksheets?perPage=60&page=8" "/api/v1/learning/subjects"; do
  printf '%-60s ' "$p"
  "${DC[@]}" exec -T web node -e '
    const t=Date.now();
    fetch(process.argv[1],{headers:{Accept:"application/json"}}).then(async r=>{const b=await r.text();let x="";try{const j=JSON.parse(b);x=j.meta?`total=${j.meta.total}`:(j.message?`message=${j.message}`:`items=${(j.data||[]).length}`)}catch{x=b.slice(0,120)};console.log(r.status,b.length+"B",(Date.now()-t)+"ms",x)}).catch(e=>console.log("FETCH ERROR",e.message))' "${API_INTERNAL}${p}" 2>&1 | tail -1
done

section "پایگاه داده و محتوا"
"${DC[@]}" exec -T api php artisan migrate:status 2>&1 | tail -4
"${DC[@]}" exec -T api php artisan tinker --execute='echo "contents=".App\Modules\Catalog\Models\Content::count()." published=".App\Modules\Catalog\Models\Content::published()->count()." subjects=".App\Modules\Catalog\Models\Subject::count().PHP_EOL;' 2>&1 | tail -1

section "لاگ سایت (web) – خطاها"
"${DC[@]}" logs --tail=300 web 2>&1 | grep -iE "error|digest|fail|unhandled|ECONN|timeout" | tail -25
echo "-- ۲۰ خط آخر:"; "${DC[@]}" logs --tail=20 web 2>&1

section "لاگ Laravel – خطاها"
"${DC[@]}" exec -T api sh -c 'tail -n 400 storage/logs/laravel.log 2>/dev/null' | grep -E "^\[[0-9-]+ [0-9:]+\] [a-z]+\.(ERROR|CRITICAL|ALERT|EMERGENCY)" | tail -10 | cut -c1-400
"${DC[@]}" logs --tail=200 api caddy 2>&1 | grep -iE "error|warn|fatal" | tail -10 | cut -c1-300
} 2>&1 | tee "$OUT"

echo; echo "✔ خروجی کامل در $OUT ذخیره شد. همه‌ی متن بالا را کپی کنید و بفرستید."
