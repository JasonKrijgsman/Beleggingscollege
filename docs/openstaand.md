# Openstaand — de eerlijke stand van zaken

Laatst bijgewerkt: 2 augustus 2026.

Dit is de losse-eindjeslijst. Eén plek, zodat je niet door 3.000 regels documentatie
hoeft te zoeken om te weten wat er nog moet. De andere documenten beschrijven hóe iets
werkt; dit document beschrijft wat er níét af is.

**Onderhoudsregel:** streep hier af wat je doet. Een afgevinkt punt hoort hier weg, niet
te blijven staan als "gedaan" — daar is de git-historie voor.

De bevindingen hieronder komen uit een audit van 2 augustus 2026 waarin zes onafhankelijke
controles over de code, de documentatie, de live site, de juridische pagina's en de
databank zijn gehaald, en elke bevinding daarna door een tweede controleur is nagelopen.
96 bevindingen hielden stand, 7 sneuvelden. Die 7 staan onderaan, zodat niemand ze opnieuw
gaat uitzoeken.

---

## 1. Bewust genomen risico's

Dit zijn geen vergissingen. Ze staan hier omdat ze bewust zijn aanvaard en omdat iemand
over een maand moet kunnen zien dat het een keuze was.

### De test-key staat in productie en dat is een open deur

`MOLLIE_API_KEY` in Vercel begint met `test_`. Gevolg: **iedereen kan op dit moment een
cursus van € 49 gratis binnenhalen.** Niet in theorie — zo is de koopflow op 2 augustus
getest. Inloggen met Google, vinkje aan, afrekenen, bij Mollie "Paid" kiezen, klaar. De
webhook zet de aankoop op `paid` en de cursus gaat open, zonder dat er geld beweegt.

Op 2 augustus 2026 is besloten dit voorlopig zo te laten, omdat de site nog vrijwel geen
bezoekers heeft, niet in Search Console staat en er nergens naar gelinkt wordt, en omdat de
knop bruikbaar moet blijven om te demonstreren. Het risico is dus laag maar echt.

**Dit moet dicht vóór er ook maar iets van marketing gebeurt.** Twee manieren:
- De live-key erin (maar zie hoofdstuk 2 — dan moeten die dingen eerst af), of
- `MOLLIE_API_KEY` tijdelijk uit Vercel halen. De checkout geeft dan netjes 503
  "Betalen is nog niet ingeschakeld" en de knop doet niets meer.

### Er staat een testaankoop in de productiedatabase

De rij `waardebeleggen | paid | € 49` op Jasons eigen account komt uit betaling
`tr_hTh3aaeBX99fmiT2SjpUJ` en is nooit met echt geld betaald. Onschuldig, maar hij vervuilt
straks je eerste omzetcijfers. Opruimen met een `delete` op die rij.

---

## 2. Blokkerend vóór de eerste echte euro

Deze punten zijn niet "later netjes maken". Zonder deze dingen verkoop je iets wat je
juridisch niet mag verkopen, of kun je een geschil niet winnen.

- [ ] **Vercel Pro nemen ($20/mnd).** Het Hobby-plan verbiedt commercieel gebruik
      uitdrukkelijk, en de winkel staat al open. Prijs geverifieerd op vercel.com/pricing op
      2 aug 2026: $20 per maand per zitplaats, inclusief $20 aan verbruikstegoed — bij dit
      verkeer dus effectief een vast bedrag. Zie `docs/hosting-en-kosten.md`.
- [x] **Bevestiging op een duurzame gegevensdrager.** Gebouwd op 2 aug 2026 (commit
      `0a5ba8e`): `src/lib/mail.ts`, `src/lib/mailteksten.ts`, `src/lib/orderbevestiging.ts`,
      afgevuurd vanuit de Mollie-webhook. **Staat nog uit** tot `RESEND_API_KEY` gezet is en
      de DNS-records bij Strato staan — zie `docs/e-mail-versturen.md`.
- [ ] **Drie gegevens die Jason moet aanleveren voordat die mail de deur uit mag:**
      - Zit je in de **kleineondernemersregeling**? Zo ja, dan mag er géén btw-bedrag in de
        mail staan maar de KOR-zin. Zet `KOR = true` in `src/lib/mailteksten.ts`. Zo nee, dan
        klopt de huidige 21%-regel.
      - **Vestigingsadres** — verplicht op de bevestiging, staat nu op `null`.
      - **Btw-identificatienummer** — idem.
- [ ] **Echte factuur.** Bij B2C is een volledige factuur níét wettelijk verplicht (art. 34c
      Wet OB geldt alleen B2B) — een bon volstaat. Maar `/voorwaarden` belooft er wél een, en
      die eigen toezegging bindt. Nummering is er nu (`purchases.order_number`), btw-uitsplitsing
      ook; bewijs van waar de klant zit nog niet.
- [ ] **Herkansing als de bevestigingsmail mislukt.** Nu wordt een mislukte verzending alleen
      naar de console gelogd. Omdat juist die mail bepaalt of het herroepingsrecht vervalt, is
      "hij ging niet weg en niemand weet het" het slechtst denkbare gat. Er hoort een
      herhaalpoging te zijn, of op zijn minst een waarschuwing naar Jason zelf.
- [ ] **Voorwaarden meesturen als tekst of bijlage.** Strikt genomen moeten de algemene
      voorwaarden mee op de duurzame gegevensdrager, niet alleen als link. De mail claimt nu
      geen bijlage (dat zou een onwaarheid zijn), maar het gat blijft.
- [ ] **Volgorde van uitvoeren en bevestigen.** De wet zegt "voordat de dienst wordt
      uitgevoerd". Bij ons gaat de cursus open zodra de webhook binnenkomt en vertrekt de mail
      daarna. Strikt gelezen is dat de verkeerde volgorde. In de praktijk schelen ze seconden,
      maar een jurist moet zeggen of dat volstaat.

### Twee juridische vragen die een mens moet beantwoorden

- [ ] **Is deze cursus "digitale inhoud" of een "dienst"?** Dat verschil is materieel. Bij
      digitale inhoud vervalt het ontbindingsrecht zodra de nakoming begint (art. 6:230p
      onderdeel g BW) — daar is de hele checkout op gebouwd. Bij een dienst vervalt het pas na
      vólledige nakoming (art. 6:230p onderdeel d BW), en dan klopt onze aanname niet. Een
      cursus met levenslange platformtoegang zit op de grens.
- [ ] **Btw-behandeling laten bevestigen door de boekhouder.** Reken níét op de
      onderwijsvrijstelling (art. 11 lid 1 onderdeel o Wet OB): voor online onderwijs eist de
      Belastingdienst interactie tussen docent en cursist, en die is er niet. Verkoop je boven
      € 10.000 per jaar aan consumenten in andere EU-landen, dan verschuift de btw naar het
      land van de afnemer, met aangifte via de One Stop Shop.
- [ ] **Een werkende weg om een herroeping af te handelen.** Terugbetalen trekt de toegang
      nu niet in; er is geen knop en geen procedure. De wettelijke termijn is 14 dagen.
- [ ] **Juridische pagina's door een jurist.** `/voorwaarden`, `/privacy` en
      `/herroepingsrecht` zijn door mij geschreven, niet door een jurist. Ze staan op
      noindex. De feitelijke onjuistheden zijn er op 2 aug uit (zie commit `7fd4082`),
      maar dat maakt ze nog niet juridisch getoetst.

---

## 3. Twee gaten die op 2 augustus gedicht zijn

Vermeld omdat ze allebei stil waren, allebei een tijd hebben opengestaan en allebei
kunnen terugkomen als iemand niet weet waaróm de oplossing is zoals hij is.

**De hele betaalde catalogus stond in een publiek JS-bestand.** 197 kB, 21 lessen, 88
quizantwoorden inclusief `correctIndex`, op te halen zonder in te loggen. De oorzaak was
niet het doorgeven van props — dat was al afgedekt — maar een `import`. Een module met
`"use client"` die `@/content` importeert sleept de complete modulegraaf mee de bundel in,
ook als hij er maar één getal uit nodig heeft. Opgelost door de catalogus op de server te
berekenen en door te geven, en door `import "server-only"` boven in `@/content` te zetten
zodat de build faalt als iemand het opnieuw probeert. Commit `7e79728`.

**De site verkocht terwijl vier pagina's zeiden dat dat niet kon.** De FAQ meldde "er is
nog geen inlog" en "betaalde toegang is nog niet live" naast een werkende koopknop, en
voerde die onwaarheden ook als FAQPage-markup aan Google. Commit `7fd4082`.

---

## 4. Wat een betalende klant nu níét krijgt

- **Voortgang die met je meereist.** XP, badges, streak, vinkjes en certificaten staan in
  `localStorage`. De tabellen `lesson_progress` en `user_stats` staan wél in de database,
  maar er is geen enkele regel code die ze leest of schrijft. Wie op zijn telefoon inlogt,
  vindt zijn aankoop terug maar begint qua punten opnieuw. De koopbox en de inlogpagina
  verkopen expliciet het tegendeel.
- **Zijn quizresultaten.** Ze worden opgeslagen en nergens getoond.
- **Een bevestiging, bon of factuur.** Zie hoofdstuk 2.
- **Een overzicht van wat hij bezit**, anders dan `/account`. In de catalogus staat bij een
  gekochte cursus nog steeds het prijskaartje van € 49.

## 5. Certificaten deugen niet

- Iedereen kan er in een minuut een aanmaken voor een cursus die hij nooit gekocht heeft:
  er is geen servercontrole.
- Er staat geen verificatiecode op en er is niets om hem tegen na te kijken.
- De tekst beloofde "alle quizzen behaald", terwijl de quiz geen ondergrens kent — nul goed
  telt ook als afgerond. Op 2 aug afgezwakt naar "doorlopen", maar de echte keuze staat nog
  open: óf een slaagdrempel invoeren, óf accepteren dat het een deelnamebewijs is.

## 6. Techniek en bedrijfsvoering

- [ ] **Lokaal, Preview en productie delen één database.** `DATABASE_URL` is overal
      dezelfde. Een verkeerd commando op de laptop raakt de echte klantgegevens. Dit is het
      soort fout dat één keer gebeurt en dan groot is.
- [ ] **Geen monitoring, geen alarmering, geen foutpagina.** Elke storing hierboven
      verloopt geruisloos: je hoort het pas van een klant. Er is ook geen eigen `error.tsx`,
      dus een databasehapering geeft een kale, Engelstalige pagina.
- [ ] **Geen tests, geen CI, geen lint in de pijplijn** — terwijl elke push naar `main`
      automatisch naar productie gaat, inclusief het betaalpad.
- [ ] **Chargeback.** Komt er een terugboeking, dan houdt de klant zijn toegang, kost het
      € 10 en ziet niemand het.
- [ ] **Drie kwetsbaarheden met hoge ernst in de afhankelijkheden**, en niets dat dat ooit
      zou melden.
- [ ] **De prijs wordt met een regex uit een weergavetekst ("€49") gepeuterd.** Werkt, maar
      breekt zodra iemand er een punt of komma anders in zet. De prijs hoort een getal in
      centen te zijn, met de tekst als afgeleide — niet andersom.
- [ ] **`/lab` staat publiek** (HTTP 200). Wel `noindex, nofollow`, dus Google neemt hem
      niet op, maar wie de URL heeft ziet het interne stijllab.

## 7. Vindbaarheid

- [ ] **De oude WordPress-site draait nog op beleggingscollege.nl**, met de drie verzonnen
      testimonials die uit de nieuwe site zijn gehaald, en met aanbod dat niet meer bestaat.
      Dat is het adres dat in je eigen footer en op elk certificaat staat.
- [ ] **Geen OG-afbeelding en geen favicon.** Elke gedeelde link is een blanco kaartje.
- [ ] **Geen Search Console.** De sitemap is nooit ingediend, en zonder Search Console kun
      je bij de verhuizing naar de .nl geen Change of Address doen — precies het moment
      waarop je hem nodig hebt.
- [ ] **`www.beleggingscollege.com` bestaat niet.** Wie het intikt krijgt niets.
- [ ] **Geen redirects voor de oude WooCommerce `/product/`-URL's** en vier andere
      geïndexeerde WordPress-pagina's; die geven nu 404.
- [ ] **`/leerpad` heeft geen eigen titel of description** — hij erft die van de homepage.

## 8. Domein en e-mail

- **De verhuizing zit niet vast, hij loopt.** In het Strato-paneel staat onder
  Domeinen → beleggingscollege.nl → DNS → DNSSEC letterlijk "DNSSEC: Wordt gedeactiveerd".
  Er is geen knop om iets te versnellen. Het DS-record (keytag 43361) staat nog bij de
  registry; gecontroleerd via vier onafhankelijke resolvers. Zodra
  `Resolve-DnsName -Name beleggingscollege.nl -Type DS -Server 1.1.1.1` niets meer
  teruggeeft, kan de naamserverwissel door.
- **De e-mail werkt gewoon.** `beheer@beleggingscollege.nl` bestaat als postbus bij Strato
  en bevat mail; `info@` ook. Uitgaande post wordt door Strato met DKIM ondertekend
  (`strato-dkim-0002`, `strato-dkim-0003`), dus de DMARC-regel op `p=reject` slaagt ondanks
  het ontbrekende SPF-record. Migadu meldt "No mails can reach us" — dat gaat over Migadu,
  niet over het adres.
- [ ] **Er kijkt alleen niemand in die postbus.** Op `/contact` staat "antwoord binnen twee
      werkdagen", en `/herroepingsrecht` en `/privacy` noemen dit adres voor respectievelijk
      ontbinding en AVG-verzoeken. Zet hem op je telefoon of laat hem doorsturen.
- [ ] **Bij de verhuizing eerst de bestaande postbussen exporteren**, dan pas de records uit
      `docs/migadu-records.txt` in Cloudflare zetten. Andersom ben je de inhoud kwijt.

## 9. De documentatie spreekt zichzelf tegen

- `docs/prijsstrategie.md` noemt drie dingen "blokkerend voor de eerste transactie" die
  niet gebouwd zijn, terwijl `CLAUDE.md` en `docs/betalingen-mollie.md` de checkout als af
  presenteren met alleen de key nog te wisselen. Wie alleen `CLAUDE.md` leest, zet de
  live-key erin in de veronderstelling dat dat de laatste stap was.
- `docs/implementatie-accounts-betalen.md` (1.619 regels) is half achterhaald: het
  auth-hoofdstuk schrijft Prisma, JWT en wachtwoordinloggen voor, waarvan niets gebouwd is,
  en spreekt zijn eigen database-hoofdstuk tegen.
- Tien gedateerde uitspraken in zes documenten verwijzen naar "3 augustus 2026", een dag
  die nog niet geweest is.
- `CLAUDE.md` zei tot voor kort dat er geen backend of database is.
- `README.md` beschrijft een product dat niet meer bestaat.

## 10. Onderzocht en in orde — niet opnieuw uitzoeken

- **De cursusinhoud is schoon** op auteursrecht en op de AFM-grens. Geen
  rendementsbeloftes, geen persoonlijk advies, geen overgeschreven boekteksten.
- **Er is geen verzonnen social proof** op de nieuwe site.
- **Geen cookiebanner nodig** — er is geen analytics en er zijn geen trackingcookies. Dat
  geldt alleen zolang dat zo blijft.
- **Bezoekers-IP's gaan niet naar Google voor het lettertype.** `next/font/google` host het
  lettertype bij de bouw zelf; de pagina doet nul verzoeken naar Google's fontservers.
  Google ziet je alleen bij het inloggen, en dat staat in de privacyverklaring.
- **Het betaalpad zelf is degelijk gebouwd:** de prijs komt uit onze eigen catalogus, de
  webhook gelooft niets uit de payload behalve het id en controleert bedrag én valuta, en
  `heeftToegangTot()` is aantoonbaar de enige toegangspoort. Betaalde pagina's renderen per
  verzoek met `private, no-cache, no-store`.
- **Geen enkel geheim staat in de repo of in de git-historie.**

## 11. Afgevallen bij verificatie — niet achterna jagen

Deze zijn door een tweede controleur onderuitgehaald: `docs/migadu-records.txt` zou
onvolledig zijn (is inmiddels bijgewerkt), drie ongebruikte exports, een dode
`generateStaticParams`, de streak die bij herhaalde lessen zou oplopen, het recht op
verwijdering dat van een verhuizende postbus zou afhangen, de teasercursus in de sitemap,
en de blogpost met een datum van morgen.
