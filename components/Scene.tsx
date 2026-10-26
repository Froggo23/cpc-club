type Tone = "teal" | "indigo" | "blue";

// Glass tube: stacked strokes from dark rim to white core fake a lit cylinder.
function Tube({ d, w = 56 }: { d: string; w?: number }) {
  return (
    <g fill="none" strokeLinecap="round" filter="url(#tube-glow)">
      <path d={d} stroke="rgba(6,18,44,.55)" strokeWidth={w + 12} />
      <path d={d} stroke="#5d82b3" strokeWidth={w} />
      <path d={d} stroke="#9cbfe8" strokeWidth={w * 0.74} />
      <path d={d} stroke="#d6ecff" strokeWidth={w * 0.42} />
      <path d={d} stroke="#ffffff" strokeWidth={w * 0.12} transform="translate(-4 -5)" />
    </g>
  );
}

const TUBES: Record<Tone, { d: string; w: number }[]> = {
  teal: [
    { d: "M60 300 C 200 250, 300 130, 330 -60", w: 54 },
    { d: "M1420 600 C 1270 640, 1170 760, 1140 960", w: 66 },
    { d: "M440 960 C 490 880, 620 860, 720 920", w: 36 },
  ],
  indigo: [
    { d: "M-100 20 C 300 170, 900 -10, 1560 110", w: 54 },
    { d: "M880 -40 C 900 90, 820 170, 760 240", w: 30 },
    { d: "M120 960 C 220 880, 260 800, 220 700", w: 44 },
  ],
  blue: [
    { d: "M90 400 C 200 540, 300 760, 360 960", w: 64 },
    { d: "M1350 400 C 1240 540, 1140 760, 1080 960", w: 64 },
    { d: "M150 230 C 220 270, 250 330, 250 400", w: 26 },
  ],
};

const FLARES: Record<Tone, [number, number, number][]> = {
  teal: [[8, 14, 1], [91, 6, 0.8], [62, 96, 0.9], [96, 70, 0.6]],
  indigo: [[47, 12, 1.2], [4, 82, 0.7], [88, 30, 0.6]],
  blue: [[12, 60, 0.9], [86, 58, 1], [52, 4, 0.6]],
};

export default function Scene({ tone }: { tone: Tone }) {
  return (
    <div className={`scene scene-${tone}`} aria-hidden>
      <div className="scene-band" />
      <svg className="scene-tubes" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="tube-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="soft" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="soft" />
            </feMerge>
          </filter>
        </defs>
        {TUBES[tone].map((t, i) => (
          <g key={i} className="tube-float" style={{ animationDelay: `${i * -3}s` }}>
            <Tube {...t} />
          </g>
        ))}
      </svg>
      {FLARES[tone].map(([x, y, s], i) => (
        <span
          key={i}
          className="flare"
          style={{ left: `${x}%`, top: `${y}%`, ["--s" as string]: s, animationDelay: `${i * -1.3}s` }}
        />
      ))}
    </div>
  );
}
