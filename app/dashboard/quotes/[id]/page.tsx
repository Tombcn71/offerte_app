import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import PrintButton from "@/app/components/PrintButton"; // Importeer je eigen knop

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;
  const sql = neon(process.env.DATABASE_URL!);

  // 1. Data ophalen
  const [quote] =
    await sql`SELECT * FROM quotes WHERE id = ${id} AND user_id = ${userId}`;
  if (!quote) return notFound();

  const items = await sql`SELECT * FROM quote_items WHERE quote_id = ${id}`;
  const [profile] =
    await sql`SELECT * FROM contractor_profile WHERE user_id = ${userId}`;

  // 2. Totaal berekenen
  const totalAmount = items.reduce(
    (acc, item) => acc + Number(item.total_price || 0),
    0,
  );
  const depositAmount = totalAmount * 0.3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-4">
      {/* Navigatie balk */}
      <div className="flex justify-between items-center print:hidden">
        <Link
          href="/dashboard"
          className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">
          ← Terug naar dashboard
        </Link>

        {/* HIER GEBRUIKEN WE JOUW KNOP */}
        <PrintButton />
      </div>

      {/* De Brief */}
      <div className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0 text-slate-900">
        {/* Header */}
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
              {profile?.company_name} —{" "}
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

        {/* Intro */}
        <div className="mb-12 space-y-6">
          <p className="font-black text-xl tracking-tight">
            Beste {quote.client_name},
          </p>
          <div className="text-slate-600 leading-relaxed text-base whitespace-pre-wrap italic">
            {quote.description}
          </div>
        </div>

        {/* Items Tabel */}
        <div className="mb-10">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            Specificatie
          </h3>
          <div className="border-t-2 border-slate-900">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between py-5 border-b border-slate-100 items-start">
                <div>
                  <p className="text-slate-800 font-bold text-sm">
                    {item.description}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase mt-1">
                    {item.category}
                  </p>
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  €{" "}
                  {Number(item.total_price).toLocaleString("nl-NL", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financiën */}
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
                Aanbetaling (30%)
              </p>
              <p className="text-[12px] text-slate-600">
                IBAN: {profile?.iban || "Onbekend"}
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

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 gap-8 text-[10px] text-slate-400 uppercase font-bold">
          <div className="space-y-1">
            <p className="text-slate-600 underline">Voorwaarden</p>
            <p>Geldigheid: 30 dagen</p>
            <p>Prijzen excl. 21% BTW</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-slate-600 underline">Gegevens</p>
            <p>KvK: {profile?.kvk_number}</p>
            <p>BTW: {profile?.btw_number}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
