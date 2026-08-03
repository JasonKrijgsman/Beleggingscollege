import { expect, test } from "@playwright/test";

/**
 * De rooktest: bewijst in één run dat de gebouwde site echt werkt, op de
 * paden die geld of vertrouwen kosten als ze stuk zijn. Geen vervanging van
 * de unittests — dit is de "staat de winkel eigenlijk wel open?"-controle.
 *
 * De aannames over teksten staan bewust op merkzinnen en vaste UI-labels
 * ("Test je kennis", "Controleer"), niet op lesinhoud die nog kan groeien.
 */

test("de homepage staat en draagt de eerlijke boodschap", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Beleggingscollege/);
  await expect(
    page.getByText("Eerlijk beleggingsonderwijs, geen snelle-rijkdom-praatjes")
  ).toBeVisible();
});

test("het cursusoverzicht linkt naar elke cursus uit de catalogus", async ({
  page,
}) => {
  await page.goto("/cursussen");
  for (const slug of [
    "beleggen-voor-beginners",
    "waardebeleggen",
    "technische-analyse",
    "beleggingspsychologie",
    "opties-begrijpen",
    "beschermen-en-verdienen-met-opties",
    "volatiliteit-en-spreads",
    "hefboomproducten",
    "indexbeleggen",
  ]) {
    await expect(
      page.locator(`a[href="/cursussen/${slug}"]`).first()
    ).toBeVisible();
  }
});

test("een gratis les is open en de hele quiz is door te lopen", async ({
  page,
}) => {
  await page.goto("/cursussen/beleggen-voor-beginners/les/waarom-beleggen");
  await expect(
    page.getByRole("heading", { level: 1, name: "Waarom beleggen?" })
  ).toBeVisible();
  await expect(page.getByText("Test je kennis")).toBeVisible();

  // Klik de quiz volledig door (het antwoord mag fout zijn; het gaat erom
  // dat de keten optie → Controleer → Volgende → resultaat werkt).
  for (let vraag = 0; vraag < 20; vraag++) {
    await page.locator("button.text-left").first().click();
    await page.getByRole("button", { name: "Controleer" }).click();
    const klaar = page.getByRole("button", { name: "Bekijk resultaat" });
    if (await klaar.isVisible()) {
      await klaar.click();
      break;
    }
    await page.getByRole("button", { name: "Volgende vraag" }).click();
  }

  await expect(page.getByText("Les afgerond!")).toBeVisible();
  await expect(page.getByText("Quizscore:")).toBeVisible();
});

test("een betaalde les blijft dicht én lekt geen lesinhoud", async ({
  page,
}) => {
  const response = await page.goto(
    "/cursussen/waardebeleggen/les/wat-is-waardebeleggen"
  );
  expect(response?.status()).toBe(200);
  await expect(
    page.getByText("Deze les hoort bij een betaalde cursus")
  ).toBeVisible();

  // De les zelf mag de server nooit verlaten hebben: een kenmerkende zin uit
  // de eerste sectie hoort nergens in de opgehaalde HTML te staan. (De
  // bundelcontrole doet dit dieper; dit is de laatste-linie-check op de
  // pagina zoals een bezoeker hem krijgt.)
  const html = await page.content();
  expect(html).not.toContain("pindakaas");
  expect(html).not.toContain("Prijs en waarde zijn niet hetzelfde");
});
