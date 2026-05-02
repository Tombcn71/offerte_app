import { sql } from "@/lib/db";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let recentQuotes: any[] = [];
  let stats = { total: 0, amount: 0 };

  try {
    recentQuotes = await sql`
      SELECT * FROM "quotes" 
      WHERE "user_id" = ${userId} 
      ORDER BY "created_at" DESC 
      LIMIT 5
    `;

    const statsResult = await sql`
      SELECT COUNT(*) as count, SUM(CAST(total_price AS NUMERIC)) as total_sum 
      FROM "quote_items" 
      WHERE "quote_id" IN (SELECT id FROM "quotes" WHERE "user_id" = ${userId})
    `;

    stats = {
      total: Number(statsResult[0]?.count) || 0,
      amount: Number(statsResult[0]?.total_sum) || 0,
    };
  } catch (e) {
    console.error("DB Error:", e);
  }

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header - Stacked op mobiel, Row op desktop */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-slate-500">
            Beheer je offertes en klanten.
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg text-center w-full md:w-auto">
          + Nieuwe Offerte
        </Link>
      </div>

      {/* Stats Cards - 1 kolom mobiel, 3 kolommen desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">
            Totaal Projecten
          </p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900">
            {stats.total}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">
            Totale Waarde
          </p>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">
            €
            {stats.amount.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">
            Status
          </p>
          <p className="text-2xl md:text-3xl font-bold text-green-600">
            Actief
          </p>
        </div>
      </div>

      {/* Tabel Sectie */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">
            Recente Offertes
          </h2>
          <Link
            href="/dashboard/quotes"
            className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline">
            Alle offertes →
          </Link>
        </div>

        {/* Swipe-bare container voor de tabel op mobiel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] md:min-w-full">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Project</th>
                <th className="px-6 py-4 font-semibold">Klant</th>
                <th className="px-6 py-4 font-semibold">Datum</th>
                <th className="px-6 py-4 font-semibold text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentQuotes.map((quote: any) => (
                <tr key={quote.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {quote.project_name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {quote.client_name}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(quote.created_at).toLocaleDateString("nl-NL")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/quotes/${quote.id}`}
                      className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition">
                      Bekijken
                    </Link>
                  </td>
                </tr>
              ))}
              {recentQuotes.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-400">
                    Geen offertes gevonden. Start door een nieuwe aan te maken.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
