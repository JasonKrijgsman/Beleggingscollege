# Domain Migration Plan: beleggingscollege.nl (Strato → new registrar + Cloudflare DNS + Vercel)

*Researched: 2 August 2026. Prices verified on registrar websites on that date — re-check at checkout, promos and tariffs change.*

> **Status 3 augustus 2026 (einde middag) — lees dit eerst; de blokkade hieronder is verplaatst.**
>
> **DNSSEC is eraf en de naamservers staan op Cloudflare.** Het DS-record is weg bij de registry
> (geverifieerd via `ns1.dns.nl`, 1.1.1.1 en 8.8.8.8) en Strato's paneel meldt "DNSSEC: Niet
> actief". Daarmee kwam het NS-formulier vrij; `joan.ns.cloudflare.com` en
> `rene.ns.cloudflare.com` zijn opgeslagen en de delegatie stond **binnen 10 minuten** bij SIDN.
>
> **De `.nl` was daarbij ongeveer 10 minuten onbereikbaar, en dat hoort erbij.** Strato weigert
> de zone (REFUSED) op het moment dat je eigen naamservers instelt, terwijl SIDN nog naar Strato
> delegeert — elke resolver geeft dan SERVFAIL. Niet in paniek terugdraaien: dit lost zichzelf
> op zodra de delegatie is gepubliceerd. Reken op minuten, niet op de 24 uur die Strato noemt.
>
> **Migadu is Actief** sinds 2026-08-03T15:51:18Z. Geen "Rerun Checks" nodig — Migadu zag de
> records zelf. SPF, alle drie de DKIM-CNAME's en DMARC (`p=quarantine`) stonden er vóór de
> activering, dus er kan niets ongetekend uit.
>
> **WAT NOG BLOKKEERT: de Providerwissel.** Twee pogingen op 3 aug eindigden allebei in
> "Er is een fout opgetreden. Probeer het later opnieuw." Er wordt niets half toegepast — het
> domein blijft op "geactiveerd" staan. De voor de hand liggende oorzaken zijn uitgesloten:
> DNSSEC is uit, **Domain Guard staat uit** (de domeinpagina biedt hem nog aan), en de
> naamserverwissel was al volledig bij SIDN geland. Een timeout aan Strato's kant is de
> overgebleven verklaring. Info-ID's voor een supportticket:
> `583e2640g1785771338 - 7206355` en `9a72ac2eg1785772381 - 7206355`.
>
> **Doodlopend spoor, niet opnieuw inlopen:** het menu-item Contracten → **Domeinverhuizing**
> is *intern* ("domeinen uit je pakket verhuizen naar een ander pakket"). Dat is niet de weg
> naar buiten. De Opzegging-wizard is de enige zelfbedieningsroute.
>
> **Geverifieerd, niet meer aangenomen:** de verhuiscode gaat naar het e-mailadres van de
> domeinhouder, en dat is **jason_k56@hotmail.com** (Domeinhoudergegevens, gecontroleerd 3 aug).
> Geen oud adres, en niet `beheer@beleggingscollege.nl` — dat laatste zou circulair zijn.
>
> **Geen haast.** Het domein is geregistreerd tot 20-08-2027. De einddatum 02-09-2026 die in de
> wizard gekozen is, bestaat pas zodra een opzegging daadwerkelijk registreert — en dat is niet
> gebeurd.
>
> ---
>
> **Status 2 augustus 2026 — historisch, hierboven ingehaald.**
>
> De site staat inmiddels **live op https://beleggingscollege.com** (Cloudflare-DNS → Vercel).
> Die `.com` is bewust als tijdelijk adres gebruikt omdat de `.nl` vastzit bij Strato.
>
> **De verhuizing van de `.nl` is geblokkeerd** door Strato's DNSSEC-deactivering: het DS-record
> stond op 3 aug nog steeds bij SIDN en Strato's paneel meldt "Wordt gedeactiveerd". Zolang dat
> loopt is het domein op slot — de naamserverpagina is grijs en de Providerwissel eindigt in
> "Er is een fout opgetreden". Zie de sectie **⚠️ Gotcha** verderop.
>
> Controleer de stand met (Windows PowerShell — `nslookup` kan géén DS-records opvragen en geeft
> een misleidend antwoord):
> ```powershell
> Resolve-DnsName beleggingscollege.nl -Type DS -Server 1.1.1.1
> ```
> Geen antwoord = DNSSEC is eraf, en dan kunnen de naamserverwissel én de Providerwissel wél door.
>
> **Wat er daarna nog moet gebeuren:** naamservers naar Cloudflare (mail via Migadu wordt dan
> live, daarna beheer@ aanmaken), Providerwissel → verhuiscode per e-mail naar
> jason_k56@hotmail.com, transfer naar Porkbun (~$7,83), `NEXT_PUBLIC_SITE_URL` in Vercel op de
> `.nl` zetten, permanente redirect `.com` → `.nl` toevoegen, en pas als laatste het
> Strato-pakket opzeggen.

## Goal

Move `beleggingscollege.nl` away from Strato to the cheapest sensible registrar, manage its DNS on Cloudflare's free plan (next to `beleggingscollege.com`), and point it at the new Next.js site on Vercel. No traditional webhosting package needed — registration + DNS only.

**Important finding:** Cloudflare Registrar does **not** support .nl (checked Cloudflare's TLD policies page and community forum, Feb 2026 threads still list it as unsupported). So the .nl cannot sit at Cloudflare Registrar like the .com does. However, Cloudflare can still be the **DNS provider** for the .nl (free plan, "full setup") regardless of where it is registered — so day-to-day management still happens in the same Cloudflare dashboard as the .com.

## Recommendation

**Transfer `beleggingscollege.nl` to Porkbun (~$7.83/yr ≈ €7/yr, flat for registration, renewal and transfer), and run DNS on Cloudflare free.**

Runner-up if you prefer an EU registrar with EUR billing: **INWX** (~€10.50/yr) or **Netim** (€12.00/yr excl. VAT, free inbound transfer).

The Dutch "household names" (TransIP, Versio, Mijndomein) are no longer cheap for .nl renewals — they lure with €0.01–€0.49 first-year promos and charge €15–26/yr (excl. BTW) on renewal.

### Price comparison — .nl renewal price per year (what you actually pay from year 2)

| Registrar | Renewal / yr (excl. VAT) | ≈ incl. 21% BTW | Notes |
|---|---|---|---|
| **Porkbun** | **$7.83 (≈ €6.75–7.00)** | USD price; US registrar, typically no EU VAT added | Same flat price for register / renew / transfer. Free WHOIS privacy. |
| **INWX** (Germany) | ≈ €10.50 | site shows €10.50 (VAT treatment not stated; likely incl. for consumers) | Solid EU registrar, EUR billing. |
| **Netim** (France) | €12.00 | ≈ €14.52 | Inbound transfer free. |
| **Mijndomein** | ≈ €15.00 | ≈ €18.15 | Criticized for hidden renewal pricing. |
| **TransIP** | €16.50 | ≈ €19.97 | €0.49 first-year promo, then expensive. |
| **Versio** | €25.99 (1-yr term; €15.59/yr on a 4-yr term) | ≈ €31.45 | Feb 2026 tariff increase. Avoid. |
| **Openprovider** | ≈ $14.66 retail; "cost price" (~€5) only with paid membership from ~$50/yr | — | Reseller platform; membership never pays off for 1 domain. |
| **Strato (domain-only, for reference)** | ≈ €5.95 | **€7.20 incl. BTW** (€0.12 first year) | Strato's *domain-only* product is actually cheap — it's the hosting package that costs money. |

*Cloudflare DNS: €0. Vercel Hobby tier: €0. So total recurring cost after migration ≈ €7–13/yr for the .nl (plus the .com you already pay at Cloudflare), versus the current Strato hosting package (typically €5–10+/month).*

Note on Strato: if the goal were *only* saving money on the domain itself, downgrading to Strato's bare domain product (€7.20/yr incl. BTW) would already be cheap — but Strato's DNS panel is limited, you want to leave Strato entirely, and Porkbun is still cheaper. The real saving comes from cancelling the hosting package.

---

## Current DNS inventory (public lookup, 3 Aug 2026)

Captured via public DNS — this is the complete visible zone, so Phase 0 step 2 is essentially done:

| Record | Name | Value |
|---|---|---|
| NS | @ | `docks14.rzone.de`, `shades19.rzone.de` (Strato) |
| A | @ | `81.169.145.93` (Strato webserver) |
| AAAA | @ | `2a01:238:20a:202:1093::` |
| CNAME | www | `beleggingscollege.nl` |
| MX | @ | `smtp.rzone.de` (pref 5) → **mail is hosted at Strato** |
| TXT | @ | *none* (no SPF/DKIM/verification records to migrate) |

Implications: recreate exactly these records in Cloudflare (keeps the old site + mail working during the transition). **The `beheer@beleggingscollege.nl` mailbox lives in the Strato package** — set up its replacement (e.g. Cloudflare Email Routing forward + new SPF record) before cancelling the package. There are no other hidden records to worry about.

## Step-by-step migration

Steps marked **[OWNER]** require the Strato/registrar account credentials or payment — those are yours to do. Unmarked steps can be prepared/assisted by anyone.

### Phase 0 — Salvage & inventory (do this FIRST, before cancelling anything)

1. **[OWNER] Back up the WordPress site at Strato.** Export the database (phpMyAdmin in the Strato panel or a plugin like All-in-One WP Migration / UpdraftPlus) and download `wp-content` (uploads, themes, plugins) via FTP. Also do a WordPress XML export (Tools → Export) as a cheap extra copy. You need this content to rebuild pages in the Next.js app — once the Strato package is cancelled, it is gone.
2. **[OWNER] Inventory DNS records at Strato.** In the Strato panel, note every record for `beleggingscollege.nl`: A/AAAA, CNAME, **MX**, **TXT (SPF/DKIM/DMARC, verification records)**, SRV. Screenshot or copy them.
3. **[OWNER] Check for email on the domain.** Are there `@beleggingscollege.nl` mailboxes or forwards at Strato? If yes, this is the biggest migration risk:
   - Export/backup mail (IMAP copy to another account).
   - Decide the future mail setup. Cloudflare is DNS only — it does not host mailboxes. Free option: **Cloudflare Email Routing** (forwards `info@beleggingscollege.nl` → your hotmail). Paid options: any mail host (e.g. Zoho, Migadu, Google Workspace).
4. Check the Strato contract renewal date (**"Je contract"** in the package overview). Time the cancellation so you don't slide into another prepaid year (notice period applies — see Phase 3). Prepaid remainder is **not refunded**, so there's no rush to cancel mid-term, but don't miss the cutoff.

### Phase 1 — Set up DNS at Cloudflare (zero risk, do before the transfer)

5. **[OWNER]** In the Cloudflare dashboard (same account as beleggingscollege.com): **Add a domain** → `beleggingscollege.nl` → Free plan. Cloudflare scans and imports existing records — verify against your Phase 0 inventory and add anything missing (especially MX/TXT). Cloudflare shows you two assigned nameservers (e.g. `x.ns.cloudflare.com` / `y.ns.cloudflare.com`).
6. **[OWNER] At Strato, change the domain's nameservers to the two Cloudflare nameservers** (Strato panel → domain settings → nameserver/DNS settings). If DNSSEC is enabled at Strato, disable it first. Wait for propagation and confirm the site/email still work exactly as before. Doing this *before* the transfer means the transfer itself causes **zero downtime** — a .nl transfer preserves the nameserver delegation.
   - If Strato won't let you set external nameservers on your package, skip this and set the Cloudflare nameservers at the new registrar immediately after the transfer instead (brief risk window; keep records identical to minimize it).

### ⚠️ Gotcha discovered in practice (3 Aug 2026): DNSSEC blocks everything

At Strato, **DNSSEC deactivation locks the whole domain object** while it processes:

- The NS-record form stays greyed out ("Deze optie is inactief. Schakel DNSSEC uit om de NS-records aan te kunnen passen") even after the DS record is already gone from the SIDN registry.
- The Providerwissel/cancellation wizard fails at the final step with a useless generic error ("Er is een fout opgetreden. Probeer het later opnieuw") — it does **not** partially apply, the domain simply stays Actief.
- Strato's DNSSEC page shows the real state: `DNSSEC: Wordt gedeactiveerd`. Strato allows **up to 24 hours**.

**So: deactivate DNSSEC FIRST, then wait until the panel shows it fully off, and only then do the nameserver switch and the Providerwissel.** Trying earlier just wastes attempts. Verify the registry side independently with:

```bash
nslookup -type=DS beleggingscollege.nl ns1.dns.nl
```

(Registry DS removal happens quickly; Strato's internal flag is the slow part.)

### Phase 2 — Transfer the domain (SIDN .nl transfer)

How .nl transfers work (SIDN rules): you need a **verhuiscode / transfer token** from the losing registrar (they are obliged to hand it over within 5 days of your request); a .nl token does **not expire**; SIDN charges the holder nothing; the transfer usually completes **within one working day**, often within minutes–hours. The gaining registrar's transfer fee typically includes one year of registration (Porkbun: transfer carries over/starts one year at $7.83).

7. **[OWNER] Put the domain "in opzegging" at Strato and request the verhuiscode.** Strato quirk: the Authinfo/verhuiscode is only available **after** you cancel the domain. In the Strato customer login: **Contract wijzigen → Contract beëindigen**, select the domain and — critically — choose **"Providerwissel"** (release for transfer to another provider), **NOT "Verwijderen bij registry"** (which deletes the domain!). Once the domain shows status "opzegging ontvangen", click **"Authinfo-code verzenden"** in the domain list. The code is emailed within 24h **to the domain holder's email address** — which may differ from your Strato account email, so check that the holder email is one you can read (old addresses are a classic gotcha). Transfer-out is free at Strato.
8. **[OWNER] Start the transfer at Porkbun** (or INWX/Netim): porkbun.com/transfer → enter `beleggingscollege.nl` + the verhuiscode → pay ~$7.83. Use your normal (Dutch) address details for the registrant. Approve any confirmation email that SIDN/the registrar sends to the admin contact.
9. When the transfer completes (typically same day): **[OWNER]** in the Porkbun dashboard, confirm the **nameservers are the two Cloudflare ones** from step 5 (set them if the registrar replaced them with its defaults). Turn on auto-renew and check the renewal payment method. Enable WHOIS privacy (free at Porkbun; SIDN hides private-person data by default anyway).

### Phase 3 — Cancel the Strato hosting package

10. **[OWNER] Only after (a) the WordPress content is safely backed up and (b) the domain transfer has completed:** cancel the remaining Strato hosting package. Strato customer login → **Contract wijzigen → Contract beëindigen → "Volledig pakket opzeggen"**. Key gotchas, from Strato's own FAQ:
    - **Transferring the domain away does NOT cancel the package** — the package keeps renewing (and billing) until you cancel it separately, with its normal notice period.
    - Cancellation itself is free, but **prepaid amounts for the remaining term are not refunded**.
    - Check the notice period in the terms / "Je contract" so the cancellation lands before the next 12-month renewal.

### Phase 4 — Point the domain at Vercel (when the Next.js site is ready)

11. **[OWNER]** In the Vercel project (Hobby/free tier supports custom domains): Settings → Domains → add `beleggingscollege.nl` and `www.beleggingscollege.nl`.
12. **[OWNER]** In Cloudflare DNS for `beleggingscollege.nl`:
    - Apex: **A record** `@` → `76.76.21.21` (use the exact value Vercel's dashboard shows for your project — Vercel has been introducing newer per-project values like `216.198.79.x`). Remove any old A/AAAA records for `@` pointing at Strato.
    - `www`: **CNAME** → `cname.vercel-dns.com` (again, prefer the exact value Vercel shows).
    - Set both records to **DNS-only (grey cloud)** at least until Vercel has verified the domain and issued its SSL certificate. You can leave them DNS-only permanently (simplest — Vercel has its own CDN/SSL), or re-enable the orange-cloud proxy afterwards — but then set Cloudflare SSL/TLS mode to **Full (strict)**, never "Flexible" (Flexible causes an infinite redirect loop, `ERR_TOO_MANY_REDIRECTS`).
13. Keep MX/TXT records for mail (or set up Cloudflare Email Routing) — pointing the website at Vercel doesn't touch mail as long as those records stay.

---

## Pitfalls checklist

- [ ] WordPress database + `wp-content` + XML export downloaded **before** cancelling the Strato package.
- [ ] All DNS records (especially MX and TXT/SPF/DKIM) copied to Cloudflare **before** changing nameservers.
- [ ] Email plan decided if `@beleggingscollege.nl` mailboxes exist (Cloudflare doesn't host mail; Email Routing = forwarding only).
- [ ] In Strato's cancellation flow: choose **Providerwissel**, never "Verwijderen bij registry".
- [ ] Verhuiscode goes to the **domain holder's** email address — verify it's an address you can access before cancelling.
- [ ] Cancel the Strato **package** separately from the domain; mind the notice period; no refund of prepaid remainder.
- [ ] Don't initiate the transfer in the last days before Strato's cancellation deadline — leave buffer for the 24h code email.
- [ ] Cloudflare records DNS-only (grey cloud) while Vercel verifies/issues SSL; if proxying later, SSL mode = Full (strict).
- [ ] Auto-renew ON at the new registrar with a working payment method (a lapsed .nl goes into 40 days quarantine and reclaiming it is expensive).

## Expected annual cost after migration

| Item | Cost / yr |
|---|---|
| beleggingscollege.nl @ Porkbun | ≈ €7 ($7.83) |
| DNS @ Cloudflare (free plan) | €0 |
| Hosting @ Vercel (Hobby) | €0 |
| **Total** | **≈ €7/yr** (vs. a Strato hosting package, typically €60–120+/yr) |

With INWX instead of Porkbun: ≈ €10.50/yr. With Netim: ≈ €14.52/yr incl. BTW.

## Sources

- Cloudflare supported TLDs: https://developers.cloudflare.com/registrar/top-level-domains/ and https://www.cloudflare.com/tld-policies/ (.nl absent)
- Cloudflare community on .nl support: https://community.cloudflare.com/t/support-for-nl-domain-tlds/895826
- Cloudflare full-setup DNS with third-party registrar (free plan): https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/
- Porkbun .nl pricing: https://porkbun.com/tld/nl and https://porkbun.com/products/domains ; transfers: https://porkbun.com/transfer , https://kb.porkbun.com/article/56-how-to-transfer-domain-to-porkbun
- INWX .nl: https://www.inwx.de/de/nl-domain
- Netim .nl: https://www.netim.com/domain-name/nl-domain.html
- TransIP .nl pricing: https://www.transip.nl/domeinnaam/nl-domein/ and https://www.transip.nl/beschikbare-domeinextensies/
- Versio Feb 2026 tariffs: https://www.versio.nl/kennisbank/bestellen-administratief/faq-tarieven-februari-2026
- Mijndomein renewal pricing (review): https://www.hostingwijzer.nl/mijndomein-review/
- Openprovider membership model: https://www.openprovider.com/membership-plans
- Strato .nl domain price: https://www.strato.nl/domeinnaam/
- Strato verhuiscode procedure: https://www.strato.nl/faq/domeinnaam/hoe-krijg-ik-de-verhuiscode-van-mijn-domeinnaam/
- Strato provider switch / contract: https://www.strato.nl/faq/domeinnaam/hoe-werkt-een-providerwissel-en-hoe-beeindig-ik-het-contract-van-mijn-domein/
- Strato online cancellation: https://www.strato.nl/faq/contract/online-opzeggen-vanuit-de-klantenlogin/
- .nl token validity / SIDN rules: https://support.wned.nl/kennisbank/domeinnamen-algemeen/geldigheidsduur-verhuiscodes , https://pcpatrol.nl/domeinnaam-verhuizen-naar-een-andere-registrar-stappenplan-verhuiscode-en-valkuilen-per-extensie/
- Vercel apex A record: https://vercel.com/kb/guide/a-record-and-caa-with-vercel ; Cloudflare+Vercel proxy/SSL guidance: https://www.promptstoproduct.com/how-to-set-up-custom-domain-vercel
