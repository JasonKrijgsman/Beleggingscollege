import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { auth } from "@/auth";
import { beheerSessie, isBeheerder } from "@/lib/beheer";

/**
 * beheerSessie()/isBeheerder() is de enige autorisatiepoort voor /beheer en de
 * moderatie-API — het spiegelbeeld van heeftToegangTot() voor betaalde cursussen.
 * Deze tests bewaken de kern: wie is beheerder, wie niet, hoofdletter- en
 * spatie-ongevoeligheid, de BEHEER_EMAILS-terugval, en vooral dat een
 * ontbrekende variabele NIEMAND toelaat (de veilige, dichte kant).
 */

const authMock = vi.mocked(auth);

function zetSessie(email: string | null) {
  authMock.mockResolvedValue((email ? { user: { email } } : null) as never);
}

beforeEach(() => {
  delete process.env.ADMIN_EMAILS;
  delete process.env.BEHEER_EMAILS;
  zetSessie(null);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("beheerSessie / isBeheerder", () => {
  it("uitgelogd: niemand is beheerder, ook met een gevulde lijst", async () => {
    process.env.ADMIN_EMAILS = "jason@example.com";
    zetSessie(null);
    expect(await beheerSessie()).toBeNull();
    expect(await isBeheerder()).toBe(false);
  });

  it("ingelogd adres staat in ADMIN_EMAILS: beheerder, en de sessie komt terug", async () => {
    process.env.ADMIN_EMAILS = "jason@example.com";
    zetSessie("jason@example.com");
    expect(await isBeheerder()).toBe(true);
    const sessie = await beheerSessie();
    expect(sessie?.user?.email).toBe("jason@example.com");
  });

  it("matcht hoofdletterongevoelig en met spaties rond de adressen", async () => {
    process.env.ADMIN_EMAILS = " Jason@Example.COM , iemand@anders.nl ";
    zetSessie("jason@example.com");
    expect(await isBeheerder()).toBe(true);
  });

  it("ingelogd maar niet in de lijst: geen beheerder", async () => {
    process.env.ADMIN_EMAILS = "jason@example.com";
    zetSessie("indringer@example.com");
    expect(await isBeheerder()).toBe(false);
  });

  it("valt terug op BEHEER_EMAILS als ADMIN_EMAILS ontbreekt", async () => {
    process.env.BEHEER_EMAILS = "jason@example.com";
    zetSessie("jason@example.com");
    expect(await isBeheerder()).toBe(true);
  });

  it("ADMIN_EMAILS gaat vóór: is die gezet zonder het adres, dan telt BEHEER_EMAILS niet mee", async () => {
    process.env.ADMIN_EMAILS = "iemand@anders.nl";
    process.env.BEHEER_EMAILS = "jason@example.com";
    zetSessie("jason@example.com");
    expect(await isBeheerder()).toBe(false);
  });

  it("geen enkele variabele gezet: niemand is beheerder, ook een geldige sessie niet", async () => {
    zetSessie("jason@example.com");
    expect(await isBeheerder()).toBe(false);
  });

  it("sessie zonder e-mailadres: geen beheerder", async () => {
    process.env.ADMIN_EMAILS = "jason@example.com";
    authMock.mockResolvedValue({ user: {} } as never);
    expect(await isBeheerder()).toBe(false);
  });
});
