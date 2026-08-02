"use client";

import { useEffect, useId, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * VARIANT C — "De zandbak"
 * Een zwevend isometrisch diorama: plateau met randje, een karakter
 * tussen munten, een boekje, een plantje en een trapje. Eronder een
 * dunne schaduw en losse brokjes die sneller meebewegen bij scrollen.
 * Alles is inline SVG, geen libraries, geen afbeeldingen.
 * ------------------------------------------------------------------ */

/* ---------------------------- Merkpalet --------------------------- */
const NAVY = "#0033A0";
const BLAUW = "#0072CE";
const LICHTBLAUW = "#5da9e9";
const HEMEL = "#b9d9f7";
const GROEN = "#006546";
const MINT = "#48b483";
const GOUD = "#ecb93f";
const WIT = "#ffffff";
const LIJN = "#e3e8f0";
const INK = "#0d1b2e";

/* Kleurhulp: meng naar ink (donkerder zijvlak) of naar wit (lichter). */
function kanalen(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}
function meng(a: string, b: string, t: number): string {
  const A = kanalen(a);
  const B = kanalen(b);
  const kanaal = (i: 0 | 1 | 2) =>
    Math.round(A[i] + (B[i] - A[i]) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${kanaal(0)}${kanaal(1)}${kanaal(2)}`;
}
const donker = (c: string, t: number) => meng(c, INK, t);
const licht = (c: string, t: number) => meng(c, WIT, t);

/* --------------------------- Isometrie ---------------------------- *
 * Tegel = 64 breed x 32 hoog (2:1). Ruit: M 0,16 L 32,0 L 64,16 L 32,32 Z
 * Deze projectie wordt in de hele scene consequent gebruikt.
 * ------------------------------------------------------------------ */
const T = 32; // halve tegelbreedte
const HT = 16; // halve tegelhoogte
const OX = 450; // oorsprong van het raster in de viewBox
const OY = 200;
const WAND = 40; // hoogte van de plateau-zijwand
const VELD = 7; // het speelveld ligt 7px lager dan het randje

type Pt = [number, number];

const iso = (gx: number, gy: number): Pt => [
  OX + (gx - gy) * T,
  OY + (gx + gy) * HT,
];
const zak = (p: Pt, dy: number): Pt => [p[0], p[1] + dy];
const afr = (v: number) => Math.round(v * 10) / 10;
const rij = (list: readonly (readonly number[])[], dy = 0) =>
  list.map((p) => `${afr(p[0])},${afr(p[1] + dy)}`).join(" ");

/* Omtrek van het plateau: 6x6 raster met afgesneden hoeken (achthoek). */
const BUITEN_RASTER: Pt[] = [
  [1, 0],
  [5, 0],
  [6, 1],
  [6, 5],
  [5, 6],
  [1, 6],
  [0, 5],
  [0, 1],
];
const BINNEN_RASTER: Pt[] = [
  [1.6, 0.6],
  [4.4, 0.6],
  [5.4, 1.6],
  [5.4, 4.4],
  [4.4, 5.4],
  [1.6, 5.4],
  [0.6, 4.4],
  [0.6, 1.6],
];
const BUITEN: Pt[] = BUITEN_RASTER.map(([x, y]) => iso(x, y));
const BINNEN: Pt[] = BINNEN_RASTER.map(([x, y]) => iso(x, y));

/* Naar de kijker gerichte omtrekpunten (index 2 t/m 5): rechts -> onder -> links */
const VOOR: Pt[] = [BUITEN[2], BUITEN[3], BUITEN[4], BUITEN[5]];
const VOOR_LAAG: Pt[] = VOOR.map((p) => zak(p, WAND));
const MIDDEN: Pt = [
  (VOOR_LAAG[1][0] + VOOR_LAAG[2][0]) / 2,
  VOOR_LAAG[1][1],
];
const PUNT: Pt = [452, 490]; // onderste punt van het zwevende eiland

/* Achterrand van de uitsparing (die wandjes zie je in een verdieping). */
const HOL_ACHTER: Pt[] = [
  BINNEN[6],
  BINNEN[7],
  BINNEN[0],
  BINNEN[1],
  BINNEN[2],
  BINNEN[3],
];

/* Tegel van rastercel (cx, cy) op veldhoogte. */
const tegel = (cx: number, cy: number) =>
  rij([iso(cx, cy), iso(cx + 1, cy), iso(cx + 1, cy + 1), iso(cx, cy + 1)], VELD);

/* Plaatsing van een object op het veld. */
const opVeld = (gx: number, gy: number) => {
  const [x, y] = iso(gx, gy);
  return `translate(${Math.round(x * 10) / 10} ${Math.round((y + VELD) * 10) / 10})`;
};

/* ------------------------- Isometrisch blok ----------------------- *
 * Oorsprong = midden van het grondvlak. fx/fy in tegels, h in px.
 * Bovenvlak licht, linkerzijde iets donkerder, rechterzijde donkerst.
 * ------------------------------------------------------------------ */
function IsoBlok({
  fx,
  fy,
  h,
  kleur,
  boven,
  band,
}: {
  fx: number;
  fy: number;
  h: number;
  kleur: string;
  boven?: string;
  band?: { kleur: string; van: number; tot: number };
}) {
  const mx = ((fx - fy) * T) / 2;
  const my = ((fx + fy) * HT) / 2;
  const P = (gx: number, gy: number, dy: number): Pt => [
    (gx - gy) * T - mx,
    (gx + gy) * HT - my + dy,
  ];
  const N = P(0, 0, -h);
  const E = P(fx, 0, -h);
  const S = P(fx, fy, -h);
  const W = P(0, fy, -h);
  const Eo = P(fx, 0, 0);
  const So = P(fx, fy, 0);
  const Wo = P(0, fy, 0);

  return (
    <>
      <polygon points={rij([W, S, So, Wo])} fill={donker(kleur, 0.18)} />
      <polygon points={rij([S, E, Eo, So])} fill={donker(kleur, 0.36)} />
      {band && (
        <>
          <polygon
            points={rij([
              zak(W, band.van),
              zak(S, band.van),
              zak(S, band.tot),
              zak(W, band.tot),
            ])}
            fill={donker(band.kleur, 0.1)}
          />
          <polygon
            points={rij([
              zak(S, band.van),
              zak(E, band.van),
              zak(E, band.tot),
              zak(S, band.tot),
            ])}
            fill={donker(band.kleur, 0.26)}
          />
        </>
      )}
      <polygon points={rij([N, E, S, W])} fill={boven ?? kleur} />
    </>
  );
}

/* --------------------------- Zwevend brokje ----------------------- */
function Brokje({ s, kleur = MINT }: { s: number; kleur?: string }) {
  const b = 24 * s;
  const hh = 12 * s;
  const punt: Pt = [0, hh + 30 * s];
  return (
    <>
      <polygon
        points={rij([[-b, 0], [0, hh], punt])}
        fill={donker(BLAUW, 0.24)}
      />
      <polygon
        points={rij([[0, hh], [b, 0], punt])}
        fill={donker(BLAUW, 0.45)}
      />
      <polygon points={rij([[0, -hh], [b, 0], [0, hh], [-b, 0]])} fill={kleur} />
    </>
  );
}

/* ------------------------------ Objecten -------------------------- */

/* Boom: samengestelde groei, drie bollen die groter worden naar onder. */
function Boom() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={17} ry={8} fill={INK} opacity={0.12} />
      <IsoBlok fx={0.2} fy={0.2} h={30} kleur={GROEN} boven={licht(GROEN, 0.2)} />
      <g className="bcz-wieg">
        <circle cx={0} cy={-44} r={21} fill={MINT} />
        <path
          d="M 0,-65 A 21,21 0 0 1 0,-23 A 21,21 0 0 0 0,-65 Z"
          fill={donker(MINT, 0.16)}
        />
        <circle cx={-2} cy={-62} r={15} fill={licht(MINT, 0.12)} />
        <path
          d="M -2,-77 A 15,15 0 0 1 -2,-47 A 15,15 0 0 0 -2,-77 Z"
          fill={donker(MINT, 0.1)}
        />
        <circle cx={-1} cy={-79} r={10} fill={licht(MINT, 0.26)} />
        <circle cx={9} cy={-52} r={3} fill={GOUD} />
        <circle cx={-11} cy={-38} r={2.6} fill={GOUD} />
        <circle cx={5} cy={-72} r={2.4} fill={GOUD} />
      </g>
    </g>
  );
}

/* Boeken: het onderwijs is geworteld in klassieke boeken. */
function Boeken() {
  return (
    <g>
      <ellipse cx={0} cy={2} rx={26} ry={12} fill={INK} opacity={0.1} />
      <IsoBlok fx={0.82} fy={0.6} h={9} kleur={NAVY} band={{ kleur: WIT, van: 2.5, tot: 6.5 }} />
      <g transform="translate(3 -10)">
        <IsoBlok fx={0.74} fy={0.54} h={8} kleur={BLAUW} band={{ kleur: WIT, van: 2, tot: 5.5 }} />
      </g>
      <g transform="translate(-2 -19)">
        <IsoBlok fx={0.66} fy={0.5} h={7} kleur={GROEN} band={{ kleur: WIT, van: 2, tot: 5 }} />
      </g>
    </g>
  );
}

/* Trapje: stap voor stap omhoog, met een klein gouden doel bovenaan. */
function Trap() {
  const treden = [2, 1, 0];
  return (
    <g>
      {treden.map((i) => (
        <g key={i} transform={`translate(${16 * i} ${-8 * i})`}>
          <IsoBlok
            fx={0.95}
            fy={0.5}
            h={11 + 11 * i}
            kleur={LICHTBLAUW}
            boven={HEMEL}
          />
        </g>
      ))}
      {/* let op: animatieklasse en transform-attribuut nooit op hetzelfde element */}
      <g transform="translate(32 -49)">
        <ellipse cx={0} cy={0} rx={9} ry={4.5} fill={INK} opacity={0.14} />
        <g className="bcz-zweef">
          <IsoBlok fx={0.3} fy={0.3} h={11} kleur={GOUD} boven={licht(GOUD, 0.24)} />
        </g>
      </g>
    </g>
  );
}

/* Muntstapels. */
function Munten() {
  const stapel = (n: number, r: number) =>
    Array.from({ length: n }, (_, i) => {
      const y = -i * 5.5;
      return (
        <g key={i}>
          <ellipse cx={0} cy={y} rx={r} ry={r / 2} fill={donker(GOUD, 0.3)} />
          <rect x={-r} y={y - 5.5} width={r * 2} height={5.5} fill={donker(GOUD, 0.24)} />
          <ellipse cx={0} cy={y - 5.5} rx={r} ry={r / 2} fill={GOUD} />
        </g>
      );
    });
  return (
    <g>
      <ellipse cx={0} cy={2} rx={28} ry={13} fill={INK} opacity={0.1} />
      <g transform="translate(-13 4)">{stapel(4, 14)}</g>
      <g transform="translate(15 -3)">{stapel(2, 12)}</g>
      <g transform="translate(20 8)">
        <ellipse cx={0} cy={0} rx={12} ry={6} fill={donker(GOUD, 0.24)} />
        <ellipse cx={0} cy={-1.6} rx={12} ry={6} fill={GOUD} />
      </g>
    </g>
  );
}

/* Plantje: net begonnen. */
function Plantje() {
  return (
    <g>
      <ellipse cx={0} cy={1} rx={14} ry={7} fill={INK} opacity={0.1} />
      <IsoBlok fx={0.4} fy={0.4} h={11} kleur={HEMEL} boven={licht(HEMEL, 0.35)} />
      <g className="bcz-wieg">
        <path
          d="M 0,-11 C 0,-20 0,-26 0,-32"
          stroke={GROEN}
          strokeWidth={2.8}
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx={-8} cy={-25} rx={8.4} ry={4.4} fill={MINT} transform="rotate(-22 -8 -25)" />
        <ellipse cx={8} cy={-30} rx={7.2} ry={3.8} fill={licht(MINT, 0.14)} transform="rotate(22 8 -30)" />
      </g>
    </g>
  );
}

/* Karakter: abstract speelfiguurtje, geen gezicht, houding doet het werk. */
function Karakter() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={13} ry={6.5} fill={INK} opacity={0.14} />
      <g className="bcz-bob">
        <g transform="rotate(-4)">
          <ellipse cx={0} cy={-1} rx={11} ry={4.6} fill={donker(BLAUW, 0.32)} />
          <path
            d="M -9,-3 C -9,-12 -5.6,-15 -4.7,-20.5 L 4.7,-20.5 C 5.6,-15 9,-12 9,-3 A 9,3.8 0 0 1 -9,-3 Z"
            fill={BLAUW}
          />
          <path
            d="M -6.6,-4 C -6.6,-12 -3.9,-14.6 -3.3,-20.2 L -0.6,-20.2 C -1.3,-14.6 -3.4,-12 -3.4,-4 Z"
            fill={licht(BLAUW, 0.3)}
          />
          <ellipse cx={0} cy={-20} rx={6.4} ry={2.5} fill={GOUD} />
          <circle cx={0} cy={-28} r={7.2} fill={HEMEL} />
          <path
            d="M 0,-35.2 A 7.2,7.2 0 0 1 0,-20.8 A 7.2,7.2 0 0 0 0,-35.2 Z"
            fill={donker(HEMEL, 0.14)}
          />
          <circle cx={-2.4} cy={-30.4} r={2.4} fill={WIT} opacity={0.5} />
        </g>
      </g>
    </g>
  );
}

/* --------------------------- Scene-stijlen ------------------------ */
const CSS = `
@keyframes bcz-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3.5px); } }
@keyframes bcz-zweef { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes bcz-drijf { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-11px); } }
@keyframes bcz-wieg { 0%,100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.4deg); } }
@keyframes bcz-adem { 0%,100% { transform: scale(1); opacity: 0.16; } 50% { transform: scale(0.9); opacity: 0.1; } }
@keyframes bcz-stijg {
  0% { transform: translateY(8px); opacity: 0; }
  30% { opacity: 0.85; }
  100% { transform: translateY(-30px); opacity: 0; }
}
.bcz-bob { animation: bcz-bob 5.5s ease-in-out infinite; }
.bcz-zweef { animation: bcz-zweef 6s ease-in-out infinite; }
.bcz-drijf { animation: bcz-drijf 8s ease-in-out infinite; transform-origin: center; }
.bcz-wieg { animation: bcz-wieg 7s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
.bcz-adem { animation: bcz-adem 8s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 50%; }
.bcz-stijg { animation: bcz-stijg 7s ease-in-out infinite; }
.bcz-laag { will-change: transform; }
.bcz-klein-weg { display: none; }
@media (min-width: 640px) { .bcz-klein-weg { display: block; } }
@media (prefers-reduced-motion: reduce) {
  .bcz-bob, .bcz-zweef, .bcz-drijf, .bcz-wieg, .bcz-adem, .bcz-stijg { animation: none !important; }
  .bcz-stijg { opacity: 0.5; }
}
`;

/* Vaste (niet-willekeurige) variatie — geen Math.random tijdens render. */
const BROKJES_VER: { x: number; y: number; s: number; d: string; k: string }[] = [
  { x: 232, y: 436, s: 0.55, d: "0s", k: MINT },
  { x: 668, y: 466, s: 0.46, d: "2.6s", k: HEMEL },
  { x: 386, y: 528, s: 0.32, d: "1.3s", k: MINT },
];
const BROKJES_DICHTBIJ: { x: number; y: number; s: number; d: string; k: string; klein?: boolean }[] = [
  { x: 588, y: 538, s: 0.7, d: "0.9s", k: MINT },
  { x: 276, y: 506, s: 0.5, d: "3.4s", k: HEMEL, klein: true },
];
const VONKJES: { x: number; y: number; r: number; d: string; k: string; klein?: boolean }[] = [
  { x: 272, y: 236, r: 5, d: "0s", k: GOUD },
  { x: 636, y: 258, r: 4, d: "2.3s", k: HEMEL, klein: true },
  { x: 692, y: 372, r: 5.5, d: "4.1s", k: GOUD, klein: true },
  { x: 212, y: 330, r: 4.5, d: "5.5s", k: HEMEL },
];
const PAD: Pt[] = [
  [3, 4],
  [2, 4],
  [2, 3],
  [1, 3],
  [1, 2],
];

/* ------------------------------ Component ------------------------- */
export default function SceneZandbak({ className = "" }: { className?: string }) {
  const wortelRef = useRef<HTMLDivElement>(null);
  const achtergrondRef = useRef<HTMLDivElement>(null);
  const schaduwRef = useRef<HTMLDivElement>(null);
  const brokVerRef = useRef<HTMLDivElement>(null);
  const eilandRef = useRef<HTMLDivElement>(null);
  const brokDichtbijRef = useRef<HTMLDivElement>(null);
  const voorgrondRef = useRef<HTMLDivElement>(null);

  const [rustig, setRustig] = useState(false);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  /* prefers-reduced-motion volgen (ook als de gebruiker het wisselt). */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setRustig(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const wortel = wortelRef.current;
    if (!wortel) return;

    const lagen = [
      achtergrondRef.current,
      schaduwRef.current,
      brokVerRef.current,
      eilandRef.current,
      brokDichtbijRef.current,
      voorgrondRef.current,
    ];

    if (rustig) {
      lagen.forEach((el) => {
        if (el) el.style.transform = "";
      });
      return;
    }

    const fijneMuis = window.matchMedia("(pointer: fine)").matches;
    const doel = { p: 0, mx: 0, my: 0 };
    const nu = { p: 0, mx: 0, my: 0 };
    const muis = { x: 0, y: 0, actief: false };
    let raf = 0;

    const klem = (v: number, min: number, max: number) =>
      v < min ? min : v > max ? max : v;

    const schrijf = () => {
      const { p, mx, my } = nu;
      /* Achtergrond loopt achter (traag), voorgrond loopt vooruit (snel). */
      if (achtergrondRef.current)
        achtergrondRef.current.style.transform = `translate3d(${mx * 5}px, ${p * 14}px, 0)`;
      if (schaduwRef.current)
        schaduwRef.current.style.transform = `translate3d(${mx * 11}px, ${p * -10}px, 0)`;
      if (brokVerRef.current)
        brokVerRef.current.style.transform = `translate3d(${mx * 16}px, ${p * -30}px, 0)`;
      if (eilandRef.current)
        eilandRef.current.style.transform =
          `perspective(1100px) translate3d(${mx * 6}px, ${p * -8}px, 0) ` +
          `rotateX(${p * 3.2 - my * 3}deg) rotateY(${mx * 4}deg) rotateZ(${p * 2.4}deg)`;
      if (brokDichtbijRef.current)
        brokDichtbijRef.current.style.transform = `translate3d(${mx * 24}px, ${p * -56}px, 0)`;
      if (voorgrondRef.current)
        voorgrondRef.current.style.transform = `translate3d(${mx * 32}px, ${p * -92}px, 0)`;
    };

    const tik = () => {
      raf = 0;
      const rect = wortel.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      /* -1 (nog onder beeld) .. +1 (al voorbij gescrold) */
      doel.p = klem(
        (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2),
        -1,
        1
      );
      if (muis.actief && rect.width > 0) {
        doel.mx = klem((muis.x - (rect.left + rect.width / 2)) / (rect.width / 2), -1, 1);
        doel.my = klem((muis.y - (rect.top + rect.height / 2)) / (rect.height / 2), -1, 1);
      }
      nu.p += (doel.p - nu.p) * 0.14;
      nu.mx += (doel.mx - nu.mx) * 0.07;
      nu.my += (doel.my - nu.my) * 0.07;
      const klaar =
        Math.abs(doel.p - nu.p) < 0.0006 &&
        Math.abs(doel.mx - nu.mx) < 0.002 &&
        Math.abs(doel.my - nu.my) < 0.002;
      if (klaar) {
        nu.p = doel.p;
        nu.mx = doel.mx;
        nu.my = doel.my;
        schrijf();
        return;
      }
      schrijf();
      raf = requestAnimationFrame(tik);
    };

    const vraag = () => {
      if (!raf) raf = requestAnimationFrame(tik);
    };

    const opScroll = () => vraag();
    const opMuis = (e: MouseEvent) => {
      muis.x = e.clientX;
      muis.y = e.clientY;
      muis.actief = true;
      vraag();
    };
    const opVerlaten = () => {
      muis.actief = false;
      doel.mx = 0;
      doel.my = 0;
      vraag();
    };

    window.addEventListener("scroll", opScroll, { passive: true });
    window.addEventListener("resize", opScroll, { passive: true });
    if (fijneMuis) {
      window.addEventListener("mousemove", opMuis, { passive: true });
      document.addEventListener("mouseleave", opVerlaten);
    }
    vraag();

    return () => {
      window.removeEventListener("scroll", opScroll);
      window.removeEventListener("resize", opScroll);
      if (fijneMuis) {
        window.removeEventListener("mousemove", opMuis);
        document.removeEventListener("mouseleave", opVerlaten);
      }
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rustig]);

  /* Uitsnede zit strak om het diorama: het wereldje vult het kader. */
  const vb = "90 110 720 500";

  return (
    <div
      ref={wortelRef}
      aria-hidden="true"
      className={`relative w-full select-none overflow-hidden ${className}`}
      style={{ aspectRatio: "720 / 500" }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ---------- Laag 1: achtergrond (traagst) ---------- */}
      <div ref={achtergrondRef} className="bcz-laag absolute inset-0">
        <svg viewBox={vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id={`gloed${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={WIT} stopOpacity="0.95" />
              <stop offset="70%" stopColor={WIT} stopOpacity="0.55" />
              <stop offset="100%" stopColor={WIT} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={450} cy={318} r={248} fill={`url(#gloed${uid})`} />
          <circle
            cx={450}
            cy={325}
            r={205}
            fill="none"
            stroke={LIJN}
            strokeWidth={1.5}
            className="bcz-klein-weg"
          />
          <g fill="none" stroke={LIJN} strokeWidth={1.5}>
            <polygon points={rij([[128, 256], [168, 236], [208, 256], [168, 276]])} />
            <polygon
              points={rij([[700, 178], [732, 162], [764, 178], [732, 194]])}
              className="bcz-klein-weg"
            />
            <polygon
              points={rij([[722, 436], [754, 420], [786, 436], [754, 452]])}
              className="bcz-klein-weg"
            />
          </g>
          <g opacity={0.5}>
            <g transform="translate(148 392) scale(0.34)">
              <g className="bcz-drijf">
                <Brokje s={1} kleur={HEMEL} />
              </g>
            </g>
            <g transform="translate(766 296) scale(0.28)" className="bcz-klein-weg">
              <g className="bcz-drijf">
                <Brokje s={1} kleur={HEMEL} />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* ---------- Laag 2: dunne schaduw onder het eiland ---------- */}
      <div ref={schaduwRef} className="bcz-laag absolute inset-0">
        <svg viewBox={vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          <g className="bcz-adem">
            <ellipse cx={452} cy={556} rx={134} ry={22} fill={NAVY} opacity={0.16} />
            <ellipse cx={452} cy={556} rx={70} ry={11} fill={NAVY} opacity={0.14} />
          </g>
        </svg>
      </div>

      {/* ---------- Laag 3: brokjes ver weg ---------- */}
      <div ref={brokVerRef} className="bcz-laag absolute inset-0">
        <svg viewBox={vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          {BROKJES_VER.map((b, i) => (
            <g key={i} transform={`translate(${b.x} ${b.y})`}>
              <g className="bcz-drijf" style={{ animationDelay: b.d }}>
                <Brokje s={b.s} kleur={b.k} />
              </g>
            </g>
          ))}
        </svg>
      </div>

      {/* ---------- Laag 4: het diorama (kantelt en roteert subtiel) ---------- */}
      <div
        ref={eilandRef}
        className="bcz-laag absolute inset-0"
        style={{ transformOrigin: "50% 52%" }}
      >
        <svg viewBox={vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          <g className="bcz-drijf">
            {/* onderkant: taps toelopend naar een punt */}
            <polygon
              points={rij([VOOR_LAAG[3], VOOR_LAAG[2], MIDDEN, PUNT])}
              fill={NAVY}
            />
            <polygon
              points={rij([VOOR_LAAG[0], VOOR_LAAG[1], MIDDEN, PUNT])}
              fill={donker(NAVY, 0.24)}
            />
            {/* zijwand van het plateau */}
            <polygon
              points={rij([VOOR[2], VOOR[3], VOOR_LAAG[3], VOOR_LAAG[2]])}
              fill={donker(BLAUW, 0.18)}
            />
            <polygon
              points={rij([VOOR[1], VOOR[2], VOOR_LAAG[2], VOOR_LAAG[1]])}
              fill={donker(BLAUW, 0.28)}
            />
            <polygon
              points={rij([VOOR[0], VOOR[1], VOOR_LAAG[1], VOOR_LAAG[0]])}
              fill={donker(BLAUW, 0.4)}
            />

            {/* het randje (bovenvlak) */}
            <polygon points={rij(BUITEN)} fill={HEMEL} />
            {/* wandje van de verdiepte zandbak */}
            <polygon
              points={`${rij(HOL_ACHTER)} ${rij([...HOL_ACHTER].reverse(), VELD)}`}
              fill={donker(HEMEL, 0.16)}
            />
            {/* het speelveld */}
            <polygon points={rij(BINNEN, VELD)} fill={MINT} />
            {/* subtiele grasvlakjes (alleen cellen die helemaal binnen het veld vallen) */}
            <polygon points={tegel(3, 1)} fill={licht(MINT, 0.1)} />
            <polygon points={tegel(3, 3)} fill={donker(MINT, 0.07)} />
            {/* zandpad */}
            <g fill={licht(GOUD, 0.62)}>
              {PAD.map(([cx, cy]) => (
                <polygon key={`${cx}-${cy}`} points={tegel(cx, cy)} />
              ))}
            </g>

            {/* objecten, van achter naar voren getekend */}
            <g transform={opVeld(1.0, 1.7)}>
              <Boom />
            </g>
            <g transform={opVeld(1.4, 3.9)}>
              <Boeken />
            </g>
            <g transform={opVeld(4.1, 2.2)}>
              <Trap />
            </g>
            <g transform={`${opVeld(2.6, 3.4)} scale(1.18)`}>
              <Karakter />
            </g>
            <g transform={opVeld(2.7, 4.7)}>
              <Plantje />
            </g>
            <g transform={opVeld(4.3, 3.6)}>
              <Munten />
            </g>
          </g>

          {/* vonkjes die traag opstijgen */}
          {VONKJES.map((v, i) => (
            <g key={i} transform={`translate(${v.x} ${v.y})`} className={v.klein ? "bcz-klein-weg" : undefined}>
              <g className="bcz-stijg" style={{ animationDelay: v.d }}>
                <polygon
                  points={rij([[0, -v.r], [v.r, 0], [0, v.r], [-v.r, 0]])}
                  fill={v.k}
                />
              </g>
            </g>
          ))}
        </svg>
      </div>

      {/* ---------- Laag 5: brokjes dichtbij ---------- */}
      <div ref={brokDichtbijRef} className="bcz-laag absolute inset-0">
        <svg viewBox={vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          {BROKJES_DICHTBIJ.map((b, i) => (
            <g
              key={i}
              transform={`translate(${b.x} ${b.y})`}
              className={b.klein ? "bcz-klein-weg" : undefined}
            >
              <g className="bcz-drijf" style={{ animationDelay: b.d }}>
                <Brokje s={b.s} kleur={b.k} />
              </g>
            </g>
          ))}
        </svg>
      </div>

      {/* ---------- Laag 6: voorgrond (snelst) ---------- */}
      <div ref={voorgrondRef} className="bcz-laag absolute inset-0">
        <svg viewBox={vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          <g className="bcz-zweef">
            <g transform="translate(146 528)">
              <ellipse cx={0} cy={0} rx={17} ry={8.5} fill={donker(GOUD, 0.26)} />
              <ellipse cx={0} cy={-2.4} rx={17} ry={8.5} fill={GOUD} />
            </g>
          </g>
          <g className="bcz-zweef bcz-klein-weg" style={{ animationDelay: "2.8s" }}>
            <g transform="translate(768 556)">
              <ellipse cx={0} cy={0} rx={13} ry={6.5} fill={donker(GOUD, 0.26)} />
              <ellipse cx={0} cy={-2} rx={13} ry={6.5} fill={GOUD} />
            </g>
          </g>
          <g transform="translate(676 572) scale(0.6)">
            <g className="bcz-drijf" style={{ animationDelay: "1.7s" }}>
              <Brokje s={1} kleur={HEMEL} />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
