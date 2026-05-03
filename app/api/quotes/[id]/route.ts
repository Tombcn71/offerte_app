import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    if (!quoteId) {
      return NextResponse.json({ error: "Geen ID gevonden" }, { status: 400 });
    }

    // We halen alles op uit de quotes tabel (inclusief de 'description' kolom)
    const [quote] = await sql`SELECT * FROM quotes WHERE id = ${quoteId}`;

    // We halen de losse werkzaamheden op
    const items =
      await sql`SELECT * FROM quote_items WHERE quote_id = ${quoteId}`;

    if (!quote) {
      return NextResponse.json(
        { error: "Offerte niet gevonden" },
        { status: 404 },
      );
    }

    return NextResponse.json({ quote, items });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 });
  }
}
