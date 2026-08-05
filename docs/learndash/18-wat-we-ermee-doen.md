# 18 — Wat we ermee doen: de afweging over alle bronnen heen

> Geschreven 5 aug 2026, ná hoofdstuk 1 t/m 17. Dit document doet twee dingen: het weegt **wat de drie onderzoekssporen (Claude, Codex, Cursor) opleverden** tegen elkaar, en het zet alles wat we zouden kúnnen overnemen in **vier bakjes** — van "gewoon doen" tot "niet aan beginnen".
>
> **Dit is een advies, geen besluit en geen backlog.** Wat Jason overneemt hoort daarna in `docs/openstaand.md` of `docs/ideeen.md` te staan; dit hoofdstuk wordt niet bijgehouden.

---

## Deel 1 — Wat de drie sporen opleverden

Drie leveranciers hebben naar hetzelfde materiaal gekeken. Dat was geen verspilling: ze vonden aantoonbaar verschillende dingen, en één van de drie haalde een conclusie van de andere onderuit.

| Spoor | Wat het deed | De unieke opbrengst |
|---|---|---|
| **Claude** (h. 1–15) | Documentatie (1–8), broncode 4.6.0 (9–11), 4.6.0 vs 5.1.8 (12), add-ons (13–14), Uncanny Toolkit (15) | De **ondertekende quizscores** (11) — de vondst die een bekend gat in ons eigen platform oplost. En de **referentieteller op toegangsrechten** (13), die een stille bug in College+ voorkomt vóórdat die bestaat. Plus het inzicht uit 15 dat vijftig modules lang niemand iets aan de didactiek bouwt. |
| **Codex** (h. 16) | ProPanel, Course Grid, Course Reviews, het Commerce-subsysteem in 5.1.8 | Het **eerlijke beeld van "rapportage"**: geen modern dashboard maar één handgeschreven query met alleen enkelkolomse indexen, een synchrone bulkmail die de hele selectie in het geheugen zet, en dáárnaast een CSV-export die juist voorbeeldig is gebouwd. Zonder dit spoor hadden we ProPanel als na te volgen voorbeeld genoteerd in plaats van als gemengd bewijs. |
| **Cursor** (h. 17) | Resterende add-ons + adversariële hercontrole van zes uitspraken | **De correctie.** Vijf claims bevestigd, één onderuit: onze webhookregel is *gelijkwaardig* aan LearnDash, niet strenger. En de vondst dat hun contentbescherming via een filter uit te zetten is — wat een ándere claim van ons juist sterker maakte. |

**De meta-les, en die is de moeite waard los van LearnDash:** de verificatieronde leverde niets nieuws op en was toch het meest waardevolle deel. Hij haalde één zelffelicitatie weg die ik twee keer had uitgesproken en die anders in een aanbeveling was beland. Een tweede leverancier inzetten om te *bevestigen* is zonde; inzetten om te *weerleggen* verdient zichzelf terug.

**Waar de sporen elkaar tegenspraken, en wie won:**

- *"Geen enkele gateway hercontroleert bedrag en valuta"* (Claude, h. 10) tegenover *"de PayPal-keten doet dat sinds 4.20.1 wél"* (Cursor, h. 17). **Cursor had gelijk**; h. 8, 10 en 12 zijn bijgesteld. Oorzaak van de fout: een conclusie uit de 2023-code doorgetrokken naar 2026 zonder hem opnieuw te toetsen.
- *"Certificaten draaien op TCPDF"* (Claude, h. 5, uit documentatie) tegenover *"de Certificate Builder brengt mPDF 8.2.7 mee"* (Claude, h. 14, uit code). **De code won**; h. 5 is gecorrigeerd. Zelfde patroon: documentatie beschrijft de kern, de add-on doet iets anders.

Beide fouten zaten in dezelfde richting: **een oude of algemene bron doortrekken naar een nieuwe of specifieke situatie.** Dat is het foutpatroon om te onthouden.

---

## Deel 2 — De vier bakjes

Gerangschikt op **(waarde voor ons) ÷ (bouwkosten)**, met per punt de bron. "Waarde" telt hier zwaarder als het iets **repareert** dan als het iets **toevoegt**.

### 🟢 Geen twijfel — gewoon doen

Vijf dingen die goedkoop zijn *en* iets dichten dat nu kapot, ontbrekend of onbeantwoordbaar is.

**1. Een `bron` op `entitlements`, vóórdat College+ bestaat.** (h. 13)
Alle vier de serieuze LearnDash-integraties houden bij *waaróm* iemand toegang heeft, en trekken pas in als de laatste reden wegvalt. Wij hebben één rij per gebruiker per cursus. Zodra het abonnement live is, verliest wie een cursus los kocht én daarna abonneert bij opzeggen die apart betaalde cursus. Stil, geen foutmelding, pas zichtbaar als de klant mailt. Dit is geen feature maar een datamodelfout die we nu nog gratis kunnen voorkomen. **Doe dit als eerste, en in elk geval vóór de eerste abonnee.**

**2. Quizscore die de server zelf vaststelt.** (h. 11, geverifieerd in h. 17)
`docs/openstaand.md` §6: wie `correct = total` post, pakt de quizbonus en de foutloos-badge zonder één vraag te beantwoorden. Dat maakt badges en certificaten waardeloos. LearnDash lost precies dit op zonder antwoordgeschiedenis te bewaren. **En bij ons is het goedkoper dan bij hen**: onze vragen staan al server-side in `src/content` achter `server-only`. De client stuurt de gekozen indexen, de server kijkt na en vergeet ze. Geen HMAC-machinerie nodig, geen opslag, geen privacyconcessie.

**3. "Ga verder waar je was".** (h. 4, h. 15)
De data hebben we al in `lesson_progress`. Het is een berekening, geen nieuwe kolom — en Uncanny's fout is hier leerzaam: zij schrijven bij élke paginaweergave een aanwijzer weg in usermeta en hebben drie invalidatiehaken nodig omdat die aanwijzer los staat van de voortgang. Bereken "eerste niet-afgeronde les" en klaar. Neem hun andere les wél over: sla stappen over die de gebruiker niet mag zien.

**4. Het certificaat in de voltooiingsmail.** (h. 5, h. 14)
Mail werkt sinds vandaag. LearnDash-core stuurt niet eens een voltooiingsmail — dat gat repareert hun eigen add-on. Wij weten in `verwerkLes()` precies wanneer een cursus compleet wordt. Eén mail, met de link naar het certificaat: het goedkoopste moment van trots dat we te vergeven hebben.

**5. Voortgang handmatig kunnen corrigeren in `/beheer`.** (h. 6, h. 15)
Bij LearnDash is dit dagelijkse supportrealiteit, en Uncanny's gemeten inventaris bevestigt het. Het eerste "mijn les staat niet op afgerond"-bericht kunnen we vandaag niet beantwoorden. Eén stap aan/uit per gebruiker is genoeg; een volledige reset hoeft niet.

### 🔵 Sterk aan te raden — als er tijd is, dit eerst

**6. Een verzendwachtrij met een tijdstip, plus de inactiviteitsmail.** (h. 14)
De vorm overnemen (een rij per geplande mail, met **id's in plaats van uitgeschreven tekst**, zodat een latere tekstcorrectie ook wachtende mail haalt), de verwerking niet (zie 🔴). Hergebruik onze atomaire claim uit de orderbevestiging voor ontdubbeling. En neem hun ene echte inzicht mee: meet inactiviteit op **echte activiteit**, niet op "laatste login" — een Remember-me-sessie maakt dat getal waardeloos. Wij hebben die activiteit al in `user_stats`.

**7. Een verificatiepagina voor certificaten.** (h. 5)
Geen enkele LearnDash-versie heeft dit in de kern, en het is precies wat de markt eromheen bouwde (QR, publieke verificatie, LinkedIn-deelknop). Bij ons past het bovendien bij het merk: een verifieerbaar certificaat is het tegendeel van een borstklopperij-PDF.

**8. Eén gratis proefles per betaalde cursus.** (h. 4)
LearnDash markeert dit per les (`Sample Lesson`). Wij lossen "proeven" nu op met de gratis cursus, maar een echte les uit de bétaalde cursus laat de kwaliteit zien in plaats van het curriculum. Let op de SEO-huisregels: sitemap en slotscherm moeten meebewegen.

**9. Feedback per scoreband na de quiz.** (h. 2)
Hun `Result Messages` kent tot 100 banden; wij hebben er drie nodig. "Onder de 50%: kijk les 3 nog eens" is meer waard dan een kaal cijfer, en het kan volledig client-side in de bestaande QuizBlock.

**10. Een "mijn certificaten"-overzicht.** (h. 5, h. 15)
Verdiend, en nu nergens terug te vinden behalve via de cursus zelf.

### 🟡 Kan, maar het hangt ervan af

**11. Een beheerrapportage.** (h. 6, h. 16) — De minimale set is klein (tellers, activiteitenfeed, filter, voortgangsbalk) en dekt 80%. Maar Codex' analyse temperde het enthousiasme: hun uitvoering rust op één handgeschreven query met alleen enkelkolomse indexen onder een filter die op vier kolommen tegelijk zoekt. Bouwen we dit, dan **kopiëren we de vorm en niet de query**. En eerlijk: met de huidige aantallen klanten is een SQL-query in een terminal goedkoper dan een dashboard. Doen zodra het aantal cursisten je verrast, niet eerder.
**11b. Wél alvast overnemen als we ooit exporteren:** hun CSV-export is juist voorbeeldig — een achtergrondtaak die in blokken van 100 naar een bestand schrijft en pas aan het eind streamt. Dat is de vorm om te kopiëren, niet de bulkmail ernaast.

**12. Geanonimiseerde statistiek per vraag.** (h. 2) — "Welke vraag begrijpt niemand?" is het waardevolste dat we structureel missen, en het vertelt je welke *les* niet werkt. Het kan privacyvriendelijk (een teller per vraag-id, geen antwoord per gebruiker), maar het verruimt wel ons principe dat antwoorden nooit meereizen. Bewuste keuze van Jason, geen sluiproute.

**13. Een aparte "met lof"-drempel op het certificaat.** (h. 2) — Slagen en excelleren scheiden is elegant en goedkoop. Alleen zinvol als we het certificaat zwaarder willen maken; anders is het complexiteit zonder vraag.

**14. Kortingscodes.** (h. 3) — De les is vooral *hoe*: de korting is een gecontroleerde transformatie op de catalogusprijs, nooit een prijs uit het verzoek. Bouwen zodra er een campagne is, niet ervoor. Hun beperking (geen coupons op abonnementen) is een waarschuwing voor een College+-introductieactie.

**15. De schaalvraag (`Assessment`) als vraagtype.** (h. 2) — Precies wat de geplande risicoprofiel-tool nodig heeft: geen goed/fout maar een positie op een schaal. Bouw het samen met die tool, niet los.

**16. B2B: groepen met zetels.** (h. 3, h. 15) — Uncanny's betaalde plugin bestaat voor ~40% uit groepsmodules, dus de vraag is echt. Maar het is een compleet tweede verkoopmodel (zetels, een klant-beheerder, gedelegeerd beheer). **Niet bouwen tot een werkgever mailt** — dán is dit het referentieontwerp.

**17. Cursusreviews.** (h. 16) — Zit inmiddels in hun doos. Bij ons botst het op een productvereiste: geen verzonnen social proof, en echte reviews vragen volume dat er nog niet is. Pas relevant na tientallen klanten.

### 🔴 Niet aan beginnen

**18. Harde poorten.** (h. 2, h. 4) — Lineaire progressie, een slagingsdrempel die de weg blokkeert, minimumtijd per les. Wij zijn aanmoediger, geen poortwachter; dat is merkidentiteit (reassurance-first), geen ontbrekende feature.

**19. Punten als toegangsmunt.** (h. 5) — XP blijft beloning. Zodra XP een slot op content wordt, wordt elke latere wijziging aan XP een toegangsincident.

**20. Een verplichte "markeer als voltooid"-knop als enige weg vooruit.** (h. 15) — De duurste ontwerpfout in dat hele ecosysteem: de grootste betaalde categorie van de Uncanny Toolkit is **zeven keer "autocomplete"**, met als motief dat cursisten vastlopen op een vergeten knop. Wij hebben dit niet. Introduceer het niet.

**21. Hun notificatieverwerking.** (h. 14) — Eén cron-event voor alleen de eerstvolgende rij (tien mails = tien runs), een mislukte verzending die nooit opnieuw wordt geprobeerd, ontdubbeling via een usermeta-vlag plus een `REGEXP` over een geserialiseerde kolom zonder unique constraint, en een "stuur maar één keer"-rem die een sleutel leest die nergens geschreven wordt. De tabelvorm is goed; dit eromheen niet.

**22. Synchroon een selectie mailen vanuit een beheerscherm.** (h. 16) — ProPanel materialiseert de complete selectie in PHP-geheugen binnen één admin-ajax-request, zonder wachtrij en zonder retry, en een lege selectie betekent stilzwijgend "iedereen". Als wij ooit een groep aanschrijven: via de wachtrij uit punt 6.

**23. Een aanwijzer voor "waar was ik" als opgeslagen kolom.** (h. 15) — Zie punt 3. Afgeleide staat die je opslaat, moet je invalideren.

**24. Inleveropdrachten met verplichte beoordeling.** (h. 4) — Wij beloven geen nakijkcapaciteit (zelfde redenering als bij de redactionele lesvragen), en bij hen blokkeert een niet-nagekeken opdracht de hele cursus.

**25. Forum of communityplatform.** (h. 5) — Al afgevallen in `docs/ideeen.md`; hun bbPress/BuddyBoss-stack bevestigt hoe zwaar dat pad is. Onze redactionele vragen-per-les zijn bewust het tegenovergestelde.

**26. SCORM/xAPI.** (h. 6) — Corporate-erfenis zonder betekenis voor consumenten.

**27. Drip-content.** (h. 4) — Alles staat direct open na aankoop en dat is een verkoopargument. Alleen heroverwegen bij een cohortproduct — en dan is hun model (releaseschema op de les, mail bij vrijgave, slotje mét datum) de referentie.

**28. Een tweede toegangscontrole, waar dan ook.** (h. 10, h. 17) — Hun bescherming hangt aan een `the_content`-filter die via `learndash_template_preprocess_filter` is **uit te zetten** — en hun eigen Elementor-add-on doet dat. Eén poort (`heeftToegangTot()`), en een grens die de build afdwingt in plaats van een haak die beleefd opzij kan.

**29. Een add-on- of plugin-architectuur voor onszelf.** (h. 7, h. 9) — Het houdt de kern klein en verplaatst de last naar de klant; bij hen werd het bovendien prijstier-lokaas. Onze modulegrenzen doen hetzelfde zonder de versnippering.

**30. Inlog- en registratiemachinerie.** (h. 15) — Hun grootste gratis module is een inlogformulier van 4.140 regels met 66 instellingen. Google OAuth heeft die hele categorie voor ons weggeontworpen: geen wachtwoorden, dus geen herstel, CAPTCHA, 2FA of brute-force-bescherming. Niet terugbouwen.

---

## Als je maar drie dingen doet

1. **De `bron` op `entitlements`** — vóór College+, want daarna is het een migratie mét klanten (punt 1).
2. **De serverzijdige quizscore** — goedkoop bij ons, en zonder dat zijn badges en certificaten decoratie (punt 2).
3. **De voltooiingsmail met certificaatlink** — het enige punt in deze lijst dat een klant een goed gevoel geeft in plaats van een probleem oplost (punt 4).

De eerste twee repareren iets, de derde verdient iets terug. Alle drie kunnen deze maand.
