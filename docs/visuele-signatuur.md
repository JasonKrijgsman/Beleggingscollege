# Visuele signatuur: maakt de isometrische scene de site premium?

**Status:** advies, augustus 2026
**Aanleiding:** de isometrische parallax-scene in `src/components/lab/SceneReis.tsx` (plus `SceneStad.tsx` en `SceneZandbak.tsx`), nu alleen zichtbaar op `/lab` (noindex, buiten de sitemap).
**Vraag:** maakt zoiets de site "premium", minder boilerplate en minder AI-achtig?

---

## 0. Kernoordeel in vijf zinnen

De illustratie kan de site inderdaad minder generiek maken — maar niet om de reden die je hoopt. Het waardevolle deel is de **eigenheid** (handgebouwde SVG in je eigen merkpalet, die iets uitlegt); het risicovolle deel is de **parallax**, waarvoor geen enkel onderzoek een positief effect op vertrouwen, kwaliteitsperceptie of conversie aantoont. Twee sterke, onafhankelijke experimenten zeggen bovendien dat het eerste esthetische oordeel binnen 17–50 ms valt en gedreven wordt door *lage visuele complexiteit* en *hoge herkenbaarheid* — precies de twee assen waarop vier bewegende lagen de verkeerde kant op duwen. En de meest voorspelbare uitkomst: isometrische flat-vector is zelf een van de stijlen die het sterkst geassocieerd wordt met generieke tech-marketing, dus de illustratie die "minder AI" moet voelen is gebouwd in het genre dat het meest genereerbaar is. Netto: **doen, maar kleiner, langzamer, en als onderdeel van een systeem — en pas nádat de dingen zijn geregeld die volgens het bewijs zwaarder wegen.**

---

## 1. Het eerlijke antwoord

### 1.1 Waar het bewijs sterk is

| Claim | Bron | Sterkte | Wat het betekent voor jou |
|---|---|---|---|
| Visueel ontwerp stuurt geloofwaardigheidsoordelen substantieel | Fogg e.a., Stanford Web Credibility (2002), n=2.684, 100 sites | **Sterk in richting, zwak in precisie** — frequentie-analyse van opmerkingen, geen experiment; "design look" was de breedste codeercategorie; 24 jaar oud | "Design look" werd in 46,1% van de opmerkingen genoemd — en bij **financiële sites 54,6%, het hoogste van alle tien categorieën**. Voor jouw niche is uiterlijk geen randzaak. |
| Het esthetische oordeel valt binnen 17–50 ms | Lindgaard e.a. (2006); Tuch e.a. (2012, IJHCS/Google) | **Sterk** — experimenteel, gecontroleerd, tweemaal met verschillende timings | Bezoekers oordelen vóór ze één woord lezen. Wat in die 50 ms telt is de *totaalindruk*, niet de inhoud van de illustratie. |
| Lagere complexiteit en hogere prototypicaliteit = aantrekkelijker | Tuch e.a. (2012), 119 screenshots; Reinecke e.a. (2013, CHI), 548 deelnemers, 450 sites | **Sterk** | Dit is het scherpste tegenargument tegen de huidige scene: vier bewegende lagen + muistilt verhogen complexiteit en verlagen herkenbaarheid. |
| Bij *identieke inhoud* scoort de mooiere versie geloofwaardiger | Robins & Holmes (2008), 21 sitesparen; 14/21 (67%) | **Goed** — methodologisch schoon (content constant gehouden) | Vormgeving beïnvloedt hoe je tekst gelezen wordt, ook als de tekst niet verandert. |
| Ook voor *financiële informatie specifiek* kleurt oppervlakkig design het oordeel over de cijfers | Allport & Pendley (2010), *ISAFM* 17(3-4) | **Goed opzet, één studie, weinig gerepliceerd** | Slecht gestyled = minder geloofwaardige cijfers. Direct relevant voor rendementsgrafieken en rekenvoorbeelden. |
| Mooi ontwerp schaadt de prestatie niet en helpt licht | Preregistreerde meta-analyse (2026, *IJHCI*), 31 studies, 234 effectgroottes, n≈18.794 | **Het sterkste stuk van het dossier** — replicatie + preregistratie | Effect is **g = 0,29**: klein tot middelgroot, met hoge heterogeniteit. Reëel, maar geen wondermiddel. |

### 1.2 Waar het bewijs zwak of afwezig is

| Claim | Werkelijke status |
|---|---|
| "Parallax maakt een site premium / betrouwbaarder" | **Geen enkel bewijs.** Het enige echte experiment (Frederick e.a., *Journal of Usability Studies* 2015, n=86) vond alleen een significant hoger oordeel op "fun". Géén verschil op usability, enjoyment, satisfaction of visual appeal. Twee deelnemers werden misselijk. |
| "Parallax verhoogt conversie" | **Niet aangetoond.** De beschikbare A/B-test vond geen significant verschil en concludeerde dat de extra tijd en kosten het niet waard waren. |
| NN/g's parallax-bevindingen | **Praktijkonderzoek zonder gepubliceerde methode, steekproef of jaartal.** Consistent, gerespecteerd, maar formeel zwak bewijs. Kernobservatie: de reactie van gemiddelde gebruikers is *onverschilligheid* — "average users could care less". |
| "Custom illustratie bouwt vertrouwen" | **Geen fatsoenlijke onderbouwing.** De rondzingende cijfers (98% authentieke beelden, +74% conversie via custom foto's, +161% via UGC) hebben geen traceerbare methodologie en komen van partijen die fotografie verkopen. **Niet gebruiken.** |
| "94% van de eerste indruk is design" / "witruimte verhoogt waargenomen waarde met 300%" / "typografie verhoogt conversie met 35%" | **Slecht geattribueerd tot verzonnen.** Niet doorgeven, ook niet in marketingteksten. |
| "AI-beeld schaadt vertrouwen" | **Zwak-matig maar het meest actuele bewijs dat er is.** CHI 2026 Extended Abstract, n=43: zónder bekendmaking hadden deelnemers *lichte voorkeur voor de AI-beelden*; zodra AI-gebruik werd onthuld verschoof het vertrouwen naar echte fotografie. Implicatie: het probleem is niet dat AI-beeld lelijk is, maar dat **herkenbaarheid als AI** het vertrouwen breekt. |
| Wise-rebrandcijfers (+9,8% conversie, koers +58%) | **Merk-gerapporteerd, zonder controlegroep.** Richtinggevend, geen bewijs. |

### 1.3 De belangrijkste nuance: ontwerp is een poortwachter, geen motor

Twee bronnen zeggen hetzelfde vanuit verschillende hoeken:

- **Sillence e.a. (2004, CHI):** *design appeal voorspelt afwijzing; geloofwaardigheid van de inhoud voorspelt selectie.* Slecht ontwerp kost je de bezoeker in seconden. Goed ontwerp koopt alleen het recht om op je inhoud beoordeeld te worden.
- **Thielsch e.a. (2014, *Interacting with Computers*, n=630):** esthetiek domineert de **eerste indruk**, maar de intentie om terug te komen en aan te bevelen wordt vooral gedreven door de **inhoud** — esthetiek had daar nog maar een klein effect, usability geen.

En het scherpste voorbehoud uit Fogg's eigen onderzoek: de parallelle studie met 15 gezondheids- en financiële **experts** liet zien dat zij "far less concerned about the surface aspects" waren. Naarmate je publiek deskundiger wordt, verdampt het designvoordeel.

### 1.4 Splits de vraag in tweeën

| Onderdeel | Oordeel | Bewijsbasis |
|---|---|---|
| **De illustratie** (eigen SVG, merkpalet, uitlegbare metafoor) | Waarde-onderdeel. Verdedigbaar, mits het een systeem wordt en geen los hero-object. | Indirect maar consistent: eigenheid ontsnapt aan het AI-herkenningsmechanisme; informatiedragend beeld wordt bekeken, decoratief beeld genegeerd (NN/g eyetracking). |
| **De parallax** | Risico-onderdeel. Nergens aangetoond als kwaliteitssignaal, wél aantoonbaar risico op desoriëntatie en performanceverlies. | Eén experiment (alleen "fun"), praktijkobservaties, vestibulaire literatuur. |
| **De muistilt** | Zwakste onderdeel. Bestaat alleen voor muisgebruikers (`mousemove` op de stage, regel 207) — het element dat de signatuur moet dragen is onzichtbaar op mobiel, je grootste kanaal. | n.v.t. — dit is een consistentieprobleem, geen onderzoeksvraag. |

**Het eerlijke antwoord op de vraag van de eigenaar:** ja, dit kan de site minder generiek maken, en in deze niche is dat bovengemiddeld waardevol. Maar de winst zit in eigenheid en herkenbaarheid, niet in de beweging. Als je moest kiezen tussen "de illustratie zonder parallax" en "parallax zonder de illustratie", is de eerste keuze de juiste — en dat is precies andersom dan het gevoel dat zo'n scene geeft als je hem net gebouwd hebt.

---

## 2. De risico's: wanneer slaat dit om?

### 2.1 Gedateerd — het genre is oververzadigd

Isometrische flat-vector valt in dezelfde stijlfamilie als Corporate Memphis / Alegria: de stijl die sinds 2018 door honderden SaaS-sites tegelijk is overgenomen, met uitgebreid gedocumenteerde kritiek (soulless, gesaneerd, individualiteit weggepoetst). Let op wie zegt dat isometrisch nog "rising" is: dat zijn vrijwel uitsluitend partijen die illustratiepakketten verkopen. Redactionele bronnen over wat creative directors in 2025 daadwerkelijk boeken noemen flat, vector en isometrisch **niet één keer** — de beweging gaat naar hand-getekend, rauw, imperfect, persoonlijk, juist als tegenreactie op de vloed aan gladde beelden.

### 2.2 Generiek — de metaforen zijn de drie meest voorspelbare in het domein

| Element in `SceneReis.tsx` | Wat het bedoelt | Waarom het risicovol is |
|---|---|---|
| Pad dat schuin door beeld loopt (`PAD`, regels 69–93) | De reis van de belegger | "Pad = reis" is de standaardmetafoor van elk e-learningplatform |
| Zaailing → struik → boom (regels 320–342, 393–440) | Samengestelde groei | De meest genereerbare beleggingsmetafoor die bestaat |
| Pion als karakter (regels 371–390) | De belegger, zonder gezicht te tekenen | Letterlijk hetzelfde antwoord op hetzelfde probleem als Corporate Memphis: "we willen mensen tonen zonder een mens te tekenen" |
| Muntstapels (regels 345–368) + zwevende gouden munt | Rendement dat zich opstapelt | Grenst aan crypto/trading-app-beeldtaal — het buurland van de get-rich-quick-esthetiek waar je juist vandaan wilt |

**Dit is de scherpste kritiek in het hele dossier:** de illustratie die minder AI-achtig moet voelen, is opgebouwd uit de drie clichés die élke AI zou voorstellen als je vraagt om een beleggingsillustratie.

### 2.3 Afleidend en toegankelijkheidsrisico

- Tot 40% van de bevolking krijgt ooit vertigo; ~4% van de volwassenen heeft chronische balansproblemen. Parallax en scroll-jacking worden expliciet als triggers genoemd, en specifiek: **schuine lijnen ("vertical slants were a big offender")**. Een isometrische scene ís niets anders dan schuine lijnen — en in deze versie bewegen die op vier verschillende snelheden.
- `prefers-reduced-motion` is de juiste implementatie van WCAG 2.3.3 (AAA) en is hier correct gedaan (CSS regel 133 én de JS-transforms via `rustig`, regels 154–157). Maar het dekt alleen mensen die die OS-instelling kennen en gezet hebben.
- **Concreet gat op de rest van de site:** `src/app/globals.css` bevat géén `prefers-reduced-motion`-blok. `.anim-float` (5s infinite) en `.anim-flame` (1,6s infinite) draaien dus door, óók bij mensen die reduced motion hebben ingesteld. De hero-preview-kaart op de homepage gebruikt `anim-float` twee keer. **Dit is het enige echte toegankelijkheidsdefect dat ik gevonden heb — en het zit niet in de scene, maar in de bestaande site.**

### 2.4 Genre-verwarring

Isometrische graphics coderen als "tech / SaaS / crypto-app". Jouw merkbelofte is "geworteld in klassieke boeken". Voor financiële diensten geldt bovendien een specifieke spanning: te conservatief = geen onderscheid, te speels = ondermijnt vertrouwen met andermans geld. Er is ook een tegenkracht die je niet moet negeren: **gelikt ontwerp is in deze niche óók het gereedschap van oplichters** (pig butchering draait op strak vormgegeven trading-dashboards). Naarmate consumenten daaraan wennen, verliest pure gelikheid signaalwaarde en wint *verifieerbaarheid*. Dit is grijze literatuur, geen gecontroleerd onderzoek — maar het sluit precies aan bij Fogg's finance-bevinding dat *company motive* (21,0% vs. 15,5% gemiddeld) en *reputatie* (21,8% vs. 14,1%) bij financiële sites bovengemiddeld vaak genoemd worden.

### 2.5 Samengevat: valkuil → waar deze scene erop zit → tegenmaatregel

| Valkuil | Waar `SceneReis` erop zit | Tegenmaatregel |
|---|---|---|
| Gedateerd genre | Isometrisch flat vector, 2018–2022-esthetiek | Minder "SaaS-tegels", meer papier/inkt/boek-materialiteit; grofste vlakken houden, glans en zwevende objecten weg |
| Generieke metafoor | Pad + pion + boom + muntstapels | Kies er **één** en maak die exact. Boom bij "rente op rente" met de juiste curve, niet als sfeer |
| Decoratief in plaats van informatief | De scene legt niets meetbaars uit | Koppel de scene aan een echt getal uit de cursus (bijv. €200/maand, 7% nominaal, 30 jaar) |
| Vestibulair / motion | 4 lagen × schuine lijnen, tot 90 px verplaatsing | Terug naar max 2–3 lagen, ≤24 px op de snelste laag, muistilt eruit |
| Genre-verwarring met crypto | Gouden munten, zwevende tegels, glinstering | Munten weg of sterk terugbrengen; boeken (regels 413–418) juist prominenter |
| Alleen desktop | `mousemove` (regel 207) + `.bcr-klein-weg { display: none }` onder 640px (regel 132) | Mobiel de statische versie geven en dat ook zo ontwerpen — niet als restje |

---

## 3. Wat volgens het onderzoek méér bijdraagt — gerangschikt

De rangorde volgt de bewijskracht: bovenaan staat waar de sterkste, meest directe bronnen naar wijzen.

### 1. Bewijs dat er een echte mens en een echt bedrijf achter zit

**Waarom.** Dit is de best onderbouwde aanbeveling in het hele dossier voor jóuw categorie. Fogg's finance-data laat zien dat mensen bij financiële sites relatief méér leunen op *betrouwbaarheid* (motief, reputatie, uiterlijk) en mínder op *expertise* — waarschijnlijk omdat leken de inhoud niet kúnnen beoordelen. De inventarisatie van "built with AI"-signalen noemt "No Real Proof" (geen echte foto's, geen concrete cijfers) als een van de twaalf vertrouwensbrekers. En het CHI 2026-experiment laat zien dat vertrouwen naar échte fotografie verschuift zodra AI-beeld herkend wordt.

**Toepassen op deze site.** `src/app/over-ons/page.tsx` heeft het verhaal al goed staan — autodidact, sinds 2016, KvK 71856633, vorige naam Visual Future. Wat ontbreekt is het beeld en de zichtbaarheid:

- Een echte foto van Jason op `/over-ons`, en een kleinere in de footer of onder de hero. Geen studioportret — een foto aan een bureau of bij een boekenkast doet meer.
- Foto van de eigen boekenkast met de klassiekers die de cursussen dragen. Dat is de meest onvervalsbare illustratie die je kunt maken en ondersteunt precies de merkbelofte.
- KvK-nummer zichtbaar in de footer, niet alleen halverwege een pagina.
- **De testimonials op `src/app/page.tsx` (regels 296–312) zijn nu anonieme losse quotes zonder naam, plaats of foto.** Dat is tegelijk een boilerplate-signaal én een verspilde credibility-kans in precies de categorie waar reputatie het zwaarst weegt. Óf attributie erbij (voornaam + plaats, liefst foto), óf voorlopig weghalen. Anonieme lofzang is in de beleggingsniche het patroon van de partijen waar je van weg wilt.

### 2. De inhoud zelf — want die bepaalt of iemand terugkomt

**Waarom.** Thielsch (2014): terugkeer- en aanbevelingsintentie worden gedreven door inhoud, niet door esthetiek. Sillence (2004): inhoud bepaalt selectie. Fogg's experts keken nauwelijks naar het uiterlijk.

**Toepassen.** Eén les die zo goed geschreven is dat iemand hem doorstuurt, doet meer dan de scene. Nederlandse specificiteit is hier je grootste onderscheid: echte AEX- en box 3-cijfers, Nederlandse brokerkosten, een uitgesproken mening over een specifiek boek. Dat is wat een model niet zomaar genereert en wat geen concurrent kopieert.

### 3. Snelheid en Core Web Vitals

**Waarom.** Google's eigen case-overzicht: Vodafone +8% verkoop bij 31% betere LCP; iCook +10% advertentie-omzet bij 15% betere CLS; Yahoo! Japan +15% pageviews per sessie. Opvallend en eerlijk vermeld: er staan **geen INP-cases met cijfers** in — dat bewijs is nog dun. Losstaand feit uit de Web Almanac 2025: slechts 48% van mobiele origins haalt alle Core Web Vitals; INP scoort "goed" op 77% mobiel versus 97% desktop.

**Toepassen.** Zie §5. Belangrijk: een JS-scroll-listener plus `mousemove` die transforms zet, draait op de main thread en is precies wat INP schaadt. In `SceneReis.tsx` zit bovendien een `getBoundingClientRect()` **in** de scroll-handler (regel 183) in plaats van in de rAF-callback — dat is een geforceerde layout-read per scroll-event. Verplaats die lezing naar `teken()` of cache hem via een `ResizeObserver`.

### 4. Typografie, witruimte en ritme

**Waarom.** Hier is het bewijs zwakker dan het internet doet voorkomen (zie §1.2 — de rondzingende percentages zijn onbruikbaar). Wat wél robuust is: cognitive fluency (makkelijker te verwerken = betrouwbaarder gevonden) en het halo-effect. En de inventarisatie van AI-signalen noemt "één sans-serif overal zonder pairing" expliciet.

**Toepassen.** De site draait nu volledig op Open Sans (`src/app/layout.tsx`, `--font-open-sans`). Open Sans is de merkfont uit het 2023-archief en dat is een legitieme reden om hem te houden — maar één familie voor álles is precies het patroon dat als "gegenereerd" leest. De goedkoopste, meest premium-ogende ingreep op deze site:

- Voeg één tweede familie toe voor koppen, in lijn met "geworteld in klassieke boeken" — een serif met redactionele signatuur. Body blijft Open Sans.
- Eén typografische schaal in `@theme` in plaats van ad-hoc `text-4xl`/`text-3xl`-keuzes per pagina.
- Lesinhoud op ~66 tekens per regel met ruime line-height.
- Consistente spacing-ritmiek (de secties op `src/app/page.tsx` wisselen nu tussen `py-16`, `py-8` en `mt-12`).

### 5. Consistentie: van hero-object naar distinctive asset

**Waarom.** Ehrenberg-Bass / Romaniuk: een merkasset telt pas als het scoort op **fame** (herkennen mensen het merk eraan) én **uniqueness** (claimt niemand anders het). Nieuwe assets beginnen per definitie laag op beide en groeien alleen door consequente herhaling over kwartalen. Monzo liet er **90** maken in één visuele taal. Coolblue's effect komt van consequent volhouden, niet van het idee.

**Toepassen.** Eén hero-illustratie op één pagina is geen asset — het is decoratie. Als je dit doet, doe het dan als taal: de tegel als vorm voor badges, het pad als voortgangsvisual op `/leerpad`, de boom als groeivisual bij `CompoundCalculator.tsx`, dezelfde vormtaal op het certificaat. Dat is meteen het antwoord op "wat zou mij ongelijk geven": een systeem is verdedigbaar, een los hero-object niet.

### 6. Micro-interacties met functie

**Waarom.** NN/g: legitieme animatie doet vier dingen — feedback, statusverandering, ruimtelijke metafoor/navigatie, signifier. Alles daarbuiten is "time-filling visual stimulation". Duur: 100–400 ms, feedback binnen 100 ms van de handeling. En het meest relevante voorbeeld voor jou: Brilliant zet animatie **niet in de marketinghero maar in de les**, waar het didactische lading draagt.

**Toepassen.** XP-teller die optelt, badge die inklikt, quiz-feedback, streak-vlam bij winst, de voortgangsbalk die vult. Dat heb je deels al (`Confetti.tsx`, `anim-pop-in`) — maak het consistent qua duur en curve. Dit is per bestede uur waarschijnlijk de hoogste opbrengst na punt 1.

### 7. Pas dán: de hero-illustratie

Onder de voorwaarden in §4.

| # | Ingreep | Bewijskracht | Inspanning | Waar |
|---|---|---|---|---|
| 1 | Foto + naam + KvK + geattribueerde testimonials | Hoog (Fogg finance, CHI 2026) | Laag | `/over-ons`, footer, homepage |
| 2 | Eén uitzonderlijk goede, Nederlands-specifieke les | Hoog (Thielsch, Sillence) | Hoog | `src/content/courses/` |
| 3 | CWV bewaken, main-thread-werk beperken | Hoog (Google-cases) | Midden | scene + globals |
| 4 | Type-pairing + één schaal + ritme | Midden (fluency, halo) | Laag | `layout.tsx`, `globals.css` |
| 5 | Vormtaal uitrollen naar badges/leerpad/certificaat | Midden (Ehrenberg-Bass, Monzo) | Hoog | site-breed |
| 6 | Micro-interacties 100–400 ms met functie | Midden (NN/g, Brilliant) | Midden | `QuizBlock`, `LessonRunner`, `/leerpad` |
| 7 | Hero-illustratie met beperkte parallax | Laag tot neutraal | Al gedaan | homepage |

---

## 4. Do / don't voor deze scene op Beleggingscollege

### 4.1 Waar wel, waar niet

| Plek | Oordeel | Toelichting |
|---|---|---|
| Homepage-hero (rechterkolom, nu `HeroPreviewCard`) | **Ja — de enige plek met volle beweging** | Eén beweging in de hero, verder rust. Overweeg wel: de huidige preview-kaart is functionele proof (leerpad, XP, badge). Illustratie *naast* of *achter* die kaart, niet in plaats ervan. |
| Cursusoverzicht `/cursussen` | Ja, maar **statisch** | Kleiner uitsnede, geen parallax. |
| Cursusdetailpagina | Nee | Taakgerichte pagina; hier moet de inhoud winnen. |
| Lespagina `/cursussen/[slug]/les/[les]` | **Nee — nooit** | NN/g is expliciet: alleen op secundaire content, nooit op hoofdtekst; financiële en taakgerichte publieken vinden scroll-animaties verspilling. |
| `/leerpad` | Ja, als **statische** voortgangsvisual | Hier kan het pad functioneel worden: je positie op het pad = je voortgang. Dat is de enige toepassing waar beweging betekenis draagt. |
| Certificaat | Ja, statisch, printveilig | Vormtaal als kader/zegel. Geen animatie (`@media print`). |
| Lege staten, 404, e-mails | Ja, statisch | Goedkoopste manier om er een asset van te maken. |

### 4.2 Bewegingsbudget

| Parameter | Nu | Advies | Reden |
|---|---|---|---|
| Aantal parallaxlagen | 4 (`LAGEN`, regels 110–115) | 2–3 | Complexiteit is de belangrijkste negatieve factor in het eerste-indruk-onderzoek |
| `BEREIK` | 180 px (regel 117) | 48–60 px | Snelste laag komt nu op 0,5 × 180 = **90 px** — dat is geen subtiele diepte maar een bewegend voorgrondvlak |
| Max verplaatsing snelste laag | ~90 px | **≤ 24 px** | Onder de drempel waarop beweging als diepte leest in plaats van als schuiven |
| Muistilt | tot 28 px (regel 114) | **0 — verwijderen** | Bestaat alleen op desktop; een signatuur die de helft van je publiek nooit ziet, is geen signatuur |
| Oneindige CSS-animaties | 7 (regels 124–131) | ≤ 3, en alleen als de scene in beeld is | Nu draaien ze door als de scene buiten beeld is: batterij weggeven voor iets dat niemand ziet |
| `will-change: transform` | 4 full-bleed lagen (regels 240, 276, 300, 445) | Alleen op lagen die daadwerkelijk bewegen, en alleen tijdens beweging | MDN: "use sparingly", "last resort"; overmatig gebruik kost geheugen en kan de pagina juist vertragen |
| Herhaald afspelen | Ja, continu bij elke scroll | Eén keer per navigatie; geen re-entry-animatie bij terugscrollen | NN/g scroll-animatierichtlijn |

### 4.3 Technische do's

- **Zet de parallax om naar CSS scroll-driven animations** (`animation-timeline: view()`), met de JS-versie als fallback achter `@supports not (animation-timeline: view())`. CSS-versie draait op de compositor thread en blijft soepel onder JS-belasting; JS-versie draait op de main thread en concurreert met INP.
- Blijf uitsluitend bij `transform` en `opacity`. `width`/`height`/`margin` trekken layout terug naar de main thread.
- Verplaats `getBoundingClientRect()` (regel 183) uit de scroll-handler naar de rAF-callback, of cache via `ResizeObserver`.
- Voeg een `IntersectionObserver` toe die zowel de scroll-listener als de CSS-animaties pauzeert wanneer de scene buiten beeld is.
- Reserveer de hoogte van de scene (er staat al `aspect-[5/3]`, goed) zodat CLS 0 blijft.
- Voeg een `prefers-reduced-motion`-blok toe aan `src/app/globals.css` voor `.anim-float`, `.anim-flame`, `.anim-fade-up` en `.anim-pop-in`. **Dit ontbreekt nu volledig.**
- Overweeg een zichtbare "beweging uit"-schakelaar bij de scene; de OS-vlag dekt alleen wie hem kent (WCAG 2.3.3 vraagt om een uitzetmogelijkheid, niet alleen om respect voor de OS-instelling).
- Behoud `role="img"` + `aria-label` op de stage met `aria-hidden` op de SVG's — dat is nu correct gedaan (regels 228, 233–235).

### 4.4 Don'ts

- Geen entree-animaties per sectie. Geen scrolljacking, in geen enkele vorm.
- Geen beweging op of achter lopende tekst.
- Geen tweede en derde variant in productie. Kies er één; `SceneStad.tsx` en `SceneZandbak.tsx` zijn samen ruim 1.300 regels onderhoudslast die geen bezoeker ziet. Archiveer of verwijder ze zodra de keuze gemaakt is.
- Geen aparte kleuren buiten het merkpalet — de huidige aanpak (alleen merkkleuren, tussentinten via ink-/wit-overlay, regels 11–22) is precies goed en moet zo blijven.
- Niet de illustratie inzetten om te compenseren voor wat ontbreekt. De scene camoufleert het ontbreken van foto's, namen en concrete cijfers; hij repareert het niet.

---

## 5. Meetbare checks

Meet **vóór** en **ná** het inbouwen, op dezelfde pagina, met dezelfde methode. Veldmetingen (CrUX/Search Console) zijn leidend; lab (Lighthouse) is de snelle controle.

### 5.1 Harde drempels

| Meting | Drempel | Hoe meten | Actie bij overschrijding |
|---|---|---|---|
| LCP (mobiel, p75) | ≤ 2,5 s | PageSpeed Insights veld + Search Console | Scene mag nooit het LCP-element zijn; zorg dat de H1 of hero-tekst dat is |
| CLS | ≤ 0,1, streef 0 | Idem | Aspect-ratio-reservering controleren |
| INP (mobiel, p75) | ≤ 200 ms | Idem, plus DevTools Performance met 4× CPU-throttling | JS-parallax eruit, naar CSS scroll-driven |
| Verschil INP mét vs. zónder scene | ≤ 20 ms | A/B in lab, 4× throttling | Beweging verder terugbrengen |
| Long tasks tijdens scroll | Geen taak > 50 ms | DevTools Performance, scroll over de hero | `getBoundingClientRect` uit de scroll-handler |
| Bundelgroei van de homepage | ≤ 15 kB gzip | `npm run build` output vergelijken | Scene vereenvoudigen; SVG-paden zijn niet gratis |
| Gecomposite lagen | Geen groei > 4 lagen t.o.v. baseline | DevTools → Rendering → Layer borders | `will-change` weghalen waar niet nodig |

### 5.2 Toegankelijkheidschecks

| Check | Norm | Hoe |
|---|---|---|
| `prefers-reduced-motion: reduce` schakelt **alle** beweging uit, ook `anim-float` en `anim-flame` | 100% | DevTools → Rendering → Emulate CSS media feature, en visueel over homepage, `/leerpad`, lespagina |
| Zichtbare "beweging uit"-optie aanwezig | Ja | WCAG 2.3.3 (AAA) |
| Scene heeft tekstalternatief, decoratieve SVG's `aria-hidden` | Ja | Screenreader-test |
| Contrast van alle tekst | ≥ 4,5:1 | axe DevTools of Lighthouse a11y |
| Lighthouse Accessibility (mobiel) | ≥ 95 | `npx lighthouse` |
| Geen beweging bij eerste render zonder gebruikersactie langer dan 5 s zonder pauzemogelijkheid | Ja | WCAG 2.2.2 |

### 5.3 Zachte checks (niet-meetbaar, wel toetsbaar)

- **De vijf-secondentest:** laat drie mensen die de site niet kennen vijf seconden kijken en daarna vertellen wat voor site dit is. Als er "app", "tech" of "crypto" valt in plaats van "cursus", "school" of "leren", faalt de prototypicaliteitstest en moet de scene soberder.
- **De metafoortest:** vraag na afloop wat de boom betekende. Als niemand "samengestelde groei" of "geduld" noemt, is de illustratie decoratief en valt hij in de categorie die volgens NN/g's eyetracking genegeerd wordt.
- **De AI-test:** vraag "denk je dat deze site door een mens of door AI gemaakt is, en waarom?" Als het antwoord over de illustratie gaat, heb je iets bereikt. Als het over de tekst, de drie gelijke kaarten of de anonieme testimonials gaat, weet je waar het echte werk ligt.

---

## 6. Beslismoment

**Ga door als** je bereid bent er een systeem van te maken: dezelfde vormtaal op badges, `/leerpad`, certificaat en lege staten, uitgerold over kwartalen. Dan wordt het een distinctive asset en verdient de investering zichzelf terug in herkenbaarheid.

**Doe het niet als** het bij één hero-object blijft. Eén decoratieve scene met 90 px beweging op één pagina is precies het profiel waar het onderzoek negatief over is — en de overige 95% van de tijd kijkt iemand naar lessen, quizzen, typografie en jouw tekst. Dáár wordt beslist of het echt voelt.

**Wat een AI in 2026 moeiteloos maakt:** een isometrische SVG-scene met parallax.
**Wat een AI niet maakt:** jouw gezicht op de over-ons-pagina, jouw uitgesproken mening over een specifiek boek, foto's van je eigen boekenkast, Nederlandse rekenvoorbeelden met echte AEX- en box 3-cijfers, geattribueerde recensies van echte cursisten, en één les die zo goed geschreven is dat iemand hem doorstuurt.

---

## Bronnen

**Geloofwaardigheid en eerste indruk**
- Fogg e.a. (2002), *How Do People Evaluate a Web Site's Credibility?*, Stanford Persuasive Technology Lab / Consumer WebWatch — https://dejanmarketing.com/media/pdf/credibility-online.pdf · https://credibility.stanford.edu/ · ACM: https://dl.acm.org/doi/10.1145/997078.997097
- Stanford Web Credibility Guidelines — https://credibility.stanford.edu/guidelines/index.html
- Lindgaard e.a. (2006), *Attention web designers: You have 50 milliseconds*, B&IT 25(2) — https://www.tandfonline.com/doi/abs/10.1080/01449290500330448
- Tuch, Presslaber, Stöcklin, Opwis & Bargas-Avila (2012), IJHCS 70(11) — https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/ · https://dl.acm.org/doi/10.1016/j.ijhcs.2012.06.003
- Reinecke e.a. (2013, CHI), *Predicting Users' First Impressions of Website Aesthetics* — https://dl.acm.org/doi/10.1145/2470654.2481281
- George, Mirsadikov & Mennecke (2016), *AIS THCI* 8(2) — https://aisel.aisnet.org/thci/vol8/iss2/1/

**Esthetiek, geloofwaardigheid en gedrag**
- Robins & Holmes (2008), *Information Processing & Management* 44(1) — https://doi.org/10.1016/j.ipm.2007.02.003
- Allport & Pendley (2010), *ISAFM* 17(3-4) — https://onlinelibrary.wiley.com/doi/10.1002/isaf.318
- Sillence, Briggs, Fishwick & Harris (2004, CHI) — https://eprints.whiterose.ac.uk/9909/ · vervolg: https://dl.acm.org/doi/10.1016/j.ijhcs.2006.02.007
- Thielsch, Blotenberg & Jaron (2014), *Interacting with Computers* 26(1) — http://www.thielsch.org/download/paper/Thielsch_et_al_2014.pdf
- Preregistreerde meta-analyse (2026), *IJHCI*, *Attractive Things Do Work Better*, g = 0,29 — https://www.tandfonline.com/doi/full/10.1080/10447318.2026.2664081 · data: https://zenodo.org/records/18777943
- Karvonen (2000), *The Beauty of Simplicity* — https://dl.acm.org/doi/10.1145/355460.355478
- Hekkert, Snelders & van Wieringen (2003), MAYA, *British Journal of Psychology* 94 — https://www.researchgate.net/publication/10846803

**Animatie, parallax en toegankelijkheid**
- NN/g, *What Parallax Lacks* — https://www.nngroup.com/articles/parallax-usability/
- NN/g, *Scrolljacking 101* (2024) — https://www.nngroup.com/articles/scrolljacking-101/
- NN/g, *Scroll-Triggered Animations* — https://www.nngroup.com/articles/scroll-animations/
- NN/g, *The Role of Animation and Motion in UX* — https://www.nngroup.com/articles/animation-purpose-ux/ · https://www.nngroup.com/articles/animation-duration/
- Frederick, Mohler, Vorvoreanu & Glotzbach (2015), *Journal of Usability Studies*, n=86 — https://uxpajournal.org/the-effects-of-parallax-scrolling-on-user-experience-in-web-design/
- A List Apart, *Accessibility for Vestibular Disorders* — https://alistapart.com/article/accessibility-for-vestibular/
- W3C, *Understanding SC 2.3.3 Animation from Interactions* — https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
- MDN, `will-change` — https://developer.mozilla.org/en-US/docs/Web/CSS/will-change
- web.dev, *Stick to compositor-only properties and manage layer count* — https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count
- Chrome, *Scroll-driven animations* — https://developer.chrome.com/docs/css-ui/scroll-driven-animations · https://developer.chrome.com/blog/scroll-animation-performance-case-study
- NN/g, *Photos as Web Content* (eyetracking) — https://www.nngroup.com/articles/photos-as-web-content/

**Stijl, merk en het "AI-gevoel"**
- CHI 2026 EA, *How AI-generated images affect human preference and trust in websites* (n=43) — https://dl.acm.org/doi/10.1145/3772363.3798849
- First Monday, *Do I spy AI?* — https://firstmonday.org/ojs/index.php/fm/article/download/13799/12008/90649
- Utsubo, *The "Built with AI" Tell: 12 Signals That Drop Trust* — https://www.utsubo.com/blog/built-with-ai-trust-signals-2026
- Wikipedia, *Corporate Memphis* — https://en.wikipedia.org/wiki/Corporate_Memphis
- AIGA Eye on Design over Corporate Memphis — https://eyeondesign.aiga.org/what-the-think-pieces-about-corporate-memphis-tell-us-about-the-state-of-illustration/
- Unbounce, *How the Illustration Design Trend Caught Fire* — https://unbounce.com/design/branding-cartoon-illustration-design-trend/
- Creative Boom, *Illustration trends: what creative directors are commissioning in 2025* — https://www.creativeboom.com/insight/illustration-trends-what-creative-directors-are-commissioning-in-2025/
- Ehrenberg-Bass / Romaniuk over distinctive brand assets — https://marketingscience.info/news-and-insights/brands-need-distinctive-assets
- Ragged Edge × Monzo — https://raggededge.com/partnerships/monzo · Ragged Edge × Wise — https://raggededge.com/partnerships/wise
- Duolingo Design, *Imagery* — https://design.duolingo.com/identity/imagery
- Linear, *Craft* — https://linear.app/now/craft
- Eleken, *Making it like Stripe* — https://www.eleken.co/blog-posts/making-it-like-stripe
- Rive × Brilliant.org — https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations

**Prestaties en business impact**
- web.dev, *Core Web Vitals business impact case studies* — https://web.dev/case-studies/vitals-business-impact
- State of Web Animation 2026 (Web Almanac-data) — https://annnimate.com/state-of-web-animation

**Niet gebruiken (bij deze bronnen ontbreekt traceerbare methodologie):** "94% van de eerste indruk is design", "witruimte verhoogt waargenomen waarde met 300%", "typografie verhoogt conversie met 35%", "98% van consumenten vindt authentieke beelden cruciaal", "custom foto's = +74% conversie", "+161% conversie via UGC", en de aan Sillence toegeschreven "83%/94% van het wantrouwen was ontwerp-gerelateerd".
