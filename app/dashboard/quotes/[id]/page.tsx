import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import PrintButton from "@/app/components/PrintButton";

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

  // 2. Berekeningen
  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.total_price || 0),
    0,
  );
  const discountAmount = subtotal * 0.05;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const btwAmount = subtotalAfterDiscount * 0.21;
  const totalInclBtw = subtotalAfterDiscount + btwAmount;

  return (
    <div className="max-w-[850px] mx-auto pb-20 p-4 font-sans text-black leading-tight">
      {/* Navigatie (onzichtbaar bij print) */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link
          href="/dashboard"
          className="text-sm font-bold text-slate-500 hover:underline">
          ← Terug
        </Link>
        <PrintButton />
      </div>

      <div className="bg-white p-12 border border-slate-100 shadow-sm print:border-none print:p-0">
        {/* HEADER: Alleen Logo en Bedrijfsgegevens, geen titels */}
        <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-12">
          <div className="flex items-center gap-6">
            {profile?.logo_url ? (
              <img
                src={profile.logo_url}
                alt="Logo"
                className="h-24 w-auto object-contain"
              />
            ) : (
              <div className="h-16 w-16 bg-black flex items-center justify-center text-white font-black text-xl">
                {profile?.company_name?.substring(0, 1)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black uppercase">
                {profile?.company_name}
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {profile?.address}
              </p>
            </div>
          </div>
          <div className="text-right text-[10px] font-bold uppercase space-y-1">
            <p className="text-slate-400">
              Datum: {new Date(quote.created_at).toLocaleDateString("nl-NL")}
            </p>
            <p>Kenmerk: #2026-{id.substring(0, 5).toUpperCase()}</p>
          </div>
        </div>

        {/* Adresblokken */}
        <div className="grid grid-cols-2 gap-20 mb-16 text-[13px]">
          <div className="space-y-1 text-slate-600">
            <p className="font-bold border-b border-black mb-3 uppercase text-[10px] text-black">
              Opdrachtgever
            </p>
            <p className="font-bold text-black text-base">
              {quote.client_name}
            </p>
            <p>{quote.client_email}</p>
          </div>
          <div className="space-y-1 text-right text-slate-600">
            <p className="font-bold border-b border-black mb-3 uppercase text-[10px] text-black text-right">
              Opdrachtnemer
            </p>
            <p className="font-bold text-black text-base">
              {profile?.company_name}
            </p>
            <p>{profile?.email}</p>
            <p>
              KvK: {profile?.kvk_number} | BTW: {profile?.btw_number}
            </p>
          </div>
        </div>

        {/* De Werkzaamheden */}
        <div className="mb-12">
          <h3 className="font-bold uppercase text-xs mb-6 border-l-4 border-black pl-4">
            Specificatie van de werkzaamheden
          </h3>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-slate-200 text-left font-bold text-[10px] text-slate-400">
                <th className="py-2">Onderdeel</th>
                <th className="py-2">Nummer</th>
                <th className="py-2 text-right">Aantal</th>
                <th className="py-2 text-right">Tarief</th>
                <th className="py-2 text-right">Bedrag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="py-4 font-bold">{item.description}</td>
                  <td className="py-4 text-slate-400 font-mono text-[10px]">
                    ABC0{i + 1}
                  </td>
                  <td className="py-4 text-right">
                    {Number(item.quantity).toFixed(2)}
                  </td>
                  <td className="py-4 text-right">
                    €{" "}
                    {Number(item.price).toLocaleString("nl-NL", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 text-right font-bold text-black">
                    €{" "}
                    {Number(item.total_price).toLocaleString("nl-NL", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rekensom */}
        <div className="flex justify-end mb-20">
          <div className="w-64 space-y-2 text-[13px] border-t-2 border-black pt-4">
            <div className="flex justify-between">
              <span>Subtotaal:</span>
              <span>
                €{" "}
                {subtotal.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-400 italic text-xs">
              <span>Korting (5%):</span>
              <span>
                - €{" "}
                {discountAmount.toLocaleString("nl-NL", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2">
              <span>BTW 21%:</span>
              <span>
                €{" "}
                {btwAmount.toLocaleString("nl-NL", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between font-black text-lg border-t-2 border-black pt-2">
              <span>Totaal:</span>
              <span>
                €{" "}
                {totalInclBtw.toLocaleString("nl-NL", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Tekstblokken */}
        <div className="space-y-8 text-[13px] mb-20 leading-relaxed max-w-2xl">
          <p>
            De werkzaamheden worden uitgevoerd op locatie van de opdrachtgever (
            {quote.client_name}), conform opgave.
          </p>
          <p>
            Genoemde bedragen zijn exclusief 21% B.T.W. Meerwerk kan in overleg
            worden uitgevoerd tegen uurtarief van €{" "}
            {profile?.hourly_rate || "55,00"} excl. BTW.
          </p>
          <p className="italic text-slate-600">
            Ik vertrouw erop dat deze opgave u aanleiding zal zijn uw opdracht
            aan mij te verlenen.
          </p>
          <div className="pt-4">
            <p>Met vriendelijke groet,</p>
            <p className="font-bold uppercase mt-1">{profile?.company_name}</p>
          </div>
        </div>

        {/* Antwoordformulier */}
        <div className="border-t-4 border-black pt-12 mt-20">
          <h2 className="text-xl font-black uppercase mb-8 border-b border-black pb-2">
            Antwoordformulier
          </h2>
          <div className="grid grid-cols-2 gap-8 text-[12px] mb-12">
            <p className="border-b border-slate-200 pb-1">
              Kenmerk: #2026-{id.substring(0, 5).toUpperCase()}
            </p>
            <p className="border-b border-slate-200 pb-1">
              Start project: ...........................................
            </p>
          </div>

          <div className="space-y-12">
            <div className="bg-slate-50 p-6">
              <p className="text-[12px] font-bold mb-1">Investering</p>
              <p className="text-xl font-black italic">
                €{" "}
                {totalInclBtw.toLocaleString("nl-NL", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-16 pt-10">
              <div className="space-y-8">
                <p className="font-bold text-[10px] tracking-widest border-b border-black pb-1 uppercase">
                  Akkoordverklaring
                </p>
                <div className="space-y-4">
                  <p className="border-b border-slate-300 pb-1 text-[11px]">
                    Naam: {quote.client_name}
                  </p>
                  <p className="border-b border-slate-300 pb-1 text-[11px]">
                    Datum: ...........................................
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg h-44 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Handtekening
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
