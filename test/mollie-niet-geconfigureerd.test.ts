import { describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

// De andere betaaltests zetten mollieIsGeconfigureerd hard op true; dit
// bestand dekt de andere kant: zonder MOLLIE_API_KEY moet de winkel netjes
// dicht zijn (503 bij afrekenen) en moet de webhook stil 200 antwoorden
// zonder ergens aan te komen.

const h = vi.hoisted(() => ({
  auth: vi.fn(),
  paymentsGet: vi.fn(),
  paymentsCreate: vi.fn(),
  bevestiging: vi.fn(),
}));

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: h.auth }));
vi.mock("@/lib/orderbevestiging", () => ({ stuurOrderbevestiging: h.bevestiging }));
vi.mock("@/lib/mollie", async (importOriginal) => {
  const orig = await importOriginal<typeof import("@/lib/mollie")>();
  return {
    ...orig,
    mollieIsGeconfigureerd: false,
    mollie: () =>
      ({
        payments: { get: h.paymentsGet, create: h.paymentsCreate },
      }) as unknown as ReturnType<typeof orig.mollie>,
  };
});

import { POST as checkoutPOST } from "@/app/api/checkout/route";
import { POST as webhookPOST } from "@/app/api/mollie/webhook/route";

describe("zonder MOLLIE_API_KEY", () => {
  it("checkout: 503 en er wordt niets geprobeerd — geen sessie, geen betaling", async () => {
    const res = await checkoutPOST(
      new Request("https://example.test/api/checkout", {
        method: "POST",
        body: JSON.stringify({ slug: "waardebeleggen", herroepingAkkoord: true }),
        headers: { "content-type": "application/json" },
      }) as unknown as NextRequest
    );
    expect(res.status).toBe(503);
    expect(h.auth).not.toHaveBeenCalled();
    expect(h.paymentsCreate).not.toHaveBeenCalled();
  });

  it("webhook: rustig 200 zonder Mollie te bellen of iets te muteren", async () => {
    const res = await webhookPOST(
      new Request("https://example.test/api/mollie/webhook", {
        method: "POST",
        body: new URLSearchParams({ id: "tr_wat_dan_ook" }),
        headers: { "content-type": "application/x-www-form-urlencoded" },
      })
    );
    expect(res.status).toBe(200);
    expect(h.paymentsGet).not.toHaveBeenCalled();
    expect(h.bevestiging).not.toHaveBeenCalled();
  });
});
