import { sql } from "@/lib/db";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let recentQuotes = [];
  let stats = { total: 0, amount: 0 };

  try {
    // 1. Haal de quotes op (geforceerd met quotes om kolom-errors te voorkomen)
    recentQuotes = await sql`
      SELECT * FROM "quotes" 
      WHERE "user_id" = ${userId} 
      ORDER BY "created_at" DESC 
      LIMIT 5
    `;

    // 2. Haal simpele stats op voor de blokken bovenaan
    const statsResult = await sql`
      SELECT COUNT(*) as count, SUM(CAST(total_price AS NUMERIC)) as total_sum 
      FROM "quote_items" 
      WHERE "quote_id" IN (SELECT id FROM "quotes" WHERE "user_id" = ${userId})
    `;

    stats = {
      total: statsResult[0]?.count || 0,
      amount: statsResult[0]?.total_sum || 0,
    };
  } catch (e) {
    console.error("DB Error:", e);
  }

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Beheer je offertes en klanten.</p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
          + Nieuwe Offerte
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Totaal Projecten</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Totale Waarde</p>
          <p className="text-3xl font-bold text-blue-600">
            €{Number(stats.amount).toLocaleString("nl-NL")}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Status</p>
          <p className="text-3xl font-bold text-green-600">Actief</p>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Recente Offertes</h2>
          <Link
            href="/dashboard/quotes"
            className="text-sm text-blue-600 hover:underline">
            Alle offertes →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
                    className="px-6 py-10 text-center text-slate-400">
                    Geen data gevonden voor deze gebruiker.
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
