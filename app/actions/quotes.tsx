"use server";

import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";

// We definiëren hier exact wat er binnenkomt
export async function createQuote(data: {
  projectName: string;
  clientName: string;
  items: any[];
  description: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Niet ingelogd");

  const sql = neon(process.env.DATABASE_URL!);
  let newQuoteId: string | null = null;

  try {
    // 1. Maak de offerte aan
    const [quote] = await sql`
      INSERT INTO quotes (project_name, client_name, user_id, description)
      VALUES (${data.projectName}, ${data.clientName}, ${userId}, ${data.description})
      RETURNING id
    `;

    newQuoteId = quote.id;

    // 2. Loop door de items en gebruik de namen uit jouw database
    for (const item of data.items) {
      // Berekening voor jouw 'total_price' kolom
      const hours = Number(item.hours) || 0;
      const rate = Number(item.rate) || 0;
      const materials = Number(item.materials) || 0;
      const margin = Number(item.margin) || 0;

      const basePrice = hours * rate + materials;
      const totalPrice = basePrice * (1 + margin / 100);

      await sql`
        INSERT INTO quote_items (
          quote_id, 
          category, 
          description, 
          hours, 
          hourly_rate, 
          material_costs, 
          margin_pct,
          total_price
        )
        VALUES (
          ${newQuoteId}, 
          ${item.category}, 
          ${item.service}, 
          ${hours}, 
          ${rate}, 
          ${materials}, 
          ${margin},
          ${totalPrice}
        )
      `;
    }
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Kon de offerte niet opslaan." };
  }

  // 3. Redirect naar de pagina die we net hebben gemaakt
  if (newQuoteId) {
    redirect(`/dashboard/quotes/${newQuoteId}`);
  }
}
