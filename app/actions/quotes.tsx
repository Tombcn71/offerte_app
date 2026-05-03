"use server";

import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";

export async function createQuote(data: {
  projectName: string;
  clientName: string;
  items: any[];
  description: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Niet ingelogd");

  const sql = neon(process.env.DATABASE_URL!);
  let newQuoteId: string | null = null; // We slaan de ID hier op om later te redirecten

  try {
    // 1. Maak de offerte aan
    const [quote] = await sql`
      INSERT INTO quotes (project_name, client_name, user_id, description)
      VALUES (${data.projectName}, ${data.clientName}, ${userId}, ${data.description})
      RETURNING id
    `;

    newQuoteId = quote.id;

    // 2. Sla alle items op
    for (const item of data.items) {
      await sql`
        INSERT INTO quote_items (quote_id, category, service, hours, rate, materials, margin)
        VALUES (
          ${newQuoteId}, 
          ${item.category}, 
          ${item.service}, 
          ${Number(item.hours)}, 
          ${Number(item.rate)}, 
          ${Number(item.materials)}, 
          ${Number(item.margin)}
        )
      `;
    }
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Kon de offerte niet opslaan." };
  }

  // 3. De redirect moet ALTIJD buiten het try/catch blok staan
  if (newQuoteId) {
    redirect(`/dashboard/quotes/${newQuoteId}`);
  }
}
