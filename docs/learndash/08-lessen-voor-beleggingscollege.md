# 08 — Lessen voor Beleggingscollege: de synthese

> Geschreven 5 aug 2026, op basis van de hoofdstukken 1–7 (documentatie) en 9–11 (de échte broncode, v4.6.0). Dit is het enige hoofdstuk dat oordeelt: wat bevestigt LearnDash aan onze keuzes, wat doet het aantoonbaar beter, en wat zouden we concreet kunnen overnemen. De bewijsvoering staat in de andere hoofdstukken; hier staan alleen de conclusies met verwijzing.
>
> **Dit hoofdstuk is analyse, geen backlog.** Wat er ooit echt gebouwd wordt beslist Jason; kandidaten die hij overneemt horen thuis in `docs/openstaand.md` of `docs/ideeen.md`, niet hier bijgehouden.

## De kortste samenvatting

Tien jaar productontwikkeling van de WordPress-marktleider blijkt vooral een **validatie** van onze architectuurkeuzes — tot in detail: LearnDash kwam na jaren pijn uit op hetzelfde datamodel (samenvattingstabel + feitenlog) waar wij mee begónnen, hun ergste beveiligingslek (quizantwoorden via een zij-ingang) is exact de klasse fout waar wij een bouwtijd-slot op hebben, en hun core doet bij een terugbetaling *niets* waar wij automatisch toegang intrekken. Wat LearnDash wél heeft en wij niet, clustert in drie gebieden: **leerling-communicatie** (de Notifications-triggerlijst), **beheer/rapportage** (ProPanel), en **B2B-verkoop** (Groups met seats). Dat zijn de drie boodschappenlijsten die deze $720 aan licentiekosten alsnog waarde geven.

---

## 1. Wat LearnDash bevestigt aan wat we al hebben

Elk punt hieronder is een keuze die wij al maakten en die LearnDash — meestal door schade — onderschrijft.

| Onze keuze | LearnDash's bewijs | Hoofdstuk |
|---|---|---|
| **Refund → automatisch toegang intrekken** (via `amountRefunded`/chargeback) | Core trekt bij een refund *niets* in; het is een handmatige beheerdersactie die je kunt vergeten. Alleen het WooCommerce-add-on doet het automatisch. | 03 §2, §5 |
| **Eén schrijfpad, atomaire CTE's** (`verwerkLes()`, `verwerkBetaald()`) | LearnDash voert dubbele boekhouding (usermeta + activiteitentabel) en heeft daardoor een permanente "Data Upgrades"-reparatieknop in het beheerscherm. | 06 §3, §8 |
| **`import "server-only"` op `@/content`** | CVE-2024-1208/-1210 (jan 2024): hun REST API serveerde álle quizvragen en -antwoorden aan niet-ingelogde bezoekers. Zelfde klasse fout als ons bundellek van destijds — een tweede uitgang zonder eigen slot. Wij hebben er een bouwfoutmechanisme voor; WordPress kan dat niet. | 03 §9 |
| **Getypte content in TypeScript** | Hun CPT-model koopt het WordPress-ecosysteem maar geen integriteit: de eigen docs waarschuwen tegen duplicatie-plugins, klonen dat quizinstellingen laat vallen, en associaties die alleen via de builder veilig te wijzigen zijn. | 01 §2, §11 |
| **Eigen checkout met Mollie** (iDEAL, factuur, btw) | LearnDash's ingebouwde betalingen kennen **geen factuur en geen btw-begrip**; iDEAL alleen via Stripe. Serieuze EU-shops zetten cursussen op `Closed` en verkopen via WooCommerce — architectonisch exact ons model (LMS bewaakt, externe commerce verkoopt, een koppeling schrijft het recht). Ons hele ontwerp is dus wat hun ecosysteem als best practice beschouwt. | 03 §1, §5, §10 |
| **College+ als entitlements-verlenend abonnement** (niet per cursus) | Sitebrede memberships lopen bij LearnDash áltijd via een membership-plugin die toegang verleent en intrekt; het per-cursus-`Recurring`-model knelt zichtbaar (geen coupons, PayPal-abonnees niet migreerbaar). | 03 §6 |
| **Quizantwoorden reizen niet naar de server** | Half bevestigd, en de broncode corrigeert de documentatie-indruk: LearnDash kijkt wél **server-side** na en ondertekent elke deelscore (zie §2.1b). Wat wij goed doen blijft staan — zij bewaren per gebruiker elk gegeven antwoord, wij niet — maar hun score is betrouwbaar en die van ons niet. Dit is het enige punt in deze tabel dat eerder een waarschuwing dan een felicitatie is. | 02 §7, **11** |
| **`entitlements` als enige toegangspoort** | Hun bedoelde equivalent `sfwd_lms_has_access_fn()` draagt in zijn eigen docblock de opmerking dat het een duplicaat is dat geconsolideerd moet worden, er bestaan twee inschrijvingsrepresentaties náást het groepspad, en afscherming gebeurt via een `the_content`-filter — de lesinhoud staat onbeschermd in de database. Precies waarom wij één functie en geen tweede check willen. | 10 |
| **Webhook verifieert bedrag én valuta** | Hun Stripe-webhook haalt de betaling zelf op aan de hand van het id (goed, net als wij), maar **geen enkele gateway hercontroleert het bedrag tegen de catalogusprijs** op het moment van toekennen. Onze tweede ijzeren regel is bij de marktleider dus niet geïmplementeerd. | 10 |
| **Databasegarantie boven conventie** | Hun activiteitentabel heeft negen indexen maar **geen UNIQUE-sleutel**: uniciteit is een PHP-afspraak. Onze partiële unique index op openstaande betalingen is het tegenovergestelde besluit. | 10 |
| **Native gamification** (XP, 8 levels, streaks, 10 badges) | Core-LearnDash heeft *niets* hiervan; alles komt uit add-ons, en echte streaks bestaan zelfs daar nauwelijks (alleen een login-streak-badge). Onze engine is een reëel differentiatiepunt. | 05 §3 |
| **Lespagina als dedicated leerscherm** | LearnDash moest hiervoor `Focus Mode` uitvinden (thema volledig vervangen, navigatie + voortgang + afrondknop altijd in beeld) en framet het expliciet als retentie-/conversiefeature. Wij hebben het gratis, permanent. | 01 §6, 05 §5 |
| **Redactionele lesvragen i.p.v. forum** | LearnDash heeft geen equivalent; hun community-verhaal is de zware bbPress/BuddyBoss-stack ernaast. Ons model (context bij de les, geen realtime-verwachting) is uniek terrein. | 05 §6 |
| **Serverless + Neon i.p.v. zelf hosten** | Hun ops-hoofdstuk is één lange kostenpost die wij niet betalen: 150+ seconden durende adminpagina's op schaal, autoload-problemen, servereisen die met gebruikersaantal schalen, cache-uitzonderingen per ingelogde pagina. | 06 §9 |
| **Niet afhankelijk van één leverancier** | 2025–2026 als schoolvoorbeeld: kwart van het team ontslagen, merk opgeheven, docs en changelogs zoekgeraakt, prijzen feature-gated. Het product bleef werken; alles eromheen bleek vervangbaar voor de eigenaar. | 07 §1 |

## 2. Wat het waard is over te nemen

Gerangschikt op (waarde voor ons) ÷ (bouwkosten). Per punt: wat, waarom, en waar het bij ons zou landen.

### 2.1 De Notifications-triggerlijst als boodschappenlijst voor mail — hoogste prioriteit

Sinds 5 aug 2026 kán onze site mailen (`verstuurMail()` via Migadu). LearnDash's `Notifications`-add-on is de bewezen lijst van welke mails een leerplatform stuurt (05 §4.2). De voor ons relevante selectie, in volgorde van nut:

1. **Cursusvoltooiing** — met link naar het certificaat. Opvallend: zelfs LearnDash-core stuurt deze niet; het is dé gemiste kans die hun add-on repareert. Trigger bestaat bij ons al (`verwerkLes()` weet wanneer een cursus compleet raakt).
2. **Inactiviteitsreminder** ("je bent X dagen niet ingelogd" / "je cursus wacht op je") — de goedkoopste churn-bestrijding; vergt alleen een periodieke query op `user_stats.lastActivity` + een verzendjournaal zodat niemand dubbel gemaild wordt.
3. **Onboardingreeks** — hun patroon is elegant simpel: één trigger (aankoop) + een vertraging in dagen per mail. Geen aparte campagne-infrastructuur nodig.
4. **Welkom na eerste les** — bevestigt de gewoonte.

Hun twee gedocumenteerde valkuilen gelden ook voor ons: vertraagde mail vereist een echte scheduler (bij hen WP-cron-ellende; bij ons zou het een Vercel cron of een kolom "te versturen op" zijn), en bezorging staat of valt met de SMTP-reputatie — DMARC staat net goed, dus volume rustig opbouwen.

### 2.1b Ondertekende quizantwoorden — de oplossing voor ons bekende gat

**Dit is de waardevolste vondst uit de broncode, en het is er een die geen enkele documentatiepagina noemt.** Ons `POST /api/voortgang` heeft een bekend, gedocumenteerd lek (`docs/openstaand.md` §6): `correct` komt uit de client, dus wie `correct = total` post pakt de quizbonus én de foutloos-badge zonder één vraag te beantwoorden. We wisten dat we het niet konden dichten zonder de antwoorden alsnog naar de server te sturen — precies wat we niet wilden.

LearnDash lost exact dat probleem op, en anders dan wij dacht ik dat zij het niet oplosten. Wat de code doet (11 §client-side nakijken, geverifieerd in `includes/lib/wp-pro-quiz/lib/controller/WpProQuiz_Controller_Admin.php`):

1. De juiste antwoorden worden **uit de pagina-JSON gestript** vóór verzending naar de browser.
2. Elk antwoord wordt **per stuk server-side beoordeeld** via een AJAX-aanroep.
3. De server geeft het resultaat terug **met een handtekening**: een WordPress-nonce berekend over gebruiker, quiz, vraagindex én de puntenwaarde (`p_nonce` voor punten, `a_nonce` voor het antwoord).
4. Bij het inleveren **herverifieert de server elke handtekening** en herberekent het eindpercentage zelf; klopt een handtekening niet, dan worden de punten op 0 gezet.

Het patroon is dus: *de client mag rekenen, maar mag het resultaat niet beweren*. Elke deelscore is een door de server ondertekende claim.

Voor ons vertaalbaar zonder ons privacyprincipe op te geven: laat de client bij het afronden van een quiz een korte, aan sessie + les + score gebonden HMAC meesturen die de server eerder heeft afgegeven — of, simpeler en waarschijnlijk voldoende voor de inzet (XP en een badge, geen diploma): laat de server de quizvragen kennen en alleen de gekozen indexen ontvangen, zonder ze op te slaan. Dan reist er geen antwoordgeschiedenis, maar is de score wel echt. **Welke van de twee is een ontwerpbeslissing voor Jason** — het punt hier is dat "client-side nakijken" en "een betrouwbare score" elkaar niet uitsluiten, wat we tot nu toe aannamen.

### 2.2 De minimale beheerset: vier tellers, een feed, een filter, en handmatige correctie

Hoofdstuk 06 §1 laat zien dat de kern-rapportage van LearnDash — die 80% van de beheervraag dekt — verrassend klein is: tellers (cursisten, cursussen, openstaand nakijkwerk), een activiteitenfeed, filteren op gebruiker/cursus/status, voortgangsbalken, CSV-export. Dat is een haalbare `/beheer`-pagina bovenop `lesson_progress` + `user_stats`, geen project van maanden.

Twee details die we anders zouden missen:

- **Handmatige voortgangscorrectie is een supportvereiste, geen luxe** (06 §5): het eerste verzoek "mijn les staat niet op afgerond" komt gegarandeerd, en wij hebben er nog geen knop voor.
- **"Filter → mail die selectie"** (ProPanel's Email-tab, 06 §2) is het meest kopieerwaardige beheeridee: inactieve kopers aanschrijven zonder aparte lijstinfrastructuur — het is een query met een verzendknop.

### 2.3 Certificaat: aparte "met lof"-drempel en een verificatie-URL

- LearnDash scheidt **slagen** (70%) van **het certificaat verdienen** (90%) — twee losse drempels op dezelfde quiz (02 §8). Voor ons vertaald: het certificaat kan een "met lof"-vermelding krijgen bij bijvoorbeeld gemiddeld ≥90% quizscore. Goedkoop, en het maakt het papiertje zwaarder zonder iemand iets af te nemen.
- **Certificaatverificatie zit bij LearnDash niet in core en is precies wat de markt erbij bouwde** (QR + publieke verificatiepagina + LinkedIn-share, 05 §1.5). Ons certificaat heeft hetzelfde gat. Een verificatie-URL (`/certificaat/verifieer/[id]`) maakt het certificaat deelbaar én echt — past bovendien bij het eerlijkheidsmerk: een verifieerbaar certificaat is het tegenovergestelde van een borstklopperij-PDF.

### 2.4 "Ga verder waar je was" (Course Resume)

LearnDash onthoudt per cursus de laatst bezochte stap en toont een Resume-knop (04 §9). Wij hebben de data al (`lesson_progress`); het is vooral een UI-kwestie op `/leerpad` en de cursuspagina. Hun geleerde les nemen we gratis mee: de resume-logica moet stappen overslaan die de gebruiker niet kan zien — bij hen gaf dat ooit 404's op gedripte lessen.

### 2.5 Quiz-verrijking, in deze volgorde

1. **Feedback per scoreband** (`Result Messages`, 02 §8): "0–50%: bekijk les 3 nog eens" in plaats van alleen een score. Client-side te doen in onze bestaande QuizBlock, per quiz een paar banden in de cursusdata.
2. **De schaalvraag (`Assessment`)** is het vraagtype dat onze geplande **risicoprofiel-tool** nodig heeft (02 §2.7, roadmap): geen goed/fout maar een positie op een schaal — LearnDash bewijst dat dit hetzelfde quizmechaniek kan delen.
3. **Per-vraag-inzicht** ("hoeveel procent had vraag 3 goed?") is het één na waardevolste dat wij structureel missen (02 §7): het vertelt de docent welke les niet werkt. Het kán privacyvriendelijk — geanonimiseerde tellers per vraag (vraag-id → goed/fout-teller) in plaats van antwoorden per gebruiker — maar het verruimt wel ons principe "antwoorden reizen nooit mee". Bewuste afweging voor later, geen sluiproute nemen.
4. **Cloze en sorteervragen** (02 §2): pas als de content erom vraagt; elk extra vraagtype is blijvende scoringscomplexiteit — LearnDash's acht typen met "modus 2"-punten zijn het afschrikwekkende plafond.

### 2.6 Proefles per betaalde cursus (`Sample Lesson`)

LearnDash markeert per les of hij openbaar voorproefbaar is (04 §3). Wij lossen "proeven" nu op met de gratis cursus, maar één opengestelde les per bétaalde cursus is een klassieke conversiehefboom: de koper ziet de echte kwaliteit in plaats van een curriculum-opsomming. Past in ons model (de sitemap- en slotregels moeten er dan op mee — zie de SEO-huisregels in `CLAUDE.md`).

### 2.7 Groups/seats als B2B-referentiemodel — pas bouwen bij vraag

Het LearnDash Groups-model (03 §4) is het antwoord op "werkgever wil 10 × Waardebeleggen": één betaling, een seats-teller, een klant-beheerder (`Group Leader`) die zelf collega's toewijst en hun voortgang ziet. Voor ons: **niet bouwen tot de eerste werkgever mailt**, maar dan is dit het referentieontwerp — inclusief het inzicht dat de Group Leader-rol (gedelegeerd, gescopeerd beheer) het schaalbare deel is, niet de bundelverkoop.

### 2.8 Video Progression als referentie-featureset voor de Resolve-keten

Zodra er video's komen (`docs/menselijke-elementen.md`): LearnDash's lijstje is de menukaart (01 §7) — resume-positie, pauze bij vensterwissel, auto-afronden met vertraging, video vóór of ná de leerstof. En de nuchtere les: zelfs LearnDash doet kijkverificatie client-side in cookies; server-side kijkbewijs is de moeite niet.

### 2.9 Kortingscodes, wanneer we ze willen

LearnDash-coupons (03 §3): de korting wordt vóór het aanmaken van de betaling verrekend, als gecontroleerde transformatie op de catalogusprijs. Dat is verenigbaar met onze ijzeren regel — de prijs komt uit de catalogus, nooit uit het verzoek; de coupon is een tweede catalogusgegeven, geen klantinvoer die de prijs zet. Hun beperking (geen coupons op abonnementen) is een waarschuwing om de College+-introductiekorting apart te ontwerpen.

## 3. Wat we bewust níét overnemen

- **Harde poorten** (lineaire progressie, quiz-slaagdrempels die de weg blokkeren, timers op lessen): LearnDash is poortwachter, wij zijn aanmoediger (XP in plaats van sloten). Dat is merkidentiteit — reassurance-first — geen technisch gat. (02 §3, 04 §1)
- **Punten als toegangsmunt** (`Course Points`): het omgekeerde van ons XP-model; XP blijft beloning en wordt nooit een slot op content. (05 §2)
- **Inleveropdrachten met nakijkplicht**: dezelfde reden als bij de lesvragen — geen beloofde nakijkcapaciteit. LearnDash laat bovendien zien hoe een niet-nagekeken opdracht een hele lineaire cursus blokkeert. (04 §6)
- **Drip-content**: alles staat bij ons direct open na aankoop; dat is een verkoopargument. Als er ooit een cohort-product komt is hun model (release-schema op de les + mail bij vrijgave + slotje mét datum) de referentie. (04 §3)
- **Forum/community-stack**: bewust afgevallen in `docs/ideeen.md`; LearnDash's bbPress/BuddyBoss-verhaal bevestigt hoe zwaar dat pad is. (05 §6)
- **SCORM/xAPI**: corporate-erfenis zonder waarde voor B2C. (06 §4)
- **Een add-on-architectuur**: hun kern-plus-add-ons-model houdt de kern klein maar verplaatst integratielast naar de klant en maakte van features prijstier-lokaas (07 §2–3). Onze modulegrenzen (`getCourse()`, `heeftToegangTot()`, `verstuurMail()`) bereiken hetzelfde zonder de versnippering.

## 4. De metalessen

1. **Grenzen verslaan features.** LearnDash's echte moat was nooit de plugin maar het ecosysteem op zijn hooks (07 §4) — en dat kon alleen ontstaan omdat elk gedrag een afvangbaar event is. Dat is Jasons ontwerpprincipe ("schaal zit in grenzen, niet in massa") door een miljardenmarkt bevestigd. Onze events zijn functieaanroepen in plaats van WordPress-hooks, maar de discipline is dezelfde: houd de interfaces stabiel, dan blijft de binnenkant verwisselbaar.
2. **Legacy is de prijs van succes, en hij komt in de vorm van je eerste afkortingen.** `sfwd-`-prefixes uit 2012, een gevorkte quizbibliotheek die nooit herschreven werd, drie template-generaties (07 §5). Toen LearnDash iets nieuws wilde (Challenge Exams) bouwden ze het náást hun eigen quizmotor in plaats van erop (02 §9) — het duidelijkst mogelijke oordeel over je eigen kern. Voor ons: klein blijven ís de features.
3. **Wat een concurrent "heeft" is niet wat zijn klanten kríjgen.** De featurelijst van LearnDash is indrukwekkend tot je ziet dat rapportage, notificaties, streaks en verificatie er allemaal níét in zitten, statistiek standaard uitstaat, en de EU-verkoper alsnog WooCommerce plus vijf plugins nodig heeft. Bij een eventuele feature-vergelijking met welk platform dan ook: vergelijk de werkende configuratie, niet de brochure.
4. **De $720 is terugverdiend als specificatie.** Drie jaar licentie zonder site was zonde; tien jaar productbeslissingen van de marktleider als gratis requirements-document voor §2 hierboven is de compensatie. De les vooruit: een abonnement dat twee verlengingen lang niets bouwt, opzeggen — of er dit mee doen.
