# حروف تک‌خطی برای ردگیری

کاربرگ‌های ردگیری به‌جای «دورِ حرف» (دوخطی) یک خط نقطه‌چین روی مسیر نوشتن نشان می‌دهند.

- **انگلیسی و ارقام لاتین:** دست‌طراحی‌شده به سبک تحریری استاندارد مدرسه در
  `apps/web/lib/handwriting/latin.ts` (ضربه‌ها با ترتیب و جهت نوشتن؛ نقطه‌ی سبز = شروع ضربه).
- **فارسی (حروف، شکل‌های چسبان، کلمه‌ها، ارقام):** خط مرکزیِ استخراج‌شده از فونت Vazirmatn در
  `apps/web/lib/handwriting/persian.ts` (فایل تولیدی).

## ساخت دوباره‌ی خطوط فارسی (مثلاً بعد از افزودن کلمه‌ی تازه)

```bash
pip install scikit-image numpy pillow
mkdir -p /tmp/hw/glyphs
npx tsx --tsconfig apps/web/tsconfig.json scripts/handwriting/strings.ts /tmp/hw/fa-strings.json
node scripts/handwriting/render.cjs /tmp/hw apps/web/public/fonts/Vazirmatn.woff2
python3 scripts/handwriting/centerlines.py /tmp/hw/glyphs /tmp/hw/fa-centerlines.json
python3 scripts/handwriting/to-ts.py /tmp/hw/fa-centerlines.json apps/web/lib/handwriting/persian.ts
```

متنی که خط مرکزی نداشته باشد، به ردگیری قدیمی (دورِ حرف) برمی‌گردد؛ پس کاربرگ هیچ‌وقت خالی نمی‌ماند.
