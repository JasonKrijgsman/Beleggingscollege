"use client";

import { useState } from "react";
import SceneReis from "@/components/lab/SceneReis";
import SceneStad from "@/components/lab/SceneStad";
import SceneZandbak from "@/components/lab/SceneZandbak";

type VariantKey = "reis" | "stad" | "zandbak";

const VARIANTEN: {
  key: VariantKey;
  naam: string;
  pitch: string;
  Scene: React.ComponentType;
}[] = [
  {
    key: "reis",
    naam: "A · De reis",
    pitch:
      "Een pad dat schuin door het beeld loopt met het karakter erop. Van links naar rechts groeit een zaadje uit tot een boom. Verhalend en rustig: je leest de groei af aan de scene.",
    Scene: SceneReis,
  },
  {
    key: "stad",
    naam: "B · De stad",
    pitch:
      "Een skyline waarvan de gebouwen tegelijk staafdiagram zijn. Het karakter kijkt er vanaf een verhoging over uit. Bij scrollen groeien de blokken echt vanaf hun basis omhoog.",
    Scene: SceneStad,
  },
  {
    key: "zandbak",
    naam: "C · De zandbak",
    pitch:
      "Een zwevend diorama: een eilandje met een randje eromheen, alsof je in een speelgoedwereld kijkt. Kantelt mee met je muis, alsof je het object kunt ronddraaien.",
    Scene: SceneZandbak,
  },
];

export default function LabClient() {
  const [actief, setActief] = useState<VariantKey>("zandbak");
  const variant = VARIANTEN.find((v) => v.key === actief)!;
  const Scene = variant.Scene;

  return (
    <>
      {/* Kiezer */}
      <div className="sticky top-16 z-30 border-b border-lijn bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
          <span className="mr-1 text-xs font-bold uppercase tracking-wider text-body">
            Variant
          </span>
          {VARIANTEN.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setActief(v.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                v.key === actief
                  ? "bg-navy-600 text-white"
                  : "bg-mist text-body hover:bg-lijn"
              }`}
            >
              {v.naam}
            </button>
          ))}
        </div>
      </div>

      {/* De scene zelf */}
      <div key={actief} className="border-b border-lijn bg-white">
        <Scene />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h2 className="text-2xl font-bold text-ink">{variant.naam}</h2>
        <p className="mt-2 leading-relaxed text-body">{variant.pitch}</p>

        <div className="mt-8 rounded-2xl border border-lijn bg-white p-6 shadow-card">
          <h3 className="font-bold text-ink">Blijf scrollen om de diepte te zien</h3>
          <p className="mt-2 text-sm leading-relaxed text-body">
            Het parallax-effect werkt op scrollpositie: achtergrondlagen bewegen
            traag, voorgrondlagen sneller. Scroll dus rustig op en neer terwijl
            je naar de scene hierboven kijkt. Beweeg ook je muis over de scene —
            bij alle drie de varianten reageert de wereld daarop, bij variant C
            het sterkst.
          </p>
        </div>

        {/* Ruimte om te scrollen zodat parallax zichtbaar wordt */}
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-body">
          {[
            "Deze tekst staat er alleen om te kunnen scrollen. Kijk omhoog naar de scene terwijl je dit doet: de lagen schuiven met verschillende snelheden langs elkaar en dat is wat diepte suggereert.",
            "Vragen om over na te denken: voelt het rustig genoeg om níét af te leiden van de tekst? Wil je dit boven aan élke pagina, alleen op de homepage, of als terugkerend element tussen secties door?",
            "En qua sfeer: moet het serieuzer (meer navy, minder speels) of juist losser (meer goud, meer beweging)? De vorm ligt niet vast — dit zijn startpunten om op te reageren.",
          ].map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      </div>
    </>
  );
}
