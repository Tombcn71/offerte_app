"use server";

import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function createQuote(formData: {
  projectName: string;
  clientName: string;
  items: any[];
  description?: string; // STAP 1: Voeg dit toe aan de type definitie
}) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Je moet ingelogd zijn om een offerte te maken." };
  }

  // STAP 2: Destructureer de description uit formData
  const { projectName, clientName, items, description } = formData;

  let success = false;

  try {
    await sql.begin(async (sql) => {
      // STAP 3: Voeg de kolom 'description' toe aan de INSERT query
      const [quote] = await sql`
        INSERT INTO quotes (project_name, client_name, user_id, description)
        VALUES (${projectName}, ${clientName}, ${userId}, ${description || ""})
        RETURNING id
      `;

      const insertRows = items.map((item) => ({
        quote_id: quote.id,
        // Let op: 'description' in quote_items is de regel-tekst (bijv: "Badkamer: Tegels")
        // De 'description' van de quote zelf is de AI-begeleidende tekst.
        description: `${item.category}: ${item.service}`,
        hours: item.hours || 0,
        hourly_rate: item.rate || 0,
        material_costs: item.materials || 0,
        margin_pct: item.margin || 0,
        total_price:
          (Number(item.hours || 0) * Number(item.rate || 0) +
            Number(item.materials || 0)) *
          (1 + Number(item.margin || 0) / 100),
      }));

      await sql`
        INSERT INTO quote_items ${sql(
          insertRows,
          "quote_id",
          "description",
          "hours",
          "hourly_rate",
          "material_costs",
          "margin_pct",
          "total_price",
        )}
      `;
    });

    success = true;
  } catch (error) {
    console.error("Database error:", error);
    return {
      error:
        "Fout bij opslaan in de database. Controleer of alle velden correct zijn.",
    };
  }

  if (success) {
    redirect("/dashboard");
  }
}
