"use server";

import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function addService(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Niet geautoriseerd");

  const sql = neon(process.env.DATABASE_URL!);

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const rate = formData.get("rate") as string;
  const unit = formData.get("unit") as string;

  try {
    await sql`
      INSERT INTO services (user_id, name, category, rate, unit)
      VALUES (${userId}, ${name}, ${category}, ${Number(rate)}, ${unit})
    `;

    // Zorg dat de pagina direct de nieuwe lijst laat zien
    revalidatePath("/dashboard/tarieven");
    return { success: true };
  } catch (error) {
    console.error("Fout bij opslaan service:", error);
    return { error: "Kon het tarief niet opslaan." };
  }
}
