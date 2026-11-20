"""خروجی centerlines.py → apps/web/lib/handwriting/persian.ts"""
import json
import sys

src, dst = sys.argv[1], sys.argv[2]
body = json.dumps(json.load(open(src)), ensure_ascii=False, separators=(",", ":"))
open(dst, "w").write(
    "/**\n * خط مرکزی (تک‌خطی) حروف، شکل‌های چسبان، کلمه‌ها و ارقام فارسی – استخراج‌شده از فونت Vazirmatn.\n"
    " * فایل تولیدی است؛ دستی ویرایش نکنید. ساخت دوباره: scripts/handwriting/README.md\n *\n"
    " * واحد: ۱۰۰ = اندازه‌ی فونت (em). مبدأ: لبه‌ی چپ جوهر و خط کرسی (y منفی = بالای کرسی).\n */\n"
    "export interface CenterlineGlyph {\n  w: number;\n  top: number;\n  bottom: number;\n  d: string;\n  dots: [number, number][];\n}\n\n"
    f"export const PERSIAN_CENTERLINES: Record<string, CenterlineGlyph> = {body};\n"
)
print("wrote", dst)
