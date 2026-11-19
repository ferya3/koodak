import { cn } from "@/lib/utils";

/**
 * «پیکو» – شخصیت راهنمای KidsWorld
 * یک موجود گرد و مهربان با دو شاخک ستاره‌ای. در همه‌ی محیط کودک حضور دارد:
 * خوشامد می‌گوید، راهنمایی می‌کند و موفقیت‌ها را جشن می‌گیرد.
 *
 * moods: happy (پیش‌فرض) · wow (تعجب/کشف) · cheer (جشن) · think (فکر) · sleepy (قصه‌ی شب)
 */
export type MascotMood = "happy" | "wow" | "cheer" | "think" | "sleepy";

const INK = "#1f1a3d";

export function Mascot({
  mood = "happy",
  className,
  title = "پیکو",
}: {
  mood?: MascotMood;
  className?: string;
  title?: string;
}) {
  const armsUp = mood === "cheer";
  return (
    <svg viewBox="0 0 200 220" className={cn("select-none", className)} role="img" aria-label={title}>
      {/* سایه */}
      <ellipse cx="100" cy="208" rx="52" ry="8" fill={INK} opacity="0.12" />

      {/* شاخک‌ها */}
      <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M78 52 C 72 34, 62 26, 54 22" />
        <path d="M122 52 C 128 34, 138 26, 146 22" />
      </g>
      <Star cx={52} cy={20} r={13} fill="#ffce3d" />
      <Star cx={148} cy={20} r={13} fill="#ff73b3" />

      {/* بازوها */}
      <g stroke={INK} strokeWidth="5" strokeLinejoin="round" fill="#4fb8f5">
        {armsUp ? (
          <>
            <path d="M40 118 C 22 100, 18 84, 24 72 C 32 66, 40 76, 52 100 Z" />
            <path d="M160 118 C 178 100, 182 84, 176 72 C 168 66, 160 76, 148 100 Z" />
          </>
        ) : (
          <>
            <path d="M42 120 C 24 128, 20 146, 30 154 C 40 158, 48 146, 54 134 Z" />
            <path d="M158 120 C 176 128, 180 146, 170 154 C 160 158, 152 146, 146 134 Z" />
          </>
        )}
      </g>

      {/* پاها */}
      <g stroke={INK} strokeWidth="5" fill="#1f96e0">
        <ellipse cx="78" cy="196" rx="18" ry="10" />
        <ellipse cx="122" cy="196" rx="18" ry="10" />
      </g>

      {/* بدن */}
      <path
        d="M100 46 C 150 46, 172 86, 170 128 C 168 172, 140 194, 100 194 C 60 194, 32 172, 30 128 C 28 86, 50 46, 100 46 Z"
        fill="#4fb8f5"
        stroke={INK}
        strokeWidth="5"
      />
      {/* شکم */}
      <path d="M100 118 C 128 118, 142 138, 140 158 C 138 178, 122 186, 100 186 C 78 186, 62 178, 60 158 C 58 138, 72 118, 100 118 Z" fill="#ddf3ff" />
      {/* برق بدن */}
      <path d="M58 82 C 64 70, 74 62, 86 58" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* چشم‌ها */}
      <Eyes mood={mood} />

      {/* گونه‌ها */}
      <ellipse cx="62" cy="112" rx="10" ry="6" fill="#ff73b3" opacity="0.55" />
      <ellipse cx="138" cy="112" rx="10" ry="6" fill="#ff73b3" opacity="0.55" />

      {/* دهان */}
      <Mouth mood={mood} />

      {mood === "think" && (
        <g fill="#fff" stroke={INK} strokeWidth="3">
          <circle cx="178" cy="62" r="5" />
          <circle cx="188" cy="44" r="8" />
        </g>
      )}
      {mood === "sleepy" && (
        <text x="160" y="58" fontSize="22" fontWeight="900" fill={INK} fontFamily="sans-serif">
          z<tspan dx="2" dy="-10" fontSize="16">z</tspan>
        </text>
      )}
    </svg>
  );
}

function Star({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.5;
    return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} stroke={INK} strokeWidth="4" strokeLinejoin="round" />;
}

function Eyes({ mood }: { mood: MascotMood }) {
  if (mood === "sleepy") {
    return (
      <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M66 94 Q 76 102 86 94" />
        <path d="M114 94 Q 124 102 134 94" />
      </g>
    );
  }
  if (mood === "cheer") {
    return (
      <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M66 98 Q 76 84 86 98" />
        <path d="M114 98 Q 124 84 134 98" />
      </g>
    );
  }
  const big = mood === "wow";
  const lookUp = mood === "think" ? -4 : 0;
  return (
    <g>
      <ellipse cx="76" cy="92" rx={big ? 14 : 12} ry={big ? 17 : 15} fill={INK} />
      <ellipse cx="124" cy="92" rx={big ? 14 : 12} ry={big ? 17 : 15} fill={INK} />
      <circle cx={80} cy={86 + lookUp} r="5" fill="#fff" />
      <circle cx={128} cy={86 + lookUp} r="5" fill="#fff" />
      <circle cx={72} cy={98 + lookUp} r="2.2" fill="#fff" />
      <circle cx={120} cy={98 + lookUp} r="2.2" fill="#fff" />
    </g>
  );
}

function Mouth({ mood }: { mood: MascotMood }) {
  switch (mood) {
    case "wow":
      return <ellipse cx="100" cy="126" rx="9" ry="11" fill={INK} />;
    case "cheer":
      return (
        <g>
          <path d="M80 116 Q 100 146 120 116 Z" fill={INK} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M90 128 Q 100 136 110 128 Q 100 124 90 128 Z" fill="#ff7a66" />
        </g>
      );
    case "think":
      return <path d="M88 126 Q 100 120 112 126" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />;
    case "sleepy":
      return <ellipse cx="100" cy="124" rx="6" ry="5" fill={INK} />;
    default:
      return <path d="M84 116 Q 100 134 116 116" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />;
  }
}
