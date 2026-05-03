import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import ProfileForm from "@/app/components/ProfileForm";

export default async function ProfielPage() {
  const { userId } = await auth();
  const sql = neon(process.env.DATABASE_URL!);

  const [profile] =
    await sql`SELECT * FROM contractor_profile WHERE user_id = ${userId} LIMIT 1`;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Bedrijfsprofiel
        </h1>
        <p className="text-slate-500">
          Beheer je bedrijfsgegevens voor op de offertes.
        </p>
      </header>

      <ProfileForm profile={profile} />
    </div>
  );
}
