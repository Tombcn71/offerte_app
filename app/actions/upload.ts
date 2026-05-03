"use server";
import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function uploadLogo(formData: FormData) {
  const { userId } = await auth();
  const file = formData.get("logo") as File;

  // Upload naar Vercel Cloud
  const blob = await put(`logos/${userId}-${file.name}`, file, {
    access: "public",
  });

  // Sla link op in DB
  const sql = neon(process.env.DATABASE_URL!);
  await sql`UPDATE contractor_profile SET logo_url = ${blob.url} WHERE user_id = ${userId}`;

  return blob.url;
}
