"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   SceneReis — variant A, "De reis"
   Isometrische scene (2:1) met parallax op scroll + lichte muistilt.
   Alles inline SVG, geen libraries, geen afbeeldingen, geen random.
------------------------------------------------------------------ */

/* Merkpalet — uitsluitend deze waarden. Tussentinten ontstaan door
   een ink- of wit-overlay op dezelfde vorm (geen extra kleuren). */
const NAVY = "#0033a0";
const BLAUW = "#0072ce";
const LICHTBLAUW = "#5da9e9";
const NEVEL = "#b9d9f7";
const GROEN = "#006546";
const GROEN_LICHT = "#48b483";
const GOUD = "#ecb93f";
const WIT = "#ffffff";
const LIJN = "#e3e8f0";
const INK = "#0d1b2e";

/* ---------- isometrie: tegel 64 x 32, verhouding 2:1 ---------- */
const TW = 64;
const TH = 32;
const OX = 560; // oorsprong van het raster in viewBox-coordinaten
const OY = 300;

function iso(i: number, j: number) {
  return { x: OX + (i - j) * (TW / 2), y: OY + (i + j) * (TH / 2) };
}

/* Een tegel/blok: bovenvlak licht, zijkanten donkerder (2-3 tinten). */
function Tegel({
  x,
  y,
  h = 10,
  top,
  side,
  schaduw = 0.12,
  s = 1,
}: {
  x: number;
  y: number;
  h?: number;
  top: string;
  side: string;
  schaduw?: number;
  s?: number;
}) {
  const w = 32 * s;
  const d = 16 * s;
  const rok = `M ${x - w} ${y} L ${x} ${y + d} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + d + h} L ${x - w} ${y + h} Z`;
  const links = `M ${x - w} ${y} L ${x} ${y + d} L ${x} ${y + d + h} L ${x - w} ${y + h} Z`;
  const vlak = `M ${x - w} ${y} L ${x} ${y - d} L ${x + w} ${y} L ${x} ${y + d} Z`;
  return (
    <>
      <path d={rok} fill={side} />
      <path d={links} fill={INK} fillOpacity={schaduw} />
      <path d={vlak} fill={top} />
    </>
  );
}

/* ---------- het pad: aaneengesloten tegels, links-onder naar rechts-boven ---------- */
type TegelSpec = { i: number; j: number; lift?: number; groen?: boolean };

const PAD: TegelSpec[] = [
  { i: 0, j: 11 },
  { i: 0, j: 10 },
  { i: 0, j: 9 },
  { i: 1, j: 9 },
  { i: 1, j: 8 },
  { i: 1, j: 7 },
  { i: 2, j: 7 },
  { i: 2, j: 6 },
  { i: 2, j: 5 },
  { i: 2, j: 4 },
  { i: 3, j: 4 },
  { i: 3, j: 3 },
  { i: 3, j: 2 },
  { i: 3, j: 1 },
  { i: 4, j: 1 },
  { i: 4, j: 0 },
  { i: 4, j: -1 },
  { i: 4, j: -2 },
  { i: 5, j: -2 },
  // de laatste tegels lopen als trap omhoog
  { i: 5, j: -3, lift: 8 },
  { i: 5, j: -4, lift: 16 },
  { i: 5, j: -5, lift: 24 },
];

/* Zijperken naast het pad (dragen boeken, plantjes, munten). */
const PERKEN: TegelSpec[] = [
  { i: -1, j: 9 }, // boeken
  { i: 1, j: 10, groen: true }, // zaailing
  { i: 3, j: 5, groen: true }, // struik
  { i: 4, j: 2 }, // munten
  { i: 6, j: -4, lift: 16, groen: true }, // boom
];

// Achter naar voor tekenen: kleinere (i+j) ligt verder weg.
const TEGELS: TegelSpec[] = [...PAD, ...PERKEN].sort(
  (a, b) => a.i + a.j - (b.i + b.j)
);

/* ---------- parallaxlagen: achtergrond traag, voorgrond snel ---------- */
const LAGEN = [
  { scroll: 0.05, muis: 6 }, // 0 achtergrondvormen
  { scroll: 0.13, muis: 10 }, // 1 verre gebouwtjes
  { scroll: 0.24, muis: 15 }, // 2 pad, planten, karakter
  { scroll: 0.5, muis: 28 }, // 3 zwevende voorgrondtegels
] as const;

const BEREIK = 180; // maximale verplaatsing in px bij volle scroll

const CSS = `
@keyframes bcr-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes bcr-schaduw { 0%, 100% { transform: scale(1); opacity: 0.15; } 50% { transform: scale(0.86); opacity: 0.09; } }
@keyframes bcr-zweef { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes bcr-wieg { 0%, 100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }
.bcr-bob { animation: bcr-bob 4.8s ease-in-out infinite; }
.bcr-schaduw { animation: bcr-schaduw 4.8s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 50%; }
.bcr-wieg { animation: bcr-wieg 9s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
.bcr-wieg-b { animation: bcr-wieg 7.5s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
.bcr-zweef-a { animation: bcr-zweef 7s ease-in-out infinite; }
.bcr-zweef-b { animation: bcr-zweef 8.5s ease-in-out infinite; }
.bcr-zweef-c { animation: bcr-zweef 6.2s ease-in-out infinite; }
.bcr-zweef-d { animation: bcr-zweef 5.4s ease-in-out infinite; }
@media (max-width: 640px) { .bcr-klein-weg { display: none; } }
@media (prefers-reduced-motion: reduce) { .bcr-stage * { animation: none !important; } }
`;

export default function SceneReis() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const laagRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [rustig, setRustig] = useState(false);

  // prefers-reduced-motion volgen (na mount, dus geen hydration-verschil)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setRustig(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if (rustig) {
      for (const el of laagRefs.current) if (el) el.style.transform = "";
      return;
    }

    let frame = 0;
    let p = 0; // scrollpositie, ongeveer -1 .. 1
    let mx = 0;
    let my = 0;

    const teken = () => {
      frame = 0;
      for (let n = 0; n < LAGEN.length; n++) {
        const el = laagRefs.current[n];
        if (!el) continue;
        const cfg = LAGEN[n];
        const ty = p * cfg.scroll * BEREIK + my * cfg.muis * 0.55;
        const tx = mx * cfg.muis;
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      }
    };

    const vraag = () => {
      if (!frame) frame = window.requestAnimationFrame(teken);
    };

    const klem = (v: number, max = 1) => Math.max(-max, Math.min(max, v));

    const opScroll = () => {
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const midden = r.top + r.height / 2;
      p = klem((vh / 2 - midden) / (vh / 2 + r.height / 2), 1.3);
      vraag();
    };

    const opMuis = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      mx = klem(((e.clientX - r.left) / r.width) * 2 - 1);
      my = klem(((e.clientY - r.top) / r.height) * 2 - 1);
      vraag();
    };

    const opVerlaten = () => {
      mx = 0;
      my = 0;
      vraag();
    };

    opScroll();
    window.addEventListener("scroll", opScroll, { passive: true });
    window.addEventListener("resize", opScroll, { passive: true });
    stage.addEventListener("mousemove", opMuis, { passive: true });
    stage.addEventListener("mouseleave", opVerlaten, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", opScroll);
      window.removeEventListener("resize", opScroll);
      stage.removeEventListener("mousemove", opMuis);
      stage.removeEventListener("mouseleave", opVerlaten);
    };
  }, [rustig]);

  const zetRef = (n: number) => (el: HTMLDivElement | null) => {
    laagRefs.current[n] = el;
  };

  const svgProps = {
    viewBox: "0 0 1200 720",
    preserveAspectRatio: "xMidYMid meet",
    className: "h-full w-full",
    "aria-hidden": true as const,
  };

  return (
    <div
      ref={stageRef}
      role="img"
      aria-label="Isometrische scene: een figuurtje op een pad, van zaailing via struik naar een volgroeide boom."
      className="bcr-stage relative aspect-[5/3] w-full select-none overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ---------- laag 0: grote, lichte achtergrondvormen ---------- */}
      <div ref={zetRef(0)} className="absolute inset-0 will-change-transform">
        <svg {...svgProps}>
          <circle cx={900} cy={190} r={200} fill={NEVEL} fillOpacity={0.3} />
          <circle
            className="bcr-klein-weg"
            cx={250}
            cy={300}
            r={150}
            fill={NEVEL}
            fillOpacity={0.18}
          />
          <path
            d="M 130 380 L 600 145 L 1070 380 L 600 615 Z"
            fill="none"
            stroke={LIJN}
            strokeWidth={2}
          />
          <circle
            className="bcr-klein-weg"
            cx={1010}
            cy={470}
            r={120}
            fill="none"
            stroke={NEVEL}
            strokeWidth={3}
            strokeOpacity={0.6}
          />
          <path
            d="M 300 120 L 390 165 L 300 210 L 210 165 Z"
            fill={NEVEL}
            fillOpacity={0.16}
          />
        </svg>
      </div>

      {/* ---------- laag 1: verre gebouwtjes als staafdiagram ---------- */}
      <div ref={zetRef(1)} className="absolute inset-0 will-change-transform">
        <svg {...svgProps}>
          <g className="bcr-klein-weg">
            <Tegel x={236} y={244} h={26} s={0.8} top={NEVEL} side={NEVEL} schaduw={0.16} />
            <Tegel x={298} y={240} h={46} s={0.8} top={NEVEL} side={NEVEL} schaduw={0.18} />
            <Tegel x={360} y={236} h={66} s={0.8} top={NEVEL} side={NEVEL} schaduw={0.2} />
          </g>
          <path
            className="bcr-klein-weg"
            d="M 1010 118 L 1046 136 L 1010 154 L 974 136 Z"
            fill="none"
            stroke={LIJN}
            strokeWidth={2}
          />
          <path
            d="M 152 322 L 188 340 L 152 358 L 116 340 Z"
            fill="none"
            stroke={LIJN}
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* ---------- laag 2: het pad, de groei en het karakter ---------- */}
      <div ref={zetRef(2)} className="absolute inset-0 will-change-transform">
        <svg {...svgProps}>
          {/* tegels, van achter naar voor */}
          {TEGELS.map((t) => {
            const { x, y } = iso(t.i, t.j);
            const lift = t.lift ?? 0;
            return (
              <Tegel
                key={`${t.i}:${t.j}`}
                x={x}
                y={y - lift}
                h={10 + lift}
                top={t.groen ? GROEN_LICHT : NEVEL}
                side={t.groen ? GROEN : LICHTBLAUW}
                schaduw={t.groen ? 0.18 : 0.12}
              />
            );
          })}

          {/* boom achteraan rechts — volgroeide samengestelde groei */}
          <g transform="translate(880, 317)">
            <ellipse cx={0} cy={0} rx={30} ry={15} fill={INK} fillOpacity={0.1} />
            <path
              d="M -5 -2 L 5 -2 L 4 -54 L -4 -54 Z"
              fill={GROEN}
            />
            <path d="M 0 -2 L 5 -2 L 4 -54 L 0 -54 Z" fill={INK} fillOpacity={0.18} />
            <g className="bcr-wieg">
              <g transform="translate(0,-76)">
                <g fill={GROEN}>
                  <circle cx={0} cy={0} r={38} />
                  <circle cx={-29} cy={15} r={22} />
                  <circle cx={28} cy={13} r={20} />
                </g>
                <g fill={GROEN_LICHT} transform="translate(-4,-6) scale(0.9)">
                  <circle cx={0} cy={0} r={38} />
                  <circle cx={-29} cy={15} r={22} />
                  <circle cx={28} cy={13} r={20} />
                </g>
                <circle cx={-14} cy={-14} r={9} fill={WIT} fillOpacity={0.2} />
              </g>
            </g>
          </g>

          {/* muntstapels — rendement dat zich opstapelt */}
          <g transform="translate(624, 396)">
            <ellipse cx={0} cy={0} rx={22} ry={11} fill={INK} fillOpacity={0.1} />
            {[-4, -10, -16, -22].map((cy) => (
              <g key={cy}>
                <ellipse cx={0} cy={cy + 3.5} rx={13} ry={6.5} fill={GOUD} />
                <ellipse cx={0} cy={cy + 3.5} rx={13} ry={6.5} fill={INK} fillOpacity={0.22} />
                <ellipse cx={0} cy={cy} rx={13} ry={6.5} fill={GOUD} />
              </g>
            ))}
            <g className="bcr-klein-weg">
              {[-4, -10].map((cy) => (
                <g key={cy}>
                  <ellipse cx={24} cy={cy + 3.5} rx={11} ry={5.5} fill={GOUD} />
                  <ellipse cx={24} cy={cy + 3.5} rx={11} ry={5.5} fill={INK} fillOpacity={0.22} />
                  <ellipse cx={24} cy={cy} rx={11} ry={5.5} fill={GOUD} />
                </g>
              ))}
            </g>
            <g className="bcr-zweef-d">
              <ellipse cx={0} cy={-42} rx={11} ry={5.5} fill={GOUD} />
              <ellipse cx={0} cy={-44.5} rx={11} ry={5.5} fill={GOUD} />
              <ellipse cx={0} cy={-44.5} rx={11} ry={5.5} fill={WIT} fillOpacity={0.25} />
            </g>
          </g>

          {/* het karakter — een pion, houding boven detail */}
          <g transform="translate(560, 396)">
            <ellipse className="bcr-schaduw" cx={0} cy={0} rx={17} ry={8.5} fill={INK} fillOpacity={0.15} />
            <g className="bcr-bob">
              <g transform="rotate(5)">
                <ellipse cx={0} cy={-4} rx={13} ry={6} fill={NAVY} />
                <path
                  d="M -11 -5 C -11 -26 -7 -35 0 -41 C 7 -35 11 -26 11 -5 Z"
                  fill={BLAUW}
                />
                <path
                  d="M -11 -5 C -11 -26 -7 -35 0 -41 L 0 -5 Z"
                  fill={INK}
                  fillOpacity={0.16}
                />
                <ellipse cx={0} cy={-43} rx={9} ry={3.6} fill={GOUD} />
                <circle cx={0} cy={-55} r={10} fill={NAVY} />
                <circle cx={-3.5} cy={-58} r={3.6} fill={WIT} fillOpacity={0.22} />
              </g>
            </g>
          </g>

          {/* struik halverwege — de groei begint zichtbaar te worden */}
          <g transform="translate(496, 428)">
            <ellipse cx={0} cy={0} rx={20} ry={10} fill={INK} fillOpacity={0.1} />
            <path d="M -3 -1 L 3 -1 L 2 -22 L -2 -22 Z" fill={GROEN} />
            <g className="bcr-wieg-b">
              <g transform="translate(0,-30)">
                <g fill={GROEN}>
                  <circle cx={0} cy={0} r={19} />
                  <circle cx={-15} cy={9} r={12} />
                  <circle cx={14} cy={8} r={11} />
                </g>
                <g fill={GROEN_LICHT} transform="translate(-3,-4) scale(0.88)">
                  <circle cx={0} cy={0} r={19} />
                  <circle cx={-15} cy={9} r={12} />
                  <circle cx={14} cy={8} r={11} />
                </g>
              </g>
            </g>
          </g>

          {/* boekenstapel bij de start — het fundament */}
          <g transform="translate(240, 428)">
            <ellipse cx={0} cy={0} rx={20} ry={10} fill={INK} fillOpacity={0.1} />
            <Tegel x={0} y={-2} h={7} s={0.55} top={BLAUW} side={BLAUW} schaduw={0.24} />
            <Tegel x={3} y={-11} h={7} s={0.5} top={GOUD} side={GOUD} schaduw={0.24} />
            <Tegel x={-2} y={-20} h={7} s={0.46} top={NAVY} side={NAVY} schaduw={0.24} />
          </g>

          {/* zaailing links — waar het begint */}
          <g transform="translate(272, 476)">
            <ellipse cx={0} cy={0} rx={12} ry={6} fill={INK} fillOpacity={0.1} />
            <g className="bcr-wieg-b">
              <path
                d="M 0 -1 L 0 -17"
                stroke={GROEN}
                strokeWidth={2.5}
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 0 -12 C -4 -20 -10 -21 -13 -17 C -9 -11 -3 -10 0 -12 Z"
                fill={GROEN_LICHT}
              />
              <path
                d="M 0 -16 C 4 -24 10 -25 13 -20 C 9 -14 3 -13 0 -16 Z"
                fill={GROEN}
              />
            </g>
          </g>
        </svg>
      </div>

      {/* ---------- laag 3: zwevende voorgrondtegels (snelst) ---------- */}
      <div ref={zetRef(3)} className="absolute inset-0 will-change-transform">
        <svg {...svgProps}>
          <g className="bcr-zweef-a">
            <Tegel x={150} y={606} h={16} s={1.3} top={NEVEL} side={LICHTBLAUW} schaduw={0.14} />
            <path
              d="M 132 606 L 150 597 L 168 606 L 150 615 Z"
              fill={GOUD}
              fillOpacity={0.9}
            />
          </g>
          <g className="bcr-zweef-b">
            <Tegel x={1046} y={560} h={14} s={1.1} top={NEVEL} side={LICHTBLAUW} schaduw={0.14} />
          </g>
          <g className="bcr-zweef-c bcr-klein-weg">
            <Tegel x={690} y={678} h={12} s={0.9} top={NEVEL} side={LICHTBLAUW} schaduw={0.14} />
          </g>
          <g className="bcr-zweef-b bcr-klein-weg">
            <Tegel x={1128} y={214} h={9} s={0.66} top={NEVEL} side={LICHTBLAUW} schaduw={0.14} />
          </g>
        </svg>
      </div>
    </div>
  );
}
