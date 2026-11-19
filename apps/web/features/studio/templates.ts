/**
 * قالب‌های رنگ‌آمیزی استودیو (Line Art).
 * در CMS هر قالب یک SVG با خطوط بسته است؛ پرشدن با «سطل رنگ» از همین خطوط به‌عنوان دیوار استفاده می‌کند.
 * ابعاد: 1200×900
 */
const wrap = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900"><g fill="none" stroke="#1f1a3d" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;

export interface ColoringTemplate {
  id: string;
  title: string;
  svg: string;
}

export const coloringTemplates: ColoringTemplate[] = [
  {
    id: "fish",
    title: "ماهی خوشحال",
    svg: wrap(`
      <path d="M180 450 C 300 230, 620 200, 800 360 L 1020 220 L 990 450 L 1020 680 L 800 540 C 620 700, 300 670, 180 450 Z"/>
      <circle cx="380" cy="410" r="44"/><circle cx="392" cy="398" r="14" fill="#1f1a3d"/>
      <path d="M300 520 Q 350 560 400 520"/>
      <path d="M540 300 C 600 380, 600 520, 540 600"/>
      <path d="M660 310 C 720 390, 720 510, 660 590"/>
      <path d="M520 230 C 560 140, 680 140, 720 250"/>
      <circle cx="180" cy="220" r="40"/><circle cx="120" cy="120" r="24"/><circle cx="1060" cy="790" r="34"/>
      <path d="M80 880 C 120 780, 100 720, 150 660 M200 880 C 220 800, 260 760, 250 700"/>
      <path d="M0 860 C 300 820, 900 900, 1200 840"/>
    `),
  },
  {
    id: "house",
    title: "خانه‌ی ما",
    svg: wrap(`
      <path d="M300 820 L 300 450 L 600 200 L 900 450 L 900 820 Z"/>
      <path d="M240 480 L 600 170 L 960 480"/>
      <rect x="520" y="600" width="160" height="220" rx="16"/>
      <circle cx="650" cy="710" r="10" fill="#1f1a3d"/>
      <rect x="360" y="520" width="120" height="120" rx="10"/><path d="M420 520 L 420 640 M360 580 L 480 580"/>
      <rect x="720" y="520" width="120" height="120" rx="10"/><path d="M780 520 L 780 640 M720 580 L 840 580"/>
      <rect x="740" y="240" width="70" height="140"/>
      <circle cx="1050" cy="150" r="80"/>
      <path d="M1050 30 L 1050 50 M1050 250 L 1050 270 M930 150 L 950 150 M1150 150 L 1170 150"/>
      <path d="M80 260 C 60 210, 120 180, 150 200 C 170 150, 260 150, 270 210 C 320 210, 320 270, 270 270 L 110 270 C 80 270, 70 260, 80 260 Z"/>
      <path d="M0 830 L 1200 830"/>
      <path d="M100 830 L 100 700 M60 740 C 60 640, 140 640, 140 740 Z"/>
      <path d="M1080 830 L 1080 680 M1030 720 C 1030 600, 1130 600, 1130 720 Z"/>
    `),
  },
  {
    id: "flower",
    title: "گل بهاری",
    svg: wrap(`
      <circle cx="600" cy="330" r="80"/>
      <circle cx="600" cy="170" r="90"/><circle cx="752" cy="280" r="90"/><circle cx="694" cy="460" r="90"/>
      <circle cx="506" cy="460" r="90"/><circle cx="448" cy="280" r="90"/>
      <path d="M600 410 C 610 560, 590 700, 600 860"/>
      <path d="M600 640 C 700 560, 820 580, 860 620 C 780 700, 680 700, 600 640 Z"/>
      <path d="M600 720 C 500 640, 380 660, 340 700 C 420 780, 520 780, 600 720 Z"/>
      <path d="M150 300 C 120 240, 180 200, 210 240 C 240 200, 300 240, 270 300 C 250 340, 170 340, 150 300 Z"/>
      <path d="M210 330 L 210 380"/>
      <circle cx="1000" cy="200" r="34"/><circle cx="1060" cy="260" r="20"/>
      <path d="M0 860 C 300 830, 900 880, 1200 850"/>
    `),
  },
];

export const svgToDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
