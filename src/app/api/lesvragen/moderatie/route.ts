import { NextResponse, type NextRequest } from "next/server";
import { isBeheerder } from "@/lib/beheer";
import { modereer } from "@/lib/lesvragen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Beantwoorden of afwijzen — uitsluitend voor de beheerder. */
export async function POST(request: NextRequest) {
  if (!(await isBeheerder())) {
    // Zelfde antwoord als bij een 404: dit endpoint bevestigt zijn bestaan
    // niet aan wie er niets te zoeken heeft.
    return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const actie = body?.actie;
  if (!id || (actie !== "beantwoord" && actie !== "afgewezen")) {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }

  const resultaat = await modereer(id, actie, body?.antwoord);
  if (!resultaat.ok) {
    return NextResponse.json(
      { error: "Antwoord ontbreekt of is te lang." },
      { status: 400 }
    );
  }
  return NextResponse.json({ ok: true });
}
