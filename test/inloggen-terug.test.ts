import { beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    // Net als in Next zelf onderbreekt redirect() het renderen met een throw.
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("@/auth", () => ({ auth: vi.fn(), signIn: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: h.redirect }));

import { auth } from "@/auth";
import InloggenPage from "@/app/inloggen/page";

/**
 * Regressietest op paginaniveau voor de open redirect (CODEX-102): niet
 * alleen de validator moet kloppen (test/veilig-pad.test.ts), de pagina moet
 * hem ook echt gebruiken. Zonder deze test kan iemand de aanroep weghalen en
 * blijven alle validatortests groen.
 */

const authMock = vi.mocked(auth);

async function openInloggen(terug?: string) {
  try {
    await InloggenPage({
      searchParams: Promise.resolve(terug === undefined ? {} : { terug }),
    });
    return null;
  } catch (fout) {
    const melding = (fout as Error).message;
    if (melding.startsWith("REDIRECT:")) return melding.slice("REDIRECT:".length);
    throw fout;
  }
}

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue({ user: { id: "u1" } } as never);
});

describe("/inloggen?terug= met een bestaande sessie", () => {
  it("stuurt door naar een intern pad", async () => {
    expect(await openInloggen("/cursussen/waardebeleggen")).toBe(
      "/cursussen/waardebeleggen"
    );
  });

  it("valt zonder terug-parameter terug op /leerpad", async () => {
    expect(await openInloggen()).toBe("/leerpad");
  });

  it("stuurt een externe URL naar /leerpad in plaats van de vreemde site", async () => {
    expect(await openInloggen("https://kwaadaardig.example")).toBe("/leerpad");
    expect(await openInloggen("//kwaadaardig.example")).toBe("/leerpad");
    expect(await openInloggen("/\\kwaadaardig.example")).toBe("/leerpad");
  });

  it("zonder sessie wordt er niet doorgestuurd", async () => {
    authMock.mockResolvedValue(null as never);
    const resultaat = await openInloggen("//kwaadaardig.example");
    expect(resultaat).toBeNull();
    expect(h.redirect).not.toHaveBeenCalled();
  });
});
