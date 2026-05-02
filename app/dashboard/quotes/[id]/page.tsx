"use client"; // <--- Dit is de "magische" regel. Hiermee mag onClick wel!

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function QuoteDetailPage() {
  const params = useParams();
  const [data, setData] = useState<{ quote: any; items: any[] } | null>(null);

  // We halen de data op via de browser (client-side)
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/quotes/${params.id}`);
      const json = await response.json();
      setData(json);
    }
    if (params.id) fetchData();
  }, [params.id]);

  if (!data) return <div className="p-10 text-center">Laden...</div>;

  const { quote, items } = data;
  const totalAmount = items.reduce(
    (acc, item) => acc + Number(item.total_price),
    0,
  );
  const depositAmount = totalAmount * 0.3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-4">
      {/* Navigatie & Print Knop */}
      <div className="flex justify-between items-center print:hidden">
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-800">
          ← Terug naar dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
          Printen naar PDF
        </button>
      </div>

      {/* De Offerte / Brief */}
      <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm print:shadow-none print:border-none">
        <div className="flex justify-between mb-12">
          <h2 className="text-2xl font-black text-blue-600 uppercase">
            Mijn Bouwbedrijf
          </h2>
          <div className="text-right text-sm text-slate-400">
            <p>Offerte: #2026-{quote.id}</p>
            <p>{new Date(quote.created_at).toLocaleDateString("nl-NL")}</p>
          </div>
        </div>

        <div className="mb-10 space-y-4">
          <p className="font-bold text-lg text-slate-900">
            Beste {quote.client_name},
          </p>
          <p className="text-slate-600 leading-relaxed">
            Zoals besproken heb ik hierbij de offerte voor het project
            <strong> "{quote.project_name}"</strong> voor u opgesteld.
          </p>
        </div>

        {/* Tabel met items */}
        <div className="border-t border-slate-100 pt-8 mb-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between py-3 border-b border-slate-50">
              <span className="text-slate-800 font-medium">
                {item.description}
              </span>
              <span className="font-bold">
                €{" "}
                {Number(item.total_price).toLocaleString("nl-NL", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
        </div>

        {/* Totaal & Aanbetaling */}
        <div className="bg-slate-50 p-6 rounded-2xl space-y-2">
          <div className="flex justify-between text-slate-500">
            <span>Totaal (excl. BTW)</span>
            <span>
              €{" "}
              {totalAmount.toLocaleString("nl-NL", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between text-blue-600 font-bold text-lg pt-2 border-t border-blue-100">
            <span>Aanbetaling (30%)</span>
            <span>
              €{" "}
              {depositAmount.toLocaleString("nl-NL", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-400 italic">
          * Na betaling van de aanbetaling wordt de klus definitief ingepland.
        </p>
      </div>
    </div>
  );
}
