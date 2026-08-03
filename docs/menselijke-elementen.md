# Menselijke elementen: wat alleen Jason kan toevoegen

**Status:** definitief advies, augustus 2026. Synthese van vier onderzoekslenzen (gezicht-en-stem, gemeenschap-en-fysiek, geloofwaardigheid-en-netwerk, smaak-en-signatuur), 25 voorstellen gewogen. Getoetst aan `CLAUDE.md`, `docs/productonderzoek.md`, `docs/college-plus-concept.md` en `docs/visuele-signatuur.md`.

> **Hiervan is op 3 augustus 2026 het eerste stuk gebouwd: de redactionele vragenrubriek bij
> de les.** Ingelogde cursisten sturen een vraag in; Jason kiest zélf wat hij beantwoordt, en
> beantwoorde vragen worden openbaar als groeiende mini-FAQ. **Bewust géén helpdesk: geen
> beloofde reactietermijn en geen zichtbare wachtrij** — een belofte die je niet kunt
> waarmaken is precies waar dit merk zich tegen afzet. Ook bewust géén algemeen forum en géén
> AI-coach op die plek. De code staat in `src/lib/lesvragen.ts` en `src/components/LesVragen.tsx`,
> de moderatie op `/beheer/vragen` achter dezelfde poort als `/beheer`; de
> AFM-standaardafwijzing zit er als knop in. Zie `CLAUDE.md`.
>
> De rest van de top 7 staat nog open. Houd bij het uitvoeren rekening met één technische
> verschuiving: waar hieronder de `purchases`-tabel genoemd wordt, is dat sinds 3 augustus
> `payment_attempts` (wie wat kocht) en `entitlements` (wie er nog recht op heeft).

---

## 1. Het principe

In 2026 is een cursussite met nette teksten en quizzen door iedereen in een weekend te maken. De hele huidige catalogus — getypte lessen, vragen, een voortgangsbalk — is precies het soort product waar AI goed in is, en de markt gaat vollopen met kopieën die er net zo verzorgd uitzien. Wat niet te genereren is: **een specifieke, controleerbare, aanspreekbare mens die er over drie jaar nog steeds blijkt te zijn.**

Dat is geen sentiment maar een toetsbaar criterium. De vertrouwenslens in `docs/productonderzoek.md` vond het gat al: een eerlijk, goedgeschreven /over-ons waarin *niets controleerbaar is* — geen gezicht, geen bron, geen bewijs. En het visuele-signatuuronderzoek leverde het scherpste inzicht van het hele dossier: mensen storen zich niet aan AI-gemaakt materiaal totdat ze het *herkennen* als AI — dan breekt het vertrouwen (CHI 2026-experiment, klein maar het meest actuele bewijs dat er is; zie `docs/visuele-signatuur.md` §1.2). De strategie is dus niet "AI vermijden" — AI bouwt hier terecht de hele machine — maar **verifieerbaar menselijk zijn op de plekken waar het telt.**

Drie dingen maken een element echt onkopieerbaar:

1. **Een gezicht en een naam die ergens aan vastzitten.** KvK 71856633 staat al in de footer; er hoort een mens bij te horen die je kunt zien, horen en desnoods in Den Haag kunt tegenkomen.
2. **Consistentie in de tijd.** Eén video kan in theorie gefaked worden. Een archief van gedateerde kwartaalvideo's, live-sessies met echte vragen, persvermeldingen bij derden en handgeschreven post vormt samen een web van bewijs dat niemand achteraf kan verzinnen. Tijd is het enige ingrediënt dat niet te versnellen is — dus wie vroeg begint, bouwt een voorsprong die elke maand groeit.
3. **Fysieke aanwezigheid.** Papier in een brievenbus, een handtekening met pen, een zaal — het duurste wat er bestaat voor een AI-aanbieder en het goedkoopste wat er bestaat voor één mens met een pen.

En hier is één persoon zijn géén zwakte maar het verhaal zelf. Een contentfabriek kan geen verantwoordelijkheid dragen; "de eerlijke tegenpool van get-rich-quick" werkt alleen als er iemand is die je erop kunt aanspreken. De keerzijde is de bekende merkregel: **beloof alleen ritmes die je volhoudt.** Een gestopte rubriek is erger dan geen rubriek. Daarom wint hieronder consequent het kwartaal- en maandritme van het dag- en weekritme, en is elk voorstel getoetst op: wordt dit een fulltimebaan? Zo ja: geschrapt of geparkeerd.

De rekensom achter de rangschikking: Jasons uren zijn het schaarste goed. Zijn 20% is gezicht, stem, oordeel, handtekening en aanwezigheid; alles eromheen (scripts, montage, transcriptie, componenten, mails, planning) is de 80% die de machine doet. Gerangschikt is op **onderscheidend vermogen per uur van Jason.**

---

## 2. De rangschikking — de top 7

### 1. Het gezicht: één introvideo per cursus plus de over-ons-video

**Wat.** Eén video van 60–90 seconden per cursusdetailpagina ("dit ga je leren, dit is de valkuil, dit ben ik") en één video van ~2 minuten op /over-ons over waarom Beleggingscollege bestaat. Alle vijf à zes op te nemen op één batchdag, bij de eigen boekenkast — die is niet toevallig al de social-proof-sectie van de site.

**Waarom alleen hij.** Dit repareert exact wat de vertrouwenslens vond. Een gezicht dat zegt "dit heb ik gemaakt en hierom" is de ene claim die een AI-cursusfabriek niet kan doen zonder te liegen. De boekenkast op de achtergrond verbindt het bovendien aan de inhoudelijke belofte (klassieke boeken, geen hype).

**Tijdsbeslag.** Eén opnamedag van 4–6 uur, plus ~2 uur vooraf om AI-scriptconcepten in eigen woorden te herschrijven. Spullen eenmalig €300–600: telefoon of camera op statief, draadloze lav-mic (Hollyland Lark M2 ~€140 of DJI Mic 2 ~€270–350), één key light (~€90–130) — bedragen uit de gear-gidsen die de onderzoeker aanhaalde, niet apart geverifieerd, maar de orde van grootte is laag genoeg om de gok te nemen.

**AI neemt over.** Scriptconcepten uit de bestaande cursusteksten, transcriptie, tekstgebaseerd wegknippen van stiltes en versprekingen, kleurcorrectie via één PowerGrade, ondertitels, thumbnails, hosting-embed (Mux/Cloudflare Stream of YouTube-unlisted) — zie deel 3.

**Bewijs.** Het interne bewijs is hier het sterkste: de eigen vertrouwenslens benoemt het ontbrekende gezicht als hoofdgebrek. Montagebenchmarks voor simpele talking-heads: 20–30 min montage per eindminuut (https://www.veedyou.com/how-long-does-it-take-to-edit-a-video/) — precies wat de montagestraat automatiseert.

**Risico.** Perfectionisme. De derde take is goed genoeg; een licht hakkelende, echte Jason is het product, een gladde presentator is het tegendeel ervan. Tweede risico: video's die de cursusinhoud beloven die er nog niet is — het script komt uit de bestáánde lessen, niet uit ambitie.

### 2. Echte fotografie: Jason, de werkplek, de boekenkast

**Wat.** Eén professionele serie van 10–15 beelden: portret aan het echte bureau, handen met een volgekliederd boek, de boekenkast met leesvouwen, Haagse context. Inzet: /over-ons, footer, boekenkast-sectie, de OG-afbeelding (staat nog open in `CLAUDE.md`) en als beeld bij de certificaat-handtekening.

**Waarom alleen hij.** Het zijn zíjn kamer en zíjn boeken. Specifieke, licht rommelige echtheid is precies wat aan het AI-herkenningsmechanisme ontsnapt; gladde stockachtige perfectie triggert het. Let wel — het eigen visuele-signatuuronderzoek prikte de rondzingende conversiecijfers over "authentieke fotografie" al door (§1.2: niet gebruiken). De nuchtere reden is dus niet "fotografie converteert X% beter", maar: verifieerbaarheid, en consistentie met de video's die in dezelfde kamer worden opgenomen.

**Tijdsbeslag.** Halve dag, eenmalig: shotlist (grotendeels aangeleverd, ~1 uur eigen werk), fotograaf 3–4 uur op locatie, selectie 1 uur. Nederlandse tarieven: vanaf ~€550 ex btw voor een halve dag (onderzoekersopgave, bandbreedte klopt met gemiddeld uurtarief ~€94). Herhalen pas nodig als de werkplek wezenlijk verandert.

**AI neemt over.** Shotlist, fotografenbriefing, selectie-advies, compressie via next/image, alt-teksten, plaatsing, OG-metadata, schema.org-koppeling.

**Risico.** De verkeerde fotograaf: wie een LinkedIn-studioportret aflevert heeft de opdracht gemist. De briefing moet expliciet vragen om documentair, niet corporate. Plan de fotodag in dezelfde periode als de videodag: zelfde kamer, zelfde licht, één samenhangend beeld.

### 3. Post uit Den Haag: de handgeschreven kaart en het handgetekende certificaat

**Wat.** Twee fysieke elementen in één routine. (a) Elke koper van een betaalde cursus die bij het afrekenen zijn adres achterlaat ('wil je een kaartje van mij? — hoeft niet') krijgt binnen een week een echte, handgeschreven kaart: drie à vier zinnen, met naam en gekochte cursus. (b) Wie een betaalde cursus afrondt kan een fysiek certificaat aanvragen: A4 op 300-grams papier in huisstijl, naam en datum gedrukt, handtekening écht met pen, in een stevige envelop. De bestaande printbare certificaatpagina blijft; dit is de tastbare laag erbovenop.

**Waarom alleen hij.** Dit is het meest letterlijk onkopieerbare element van de hele lijst: handschrift, pen, postzegel, brievenbus. Geen enkele AI-cursusfabriek doet dit, omdat het niet schaalt — en dat het niet schaalt is precies de boodschap. Bovendien is dit de categorie die mensen fotograferen en delen; het is het enige marketingkanaal dat als cadeau aanvoelt.

**Tijdsbeslag.** Eenmalig: kaarten en certificaatpapier laten drukken (~€70–140 totaal, Drukwerkdeal), postzegels (PostNL €1,40 per stuk sinds 1-1-2026). Doorlopend: ~5 minuten per kaart en ~5 minuten per certificaat, gebatcht op één vast postmoment per week. Bij 5 verkopen per week: ~25 min. Wordt het meer dan een uur per week, dan schakelt de kaart terug naar alleen-mijlpalen (eerste afronder, honderdste klant) — die afbouwregel nu al vastleggen voorkomt een stille belofte-breuk later.

**AI neemt over.** Kaart- en certificaatontwerp als printklare PDF (naam/datum/cursus automatisch uit de database), het adres- en aanvraagformulier, de wekelijkse schrijf- en printlijst uit `payment_attempts` (wie kocht wat, met ordernummer) gefilterd op een geldig `entitlements`-recht, adresetiketten, de mail 'je certificaat is onderweg', voorraadherinnering.

**Bewijs.** Direct bewijs uit Nederlandse cursusmarkt heb ik niet; dit is eerlijk gemarkeerd het minst onderbouwde én goedkoopste voorstel van de top 7. De kosten per klant (~€2–3) zijn zo laag dat het experiment zichzelf rechtvaardigt.

**Risico.** AVG: het adres wordt alleen met expliciete toestemming gevraagd, alleen hiervoor gebruikt en na verzending niet bewaard voor iets anders — één regel in de privacyverklaring. En: de winkel draait nu nog op een `test_`-key; kaarten kunnen alvast gedrukt liggen, maar de routine start pas bij echte kopers.

### 4. College Live: het maandelijkse vragenuur

**Wat.** Voorstellen 4 en 9 zijn hetzelfde idee en worden er één. Eén vast uur per maand (bijv. eerste donderdagavond): Jason behandelt vooraf ingezonden vragen van cursisten plus wat er die maand in de markt gebeurde, in het verlengde van de cursusstof. Opnames in een archief achter de bestaande entitlements-check. **Vanaf dag één een koperssvoordeel, niet gratis voor iedereen** — anders botst het later met de eigen College+-regel dat er nooit bestaande waarde achter de betaalmuur wordt getrokken (`docs/college-plus-concept.md` §3). Dit is het ontbrekende fundament onder College+: het enige onderdeel dat aantoonbaar élke maand opnieuw gemaakt wordt.

**Waarom alleen hij.** Live is de ultieme echtheidstoets: geen montage, geen script, antwoorden op vragen die pas die avond definitief zijn. Dit kan per definitie niet vooraf gegenereerd worden.

**Tijdsbeslag.** ~1 uur voorbereiding + 1 uur live + 15 min nazorg per maand. Spullen: de set van voorstel 1; StreamYard (gratis tier) of Zoom volstaat, YouTube-unlisted streamen is gratis. Géén communityplatform: Skool kost $99/mnd (https://www.courseplatformsreview.com/blog/skool-pricing/) en is pas verdedigbaar bij tientallen actieve leden.

**AI neemt over.** Vragen verzamelen, ontdubbelen en clusteren; concept-agenda; achteraf transcriptie, hoofdstukmarkeringen, samenvatting voor nieuwsbrief, 2–3 marketingfragmenten, Q&A-blokken onder de betreffende lessen; herinneringsmails; het archief. Eén menselijk uur levert zo vier soorten herbruikbare inhoud.

**Bewijs.** Grotendeels intern: de retentielens concludeerde dat het abonnement "geen grond" heeft; een terugkerend levend moment is de eerlijkste grond die er bestaat. Extern bewijs voor dit format specifiek is niet aangeleverd — eerlijk gemarkeerd.

**Risico.** De lege zaal. De regel is: vaste datum, ook met vier kijkers — het archief maakt elke sessie herbruikbaar en de continuïteit ís het bewijs. Tweede risico: live persoonlijke vragen ("ik heb €20.000, wat zou jij doen?") — het vaste, vriendelijke weigerantwoord met uitleg wáárom (opleider, geen AFM-vergunninghouder) hoort in de draaiboeknotitie en is, net als bij de AI-coach, zelf onderwijs.

### 5. Het kwartaal-dagboek: de eigen portefeuille als leerverhaal

**Wat.** Voorstellen 5 en 15 samengevoegd, op het houdbare kwartaalritme. Elk kwartaal één video (10–15 min) plus blogartikel: wat er in Jasons eigen portefeuille gebeurde, welke afweging hij maakte, welke fout hij herkende uit zijn eigen cursusstof — in percentages, nooit in euro's, nooit tickers-als-tip, vast frame "kijk mee hoe ik de principes zelf toepas en waar ik worstel; dit is mijn leerproces, geen advies".

**Waarom alleen hij.** Skin in the game is het ultieme bewijs voor "de eerlijke tegenpool van get-rich-quick": een docent die zichtbaar zelf doet wat hij leert, inclusief saaie kwartalen en missers. Het archief wordt met de jaren zelf het bewijsstuk — terugbladeren en controleren dat het echt is kan alleen als het echt jaren bestaat. Dat kan geen concurrent achteraf inhalen.

**Tijdsbeslag.** ~4 uur per kwartaal: cijfers (30 min), script in eigen woorden (1 uur), opnemen (1 uur), eindcontrole (30 min). Eenmalig het belangrijkste werk: met een jurist of gedegen compliance-check het vaste format en de grens vastleggen (proces en percentages: ja; bedragen, instrumenten-als-aanbeveling en "doe dit ook": nee).

**AI neemt over.** Grafieken uit de cijfers, conceptscript uit een gespreksnotitie, montage, ondertiteling, publicatie, het blogartikel als samenvatting (voedt nieuwsbrief én SEO — de ene schrijfgewoonte die de vindbaarheidslens vroeg), en een vaste checklist die elke aflevering langs de AFM-grens legt.

**Bewijs.** De onderzoekers leverden hier geen externe bron; het patroon (publiek eigen-portefeuille-dagboek als geloofwaardigheidsanker) is in de internationale en Nederlandse FIRE/indexbeleggen-hoek gangbaar, maar ik heb geen specifieke case geverifieerd — eerlijk gemarkeerd. Het interne argument is sterk genoeg: het is de merkclaim, uitgevoerd.

**Risico.** Het grootste juridische risico van de top 7, én het grootste moedrisico: stoppen met publiceren in een slecht kwartaal is voor iedereen zichtbaar en beschadigt meer dan nooit beginnen. Alleen starten met het voornemen het minimaal twee jaar vol te houden. De eenmalige juridische toets van het format is een startvoorwaarde, geen optie.

### 6. De leesclub: één klassieker per kwartaal, samen uitgelezen

**Wat.** De boekenclub uit `docs/productonderzoek.md`, maar met de levende laag: Jason leest zichtbaar mee, plaatst twee à drie korte tussentijdse check-ins, en sluit elk kwartaal af met een live bespreking van een uur (Bogle, Housel, Graham, Malkiel). Deelnemers kopen of lenen het boek zelf. Bestemd als College+-onderdeel; de eerste editie kan als openbare pilot, mits er eerlijk bij staat dat het daarna bij het abonnement hoort.

**Waarom alleen hij.** De klassieke boeken zíjn het merk ("uit de boekenkast, niet uit een hype"), en een gespreksleider met een eigen oordeel — "hoofdstuk 8 is gedateerd, sla het over, hierom" — is precies wat een samenvattings-AI niet kan: het oordeel verschilt per mens, en dat verschil is de waarde. Het geeft College+ bovendien het kwartaalritme dat de churnanalyse aanbeveelt.

**Tijdsbeslag.** ~12–15 uur per kwartaal (~1 uur per week), waarvan het herlezen (~6–10 uur) deels vrije tijd is die hij toch al aan dit vak besteedt. Verder: AI-leeswijzer redigeren (~3 uur), check-ins (~1 uur), live sessie (~1,5 uur). Zelfde call-opzet als het vragenuur.

**AI neemt over.** Concept-leeswijzers, kwartaalplanning, alle herinneringsmails, discussievragen per hoofdstuk, transcriptie en samenvatting, hergebruik als blogartikel per boek — waarmee dit voorstel meteen de boekenkast-rubriek (voorstel 22) als schriftelijk residu meelevert, zonder aparte verplichting.

**Bewijs.** Intern: sluit direct aan op het bestaande boekenclub-voorstel in het productonderzoek en het kwartaalritme uit het College+-concept. Extern bewijs voor leesclubs als retentie-instrument is niet aangeleverd — gemarkeerd.

**Risico.** Het zwaarste terugkerende tijdsbeslag van de top 7. Daarom: pas starten zodra het vragenuur twee of drie edities loopt en er een publiek van betalende deelnemers zichtbaar is. Niet beide ritmes in dezelfde maand lanceren.

### 7. Persbereikbaarheid: gratis expertprofiel, reageren als beleggingsopleider

**Wat.** Gratis registreren bij Vaker in de Media (persvragensysteem waar journalisten van o.a. NOS, RTL en de Volkskrant vragen uitzetten) en aanmelden bij ANP Expert Support, op onderwerpen als leren beleggen, beginnersfouten en financiële educatie. Pas na échte publicaties komt er een 'In de media'-sectie op de site — niet eerder.

**Waarom alleen hij.** Een journalist citeert een mens met een naam en een verhaal, geen platform. Elke echte vermelding is een verifieerbaar bewijsstuk bij een derde partij — de sterkste vorm van bewijs die er bestaat, want niet zelf te fabriceren.

**Tijdsbeslag.** ~1 uur eenmalig (profiel), daarna ~15 minuten per relevante persvraag en 30–60 minuten per interview. De succesfactor is reactiesnelheid: persvragen-mail op de telefoon met notificatie aan, want journalistendeadlines zijn vandaag.

**AI neemt over.** Conceptreacties (die Jason in eigen woorden herschrijft), een perspagina met boilerplate en de foto's uit voorstel 2, kernboodschappen per interview ("ik ben opleider, geen adviseur"), monitoring van vermeldingen.

**Bewijs.** De registratieroutes zelf zijn door de onderzoeker aangedragen; actuele voorwaarden van beide diensten heb ik niet los geverifieerd — controleren bij aanmelding.

**Risico.** Verkeerd geciteerd worden op het gevoeligste punt (advies vs. onderwijs). De vaste kernboodschap en de discipline om buiten het eigen domein "daar ben ik niet de juiste voor" te zeggen zijn de dekking. Verwacht bovendien maanden niets: dit is een loterij met gratis loten, geen plan.

### Flankerend: de vitrine (grotendeels machinewerk, wél doen)

Drie voorstellen halen de top 7 niet omdat Jasons aandeel er klein in is — en dat is juist goed nieuws, want ze zijn bijna gratis: de **'controleer mij'-pagina** (voorstel 19: KvK, gezicht, agenda en archief van optredens, leerlogboek, echte mediavermeldingen — alles klikbaar; en bevestigd: NRTO niet najagen onder de €150.000-drempel, CRKBO pas bij B2B-aanbod), de **founder-tijdlijn op /over-ons** (voorstel 24: echte artefacten uit het NAS-archief en archive.org, plus één zelfgekozen fout — die keuze is het enige niet-delegeerbare uur), en de **weigerlijst /wat-wij-niet-leren** (voorstel 21: 4–8 uur eigen oordeel, de rest machine). De top 7 prodúceert het bewijs; deze drie pagina's stellen het tentoon. Bouwen zodra de eerste bewijsstukken er zijn.

---

## 3. Het video-antwoord

Jasons letterlijke vraag was: kan AI video bewerken — ik heb DaVinci Resolve? Het antwoord: **ja, voor 75–85% van het werk, en Resolve is er in 2026 het beste gereedschap voor dat geen abonnement kost.** Maar de verdeling luistert nauw: AI kan knippen, schoonmaken, ondertitelen en renderen; AI kan niet beslissen welke take echt is, wat weg mag, of de uitleg klopt. Dat eindoordeel is en blijft Jasons 15–25%.

**De aanschaf.** DaVinci Resolve Studio, $295 eenmalig (geen abonnement). Studio-exclusief volgens Blackmagic zelf: Voice Isolation, Magic Mask, UltraNR-ruisonderdrukking, Super Scale, Smart Reframe, gezichtsherkenning, objectverwijdering (https://www.blackmagicdesign.com/products/davinciresolve/studio). Resolve 20 voegde AI IntelliScript (timeline uit je script), AI Animated Subtitles, AI Audio Assistant en Multicam SmartSwitch toe (https://www.miracamp.com/learn/davinci-resolve/whats-new-all-new-features-explained). Over welke AI-functies precies in de grátis versie zitten spreken bronnen elkaar tegen (https://filmora.wondershare.com/video-editor-review/davinci-resolve-editing-software.html claimt IntelliScript en subtitles gratis; Blackmagics eigen Studio-pagina suggereert anders) — onzeker, test het zelf, maar voor $295 eenmalig is de vraag academisch: het verdient zich bij de eerste vijf video's terug in bespaarde tijd. Gratis alternatief voor alleen ondertitels: lokaal Whisper draaien en de SRT importeren.

**De keten (de montagestraat, voorstel 6).** Jason drukt op record; daarna: (1) ingest; (2) transcriptie; (3) tekstgebaseerd bewerken — stiltes, valse starts en uh's verwijder je door ze uit het transcript te schrappen; (4) Voice Isolation + loudness-normalisatie; (5) vaste kleurcorrectie via één opgeslagen PowerGrade; (6) intro/outro en titels via Fusion-sjablonen in huisstijl; (7) ondertitels — verplicht, veel mensen kijken zonder geluid; (8) render via preset; (9) upload. Stap 2 t/m 9 zijn machinewerk. Later is dit verder te automatiseren: de externe scripting-API (Python/Lua) is Studio-only en kan headless renderen met `-nogui` (https://resolvedevdoc.readthedocs.io/en/latest/readme_resolveapi.html, https://deric.github.io/DaVinciResolve-API-Docs/).

**De discipline.** Eerst één middag sjablonen inrichten (PowerGrade, Fusion-titel, renderpreset, projectsjabloon). Dan de eerste vijf video's bewust hándmatig door de keten halen; pas Python-scripts schrijven als duidelijk is welke stappen elke keer identiek zijn. Automatiseren wat je nog niet begrijpt is de klassieke valkuil.

**Realistisch eerste project: de over-ons-video van ~2 minuten.** Eén onderwerp, geen cursusdruk, maximale vertrouwenswinst. Reken op: één middag sjablonen, één ochtend opnemen (3–5 takes), één middag door de keten. Na de batchdag van voorstel 1 daalt de doorlooptijd richting 45–75 minuten Jason-tijd per afgewerkte video van 5 minuten — consistent met de benchmark van 20–30 minuten montage per eindminuut (https://www.veedyou.com/how-long-does-it-take-to-edit-a-video/) waarvan de machine het gros overneemt. Een teleprompter-app op de telefoon scheelt hertakes. Het isometrische werk uit /lab kan als videodecor in de Fusion-sjablonen een tweede leven krijgen — maar houd het klein; het eigen visuele-signatuuradvies geldt ook hier.

---

## 4. Wat we niet doen

**Audioversie van elke les (voorstel 2) — geschrapt als onderscheidend element.** De ongemakkelijke waarheid van 2026: stemklonen zijn niet meer van echt te onderscheiden. Audio-zonder-gezicht bewijst dus níéts meer over menselijkheid — het is het enige "mens-element" dat AI inmiddels perfect kan faken, en 3–4 dagdelen inspreken voor een niet-verifieerbaar signaal is de verkeerde besteding. Als service voor kopers later prima; als onderscheid: nee. Het gezicht op video is het verifieerbare medium.

**Een korte video per les (voorstel 3) — nu niet.** Dertig lessen à 2–3 uur doorlooptijd is een contentfabriek naast een eenmanszaak. Eerst de zes introvideo's; per níéuwe cursus is een lesvideo-laag later te heroverwegen als de montagestraat zich bewezen heeft.

**Cohortweken (11) en de Collegedag (13) — geparkeerd, niet gedood.** Beide vereisen een publiek dat er nog niet is; het voorstel voor de Collegedag noemt zelf de juiste drempel (~100 betalende klanten of een vaste kern vragenuur-gasten). Het vragenuur is de graadmeter: als dáár maandelijks vijftien mensen zitten, is het cohort de logische volgende trede.

**Het gedrukte werkboek (12) — geparkeerd.** Sympathiek en dankzij Peecho zelfs automatiseerbaar, maar het is productontwikkeling met dunne marge bovenop digitale tools waarvan het gebruik nog niet bewezen is. Eerst meten of de checklist en het beleggingsplan überhaupt worden ingevuld.

**Het illustratiesysteem per les (25) — geschrapt in deze vorm.** €3.000–9.000 uitbesteed of een half jaar zelf tekenen, terwijl `docs/visuele-signatuur.md` juist leert: systeem vóór volume. De handgeschreven kanttekening (23, zie hieronder) levert de "zichtbare hand" voor een fractie van de prijs. Heroverwegen als het merk draait en er budget is.

**De interviewrubriek (14) — geparkeerd.** 6–9 uur per aflevering plus een gunfactor die een onbekend platform nog niet heeft. De opstap die de onderzoeker zelf noemt — één schriftelijk interview per mail — mag als los experiment, maar er wordt geen rubriek met cadans beloofd die niet waar te maken is.

**De fysieke lesroutes (16, 17) — maximaal één, later.** LEF, Week van het geld, Volksuniversiteit en bibliotheeklezingen zijn stuk voor stuk goed voor de 'controleer mij'-pagina, maar het zijn reistijd-dagdelen die rechtstreeks concurreren met alles hierboven. Als er één komt: de Week van het geld (jaarlijks in maart, afgebakend, aantoonbaar) — beslissen in januari, niet nu.

**Geen keurmerkjacht en geen 24/7-community.** NRTO is met de €150.000-omzetdrempel feitelijk onbereikbaar en dus geen doel; een altijd-aan forum is met vijf leden een spookstad en vraagt moderatie die er niet is. Beide conclusies uit de onderzoeken worden overgenomen.

---

## 5. De eerste stap

**De kanttekening (voorstel 23), komende maand, beginnend bij de gratis cursus.** Eén avond, één vaste pen: voor elke les van de gratis cursus één handgeschreven kanttekening — de plek waar Jason de stof nuanceert, het oneens is met de meester ("Graham zegt X; in de Nederlandse praktijk leerde ik Y") of een eigen fout deelt. Fotograferen met de telefoon, en de machine doet de rest: bijsnijden, een vast kader als component, een optioneel veld in `src/content/types.ts`, alt-teksten met de volledige tekst voor toegankelijkheid en SEO.

Waarom dít het begin is: het vraagt geen camera, geen gezicht, geen stem en geen nieuwe spullen — alleen het denkwerk, en dat is precies het deel dat van hem is. Het is binnen een week zichtbaar op de site, het is letterlijk een menselijke hand in elke les, en het legt de basis voor de rest van de signatuur: dezelfde pen zet straks de handtekening op het certificaat en schrijft de bedankkaarten. Consistentie maakt het een handtekening; daarom één pen, één stijl, volhouden.

Twee kleine bestellingen mogen in dezelfde week de deur uit, zodat het momentum niet verloopt: de bedankkaarten en het certificaatpapier (samen ~€70–140) — dan ligt de brievenbus-routine klaar op het moment dat de `test_`-key wordt vervangen door de live-key en de eerste echte koper zich meldt. En in de agenda voor volgende maand: de gecombineerde foto- en videodag. Daarna heeft de eerlijke tegenpool van get-rich-quick wat hij nu nog mist: een gezicht, een handschrift en een archief dat elke maand een beetje moeilijker te kopiëren wordt.

---

## Bijlage: de vier onderzoekslenzen samengevat

### Lens: gezicht-en-stem

Kernbevinding: het sterkste niet-AI-element dat Beleggingscollege kan toevoegen is Jason zelf — zichtbaar, hoorbaar en live. De vertrouwens-lens constateerde al dat /over-ons "geen gezicht, geen bewijs" heeft; precies dat gat is in 2026 onkopieerbaar te vullen, want een AI kan geen controleerbare mens zijn die op camera staat, live vragen beantwoordt en een echt leerproces toont. De wetenschap helpt mee: de grootste studie naar MOOC-video's (Guo/Kim/Rubin, 6,9 mln kijksessies) vond dat korte (<6 min), informele talking-head-opnames MEER engagement krijgen dan dure studioproducties — lage productiewaarde is dus geen handicap maar een feature, mits het geluid goed is. Bewijs dat dit model werkt bestaat dichtbij: PensionCraft (UK, één ex-bankier als gezicht, membership met live Q&A's), Finanzfluss (DE, 1,56 mln abonnees met eerlijke ETF-educatie), Jong Beleggen (NL, 12+ mln plays met een openbare portefeuille), LYNX (webinars 3x/maand sinds 2012). Minimale set: draadloze lav-mic (Hollyland Lark M2 ~€140 of DJI Mic 2 ~€300), key light (~€100-130), telefoon of bestaande camera op statief — totaal €300-600; geluid is belangrijker dan beeld. HET RESOLVE-ANTWOORD, expliciet: ja, na de opname kan de machine bijna alles. De gratis versie monteert prima, maar de AI-keten die tijd scheelt zit grotendeels in Studio ($295 eenmalig, geen abonnement): Magic Mask, Voice Isolation, UltraNR-ruisonderdrukking, Super Scale, Smart Reframe staan op Blackmagics eigen Studio-pagina; Resolve 20 voegde AI IntelliScript (timeline uit je script), AI Animated Subtitles, Audio Assistant en Multicam SmartSwitch toe (bronnen spreken elkaar tegen over wat daarvan precies gratis is — reken er niet op vóór je het test). Cruciaal: de externe scripting-API (Python/Lua, incl. headless rendering met -nogui) is Studio-only; daarmee is een herhaalbare montagestraat te bouwen: import → transcriptie → tekstgebaseerd stiltes/uh's knippen → voice isolation + loudness-normalisatie → vaste PowerGrade → Fusion-titelsjabloon → ondertitels → renderpreset → klaar voor upload. Realistische werkverdeling: Jason schrijft (met AI) het script, drukt op record en doet de eindcontrole (~45-75 min voor een video van 5 min); de machine doet de rest. Benchmarks: 20-30 min montage per eindminuut voor simpele talking-heads, ~4 min per eindminuut voor talking-head-met-slides; met de AI-keten kost een 5-minutenvideo in het begin 2-3 uur totaal, dalend naar ~1-1,5 uur bij routine. Aanbevolen volgorde: (1) gezicht op de site + introvideo per cursus, (2) audioversies van lessen met eigen stem, (3) korte lesvideo's per module, (4) maandelijkse live vragensessie als fundament onder College+, (5) kwartaalvideo over de eigen portefeuille als leerverhaal (strikt binnen de AFM-grens: proces tonen, nooit aanbevelen), (6) de montagestraat pas bouwen na de eerste vijf handmatige video's. Een eigen wekelijkse podcast raad ik af: de NL-niche is bezet (Jong Beleggen) en het continuïteitsrisico ("podfade") is voor één persoon te groot; audiolessen geven 80% van de waarde zonder dat risico.

### Lens: gemeenschap-en-fysiek

Lens gemeenschap en fysieke wereld: de onkopieerbare kern van Beleggingscollege is dat er één echte, controleerbare mens achter zit — en die mens wordt pas bewijsbaar echt als hij op vaste momenten live verschijnt, fysiek drukwerk ondertekent en af en toe in dezelfde ruimte staat als zijn cursisten. Zeven voorstellen, geordend van klein naar groot: (1) handgeschreven kaart bij de eerste kopers — kan morgen, kost ~€2,50 en 5 minuten per klant, en is het best gedocumenteerde retentiegebaar dat bestaat (Wufoo: 50% minder churn onder kaartontvangers, zelfgerapporteerd); (2) een echt gedrukt, met de hand ondertekend certificaat per post — juist nu grote NL-opleiders (LOI) naar digitaal-only gaan is papier een gat; (3) een maandelijks live vragenuur als community-vorm die een solo-maker volhoudt — tijdgebonden aanwezigheid in plaats van een 24/7-forum dat een spookstad wordt; (4) de kwartaal-leesclub uit het bestaande productonderzoek, maar dan mét Jason als live gespreksleider (Rebel Book Club bewijst dat mensen ~£15/mnd betalen om samen non-fictie te lezen); (5) cohortweken: de bestaande cursus op vaste startdata met één wekelijks live uur — geen nieuwe inhoud, wel de best onderbouwde afmaak-winst uit het hele onderzoek (64% vs 48% completion op 32.000 cursussen; MOOC's zelf 3-15%); (6) een gedrukt beleggingsjournaal/werkboek bij de cursus, via Nederlandse print-on-demand (Pumbo vanaf 1 exemplaar, Peecho kan per bestelling automatisch printen en verzenden); (7) een jaarlijkse Collegedag in Den Haag zodra er ~100 betalende klanten zijn (Jong Beleggen verkocht De Kleine Komedie met 300 man uit; BeleggersFair trekt 3.000+ bezoekers — de vraag naar fysieke beleggersevents in NL is bewezen). Rode draad in de risico's: alles wat live of persoonlijk is trekt "wat moet ík doen met €20.000?"-vragen aan — er moet één vaste, vriendelijke AFM-afwijzing klaarliggen vóór het eerste live moment. Eerlijkheidsmarkering: de drukwerk- en portokosten zijn geverifieerd (PostNL €1,40 per 1-1-2026), maar veel retentiecijfers rond fysieke post komen van leveranciers van precies die dienst; alleen de cohort- en Wufoo-cijfers zijn redelijk hard. Bewuste volgorde: 1→2→3 kunnen deze maand zonder één regel nieuwe code; 4 en 5 zijn agenda-verplichtingen; 6 en 7 pas bij bewezen vraag.

### Lens: geloofwaardigheid-en-netwerk

Onderzocht: zes routes naar geloofwaardigheid die alleen buiten het scherm te verdienen is. Kernbevindingen: (1) De keurmerkroute is nu een doodlopende weg — NRTO eist minimaal €150.000 jaaromzet plus €1.500/jr contributie (nrto.nl/lid-worden/toelatingscriteria), dus eerlijk parkeren; CRKBO (€100 aanvraag + €865 eerste audit) past pas als er beroepsgericht aanbod komt. (2) De meeste geloofwaardigheid per uur zit in gratis persbereikbaarheid via VIDM (vidm.nl, gratis, 1.300+ journalisten van NOS/RTL/Volkskrant — ~15 min per persvraag) en in een maandelijks leerlogboek naar het model van Jong Beleggen (portefeuille openbaar, "geen advies"-frame, 2-4 u/mnd). (3) Interviews met echte Nederlandse auteurs zijn haalbaarder dan verwacht: zelfs kleine podcasts kregen Hendrik Oude Nijhuis & Björn Kijl, en Semmie publiceerde een blog-interview met Corné van Zeijl — auteurs willen boeken promoten en dit sluit naadloos aan op de bestaande boekenkast-sectie. (4) De diepste, best verifieerbare geloofwaardigheid (maar duurste in uren) is fysiek voor de klas staan: Stichting LEF (open vrijwilligers-aanmelding + trainingsdag), Week van het geld (open gastdocent-registratie) en een Volksuniversiteit-docentschap (precedent: zelfstandige Jeroen Cloosterman doceert bij vier Volksuniversiteiten, waaronder Den Haag). (5) Bibliotheken programmeren aantoonbaar beleggen-lezingen door externen en vragen soms publiekelijk om voorstellen. AFM-grens overal geverifieerd (afm.nl/nl-nl/professionals/onderwerpen/finfluencen): advies = reageren op iemands persoonlijke situatie, óók in Q&A en besloten cursussen; proces documenteren en algemene onderbouwde uitleg mag. Rangorde geloofwaardigheid per uur: pers via VIDM > leerlogboek > interviews > bibliotheeklezingen > gastcolleges/Volksuniversiteit > keurmerk (nu niet). Relevante repo-context: docs/architectuur.md scenario 5 voorziet al in videolessen (nooit vanaf Vercel serveren) en docs/mailsjablonen.md meldt eerlijk "niet aangesloten bij een keurmerk" — houd die tekst consistent.

### Lens: smaak-en-signatuur

In 2026 is tekst-met-quizzen door iedereen met AI te maken; wat niet te kopiëren is, is Jasons zichtbare oordeel: zijn hand, zijn gezicht, zijn standpunt en zijn leeservaring. Deze lens levert zes voorstellen die zijn smaak en signatuur productief maken als onderscheid, geordend op opbrengst gedeeld door moeite: (1) echte fotografie van Jason, werkplek en boekenkast — laagste moeite, sterkste bewijsbasis volgens het eigen dossier docs/visuele-signatuur.md (Fogg-finance-data, CHI 2026); (2) de weigerlijst "Wat wij niet leren" als publiek merkstandpunt — De Correspondent en Tony's Chocolonely bewijzen dat expliciete weigeringen een groeimotor kunnen zijn; (3) de boekenkast uitbouwen tot curatorieel hart met geannoteerde eigen exemplaren, leesroutes en anti-aanbevelingen — Ryan Holiday (300.000+ lezers) en Farnam Street (600.000+ abonnees) bewijzen dat pure boekcuratie door één persoon een merk kan dragen; (4) de handgeschreven "kanttekening van Jason" als vast leselement; (5) het founder-verhaal als verifieerbare tijdlijn met artefacten; (6) een handgetekend illustratiesysteem: één informatieve schets per les — met de waarschuwing uit het eigen visuele-signatuurdossier dat isometrische flat-vector juist de meest AI-genereerbare stijl is, dus de hand moet zichtbaar blijven. Rode draad: elk voorstel maakt een claim controleerbaar in plaats van beweerd, precies de as waarop dit merk zegt te concurreren. Grootste gedeelde valkuil: halverwege stoppen — een signatuur die op 6 van de 30 lessen staat is geen signatuur maar inconsistentie.

