# Wat er wettelijk in de orderbevestiging moet

Laatst bijgewerkt: 2 augustus 2026.

> **Dit is geen juridisch advies.** Het is onderzoek dat is uitgevoerd om de bevestigingsmail
> te kunnen bouwen, met bronvermelding zodat een jurist het kan natrekken. Twee punten zijn
> uitdrukkelijk onbeslist gebleven; die staan onderaan.

## Samenvatting

De kern: een orderbevestiging voor een digitale cursus is in Nederland geen servicegebaar maar een wettelijke handeling met drie zelfstandige functies tegelijk. (1) Het is de bevestiging op duurzame gegevensdrager van art. 6:230v lid 7 BW, die alle precontractuele informatie van art. 6:230m lid 1 BW moet dragen. (2) Het is de ontvangstbevestiging van de elektronische aanvaarding van art. 6:227c lid 2 BW. (3) En — dit is het belangrijkste en het meest over het hoofd geziene punt — de mail is zélf de derde cumulatieve voorwaarde waaronder het herroepingsrecht vervalt.

Sinds de Moderniseringsrichtlijn (Richtlijn (EU) 2019/2161, in NL Stb. 2022, 157, i.w.tr. 28 mei 2022) luidt art. 6:230p onderdeel g BW dat er bij digitale inhoud die niet op een materiële drager is geleverd géén ontbindingsrecht is voor zover de nakoming is begonnen, en voor zover de overeenkomst een betalingsverplichting inhoudt, indien: 1° de nakoming is begonnen met uitdrukkelijke voorafgaande toestemming, 2° de consument heeft verklaard daarmee afstand te doen van zijn ontbindingsrecht, én 3° de handelaar een bevestiging heeft verstrekt als bedoeld in art. 6:230t lid 2 of art. 6:230v lid 7 BW. Het vinkje bij het afrekenen alleen is dus niet genoeg. Gaat de bevestigingsmail niet weg, dan is voorwaarde 3° niet vervuld, blijft het herroepingsrecht bestaan en is de klant bovendien geen kosten verschuldigd (art. 6:230s BW). Ontbrak ook de informatie over het herroepingsrecht, dan rekt de bedenktijd op tot maximaal twaalf maanden (art. 6:230o lid 2 BW).

"Duurzaam" betekent: een middel dat de consument persoonlijk aan hem gerichte informatie laat opslaan, toegankelijk voor toekomstig gebruik, in ongewijzigde weergave (art. 6:230g lid 1 sub h BW). E-mail voldoet — overweging 23 bij Richtlijn 2011/83/EU noemt e-mail expliciet, en HvJ EU 25 januari 2017, C-375/15 (BAWAG) bevestigt dat langs elektronische weg verstrekte informatie kan kwalificeren. Een hyperlink naar een webpagina voldoet níét: HvJ EU 5 juli 2012, C-49/11 (Content Services). Praktische consequentie: de verplichte informatie moet in de mailtekst staan, niet erachter.

Over de btw is het antwoord kort: bij een B2C-verkoop is een volledige factuur niet verplicht. De factuurplicht van art. 34c Wet OB 1968 geldt alleen bij leveringen en diensten aan een andere ondernemer of aan een rechtspersoon-niet-ondernemer (plus enkele bijzondere gevallen). Een bon volstaat fiscaal. Wat wél moet: het totaalbedrag inclusief belastingen bevestigen (art. 6:230m lid 1 sub e BW) en de omzet in de administratie kunnen verantwoorden (art. 34 Wet OB 1968, art. 52 AWR, zeven jaar bewaren). Voor Beleggingscollege is er een extra reden om de btw tóch te specificeren: de eigen algemene voorwaarden beloven al een factuur met btw apart, en die toezegging bindt.

Wat gerust als goed gebruik mag gelden en dus geschrapt kan worden zonder juridisch risico: het ordernummer, de klachtroute met reactietermijn, de verwijzing naar ACM ConsuWijzer, de zin dat Beleggingscollege onderwijs geeft en geen persoonlijk beleggingsadvies, en de risicowaarschuwing over beleggen. Die laatste twee zijn geen wettelijke plicht voor een opleider zonder Wft-vergunning, maar ze passen bij het merk en houden afstand tot het vergunningplichtige domein.

De bestaande implementatie in de repo staat er al redelijk voor. C:\Users\jason\CodingProjects\Beleggingscollege\src\lib\mailteksten.ts bevat een orderbevestiging die de toestemming al bevestigt, en C:\Users\jason\CodingProjects\Beleggingscollege\src\app\api\checkout\route.ts legt de toestemming vast met tijdstip, IP en tekstversie. De echte gaten zitten in: het ontbrekende vestigingsadres en btw-nummer (staan op null), de verplichte informatie die nu alleen via links wordt aangeboden, en het ontbreken van een herkansing als de mail niet verstuurd kan worden.

Twee dingen die ik niet met zekerheid heb kunnen vaststellen en die een jurist moet bevestigen: of een cursus met levenslange platformtoegang kwalificeert als "digitale inhoud" (art. 6:230p onderdeel g BW, recht vervalt bij aanvang) of als dienst (art. 6:230p onderdeel d BW, recht vervalt pas na volledige nakoming) — dat verschil is materieel; en de btw-behandeling, waarbij ik geen enkele grond zie voor de onderwijsvrijstelling maar dat door de boekhouder bevestigd moet worden.

## Verplichte elementen

### 1. De bevestiging staat in de mailtekst zelf, niet achter een link. Alle hieronder genoemde informatie moet in de body (of een meegestuurde bijlage) staan; links naar /voorwaarden of /herroepingsrecht mogen aanvullend zijn, nooit vervangend.

**Waarom:** De bevestiging moet op een duurzame gegevensdrager worden verstrekt, binnen een redelijke termijn na het sluiten van de overeenkomst en in elk geval voordat de dienst wordt uitgevoerd. E-mail voldoet; een hyperlink naar een webpagina niet.

**Bron:** Art. 6:230v lid 7 BW (implementatie art. 8 lid 7 Richtlijn 2011/83/EU); definitie duurzame gegevensdrager art. 6:230g lid 1 sub h BW; overweging 23 Richtlijn 2011/83/EU; HvJ EU 5 juli 2012, C-49/11 (Content Services); HvJ EU 25 januari 2017, C-375/15 (BAWAG)

### 2. Bevestiging van de uitdrukkelijke voorafgaande toestemming om direct te beginnen ÉN van de verklaring dat de klant daarmee afstand doet van zijn ontbindingsrecht. Beide onderdelen apart en herkenbaar, niet weggemoffeld in een lopende alinea. Vermeld erbij welke tekstversie is aangevinkt en wanneer.

**Waarom:** Dit is de kern. Zonder deze bevestiging is de derde cumulatieve voorwaarde voor het vervallen van het herroepingsrecht niet vervuld: het recht blijft dan bestaan en de klant is bij ontbinding geen kosten verschuldigd.

**Bron:** Art. 6:230v lid 7 sub b BW jo. art. 6:230p onderdeel g BW (voorwaarde 3°: de handelaar heeft een bevestiging verstrekt als bedoeld in art. 6:230t lid 2 of art. 6:230v lid 7); art. 16 lid 1 sub m Richtlijn 2011/83/EU zoals gewijzigd door Richtlijn (EU) 2019/2161; Stb. 2022, 157, i.w.tr. 28 mei 2022; sanctie art. 6:230s BW

### 3. Alle precontractuele informatie van art. 6:230m lid 1 BW, voor zover die niet al vóór het sluiten van de overeenkomst op een duurzame gegevensdrager is verstrekt. In de praktijk: alles, want een website is geen duurzame gegevensdrager.

**Waarom:** De bevestiging moet de volledige informatieset dragen. Wat op de site stond telt niet als 'al verstrekt op duurzame gegevensdrager'.

**Bron:** Art. 6:230v lid 7 sub a BW jo. art. 6:230m lid 1 BW; HvJ EU C-49/11 (Content Services)

### 4. De voornaamste kenmerken van wat er gekocht is: welke cursus, hoeveel lessen, dat het een eenmalige aankoop met levenslange toegang is, dat er geen abonnement loopt en niets wordt verlengd, en dat er een certificaat volgt na afronding.

**Waarom:** Verplichte omschrijving van de voornaamste kenmerken van de dienst of digitale inhoud.

**Bron:** Art. 6:230m lid 1 sub a BW

### 5. Identiteit en handelsnaam van de verkoper: Beleggingscollege, met daarbij de natuurlijke persoon achter de eenmanszaak (Jason Krijgsman).

**Waarom:** Verplichte identificatie van de handelaar, zowel consumentenrechtelijk als op grond van de e-commerceregels.

**Bron:** Art. 6:230m lid 1 sub b BW; art. 3:15d lid 1 sub a BW; art. 6:230b BW (dienstenrichtlijn)

### 6. Het geografische vestigingsadres. Staat nu op null in src/lib/mailteksten.ts. Een e-mailadres of postbus alleen volstaat niet — er moet een fysiek adres staan, ook bij een eenmanszaak aan huis.

**Waarom:** Verplicht adres van vestiging; ook het adres waar de consument een klacht kan indienen moet kenbaar zijn.

**Bron:** Art. 6:230m lid 1 sub c BW; art. 3:15d lid 1 sub a BW

### 7. E-mailadres en, als er een zakelijk telefoonnummer is, dat telefoonnummer. Beheer@beleggingscollege.nl staat er al.

**Waarom:** Gegevens die snel contact en rechtstreekse, effectieve communicatie mogelijk maken.

**Bron:** Art. 6:230m lid 1 sub c BW; art. 3:15d lid 1 sub b BW

### 8. Het KvK-nummer (71856633). Staat er al.

**Waarom:** Verplicht in elke uitgaande handelsmail, en verplicht als identificatiegegeven van een dienst van de informatiemaatschappij.

**Bron:** Art. 3:15d lid 1 sub c BW; art. 27 Handelsregisterwet 2007 (KvK-nummer op alle uitgaande brieven, orders, facturen, offertes en e-mails; reclame-uitingen uitgezonderd)

### 9. Het btw-identificatienummer. Staat nu op null in src/lib/mailteksten.ts.

**Waarom:** Verplicht identificatiegegeven zodra de ondernemer btw-plichtig is.

**Bron:** Art. 3:15d lid 1 sub f BW; art. 6:230b BW

### 10. De totale prijs inclusief belastingen, en dat er niets bijkomt: EUR 49,00 inclusief btw, eenmalig.

**Waarom:** Verplichte bevestiging van de totale prijs inclusief belastingen en van het ontbreken van bijkomende kosten.

**Bron:** Art. 6:230m lid 1 sub e BW

### 11. De wijze van betaling en van uitvoering: betaald via Mollie (iDEAL, kaart, PayPal of Apple Pay), toegang direct beschikbaar via het ingelogde account, geen levertermijn.

**Waarom:** Verplichte informatie over betaling, levering, uitvoering en de termijn waarbinnen de handelaar zich verbindt.

**Bron:** Art. 6:230m lid 1 sub g BW

### 12. Informatie over het herroepingsrecht als zodanig: dat er bij koop op afstand normaal veertien dagen bedenktijd geldt, hoe die termijn loopt en hoe je zou herroepen — samen met de mededeling dat en waarom dat recht hier is vervallen.

**Waarom:** De informatieplicht over het herroepingsrecht blijft gelden, ook als het recht vervolgens vervalt; daarnaast is er een aparte plicht te melden dat er geen ontbindingsrecht is of onder welke omstandigheden het wordt verloren. Ontbreekt dit, dan verlengt de bedenktijd met maximaal twaalf maanden.

**Bron:** Art. 6:230m lid 1 sub h en sub k BW; sanctie art. 6:230o lid 2 BW; modelinstructie en modelformulier: bijlage I deel A en B bij Richtlijn 2011/83/EU

### 13. Een herinnering aan de wettelijke waarborg dat de cursus moet beantwoorden aan wat is toegezegd, met de rechten die de klant daarbij heeft.

**Waarom:** Verplichte herinnering aan het wettelijk conformiteitsrecht; voor digitale inhoud en digitale diensten geldt sinds 2022 een eigen conformiteitsregime inclusief updateplicht.

**Bron:** Art. 6:230m lid 1 sub l BW; titel 7.1aa BW (art. 7:50aa e.v. BW, conformiteitseisen art. 7:50ae BW), implementatie Richtlijn (EU) 2019/770, i.w.tr. 27 april 2022

### 14. De functionaliteit van de digitale inhoud, inclusief technische beveiligingsvoorzieningen: toegang is gekoppeld aan het account waarmee is ingelogd, er is geen download, de cursus is niet overdraagbaar.

**Waarom:** Verplichte informatie over de functionaliteit van digitale inhoud met inbegrip van toepasselijke technische beveiligingsvoorzieningen.

**Bron:** Art. 6:230m lid 1 sub r BW

### 15. De relevante compatibiliteit en interoperabiliteit: wat je nodig hebt om de cursus te kunnen volgen (moderne browser, internetverbinding) — en dat XP, badges en voortgangsvinkjes op dit moment in de browser worden bewaard en dus niet meeverhuizen naar een ander apparaat, terwijl de aankoop zelf wél aan het account hangt.

**Waarom:** Verplichte informatie over relevante interoperabiliteit met hardware en software. De opmerking over browseropslag valt hier én onder de voornaamste kenmerken, en is bovendien precies het soort beperking dat je niet mag verzwijgen.

**Bron:** Art. 6:230m lid 1 sub s BW (en sub a/sub r voor het karakter van de beperking)

### 16. Een ontvangstbevestiging van de elektronisch gedane aanvaarding — in de praktijk dekt dezelfde mail dit af, mits hij zo spoedig mogelijk gaat.

**Waarom:** Zelfstandige verplichting naast art. 6:230v lid 7 BW. Zolang de ontvangst niet is bevestigd, kan de wederpartij de overeenkomst ontbinden.

**Bron:** Art. 6:227c lid 2 BW (implementatie art. 11 Richtlijn 2000/31/EG inzake elektronische handel)

### 17. De algemene voorwaarden, meegestuurd als tekst of bijlage — niet alleen als link.

**Waarom:** Bij elektronisch gesloten overeenkomsten moeten de algemene voorwaarden vóór of bij het sluiten zo ter beschikking worden gesteld dat de consument ze kan opslaan en later kan raadplegen. Gebeurt dat niet, dan zijn de bedingen vernietigbaar.

**Bron:** Art. 6:233 sub b jo. art. 6:234 BW

### 18. Het bedrag met btw erbij vermeld: totaal EUR 49,00, waarvan 21% btw, plus het bedrag exclusief btw. Bij deelname aan de kleineondernemersregeling juist géén btw-bedrag, maar de mededeling dat op grond van de KOR geen btw in rekening is gebracht.

**Waarom:** Een volledige factuur is bij B2C niet verplicht (de factuurplicht geldt alleen richting ondernemers en rechtspersonen-niet-ondernemers), maar de totaalprijs inclusief belastingen moet worden bevestigd, de omzet moet uit de administratie blijken, en wie btw vermeldt kan die verschuldigd worden. Voor Beleggingscollege komt daar een eigen toezegging bij: de algemene voorwaarden beloven al een factuur met de btw apart.

**Bron:** Art. 34c Wet OB 1968 (factuurplicht, niet van toepassing bij B2C); art. 6:230m lid 1 sub e BW; administratie- en bewaarplicht art. 34 Wet OB 1968 en art. 52 AWR; art. 37 Wet OB 1968 (ten onrechte vermelde btw); eigen toezegging in src/app/voorwaarden/page.tsx

### 19. Alleen als het van toepassing is: de buitengerechtelijke klachten- en geschilbeslechtingsprocedure waaraan de verkoper is onderworpen, en hoe je daar toegang toe krijgt. Beleggingscollege is nergens bij aangesloten, dus dit is nu niet verplicht — maar het wordt het meteen zodra er een keurmerk of geschillencommissie in beeld komt.

**Waarom:** De informatieplicht geldt uitdrukkelijk 'indien van toepassing'. Er bestaat geen algemene plicht om je bij een geschillencommissie aan te sluiten.

**Bron:** Art. 6:230m lid 1 sub t BW; art. 6:230b BW

### 20. Bij het abonnement College+ (nog niet live): de duur van de overeenkomst, de voorwaarden voor opzegging bij een overeenkomst voor onbepaalde tijd of automatische verlenging, en de minimumduur van de verplichtingen.

**Waarom:** Verplichte informatie zodra er een doorlopende overeenkomst is. Niet van toepassing op de losse cursus, wel zodra het abonnement bestaat.

**Bron:** Art. 6:230m lid 1 sub o en sub p BW

## Valkuilen

- De grootste: denken dat het vinkje bij het afrekenen het herroepingsrecht laat vervallen. Dat doet het niet. Art. 6:230p onderdeel g BW stelt drie cumulatieve eisen, en de derde is dat de handelaar de bevestiging van art. 6:230v lid 7 BW daadwerkelijk heeft verstrekt. Een orderbevestiging die niet aankomt is dus geen servicefoutje maar een juridisch gat: de klant kan alsnog ontbinden en is op grond van art. 6:230s BW geen kosten verschuldigd, terwijl hij de cursus al heeft gezien.

- Aansluitend, en concreet in deze codebase: in C:\Users\jason\CodingProjects\Beleggingscollege\src\lib\orderbevestiging.ts wordt een mislukte verzending alleen naar de console gelogd. Er is geen herkansing, geen wachtrij en geen signaal naar Jason. Precies het scenario waarin het herroepingsrecht blijft bestaan verloopt nu dus stil.

- Verplichte informatie achter een link zetten. De huidige mail verwijst voor voorwaarden, herroepingsrecht en privacy naar de site. HvJ EU 5 juli 2012, C-49/11 (Content Services) heeft uitgemaakt dat informatie op een website waarnaar een hyperlink verwijst niet is 'verstrekt' op een duurzame gegevensdrager. De tekst moet mee in de mail; de links mogen erbij blijven staan als extra.

- Timing. Art. 6:230v lid 7 BW zegt 'voordat de dienst wordt uitgevoerd'. Bij ons gaat de cursus open op het moment dat de Mollie-webhook binnenkomt en vertrekt de mail daarna. Strikt gelezen wringt dat. Er is voor zover ik kon nagaan geen rechtspraak die dit voor digitale inhoud met directe toegang heeft beslecht. Praktische afdekking: de mail onmiddellijk versturen en het verzendmoment vastleggen naast withdrawalWaivedAt.

- Onzeker en materieel: is deze cursus 'digitale inhoud' of een 'dienst'? Bij digitale inhoud vervalt het ontbindingsrecht zodra de nakoming begint (art. 6:230p onderdeel g BW). Bij een dienst vervalt het pas ná volledige nakoming, en dan met een ándere afstandsverklaring (art. 6:230p onderdeel d BW, plus de eisen van art. 6:230v lid 8 BW). Een cursus met levenslange toegang tot een platform heeft trekken van allebei. Ik heb hier geen beslissende bron voor gevonden. Veiligste route tot een jurist ernaar kijkt: het vinkje en de bevestiging zo formuleren dat ze allebei standhouden — dus zowel het uitdrukkelijke verzoek om direct te beginnen als de erkenning van het rechtsverlies, en geen formulering die alleen op één van beide regimes past.

- Vestigingsadres en btw-nummer staan nu op null in src/lib/mailteksten.ts. Allebei verplicht (art. 3:15d lid 1 sub a en f BW, art. 6:230m lid 1 sub c BW). Bij een eenmanszaak aan huis is het huisadres het vestigingsadres; dat is een privacyafweging, geen vrijstelling. Een postbus alleen voldoet niet als geografisch adres.

- De btw-behandeling staat hardgecodeerd op 21% met KOR = false. Klopt dat niet, dan staat er een onjuist btw-bedrag in een mail die de klant bewaart. Bij deelname aan de kleineondernemersregeling mag er helemaal geen btw-bedrag in staan. Dit moet vóór de eerste echte verkoop bij de boekhouder langs — hetzelfde moment waarop de Mollie-testkey wordt vervangen.

- Reken niet op de onderwijsvrijstelling van art. 11 lid 1 onderdeel o Wet OB 1968. Voor elektronisch of online onderwijs eist de Belastingdienst dat er interactie mogelijk is tussen docent en cursist, vóór, tijdens of na de cursus. Zelfstudie met alleen video's, modules en downloads is dat niet. Een CRKBO-registratie helpt alleen bij beroepsonderwijs en neemt die interactie-eis niet weg. Ga uit van 21% tot een adviseur schriftelijk iets anders zegt.

- Zet géén link naar het Europese ODR-platform in de mail, hoe vaak Nederlandse voorbeeldteksten en keurmerken dat ook nog voorschrijven. Verordening (EU) 2024/3228 heeft Verordening (EU) nr. 524/2013 ingetrokken; het platform is per 20 juli 2025 gestopt. Het is nu een dode link en geen verplichting meer.

- De algemene voorwaarden op /voorwaarden beloven al: 'Je ontvangt per betaling een factuur waarop de btw apart staat.' Wettelijk hoeft dat niet bij B2C, maar het is een eigen toezegging die bindt. Kies: of de bon toont de btw apart, of die zin gaat uit de voorwaarden. Nu staat er een belofte die het product niet nakomt — precies wat dit merk zegt niet te doen.

- Let op de bestelknop, niet alleen op de mail. Art. 6:230v lid 3 BW eist dat de knop ondubbelzinnig duidelijk maakt dat er een betalingsverplichting ontstaat; 'bestellen' of 'plaats bestelling' is volgens de Hoge Raad niet genoeg. De huidige knop zegt 'Afrekenen — EUR 49,00'. Voldoet die niet, dan is de consument niet aan de overeenkomst gebonden en heeft de perfecte orderbevestiging weinig waarde meer.

- GOED GEBRUIK, niet verplicht: het ordernummer, een expliciete klachtroute met reactietermijn, en een verwijzing naar ACM ConsuWijzer (en voor kopers uit andere EU-landen het Europees Consumenten Centrum). Prettig, professioneel, en het houdt geschillen uit de formele sfeer — maar geen wettelijke eis zolang je bij geen enkele geschilleninstantie bent aangesloten.

- GOED GEBRUIK, niet verplicht: de zin dat Beleggingscollege onderwijs geeft en geen persoonlijk beleggingsadvies, en de opmerking dat beleggen risico's meebrengt. Voor een opleider zonder Wft-vergunning is geen van beide wettelijk voorgeschreven in een orderbevestiging. Ze horen er wel in, omdat ze afstand houden tot het vergunningplichtige domein en omdat ze zijn wat het merk belooft.

- Verkoop je aan consumenten in andere EU-landen, dan verschuift de btw naar het land van de afnemer zodra de EU-omzet boven EUR 10.000 per jaar uitkomt, met aangifte via de One Stop Shop. Onder die drempel blijft Nederlandse btw gelden. De mail vermeldt nu onvoorwaardelijk 21% Nederlandse btw; dat wordt onjuist zodra de drempel wordt gepasseerd. De grondslag ligt in de Wet OB 1968 ter implementatie van art. 58 Btw-richtlijn 2006/112/EG — het exacte Nederlandse artikelnummer heb ik niet geverifieerd en moet je niet uit mijn mond overnemen.

- Twee bronvermeldingen waar ik minder zeker over ben en die je moet natrekken voordat je ze in een juridische tekst zet: het exacte Staatsbladnummer van het Nederlandse besluit dat de modelinstructie en het modelformulier voor herroeping vaststelt (de inhoud staat hoe dan ook vast in bijlage I deel A en B bij Richtlijn 2011/83/EU), en de precieze reikwijdte van art. 37 Wet OB 1968 bij bonnen aan particuliere eindverbruikers — er is jurisprudentie die de werking daar beperkt, maar daar wil je niet op leunen.

