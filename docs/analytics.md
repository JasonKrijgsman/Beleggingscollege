# Bezoekmeting — Umami, zelf gehost

## Waar dit halverwege bleef staan (3 augustus 2026, avond)

De opzet is samen met Jason begonnen en **niet afgemaakt**. Dit is het punt
waarop het stopte; werk deze lijst bij als je verder gaat.

| Stap | Stand |
|---|---|
| Neon-database `umami` op branch `main` | **klaar** — eigenaar `neondb_owner` |
| Vercel-project `umami` (kloon van `umami-software/umami`) | **klaar** — repo `JasonKrijgsman/umami`, deploy geslaagd |
| `DATABASE_URL` (direct, niet-pooled) + `APP_SECRET` | **klaar** — build meldde "Database version check successful" |
| `stats.beleggingscollege.com` aan het project hangen | **bezig** — dialoog stond open, DNS nog niet gezet |
| CNAME `stats` in Cloudflare, **grijze wolk** | **nog niet** |
| Wachtwoord van `admin` wijzigen | **nog niet** — staat nog op `admin`/`umami` |
| Website toevoegen in Umami, website-id kopiëren | **nog niet** |
| `NEXT_PUBLIC_UMAMI_URL` + `..._WEBSITE_ID` in het site-project | **nog niet** — daarom meet de site nog niets |

Zolang die laatste twee variabelen leeg zijn, laadt de site geen script en gaat
er geen enkel verzoek uit. Dat is de bedoelde toestand, niet een storing.

**Geverifieerd onderweg, niet aannemen dat het anders is:** Vercels Standard
Protection zet de gegenereerde `*.vercel.app`-adressen achter SSO, maar
custom-productiedomeinen níét. Dat is nagemeten aan het bestaande project
(`beleggingscollege-visual-future.vercel.app` → 302 naar Vercel-login,
`beleggingscollege.com` → 200). `stats.beleggingscollege.com` wordt dus vanzelf
publiek zodra de DNS klopt — controleer dat wel, want als het mis is, krijgt
élke bezoeker een redirect naar een inlogpagina in plaats van het telscript.

## Dit is een kopie, geen fork

Vercels "clone" maakt een **nieuwe repo zonder verband met de bron**: er staat
geen "forked from umami-software/umami" boven, en GitHub biedt geen
"Sync fork"-knop. Over een jaar ziet `JasonKrijgsman/umami` eruit als eigen werk.
Dat is precies wanneer je een beveiligingsfix wilt binnenhalen. Koppel daarom
eenmalig de bron als extra remote:

```bash
git clone https://github.com/JasonKrijgsman/umami && cd umami
git remote add upstream https://github.com/umami-software/umami
git fetch upstream
git merge upstream/master   # of: git log upstream/master --oneline om eerst te kijken
git push                    # Vercel deployt de nieuwe versie zelf
```

Kijk vóór het mergen of Umami een migratie meestuurt: die draaien bij de build
tegen de productiedatabase en zijn niet terug te draaien.

---

Zolang `NEXT_PUBLIC_UMAMI_URL` en `NEXT_PUBLIC_UMAMI_WEBSITE_ID` niet allebei
ingevuld zijn, laadt de site geen script en gaat er geen enkel verzoek uit.

## Waarom dit er is

Er was tot nu toe nul meting. Dat was goed voor de privacy en het is de reden
dat er geen cookiebanner staat — maar het betekende ook dat we op het punt van
verkopen stonden zonder te weten hoeveel mensen de gratis cursus starten, waar
ze afhaken, of hoeveel bezoekers een betaalde cursuspagina überhaupt bereiken.
Een trechter die je niet ziet, kun je niet verbeteren.

## Waarom niet op veggie

De eerste ingeving was: op de eigen server. Dat kan niet.
`*.jasonkrijgsman.com` wijst naar `192.168.2.15`, een privéadres — de hele
homelab is bewust niet vanaf internet bereikbaar. Een tellerscript daarvandaan
laden werkt dus voor geen enkele bezoeker. Het alternatief (Cloudflare Tunnel)
is technisch prima, maar zet de thuisverbinding in het pad van een commerciële
site, en dat is precies de afweging die in `CLAUDE.md` al is gemaakt voor de
database: de winkel mag niet afhangen van een aansluiting thuis.

## Waarom Umami en geen kant-en-klare dienst

Dit merk verkoopt zichzelf als de eerlijke tegenhanger van partijen die je
volgen. Google Analytics erin hangen zou die belofte breken. Bij een gehoste
dienst (Plausible Cloud en dergelijke) komt er een verwerker bij en verhuizen
bezoekgegevens naar een derde. Umami op onze eigen omgeving betekent: geen
extra partij in de privacyverklaring, de cijfers in onze eigen database, en
een verhaal dat klopt met de rest van de site.

## Wat er gemeten wordt

Paginaweergaven, verwijzende site, land, browser en apparaatsoort. Geen
cookies, niets naar de opslag van de browser, geen profielen, geen tracking
over andere sites heen. Unieke bezoekers worden per dag geteld via een hash van
IP + user-agent + website-id die de volgende dag niet meer klopt; het IP-adres
zelf wordt niet bewaard. `data-do-not-track` staat aan, dus wie Do Not Track
aan heeft staan wordt niet geteld.

Dat is de onderbouwing voor "geen toestemmingsbanner" onder artikel 11.7a
Telecommunicatiewet. **Let op:** dat oordeel is van ons, niet van een jurist.
De juridische toetsing die al openstaat voor `/privacy`, `/voorwaarden` en
`/herroepingsrecht` (zie `docs/openstaand.md`) hoort hier ook overheen te gaan.

## Opzetten — wat Jason zelf moet doen

Vercel gebruikt wachtwoordloos inloggen met passkeys en Neon hangt aan diezelfde
sessie, dus dit deel kan een agent niet voor je doen.

1. **Neon-database.** Maak in het bestaande Neon-project een nieuwe database
   (of een apart project) voor Umami, regio Frankfurt. **Niet dezelfde database
   als de site**: Umami draait zijn eigen migraties en je wilt zijn tabellen
   niet naast `purchases` en `lesson_progress` hebben staan.
2. **Vercel-project.** Nieuw project in team "Visual Future", geïmporteerd van
   `github.com/umami-software/umami`, branch `master`. Framework Next.js;
   Umami's eigen `vercel.json` regelt de rest.
3. **Omgevingsvariabelen in dat nieuwe project:**
   - `DATABASE_URL` — de **directe** (niet-pooled) Neon-string uit stap 1.
     Umami draait migraties bij het opstarten en die gaan niet goed over een
     pooler.
   - `APP_SECRET` — willekeurig, bijv. `npx auth secret`.
4. **Domein.** Koppel `stats.beleggingscollege.com` aan dat project. DNS bij
   Cloudflare: CNAME `stats` → `cname.vercel-dns.com`, **DNS only (grijze
   wolk)** — net als het hoofddomein.
5. **Eerste login.** Umami start met `admin` / `umami`. **Wijzig dat wachtwoord
   meteen**; het paneel staat op een publiek adres.
6. **Website toevoegen** in Umami: naam "Beleggingscollege", domein
   `beleggingscollege.com`. Kopieer de **Website ID** die je dan krijgt.
7. **Terug in het site-project** (`beleggingscollege`), onder Production én
   Preview:
   - `NEXT_PUBLIC_UMAMI_URL` = `https://stats.beleggingscollege.com`
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` = de id uit stap 6

   Deze twee zijn **niet gevoelig** — ze staan in de browserbundel. Markeer ze
   dus niet als "Sensitive"; dat is schijnveiligheid, net als bij
   `NEXT_PUBLIC_SITE_URL`.
8. **Opnieuw deployen** en controleren:

```bash
curl -s https://beleggingscollege.com/ | grep -o 'data-website-id="[^"]*"'
```

Komt daar een id uit, dan meet hij. Zie je niets, dan staat een van de twee
variabelen niet goed — de code faalt bewust stil in plaats van half.

## Waar je op moet letten

- **Preview-deploys tellen niet mee.** `data-domains` staat op de host uit
  `NEXT_PUBLIC_SITE_URL`, dus alleen het echte domein schrijft mee. Vul de
  variabelen lokaal niet in, anders meet je jezelf.
- **Bij de verhuizing naar de `.nl`:** `data-domains` volgt
  `NEXT_PUBLIC_SITE_URL` vanzelf mee, dus in de code hoeft niets. Drie dingen
  wél:
  1. Hang `stats.beleggingscollege.nl` aan hetzelfde Vercel-project en **laat de
     `.com` erop staan**. Umami kan het niet schelen op welke naam hij wordt
     aangesproken, en zo breekt er halverwege niets.
  2. **Werk in Umami het domein van de bestaande website bíj — maak er geen
     nieuwe aan.** Een nieuwe website krijgt een nieuw id en dan splitst je
     historie in tweeën, zonder manier om ze weer samen te voegen.
  3. Zet tijdens de cutover `NEXT_PUBLIC_UMAMI_DOMAINS` op beide namen. Zolang
     `.com` en `.nl` allebei de site serveren telt anders één van de twee niet
     mee, en dat gaat stil: je ziet de cijfers zakken en concludeert dat de
     verhuizing bezoekers heeft gekost. Weghalen zodra de redirect staat.
- **Neon's gratis laag schaalt naar nul.** Het eerste verzoek na stilte wekt de
  database; een tellerverzoek kan dan een seconde duren. Dat gebeurt
  asynchroon na het laden van de pagina, dus de bezoeker merkt er niets van.
- **Umami is een tweede Vercel-project.** Op Hobby mag dat niet commercieel;
  hetzelfde Pro-abonnement dat de winkel toch al nodig heeft
  (`docs/openstaand.md` hoofdstuk 2) dekt beide.
- **Valt Umami om, dan valt de site niet om.** Het script laadt
  `afterInteractive` en faalt stil.

## Wat dit nog niet doet

Alleen paginaweergaven. De trechter die je écht wilt zien — hoeveel mensen les
1 van de gratis cursus afronden, hoeveel er op een betaalde cursuspagina komen,
hoeveel het vinkje aanzetten en dan tóch afhaken — vraagt om expliciete
gebeurtenissen (`umami.track(...)`) op die punten. Dat is bewust nog niet
gebouwd: eerst zien of de basis klopt, dan pas meten wat je nog niet weet.
