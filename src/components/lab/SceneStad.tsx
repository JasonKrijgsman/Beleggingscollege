"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 * SceneStad — variant B, "De stad"
 *
 * Isometrische vogelvlucht (2:1, tegel 64x32) op een zwevend platform.
 * Een kleine skyline die tegelijk gebouw en staafdiagram is; het
 * karakter kijkt vanaf een verhoging aan de rand over de stad uit.
 * Bij scrollen groeien de blokken vanaf hun basis, stijgt de koerslijn
 * en schuiven de lagen met verschillende snelheden (parallax).
 * ------------------------------------------------------------------ */

/* --- isometrische projectie --------------------------------------- */

const HALF_W = 32; // tegel 64 breed
const HALF_H = 16; // tegel 32 hoog  -> 2:1
const OX = 480;
const OY = 195;

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

function iso(a: number, b: number): [number, number] {
  return [OX + (a - b) * HALF_W, OY + (a + b) * HALF_H];
}

type Faces = { top: string; left: string; right: string };

/** Drie zichtbare vlakken van een isometrisch blok op rasterpositie (gx, gy). */
function boxFaces(
  gx: number,
  gy: number,
  fw: number,
  fd: number,
  base: number,
  h: number,
): Faces {
  const [nx, ny] = iso(gx, gy);
  const [ex, ey] = iso(gx + fw, gy);
  const [sx, sy] = iso(gx + fw, gy + fd);
  const [wx, wy] = iso(gx, gy + fd);
  const t = base + h;
  return {
    top: `M ${r2(nx)},${r2(ny - t)} L ${r2(ex)},${r2(ey - t)} L ${r2(sx)},${r2(sy - t)} L ${r2(wx)},${r2(wy - t)} Z`,
    left: `M ${r2(wx)},${r2(wy - base)} L ${r2(sx)},${r2(sy - base)} L ${r2(sx)},${r2(sy - t)} L ${r2(wx)},${r2(wy - t)} Z`,
    right: `M ${r2(sx)},${r2(sy - base)} L ${r2(ex)},${r2(ey - base)} L ${r2(ex)},${r2(ey - t)} L ${r2(sx)},${r2(sy - t)} Z`,
  };
}

/* --- de skyline ---------------------------------------------------- */

type Building = {
  id: string;
  gx: number;
  gy: number;
  fw: number;
  fd: number;
  h: number; // basishoogte
  grow: number; // extra hoogte bij volle scroll
  tint: 0 | 1 | 2;
  seed: number;
  hideSm?: boolean;
};

/** top / links / rechts — bovenvlak licht, zijvlakken donkerder. */
const TINTS: readonly [string, string, string][] = [
  ["#b9d9f7", "#5da9e9", "#0072ce"],
  ["#5da9e9", "#0072ce", "#0033a0"],
  ["#0072ce", "#0033a0", "#0d1b2e"],
];

/* Volgorde = schildersalgoritme (achter naar voren).
   Atmosferisch perspectief: achterste rij lichter, voorste rij donkerder. */
const BUILDINGS: Building[] = [
  { id: "a", gx: 1.0, gy: 1.0, fw: 1.0, fd: 1.15, h: 58, grow: 12, tint: 0, seed: 0 },
  { id: "b", gx: 2.3, gy: 1.0, fw: 1.0, fd: 1.15, h: 84, grow: 16, tint: 1, seed: 1 },
  { id: "f", gx: 1.35, gy: 3.15, fw: 1.0, fd: 1.15, h: 46, grow: 10, tint: 1, seed: 2, hideSm: true },
  { id: "c", gx: 3.6, gy: 1.0, fw: 1.05, fd: 1.15, h: 70, grow: 14, tint: 0, seed: 3 },
  { id: "g", gx: 2.7, gy: 3.15, fw: 1.1, fd: 1.15, h: 64, grow: 18, tint: 2, seed: 4 },
  { id: "d", gx: 4.95, gy: 1.0, fw: 1.1, fd: 1.15, h: 106, grow: 20, tint: 1, seed: 5 },
  { id: "h", gx: 4.1, gy: 3.15, fw: 1.0, fd: 1.15, h: 52, grow: 12, tint: 1, seed: 6 },
  { id: "e", gx: 6.3, gy: 1.0, fw: 1.0, fd: 1.15, h: 92, grow: 24, tint: 0, seed: 7, hideSm: true },
  { id: "i", gx: 5.45, gy: 3.15, fw: 1.2, fd: 1.15, h: 130, grow: 28, tint: 2, seed: 8 },
];

/** Gouden raampjes, deterministisch verdeeld (geen Math.random -> geen hydration mismatch). */
function windowsFor(b: Building): { d: string; lit: boolean }[] {
  const out: { d: string; lit: boolean }[] = [];
  const [ex, ey] = iso(b.gx + b.fw, b.gy);
  const [sx, sy] = iso(b.gx + b.fw, b.gy + b.fd);
  const [wx, wy] = iso(b.gx, b.gy + b.fd);

  const faces = [
    { ox: wx, oy: wy, ux: HALF_W, uy: HALF_H, span: b.fw }, // linkervlak (W -> S)
    { ox: sx, oy: sy, ux: HALF_W, uy: -HALF_H, span: b.fd }, // rechtervlak (S -> E)
  ];

  const rows: number[] = [];
  for (let t = 13; t <= b.h - 17; t += 21) rows.push(t);
  const wh = 10;

  faces.forEach((f, fi) => {
    const cols = Math.max(1, Math.round(f.span * 2));
    const cw = (f.span * 0.66) / cols;
    const gap = (f.span - cols * cw) / (cols + 1);
    rows.forEach((t, ri) => {
      for (let c = 0; c < cols; c++) {
        const s = gap * (c + 1) + cw * c;
        const x0 = f.ox + f.ux * s;
        const y0 = f.oy + f.uy * s;
        const x1 = f.ox + f.ux * (s + cw);
        const y1 = f.oy + f.uy * (s + cw);
        out.push({
          d: `M ${r2(x0)},${r2(y0 - t)} L ${r2(x1)},${r2(y1 - t)} L ${r2(x1)},${r2(y1 - t - wh)} L ${r2(x0)},${r2(y0 - t - wh)} Z`,
          lit: (ri * 2 + c * 3 + fi + b.seed) % 3 !== 0,
        });
      }
    });
  });

  return out;
}

/* --- koersgrafiek --------------------------------------------------- */

const CHART_X = [286, 342, 398, 454, 510, 566, 622, 678];
const CHART_Y = [168, 152, 160, 136, 144, 116, 100, 78];
const CHART_RISE = [0, 3, 6, 10, 13, 18, 23, 28];

/* --- platform ------------------------------------------------------- */

const GRID = 8;
const SLAB_T = 26;
const SLAB_N = iso(0, 0);
const SLAB_E = iso(GRID, 0);
const SLAB_S = iso(GRID, GRID);
const SLAB_W = iso(0, GRID);

const PLATFORM_TOP = `M ${SLAB_N[0]},${SLAB_N[1]} L ${SLAB_E[0]},${SLAB_E[1]} L ${SLAB_S[0]},${SLAB_S[1]} L ${SLAB_W[0]},${SLAB_W[1]} Z`;
const PLATFORM_LEFT = `M ${SLAB_W[0]},${SLAB_W[1]} L ${SLAB_S[0]},${SLAB_S[1]} L ${SLAB_S[0]},${SLAB_S[1] + SLAB_T} L ${SLAB_W[0]},${SLAB_W[1] + SLAB_T} Z`;
const PLATFORM_RIGHT = `M ${SLAB_S[0]},${SLAB_S[1]} L ${SLAB_E[0]},${SLAB_E[1]} L ${SLAB_E[0]},${SLAB_E[1] + SLAB_T} L ${SLAB_S[0]},${SLAB_S[1] + SLAB_T} Z`;

const GRID_LINES: string[] = [];
for (let i = 1; i < GRID; i++) {
  const p1 = iso(i, 0);
  const p2 = iso(i, GRID);
  GRID_LINES.push(`M ${p1[0]},${p1[1]} L ${p2[0]},${p2[1]}`);
  const p3 = iso(0, i);
  const p4 = iso(GRID, i);
  GRID_LINES.push(`M ${p3[0]},${p3[1]} L ${p4[0]},${p4[1]}`);
}

/* --- karakter ------------------------------------------------------- */

const PLINTH = { gx: 0.55, gy: 5.45, fw: 1.5, fd: 1.5, h: 24 };
const PLINTH_FACES = boxFaces(PLINTH.gx, PLINTH.gy, PLINTH.fw, PLINTH.fd, 0, PLINTH.h);
const [CHAR_X, CHAR_Y0] = iso(PLINTH.gx + PLINTH.fw / 2, PLINTH.gy + PLINTH.fd / 2);
const CHAR_Y = CHAR_Y0 - PLINTH.h;

/* --- boom (samengestelde groei) -------------------------------------- */

const TREE = { gx: 6.6, gy: 5.2, fw: 0.4, fd: 0.4, h: 22 };
const [TREE_X, TREE_Y] = iso(TREE.gx + TREE.fw / 2, TREE.gy + TREE.fd / 2);

/* --- kleine bouwstenen ---------------------------------------------- */

function IsoBox({
  gx,
  gy,
  fw,
  fd,
  base,
  h,
  fill,
}: {
  gx: number;
  gy: number;
  fw: number;
  fd: number;
  base: number;
  h: number;
  fill: string;
}) {
  const f = boxFaces(gx, gy, fw, fd, base, h);
  return (
    <g>
      <path d={f.top} fill={fill} />
      <path d={f.left} fill={fill} />
      <path d={f.left} fill="#0d1b2e" opacity={0.12} />
      <path d={f.right} fill={fill} />
      <path d={f.right} fill="#0d1b2e" opacity={0.26} />
    </g>
  );
}

function Coin({ cx, cy, r = 15, h = 6 }: { cx: number; cy: number; r?: number; h?: number }) {
  const ry = r / 2;
  const body = `M ${cx - r},${cy} L ${cx - r},${cy + h} A ${r} ${ry} 0 0 0 ${cx + r},${cy + h} L ${cx + r},${cy} Z`;
  return (
    <g>
      <path d={body} fill="#ecb93f" />
      <path d={body} fill="#0d1b2e" opacity={0.2} />
      <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill="#ecb93f" />
    </g>
  );
}

function Plate({ cx, cy, r, h = 7 }: { cx: number; cy: number; r: number; h?: number }) {
  const ry = r / 2;
  const top = `M ${cx},${cy - ry} L ${cx + r},${cy} L ${cx},${cy + ry} L ${cx - r},${cy} Z`;
  const left = `M ${cx - r},${cy} L ${cx},${cy + ry} L ${cx},${cy + ry + h} L ${cx - r},${cy + h} Z`;
  const right = `M ${cx},${cy + ry} L ${cx + r},${cy} L ${cx + r},${cy + h} L ${cx},${cy + ry + h} Z`;
  return (
    <g>
      <path d={top} fill="#b9d9f7" />
      <path d={left} fill="#5da9e9" />
      <path d={right} fill="#0072ce" />
    </g>
  );
}

/* --- stijl ---------------------------------------------------------- */

const CSS = `
.bc-stad { position: relative; width: 100%; overflow: hidden; line-height: 0; }
.bc-stad svg { display: block; width: 100%; height: auto; }
.bc-stad .bc-layer { will-change: transform; }
@keyframes bc-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3.5px); } }
@keyframes bc-drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes bc-pulse { 0%, 100% { opacity: 0.22; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.35); } }
@keyframes bc-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.78; } }
.bc-stad .bc-bob { animation: bc-bob 5.5s ease-in-out infinite; }
.bc-stad .bc-drift { animation: bc-drift 7.5s ease-in-out infinite; }
.bc-stad .bc-drift-slow { animation: bc-drift 8.5s ease-in-out infinite; }
.bc-stad .bc-pulse { animation: bc-pulse 6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
.bc-stad .bc-blink { animation: bc-blink 7s ease-in-out infinite; }
@media (max-width: 640px) { .bc-stad .bc-sm-hide { display: none; } }
@media (prefers-reduced-motion: reduce) {
  .bc-stad .bc-bob,
  .bc-stad .bc-drift,
  .bc-stad .bc-drift-slow,
  .bc-stad .bc-pulse,
  .bc-stad .bc-blink { animation: none !important; }
}
`;

/* --- component ------------------------------------------------------ */

export default function SceneStad() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<SVGGElement>(null);
  const cityRef = useRef<SVGGElement>(null);
  const chartRef = useRef<SVGGElement>(null);
  const fgRef = useRef<SVGGElement>(null);

  const topRefs = useRef<(SVGPathElement | null)[]>([]);
  const leftRefs = useRef<(SVGPathElement | null)[]>([]);
  const rightRefs = useRef<(SVGPathElement | null)[]>([]);

  const lineRef = useRef<SVGPolylineElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const haloRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let progress = 0.5;
    let mouseX = 0; // -1 .. 1
    let mouseY = 0;
    let ticking = false;
    let raf = 0;

    const setLayer = (el: SVGGElement | null, x: number, y: number) => {
      if (el) el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };

    const read = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = (vh - rect.top) / (vh + rect.height);
      progress = p < 0 ? 0 : p > 1 ? 1 : p;
    };

    const paint = () => {
      ticking = false;
      const p = progress;
      const d = p - 0.5; // -0.5 .. 0.5
      const e = p * p * (3 - 2 * p); // smoothstep voor de groei

      // Lagen: achtergrond traag, voorgrond snel.
      setLayer(bgRef.current, d * 8 + mouseX * 5, -d * 22 + mouseY * 3);
      setLayer(cityRef.current, -d * 6 + mouseX * 10, -d * 34 + mouseY * 6);
      setLayer(chartRef.current, -d * 12 + mouseX * 16, -d * 52 + mouseY * 9);
      setLayer(fgRef.current, -d * 20 + mouseX * 26, -d * 92 + mouseY * 14);

      // Blokken groeien vanaf hun basis (echte isometrie, niet uitgerekt).
      for (let i = 0; i < BUILDINGS.length; i++) {
        const b = BUILDINGS[i];
        const f = boxFaces(b.gx, b.gy, b.fw, b.fd, 0, b.h + b.grow * e);
        topRefs.current[i]?.setAttribute("d", f.top);
        leftRefs.current[i]?.setAttribute("d", f.left);
        rightRefs.current[i]?.setAttribute("d", f.right);
      }

      // Koerslijn stijgt mee.
      let pts = "";
      for (let i = 0; i < CHART_X.length; i++) {
        const y = CHART_Y[i] - CHART_RISE[i] * e;
        pts += `${CHART_X[i]},${r2(y)} `;
        const dot = dotRefs.current[i];
        if (dot) dot.setAttribute("cy", String(r2(y)));
      }
      lineRef.current?.setAttribute("points", pts.trim());
      const lastY = CHART_Y[CHART_Y.length - 1] - CHART_RISE[CHART_RISE.length - 1] * e;
      haloRef.current?.setAttribute("cy", String(r2(lastY)));
    };

    const request = () => {
      if (!ticking) {
        ticking = true;
        raf = window.requestAnimationFrame(paint);
      }
    };

    const onScroll = () => {
      read();
      request();
    };

    const onMouse = (ev: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (ev.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (ev.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      mouseX = nx < -1 ? -1 : nx > 1 ? 1 : nx;
      mouseY = ny < -1 ? -1 : ny > 1 ? 1 : ny;
      request();
    };

    if (reduced) {
      progress = 0.5;
      paint();
      return;
    }

    read();
    paint();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="bc-stad" aria-hidden="true">
      <style>{CSS}</style>
      <svg viewBox="0 0 960 620" preserveAspectRatio="xMidYMid meet" role="presentation" focusable="false">
        {/* ---------- laag 1: achtergrond (traagst) ---------- */}
        <g ref={bgRef} className="bc-layer">
          <circle cx="560" cy="230" r="220" fill="#b9d9f7" opacity="0.3" />
          <circle cx="270" cy="150" r="96" fill="#5da9e9" opacity="0.12" />
          <circle cx="760" cy="386" r="130" fill="#b9d9f7" opacity="0.2" />
          <path d="M 120,300 L 880,300" stroke="#e3e8f0" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M 180,246 L 820,246" stroke="#e3e8f0" strokeWidth="2" fill="none" opacity="0.5" />
          <g className="bc-sm-hide" opacity="0.55">
            <path d="M 112,196 L 144,180 L 176,196 L 144,212 Z" fill="#b9d9f7" />
            <path d="M 806,164 L 832,151 L 858,164 L 832,177 Z" fill="#b9d9f7" />
            <path d="M 866,300 L 892,287 L 918,300 L 892,313 Z" fill="#b9d9f7" />
          </g>
        </g>

        {/* ---------- laag 2: platform, skyline, karakter ---------- */}
        <g ref={cityRef} className="bc-layer">
          {/* zachte grondschaduw */}
          <ellipse cx="480" cy="492" rx="286" ry="52" fill="#0033a0" opacity="0.07" />

          {/* platform */}
          <path d={PLATFORM_RIGHT} fill="#0072ce" />
          <path d={PLATFORM_LEFT} fill="#5da9e9" />
          <path d={PLATFORM_TOP} fill="#b9d9f7" />
          <g stroke="#ffffff" strokeWidth="1" opacity="0.35" fill="none">
            {GRID_LINES.map((d, i) => (
              <path key={`gl-${i}`} d={d} />
            ))}
          </g>

          {/* looppad van de verhoging de stad in */}
          <g opacity="0.55">
            {[
              [2.15, 5.1],
              [2.95, 4.55],
              [3.75, 4.0],
            ].map(([gx, gy], i) => {
              const f = boxFaces(gx, gy, 0.75, 0.75, 0, 0);
              return <path key={`pad-${i}`} d={f.top} fill="#ffffff" />;
            })}
          </g>

          {/* skyline = staafdiagram */}
          {BUILDINGS.map((b, i) => {
            const f = boxFaces(b.gx, b.gy, b.fw, b.fd, 0, b.h);
            const [tTop, tLeft, tRight] = TINTS[b.tint];
            const wins = windowsFor(b);
            return (
              <g key={b.id} className={b.hideSm ? "bc-sm-hide" : undefined}>
                <path
                  ref={(el) => {
                    rightRefs.current[i] = el;
                  }}
                  d={f.right}
                  fill={tRight}
                />
                <path
                  ref={(el) => {
                    leftRefs.current[i] = el;
                  }}
                  d={f.left}
                  fill={tLeft}
                />
                <path
                  ref={(el) => {
                    topRefs.current[i] = el;
                  }}
                  d={f.top}
                  fill={tTop}
                />
                <g className={b.seed % 2 === 0 ? "bc-blink" : undefined}>
                  {wins.map((w, wi) => (
                    <path
                      key={`${b.id}-w-${wi}`}
                      d={w.d}
                      fill={w.lit ? "#ecb93f" : "#b9d9f7"}
                      opacity={w.lit ? 0.9 : 0.22}
                    />
                  ))}
                </g>
              </g>
            );
          })}

          {/* boeken — het onderwijs is geworteld in klassieke boeken */}
          <IsoBox gx={2.1} gy={6.2} fw={1.2} fd={0.85} base={0} h={8} fill="#0072ce" />
          <IsoBox gx={2.2} gy={6.3} fw={1.1} fd={0.8} base={8} h={8} fill="#006546" />
          <IsoBox gx={2.15} gy={6.25} fw={1.0} fd={0.75} base={16} h={7} fill="#ecb93f" />

          {/* muntstapel */}
          <g transform="translate(426, 369)">
            <ellipse cx="0" cy="10" rx="20" ry="10" fill="#0033a0" opacity="0.12" />
            <Coin cx={0} cy={0} r={15} h={6} />
            <Coin cx={0} cy={-6} r={15} h={6} />
            <Coin cx={0} cy={-12} r={15} h={6} />
          </g>

          {/* boom — samengestelde groei */}
          <g>
            <ellipse cx={TREE_X} cy={TREE_Y + 4} rx="22" ry="11" fill="#0033a0" opacity="0.1" />
            <IsoBox
              gx={TREE.gx}
              gy={TREE.gy}
              fw={TREE.fw}
              fd={TREE.fd}
              base={0}
              h={TREE.h}
              fill="#006546"
            />
            <g>
              <circle cx={TREE_X - 6} cy={TREE_Y - 56} r="12" fill="#48b483" />
              <circle cx={TREE_X} cy={TREE_Y - 38} r="20" fill="#48b483" />
              <path
                d={`M ${TREE_X},${TREE_Y - 58} A 20 20 0 0 1 ${TREE_X},${TREE_Y - 18} A 8 20 0 0 0 ${TREE_X},${TREE_Y - 58} Z`}
                fill="#006546"
              />
            </g>
          </g>

          {/* verhoging + karakter aan de rand */}
          <path d={PLINTH_FACES.right} fill="#0072ce" />
          <path d={PLINTH_FACES.left} fill="#5da9e9" />
          <path d={PLINTH_FACES.top} fill="#f6f8fb" />
          <path d={PLINTH_FACES.top} fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />

          <g transform={`translate(${r2(CHAR_X)}, ${r2(CHAR_Y)})`}>
            <ellipse cx="0" cy="2" rx="15" ry="7" fill="#0033a0" opacity="0.16" />
            <g className="bc-bob">
              <path
                d="M 0,-34 C 7,-34 11,-24 11,-12 C 11,-3.5 6,1 0,1 C -6,1 -11,-3.5 -11,-12 C -11,-24 -7,-34 0,-34 Z"
                fill="#0033a0"
              />
              <path
                d="M -11,-12 C -11,-24 -7,-34 0,-34 C -3.4,-29.5 -5.2,-22 -5.2,-12 C -5.2,-4.5 -3.2,-0.4 0,1 C -6,1 -11,-3.5 -11,-12 Z"
                fill="#0072ce"
              />
              <ellipse cx="0" cy="-33" rx="8.2" ry="3" fill="#ecb93f" />
              <circle cx="0.5" cy="-43" r="8.6" fill="#ffffff" />
              <circle cx="-2.6" cy="-45" r="3.2" fill="#f6f8fb" />
            </g>
          </g>

          {/* klein muntje dat naast het karakter zweeft */}
          <g className="bc-drift-slow bc-sm-hide">
            <ellipse cx={CHAR_X + 34} cy={CHAR_Y - 52} rx="9" ry="4.5" fill="#ecb93f" />
            <ellipse cx={CHAR_X + 34} cy={CHAR_Y - 52} rx="9" ry="4.5" fill="#ffffff" opacity="0.25" />
          </g>
        </g>

        {/* ---------- laag 3: koersgrafiek boven de stad ---------- */}
        <g ref={chartRef} className="bc-layer">
          {/* stille referentielijn */}
          <polyline
            points={CHART_X.map((x, i) => `${x},${CHART_Y[i]}`).join(" ")}
            fill="none"
            stroke="#b9d9f7"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* koerslijn */}
          <polyline
            ref={lineRef}
            points={CHART_X.map((x, i) => `${x},${CHART_Y[i]}`).join(" ")}
            fill="none"
            stroke="#0072ce"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {CHART_X.map((x, i) => {
            const last = i === CHART_X.length - 1;
            return (
              <circle
                key={`dot-${i}`}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                cx={x}
                cy={CHART_Y[i]}
                r={last ? 5.5 : 3.2}
                fill={last ? "#ecb93f" : "#ffffff"}
                stroke={last ? "#ecb93f" : "#0033a0"}
                strokeWidth="2"
                className={i % 3 === 1 ? "bc-sm-hide" : undefined}
              />
            );
          })}

          <circle
            ref={haloRef}
            cx={CHART_X[CHART_X.length - 1]}
            cy={CHART_Y[CHART_Y.length - 1]}
            r="12"
            fill="#ecb93f"
            className="bc-pulse"
            opacity="0.25"
          />
        </g>

        {/* ---------- laag 4: voorgrond (snelst) ---------- */}
        <g ref={fgRef} className="bc-layer" opacity="0.9">
          <g className="bc-drift">
            <Plate cx={138} cy={508} r={38} />
          </g>
          <g className="bc-drift-slow bc-sm-hide">
            <Plate cx={816} cy={540} r={30} />
            <Coin cx={816} cy={532} r={12} h={5} />
          </g>
          <g className="bc-drift bc-sm-hide">
            <Plate cx={706} cy={498} r={20} h={5} />
          </g>
          <g className="bc-drift-slow">
            <Plate cx={318} cy={578} r={24} h={6} />
          </g>
        </g>
      </svg>
    </div>
  );
}
