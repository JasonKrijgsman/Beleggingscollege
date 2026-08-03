import type { ReactElement } from "react";
import type { LessonTool } from "@/content/types";
import CompoundCalculator from "./CompoundCalculator";
import IntrinsiekeWaardeTool from "./IntrinsiekeWaardeTool";
import SteunWeerstandTool from "./SteunWeerstandTool";
import OptiePayoffTool from "./OptiePayoffTool";
import OptieKetenTool from "./OptieKetenTool";
import OptieTijdswaardeTool from "./OptieTijdswaardeTool";
import OptieTijdvervalTool from "./OptieTijdvervalTool";
import GedektSchrijvenTool from "./GedektSchrijvenTool";
import OptieVolatiliteitTool from "./OptieVolatiliteitTool";
import OptieGreeksTool from "./OptieGreeksTool";
import HefboomSimulatorTool from "./HefboomSimulatorTool";
import BiasTestTool from "./BiasTestTool";
import PaniekSimulatorTool from "./PaniekSimulatorTool";
import KostenVreterTool from "./KostenVreterTool";

// Registry van les-tools: één regel per tool in plaats van een groeiende
// if-keten in de lespagina. Bewust een volledige `Record`: voeg je een waarde
// toe aan `LessonTool` zonder hier een component te registreren, dan faalt de
// build — precies wat je wilt merken vóór de deploy.
// `optie-uitbetaling` en `optie-strategiebouwer` zijn hetzelfde component in
// een andere gedaante; daarom bevat de map render-functies, geen referenties.
const TOOLS: Record<LessonTool, () => ReactElement> = {
  "rente-op-rente": () => <CompoundCalculator />,
  "intrinsieke-waarde": () => <IntrinsiekeWaardeTool />,
  "steun-weerstand": () => <SteunWeerstandTool />,
  "optie-uitbetaling": () => <OptiePayoffTool mode="enkel" />,
  "optie-keten": () => <OptieKetenTool />,
  "optie-tijdswaarde": () => <OptieTijdswaardeTool />,
  "optie-strategiebouwer": () => <OptiePayoffTool mode="bouwer" />,
  "optie-gedekt-schrijven": () => <GedektSchrijvenTool />,
  "optie-tijdverval": () => <OptieTijdvervalTool />,
  "optie-volatiliteit": () => <OptieVolatiliteitTool />,
  "optie-greeks": () => <OptieGreeksTool />,
  "hefboom-simulator": () => <HefboomSimulatorTool />,
  "bias-test": () => <BiasTestTool />,
  "paniek-simulator": () => <PaniekSimulatorTool />,
  "kosten-vreter": () => <KostenVreterTool />,
};

export default function LesTool({ tool }: { tool?: LessonTool }) {
  if (!tool) return null;
  return TOOLS[tool]();
}
