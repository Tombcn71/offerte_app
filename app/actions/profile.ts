"use server";

import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Niet ingelogd" };

  const sql = neon(process.env.DATABASE_URL!);

  // We halen alleen de tekstvelden op
  const company_name = formData.get("company_name") as string;
  const address = formData.get("address") as string;
  const kvk_number = formData.get("kvk_number") as string;
  const btw_number = formData.get("btw_number") as string;
  const iban = formData.get("iban") as string;

  try {
    await sql`
      INSERT INTO contractor_profile (user_id, company_name, address, kvk_number, btw_number, iban)
      VALUES (${userId}, ${company_name}, ${address}, ${kvk_number}, ${btw_number}, ${iban})
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        company_name = EXCLUDED.company_name,
        address = EXCLUDED.address,
        kvk_number = EXCLUDED.kvk_number,
        btw_number = EXCLUDED.btw_number,
        iban = EXCLUDED.iban
      -- Let op: we updaten logo_url hier NIET, zodat die bewaard blijft
    `;

    revalidatePath("/dashboard/profiel");
    return { success: true };
  } catch (error) {
    return { error: "Opslaan mislukt" };
  }
}
