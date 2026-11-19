/**
 * داده‌ی نمونه یک منبع دارد: apps/web/lib/data/*.ts
 * این اسکریپت آن را به JSON برای Seederهای Laravel صادر می‌کند:
 *   pnpm seed:export
 * (Node 22+ فایل‌های TypeScript بدون import محلی را مستقیم اجرا می‌کند)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = process.argv[2] ?? path.join(repo, "apps/web/lib/data");
const out = process.argv[3] ?? path.join(repo, "backend/database/seeders/data");

const tax = await import(path.join(root, "taxonomy.ts"));
const content = await import(path.join(root, "content.ts"));
const family = await import(path.join(root, "family.ts"));
const learning = await import(path.join(root, "lessons.ts"));

const write = (name, data) => fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify(data, null, 2) + "\n");
write("taxonomy", { ageGroups: tax.ageGroups, categories: tax.categories, subjects: tax.subjects, skills: tax.skills });
write("content", { worksheets: content.worksheets, games: content.games, stories: content.stories });
write("lessons", { lessons: learning.lessons });
write("commerce", { plans: family.plans, achievements: family.achievements });
console.log(`seed data written to ${path.relative(repo, out)}`);
