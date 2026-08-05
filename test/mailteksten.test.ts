import { describe, expect, it } from "vitest";
import {
  BTW_TARIEF,
  KOR,
  btwUitBruto,
  orderbevestigingMail,
} from "@/lib/mailteksten";
import { HERROEPING_TEKST_VERSIE } from "@/lib/mollie";
import { SITE_URL } from "@/lib/site";

/**
 * De orderbevestiging is niet alleen service maar een wettelijk document: de
 * derde voorwaarde waaronder het herroepingsrecht vervalt, én de bon met het
 * btw-bedrag. test/orderbevestiging.test.ts bewaakt het verzendpad; hier
 * bewaken we wat er ín de mail staat — vooral het rekenwerk.
 */

function voorbeeld(bedragCenten = 4900) {
  return orderbevestigingMail({
    voornaam: "Jason",
    cursusnaam: "Waardebeleggen",
    cursusSlug: "waardebeleggen",
    aantalLessen: 21,
    bedragCenten,
    datum: new Date("2026-08-03T12:00:00"),
    ordernummer: "BC-2026-0001",
  });
}

describe("btwUitBruto", () => {
  it("haalt 21% uit een brutobedrag: €49,00 = €40,50 + €8,50 btw", () => {
    expect(btwUitBruto(4900)).toEqual({ netto: 4050, btw: 850 });
  });

  it("rondt netjes bij bedragen die niet glad delen: €29,00 = €23,97 + €5,03", () => {
    expect(btwUitBruto(2900)).toEqual({ netto: 2397, btw: 503 });
  });

  it("netto + btw is ALTIJD exact het brutobedrag — er verdwijnt geen cent", () => {
    for (const centen of [1, 99, 100, 2900, 4900, 14999, 123457]) {
      const { netto, btw } = btwUitBruto(centen);
      expect(netto + btw).toBe(centen);
      expect(btw).toBeGreaterThanOrEqual(0);
    }
  });

  it("de vastgelegde fiscale keuze: geen KOR, tarief 21%", () => {
    // Bevestigd op 2 aug 2026. Wie KOR of het tarief wijzigt, moet ook de
    // mailtekst langs (een KOR-ondernemer mag géén btw-bedrag vermelden).
    expect(KOR).toBe(false);
    expect(BTW_TARIEF).toBe(0.21);
  });
});

describe("orderbevestigingMail — inhoud", () => {
  it("onderwerp noemt de cursus", () => {
    expect(voorbeeld().onderwerp).toBe(
      "Bevestiging van je aankoop: Waardebeleggen"
    );
  });

  it("bedragen staan in euronotatie met komma en de btw-splitsing klopt", () => {
    const { tekst } = voorbeeld();
    expect(tekst).toContain("Totaalbedrag: € 49,00 inclusief btw");
    expect(tekst).toContain("Waarvan btw (21%): € 8,50");
    expect(tekst).toContain("bedrag exclusief btw: € 40,50");
  });

  it("de verplichte kerngegevens staan in de tekst zelf, niet achter een link", () => {
    const { tekst } = voorbeeld();
    expect(tekst).toContain("Ordernummer: BC-2026-0001");
    expect(tekst).toContain("Datum: 3 augustus 2026");
    expect(tekst).toContain("KvK-nummer: 71856633");
    expect(tekst).toContain(`${SITE_URL}/cursussen/waardebeleggen`);
    expect(tekst).toContain("21 lessen");
  });

  it("verwijst naar de exacte versie van de herroepingstekst die is aangevinkt", () => {
    expect(voorbeeld().tekst).toContain(HERROEPING_TEKST_VERSIE);
  });

  it("aanhef met en zonder voornaam", () => {
    expect(voorbeeld().tekst).toContain("Hoi Jason,");
    const anoniem = orderbevestigingMail({
      voornaam: "",
      cursusnaam: "Waardebeleggen",
      cursusSlug: "waardebeleggen",
      aantalLessen: 21,
      bedragCenten: 4900,
      datum: new Date("2026-08-03T12:00:00"),
      ordernummer: "BC-2026-0002",
    });
    expect(anoniem.tekst).toContain("Hoi,\n");
  });

  it("Hefboomproducten (€29, de afwijkende prijs) rekent net zo goed rond", () => {
    const { tekst } = voorbeeld(2900);
    expect(tekst).toContain("Totaalbedrag: € 29,00 inclusief btw");
    expect(tekst).toContain("Waarvan btw (21%): € 5,03");
    expect(tekst).toContain("bedrag exclusief btw: € 23,97");
  });
});

describe("orderbevestigingMail — HTML-versie", () => {
  it("maakt links klikbaar en behoudt de tekst", () => {
    const { html } = voorbeeld();
    expect(html).toContain(
      `<a href="${SITE_URL}/cursussen/waardebeleggen" style="color:#0072CE">`
    );
    expect(html).toContain("Ordernummer: BC-2026-0001");
  });

  it("laat sluitende leestekens buiten de href (geen klikbare 404 in de wettelijke tekst)", () => {
    // In de echte testmail van 5 aug 2026 werden `…/account).` en
    // `…/voorwaarden,` klikbare 404-links: de regex nam het leesteken mee de
    // href in. De verwijzingen staan juist in de wettelijke bevestiging.
    const { html } = voorbeeld();

    // Een URL gevolgd door `).`: de href stopt vóór de `)` en `.`.
    expect(html).toContain(
      `<a href="${SITE_URL}/account" style="color:#0072CE">${SITE_URL}/account</a>).`
    );
    // En gevolgd door een komma.
    expect(html).toContain(
      `<a href="${SITE_URL}/voorwaarden" style="color:#0072CE">${SITE_URL}/voorwaarden</a>,`
    );
    // Geen enkele href eindigt op een leesteken.
    expect(html).not.toMatch(/href="[^"]*[.,;:!?)\]]"/);
  });

  it("ontsnapt HTML in variabele invoer (een cursusnaam kan geen script injecteren)", () => {
    const kwaad = orderbevestigingMail({
      voornaam: "<b>Jason</b>",
      cursusnaam: "Cursus <script>alert(1)</script> & meer",
      cursusSlug: "waardebeleggen",
      aantalLessen: 21,
      bedragCenten: 4900,
      datum: new Date("2026-08-03T12:00:00"),
      ordernummer: "BC-2026-0003",
    });
    expect(kwaad.html).not.toContain("<script>");
    expect(kwaad.html).toContain("&lt;script&gt;");
    expect(kwaad.html).toContain("&amp; meer");
    expect(kwaad.html).not.toContain("<b>Jason</b>");
  });
});
