const { chromium } = require('playwright');
const fs = require('fs');
/** رندر متن‌های فارسی با Vazirmatn در Chromium (شکل‌دهی درست حروف چسبان) → PNG + meta.json
 * اجرا: node render.cjs <work-dir شامل fa-strings.json> <مسیر Vazirmatn.woff2> */
const [S, fontPath] = process.argv.slice(2);
(async () => {
  const strings = JSON.parse(fs.readFileSync(`${S}/fa-strings.json`, 'utf8'));
  const font = fs.readFileSync(fontPath).toString('base64');
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent('<html><body></body></html>');
  const out = await p.evaluate(async ({ strings, font }) => {
    const ff = new FontFace('VZ', `url(data:font/woff2;base64,${font})`, { weight: '100 900' });
    await ff.load(); document.fonts.add(ff);
    const PX = 200, res = [];
    for (const s of strings) {
      const c = document.createElement('canvas'); c.width = PX * (s.length + 2); c.height = PX * 2;
      const g = c.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = '#000'; g.font = `400 ${PX}px VZ`; g.direction = 'rtl'; g.textAlign = 'right'; g.textBaseline = 'alphabetic';
      const baseline = Math.round(PX * 1.25);
      g.fillText(s, c.width - PX / 2, baseline);
      res.push({ s, png: c.toDataURL('image/png'), baseline, px: PX });
    }
    return res;
  }, { strings, font });
  out.forEach((o, i) => fs.writeFileSync(`${S}/glyphs/${i}.png`, Buffer.from(o.png.split(',')[1], 'base64')));
  fs.writeFileSync(`${S}/glyphs/meta.json`, JSON.stringify(out.map(({ s, baseline, px }, i) => ({ i, s, baseline, px }))));
  console.log('rendered', out.length);
  await b.close();
})();
