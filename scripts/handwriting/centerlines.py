"""
استخراج «خط مرکزی» (تک‌خطی) حروف و کلمه‌های فارسی از فونت Vazirmatn برای کاربرگ‌های ردگیری.

ورودی: پوشه‌ای از PNGهای رندرشده با مرورگر (شکل‌دهی درست حروف چسبان) + meta.json
خروجی: JSON با مسیرهای تک‌خطی در واحد «درصد اندازه‌ی فونت» (۱۰۰ = یک em)، مبدأ = لبه‌ی چپ جوهر و خط کرسی.

مراحل: اسکلت‌سازی (skeletonize) ← هرس شاخه‌های کوتاه ← ردیابی گراف به خطوط ← ساده‌سازی (RDP) ← نرم‌کردن (Chaikin).
نقطه‌های حروف (ب، پ، ت، ...) جدا تشخیص داده و به‌صورت دایره ذخیره می‌شوند.

اجرا: python3 scripts/handwriting/centerlines.py <glyph-dir> <out.json>
"""

import json
import sys
from math import hypot

import numpy as np
from PIL import Image
from skimage.measure import label, regionprops
from skimage.morphology import remove_small_holes, skeletonize

N8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


def nbrs(p, S):
    y, x = p
    return [(y + dy, x + dx) for dy, dx in N8 if (y + dy, x + dx) in S]


def prune(S, max_len):
    """حذف شاخه‌های کوتاهِ متصل به تقاطع (زائده‌های اسکلت در گوشه‌ها و انتهای خطوط)"""
    for _ in range(4):
        deg = {p: len(nbrs(p, S)) for p in S}
        removed = False
        for e in [p for p in S if deg[p] == 1]:
            if e not in S:
                continue
            path, prev, cur = [e], None, e
            hit_junction = False
            while True:
                nxt = [q for q in nbrs(cur, S) if q != prev and q not in path]
                if not nxt:
                    break
                if any(deg[q] > 2 for q in nxt) or len(nxt) > 1:
                    hit_junction = True
                    break
                prev, cur = cur, nxt[0]
                path.append(cur)
                if len(path) > max_len:
                    break
            if hit_junction and len(path) <= max_len:
                S -= set(path)
                removed = True
        if not removed:
            break
    return S


def trace(S):
    """تبدیل اسکلت به چندخطی‌ها: یال‌ها بین گره‌ها (انتها/تقاطع) + حلقه‌های بسته"""
    deg = {p: len(nbrs(p, S)) for p in S}
    nodes = {p for p in S if deg[p] != 2}
    junction = {p for p in nodes if deg[p] > 2}
    # خوشه‌بندی پیکسل‌های تقاطع مجاور → یک نقطه‌ی مرکزی
    cluster, centers = {}, []
    for p in junction:
        if p in cluster:
            continue
        stack, members = [p], []
        cluster[p] = len(centers)
        while stack:
            q = stack.pop()
            members.append(q)
            for r in nbrs(q, S):
                if r in junction and r not in cluster:
                    cluster[r] = len(centers)
                    stack.append(r)
        centers.append((sum(m[0] for m in members) / len(members), sum(m[1] for m in members) / len(members)))

    used_steps, covered, lines = set(), set(), []
    for n in nodes:
        for q in nbrs(n, S):
            if (n, q) in used_steps or (q in cluster and n in cluster and cluster[q] == cluster[n]):
                continue
            path = [n, q]
            used_steps |= {(n, q), (q, n)}
            prev, cur = n, q
            while cur not in nodes:
                nxt = [r for r in nbrs(cur, S) if r != prev and (cur, r) not in used_steps and r not in path[-4:]]
                if not nxt:
                    break
                # در پله‌های قطری ممکن است دو همسایه باشد؛ نزدیک‌ترین (افقی/عمودی) را بردار
                nxt.sort(key=lambda r: abs(r[0] - cur[0]) + abs(r[1] - cur[1]))
                r = nxt[0]
                used_steps |= {(cur, r), (r, cur)}
                path.append(r)
                prev, cur = cur, r
            covered |= set(path)
            pts = [(float(y), float(x)) for y, x in path]
            if path[0] in cluster:
                pts[0] = centers[cluster[path[0]]]
            if path[-1] in cluster:
                pts[-1] = centers[cluster[path[-1]]]
            lines.append(pts)

    # حلقه‌های بدون گره (مثل «ه»، «و»، «۵»)
    rest = S - covered
    while rest:
        start = next(iter(rest))
        path, prev, cur = [start], None, start
        while True:
            nxt = [r for r in nbrs(cur, S) if r != prev and r in rest and r not in path]
            if not nxt:
                break
            prev, cur = cur, nxt[0]
            path.append(cur)
        rest -= set(path)
        if len(path) > 3:
            path.append(path[0])
            lines.append([(float(y), float(x)) for y, x in path])
    return lines


def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    (y1, x1), (y2, x2) = pts[0], pts[-1]
    L = hypot(y2 - y1, x2 - x1)
    dmax, idx = 0.0, 0
    for i in range(1, len(pts) - 1):
        y0, x0 = pts[i]
        # حلقه‌ی بسته (ابتدا = انتها): فاصله تا نقطه، نه تا خط؛ وگرنه کل حلقه حذف می‌شود
        d = hypot(y0 - y1, x0 - x1) if L < 1 else abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1)) / L
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [pts[0], pts[-1]]


def chaikin(pts, it=2):
    closed = len(pts) > 3 and pts[0] == pts[-1]
    for _ in range(it):
        if len(pts) < 3:
            return pts
        out = [pts[0]] if not closed else []
        for a, b in zip(pts, pts[1:]):
            out += [(0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]), (0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1])]
        out = out + [pts[-1]] if not closed else out + [out[0]]
        pts = out
    return pts


def length(pts):
    return sum(hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pts, pts[1:]))


def main(gdir, out_path):
    meta = json.load(open(f"{gdir}/meta.json"))
    result = {}
    for m in meta:
        px, base = m["px"], m["baseline"]
        ink = np.array(Image.open(f"{gdir}/{m['i']}.png").convert("L")) < 128
        # فقط حفره‌های چندپیکسلی (نویز لبه) پر شوند؛ حفره‌ی واقعی حروف (ص، ط، و، ه) باید بماند
        ink = remove_small_holes(ink, max_size=6)
        ys, xs = np.nonzero(ink)
        xmin, xmax, ymin, ymax = xs.min(), xs.max(), ys.min(), ys.max()
        u = lambda y, x: (round((x - xmin) / px * 100, 1), round((y - base) / px * 100, 1))
        lab = label(ink, connectivity=2)
        strokes, dots = [], []
        for r in regionprops(lab):
            h, w = r.bbox[2] - r.bbox[0], r.bbox[3] - r.bbox[1]
            if max(h, w) < 0.16 * px and max(h, w) / max(1, min(h, w)) < 1.9:
                cy, cx = r.centroid
                dots.append(u(cy, cx))
                continue
            comp = lab == r.label
            S = set(map(tuple, np.argwhere(skeletonize(comp))))
            S = prune(S, int(px * 0.085))
            for line in trace(S):
                if length(line) < px * 0.04:
                    continue
                line = rdp(line, 1.6)
                line = chaikin(line, 2)
                line = rdp(line, 0.5)
                strokes.append([u(y, x) for y, x in line])
        d = " ".join("M" + " L".join(f"{x} {y}" for x, y in s) for s in strokes)
        result[m["s"]] = {
            "w": round((xmax - xmin) / px * 100, 1),
            "top": round((ymin - base) / px * 100, 1),
            "bottom": round((ymax - base) / px * 100, 1),
            "d": d,
            "dots": dots,
        }
    json.dump(result, open(out_path, "w"), ensure_ascii=False, separators=(",", ":"))
    print(len(result), "glyphs →", out_path)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
