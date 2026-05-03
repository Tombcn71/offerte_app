import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function QuoteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  const { id } = params;
  const sql = neon(process.env.DATABASE_URL!);

  // 1. Haal alle data op uit de database
  const [quote] =
    await sql`SELECT * FROM quotes WHERE id = ${id} AND user_id = ${userId}`;
  if (!quote) return notFound();

  const items = await sql`SELECT * FROM quote_items WHERE quote_id = ${id}`;
  const [profile] =
    await sql`SELECT * FROM contractor_profile WHERE user_id = ${userId}`;

  // 2. Berekeningen
  const totalAmount = items.reduce((acc, item) => {
    // We rekenen uit: (uren * tarief + materiaal) + marge
    const base = item.hours * item.rate + Number(item.materials);
    const withMargin = base * (1 + item.margin / 100);
    return acc + withMargin;
  }, 0);

  const depositAmount = totalAmount * 0.3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-4">
      {/* Navigatie & Print Knop (onzichtbaar op print) */}
      <div className="flex justify-between items-center print:hidden">
        <Link
          href="/dashboard"
          className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">
          ← Terug naar dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition">
          PDF Opslaan / Printen
        </button>
      </div>

      {/* DE BRIEF (Het gedeelte dat geprint wordt) */}
      <div className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0 text-slate-900">
        {/* Header met jouw Logo */}
        <div className="flex justify-between items-start mb-16">
          <div>
            {profile?.logo_url ? (
              <img
                src={profile.logo_url}
                alt="Logo"
                className="h-20 object-contain mb-4"
              />
            ) : (
              <h2 className="text-3xl font-black text-blue-600 tracking-tighter uppercase">
                {profile?.company_name || "Mijn Bedrijf"}
              </h2>
            )}
            <p className="text-[10px] text-slate-400 mt-1 font-bold tracking-widest uppercase">
              {profile?.company_name} — Factuuradres:{" "}
              {profile?.address || "Adres niet ingesteld"}
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            <p>Offerte-nummer: #2026-{id.substring(0, 5).toUpperCase()}</p>
            <p>
              Datum: {new Date(quote.created_at).toLocaleDateString("nl-NL")}
            </p>
          </div>
        </div>

        {/* Introductie */}
        <div className="mb-12 space-y-6">
          <p className="font-black text-xl tracking-tight">
            Beste {quote.client_name},
          </p>
          <div className="text-slate-600 leading-relaxed text-base whitespace-pre-wrap italic">
            {quote.description ||
              `Hierbij ontvangt u de offerte voor het project "${quote.project_name}".`}
          </div>
        </div>

        {/* Tabel met werkzaamheden */}
        <div className="mb-10">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            Specificatie werkzaamheden
          </h3>
          <div className="border-t-2 border-slate-900">
            {items.map((item, index) => {
              const itemTotal =
                (item.hours * item.rate + Number(item.materials)) *
                (1 + item.margin / 100);
              return (
                <div
                  key={index}
                  className="flex justify-between py-5 border-b border-slate-100 items-start">
                  <div className="max-w-[70%]">
                    <p className="text-slate-800 font-bold text-sm">
                      {item.service}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase mt-1">
                      {item.category}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">
                    €{" "}
                    {itemTotal.toLocaleString("nl-NL", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financiële Afsluiting */}
        <div className="mt-12 space-y-4 bg-slate-50 p-8 rounded-3xl">
          <div className="flex justify-between items-center text-slate-500 font-bold text-xs uppercase tracking-widest">
            <span>Totaalbedrag (excl. BTW)</span>
            <span className="text-slate-900 text-xl font-black">
              €{" "}
              {totalAmount.toLocaleString("nl-NL", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <div>
              <p className="text-blue-600 font-black text-sm uppercase tracking-tight">
                Gevraagde aanbetaling (30%)
              </p>
              <p className="text-[10px] text-slate-400">
                Graag overmaken naar IBAN: {profile?.iban || "Onbekend"}
              </p>
            </div>
            <p className="text-3xl font-black text-blue-600">
              €{" "}
              {depositAmount.toLocaleString("nl-NL", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Footer Bedrijfsgegevens */}
        <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 gap-8">
          <div className="text-[10px] text-slate-400 font-medium space-y-1">
            <p className="font-bold text-slate-600 uppercase mb-1 underline">
              Voorwaarden
            </p>
            <p>* Deze offerte is 30 dagen geldig.</p>
            <p>* Planning wordt bevestigd na ontvangst aanbetaling.</p>
            <p>* Alle prijzen zijn exclusief 21% BTW.</p>
          </div>
          <div className="text-[10px] text-slate-400 font-medium text-right space-y-1">
            <p className="font-bold text-slate-600 uppercase mb-1 underline">
              Bedrijfsgegevens
            </p>
            <p>{profile?.company_name}</p>
            <p>KvK: {profile?.kvk_number || "—"}</p>
            <p>BTW: {profile?.btw_number || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
