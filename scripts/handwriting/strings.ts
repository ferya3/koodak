/** فهرست متن‌های فارسی که در کاربرگ‌ها ردگیری می‌شوند → JSON (ورودی render.cjs) */
import { writeFileSync } from "node:fs";
import { faForms, faLetters } from "../../apps/web/lib/data/alphabet";
import { worksheets } from "../../apps/web/lib/data/content";

const out = process.argv[2] ?? "fa-strings.json";
const set = new Set<string>();
for (const l of faLetters) {
  faForms(l).forEach((f) => set.add(f));
  set.add(l.word);
}
"۰۱۲۳۴۵۶۷۸۹".split("").forEach((d) => set.add(d));
set.add("۱۰");
for (const w of worksheets.filter((x) => x.template === "tracing")) {
  const letter = String(w.params.letter);
  const word = String(w.params.word ?? "");
  (letter.length > 1 ? letter.split("") : [letter]).forEach((c) => /[؀-ۿ]/.test(c) && set.add(c));
  if (/[؀-ۿ]/.test(word)) set.add(word);
}
writeFileSync(out, JSON.stringify([...set]));
console.log(set.size, "strings →", out);
