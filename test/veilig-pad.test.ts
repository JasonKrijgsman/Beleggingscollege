import { describe, expect, it } from "vitest";
import { veiligTerugPad } from "@/lib/veilig-pad";

/**
 * Regressietest voor de open redirect via /inloggen?terug= (CODEX-102).
 * Alleen een intern pad mag erdoor; al het andere wordt /leerpad.
 */

describe("veiligTerugPad", () => {
  it("laat de paden door die de site zelf als terug-parameter aanmaakt", () => {
    // Dit zijn de vier echte producenten van ?terug= in de codebase.
    expect(veiligTerugPad("/account")).toBe("/account");
    expect(veiligTerugPad("/cursussen/waardebeleggen")).toBe(
      "/cursussen/waardebeleggen"
    );
    expect(veiligTerugPad("/cursussen/waardebeleggen/les/wat-is-waarde")).toBe(
      "/cursussen/waardebeleggen/les/wat-is-waarde"
    );
    expect(veiligTerugPad("/cursussen/waardebeleggen/gekocht")).toBe(
      "/cursussen/waardebeleggen/gekocht"
    );
  });

  it("valt zonder parameter terug op /leerpad", () => {
    expect(veiligTerugPad(undefined)).toBe("/leerpad");
    expect(veiligTerugPad(null)).toBe("/leerpad");
  });

  it("weigert absolute URL's naar andere sites", () => {
    expect(veiligTerugPad("https://kwaadaardig.example")).toBe("/leerpad");
    expect(veiligTerugPad("http://kwaadaardig.example/phish")).toBe("/leerpad");
  });

  it("weigert protocol-relatieve en backslash-varianten", () => {
    // "//host" neemt het protocol van de pagina over en verlaat de site.
    expect(veiligTerugPad("//kwaadaardig.example")).toBe("/leerpad");
    // Browsers lezen "\" als "/", dus "/\host" is verkapt "//host".
    expect(veiligTerugPad("/\\kwaadaardig.example")).toBe("/leerpad");
    expect(veiligTerugPad("/pad\\..\\elders")).toBe("/leerpad");
  });

  it("weigert andere schema's en niet-paden", () => {
    expect(veiligTerugPad("javascript:alert(1)")).toBe("/leerpad");
    expect(veiligTerugPad("data:text/html,x")).toBe("/leerpad");
    expect(veiligTerugPad("leerpad")).toBe("/leerpad");
    expect(veiligTerugPad("")).toBe("/leerpad");
  });

  it("weigert stuurtekens en witruimte (header-injectie)", () => {
    expect(veiligTerugPad("/pad\r\nSet-Cookie:x=1")).toBe("/leerpad");
    expect(veiligTerugPad("/pad\tmet-tab")).toBe("/leerpad");
    expect(veiligTerugPad("/pad met spatie")).toBe("/leerpad");
    expect(veiligTerugPad("/pad" + String.fromCharCode(0) + "nul")).toBe("/leerpad");
  });

  it("weigert alles wat geen string is (dubbele querystring-parameters)", () => {
    // ?terug=a&terug=b komt in Next als array binnen.
    expect(veiligTerugPad(["/account", "//kwaadaardig.example"])).toBe(
      "/leerpad"
    );
    expect(veiligTerugPad(42)).toBe("/leerpad");
    expect(veiligTerugPad({})).toBe("/leerpad");
  });
});
