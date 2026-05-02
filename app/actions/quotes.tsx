"use server";

import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function createQuote(formData: {
  projectName: string;
  clientName: string;
  items: any[];
}) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Je moet ingelogd zijn om een offerte te maken." };
  }

  const { projectName, clientName, items } = formData;

  // We gebruiken een variabele om bij te houden of de database actie geslaagd is
  let success = false;

  try {
    await sql.begin(async (sql) => {
      const [quote] = await sql`
        INSERT INTO quotes (project_name, client_name, user_id)
        VALUES (${projectName}, ${clientName}, ${userId})
        RETURNING id
      `;

      const insertRows = items.map((item) => ({
        quote_id: quote.id,
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

  // Belangrijk: redirect ALTIJD buiten het try-catch blok!
  if (success) {
    redirect("/dashboard");
  }
}
