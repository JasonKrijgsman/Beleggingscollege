# Implementatiegids: accounts, database en betalen

> Onderzoek uitgevoerd op 2 augustus 2026, geverifieerd tegen de npm-registry en de
> actuele documentatie — niet uit geheugen. Versienummers zijn hard gecontroleerd.
> Lees dit VOORDAT je aan auth, database of checkout begint.

--- AUTH ---
# Auth.js (NextAuth) v5 — implementatiegids voor Beleggingscollege

Alle versies hieronder zijn geverifieerd tegen de npm-registry op **2 augustus 2026** en tegen de daadwerkelijk geïnstalleerde broncode in een wegwerpproject (`.../scratchpad/authprobe`), niet uit geheugen.

## 0. Statusmelding vooraf (belangrijk)

**Auth.js v5 is nog steeds beta.** De `beta` dist-tag van `next-auth` staat op **`5.0.0-beta.32`** (gepubliceerd 2026-07-20). De `latest` tag is nog altijd **`4.24.15`** (v4). Er is in de ~2,5 jaar sinds beta.1 geen stabiele 5.0.0 verschenen; het releasetempo is ongeveer 2-4 betas per jaar. Dat is een reëel risico voor een webshop: pin een exacte versie, geen `^`.

Geverifieerde versies:

| Pakket | Versie | Gepubliceerd |
|---|---|---|
| `next-auth` (tag `beta`) | `5.0.0-beta.32` | 2026-07-20 |
| `@auth/core` (transitief, gepind) | `0.41.3` | 2026-07-20 |
| `@auth/prisma-adapter` | `2.11.3` | 2026-07-20 |
| `@auth/drizzle-adapter` | `1.11.3` | 2026-07-20 |
| `@node-rs/argon2` | `2.0.2` | **2024-12-05** (20 maanden oud) |
| `argon2` (node-argon2) | `0.45.1` | 2026-07-21 |
| `bcryptjs` | `3.0.3` | 2025-11-02 |
| `next` (latest) | `16.2.12` | project draait `^15.4.0`, laatste 15.x = `15.5.22` |

`next-auth@5.0.0-beta.32` peerDependencies: `next: ^14.0.0-0 || ^15.0.0 || ^16.0.0`, `react: ^18.2.0 || ^19.0.0` — Next 15.4 is dus prima ondersteund.

**Next 15 vs 16:** de Auth.js-docs zijn inmiddels herschreven naar Next.js 16 en tonen overal `proxy.ts`. Voor dit project (Next 15) is dat **`src/middleware.ts`** met `export { auth as middleware }`. Docs: "As of Next.js 16, middleware.ts has been renamed to proxy.ts. If you are using an older version of Next.js, use middleware.ts."

---

## 1. Installatie en exacte bestandsstructuur

```bash
npm install next-auth@5.0.0-beta.32 @auth/prisma-adapter@2.11.3
npx auth secret        # genereert AUTH_SECRET en schrijft die in .env.local
```

`npx auth secret` is de gedocumenteerde weg; het alternatief is `openssl rand -base64 33` (min. 32 tekens).

Bestandsstructuur, aangepast aan dit project (`paths: { "@/*": ["./src/*"] }`, dus alles onder `src/`):

```
src/
  auth.config.ts                        # edge-veilig: providers zonder DB/argon2
  auth.ts                               # volledige instance: adapter + Credentials
  middleware.ts                         # Next 15 (in Next 16 zou dit proxy.ts heten)
  types/next-auth.d.ts                  # module augmentation
  lib/prisma.ts                         # singleton PrismaClient
  app/api/auth/[...nextauth]/route.ts   # route handler
```

**Waarom de gesplitste config?** Middleware draait op de Edge-runtime; Prisma en `@node-rs/argon2` draaien daar niet. Auth.js documenteert hiervoor expliciet het split-config-patroon (`authjs.dev/guides/edge-compatibility`).

**`src/auth.config.ts`** — geen adapter, geen DB, geen native modules:

```ts
import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export default {
  providers: [Google],
  pages: {
    signIn: "/inloggen",
    error: "/inloggen",
  },
  callbacks: {
    authorized: async ({ auth }) => !!auth,
  },
} satisfies NextAuthConfig
```

**`src/auth.ts`** — de echte instance (zie §3 voor de Credentials-invulling):

```ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "@/auth.config"
import { wachtwoordProvider } from "@/lib/auth-credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",          // verplicht zodra Credentials meedoet — zie §4
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  providers: [...authConfig.providers, wachtwoordProvider],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
})
```

**`src/app/api/auth/[...nextauth]/route.ts`**:

```ts
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

**`src/middleware.ts`** (Next 15):

```ts
import NextAuth from "next-auth"
import authConfig from "@/auth.config"

export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: ["/leerpad/:path*", "/cursussen/:slug*/les/:path*", "/account/:path*"],
}
```

> Auth.js waarschuwt letterlijk: *"You should not rely on the proxy exclusively for authorization. Always ensure that the session is verified as close to your data fetching as possible."* Voor betaalde lesinhoud is dit geen detail — de middleware mag alleen een UX-redirect doen, de échte check hoort in de Server Component/data-laag. Dat is precies de kern van jullie probleem dat lesinhoud nu ongefilterd naar de browser gaat.

**`src/types/next-auth.d.ts`**:

```ts
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
  }
}
```

Docs: het declaratiebestand mag overal staan zolang het in `tsconfig.json` `include` valt — dat is hier het geval (`"**/*.ts"`).

---

## 2. Google OAuth

### Omgevingsvariabelen

Auth.js pikt deze automatisch op zonder ze in de config te noemen (conventie `AUTH_[PROVIDER]_ID` / `_SECRET`):

```bash
AUTH_SECRET=...            # npx auth secret
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

Daarom kan `providers: [Google]` zonder argumenten. Op Vercel hoef je **`AUTH_TRUST_HOST` en `AUTH_URL` niet te zetten**: Auth.js detecteert `VERCEL` automatisch en leidt de host af uit de request headers. `AUTH_URL` is alleen nodig bij een afwijkend basispad.

### Redirect-URI's

Formaat voor Next.js: `{origin}/api/auth/callback/google`.

Zet in Google Cloud Console **alle drie**:

| Omgeving | Authorized redirect URI |
|---|---|
| Lokaal | `http://localhost:3000/api/auth/callback/google` |
| Productie (.nl) | `https://beleggingscollege.nl/api/auth/callback/google` |
| Productie (www) | `https://www.beleggingscollege.nl/api/auth/callback/google` |

Plus als "Authorized JavaScript origin": `http://localhost:3000` en `https://beleggingscollege.nl`.

Google eist exacte match op scheme, hoofdletters én trailing slash. HTTPS is verplicht behalve voor localhost.

### Stappen in Google Cloud Console (voor Jason zelf)

De consent-screen-UI is verhuisd naar **Google Auth Platform**. Directe URL: `https://console.cloud.google.com/auth/clients`.

1. Maak of kies een project (bijv. "Beleggingscollege").
2. Ga naar **Google Auth Platform → Branding**: app-naam "Beleggingscollege", support-e-mail, homepage `https://beleggingscollege.nl`, privacy `https://beleggingscollege.nl/privacy`, voorwaarden `https://beleggingscollege.nl/voorwaarden`. Die pagina's bestaan al in de repo — Google controleert of ze bereikbaar zijn.
3. **Audience** → **External**.
4. **Data Access / Scopes**: alleen `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`. Dit zijn *non-sensitive* scopes. Google: *"If your app utilizes only non-sensitive scopes, it is not mandatory for your app to complete the app verification process."* Je hebt dus **geen volledige OAuth-verificatie** nodig; alleen als je jullie naam + logo netjes op het toestemmingsscherm wil, doorloop je de lichtere brand-verification.
5. **Clients** → **CREATE CLIENT** → type **Web application** → naam bijv. "beleggingscollege-web".
6. Vul de redirect-URI's en origins uit de tabel hierboven in → **CREATE**.
7. Kopieer client ID en secret. **Het secret is maar één keer zichtbaar.** Client ID → `AUTH_GOOGLE_ID`, secret → `AUTH_GOOGLE_SECRET`, in `.env.local` én in Vercel → Project → Settings → Environment Variables (Production + Preview).
8. Zet **Publishing status** op **In production** zodra je live gaat. In "Testing" moet elke gebruiker handmatig als testgebruiker zijn toegevoegd — een betalende klant komt er dan niet in.

> Ik kon niet met zekerheid verifiëren of Google in 2026 nog het harde limiet van 100 testgebruikers hanteert; de helppagina die ik ophaalde noemt dat cijfer niet meer. Doe de stap naar "In production" hoe dan ook vóór de eerste verkoop.

### Preview-deployments op Vercel

Elke preview krijgt een andere URL, en die kun je niet allemaal bij Google registreren. Oplossing volgens de docs: kies één stabiele deployment, zet `AUTH_REDIRECT_PROXY_URL` (bijv. `https://beleggingscollege.nl/api/auth`) identiek in preview én productie, registreer alleen die callback bij Google, en houd `AUTH_SECRET` gelijk over beide omgevingen.

---

## 3. E-mail + wachtwoord (Credentials)

### Hashing — aanbevolen parameters

OWASP Password Storage Cheat Sheet (huidige versie): volgorde **Argon2id → scrypt → bcrypt → PBKDF2**. Voor Argon2id: *"Use Argon2id with a minimum configuration of 19 MiB of memory, an iteration count of 2, and 1 degree of parallelism."* Voor bcrypt: *"Use a work factor of 10 or more and with a password limit of 72 bytes."*

Concreet advies voor dit project: **`m=19456 KiB, t=2, p=1`**.

Pakketkeuze, met eerlijke afweging:

- **`@node-rs/argon2@2.0.2`** — napi-rs prebuilt binaries, meestal het soepelst op Vercel. Maar: laatste release december 2024, ~20 maanden stil. Ik kan niet garanderen dat de prebuilds matchen met de Node-versie die Vercel in augustus 2026 draait; **test dit in een preview-deployment vóór je erop bouwt.**
- **`argon2@0.45.1`** (node-argon2) — actief onderhouden (release 21 juli 2026), maar node-gyp/prebuild-based; op serverless soms lastiger.
- **`bcryptjs@3.0.3`** — pure JavaScript, nul native dependencies, werkt gegarandeerd overal. Zwakker dan Argon2id, maar met cost ≥ 12 volstrekt acceptabel voor een cursusplatform. **Dit is de risicoloze fallback als Argon2 op Vercel stukloopt.**

### Concrete valkuil in júllie tsconfig

`tsconfig.json` heeft `"isolatedModules": true`. `@node-rs/argon2` exporteert `Algorithm` als een *ambient const enum*. Ik heb dit gecompileerd en het faalt:

```
t.ts(2,41): error TS2748: Cannot access ambient const enums when 'isolatedModules' is enabled.
```

Je kunt dus **niet** `algorithm: Algorithm.Argon2id` schrijven. Laat `algorithm` gewoon weg — Argon2id is de default van de library (de typedefinitie merkt Argon2id aan als *"Default value, this is the default algorithm for normative recommendations"*).

### Werkende Credentials-provider

**`src/lib/auth-credentials.ts`** (los bestand, zodat `auth.config.ts` edge-veilig blijft):

```ts
import Credentials from "next-auth/providers/credentials"
import { hash, verify } from "@node-rs/argon2"
import { prisma } from "@/lib/prisma"

// OWASP-minimum: m=19456 KiB, t=2, p=1. algorithm weggelaten -> Argon2id (default),
// want een ambient const enum kan niet met isolatedModules: true.
export const ARGON2_OPTIES = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const

// Vaste dummy-hash om de responstijd gelijk te houden voor bestaande en
// niet-bestaande accounts (voorkomt user-enumeration via timing).
const DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHRzb21lc2FsdA$0000000000000000000000000000000000000000000"

export async function hashWachtwoord(wachtwoord: string) {
  return hash(wachtwoord, ARGON2_OPTIES)
}

export const wachtwoordProvider = Credentials({
  id: "wachtwoord",
  name: "E-mail en wachtwoord",
  credentials: {
    email: { label: "E-mailadres", type: "email" },
    password: { label: "Wachtwoord", type: "password" },
  },
  authorize: async (ruw) => {
    const email = typeof ruw?.email === "string" ? ruw.email.trim().toLowerCase() : ""
    const wachtwoord = typeof ruw?.password === "string" ? ruw.password : ""

    // Argon2 heeft geen 72-byte limiet (bcrypt wel), maar begrens toch tegen DoS.
    if (!email.includes("@") || wachtwoord.length < 10 || wachtwoord.length > 1024) {
      await verify(DUMMY_HASH, "x", ARGON2_OPTIES).catch(() => false)
      return null
    }

    const gebruiker = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true, email: true, name: true, image: true,
        passwordHash: true, emailVerified: true,
      },
    })

    if (!gebruiker?.passwordHash) {
      await verify(DUMMY_HASH, wachtwoord, ARGON2_OPTIES).catch(() => false)
      return null
    }

    const klopt = await verify(gebruiker.passwordHash, wachtwoord, ARGON2_OPTIES)
      .catch(() => false)
    if (!klopt) return null

    // Geen bevestigde e-mail = geen toegang. Anders kan iemand een account
    // claimen op andermans adres en later via Google linken.
    if (!gebruiker.emailVerified) return null

    return {
      id: gebruiker.id,
      email: gebruiker.email,
      name: gebruiker.name,
      image: gebruiker.image,
    }
  },
})
```

### Valkuilen bij Credentials

1. **Auth.js maakt géén gebruiker aan.** De docs zijn expliciet: *"the Credentials provider does not persist data in the database."* De adapter wordt bij Credentials niet aangeroepen. Je hebt dus een **eigen registratie-route** nodig (Server Action of `POST /api/registreren`) die zelf `prisma.user.create({ data: { email, passwordHash } })` doet plus een verificatiemail stuurt. Auth.js doet hier niets voor je.

2. **`OAuthAccountNotLinked`.** Registreert iemand met e-mail+wachtwoord en logt daarna in met Google op hetzelfde adres, dan weigert Auth.js dat. Voor een webshop is dat een omzetlek ("ik kan er niet meer in"). Zet **niet** blind `allowDangerousEmailAccountLinking: true` — dat is een account-overname-risico als de e-mail niet bewezen van de gebruiker is. Veilige route: link automatisch alleen als je eigen `User.emailVerified` gezet is én Google `profile.email_verified === true` teruggeeft, en toon anders een expliciete "koppel je Google-account"-flow ná inloggen met wachtwoord.

3. **Foutafhandeling met `redirect: false`.** Bij een mislukte login gooit Auth.js `CredentialsSignin`; de gebruiker krijgt anders `?error=CredentialsSignin&code=credentials`. In een Server Action moet je de niet-`AuthError` fouten **doorgooien**, anders slik je Next.js' interne `NEXT_REDIRECT` op en gebeurt er niets:

```ts
try {
  await signIn("wachtwoord", { email, password, redirectTo: "/leerpad" })
} catch (error) {
  if (error instanceof AuthError) return { fout: "E-mailadres of wachtwoord klopt niet." }
  throw error  // NEXT_REDIRECT moet door
}
```

4. **Rate limiting bouwt Auth.js niet.** De docs schuiven "encryption, rate-limiting, password reset" expliciet naar de ontwikkelaar. Zonder limiet is `/api/auth/callback/credentials` een open brute-force-endpoint, en elke poging kost je 19 MiB geheugen — dat is óók een DoS-vector op Vercel. Zet een teller per IP + per e-mailadres (Upstash Redis of een `LoginPoging`-tabel).

5. **Pepper (optioneel).** `@node-rs/argon2` ondersteunt `secret: Uint8Array`. Een pepper uit een env-var beschermt bij een pure DB-dump. Nadeel: roteren betekent alle hashes herberekenen. Voor v1 zou ik het overslaan.

6. **Kies bcrypt? Dan de 72-byte-val.** bcrypt kapt stil af op 72 bytes. OWASP adviseert pre-hashing: `bcrypt(base64(hmac-sha384(data:$password, key:$pepper)), $salt, $cost)`. Met Argon2id speelt dit niet.

---

## 4. Sessies: database vs JWT

### De harde beperking die je beslissing stuurt

Ik heb dit in de broncode van `@auth/core@0.41.3` nagekeken, niet uit geheugen. Twee vindplaatsen:

`node_modules/@auth/core/lib/utils/assert.js:114-119`:
```js
if (hasCredentials) {
    const dbStrategy = options.session?.strategy === "database";
    const onlyCredentials = !options.providers.some((p) => (...).type !== "credentials");
    if (dbStrategy && onlyCredentials) {
        return new UnsupportedStrategy("Signing in with credentials only supported if JWT strategy is enabled");
    }
```

Let op: de guard slaat alleen aan als **álle** providers credentials zijn. Met Google erbij krijg je dus géén foutmelding — maar het werkt evengoed niet. In `lib/actions/callback/index.js:227-277` schrijft de credentials-tak **altijd** een JWE-cookie via `jwt.encode(...)` en roept nooit `adapter.createSession()` aan. Vervolgens leest `lib/actions/session.js:65-68` bij `strategy: "database"` diezelfde cookie als sessie-token en doet `getSessionAndUser(sessionToken)` — dat vindt niets.

**Netto: Credentials + `strategy: "database"` geeft een stille, silent-fail login.** De gebruiker lijkt in te loggen en is meteen weer uitgelogd. Dit is een bekend architectuurprobleem, niet een bug die met config te fixen is (zie discussies #12848 en #4394 in de repo).

Er bestaat een hack — `jwt.encode`/`jwt.decode` overriden zodat `encode` zelf een DB-sessie aanmaakt en het sessie-token teruggeeft (de config-typing staat dit toe: `jwt?: Partial<JWTOptions>` met `encode`/`decode`). **Ik raad die af** voor een platform waar geld omgaat: hij leunt op ongedocumenteerd intern gedrag van een betaversie.

### Mijn advies: JWT-sessies, maar rechten nóóit in de token

De vraag "hoe trek ik toegang direct in?" is hier **niet** de sessievraag. Zet de gekochte-cursus-rechten simpelweg niet in de JWT.

- **In de JWT:** alleen `user.id` (en hooguit naam/e-mail voor weergave). Dat is stabiele identiteit.
- **In de database, elke request opnieuw opgevraagd:** welke cursussen iemand heeft. Een `Purchase`/`Entitlement`-tabel, en elke server-side render van betaalde lesinhoud doet `prisma.entitlement.findUnique({ where: { userId_courseSlug: {...} } })`.

Dan is intrekken (chargeback, terugbetaling, Mollie-refund, fraude) **onmiddellijk** — je zet één rij op `revokedAt` en de volgende request is al geblokkeerd, zonder dat je de sessie hoeft te vernietigen. Met rechten *in* de JWT zou je moeten wachten tot de token verloopt; de Auth.js-docs zeggen daar over: *"if you want to update the role, the user needs to be forced to sign in again."*

Wat je met JWT-sessies inlevert: geen "log overal uit"-knop en geen server-side sessie-intrekking. Voor Beleggingscollege v1 is dat een acceptabel gemis, en je kunt het later opvangen met een `sessionsValidFrom`-timestamp op `User` die je in de `jwt`-callback vergelijkt met `token.iat`.

Aanbevolen instelling: `maxAge: 30 dagen, updateAge: 1 dag` (dat zijn ook de defaults: `30 * 24 * 60 * 60` en `24 * 60 * 60`, zie `@auth/core/lib/init.js:38,76`). Wil je snellere invalidatie, zet `maxAge` op 7 dagen.

**De adapter houd je wél.** `PrismaAdapter` met `strategy: "jwt"` blijft nuttig: Google-gebruikers krijgen echte `User`- en `Account`-rijen, waaraan je de aankopen kunt hangen. Dat is precies wat het split-config-voorbeeld in de docs ook laat zien (`adapter: PrismaAdapter(prisma), session: { strategy: "jwt" }`).

### Prisma-schema

De gedocumenteerde modellen (`User`, `Account`, `Session`, `VerificationToken`) plus jullie eigen velden:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?           // eigen veld, alleen voor Credentials
  accounts      Account[]
  sessions      Session[]
  entitlements  Entitlement[]
}

model Entitlement {
  id          String    @id @default(cuid())
  userId      String
  courseSlug  String            // komt overeen met src/content/courses/*
  purchasedAt DateTime  @default(now())
  revokedAt   DateTime?
  molliePaymentId String? @unique
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, courseSlug])
}
```

`Account`, `Session` en `VerificationToken` exact overnemen uit `authjs.dev/getting-started/adapters/prisma`. `Session` blijft ongebruikt bij JWT-strategie maar de adapter-interface eist het model.

Voor **Neon** bestaat ook `@auth/neon-adapter`; met Prisma + Neon is `@auth/prisma-adapter` de gewone route. De docs noemen als installatie `npm install @prisma/client @prisma/extension-accelerate @auth/prisma-adapter` — de Accelerate-extensie is optioneel, die heb je alleen nodig bij Prisma Accelerate.

---

## 5. Gebruiker ophalen

### Server Component

```tsx
// src/app/leerpad/page.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function Leerpad() {
  const session = await auth()
  if (!session?.user?.id) redirect("/inloggen?vervolg=/leerpad")

  const rechten = await prisma.entitlement.findMany({
    where: { userId: session.user.id, revokedAt: null },
    select: { courseSlug: true },
  })

  return <Dashboard cursussen={rechten.map((r) => r.courseSlug)} />
}
```

Dit is ook precies de plek waar jullie kernprobleem opgelost wordt. De lespagina moet de lesinhoud **pas na de rechtencheck uit `src/content/` halen** en alleen dan doorgeven aan de client-component:

```tsx
// src/app/cursussen/[slug]/les/[les]/page.tsx
const session = await auth()
const magHetZien = session?.user?.id
  ? await heeftToegang(session.user.id, slug)
  : false

if (!magHetZien) return <Paywall slug={slug} />
const les = await getLes(slug, lesSlug)   // pas hier de betaalde inhoud inlezen
return <LesWeergave les={les} />
```

Zolang de lesdata als typed import in de module-graph van een client-component zit, bundelt Next die mee ongeacht welke check je erboven zet. De import moet dus achter de check, in een server-only module (`import "server-only"` bovenaan je content-loader is een goede vangrail).

### Route Handler

Twee manieren, beide gedocumenteerd. De typing in `next-auth/index.d.ts` bevestigt dat de argumentloze overload `Promise<Session | null>` teruggeeft en dus gewoon in een route handler werkt:

```ts
// src/app/api/mijn-cursussen/route.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ fout: "Niet ingelogd" }, { status: 401 })
  }
  return NextResponse.json({ userId: session.user.id })
}
```

Of met de wrapper-vorm, waarbij `req.auth` gevuld wordt:

```ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const GET = auth(function GET(req) {
  if (req.auth) return NextResponse.json(req.auth)
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})
```

### Client Component

```tsx
"use client"
import { useSession } from "next-auth/react"
```

Vereist een `<SessionProvider>` in de layout. **Gebruik dit niet als poort naar betaalde inhoud** — alleen voor UI-toestand (naam tonen, uitlogknop).

---

## 6. Wat ik niet met zekerheid weet

- Of `@node-rs/argon2@2.0.2` (dec 2024) prebuilds heeft die matchen met de Node-runtime die Vercel in aug 2026 draait. **Test in een preview vóór je erop bouwt**; `bcryptjs@3.0.3` is de veilige uitwijk.
- Of Google in 2026 nog het 100-testgebruikerslimiet hanteert — de helppagina noemt het niet meer. Zet publishing status hoe dan ook op "In production".
- Of Next.js 15.5 productieklaar Node-runtime voor middleware ondersteunt. Niet uitgezocht, want de aanbevolen architectuur hierboven doet geen DB-werk in middleware.
- Wanneer `next-auth` 5.0.0 stabiel wordt. Er is geen aangekondigde datum; plan alsof beta.32 de eindtoestand is en pin de exacte versie.

## Bronnen

- [Auth.js — Installation](https://authjs.dev/getting-started/installation)
- [Auth.js — Google provider](https://authjs.dev/getting-started/providers/google)
- [Auth.js — Credentials](https://authjs.dev/getting-started/authentication/credentials)
- [Auth.js — Session strategies](https://authjs.dev/concepts/session-strategies)
- [Auth.js — Get session](https://authjs.dev/getting-started/session-management/get-session)
- [Auth.js — Protecting resources](https://authjs.dev/getting-started/session-management/protecting)
- [Auth.js — Edge compatibility](https://authjs.dev/guides/edge-compatibility)
- [Auth.js — Prisma adapter](https://authjs.dev/getting-started/adapters/prisma)
- [Auth.js — Deployment](https://authjs.dev/getting-started/deployment)
- [Auth.js — TypeScript](https://authjs.dev/getting-started/typescript)
- [Auth.js — Extending the session](https://authjs.dev/guides/extending-the-session)
- [Auth.js — Next.js reference](https://authjs.dev/reference/nextjs)
- [Auth.js — Migrating to v5](https://authjs.dev/getting-started/migrating-to-v5)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Google Cloud — Manage OAuth Clients](https://support.google.com/cloud/answer/15549257?hl=en)
- [Google Cloud — OAuth app verification](https://support.google.com/cloud/answer/13463073?hl=en)
- [Google — OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [GitHub Discussion #12848 — DB session strategy + Credentials returns null](https://github.com/nextauthjs/next-auth/discussions/12848)
- [GitHub Discussion #4394 — Database session + Credentials login](https://github.com/nextauthjs/next-auth/discussions/4394)
- Broncode geverifieerd in `C:\Users\jason\AppData\Local\Temp\claude\C--Users-jason-CodingProjects-Beleggingscollege\e11577f8-cec4-4f15-9d8b-ab8482dde3d5\scratchpad\authprobe\node_modules\@auth\core\` — bestanden `lib/utils/assert.js`, `lib/actions/callback/index.js`, `lib/actions/session.js`, `lib/init.js`

--- DATABASE ---
## DATABASE — keuze en implementatiegids

*Alle versies gecontroleerd tegen de npm-registry en GitHub op 2 augustus 2026. Waar ik onzeker ben, staat dat er expliciet bij.*

---

## 1. Vergelijking: Neon vs. Supabase vs. Vercel Postgres

### Vercel Postgres — valt af, bestaat niet meer

Dit is geen afweging meer. Vercel's eigen Postgres-product is opgeheven; bestaande databases zijn in **december 2024 automatisch naar Neon verhuisd**. De docs zeggen letterlijk: "Vercel Postgres is no longer available." Postgres loopt nu uitsluitend via de Vercel Marketplace-integraties (Neon, Supabase, Prisma Postgres, PlanetScale). Bron: https://vercel.com/docs/postgres (last_updated 2026-01-13).

Praktisch gevolg: gebruik **niet** het oude `@vercel/postgres`-pakket in nieuwe code.

### Neon vs. Supabase (gratis laag, augustus 2026)

| | **Neon Free** | **Supabase Free** |
|---|---|---|
| Opslag | 0,5 GB per project | 500 MB per project |
| Compute | 100 CU-uur/maand per project, autoscaling tot 2 CU (8 GB RAM) | Shared CPU / 500 MB RAM |
| Scale-to-zero | Ja, na 5 min inactiviteit | — |
| **Pauzeren** | Alleen bij overschrijden maandlimiet | **Project gepauzeerd na 1 week inactiviteit** |
| Projecten | 100 per organisatie | 2 actieve projecten |
| Branches | 10 per project (copy-on-write) | n.v.t. |
| Egress | 5 GB | 5 GB (+ 5 GB cached) |
| Restore / backup | Instant restore 6 uur historie, 1 handmatige snapshot | Geen backups |
| Eerste betaalde laag | "Launch", pay-as-you-go zonder maandminimum | Pro, vanaf $25/mnd |

Bronnen: https://neon.com/pricing en https://supabase.com/pricing.

**Beslissende punten voor dit project:**

1. **Supabase pauzeert gratis projecten na een week inactiviteit.** Voor een site die betalende klanten bedient is dat diskwalificerend zolang je gratis wilt blijven. Neon's scale-to-zero (5 min) is iets anders: die wordt vanzelf wakker bij de eerste query, met een koude start van enkele honderden ms. Dat is een prestatie-nuance, geen storing.
2. **Neon is de facto de Vercel-standaard.** De native Marketplace-integratie injecteert de env-vars zelf en kan per Preview-deployment een geïsoleerde database-branch maken (`preview/<git-branch>`, copy-on-write). Dat is precies wat je wilt als je straks aan het schema voor betalingen gaat sleutelen zonder productiedata te raken. Bron: https://neon.com/docs/guides/vercel-managed-integration
3. **Portabiliteit is bij beide gelijk en goed.** Beide zijn gewoon Postgres. Eruit komen doe je met standaard `pg_dump`:
   ```bash
   pg_dump -Fc -v -d "postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require" -f backup.dump
   ```
   Let op: **gebruik hiervoor de unpooled connection string**, niet de pooled — `pg_dump` gebruikt `SET`-statements die niet werken in PgBouncer transaction mode. Bron: https://neon.com/docs/import/migrate-from-neon

   Nuance in het voordeel van Neon: Supabase is méér dan een database (Auth, Storage, Realtime, RLS-policies, Edge Functions). Als je die gebruikt, dumpt `pg_dump` je datá wel, maar niet je Supabase Auth-configuratie of je storage-buckets. Bij Neon is er niets om achter te laten — het ís alleen Postgres. Voor "de eigenaar moet er altijd uit kunnen" is dat het schonere verhaal.

4. **Tegenargument voor Supabase, eerlijk benoemd:** Supabase geeft je auth kant-en-klaar, inclusief Google SSO, wat een deel van de auth-opdracht zou wegnemen. De prijs is vendor lock-in op je gebruikersaccounts en het pauzeergedrag. Ik vind dat hier niet opwegen — zeker omdat Auth.js met een eigen `user`-tabel je accounts volledig in je eigen Postgres houdt.

### Keuze: **Neon**, regio `aws-eu-central-1` (Frankfurt)

Kies de regio bewust: **je kunt de regio van een bestaand Neon-project niet wijzigen.** Wil je later toch een andere regio, dan is dat een nieuw project + datamigratie. Voor AVG en latency (Nederlandse gebruikers) is Frankfurt de juiste keuze; `aws-eu-west-2` (Londen) is post-Brexit een minder schone AVG-route. Bron: https://neon.com/docs/introduction/regions

---

## 2. Pakketten en versies (geverifieerd 2026-08-02)

| Pakket | Versie | Gepubliceerd | Opmerking |
|---|---|---|---|
| `drizzle-orm` | **0.45.2** | 2026-03-27 | npm dist-tag `latest`, laatste niet-prerelease op GitHub |
| `drizzle-kit` | **0.31.10** | 2026-03-17 | dev-dependency |
| `@neondatabase/serverless` | **1.1.0** | 2026-04-17 | |
| `@auth/drizzle-adapter` | **1.11.3** | 2026-07-20 | hangt aan `@auth/core@0.41.3` |
| `next-auth` | **5.0.0-beta.32** | 2026-07-20 | Auth.js v5 is nog altijd beta; `latest` = 4.24.15 |
| `pg` / `@types/pg` | 8.22.0 / 8.20.3 | 2026-06-19 / 2026-08-01 | alleen als je node-postgres wilt |
| `dotenv`, `tsx` | actueel | | dev, voor drizzle-kit |

### Waarschuwing over Drizzle v1

De Drizzle-documentatie op orm.drizzle.team schrijft inmiddels `npm i drizzle-orm@rc` voor. **Maar v1.0 is nog niet stabiel:** de nieuwste release op GitHub is `v1.0.0-rc.4` (2026-06-27, `prerelease: true`), en de npm-tag `latest` staat nog op 0.45.2. RC-1 bevat bovendien een breaking change in de casing-API en verwijdert RQB v1 `._query` voor Postgres.

Belangrijker: **auth-adapters lopen aantoonbaar achter op Drizzle 1.0.** In het Better-Auth-ecosysteem zijn hier open issues over ("Unknown relational filter field" na upgrade naar `drizzle-orm@beta`), zie https://github.com/better-auth/better-auth/issues/7691 en https://github.com/better-auth/better-auth/issues/6766. Ik heb geen bewijs gevonden dat `@auth/drizzle-adapter@1.11.3` op v1 RC getest is — de adapter declareert helemaal geen `peerDependencies` op `drizzle-orm`, dus npm waarschuwt je nergens voor.

**Advies: pin `drizzle-orm@0.45.2` en `drizzle-kit@0.31.10` exact** (zonder `^`) voor de eerste verkoop-release. Upgraden naar v1 kan later, als een rustige losse klus.

---

## 3. Project aanmaken en connection string ophalen

### Route A (aanbevolen): via de Vercel Marketplace

1. Vercel-dashboard → project → **Storage** → **Create Database** → **Neon**.
2. Regio: **AWS Europe (Frankfurt) `aws-eu-central-1`**.
3. Koppel de database aan het project, scope Production + Preview + Development.
4. Zet **Preview branching** aan als je die geïsoleerde branch-per-PR wilt.

De integratie injecteert de env-vars automatisch. Namen verbatim uit https://neon.com/docs/guides/vercel-managed-integration:

| Variabele | Inhoud |
|---|---|
| `DATABASE_URL` | **Pooled** connection string (via PgBouncer) — dit is wat de app gebruikt |
| `DATABASE_URL_UNPOOLED` | **Directe** connection string — voor migraties en `pg_dump` |
| `PGHOST`, `PGHOST_UNPOOLED`, `PGUSER`, `PGDATABASE`, `PGPASSWORD` | losse onderdelen |
| `POSTGRES_*` | legacy-varianten, alleen voor compatibiliteit met oude Vercel Postgres-templates — negeren |

Het verschil in de string is één woord in de hostname:

```
# pooled
postgresql://user:pass@ep-cool-darkness-123456-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
# unpooled
postgresql://user:pass@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### Route B: direct bij Neon

console.neon.tech → New Project → regio Frankfurt → **Connection Details** → kopieer beide strings. Zet ze daarna handmatig in Vercel onder Settings → Environment Variables.

### Lokaal

`.env.local` (staat al in `.gitignore` bij Next.js):

```bash
DATABASE_URL="postgresql://...-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://....eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

Handig: maak in Neon een aparte branch `dev` van je hoofdbranch en gebruik díe string lokaal. Kost geen extra opslag (copy-on-write) en je knoeit nooit in productiedata.

---

## 4. Drizzle ORM opzetten

### Installatie

```bash
npm i drizzle-orm@0.45.2 @neondatabase/serverless@1.1.0
npm i -D drizzle-kit@0.31.10 dotenv tsx
```

### `drizzle.config.ts` (projectroot)

Let op de valkuil: **drizzle-kit leest `.env.local` niet vanzelf.** Next.js wel, drizzle-kit niet. Daarom expliciet inladen:

```ts
// drizzle.config.ts
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Migraties ALTIJD over de directe verbinding: DDL-tools werken slecht
    // met PgBouncer transaction pooling.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
});
```

### Scripts in `package.json`

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push"
  }
}
```

Werkwijze: `npm run db:generate` schrijft SQL-bestanden naar `./drizzle/` — **commit die naar git**, dat is je schema-historie. `npm run db:migrate` voert ze uit. Gebruik `db:push` alleen tijdens vroeg experimenteren op een wegwerpbranch; zodra er echte klanten in de database staan is push gevaarlijk (geen reviewbare SQL, kan kolommen droppen).

Voer migraties **niet** automatisch in `next build` uit. Een mislukte migratie tijdens een build laat je in een halve staat achter en Vercel draait builds parallel. Doe het bewust vanaf je machine of vanuit een aparte GitHub Action tegen `DATABASE_URL_UNPOOLED`.

### De client, met connection pooling

Dit is het punt waar serverless mis kan gaan. Twee lagen pooling:

1. **Server-side pooling in Neon zelf**: de `-pooler`-hostname draait PgBouncer in *transaction mode* en verwerkt tot 10.000 gelijktijdige verbindingen (default pool size = 90% van `max_connections`; bij 1 CU is dat 377). Dit is wat voorkomt dat serverless functies je database-verbindingen opvreten. Bron: https://neon.com/docs/connect/connection-pooling
2. **Driverkeuze in je app**: bij `drizzle-orm/neon-http` is er geen client-side pool nodig — elke query is één HTTP-request via Neon's SQL-over-HTTP-endpoint. Dat is de eenvoudigste en meest robuuste optie op Vercel: geen sockets die blijven hangen tussen invocaties.

```ts
// src/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL ontbreekt");
}

// Module-scope singleton: warme Vercel-instanties hergebruiken deze,
// koude starts maken hem opnieuw. Geen globalThis-hack nodig.
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle({ client: sql, schema });
export * from "./schema";
```

**Belangrijke beperking van neon-http:** je kunt hiermee geen *interactieve* transacties draaien (`db.transaction(async (tx) => { ... })` met logica tussen de queries). Alleen niet-interactieve batches. Bron: https://neon.com/docs/serverless/serverless-driver

Voor de Mollie-webhook wil je waarschijnlijk wél een echte transactie (aankoop wegschrijven + toegang verlenen in één keer). Gebruik daar de WebSocket-driver:

```ts
// src/db/pooled.ts — alleen importeren in routes die echte transacties nodig hebben
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export const dbTx = drizzle({ client: pool, schema });
```

`drizzle-orm/neon-serverless` is een drop-in vervanging voor de `pg`-driver en ondersteunt sessies en interactieve transacties. Bron: https://orm.drizzle.team/docs/connect-neon

Twee kanttekeningen die ik niet zeker weet en die je moet testen:
- In een Node-omgeving zónder globale `WebSocket` moet je `ws` en `bufferutil` toevoegen. Node 22+ (wat Vercel nu draait) heeft een globale `WebSocket`, dus waarschijnlijk niet nodig — maar controleer dit in een echte deploy voordat je erop vertrouwt.
- Sinds Neon's pooler in transaction mode draait, werken sessie-features (`SET`, `LISTEN/NOTIFY`, `PREPARE`, temp tables) niet over `DATABASE_URL`. Drizzle gebruikt die niet standaard, maar wees erop bedacht.

---

## 5. Schemavoorstel

Bestand: `src/db/schema.ts`.

### Belangrijk: `defineTables` is géén publieke export

De Auth.js-broncode bevat een handige `defineTables()`-helper, maar die zit in `./lib/pg.js` en wordt **niet** vanuit de package-root geëxporteerd — `@auth/drizzle-adapter@1.11.3` heeft één export-pad (`.`) en `src/index.ts` exporteert alleen `DrizzleAdapter`. Je moet de tabellen dus zelf uitschrijven, en ze moeten **exact** overeenkomen met de defaults van de adapter.

Nog een correctie: de docspagina op authjs.dev toont voor `verificationToken` een kolom `email`. **De broncode gebruikt `identifier`.** Ik houd de broncode aan (https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-drizzle/src/lib/pg.ts). Gebruik je `email`, dan breekt magic-link login.

De kolomnamen zijn camelCase en de tabelnamen enkelvoud — dat is lelijk Postgres, maar het is wat de adapter verwacht. Voor mijn eigen tabellen gebruik ik wel gewoon snake_case.

```ts
// src/db/schema.ts
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";

/* ---------------------------------------------------------------
 * 1. Auth.js — moet 1:1 matchen met @auth/drizzle-adapter defaults
 * ------------------------------------------------------------- */

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  // AVG: name en image komen van Google. Zie toelichting hieronder.
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// Alleen nodig als je ooit passkeys/WebAuthn aanzet. Kost niets om nu al
// aan te maken en voorkomt een runtime-crash als je die optie later inschakelt.
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.credentialID] })],
);

/* ---------------------------------------------------------------
 * 2. Aankopen — de enige bron van waarheid voor toegang
 * ------------------------------------------------------------- */

export const purchases = pgTable(
  "purchases",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    // NIET cascade: een aankoop is ook een fiscaal record. Bij accountverwijdering
    // wordt userId NULL en blijft de anonieme boekingsregel staan.
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),

    // Slug uit src/content/ — géén FK, cursusinhoud leeft in code.
    courseSlug: text("course_slug").notNull(),

    // Mollie payment id, bv. "tr_WDqYK6vllg". Uniek = idempotente webhook.
    molliePaymentId: text("mollie_payment_id").notNull().unique(),

    // Bedrag in centen. Mollie geeft een string terug ("49.00") — reken die
    // om, sla nooit een float op.
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("EUR"),

    // Mollie-status: open | pending | authorized | paid | canceled | expired | failed
    // Bewust text en geen pgEnum, zodat een nieuwe Mollie-status je webhook niet sloopt.
    status: text("status").notNull().default("open"),

    paidAt: timestamp("paid_at", { withTimezone: true, mode: "date" }),
    refundedAt: timestamp("refunded_at", { withTimezone: true, mode: "date" }),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // De hot path: "mag deze gebruiker deze cursus zien?"
    index("purchases_user_course_idx").on(t.userId, t.courseSlug),
    // Voorkomt dubbele betaalde aankopen van dezelfde cursus.
    // LET OP: controleer de gegenereerde SQL van deze partiële index in
    // ./drizzle/ voordat je hem naar productie draait.
    uniqueIndex("purchases_paid_unique")
      .on(t.userId, t.courseSlug)
      .where(sql`${t.status} = 'paid'`),
  ],
);

/* ---------------------------------------------------------------
 * 3. Voortgang — vervangt localStorage
 * ------------------------------------------------------------- */

export const progress = pgTable(
  "progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseSlug: text("course_slug").notNull(),
    lessonId: text("lesson_id").notNull(),

    completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),

    quizScore: integer("quiz_score"),   // aantal goed
    quizTotal: integer("quiz_total"),   // aantal vragen
    xpAwarded: integer("xp_awarded").notNull().default(0),
  },
  (t) => [
    // Natuurlijke sleutel: één rij per les per gebruiker. Maakt de
    // "herhaalde les = 0 XP"-regel een simpele ON CONFLICT DO NOTHING.
    primaryKey({ columns: [t.userId, t.courseSlug, t.lessonId] }),
    index("progress_user_course_idx").on(t.userId, t.courseSlug),
  ],
);

/* ---------------------------------------------------------------
 * 4. Gamification-state die je niet kunt afleiden
 * ------------------------------------------------------------- */

export const userStats = pgTable("user_stats", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  totalXp: integer("total_xp").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),

  // date, geen timestamp: een streak is per kalenderdag, niet per moment.
  lastActiveOn: timestamp("last_active_on", { mode: "date" }),

  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});
```

### Ontwerpkeuzes, toegelicht

**Geen `courses`-tabel.** Cursusinhoud blijft typed data in `src/content/`. `courseSlug` is een losse string. Voordeel: publiceren blijft een git-commit, geen CMS. Nadeel: geen FK-integriteit — als je ooit een slug hernoemt, moet je die ook in `purchases` en `progress` migreren. Gezien de SEO-huisregel ("nooit een slug wijzigen zonder redirect") is dat een risico dat je toch al vermijdt.

**Badges niet opgeslagen.** `src/lib/badges.ts` bevat predicaten; die kun je op leestijd evalueren tegen `progress` + `userStats`. Wil je later "badge behaald op <datum>" tonen, voeg dan een `earned_badges (user_id, badge_id, earned_at)`-tabel toe — maar niet nu.

**`purchases` is de enige toegangsbron.** Geen aparte `enrollments`-tabel. Toegangscheck:

```ts
// src/lib/entitlements.ts
import { and, eq } from "drizzle-orm";
import { db, purchases } from "@/db";

export async function hasCourseAccess(userId: string, courseSlug: string) {
  const rows = await db
    .select({ id: purchases.id })
    .from(purchases)
    .where(
      and(
        eq(purchases.userId, userId),
        eq(purchases.courseSlug, courseSlug),
        eq(purchases.status, "paid"),
      ),
    )
    .limit(1);

  return rows.length > 0;
}
```

Dit hoort **server-side** aangeroepen te worden, in het Server Component of de Route Handler die de lesinhoud ophaalt — niet in een client component. Dat is de kern van "betaalde lesinhoud mag niet naar de browser". Zolang de les-data via `src/content/index.ts` in een client bundle geïmporteerd wordt, staat hij in de JavaScript die iedereen kan downloaden, ook zonder account. Dat vergt een aparte refactor.

### AVG-overwegingen

- **Persoonsgegevens beperkt tot vier velden**: `name`, `email`, `emailVerified`, `image` in `user`. Alles daarbuiten is pseudoniem (`user_id` als sleutel).
- **Sla geen IP-adressen of user-agents op.** De adapter doet dat ook niet — voeg het niet toe.
- **`image` overwegen weg te laten.** Dat is een Google-CDN-URL naar de profielfoto. Gebruik je hem nergens, zet hem dan in de Auth.js-callback op `null`. Scheelt een gegeven.
- **`name` heb je wél nodig** voor het printbare certificaat op `/cursussen/[slug]/certificaat`.
- **Databasesessies bevatten geen PII** (`sessionToken` + `expires` + `user_id`), en je kunt ze serverside intrekken. Dat is een voordeel boven JWT-sessies.
- **Verwijderroute**: `DELETE FROM "user" WHERE id = ...` ruimt via cascade `account`, `session`, `progress`, `user_stats` en `authenticator` op, en zet `purchases.user_id` op NULL. De betaalregel blijft bestaan met alleen bedrag, datum en Mollie-id.
- **Let op de spanning tussen AVG en de fiscale bewaarplicht.** In Nederland geldt voor de administratie een bewaartermijn van zeven jaar. Ik ben geen jurist en kan niet beoordelen of jouw factuurgegevens volledig in Mollie mogen blijven staan (waar ze sowieso staan) of dat je ze zelf moet bewaren. Leg dit even voor aan je boekhouder voordat je het verwijderproces definitief maakt.
- **Zet in Neon geen productiedata in preview-branches** als je met echte klantgegevens werkt: een preview-branch is een volledige copy-on-write kopie inclusief persoonsgegevens, en die branches blijven volgens de docs staan tot Vercel's deployment-retentie ze opruimt (standaard 6 maanden).

---

## 6. Auth.js-adapter koppelen

**Pakket: `@auth/drizzle-adapter@1.11.3`** (https://www.npmjs.com/package/@auth/drizzle-adapter), te gebruiken met `next-auth@5.0.0-beta.32`. Beide hangen aan dezelfde `@auth/core@0.41.3` — dat is geen toeval en je moet ze samen upgraden.

```bash
npm i next-auth@5.0.0-beta.32 @auth/drizzle-adapter@1.11.3
```

Je gebruikt `DrizzleAdapter` (de generieke export). Die detecteert zelf dat je een `PgDatabase` doorgeeft en kiest intern `PostgresDrizzleAdapter`. Er is dus geen apart Postgres-specifiek importpad.

```ts
// src/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  db,
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    // authenticatorsTable: authenticators,  // alleen bij passkeys
  }),
  session: { strategy: "database" },
  providers: [Google],
});
```

Drie dingen om te weten:

1. **De mapping-keys zijn verplicht als je je tabellen zelf definieert.** Geef je het tweede argument niet mee, dan bouwt de adapter interne defaults met de namen `user`/`account`/`session`/`verificationToken` — die toevallig overeenkomen met mijn schema hierboven, maar drizzle-kit weet dan niets van die tabellen en genereert er geen migraties voor. Altijd expliciet doorgeven.
2. **`db` moet een `PgDatabase`-instantie zijn.** Zowel `drizzle-orm/neon-http` als `drizzle-orm/neon-serverless` leveren dat. De adapter doet een `is(db, PgDatabase)`-check.
3. **De adapter declareert geen peerDependency op `drizzle-orm`.** Er is dus geen enkele automatische bescherming tegen een incompatibele Drizzle-versie. Dat is precies waarom ik 0.45.2 pin.

Auth.js v5 is in augustus 2026 nog steeds beta (`5.0.0-beta.32`, 2026-07-20; `latest` staat op de v4-lijn 4.24.15). Dat is al meer dan twee jaar zo en de beta is in de praktijk wat iedereen op Next.js App Router draait — maar het is wel een beta, en breaking changes tussen beta-versies zijn voorgekomen. Pin de exacte versie. Of Better Auth hier een betere keuze is, valt buiten mijn opdracht; wel relevant: Better Auth heeft juist wél gedocumenteerde problemen met Drizzle 1.0, dus dat is geen ontsnapping aan hetzelfde dilemma.

---

## 7. Volgorde van uitvoeren

1. Neon-project in `aws-eu-central-1`, gekoppeld via Vercel Marketplace.
2. `npm i` met de gepinde versies hierboven.
3. `src/db/schema.ts` + `drizzle.config.ts` + `src/db/index.ts` aanmaken.
4. `npm run db:generate` → SQL in `./drizzle/` nakijken (vooral die partiële unique index) → committen.
5. `npm run db:migrate` tegen je dev-branch.
6. `npm run db:studio` om te controleren dat alle zeven tabellen er staan.
7. Auth.js aansluiten, één keer inloggen met Google, kijken of er een rij in `user` en `account` verschijnt.
8. Pas daarna: Mollie-webhook die in `purchases` schrijft, en de refactor die lesinhoud achter `hasCourseAccess()` zet.

---

**Bronnen**

- [Postgres on Vercel — Vercel Docs](https://vercel.com/docs/postgres)
- [Neon Pricing](https://neon.com/pricing)
- [Supabase Pricing](https://supabase.com/pricing)
- [Neon — Connecting with the Vercel-Managed Integration](https://neon.com/docs/guides/vercel-managed-integration)
- [Neon — Connection pooling](https://neon.com/docs/connect/connection-pooling)
- [Neon — Serverless driver](https://neon.com/docs/serverless/serverless-driver)
- [Neon — Migrate from Neon (pg_dump)](https://neon.com/docs/import/migrate-from-neon)
- [Neon — Regions](https://neon.com/docs/introduction/regions)
- [Drizzle — Get started with Neon](https://orm.drizzle.team/docs/get-started/neon-new)
- [Drizzle — Connect Neon](https://orm.drizzle.team/docs/connect-neon)
- [Drizzle — Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints)
- [drizzle-orm op npm](https://www.npmjs.com/package/drizzle-orm)
- [Auth.js — Drizzle Adapter](https://authjs.dev/getting-started/adapters/drizzle)
- [Auth.js adapter-drizzle broncode (pg.ts)](https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-drizzle/src/lib/pg.ts)
- [Better Auth issue #7691 — Drizzle 1.0rc compatibiliteit](https://github.com/better-auth/better-auth/issues/7691)
- [Better Auth issue #6766 — nieuwe Drizzle query-syntax](https://github.com/better-auth/better-auth/issues/6766)

--- MOLLIE ---
# Mollie — implementatiegids eenmalige betaling (Next.js 15 App Router)

Onderzocht op 2 augustus 2026 tegen de live documentatie op `docs.mollie.com` en het npm-register. Alle versienummers hieronder zijn geverifieerd, niet uit geheugen.

---

## 0. Geverifieerde feiten (versies & bronnen)

| Wat | Waarde | Bron / verificatie |
|---|---|---|
| Pakket | `@mollie/api-client` | https://www.npmjs.com/package/@mollie/api-client |
| Actuele versie | **4.6.0**, gepubliceerd **2026-06-30T14:36:20Z** | npm registry API (`registry.npmjs.org/@mollie/api-client` → `dist-tags.latest`) |
| Vorige versies | 4.5.0, 4.4.0, 4.3.3 … | idem |
| Runtime-deps | `node-fetch@^2.7.0`, `ruply@^1.0.1`, `@types/node-fetch@^2.6.13` | package.json van 4.6.0 |
| Node-eis | README zegt **Node 14+** (ook Bun 1.0+, Deno 2.0+). `package.json.engines` zegt nog `>=8` — dat veld is verouderd, ga uit van de README. | https://github.com/mollie/mollie-api-node |
| Entrypoints | `main: dist/mollie.cjs.js`, `module: dist/mollie.esm.js`, `types: dist/types/types.d.ts`. Géén `exports`-map, géén `type: module`. | package.json 4.6.0 |
| API-basis | `https://api.mollie.com/v2` | https://docs.mollie.com/reference/create-payment |

Ik heb 4.6.0 lokaal geïnstalleerd en de import-vorm geverifieerd: `createMollieClient` is zowel de **default** als een **named** export, en de runtime-enum `PaymentStatus` (`open, canceled, pending, authorized, expired, failed, paid`) wordt echt geëxporteerd.

**Let op:** de Next.js-docs draaien inmiddels op **16.2.12**. Jouw project zit op `next: ^15.4.0`. Alles hieronder werkt op beide — de Route Handler-API is niet gewijzigd tussen 15 en 16 (`context.params` werd al een Promise in 15.0.0-RC, en GET-handlers werden daar al dynamisch by default).

---

## 1. Installatie en initialisatie

```bash
npm i @mollie/api-client@4.6.0
npm i server-only        # verkleint de kans dat je per ongeluk je key naar de client lekt
```

`.env.local` (nooit committen — `.gitignore` heeft `.env*` al):

```bash
# Developers > API access tokens in https://my.mollie.com
MOLLIE_API_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Publieke basis-URL; lokaal je tunnel-URL, op Vercel je echte domein
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MOLLIE_WEBHOOK_BASE_URL=https://jouw-tunnel.trycloudflare.com
```

De sleutel begint met `test_` of `live_`; dat prefix bepaalt de modus. Er is geen aparte sandbox-URL — testmodus is puur een andere sleutel (https://docs.mollie.com/reference/testing). Sinds 2026 kun je **twee** keys per profiel hebben, dus je kunt roteren zonder downtime (https://docs.mollie.com/reference/authentication).

**`src/lib/mollie.ts`**

```ts
import "server-only";
import createMollieClient from "@mollie/api-client";

const apiKey = process.env.MOLLIE_API_KEY;
if (!apiKey) throw new Error("MOLLIE_API_KEY ontbreekt");

// Eén client per serverproces. In dev hergebruiken via globalThis, anders
// maakt Fast Refresh er tientallen aan.
const globalForMollie = globalThis as unknown as {
  mollie?: ReturnType<typeof createMollieClient>;
};

export const mollie =
  globalForMollie.mollie ??
  createMollieClient({
    apiKey,
    // Verschijnt in de User-Agent naar Mollie; handig bij support-tickets.
    versionStrings: "Beleggingscollege/1.0",
  });

if (process.env.NODE_ENV !== "production") globalForMollie.mollie = mollie;

export const isTestmode = apiKey.startsWith("test_");
```

Opties die de client accepteert (uit `dist/types/Options.d.ts` van 4.6.0): `apiKey` **XOR** `accessToken` (+ `parameterDefaults: { profileId, testmode }` alleen bij `accessToken`), `versionStrings`, `headers`, `apiEndpoint`, `dangerouslyAllowBrowser`. Die laatste is een veiligheidsrem: de client weigert standaard in een browserachtige omgeving te draaien. **Nooit aanzetten.**

### Bundling-aandachtspunten in Next.js

- Zet in elke Mollie-route `export const runtime = "nodejs";`. De client draait op `node-fetch@2` en op Node-API's; de Edge runtime breekt.
- `node-fetch@2` heeft een optionele peer `encoding`. Als je build klaagt met `Module not found: Can't resolve 'encoding'`, voeg dan toe aan `next.config.ts`:
  ```ts
  const nextConfig: NextConfig = {
    serverExternalPackages: ["@mollie/api-client"],
    // ... je bestaande redirects
  };
  ```
  De key heet in Next 15+ `serverExternalPackages` (in 15.0.0 stabiel geworden en hernoemd vanaf `experimental.serverComponentsExternalPackages` — https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages). **Onzeker:** ik heb geen Next-build met dit pakket gedraaid, dus ik weet niet of dit in jouw setup daadwerkelijk nodig is. Voeg het alleen toe als de build erom vraagt.

---

## 2. Route Handler: betaling aanmaken

### Volgorde die je moet aanhouden

1. Maak **eerst** een eigen order-record in je database (status `open`), met eigen id en de prijs die **jij** bepaalt (nooit uit de request body).
2. Maak dan de Mollie-betaling met jouw order-id in `metadata`.
3. Sla `payment.id` (`tr_…`) op bij je order-record.
4. Stuur de gebruiker naar `payment.getCheckoutUrl()`.

Stap 3 is niet optioneel: bij de webhook moet je van `tr_…` naar jouw order kunnen, zonder de metadata te vertrouwen.

**`src/app/api/checkout/route.ts`**

```ts
import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { mollie } from "@/lib/mollie";
import { getCourseBySlug } from "@/content";
import { getSession } from "@/lib/auth";        // uit het accounts-spoor
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { slug, herroepingAkkoord } = await request.json();

  const course = getCourseBySlug(slug);
  if (!course) return NextResponse.json({ error: "Cursus onbekend" }, { status: 404 });

  // Zie sectie 5: zonder deze verklaring mag je niet direct ontsluiten.
  if (herroepingAkkoord !== true) {
    return NextResponse.json({ error: "Toestemming vereist" }, { status: 400 });
  }

  // Prijs komt UIT JE EIGEN CATALOGUS, nooit uit de request.
  const prijsInCenten = course.prijsCenten;          // 4900
  const bedrag = (prijsInCenten / 100).toFixed(2);   // "49.00" — altijd 2 decimalen

  const orderId = randomUUID();
  const forwarded = request.headers.get("x-forwarded-for");

  await db.order.create({
    data: {
      id: orderId,
      userId: session.userId,
      courseSlug: course.slug,
      bedragCenten: prijsInCenten,
      valuta: "EUR",
      status: "open",
      // Juridisch bewijs — zie sectie 5
      herroepingToestemmingOp: new Date(),
      herroepingTekstVersie: "herroeping-v1-2026-08",
      herroepingIp: forwarded?.split(",")[0]?.trim() ?? null,
      herroepingUserAgent: request.headers.get("user-agent") ?? null,
    },
  });

  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  const webhookBase = process.env.MOLLIE_WEBHOOK_BASE_URL ?? site;

  const payment = await mollie.payments.create({
    amount: { currency: "EUR", value: bedrag },        // value MOET een string zijn
    description: `Beleggingscollege — ${course.titel}`, // max 255 tekens, wordt anders afgekapt
    redirectUrl: `${site}/bedankt/${orderId}`,
    cancelUrl: `${site}/cursussen/${course.slug}?geannuleerd=1`,
    webhookUrl: `${webhookBase}/api/mollie/webhook`,
    locale: "nl_NL",
    metadata: { orderId, courseSlug: course.slug, userId: session.userId },
    // Alleen zetten als je het keuzescherm wilt overslaan; laat weg voor
    // iDEAL + kaart naast elkaar.
    // method: ["ideal", "creditcard"],
    idempotencyKey: orderId,   // client stuurt dit als Idempotency-Key header
  });

  await db.order.update({
    where: { id: orderId },
    data: { molliePaymentId: payment.id },
  });

  const checkoutUrl = payment.getCheckoutUrl();
  if (!checkoutUrl) {
    return NextResponse.json({ error: "Geen checkout-URL ontvangen" }, { status: 502 });
  }

  return NextResponse.json({ checkoutUrl });
}
```

Client-kant, in je koopknop:

```tsx
const res = await fetch("/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ slug, herroepingAkkoord: akkoord }),
});
const { checkoutUrl } = await res.json();
window.location.href = checkoutUrl;   // volledige navigatie, geen router.push
```

Gebruik `window.location.href`, niet `router.push` — de checkout ligt op een ander domein (`https://www.mollie.com/checkout/…`).

### De velden, exact

Verplicht zijn `amount`, `description`, `redirectUrl` (uit de OpenAPI-definitie op https://docs.mollie.com/reference/create-payment — `required: ["amount","description","redirectUrl"]`).

| Veld | Type | Uit de docs |
|---|---|---|
| `amount.currency` | string | "A three-character ISO 4217 currency code." |
| `amount.value` | **string** | "A string containing an exact monetary amount in the given currency." Dus `"49.00"`, niet `49` en niet `"49"`. |
| `description` | string, `maxLength: 255` | "will be shown to your customer on their card or bank statement… The API will not reject strings longer than the maximum length but it will truncate them." |
| `redirectUrl` | string | "normally required, but can be omitted for recurring payments… and for Apple Pay payments with an `applePayPaymentToken`." |
| `cancelUrl` | string, optioneel | Alleen bij expliciet annuleren. "Mollie will always give you status updates via webhooks, including for the canceled status." |
| `webhookUrl` | string, optioneel | "must be reachable from Mollie's point of view, so you cannot use `localhost`." |
| `metadata` | vrij | "Provide any data you like… You can use up to approximately 1kB." |
| `locale` | string | Voor jou: `nl_NL`. Volledige lijst bevat `nl_NL`, `nl_BE`, `en_GB`, `de_DE`, … |
| `method` | string of array | Weglaten = Mollie's keuzescherm. Array = beperkte keuze. Waarden o.a. `ideal`, `creditcard`, `bancontact`, `paypal`, `directdebit`. |
| `idempotencyKey` | string (client-optie) | Wordt als `Idempotency-Key`-header verstuurd; Mollie replayt het eerdere antwoord bij een herhaling **binnen één uur** (https://docs.mollie.com/reference/api-idempotency). |

Mollie zegt zelf dat idempotency bij gewone eenmalige betalingen niet strikt nodig is ("setting up the payment twice will just result in one of the two payments eventually expiring"), maar het kost je niks en voorkomt weesbetalingen bij een netwerk-timeout.

### De redirect-pagina liegt

`redirectUrl` wordt óók aangeroepen als de klant afbreekt, en Mollie plakt er geen status aan vast. Behandel `/bedankt/[orderId]` als "we kijken even" en lees de status uit **je eigen database**, niet uit de URL. Zie sectie 4 voor de fallback als de webhook nog niet binnen is.

---

## 3. De webhook

### Wat Mollie precies stuurt

Uit https://docs.mollie.com/reference/webhooks — letterlijk het voorbeeld uit de docs:

```http
POST /payments/webhook HTTP/1.1
Host: webshop.example.org
User-Agent: Mollie HTTP client/1.0
Content-Type: application/x-www-form-urlencoded
Accept: */*
Content-Length: 28

id=tr_5B8cwPMGnU6qLbRvo7qEZo
```

Dat is alles. **Eén form-encoded parameter `id`.** Geen status, geen bedrag, geen JSON.

### Waarom je de status nooit uit het verzoek mag geloven

Dit is geen best practice maar het hele ontwerp. Mollie:

> "It might seem a little cumbersome that we do not post the new status immediately, but proper security dictates this flow. Since the status is not transmitted in the webhook, fake calls to your webhook will never result in orders being processed without being actually paid."

Je endpoint is publiek. Iedereen kan er een POST heen sturen. Omdat er geen status in zit, is de enige manier om iets te weten: **zelf `payments.get(id)` doen met je API-key.** Die call is geauthenticeerd, dus het antwoord komt gegarandeerd van Mollie.

Twee dingen die daar bovenop moeten:

1. **IP-whitelisting is expliciet afgeraden.** "As our systems continue to evolve, the IP addresses used by our webhook systems will likely change over time… sooner or later you will start missing out on our webhooks." (Er ís een lijst op `https://ip-ranges.mollie.com/ips.txt`, maar gebruik die hooguit als extra signaal, niet als poortwachter.)
2. **Een geldige `tr_…` is niet genoeg.** Een aanvaller kan een échte betaling van €1,00 op jóuw account doen en dat id naar je webhook sturen in de hoop een cursus van €49 los te peuteren. Daarom: zoek je order op via de opgeslagen `molliePaymentId`, en controleer dat bedrag én valuta kloppen met wat jij verwachtte. De `metadata` alleen is te zwak — die is weliswaar door Mollie teruggegeven en dus authentiek, maar je wilt de koppeling in jouw richting vastleggen, niet in die van de payload.

### Idempotentie

Mollie roept je webhook aan bij `paid`, `authorized`, `expired`, `failed`, `canceled`, én bij refunds (`processing`/`refunded`/`failed`) en chargebacks. Bij een niet-200 antwoord komen er retries: **10 pogingen over 26 uur**, met interval 0m, 1m, 2m, 4m, 8m, 16m, 29m, 1u, 2u, 22u. Timeout 15 seconden — "Even if you return a 200 OK HTTP status after 16 seconds, we will mark the webhook call as failed and try again later."

Dus: dezelfde `paid`-webhook komt gegarandeerd meerdere keren binnen. Je verwerking moet daar volstrekt onverschillig onder zijn.

De schone manier is niet "check of ik dit al deed", maar **de database het laten afdwingen**:

```sql
-- Toegang is een verzameling, geen teller. Een unieke index maakt dubbel
-- toekennen fysiek onmogelijk.
CREATE UNIQUE INDEX toegang_uniek ON toegang (user_id, course_slug);
```

Met een `ON CONFLICT DO NOTHING` is een tweede webhook een no-op, ongeacht timing of parallelle verwerking. Dat is sterker dan een `if (order.status === 'paid') return;`, want dat laatste heeft een race tussen twee gelijktijdige webhooks.

**`src/app/api/mollie/webhook/route.ts`**

```ts
import { mollie } from "@/lib/mollie";
import { db } from "@/lib/db";
import { PaymentStatus } from "@mollie/api-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Mollie stuurt application/x-www-form-urlencoded
    const form = await request.formData();
    const paymentId = form.get("id");

    if (typeof paymentId !== "string" || !paymentId.startsWith("tr_")) {
      return new Response("OK", { status: 200 });   // geen info lekken
    }

    // NOOIT de status uit het verzoek: zelf ophalen bij Mollie.
    const payment = await mollie.payments.get(paymentId);

    const order = await db.order.findUnique({ where: { molliePaymentId: paymentId } });
    if (!order) {
      // Mollie: "it is recommended to return a 200 OK response even if the
      // ID is not known to your system."
      return new Response("OK", { status: 200 });
    }

    switch (payment.status) {
      case PaymentStatus.paid: {
        // Bedrag + valuta moeten kloppen met wat wij hebben vastgelegd.
        const betaaldeCenten = Math.round(parseFloat(payment.amount.value) * 100);
        if (payment.amount.currency !== order.valuta || betaaldeCenten < order.bedragCenten) {
          await db.order.update({
            where: { id: order.id },
            data: { status: "verdacht", opmerking: `Bedrag wijkt af: ${payment.amount.value}` },
          });
          console.error(`[mollie] bedrag mismatch op ${paymentId}`);
          return new Response("OK", { status: 200 });   // niet retryen, wel loggen
        }

        // Idempotent: de unieke index doet het werk.
        await db.$transaction(async (tx) => {
          await tx.toegang.createMany({
            data: {
              userId: order.userId,
              courseSlug: order.courseSlug,
              orderId: order.id,
              verleendOp: new Date(),
            },
            skipDuplicates: true,            // -> ON CONFLICT DO NOTHING
          });
          await tx.order.update({
            where: { id: order.id },
            data: { status: "betaald", betaaldOp: payment.paidAt ?? new Date() },
          });
        });

        // Ook dit idempotent maken: alleen mailen als de vlag nog niet stond.
        await stuurBevestigingsmailEenmalig(order.id);
        break;
      }

      case PaymentStatus.authorized:
        // Alleen bij captureMode 'manual' / bepaalde methodes. Nog geen geld.
        await db.order.update({ where: { id: order.id }, data: { status: "geautoriseerd" } });
        break;

      case PaymentStatus.failed:
      case PaymentStatus.expired:
      case PaymentStatus.canceled:
        // Nooit toegang intrekken die al verleend is: dit kan een tweede,
        // mislukte poging zijn nadat de eerste al slaagde.
        if (order.status !== "betaald") {
          await db.order.update({ where: { id: order.id }, data: { status: payment.status } });
        }
        break;

      case PaymentStatus.open:
      case PaymentStatus.pending:
      default:
        break;   // niets te doen
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[mollie webhook]", err);
    // 500 => Mollie probeert het opnieuw. Dat wil je bij een DB-storing.
    return new Response("Fout", { status: 500 });
  }
}
```

### Alle statussen

Uit https://docs.mollie.com/docs/handling-payment-status (en identiek aan de `PaymentStatus`-enum in de client):

| Status | Betekenis | Webhook? | Definitief? |
|---|---|---|---|
| `open` | "created, but nothing else has happened yet" | Nee | Nee |
| `pending` | "temporary status… Nothing really needs to happen on your end" | Nee | Nee |
| `authorized` | Alleen kaarten, Klarna, Billie, Riverty — geld gereserveerd, nog niet geïnd | **Ja** | Nee |
| `paid` | "successfully paid" | **Ja** | **Ja** |
| `canceled` | Klant heeft geannuleerd | **Ja** | **Ja** |
| `expired` | Verlopen/afgebroken. Bij SEPA-overboeking kan dit dagen duren | **Ja** | **Ja** |
| `failed` | Mislukt, kan niet met een andere methode worden voltooid | **Ja** | **Ja** |

Voor jouw geval (iDEAL + kaart, direct innen) zijn `paid`, `failed`, `expired` en `canceled` de relevante vier. `authorized` kom je alleen tegen bij kaartbetalingen met `captureMode: "manual"` — die zet je niet, dus die gaan direct naar `paid`.

Eén subtiliteit uit de docs die mensen verrast: als je géén `method` meegeeft en de klant annuleert op de methode-pagina, krijg je **geen** webhook — Mollie stuurt hem terug naar het keuzescherm. Pas als hij dáár annuleert wordt de status `canceled`.

### Twee valkuilen die je op Vercel gaat raken

1. **Middleware.** Als je `middleware.ts` (Next 15) of `proxy.ts` (Next 16) gebruikt om routes achter login te zetten, moet `/api/mollie/webhook` daarbuiten vallen. Mollie heeft geen sessiecookie. Zet het pad expliciet in je `matcher`-uitzondering.
2. **Vercel Deployment Protection.** Preview-deployments staan standaard achter authenticatie; Mollie krijgt dan een loginpagina en jouw webhook wordt nooit verwerkt. Test webhooks tegen productie of tegen een tunnel, niet tegen een beschermde preview.

En over redirects: "When our call to the webhook URL gets redirected with a `301 Moved Permanently` or `302 Found` response the request changes from POST to GET. This causes the POST payload to drop… The solution is to redirect using a `307 Temporary Redirect` or `308 Permanent Redirect`." Jouw `next.config.ts` gebruikt `permanent: true` (= 308), dus dat is veilig — maar registreer sowieso de definitieve URL (met of zonder `www`, precies zoals je canoniek kiest) zodat er helemaal geen redirect nodig is.

### Next-gen Webhooks: nog niet voor jou

Mollie heeft een tweede webhooksysteem (https://docs.mollie.com/reference/webhooks-new) met HMAC-SHA256-ondertekening via de `X-Mollie-Signature`-header, permanente event-abonnementen via de Webhooks API, en `POST /v2/webhooks/{webhookId}/ping` om te testen. Aantrekkelijk, maar Mollie's eigen advies is expliciet:

> "using classic webhooks for payment-related updates (until we make these event types available for Next-gen webhooks) and Next-gen for any non-payment actions."

**Onzeker:** de statuspagina spreekt zichzelf tegen — de klassieke webhookspagina (bijgewerkt 2026-01-16) noemt Next-gen nog "(beta)", terwijl de Next-gen-pagina (2026-07-01) ze onder "Global Events" plaatst. Hoe dan ook: voor betalingen blijf je bij de klassieke `webhookUrl`. Verifieer de status zelf in je dashboard onder Developers > Webhooks voordat je erop bouwt.

---

## 4. Lokaal testen

### Het probleem

> "Your webhook URL needs to be accessible from Mollie's point of view. This means that URL's like `localhost` will not be accepted."

Mollie weigert `localhost` al bij het aanmaken van de betaling — je krijgt een 422 met "The webhook URL is invalid". Je hebt dus een publieke URL nodig die naar je dev-server wijst.

### Tunnel opzetten

**Cloudflare Tunnel** — gratis, geen account nodig voor een wegwerp-URL:

```bash
winget install --id Cloudflare.cloudflared
cloudflared tunnel --url http://localhost:3000
# -> https://willekeurige-woorden.trycloudflare.com
```

**ngrok** — dit is wat Mollie zelf in de docs noemt:

```bash
ngrok http 3000
# -> https://abc123.ngrok-free.app  + een inspector op http://127.0.0.1:4040
```

De ngrok-inspector is het waard: je ziet daar het rauwe `id=tr_…`-lichaam binnenkomen en kunt een request **opnieuw afspelen** zonder een nieuwe betaling te doen. Dat is precies wat je wilt om je idempotentie te testen — speel dezelfde webhook drie keer af en controleer dat er één toegangsrij en één e-mail is.

Werk daarna zo:

```bash
# .env.local
MOLLIE_WEBHOOK_BASE_URL=https://abc123.ngrok-free.app
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # redirect mag wél localhost zijn
```

`redirectUrl` mag gewoon `localhost` blijven — die opent je eigen browser, niet Mollie's server. Alleen `webhookUrl` moet publiek.

Een gratis tunnel-URL verandert bij elke herstart. Zet hem in `.env.local` in plaats van hardcoded, en herstart de dev-server na een wijziging.

### Hoe testmodus werkt

Sleutel met `test_` erin en verder niets veranderen. Uit https://docs.mollie.com/reference/testing:

- "Any payments or other resources you create in test mode are completely isolated from your live mode data."
- "the regular checkout hosted payment pages will be replaced by a test mode checkout screen" — een scherm waarop je zelf de eindstatus kiest (paid / failed / expired / canceled). Zo test je alle vier de takken van je `switch` zonder een cent uit te geven.
- "the Mollie API behaves identical in both environments. **This includes calling your webhook.**" Dat is het punt: testmodus stuurt echte webhooks naar je tunnel.
- "In test mode, payment methods are activated immediately even when they show as pending." Handig — je hoeft niet te wachten tot iDEAL live is goedgekeurd.
- Alleen **EUR** wordt in testmodus ondersteund. Voor jou irrelevant.
- Betaalde testbetalingen krijgen een `changePaymentState`-URL (`payment.getChangePaymentStateUrl()`) waarmee je vanaf Mollie's pagina een **refund of chargeback** kunt afvuren. Zo test je de refund-webhook.

Kaartfouten test je met magische bedragen: € 1.007,00 → `insufficient_funds`, € 1.011,00 → `card_declined`, € 1.006,00 → `refused_by_issuer`, enzovoort (volledige tabel in de testing-docs). De testkaartnummers zijn `4543 4740 0224 9996` (VISA), `2223 0000 1047 9399` (Mastercard), `3782 822463 10005` (Amex) — met de kanttekening dat de verwerking altijd op Mastercard uitkomt.

### Een polling-fallback die je óók in productie wilt

Webhooks kunnen minuten later komen. De klant staat ondertussen op `/bedankt/[orderId]` naar een spinner te kijken. Bouw daarom op die pagina één server-side controle in: is de order nog `open` én is er een `molliePaymentId`, haal dan zelf de status op en verwerk hem via dezelfde functie als de webhook. Omdat die functie idempotent is, is de race met een gelijktijdige webhook onschadelijk — precies waarom die unieke index er staat.

Dit is bovendien je vangnet als de tunnel down is tijdens development, en het maakt de "eerste 30 seconden na betalen"-ervaring meteen goed.

---

## 5. Nederlandse verplichtingen bij digitale content

**Voorbehoud: ik ben geen jurist, en dit is geen juridisch advies.** Hieronder staat de letterlijke wettekst met vindplaats, plus wat dat technisch betekent. Laat de uiteindelijke tekst en het proces door een jurist controleren — bij een cursus met levenslange toegang zit er een reële kwalificatievraag in (zie de waarschuwing onderaan).

### De wettekst

**Artikel 6:230p sub g BW** (geverifieerd op https://wetten.overheid.nl/BWBR0005289/2026-01-01, Boek 6, Titel 5, Afdeling 2B — geldende tekst per 1 januari 2026):

> "De consument heeft geen recht van ontbinding bij: … g. een overeenkomst voor de levering van digitale inhoud die niet op een materiële drager is geleverd voor zover de nakoming is begonnen, en voor zover de overeenkomst voor de consument een betalingsverplichting inhoudt, indien:
> 1°. de nakoming is begonnen met uitdrukkelijke voorafgaande toestemming van de consument;
> 2°. de consument heeft verklaard dat hij daarmee afstand doet van zijn recht van ontbinding; en
> 3°. de handelaar een bevestiging heeft verstrekt als bedoeld in artikel 230t lid 2, of artikel 230v lid 7."

**Drie voorwaarden, cumulatief.** Veel oudere bronnen noemen er maar twee — die dateren van vóór de Omnibus-implementatie. Voorwaarde 3° (de bevestiging) is er echt en wordt vaak vergeten.

**Artikel 6:230v lid 7 BW** (de bevestiging bij verkoop op afstand):

> "De handelaar verstrekt de consument op een duurzame gegevensdrager binnen een redelijke termijn na het sluiten van de overeenkomst op afstand doch in ieder geval bij de levering van de zaken of voordat de dienst wordt uitgevoerd een bevestiging van de overeenkomst. Deze bevestiging omvat: a. alle in artikel 230m lid 1 bedoelde informatie, voor zover de handelaar deze niet voor het sluiten van de overeenkomst op een duurzame gegevensdrager heeft verstrekt; en b. voor zover van toepassing, **de bevestiging van de uitdrukkelijke voorafgaande toestemming en de verklaring van de consument overeenkomstig artikel 230p onderdeel g**."

Let op de timing: "voordat de dienst wordt uitgevoerd". De bevestigingsmail moet dus de deur uit **voordat** je de lessen ontsluit, of op zijn minst in dezelfde handeling.

**Wat er gebeurt als je het fout doet — artikel 6:230s lid 5:**

> "De consument draagt geen kosten voor: … [de levering van digitale inhoud die niet op een materiële drager is geleverd], indien: 1°. de consument er van te voren niet uitdrukkelijk mee heeft ingestemd dat de uitvoering kan beginnen voor het einde van de ontbindingstermijn; 2°. de verklaring van de consument als bedoeld in artikel 230p onderdeel g waarmee hij afstand doet van zijn recht van ontbinding ontbreekt; of 3°. de handelaar heeft verzuimd om de consument overeenkomstig artikel 230t lid 2 respectievelijk artikel 230v lid 7 een afschrift van de bevestiging te verstrekken."

Eén van de drie ontbreekt → 14 dagen ontbindingsrecht, volledige terugbetaling, ook als de klant de hele cursus heeft uitgekeken.

### Wat dat in de checkout betekent

**Een clausule in je algemene voorwaarden is niet genoeg.** Beide verklaringen moeten een aparte, actieve handeling zijn. Twee losse, niet-voorgevinkte checkboxen (of één checkbox die beide punten letterlijk noemt) direct boven de betaalknop:

```tsx
<label>
  <input type="checkbox" name="herroeping" required />
  Ik geef uitdrukkelijk toestemming dat Beleggingscollege direct na betaling
  begint met de levering van de cursus, en ik verklaar daarmee afstand te doen
  van mijn herroepingsrecht.
</label>
```

**De bestelknop.** Artikel 6:230v lid 3 is hier ook van toepassing en heeft harde tanden: de knop moet "op een goed leesbare wijze aangemerkt [worden] met een ondubbelzinnige formulering waaruit blijkt dat het plaatsen van de bestelling een betalingsverplichting jegens de handelaar inhoudt. **De enkele zinsnede 'bestelling met betalingsverplichting' wordt aangemerkt als een dergelijke ondubbelzinnige verklaring.** Een overeenkomst die in strijd met dit lid tot stand komt, is vernietigbaar."

Dus niet "Doorgaan" of "Naar Mollie", maar bijvoorbeeld **"Koop nu — € 49 (betalingsverplichting)"**. Volgens lid 2 moet je bovendien vlak vóór de knop nog eens de identiteit, totaalprijs, duur en minimumduur tonen.

### Wat je moet opslaan als bewijs

De bewijslast ligt bij jou. Sla per order op, onveranderlijk (append-only, geen `UPDATE` op deze velden):

| Kolom | Waarom |
|---|---|
| `herroeping_toestemming_op` (timestamptz) | Bewijst dat het **vóór** aanvang van de levering was |
| `herroeping_tekst_versie` | Bijv. `"herroeping-v1-2026-08"` — koppel dit aan een gearchiveerde kopie van de exacte zin. Over twee jaar moet je kunnen aantonen wát er stond. |
| `herroeping_tekst_hash` (sha256) | Sterker dan een versielabel: bewijst dat de tekst niet achteraf is gewijzigd |
| `herroeping_ip` | Uit `x-forwarded-for`, eerste waarde |
| `herroeping_user_agent` | Contextbewijs |
| `bevestiging_verzonden_op` | Voldoet aan voorwaarde 3° |
| `bevestiging_bericht_id` | Message-ID van de mail bij je provider — koppelt aan het afleverbewijs |
| `bevestiging_inhoud` of `_hash` | De exacte verstuurde tekst, inclusief de bevestiging van toestemming én afstandsverklaring |
| `toegang_verleend_op` | Bewijst dat de levering ná de toestemming begon |

Bewaartermijn: minimaal zolang de klant een vordering kan instellen. Fiscaal geldt sowieso de 7-jaars bewaarplicht voor de administratie; laat je jurist bevestigen wat hier redelijk is.

**Zet de bevestigingsmail vast in je flow**, niet als bijzaak: hij is een wettelijke voorwaarde voor het uitsluiten van het herroepingsrecht. Hij moet op een duurzame gegevensdrager (e-mail voldoet), en moet expliciet herhalen: *"U heeft op [datum, tijd] uitdrukkelijk toestemming gegeven om direct te beginnen met de levering en daarbij verklaard afstand te doen van uw herroepingsrecht."* Plus alle 6:230m lid 1-informatie die je niet al eerder op duurzame drager gaf.

### De kwalificatievraag die je aan een jurist moet voorleggen

Dit is de plek waar ik geen zekerheid kan geven, en waar veel e-learningaanbieders de fout in gaan.

`6:230p sub g` gaat over **digitale inhoud**. `6:230p sub d` gaat over **diensten**, en daar werkt de afstandsverklaring anders: de consument verklaart daar afstand te doen *"zodra de handelaar de overeenkomst is nagekomen"* — dus pas ná **volledige** nakoming vervalt het recht.

Bij "levenslange toegang" is volledige nakoming misschien nooit bereikt. Zou een rechter jouw aanbod als digitale **dienst** kwalificeren in plaats van digitale **inhoud**, dan werkt de sub g-route niet en houdt de klant zijn ontbindingsrecht — dan geldt bovendien `6:230s lid 4`, waarbij de klant alleen een evenredig deel verschuldigd is.

Argumenten dat het inhoud is: de video's en teksten zijn afgeronde bestanden die je eenmalig levert. Argumenten dat het een dienst is: doorlopende hosting, voortgangsopslag, updates, "levenslang". Jouw platform heeft ook gamification en een leerpad — dat trekt richting dienst.

Praktische mitigatie die je nu al kunt bouwen, ongeacht de uitkomst: **een coulance-terugbetalingsbeleid van 14 of 30 dagen.** Dan is de juridische vraag grotendeels academisch, je conversie gaat omhoog (een garantie verkoopt), en het past bij de merkbelofte "eerlijk beleggingsonderwijs, geen get-rich-quick". Mollie's Refunds API (`mollie.paymentRefunds.create`) maakt dat een paar regels code, en `/herroepingsrecht` bestaat al als pagina op je site.

---

## 6. Waar dit raakt aan "betaalde lesinhoud mag niet naar de browser"

Kort, want dat is het onderwerp van een ander spoor — maar de koppeling is het punt van dit hele verhaal.

De webhook is het **enige** pad waarlangs een rij in `toegang` ontstaat. Alles daarna leest alleen. Concreet betekent dat voor `src/app/cursussen/[slug]/les/[les]/page.tsx`:

- De lesinhoud mag niet meer uit `src/content/` in de client bundle komen. Nu importeert die pagina de cursusdata direct, waardoor Next alles in de RSC-payload zet — ongeacht of je het rendert.
- Server component → sessie ophalen → `SELECT 1 FROM toegang WHERE user_id = ? AND course_slug = ?` → geen rij, dan `notFound()` of een paywall-component en **vóór** de content-import stoppen.
- Video's/PDF's achter getekende, kortlevende URL's (bijv. S3/R2 presigned, of Mux signed playback tokens). Een entitlement-check op de pagina helpt niets als het bestand zelf publiek staat.
- Gratis proeflessen als expliciete `gratis: true` in het contentschema — whitelist, geen blacklist.

Dat is een aanpassing aan `src/content/types.ts` en de lespagina, geen Mollie-werk, maar het is wél waar de €49 zijn waarde ontleent.

---

## Bronnen

- [@mollie/api-client — npm](https://www.npmjs.com/package/@mollie/api-client) (versie 4.6.0 geverifieerd via `registry.npmjs.org`)
- [mollie/mollie-api-node — GitHub](https://github.com/mollie/mollie-api-node)
- [Create payment — Mollie](https://docs.mollie.com/reference/create-payment)
- [Webhooks — Mollie](https://docs.mollie.com/reference/webhooks)
- [Webhooks for the Payments API — Mollie](https://docs.mollie.com/reference/payments-api-webhooks)
- [Next-gen Webhooks — Mollie](https://docs.mollie.com/reference/webhooks-new)
- [Webhooks: Best practices — Mollie](https://docs.mollie.com/reference/webhooks-best-practices)
- [Handling payment status — Mollie](https://docs.mollie.com/docs/handling-payment-status)
- [Testing — Mollie](https://docs.mollie.com/reference/testing)
- [Authentication — Mollie](https://docs.mollie.com/reference/authentication)
- [API idempotency — Mollie](https://docs.mollie.com/reference/api-idempotency)
- [route.js — Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [serverExternalPackages — Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages)
- [Burgerlijk Wetboek Boek 6, art. 230p / 230s / 230v — wetten.overheid.nl](https://wetten.overheid.nl/BWBR0005289/2026-01-01/0/Boek6/Titeldeel5/Afdeling2B/Artikel230p)
- [Herroepingsrecht op digitale inhoud — ICTRecht](https://www.ictrecht.nl/blog/herroepingsrecht-op-digitale-inhoud-kun-je-dat-uitsluiten)
- [Uitzonderingen op het herroepingsrecht — Thuiswinkel.org](https://www.thuiswinkel.org/kennisbank/kennisartikelen/uitzonderingen-op-het-herroepingsrecht/)

Relevante projectbestanden: `C:\Users\jason\CodingProjects\Beleggingscollege\next.config.ts` (redirects staan al op 308, veilig voor webhooks), `C:\Users\jason\CodingProjects\Beleggingscollege\package.json` (Next ^15.4.0, nog geen Mollie-dependency), `C:\Users\jason\CodingProjects\Beleggingscollege\src\app\herroepingsrecht\page.tsx` (bestaande pagina, moet tekstueel aansluiten op de checkbox-tekst).