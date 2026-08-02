// Toont hoe de orderbevestiging eruitziet, zonder iets te versturen.
// Draaien met: npx tsx scripts/mail-voorbeeld.mjs
import { orderbevestigingMail } from "../src/lib/mailteksten.ts";

const mail = orderbevestigingMail({
  voornaam: "Jason",
  cursusnaam: "Ontdek Waardebeleggen",
  cursusSlug: "waardebeleggen",
  bedragCenten: 4900,
  datum: new Date("2026-08-02T14:30:00Z"),
  aantalLessen: 6,
  ordernummer: "BC-2026-0001",
});

console.log("ONDERWERP: " + mail.onderwerp);
console.log("=".repeat(70));
console.log(mail.tekst);
