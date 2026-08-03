# Ideeën van Jason

Laatst bijgewerkt: 2 augustus 2026.

Alles wat Jason zelf heeft geopperd, op één plek. Dit stond verspreid over `CLAUDE.md`,
`docs/prijsstrategie.md` en `docs/visuele-signatuur.md`, en één idee stond nergens.

Ideeën verdwijnen als ze alleen in een gesprek bestaan. Dit bestand is de plek waar ze
blijven staan tot ze gebouwd of verworpen zijn.

## Gebouwd

| Idee | Waar het staat |
|---|---|
| **Gamification à la Duolingo** — XP, levels, streaks | `src/lib/progress.tsx`, `src/lib/levels.ts` (8 levels, Toeschouwer → Meesterbelegger) |
| **Badges** — echt, niet als tijdelijke opvulling | `src/lib/badges.ts`, 10 stuks met predicaten |
| **Certificaten** per afgeronde cursus, printbaar | `/cursussen/[slug]/certificaat` |
| **Blogruimte** om artikelen in te dumpen | `src/content/blog.ts` + `/blog`. Nieuw artikel = blok toevoegen, de rest volgt vanzelf |
| **Isometrische stijl** — "een sandbox met een character erin" | Variant A "De reis", zie `docs/visuele-signatuur.md` en `/lab` |
| **Zowel losse cursussen als een abonnement**, zodat mensen kunnen kiezen | Losse verkoop werkt; College+ wacht op SEPA |

Kanttekening bij de gamification: hij werkt, maar de voortgang staat in `localStorage` en
reist niet mee naar een ander apparaat. Zie `docs/wat-de-winkel-mist.md`, punt 3.

## Nog niet gebouwd

### AI-studiecoach

**Besluit genomen op 2 aug 2026: zie `docs/college-plus-concept.md`** — de coach wordt oefenmeester (fase 1), met de AFM-grens als architectuurprincipe en een evalset als release-criterium.
Al genoemd op de prijskaart van College+ als kenmerk, terwijl hij niet bestaat. Dat is nu
gemarkeerd als "Beschikbaar bij lancering", maar het blijft een belofte met een deadline.

Jasons idee was om hier **zijn eigen lokale LLM op zijn pc** voor te gebruiken. Dat werkt voor
een prototype, maar niet voor een live site: de thuisverbinding wordt dan de beschikbaarheid
van de studiecoach. Voor productie is een gehoste API nodig.

De harde grens staat al beschreven in `docs/prijsstrategie.md`: een studiecoach mag uitleggen
wat een ETF ís, maar nooit adviseren wat je moet kopen. Dat is geen stijlkeuze maar de scheids-
lijn tussen onderwijs en beleggingsadvies, en die laatste vereist een AFM-vergunning.

### Risicoprofiel-tool
Staat op de roadmap in `CLAUDE.md`. Zelfde grens als hierboven, en scherper: een tool die
iemands risicoprofiel bepaalt zit dicht tegen advies aan. Vóór dit gebouwd wordt moet duidelijk
zijn wat hij wél doet (iemand laten nadenken over horizon en buffer) en wat níét (een
portefeuille voorstellen).

### Cursus Beleggingspsychologie
**Geschreven en live sinds 3 aug 2026** (PR #8): 8 lessen, de biastest en de
paniek-simulator. Het ultimatum ("óf schrijven, óf uit de sitemap halen") is daarmee
opgelost — de teaser is een echte cursus geworden, metadata en learnPoints ongewijzigd.

### Affiliate- en verwijslinks naar boeken
**Dit idee stond nergens opgeschreven — het is bij deze alsnog vastgelegd.** Jason noemde het
als iets wat hij op termijn graag wil: verwijzen naar de boeken waar de cursussen op gebaseerd
zijn, en naar andere producten, met een verwijsvergoeding.

Het past inhoudelijk goed: de cursussen zijn geworteld in Graham, Bogle en Housel, en een lezer
die verder wil is oprecht geholpen met het echte boek. Het is bovendien de enige inkomstenbron
in dit lijstje die geen nieuwe cursus vereist.

Drie dingen die vastliggen vóór dit gebouwd wordt:
- **Verplicht te vermelden.** Een affiliatelink zonder duidelijke melding is misleidende
  reclame. Voor dit merk is dat dodelijker dan voor een ander.
- **Nooit binnen een les.** Een aanbeveling midden in lesmateriaal maakt van onderwijs een
  advertentie. Onderaan of op een aparte boekenpagina wel.
- **Alleen boeken die daadwerkelijk in de cursus gebruikt worden.** Anders wordt de selectie
  door de vergoeding bepaald in plaats van door de inhoud.

### Vragen & antwoorden bij de les — GEBOUWD, redactioneel (3 aug 2026)
Jason wilde interactie, maar geen tweede baan als vragenbeantwoorder en geen frame dat
oogt als een klein, overvraagd eenmansbedrijf ("stel een vraag, Jason antwoordt binnenkort").
Na afweging gekozen: **redactionele Q&A**. Cursisten kunnen (ingelogd) een vraag insturen,
maar er is GEEN beloofde termijn en GEEN zichtbare wachtrij — een inzending is een suggestie,
geen ticket. Jason kiest zélf welke vragen een goed antwoord verdienen; beantwoorde vragen
worden openbaar als een groeiende mini-FAQ die de les scherper maakt. Off-topic of
persoonlijke-adviesvragen (opties bij de Graham-les, "wat moet ik met mijn geld") verschijnen
nooit — die wijst de moderatie af, met de vaste AFM-afwijzing als knop.

Waarom NIET de AI-coach hier: een vrij "vraag maar raak"-vak leidt tot eindeloze prompting
en vragen die de volgende les al beantwoordt. De coach blijft daarom oefenmeester (quizreview),
zoals `docs/college-plus-concept.md` al scopet — niet een open chat bij elke les.
Waarom NIET een algemeen forum: het lege-zaal-probleem, plus AFM-risico op peer-antwoorden.

Bestanden: `src/lib/lesvragen.ts` (modulegrens), `src/lib/beheer.ts` (BEHEER_EMAILS bepaalt
de moderator — er is geen apart admin-account; het is gewoon wélk ingelogd Google-account mag
modereren), `POST /api/lesvragen` (+ /moderatie), `src/components/LesVragen.tsx`, en
`/beheer/vragen` (404 voor niet-beheerders).

### AI-agenten die de site draaien
De langetermijnvisie: Jason levert inhoud en richting, AI-agenten doen support en marketing.
Nog niets van gebouwd. Realistisch eerste stapje is niet "een agent", maar de dingen uit
`docs/wat-de-winkel-mist.md` punt 5 — er kijkt op dit moment niemand naar de winkel, ook geen
mens.

## Afgevallen

| Idee | Waarom |
|---|---|
| Testimonials van de oude site terugzetten | De oude site had nul bestellingen en twee gebruikers; die citaten kunnen dus niemand beschrijven. Zie `CLAUDE.md`, "Eerlijkheid is een productvereiste" |
| "Meest gekozen" op de College+-kaart | We weten niet wat mensen kiezen. Het is "Onze aanbeveling" geworden |
| Elk kwartaal een nieuwe cursus beloven | Stond op de homepage en werd door niets geschraagd. Vervangen door de cursus die echt in de maak is |
