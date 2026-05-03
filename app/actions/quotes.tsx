"use server";

import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";

export async function createQuote(data: {
  projectName: string;
  clientName: string;
  items: any[];
  description: string; // Voeg dit toe zodat TS niet klaagt
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Niet ingelogd");

  const sql = neon(process.env.DATABASE_URL!);
  let quoteId: string;

  try {
    // 1. Maak de offerte aan en sla de AI beschrijving op
    const [quote] = await sql`
      INSERT INTO quotes (project_name, client_name, user_id, description)
      VALUES (${data.projectName}, ${data.clientName}, ${userId}, ${data.description})
      RETURNING id
    `;

    quoteId = quote.id;

    // 2. Sla alle losse werkzaamheden op in de 'quote_items' tabel
    // We gebruiken een for-loop om alle items uit de array erin te zetten
    for (const item of data.items) {
      await sql`
        INSERT INTO quote_items (quote_id, category, service, hours, rate, materials, margin)
        VALUES (
          ${quoteId}, 
          ${item.category}, 
          ${item.service}, 
          ${item.hours}, 
          ${item.rate}, 
          ${item.materials}, 
          ${item.margin}
        )
      `;
    }
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Kon de offerte niet opslaan in de database." };
  }

  // 3. Stuur de gebruiker door naar de overzichtspagina of de PDF-weergave
  redirect(`/dashboard/quotes/${quoteId}`);
}
