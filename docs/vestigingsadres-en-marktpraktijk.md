# Vestigingsadres en marktpraktijk — onderzoek

Laatst bijgewerkt: 2 augustus 2026. Onderzoek met bronnen; geen juridisch advies.

## Deel 1: het vestigingsadres

### Samenvatting

Kort antwoord: een postbus lost het niet op, KVK-afscherming ook niet volledig, en de enige schone oplossing is een gehuurd zakelijk vestigingsadres dat je bij KVK registreert. De wet (art. 6:230m lid 1 sub c BW en art. 3:15d BW) eist een GEOGRAFISCH adres; ACM vertaalt dat expliciet naar "vestigingsadres waarop u ingeschreven staat bij de KvK" — een postbus is geen geografisch adres en KVK accepteert er ook geen inschrijving op. Sinds 1 januari 2022 zijn woonadressen in het Handelsregister afgeschermd, maar dat helpt een eenmanszaak aan huis niet: het vestigingsadres blijft openbaar, ook als het hetzelfde pand is. Sinds 15 december 2022 mag een eenmanszaak wél het bezoekadres laten afschermen, mits er een apart, openbaar postadres is — maar KVK waarschuwt zelf dat je datzelfde adres nog steeds op je eigen website moet zetten, dus afschermen alleen is halve winst. De echte oplossing is dus: een ander vestigingsadres huren (EUR 230-365 per jaar excl. btw bij aanbieders in Den Haag/Rijswijk), dat bij KVK registreren, en dat adres in footer, voorwaarden en orderbevestiging zetten. Van vijf gecontroleerde kleine Nederlandse aanbieders publiceerden er drie gewoon een woonstraatadres, één alleen een postadres en één helemaal geen adres (dus in overtreding). LET OP: ik ben geen jurist; dit is onderzoek, geen juridisch advies, en past bij het voornemen om de conceptvoorwaarden alsnog door een jurist te laten nakijken.

### Advies

MIJN ADVIES: huur een zakelijk vestigingsadres in Den Haag of Rijswijk en zet dat overal neer. Reken op ongeveer EUR 230-365 per jaar excl. btw. Dat is de enige optie die het probleem in één keer bij de wortel oplost, en het is minder dan één verkochte cursus (EUR 49) per maand.

WAAROM NIET DE GOEDKOPERE ROUTES
- Alleen KVK-afscherming (gratis) lost niks op: je moet je vestigingsadres nog steeds zélf op je site en in de orderbevestiging zetten. KVK waarschuwt daar letterlijk voor. Je verplaatst het probleem, je lost het niet op.
- Een postbus (ca. EUR 260/jr) is duurder dan sommige virtuele adressen én voldoet niet. Slechtste van twee werelden.
- Alleen "dit is geen bezoekadres" achter je woonadres zetten is juridisch prima, maar dan staat je huisadres nog steeds op internet. Dat is precies wat je niet wilt.

CONCRETE KEUZE
Ga voor bedrijfspostadres.nl of Anteverde. Bedrijfspostadres.nl heeft een adres in Den Haag zelf (Televisiestraat 206) plus twee in Rijswijk, wat geloofwaardig is voor een Haagse eenmanszaak. Anteverde is bij jaarbetaling het simpelst te doorgronden: EUR 23/mnd = EUR 276/jaar excl. btw, geen opstartkosten. Btw krijg je terug (je zit niet in de KOR), dus dat is je echte kostprijs.

Neem GEEN driejarig contract in de eerste ronde, ook al is dat per jaar het goedkoopst. Je weet nog niet of dit bedrijf over drie jaar nog zo draait. Neem één jaar en verleng.

VOLGORDE — en deze volgorde is belangrijk
1. Bel of mail eerst de aanbieder met twee vragen: (a) mag ik hier als eenmanszaak op ingeschreven staan als VESTIGINGSADRES (niet alleen postadres), en (b) krijg ik een getekende huur- of serviceovereenkomst die KVK accepteert? KVK eist dat bewijsstuk expliciet bij een adreswijziging. Zonder ja op beide vragen niet tekenen.
2. Sluit het contract af en wacht op de getekende overeenkomst.
3. Wijzig bij KVK je vestigingsadres (bezoekadres) naar het gehuurde adres, met de overeenkomst als bewijs. Je woonadres verdwijnt daarmee uit het Handelsregister als bedrijfsadres — dit is de stap die het probleem echt oplost.
4. Vink daarnaast in Mijn KVK "bezoekadres afschermen" aan als extra laag. Mag altijd bij een eenmanszaak, kost niets. Je postadres blijft dan openbaar, en dat is nu het gehuurde adres — precies goed.
5. Controleer na een paar dagen in het openbare Handelsregister dat je huisadres nergens meer staat.
6. PAS DAARNA de site aanpassen. Zet BEDRIJF_ADRES in Vercel op het nieuwe adres. De code is er al op gebouwd: src/lib/mailteksten.ts leest process.env.BEDRIJF_ADRES en zet nu nog "[vestigingsadres nog niet ingevuld]" in de orderbevestiging. Eén omgevingsvariabele, geen code wijzigen, opnieuw deployen.
7. Voeg het adres toe aan de footer (src/components/SiteFooter.tsx — daar staan nu alleen KVK-nummer en btw-id, geen adres) en aan /contact, /over-ons, /voorwaarden en /privacy. Zet erbij: "Dit is een postadres, geen bezoekadres. Bezoek alleen op afspraak."
8. Doe dit VOORDAT je de Mollie-testkey vervangt door de live-key. Zolang niemand kan betalen loop je geen risico op art. 6:230m; zodra de eerste echte bestelling binnenkomt wel.

BUDGET
Ongeveer EUR 300/jaar excl. btw, plus een uur werk. Zet het naast de andere vaste lasten (Vercel Pro ca. USD 20/mnd, domeinen) en het is een kleine post.

TWEE SLAGEN OM DE ARM
- Ik ben geen jurist. De concept-voorwaarden staan al bewust op noindex tot een jurist ernaar kijkt; laat deze adreskwestie in diezelfde ronde meelopen.
- Ik kon PostNL's eigen tarievenpagina niet laden (herhaalde timeouts), dus de postbusprijs komt van derden en is onzeker. Voor het advies maakt dat niet uit — de postbus valt sowieso af omdat hij niet als vestigingsadres mag.

### Juridische basis

**Wat eist art. 6:230m lid 1 sub c BW precies?**

De handelaar moet vóór het sluiten van de overeenkomst op afstand verstrekken: "het geografische adres waar de handelaar gevestigd is en het telefoonnummer en e-mailadres van de handelaar" (plus, sinds de modernisering van 2022, gegevens over andere vormen van online communicatie). Het woord is 'geografisch' — dat is precies de term die een postbus uitsluit. Let op: sommige websites tonen nog de oude versie van dit onderdeel (met 'fax, indien beschikbaar'); die dateert van vóór 28 mei 2022.

Bron: https://wetboek.org/bw/6/230m

**Moet dat adres ook echt in de ORDERBEVESTIGING staan, of alleen op de site?**

Ook in de orderbevestiging. Art. 6:230v lid 7 BW verplicht de handelaar binnen redelijke termijn na het sluiten van de overeenkomst een bevestiging op een duurzame gegevensdrager te verstrekken die "alle in artikel 230m lid 1 bedoelde informatie" bevat, voor zover die niet al eerder duurzaam is verstrekt. Het geografisch adres hoort daar dus bij.

Bron: https://wetboek.org/bw/6/230v

**En wat eist art. 3:15d BW voor de website zelf?**

Een dienstverlener van de informatiemaatschappij (praktisch elke commerciële website) moet gemakkelijk, rechtstreeks en permanent toegankelijk maken: "zijn identiteit en adres van vestiging", contactgegevens inclusief e-mailadres, handelsregistergegevens, en het btw-identificatienummer. Dit is een aparte verplichting náást 6:230m — die geldt zelfs zonder verkoop.

Bron: https://wetboek.org/bw/3/15d

**Is een POSTBUS voldoende als geografisch adres? (de kernvraag)**

Nee. De wettekst zegt 'geografisch adres' en dat wordt algemeen uitgelegd als een fysiek adres met straat, huisnummer en plaats. WebwinkelKeur schrijft letterlijk dat het adres "een fysiek adres moet zijn en geen postbus-adres mag zijn". Business Center Altena formuleert het over de KVK-kant net zo hard: "Nee. De KvK vereist altijd een fysiek adres als vestigingsadres. Een postbus mag je wel gebruiken als correspondentieadres, maar niet als vestigingsadres." ONZEKERHEID: ik heb geen ACM-boetebesluit of rechterlijke uitspraak gevonden die specifiek over een postbus gaat, dus dit is de heersende praktijkuitleg en niet iets wat ik met jurisprudentie kan onderbouwen.

Bron: https://www.webwinkelkeur.nl/blog/vermelding-van-vestigingsadres-maar-geen-bezoek-aan-de-deur/ en https://businesscenteraltena.nl/nl/kennisbank/zakelijk-postadres-en-kvk-vestigingsadres

**Mag een postbus dan wél als AANVULLING?**

Ja. Art. 6:230m lid 1 onderdeel d voorziet zelf in een extra adres: "wanneer dat verschilt van het overeenkomstig onderdeel c verstrekte adres, het geografische adres van de bedrijfsvestiging van de handelaar waaraan de consument eventuele klachten kan richten". Je mag dus best een postadres of postbus erbij zetten voor correspondentie — maar niet in plaats van het geografische vestigingsadres.

Bron: https://wetboekplus.nl/burgerlijk-wetboek-boek-6-artikel-230m-overeenkomsten-op-afstand/

**Wat zegt ACM zelf dat je moet publiceren?**

ACM somt op: "naam waarmee u ingeschreven staat bij de KvK", "vestigingsadres waarop u ingeschreven staat bij de KvK", e-mailadres, telefoonnummer, bereikbaarheid en klachtenregeling; voor online dienstverleners ook KVK-nummer en btw-nummer. Dat is de sleutelzin: ACM koppelt de publicatieplicht rechtstreeks aan je KVK-inschrijving. Wat bij KVK staat, hoort op je site. Over plaatsing zegt ACM dat de gegevens zichtbaar moeten zijn "op elke pagina van uw website (zoals in de header, footer of via een link naar uw contactpagina)".

Bron: https://www.acm.nl/nl/verkoop-aan-consumenten/consumenten-informeren/bedrijfsgegevens-vermelden

**Stand van de KVK-afscherming: is mijn woonadres afgeschermd?**

Woonadressen van functionarissen zijn sinds 1 januari 2022 standaard afgeschermd in het Handelsregister (wijziging Handelsregisterbesluit 2008). KVK: "Woonadressen van functionarissen van bedrijven en organisaties zijn altijd afgeschermd in het Handelsregister." Alleen medewerkers van bestuursorganen, advocaten, notarissen, deurwaarders en Wwft-partijen kunnen ze nog inzien, en alleen met autorisatie van KVK.

Bron: https://www.kvk.nl/over-het-handelsregister/afschermen-van-je-bezoekadres-wat-is-mogelijk/

**Geldt die afscherming ook voor het VESTIGINGSADRES van een eenmanszaak aan huis? (de tweede kernvraag)**

Nee — en dat is precies het gat. ICTRecht vatte het bij de invoering samen: "Een vestigingsadres dat tegelijkertijd een woonadres van een zzp'er is, blijft echter nog wel zichtbaar." Het kabinet vond afscherming daarvan "praktisch onhaalbaar" en oordeelde dat het "afdoet aan de rechtszekerheid in het economische verkeer". Villamedia meldde hetzelfde: "Vestigingsadressen blijven echter wel opvraagbaar." De afscherming van 2022 helpt een zzp'er aan huis dus niet automatisch.

Bron: https://www.ictrecht.nl/blog/het-woonadres-en-tegelijkertijd-vestigingsadres-van-de-zzp-er-blijft-openbaar en https://www.villamedia.nl/artikel/woonadres-in-kvk-register-afgeschermd-vestigingsadres-niet

**Maar sinds 2022 mag een eenmanszaak toch het bezoekadres afschermen?**

Ja. Per 15 december 2022 is het Handelsregisterbesluit 2008 gewijzigd zodat de eigenaar van een eenmanszaak het bezoekadres op verzoek kan laten afschermen, zonder dat een concrete dreiging aangetoond hoeft te worden. Harde voorwaarde: er moet een openbaar postadres in het Handelsregister staan, dat niet hetzelfde mag zijn als het afgeschermde bezoekadres. Voor andere rechtsvormen (vof, bv) kan het alleen bij (waarschijnlijke) dreiging. Regelen kan gratis via Mijn KVK, of aanvinken bij inschrijving.

Bron: https://watsonlaw.nl/ondernemers-kunnen-bezoekadres-in-handelsregister-afschermen/ en https://www.kvk.nl/over-het-handelsregister/afschermen-van-je-bezoekadres-wat-is-mogelijk/

**Lost KVK-afscherming het probleem dan op?**

Maar half — en KVK zegt dat zelf. Op dezelfde pagina waarschuwt KVK: "Denk er wel aan dat het bezoekadres ook op andere plekken is te vinden, zoals op je website." Afscherming haalt het adres uit het openbare Handelsregister, maar heft de eigen publicatieplicht van art. 3:15d en 6:230m BW niet op. Je moet je vestigingsadres dus nog steeds zelf publiceren. Alleen als dat vestigingsadres een ánder adres is dan je woning ben je echt klaar.

Bron: https://www.kvk.nl/over-het-handelsregister/afschermen-van-je-bezoekadres-wat-is-mogelijk/

**Kan ik bij KVK een ander vestigingsadres registreren dan mijn woonadres?**

Ja, mits het een echt fysiek adres is waar bedrijfsactiviteiten kunnen plaatsvinden, en je toestemming van de eigenaar hebt. KVK vraagt bij een afwijkend bezoekadres om bewijs: "een kopie van het door beide partijen getekende huur-, koop-, service- of pachtcontract". Voor een laptop-bedrijf als een online cursusaanbieder is een bureau of kantooradres goed verdedigbaar; bij een horeca- of bouwbedrijf zou een virtueel adres ongeloofwaardig zijn. Een postbusnummer wordt niet geaccepteerd als vestigingsadres.

Bron: https://www.kvk.nl/hulp-en-contact/hulp-bij-inschrijven/ en https://wezoo.com/insights/virtueel-kantoor-kvk

**Wat is het risico als ik het adres gewoon weglaat?**

ACM houdt toezicht en kan handhaven. ONZEKERHEID: ik heb het door derden genoemde maximum van EUR 900.000 per overtreding of 1% van de jaaromzet gezien op een commerciële uitlegpagina, maar heb dat bedrag niet kunnen terugvoeren op een wetsartikel of ACM-publicatie binnen dit onderzoek — behandel het als indicatie, niet als vaststaand. Realistischer risico voor een eenmanszaak van deze omvang is een waarschuwing of last onder dwangsom, plus het feit dat een ontbrekend adres de herroepingstermijn en de bewijspositie bij een geschil in je nadeel beïnvloedt.

Bron: https://www.webwinkelkeur.nl/bedrijfsgegevens-tonen-webshop/

### Opties

**Virtueel vestigingsadres huren — bedrijfspostadres.nl (Den Haag / Rijswijk)** — Zakelijk adres met postverwerking, in te schrijven bij KVK als vestigingsadres. Drie locaties, waarvan één in Den Haag zelf: Televisiestraat 206 (2525 LV Den Haag), plus Laan van Zuid Hoorn 70 en J.C. van Markenlaan 3 in Rijswijk. De site stelt dat alle adressen geschikt zijn als officieel KvK-vestigingsadres en dat je een huurcontract krijgt dat aan alle eisen voldoet.
- Kosten: Pakket Basic, alle prijzen excl. btw en PER 4 WEKEN (dus 13 termijnen per jaar, niet 12 — de site adverteert 'p/m' maar rekent per 4 weken): 3-jaarscontract EUR 17,95 (= EUR 233,35/jaar); 1-jaarscontract EUR 27,95 (= EUR 363,35/jaar); maandelijks opzegbaar EUR 37,95 (= EUR 493,35/jaar). Duurdere pakketten Simpel/Plus/Premium lopen op tot EUR 69,95 per 4 weken. Geen eenmalige kosten vermeld. ONZEKER: ik kon de losse prijzenpagina niet openen (404), dus wat er precies wél en niet in Basic zit heb ik niet kunnen verifiëren — vraag expliciet na of KvK-inschrijving in Basic zit.
- Lost het juridisch op: JA, volledig — mits het contract een echt inschrijfadres betreft. Het is een geografisch adres (straat, nummer, plaats), voldoet daarmee aan 6:230m lid 1 sub c en 3:15d BW, en je woonadres verdwijnt uit het Handelsregister zodra je het vestigingsadres wijzigt. KVK accepteert het als je de getekende huur-/serviceovereenkomst kunt overleggen.
- Bron: https://bedrijfspostadres.nl/

**Virtueel vestigingsadres huren — Anteverde (Noord-/Zuid-Holland)** — KvK-vestigingsadres inclusief inschrijving op hun adres bij KVK en wekelijkse postscans. Aanbieder claimt '100% inschrijfgarantie'. Adressen in Noord- of Zuid-Holland (exacte locatie wordt op de pagina niet genoemd).
- Kosten: Alle bedragen excl. 21% btw. Jaarbetaling: EUR 23,- per maand = EUR 276 per jaar, geen opstartkosten. Halfjaarbetaling: EUR 28,30 per maand = EUR 339,60 per jaar, geen opstartkosten. Maandbetaling: EUR 35,38 per maand = EUR 424,56 per jaar, plus EUR 35,38 eenmalige opstartkosten.
- Lost het juridisch op: JA, volledig, om dezelfde redenen als bedrijfspostadres.nl. Aandachtspunt: de site noemt alleen de regio, niet het concrete adres — vraag dat vooraf op, want dat adres komt straks in je footer en op je facturen te staan en moet geloofwaardig zijn voor een Haags bedrijf.
- Bron: https://www.anteverde.nl/vestigingsadres-kvk.html

**Virtueel vestigingsadres huren — Vrijdaggevoel (Cuijk)** — KvK-vestigingsadres op De Nieuwe Erven 3, 5431 NV Cuijk. Inclusief digitalisering van inkomende post zonder meerkosten, postverwerking op werkdagen, keuze uit afhalen/scannen/doorsturen. Aanvraag verwerkt binnen 24 uur, met de garantie 'geen inschrijving, geld terug'.
- Kosten: Vanaf EUR 24,75 per maand (circa EUR 297 per jaar). Korting bij jaarbetaling, percentage niet gespecificeerd. Geen eenmalige kosten vermeld. ONZEKER: op de pagina staat niet expliciet of het bedrag in- of exclusief btw is.
- Lost het juridisch op: JA juridisch, MAAR praktisch minder aantrekkelijk: Cuijk ligt bij Nijmegen, ruim 130 km van Den Haag. Een Haagse ondernemer met een vestigingsadres in Cuijk oogt vreemd, en post ophalen kan niet. Voor een merk dat zich op eerlijkheid en transparantie profileert is een adres in de eigen regio geloofwaardiger.
- Bron: https://www.vrijdaggevoel.nl/vestigingsadres-kvk/

**PostNL-postbus** — Een genummerd postvak bij een PostNL-locatie waar je zakelijke post ophaalt. Contract 12 maanden, opzegtermijn 1 maand, betaling via automatische incasso.
- Kosten: ONZEKER — PostNL's eigen pagina's gaven bij herhaling een timeout, dus dit komt van derden en de bedragen lopen uiteen. MKB Servicedesk noemt EUR 47,50 excl. btw eenmalige aansluitkosten plus EUR 260 per jaar excl. btw. IkWordZZPer noemt EUR 46 eenmalig en EUR 253 per jaar excl. btw (waarschijnlijk een ouder tarief). Een derde bron noemt EUR 275 per jaar plus EUR 50 eenmalig. Reken op grofweg EUR 250-275 per jaar plus circa EUR 50 opstart.
- Lost het juridisch op: NEE als vervanging. Een postbus is geen geografisch adres in de zin van 6:230m lid 1 sub c BW en KVK accepteert hem niet als vestigingsadres: 'De KvK vereist altijd een fysiek adres als vestigingsadres. Een postbus mag je wel gebruiken als correspondentieadres, maar niet als vestigingsadres.' WEL bruikbaar als het openbare POSTADRES dat KVK eist wanneer je je bezoekadres laat afschermen, en als extra klachtenadres onder onderdeel d. Maar dan betaal je ongeveer evenveel als een echt vestigingsadres en houd je het probleem.
- Bron: https://www.mkbservicedesk.nl/bedrijfsvoering/facilitair/de-postbus en https://businesscenteraltena.nl/nl/kennisbank/zakelijk-postadres-en-kvk-vestigingsadres

**Adres van je boekhouder of administratiekantoor** — Je gebruikt het adres van je administratiekantoor als postadres, en soms als vestigingsadres.
- Kosten: Sterk wisselend; vaak gratis of tegen een kleine vergoeding als je al klant bent. Geen openbaar tarief te vinden — je moet het gewoon vragen.
- Lost het juridisch op: DEELS. Als POSTADRES bij KVK is dit uitdrukkelijk toegestaan; Knab noemt 'een postbus, administratiekantoor of ander zakelijk postadres' als geldige opties. Als VESTIGINGSADRES is het riskanter: KVK eist dat je bedrijfsactiviteiten daadwerkelijk op dat adres kunnen plaatsvinden en vraagt een getekende overeenkomst. Een boekhouder die alleen je post aanneemt voldoet daar niet aan. ONZEKER: ik heb geen KVK-pagina gevonden die dit specifieke geval expliciet behandelt; navraag bij KVK is nodig. Bijkomend nadeel: je bent afhankelijk van één relatie — stap je over, dan moet je adres mee.
- Bron: https://bieb.knab.nl/ondernemen/priveadres-afschermen-kvk-dit-zijn-je-opties

**Flexkantoor / echte kantoorruimte (Regus, Tribes, Spaces)** — Een echt kantoorpand waar je een virtueel kantoor, een vaste werkplek of een kamer huurt. Regus heeft acht locaties in en om Den Haag, waaronder Parkstraat 83 (Haagsche Hof), Zuid Hollandlaan 7 (Rode Olifant), Schenkkade 50 (De Haagsche Zwaan) en Johan de Wittlaan 7, plus Einsteinlaan 28 in Rijswijk. Wezoo noemt Tribes Den Haag Central Station als optie voor de regio.
- Kosten: Regus adverteert 'vanaf EUR 3 per dag' (circa EUR 90 per maand), maar publiceert geen concreet maandtarief — het is een offerte op aanvraag, en de vermelde prijzen gelden bij 24-maandscontracten. Wezoo noemt als algemene bandbreedte voor virtuele kantoren EUR 15 tot EUR 75 per maand, afhankelijk van locatie. Een echte werkplek kost een veelvoud daarvan. ONZEKER: geen hard tarief te verifiëren zonder offerte aan te vragen.
- Lost het juridisch op: JA, en dit is juridisch het stevigste. Bij een virtueel kantoor van een gerenommeerde aanbieder is het een echt kantoorpand waar post binnenkomt en waar je bezoek kunt ontvangen, wat precies aan de KVK-eis voldoet. Nadeel: duurder en met langere contracten dan de gespecialiseerde adresaanbieders, en voor een eenmanszaak die EUR 49-cursussen verkoopt waarschijnlijk overkill.
- Bron: https://www.regus.com/nl-nl/netherlands/the-hague/virtual-offices en https://wezoo.com/insights/virtueel-kantoor-kvk

**Niets huren: woonadres publiceren met de toevoeging 'geen bezoekadres'** — Je zet je woonadres gewoon in de footer, voorwaarden en orderbevestiging, met de vermelding erbij dat het geen bezoekadres is en dat bezoek alleen op afspraak kan.
- Kosten: EUR 0.
- Lost het juridisch op: JA juridisch — dit is wat de meeste zzp'ers doen en het voldoet aan de wet. WebwinkelKeur noemt dit expliciet als route: je mag op je website aangeven dat het adres geen bezoekadres is, zodat klanten begrijpen dat ze er niet heen moeten. MAAR het lost Jasons eigenlijke probleem niet op: zijn woonadres staat dan gewoon op internet, vindbaar en indexeerbaar. Precies wat hij niet wil.
- Bron: https://www.webwinkelkeur.nl/blog/vermelding-van-vestigingsadres-maar-geen-bezoek-aan-de-deur/

**Alleen KVK-afscherming aanvragen (gratis)** — Via Mijn KVK je bezoekadres laten afschermen. Mag altijd bij een eenmanszaak, zonder dreiging aan te tonen, sinds 15 december 2022. Voorwaarde: een openbaar postadres in het Handelsregister dat afwijkt van het bezoekadres.
- Kosten: Gratis bij KVK. Maar je moet wel een postadres regelen, dus in de praktijk kost het wat dat postadres kost.
- Lost het juridisch op: NEE, niet op zichzelf. Afscherming haalt het adres uit het openbare Handelsregister, maar heft je eigen publicatieplicht uit 3:15d en 6:230m BW niet op. KVK waarschuwt letterlijk: 'Denk er wel aan dat het bezoekadres ook op andere plekken is te vinden, zoals op je website.' Doe dit dus ALS AANVULLING op een gehuurd vestigingsadres, niet in plaats daarvan. Combineer je het met een gehuurd adres, dan is je woonadres nergens meer te vinden en klopt alles.
- Bron: https://www.kvk.nl/over-het-handelsregister/afschermen-van-je-bezoekadres-wat-is-mogelijk/

### Wat andere kleine aanbieders feitelijk tonen

- **Rowan Nijboer Beleggingen — rowannijboer.nl (online cursus beleggen, ca. EUR 30)**: De dichtstbijzijnde vergelijking met Beleggingscollege: eenmanszaak, online beleggingscursus, één persoon. In de voorwaarden staan de eenmanszaak-vorm, KvK-nummer 90109902 en een volledig straatadres in een woonwijk in Almelo. Geen postbus, geen gehuurd kantooradres, geen 'dit is geen bezoekadres'-vermelding. Kortom: gewoon het huisadres. Btw-nummer ontbreekt overigens, terwijl 3:15d BW dat wel eist. Bron: https://www.rowannijboer.nl/algemene-voorwaarden
- **Pasman Coaching — pasmancoaching.nl (coaching, eenmanszaak)**: Netjes compleet op papier: rechtsvorm eenmanszaak, KvK 80158749, btw-nummer NL003402743B32, e-mailadres, telefoonnummer én een volledig fysiek adres in De Bilt. Ook hier is dat adres een gewone woonstraat en geen bedrijfspand. Dit is het patroon dat je bij verreweg de meeste zzp-coaches ziet: alle wettelijke velden ingevuld, privacy opgeofferd. Bron: https://pasmancoaching.nl/algemene-voorwaarden/
- **Mrs. Perfect Coaching — mrsperfectcoaching.nl (coaching)**: Het interessantste voorbeeld: zij hanteren expliciet TWEE adressen — een bezoekadres aan de Kamerlingh Onnesweg in Barendrecht (ogend als bedrijfspand/praktijkruimte) en daarnaast een apart postadres elders in dezelfde plaats. Dat is precies de constructie die art. 6:230m lid 1 onderdeel d en de KVK-afschermingsregeling veronderstellen: een geografisch vestigingsadres voor de wet, plus een postadres voor de correspondentie. KvK-nummer 91446953. Bron: https://mrsperfectcoaching.nl/algemene-voorwaarden/
- **OnbegrensdJij — onbegrensdjij.nl (coaching)**: Vermeldt KvK-nummer 95603034, twee telefoonnummers en een e-mailadres, maar het adres wordt uitsluitend als 'Postadres' gepresenteerd (in 's-Gravenzande) — er staat geen apart vestigings- of bezoekadres bij. Geen btw-nummer. Dit is de halve oplossing die veel zzp'ers kiezen: iets van een adres tonen zonder het als vestigingsadres te labelen. Formeel schiet dat tekort tegenover 3:15d BW ('adres van vestiging') en 6:230m sub c ('geografisch adres waar de handelaar gevestigd is'). Bron: https://onbegrensdjij.nl/algemene-voorwaarden/
- **Belegopedia.com (online cursus beleggen, EUR 69 voor 30 dagen toegang)**: Het waarschuwende voorbeeld — en een directe concurrent. Verkoopt een betaalde cursus, maar op de homepage staat in de footer alleen 'Copyright © 2026 Belegopedia.com' en op de contactpagina uitsluitend een contactformulier. Geen adres, geen KvK-nummer, geen btw-nummer, geen telefoonnummer. Dat voldoet aan geen van beide verplichtingen. Conclusie voor Jason: dit gebeurt veel en er wordt kennelijk niet actief op gehandhaafd bij kleine partijen — maar het is wel gewoon in strijd met de wet, en 'de concurrent doet het ook niet' past slecht bij een merk dat zichzelf als de eerlijke tegenhanger positioneert. Bron: https://www.belegopedia.com/ en https://www.belegopedia.com/contact/

### Onafhankelijke toetsing van de kernclaims

Vier van de vijf dragende claims houden stand; twee behoeven correctie op een punt dat er echt toe doet.

De juridische kern van het advies is solide. De wettekst klopt letterlijk, de ACM-formulering klopt letterlijk, en de conclusie (postbus voldoet niet, gehuurd vestigingsadres is de schone oplossing) blijft overeind. Wat niet klopt is (a) de bewering dat KVK zelf waarschuwt dat je het adres alsnog op je site moet zetten — die pagina zegt precies het tegenovergestelde — en (b) de prijsbandbreedte, die intern in tegenspraak is met het eigen advies om geen driejarig contract te nemen.

Twee dingen die ik NIET heb kunnen verifiëren en die je eerlijk moet meewegen: ik kreeg de officiële wetten.overheid.nl-pagina van art. 6:230m niet geladen (404 op de deeplink, en de artikelsectie zat niet in de opgehaalde tekst). De wettekst rust dus op wetboek.org — dezelfde bron die de collega gebruikte — en is niet onafhankelijk tegen de officiële bron gecontroleerd. Ook kon ik de tarievenpagina van bedrijfspostadres.nl niet volledig laden; de bedragen komen van de homepage.

Losse aanvulling die het advies raakt: Anteverde noemt op de eigen site alleen "Noord- en Zuid-Holland" als werkgebied, geen concreet adres in Den Haag of Rijswijk. Het advies "huur in Den Haag of Rijswijk" is dus alleen voor bedrijfspostadres.nl aantoonbaar; voor Anteverde weet je de plaats pas na navraag. Dat versterkt overigens stap 1 van het stappenplan (eerst bellen) — die volgorde is goed.

Praktische valkuil die in het advies ontbreekt: bedrijfspostadres.nl rekent per 4 weken, dus 13 termijnen per jaar, niet 12. Wie met 12 rekent, zit er structureel 8 procent naast.

Ik ben geen jurist; dit is bronverificatie, geen juridisch advies. Het voornemen om dit in dezelfde ronde als de conceptvoorwaarden door een jurist te laten nakijken blijft verstandig.

- KLOPT: Art. 6:230m lid 1 sub c BW eist "het geografische adres waar de handelaar gevestigd is en het telefoonnummer en e-mailadres van de handelaar"; de oude versie met 'fax' dateert van vóór 28 mei 2022. — Gecontroleerd op de door de collega genoemde bron https://wetboek.org/bw/6/230m. De tekst luidt daar inderdaad letterlijk 'het geografische adres waar de handelaar gevestigd is en het telefoonnummer en e-mailadres van de handelaar'. Het woord 'geografisch' staat er dus echt, en dat is precies het woord dat een postbus uitsluit. Fax komt in het huidige onderdeel c niet meer voor — consistent met de bewering dat de faxversie verouderd is. ONZEKERHEID: ik kon de officiële tekst op wetten.overheid.nl niet ophalen (de deeplink gaf 404; bij de algemene BW-pagina zat afdeling 2B niet in de opgehaalde inhoud). Deze claim rust dus op één bron — dezelfde die de collega gebruikte — en is niet onafhankelijk tegen de officiële staatsbron geverifieerd. Voor een juridisch dragende claim zou ik dat vóór publicatie alsnog laten doen.
- KLOPT: Art. 6:230v lid 7 BW verplicht de handelaar het adres óók in de orderbevestiging op te nemen, niet alleen op de site. — Gecontroleerd op https://wetboek.org/bw/6/230v. Lid 7 eist een bevestiging van de overeenkomst op een duurzame gegevensdrager, binnen redelijke termijn na het sluiten en in elk geval vóór levering/uitvoering, met daarin de informatie uit art. 230m lid 1. De conclusie klopt dus. WEL EEN NUANCE DIE HET ADVIES WEGLAAT: lid 7 zegt 'voor zover de handelaar deze informatie niet reeds eerder op een duurzame gegevensdrager heeft verstrekt'. Er zit dus een ontsnappingsclausule in. Die helpt jullie in de praktijk niet — een webpagina geldt niet als duurzame gegevensdrager — maar het advies presenteert de plicht absoluter dan de wettekst hem formuleert. De praktische consequentie voor Beleggingscollege (adres moet in de mail) blijft ongewijzigd.
- KLOPT: ACM vertaalt de wettelijke eis expliciet naar "vestigingsadres waarop u ingeschreven staat bij de KvK". — Gecontroleerd op https://www.acm.nl/nl/verkoop-aan-consumenten/consumenten-informeren/bedrijfsgegevens-vermelden. ACM gebruikt daar inderdaad die exacte formulering. TWEE PRECISERINGEN: (1) ACM gebruikt op die pagina zélf níét het woord 'geografisch adres' — dat komt uit de wettekst, niet uit ACM's uitleg. De collega presenteert het als één doorlopende redenering van ACM; feitelijk zijn het twee bronnen die naar dezelfde conclusie wijzen. (2) ACM zegt op die pagina niet met zoveel woorden 'een postbus mag niet'. Dat 'postbus mag niet' is wel juist, maar de onderbouwing komt van elders: KVK eist voor een vestigings-/bezoekadres een fysieke locatie waar de onderneming daadwerkelijk bereikbaar is; een postbus mag alleen als aanvullend postadres naast een geldig fysiek vestigingsadres. De conclusie overleeft de controle, de bronattributie is net te ruim.
- KLOPT NIET: KVK waarschuwt zelf dat je datzelfde adres nog steeds op je eigen website moet zetten, dus afschermen is halve winst. — DIT IS DE BELANGRIJKSTE CORRECTIE. Op https://www.kvk.nl/over-het-handelsregister/afschermen-van-je-bezoekadres-wat-is-mogelijk/ staat het omgekeerde van wat het advies beweert. KVK schrijft daar: 'Denk er wel aan dat het bezoekadres van je bedrijf of organisatie ook op andere plekken is te vinden, zoals op je website of in bedrijfsgidsen', met het advies 'Zorg dat je gegevens niet zichtbaar zijn op je eigen website'. Dat is geen waarschuwing dat je het adres MOET publiceren — het is het advies om het juist WEG te halen. Het advies gebruikt deze pagina als hoofdargument tegen de gratis route, en dat argument staat er niet.

De CONCLUSIE blijft niettemin overeind, maar via een andere KVK-pagina: op https://www.kvk.nl/wetten-en-regels/online-verkopen-deze-regels-moet-je-kennen/ noemt KVK 'het adres waarop je bedrijf is gevestigd' wél als verplichte vermelding voor online verkopers, vindbaar vóórdat iemand koopt. Vervang dus de bronverwijzing, niet de conclusie. Voor Beleggingscollege betekent dit ook iets ongemakkelijks: KVK's eigen privacyadvies (haal het van je site) en KVK's eigen webshopregels (zet het op je site) staan haaks op elkaar zodra je aan consumenten verkoopt — precies de spanning die het huren van een adres oplost.

De omliggende data kloppen wel: woonadressen zijn per 1 januari 2022 afgeschermd in het Handelsregister (https://www.rijksoverheid.nl/actueel/nieuws/2021/10/01/woonadressen-afgeschermd-in-handelsregister-per-1-januari-2022), en een eenmanszaak mag het bezoekadres zonder opgaaf van reden laten afschermen mits er een apart postadres in het Handelsregister staat dat openbaar blijft.
- KLOPT NIET: Reken op EUR 230-365 per jaar excl. btw; Anteverde is EUR 23/mnd bij jaarbetaling (= EUR 276/jaar excl. btw, geen opstartkosten); bedrijfspostadres.nl heeft Televisiestraat 206 Den Haag plus twee adressen in Rijswijk. — DEELS JUIST, MAAR DE BANDBREEDTE IS INTERN TEGENSTRIJDIG.

Wat wél klopt: op https://www.anteverde.nl/zakelijk-vestigingsadres.html staat EUR 23,00 per maand bij jaarbetaling excl. btw (35 procent korting), EUR 28,30 bij halfjaarbetaling en EUR 35,38 bij maandbetaling. 12 x 23 = EUR 276 per jaar — de rekensom klopt. 'Geen opstartkosten' klopt óók, maar preciezer dan het advies zegt: er zijn wél opstartkosten van EUR 35,38, alleen bij het maandpakket; bij half- en jaarbetaling vervallen ze. Inschrijven bij KVK op dat adres wordt expliciet aangeboden. De drie adressen van bedrijfspostadres.nl kloppen exact zoals genoemd: Televisiestraat 206, 2525 LV Den Haag; Laan van Zuid Hoorn 70, 2289 DE Rijswijk; J.C. van Markenlaan 3, 2285 VL Rijswijk (https://www.bedrijfspostadres.nl/).

Wat NIET klopt: de ondergrens van EUR 230 komt uit het driejarige contract van bedrijfspostadres.nl (vanaf EUR 17,95 per 4 weken), terwijl het advies twee alinea's verderop met nadruk zegt GEEN driejarig contract te nemen. Het advies rekent zichzelf dus rijk met een tarief dat het zelf afraadt. De maandelijks opzegbare variant bij dezelfde aanbieder start op EUR 37,95 per 4 weken — dat is EUR 493 per jaar excl. btw, ruim boven de genoemde bovengrens van EUR 365. Reëel bereik voor wat het advies daadwerkelijk aanraadt (één jaar, geen driejarig contract): ongeveer EUR 276 tot EUR 493 excl. btw.

Extra valkuil die nergens genoemd wordt: bedrijfspostadres.nl rekent per 4 weken, dus 13 termijnen per jaar. Wie x12 rekent zit er 8 procent naast. Anteverde rekent per maand, dus daar klopt x12 wel.

ONZEKERHEID: de tarievenpagina van bedrijfspostadres.nl (/prijzen en /tarieven) gaf 404 respectievelijk een onvolledige pagina; de bedragen komen van de homepage. De pakketstructuur (3 jaar / 1 jaar / maandelijks opzegbaar, 'alle prijzen zijn per 4 weken en exclusief btw') kon ik wel bevestigen. De EUR 300-budgetregel in het advies is daarmee te krap voor het contract dat het advies zelf voorstelt; ga uit van ongeveer EUR 280-500 per jaar excl. btw en verifieer telefonisch, wat sowieso al stap 1 van het stappenplan is.


## Deel 2: hoe de grote cursusaanbieders het doen

### Samenvatting

Kort antwoord: Jason pioniert niet. Wat Beleggingscollege doet (digitale inhoud + toestemmingsvinkje + bevestigingsmail) is bijna letterlijk de branchestandaard van de NRTO, de brancheorganisatie waar LOI, NTI en NHA alle drie bij zijn aangesloten.

De belangrijkste vondst is artikel 5 lid 12 van de NRTO Algemene Voorwaarden Consumentenmarkt (opgesteld in overleg met de Consumentenbond): "Indien de educatieve dienst voor het overgrote deel wordt aangeboden door middel van een elektronische (leer)omgeving, dan eindigt het recht op ontbinding bij aanvang van de educatieve dienst, mits: a. u er van tevoren uitdrukkelijk mee hebt ingestemd dat de uitvoering kan beginnen voor het einde van de ontbindingstermijn en dat u verklaart afstand te doen van uw recht van ontbinding, en b. de ondernemer de sub a bedoelde verklaring aan u heeft bevestigd." Dat is exact de constructie van Beleggingscollege: vinkje vooraf + bevestiging achteraf.

Belangrijke nuance in de kwalificatie: geen enkele Nederlandse aanbieder noemt een cursus "digitale inhoud". Ze kwalificeren allemaal als educatieve DIENST, en gebruiken vervolgens de e-learning-uitzondering hierboven om hetzelfde effect te bereiken. Het verschil is niet cosmetisch: de trigger is "bij aanvang van de educatieve dienst" (de cursist opent de cursus), niet "bij aankoop".

Tweede patroon: commercieel biedt vrijwel iedereen méér dan de wet eist. NHA geeft 15 dagen in plaats van 14, Udemy 30 dagen, Soofos 14 dagen mits minder dan 25% gevolgd.

Eerlijkheid over de bronnen: ik heb de voorwaardenteksten kunnen lezen, maar NIET de live checkouts. De checkoutpagina's van deze partijen zitten achter een inlog of een JavaScript-flow, en soofos.nl, udemy.com en loi.nl/algemene-voorwaarden gaven allemaal HTTP 403 op mijn fetcher. De letterlijke knop- en vinkjeteksten heb ik dus grotendeels NIET met eigen ogen kunnen verifiëren; dat staat per speler eerlijk als onzeker gemarkeerd. Wie dat hard wil weten, moet zelf een testbestelling tot aan de betaalstap doorlopen.

### Het patroon

DE GANGBARE PRAKTIJK, IN VIJF PUNTEN

1. Kwalificatie: DIENST, met een e-learning-uitzondering die als digitale inhoud werkt.
Niemand in Nederland noemt een cursus "digitale inhoud" in de zin van de kooprechtelijke uitzondering. Iedereen kwalificeert als "educatieve dienst". LOI zegt dat met zoveel woorden op hun eigen uitlegpagina: een inschrijving is "geen product maar een educatieve dienst" (https://www.loi.nl/opleiding-herroepen-of-beeindigen). Daarom loopt bij LOI de termijn vanaf de inschrijfdatum en niet vanaf ontvangst van het materiaal.

Maar de branche heeft precies één uitzondering ingebouwd die functioneel identiek is aan de digitale-inhoud-route: NRTO artikel 5 lid 12 (zie samenvatting voor het citaat). Voorwaarde a is het vinkje, voorwaarde b is de bevestigingsmail. Dit is geen bedenksel van een individuele aanbieder maar een set voorwaarden die in overleg met consumentenorganisaties tot stand is gekomen, met een geschillencommissie en een nakominggarantie tot 5.000 euro erachter (NRTO art. 16 en 17).
Bron: https://www.nrto.nl/media/1m1ayywz/algemene-voorwaarden-consumenten-2026-1.pdf

2. Termijn: 14 dagen is de bodem, niemand blijft eronder, sommigen gaan eroverheen.
LOI 14 dagen, NTI 14 dagen, NHA 15 dagen, Coursera 14 dagen voor EU/VK, Soofos 14 dagen (met 25%-drempel), Udemy 30 dagen als commercieel beleid. De opwaartse afwijking is de norm, niet de uitzondering.

3. Adres: een echt BEZOEKADRES, plus KVK en btw.
NRTO art. 3 lid 6 sub a eist bij een overeenkomst op afstand "de identiteit en het adres van de ondernemer, inclusief het bezoekadres van de vestiging". Alle Nederlandse partijen doen dit ook echt: NTI publiceert Dellaertweg 5E Leiden met KVK 28074996 en btw NL0076.77.613B01 op een eigen bedrijfsgegevenspagina, NHA doet hetzelfde voor Panningen. Een postbus alleen is niet genoeg.
Los daarvan geldt de algemene informatieplicht voor websites van art. 3:15d BW (identiteit, vestigingsadres, contactgegevens, KVK, btw-id, "gemakkelijk, rechtstreeks en permanent toegankelijk"). Bron voor die duiding: https://trustyourwebsite.com/nl/nl/guides/kvk-nummer-website-verplicht — dit is een commerciële aanbieder, dus behandel de precieze reikwijdte als indicatief, niet als juridisch advies.

4. Bestelknop: moet de betalingsverplichting benoemen.
Art. 6:230v lid 3 BW. Volgens de Hoge Raad zijn "bestellen" of "bestelling plaatsen" onvoldoende; "Bestelling met betalingsverplichting" is de veilige formulering. Sanctie: de consument is niet aan de koop gebonden en de overeenkomst is vernietigbaar.
Bronnen: https://mkbjuristen.nl/blog/ondernemen/ook-voor-bestelknoppen-bestaan-er-regels-en-ze-zijn-niet-onbelangrijk/ en https://www.ictrecht.nl/blog/rechter-oordeelt-dat-je-niet-hoeft-te-betalen-als-de-bestelknop-niet-voldoet

5. De ACM schrijft vier stappen voor bij digitale inhoud.
(1) vooraf informeren dat de bedenktijd vervalt, (2) toestemming vragen, (3) dat akkoord opnemen in de bevestiging, (4) pas dáárna toegang geven.
Bron: https://www.acm.nl/nl/verkoop-aan-consumenten/klantenservice/bedenktijd

WAT IK NIET HEB KUNNEN VASTSTELLEN
De letterlijke checkoutteksten. Elke poging om een besteltrechter of de voorwaardenpagina's van Soofos, Udemy en loi.nl/algemene-voorwaarden op te halen liep op een HTTP 403 of een inlogscherm. Ik heb geen enkele knoptekst of vinkjetekst van deze vijf partijen met eigen ogen gezien. Alles wat ik daarover zeg is afgeleid uit hun voorwaarden of uit de wet, niet uit waarneming.

### Wijken wij af?

NEE, IN DE KERN WIJKT BELEGGINGSCOLLEGE NIET AF.

Digitale inhoud + toestemmingsvinkje + bevestigingsmail is tegelijk de vier-stappen-route van de ACM en de NRTO-branchestandaard (art. 5 lid 12). Jason doet precies wat de gevestigde partijen doen. Sterker nog, ICTRecht waarschuwt expliciet dat een "twee-in-één" bevestiging waarbij bestellen en afstand doen in één handeling samenvallen, mogelijk niet als "uitdrukkelijk" telt, en beveelt een aparte, bewuste handeling aan. Een los vinkje naast de koopknop is dus niet alleen toegestaan, het is de aanbevolen variant.
Bron: https://www.ictrecht.nl/blog/herroepingsrecht-op-digitale-inhoud-kun-je-dat-uitsluiten

Toch vijf punten waar het scherper kan. Geen daarvan is een blokkade voor de eerste verkoop, maar punt 1 en 2 zijn wel echte risico's.

1. TRIGGERMOMENT: laat het recht vervallen bij START, niet bij AANKOOP.
Dit is de belangrijkste inhoudelijke afwijking om te controleren. NRTO art. 5 lid 12 zegt dat het ontbindingsrecht eindigt "bij aanvang van de educatieve dienst". Als Beleggingscollege het herroepingsrecht laat vervallen op het moment van betalen of van toegang krijgen, terwijl de koper nog geen enkele les heeft geopend, is dat strenger dan de hele branche. Praktische route: koppel het vervallen aan het openen van de eerste les. Dat is technisch goed te doen, want er is al lesson_progress. Wie koopt en nooit inlogt, houdt dan gewoon zijn 14 dagen. Dat is juridisch veiliger én past bij het eerlijkheidspositionering.

2. HERROEPINGSKNOP PER 19 JUNI 2026: die datum is al verstreken.
Sinds 19 juni 2026 moet vrijwel elke B2C-webshop in de EU een duidelijk zichtbare online herroepingsfunctie aanbieden. Grondslag: Richtlijn (EU) 2023/2673, artikel 11 bis, in Nederland geïmplementeerd in art. 6:230oa BW. De ACM houdt toezicht en kan een bindende aanwijzing of boete opleggen.
Bronnen: https://rassers.nl/nieuws/herroepingsknop-webshop-2026/ en https://nl.legal/blog/herroepingsknop-verplicht-webshop-2026
Goed nieuws met een slag om de arm: volgens nl.legal geldt de knop alleen waar daadwerkelijk een herroepingsrecht bestaat, dus niet als de consument correct uitdrukkelijk afstand heeft gedaan. Maar let op de wisselwerking met punt 1: iedereen die koopt en nog niet gestart is, HEEFT dat recht nog wel. Als Jason punt 1 overneemt, ontstaat er dus een groep klanten voor wie de knop waarschijnlijk verplicht is. Ik heb dit op één commerciële bron kunnen baseren en niet op de wettekst zelf; dit is precies zo'n punt om aan de jurist voor te leggen die toch al naar /voorwaarden en /herroepingsrecht moet kijken.

3. BESTELKNOP: controleer de letterlijke tekst.
Art. 6:230v lid 3 BW. Als de Mollie-koopknop nu "Koop deze cursus", "Bestellen" of "Naar betalen" zegt, is dat volgens de Hoge Raad-lijn onvoldoende en is de overeenkomst vernietigbaar: de klant hoeft dan niet te betalen. Maak ervan: "Bestelling met betalingsverplichting" of "Kopen met betalingsverplichting - 49 euro". Dit is een tekstwijziging van vijf minuten met een onevenredig groot risico als het niet gebeurt.

4. ADRES: een bezoekadres is verplicht, en dat is voor een eenmanszaak het woonadres.
Alle vergeleken partijen tonen een echt bezoekadres plus KVK plus btw. Beleggingscollege is een eenmanszaak in Den Haag, dus "bezoekadres" betekent in de praktijk het huisadres van Jason. Sinds eind 2022 kan een eenmanszaak het bezoekadres in het Handelsregister laten afschermen zonder aangetoonde dreiging, maar dat raakt het KVK-register en niet de eigen website.
Bronnen: https://www.kvk.nl/over-het-handelsregister/afschermen-van-je-bezoekadres-wat-is-mogelijk/ en https://www.accountancyvanmorgen.nl/2022/06/30/eenmanszaak-mag-adres-in-handelsregister-altijd-afschermen/
Wil Jason zijn huisadres niet publiceren, dan is de gangbare route een alternatief vestigingsadres (bedrijfsverzamelgebouw of virtueel kantoor) registreren bij de KVK en dát op de site zetten. Wat níét kan is helemaal geen adres tonen: KVK 71856633 en het btw-nummer horen er sowieso bij.

5. COMMERCIEEL: overweeg een bovenwettelijke garantie, want de markt biedt die.
Dit is geen verplichting maar wel het patroon. NHA 15 dagen, Soofos 14 dagen tot 25% gevolgd, Udemy 30 dagen. Een cursus van 49 euro met een strikt "geen herroeping zodra je begint" staat commercieel zwakker dan de hele concurrentie, en wringt met een merk dat zich verkoopt als de eerlijke tegenhanger van get-rich-quick-aanbieders. Het Soofos-model is hier het meest bruikbare voorbeeld voor Beleggingscollege, omdat het qua product het dichtst in de buurt komt: losse online cursussen met blijvende toegang. Hun regel "14 dagen, mits minder dan 25% gevolgd" is precies te bouwen met de bestaande voortgangsdata. Dat geeft de koper een echt vangnet en beschermt tegelijk tegen de klant die de hele cursus doorloopt en dan zijn geld terugvraagt.

Belangrijk bij punt 5: als Jason zo'n garantie belooft, moet die ook echt worden nagekomen, en de terugbetaalroute via Mollie bestaat nog niet (terugbetalingen staan op de v2-roadmap). Beloof niets wat nog niet gebouwd is; dat zou precies het soort claim zijn dat CLAUDE.md verbiedt.

### Per aanbieder

**NRTO (branchestandaard, niet zelf een aanbieder maar de norm waar LOI, NTI en NHA zich aan binden)** (https://www.nrto.nl/media/1m1ayywz/algemene-voorwaarden-consumenten-2026-1.pdf)
- Herroeping: HYBRIDE, en dit is de kernvondst van het onderzoek. Basiskwalificatie is DIENST: art. 5 lid 5 luidt 'Gedurende veertien dagen na het sluiten van een overeenkomst op afstand met betrekking tot een educatieve dienst heeft u het recht de overeenkomst zonder opgave van redenen te ontbinden.' Met sanctie op onvolledige informatie: die termijn wordt dan veertien dagen na het alsnog verstrekken, tot maximaal twaalf maanden.

Maar art. 5 lid 12 bevat de e-learning-uitzondering die functioneel identiek is aan de digitale-inhoud-route: 'Indien de educatieve dienst voor het overgrote deel wordt aangeboden door middel van een elektronische (leer)omgeving, dan eindigt het recht op ontbinding bij aanvang van de educatieve dienst, mits: a. u er van tevoren uitdrukkelijk mee hebt ingestemd dat de uitvoering kan beginnen voor het einde van de ontbindingstermijn en dat u verklaart afstand te doen van uw recht van ontbinding, en b. de ondernemer de sub a bedoelde verklaring aan u heeft bevestigd.'

Let op het triggermoment: 'bij aanvang van de educatieve dienst', niet bij aankoop.

Aanvullend art. 5 lid 11: 'De educatieve dienst kan tijdens de bedenktijd alleen beginnen op uw uitdrukkelijke verzoek.' Wie dan alsnog ontbindt, is 'een evenredig deel van de prijs' verschuldigd.
- Checkout: Niet geregeld in de voorwaarden. Wel legt art. 3 lid 6 vast wat het aanbod op afstand moet bevatten: identiteit en adres inclusief bezoekadres, het recht om binnen veertien dagen te ontbinden, eventuele meerkosten voor telefonisch of internetcontact, en de geldigheidsduur van het aanbod. Art. 4 lid 1: na totstandkoming ontvangt de klant 'schriftelijk of langs elektronische weg een bevestiging'. Art. 5 lid 7: de ondernemer stelt een modelformulier voor ontbinding beschikbaar, maar de klant is niet verplicht dat te gebruiken.
- Adres: Art. 3 lid 6 sub a eist 'de identiteit en het adres van de ondernemer, inclusief het bezoekadres van de vestiging'. Een postbus alleen volstaat dus niet.

NRTO zelf toont in de voettekst van elke pagina: Papiermolen 34, 3994 DK Houten, telefoon 030 267 3778, info@nrto.nl, btw NL804034291B02, kvk 40448394.
- Bijzonder: Dit document is het meest bruikbare stuk uit het hele onderzoek, omdat het in overleg met consumentenorganisaties tot stand is gekomen en dus een veilige referentie is.

Relevante overige artikelen: art. 10 lid 3 betaling vóór aanvang van de opleiding. Art. 15 vragen en klachten binnen tien werkdagen beantwoord, klachten later dan twee maanden zijn niet ontvankelijk. Art. 16 geschillen bij De Geschillencommissie Particuliere Onderwijsinstellingen, bindend advies. Art. 17 nakominggarantie: de NRTO staat garant voor nakoming van bindende adviezen door zijn leden, beperkt tot 5.000 euro per bindend advies.

Ook interessant voor het abonnement College+: art. 5 lid 4 bepaalt dat opleidingen in abonnementsvorm bij automatische verlenging kosteloos opzegbaar zijn met een opzegtermijn van maximaal één maand.

Verificatie: PDF volledig gelezen, veertien pagina's, alle citaten hierboven zijn letterlijk overgenomen uit de originele tekst.

**LOI (Leidse Onderwijsinstellingen)** (https://www.loi.nl/voorwaarden en https://www.loi.nl/opleiding-herroepen-of-beeindigen)
- Herroeping: DIENST, expliciet en zonder digitale-inhoud-uitsluiting. LOI zegt op de uitlegpagina met zoveel woorden dat een inschrijving 'geen product maar een educatieve dienst' is. Daarom telt de termijn vanaf de inschrijfdatum en niet vanaf ontvangst van het lesmateriaal, en verlengt digitale of fysieke levering de termijn niet.

Artikel 8 van de voorwaarden: 'Indien de Klant een particulier is, mag de overeenkomst binnen 14 kalenderdagen nadat deze tot stand is gekomen kosteloos en zonder opgaaf van redenen herroepen worden.' Ontvangen materiaal moet binnen 14 dagen in originele staat retour.

Ik heb géén clausule aangetroffen die het herroepingsrecht laat vervallen bij het openen van de online leeromgeving. Onzeker of die er echt niet is: ik heb de voorwaardenpagina via een samenvattende fetch gelezen, niet regel voor regel.
- Checkout: NIET GEVERIFIEERD. Het inschrijftraject van LOI zit achter een formulierflow die ik niet kon doorlopen; loi.nl/algemene-voorwaarden gaf bovendien een HTTP 404 en de canonieke pagina is loi.nl/voorwaarden. Ik heb geen knoptekst of vinkjetekst met eigen ogen gezien.
- Adres: Leidsedreef 2, 2352 BA Leiderdorp; postadres Postbus 4200, 2350 CA Leiderdorp; telefoon 071-5451234; info@loi.nl. KVK 28007673 voor Leidse Onderwijsinstellingen B.V.

Waarschuwing bij deze gegevens: adres en KVK komen uit derdenregisters (drimble.nl, graydongo.nl, oozo.nl) en niet van een eigen bedrijfsgegevenspagina van LOI. Behandel als indicatief.

Eén valkuil die ik wel kan opheldereren: in de voorwaarden staat ook Bordewijklaan 46 / Postbus 90.600, 2509 LP Den Haag. Dat is het adres van de Geschillencommissie, níét van LOI zelf.
- Bijzonder: Historisch precedent dat relevant is voor iedereen die voorwaarden schrijft: LOI hanteerde ooit een bedenktijd van zeven dagen die begon op een door LOI zelf gekozen datum uit de inschrijfbevestiging. Dat is als ongeldig beoordeeld: de termijn moet veertien dagen zijn en beginnen bij de inschrijving.
Bron: https://nl.hellolaw.com/juridisch-nieuws/voorwaarden-annulering-cursus-loi-ongeldig
De les: zelf sleutelen aan het startmoment van de bedenktijd is precies waar een grote speler op onderuit is gegaan.

Na de bedenktijd geen herroeping meer, wel tussentijds beëindigen tegen een redelijke vergoeding bestaande uit opstartkosten plus reeds gevolgd onderwijs. Voor klassikale opleidingen korter dan een jaar geldt de NRTO-staffel: 10 procent tot twee maanden voor start, 20 procent tussen twee en één maand, 30 procent tussen één maand en twee weken, 50 procent binnen twee weken.

Geen bovenwettelijke niet-goed-geld-terug-garantie aangetroffen.

**NHA (Nationale Handelsacademie)** (https://www.nha.nl/klantenservice/studievoorwaarden en https://www.nha.nl/bedrijfsgegevens)
- Herroeping: DIENST met fysieke-levering-logica, en de ruimste termijn van de Nederlandse partijen. Artikel 7 geeft 15 kalenderdagen bedenktijd na ontvangst van (het eerste deel van) het studiepakket, dus één dag méér dan de wet eist en met een later startmoment dan LOI hanteert. Ontbinden gaat via www.nha.nl/retour; daarna nog 15 dagen om het pakket compleet en onbeschadigd terug te sturen, retourkosten voor rekening van de student.

Het interessante detail voor Beleggingscollege: 'De bedenktermijn eindigt voortijdig als de student een examen of getuigschrift aanvraagt.' Dat is dezelfde gedachte als art. 5 lid 12 NRTO, maar met een ander en veel later aangrijpingspunt: niet het openen van de leeromgeving, maar het opeisen van het eindresultaat.

Geen expliciete digitale-inhoud-uitsluiting aangetroffen.
- Checkout: NIET GEVERIFIEERD. Ik heb de studievoorwaarden gelezen maar het bestelformulier niet kunnen bereiken.
- Adres: Bezoekadres Industrieterrein Panningen 37-39, 5981 NK Panningen. Postadres Postbus 7006, 5980 AA Panningen. Telefoon 077 306 7000, info@nha.nl. NHA voert een eigen bedrijfsgegevenspagina, wat precies de transparantie is die NRTO art. 3 lid 6 sub a beoogt.

De genoemde registratienummers (KVK Venlo 1205.2831 en btw 81.30.05760.B01) neem ik met een voorbehoud over: het KVK-nummer heeft niet het gebruikelijke achtcijferige formaat, dus mogelijk is dit een verouderd of verkeerd overgenomen nummer. Niet zelf in het Handelsregister geverifieerd.
- Bijzonder: NHA is de enige onderzochte partij met uitgesproken BOVENWETTELIJKE garanties, en formuleert die als studiegarantie in plaats van als geld-terug-garantie:
- Examengarantie (art. 4): gratis herbegeleiding als je de eerste keer zakt.
- Lesgeldteruggave (art. 5): teruggave van examengelden bij tweemaal zakken, geldig tot drie jaar na inschrijving.
- Drie jaar huiswerkbegeleiding (art. 6).

Cruciale beperking, en dit is relevant voor Jason: deze drie garanties gelden uitdrukkelijk NIET voor zelfstudiecursussen. Ook de bedenktijdregeling van art. 7 sluit zelfstudiecursussen uit. NHA behandelt begeleide opleidingen en losse zelfstudiecursussen dus bewust als twee verschillende producten met twee verschillende regimes. Beleggingscollege verkoopt zuiver zelfstudie, dus het NHA-model is qua garanties minder goed overdraagbaar dan het Soofos-model.

**NTI** (https://www.nti.nl/inschrijfvoorwaarden/cursussen-en-beroepsopleidingen/ en https://www.nti.nl/veelgestelde-vragen/wat-zijn-de-bedrijfsgegevens-van-het-nti/)
- Herroeping: DIENST, met een startmoment gekoppeld aan de bevestiging. Artikel 6: 'Er geldt een bedenktijd van veertien dagen (herroepingsrecht) vanaf het moment dat wij de inschrijving aan u bevestigd hebben.' Uitoefening via een ingevuld annulerings- of herroepingsformulier; daarna nog veertien dagen om studiemateriaal te retourneren, verzendkosten voor de student.

Het meest relevante artikel voor Beleggingscollege is artikel 9 lid 8: 'De kosten van digitaal studiemateriaal dat door NTI aan de student ter beschikking is gesteld middels een licentiecode, moeten in geval van ruiling altijd door de student aan NTI worden betaald zodra de licentiecode door de student is ingevoerd.'

Dat is de digitale-inhoud-gedachte in optima forma, maar toegepast op het MATERIAAL en niet op de opleiding: zodra de code is ingevoerd, is de waarde verbruikt en niet meer terug te draaien. De opleiding zelf blijft een dienst met veertien dagen bedenktijd.
- Checkout: NIET GEVERIFIEERD. Artikel 4 lid 4 bevestigt wel de scope van wat er gekocht wordt: 'De studieovereenkomst omvat de opleiding waarvoor u zich inschrijft inclusief het verplichte lesmateriaal.' Artikel 5 lid 5 sub a schrijft voor dat bij overeenkomsten op afstand 'het adres van NTI, inclusief het bezoekadres van de vestiging' moet worden vermeld, wat de NRTO-eis één op één overneemt. Knop- en vinkjeteksten heb ik niet gezien.
- Adres: Het beste voorbeeld van de vijf. NTI voert een aparte FAQ-pagina 'Wat zijn de bedrijfsgegevens van NTI' met KVK 28074996 Leiden, btw NL 0076.77.613 B.01 en IBAN NL91 RABO 0188 9978 73 (Rabobank).

Bezoekadres Dellaertweg 5E, 2316 WZ Leiden; postadres Postbus 11058, 2301 EB Leiden. Het bankrekeningnummer erbij zetten is niet verplicht, maar past bij een aanbieder die vertrouwen moet winnen voor een aankoop die vooruit betaald wordt.
- Bijzonder: NTI hanteert per opleidingssoort een eigen set inschrijfvoorwaarden (MBO, HBO Bachelor, cursussen en beroepsopleidingen, MBA en Master, klassikaal, vraagfinanciering). Dat is een bewuste keuze: verschillende producten, verschillende annuleringsregimes, in plaats van één set die alles moet dekken.

Annulering vóór aanvang volgt de NRTO-staffel (art. 7 lid 6): 10 procent tot twee maanden voor start, oplopend tot 50 procent binnen twee weken.

Artikel 7 lid 1 en 2, prijswijzigingen: prijsverhoging binnen drie maanden na sluiten raakt de overeengekomen prijs niet; bij verhoging na drie maanden maar vóór aanvang mag de student ontbinden.

NTI is aangesloten bij de NRTO en verklaart de inschrijfvoorwaarden in lijn met de NRTO-voorwaarden en gedragscode.

**Soofos** (https://support.soofos.nl/support/solutions/articles/80000946406-voorwaarden-en-eigendomsrecht)
- Herroeping: Van alle vijf het dichtst bij het product van Beleggingscollege, en met de meest bruikbare oplossing. Soofos verkoopt losse online cursussen met blijvende toegang; dat is precies het model van Beleggingscollege.

Hun praktijkregel: 'Een cursist kan op Soofos binnen 14 dagen de cursus annuleren, mits ze minder dan 25% van de cursus gevolgd hebben.' Bij annulering wordt het aankoopbedrag teruggestort en wordt de transactie als niet-plaatsgevonden behandeld, dus de instructeur krijgt niet uitbetaald. In bijzondere situaties maakt de klantenservice uitzonderingen.

De kwalificatie is dus NOCH een harde digitale-inhoud-uitsluiting bij eerste toegang, NOCH een pure dienstbenadering. Het is een derde weg: veertien dagen bedenktijd blijft staan, maar met een gebruiksdrempel van 25 procent als grens tegen misbruik. Voor een aanbieder met voortgangsregistratie is dat objectief meetbaar en dus goed te verdedigen.

EERLIJKE ONZEKERHEID: dit komt uit een supportartikel van Soofos zelf, niet uit hun algemene voorwaarden. De formele AV op soofos.nl/algemene-voorwaarden gaf HTTP 403 en was ook via web.archive.org niet te openen. Het is dus mogelijk dat de juridische tekst strenger of anders is dan wat de klantenservice communiceert.
- Checkout: NIET GEVERIFIEERD. Het hele domein soofos.nl blokkeerde mijn fetcher met HTTP 403, dus ik heb noch een cursuspagina, noch een checkout, noch de algemene voorwaarden kunnen inzien.
- Adres: ONZEKER, en ik zou hier niet op bouwen. Een oudere versie van de Soofos-voorwaarden noemt Soofos B.V., Amstelveenseweg 63-IV, 1075 VV Amsterdam. Die versie stond op een documentdeelsite (docplayer.nl) die ik vervolgens niet meer kon bereiken (DNS-fout), dus ik heb het adres niet in de originele bron kunnen nalezen en het is mogelijk verouderd. Een zoekopdracht in bedrijvenregisters op Soofos B.V. leverde geen bevestiging op. KVK- en btw-nummer heb ik niet kunnen vaststellen.
- Bijzonder: Voor het abonnement Soofos Plus geldt een expliciete niet-goed-geld-terug-garantie: niet tevreden binnen de eerste veertien dagen betekent geld terug, maar dat moet uiterlijk vijf dagen vóór de eerstvolgende incassodatum gebeuren, anders verlengt het abonnement automatisch.

Dat is direct relevant voor College+ (14,99 per maand): de combinatie van een geld-terug-venster met een harde deadline vóór de incassodatum is precies de constructie die voorkomt dat je moet terugboeken op een al geïncasseerd bedrag. Gezien het MOI-risico bij Mollie en het feit dat SEPA-incasso nog op goedkeuring wacht, is dit het model om na te kijken zodra het abonnement gebouwd wordt.

Kanttekening bij de vindplaats: het 25%-cijfer en de Plus-garantie komen uit het supportartikel en uit een zoekresultatensamenvatting van een reviewsite (bronvangeld.nl) die ik daarna niet meer kon bereiken. Het supportartikel van Soofos zelf is de sterkste bron hier.

**Coursera (internationaal, verkoopt in Nederland via Coursera Europe B.V.)** (https://www.coursera.org/about/terms)
- Herroeping: DIENST met uitdrukkelijke EU-erkenning, en de enige internationale partij waarvan ik de tekst echt heb kunnen lezen. Letterlijk: 'In accordance with applicable laws, if you are in the European Union and the United Kingdom you have a right of withdrawal for 14 days from the date a contract commences.'

Bij abonnementen met proefperiode telt die proefperiode mee binnen de veertien dagen, niet erbovenop.

Het recht vervalt als de diensten al volledig zijn uitgevoerd met uitdrukkelijke toestemming van de klant, of als het gebruik met diens medeweten is begonnen. Dat is de dienstenroute van art. 6:230p BW, niet de digitale-inhoudroute.

Onzekerheid: de fetch bevestigt dat Coursera de klant moet laten instemmen met onmiddellijke levering om het recht te laten vervallen, maar ik kon niet vaststellen dat er ook daadwerkelijk een expliciete instemmingstekst vóór het afrekenen wordt getoond. Ook heb ik geen Nederlandstalige versie van deze voorwaarden gevonden; de tekst is Engelstalig.
- Checkout: NIET GEVERIFIEERD. Ik heb alleen de voorwaardenpagina gelezen, geen betaalscherm.
- Adres: Hoofdadres 2440 West El Camino Real, Suite 500, Mountain View, CA 94040, Verenigde Staten. Dit adres wordt in de voorwaarden meerdere keren genoemd voor auteursrechtmeldingen en arbitrageverzoeken.

Voor EU-gebruikers worden de diensten geleverd door Coursera Europe B.V., gevestigd in Nederland. Het specifieke Nederlandse vestigingsadres en KVK-nummer van die entiteit staan niet in de door mij gelezen tekst.
- Bijzonder: Nuttig als tegenvoorbeeld: een Amerikaanse partij die in de EU verkoopt, zet een aparte Nederlandse B.V. neer en neemt een expliciete EU-clausule op. De omvang van de organisatie verandert niets aan de kern van de regel: veertien dagen, tenzij volledige uitvoering met uitdrukkelijke toestemming.

Het feit dat Coursera het als dienst en niet als digitale inhoud kwalificeert bevestigt het patroon: geen enkele grote aanbieder van online cursussen kiest voor de zuivere digitale-inhoud-route.

**Udemy (internationaal) - ONVOLLEDIG ONDERZOCHT** (https://www.udemy.com/terms/?locale=nl_NL en https://support.udemy.com/hc/en-us/articles/360050856093-Udemy-s-Refund-Policy)
- Herroeping: NIET GEVERIFIEERD, en dat wil ik expliciet gezegd hebben in plaats van het te reconstrueren. Elke poging om Udemy's voorwaarden te lezen liep op HTTP 403: de Nederlandstalige gebruiksvoorwaarden, het Nederlandstalige terugbetalingsbeleid, het Nederlandstalige supportartikel en het Engelstalige supportartikel over het refundbeleid.

Wat ik uit zoekresultaatsamenvattingen heb, en dus als tweedehands informatie moet markeren: Udemy hanteert een terugbetalingsgarantie van 30 dagen, ruimer dan de wettelijke veertien. Abonnementen die via Udemy.com worden gekocht vallen NIET onder die 30-dagen-garantie; daar hangt het recht op terugbetaling af van het land dat aan het account gekoppeld is.

Of Udemy een cursus kwalificeert als digitale inhoud of als dienst, en of zij een afstandsverklaring bij het afrekenen vragen: onbekend. Ik heb geen enkele zin uit hun voorwaarden kunnen citeren.
- Checkout: NIET GEVERIFIEERD. Geen enkele Udemy-pagina was bereikbaar.
- Adres: NIET GEVERIFIEERD. Ik heb geen adres, KVK-equivalent of EU-entiteit van Udemy kunnen vaststellen uit een primaire bron.
- Bijzonder: De reden om Udemy toch te noemen ondanks de onvolledigheid: de 30-dagen-garantie is het meest genoemde marketingargument in deze markt en bepaalt mede wat een Nederlandse koper van een online cursus als normaal beschouwt. Ook al kan ik de juridische onderbouwing niet lezen, de commerciële verwachting die Udemy in de markt heeft gezet is een reëel gegeven voor de prijsstelling en garantiekeuze van Beleggingscollege.

Als dit punt zwaar moet wegen in een besluit, is een handmatige controle nodig: udemy.com/terms/refund/?locale=nl_NL openen in een gewone browser. Ik kon dat binnen de gestelde gereedschapsbeperking niet doen.

### Onafhankelijke toetsing

Het onderzoek is in de kern solide: de dragende vondst — NRTO art. 5 lid 12 — heb ik woord-voor-woord kunnen terugvinden, inclusief sub a en sub b en de Consumentenbond-herkomst. Ook de ACM-vierstappenroute en het LOI-citaat staan er letterlijk zoals geciteerd. De hoofdconclusie ("Jason pioniert niet, dit is branchestandaard") houdt dus stand.

Drie dingen moeten worden gecorrigeerd voordat deze notitie ergens als onderbouwing wordt gebruikt:

1. DE HOGE RAAD-CLAIM IS JUIST MAAR VERKEERD GECITEERD. De uitspraak bestaat echt (HR 4 oktober 2024, ECLI:NL:HR:2024:1355), maar géén van de twee opgegeven bronnen gaat daarover — de ene betreft een rechtbankzaak uit 2018 over een andere knoptekst, de andere noemt helemaal geen rechter. Wie de voetnoten natrekt, concludeert ten onrechte dat de claim verzonnen is. Vervang de citaties.

2. NHA IS GEEN BEWIJS VOOR HET PATROON, EERDER EEN TEGENVOORBEELD. De 15 dagen kloppen, maar de termijn start daar bij ontvangst van het fysieke studiepakket en de e-learning-uitzondering wordt niet gebruikt. Het argument "vrijwel iedereen doet dit" leunt daarmee op minder schouders dan de notitie suggereert.

3. DE ABSOLUTE ONTKENNINGEN ZIJN TE STELLIG. "Geen enkele Nederlandse aanbieder noemt een cursus digitale inhoud" is een negatieve claim over een hele markt op basis van een handvol bekeken voorwaarden. Zwak dat af naar "van de door mij bekeken aanbieders".

De eerlijkheid van de collega over wat hij níét zag (de live checkouts) is terecht en netjes gemarkeerd; ik ben daar niet verder gekomen dan hij, want die pagina's zitten achter inlog of geven 403. Wat ik daar wel aan toevoeg: de ACM eist in stap 4 dat de klant de toegang ZELF start, en dat is met een fetcher sowieso niet vast te stellen.

ACTIEPUNT DAT UIT DEZE CONTROLE ROLT EN NIET IN DE ORIGINELE NOTITIE STOND: controleer de letterlijke tekst op de koopknop van beleggingscollege.com. De Hoge Raad kijkt uitsluitend naar de knoptekst zelf, los van de context van het bestelproces, en heeft "bestellen", "bestelling plaatsen" en "bestelling afronden" alle drie afgekeurd. Staat er nu zoiets, dan is elke koop vernietigbaar. Dat hoort vóór het omzetten van de Mollie-testkey naar de live-key geregeld te zijn (openstaand punt 9). Ik ben geen jurist en dit is geen juridisch advies — maar dit is een goedkope controle met een dure keerzijde.
