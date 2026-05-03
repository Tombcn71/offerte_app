"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function QuoteDetailPage() {
  const params = useParams();
  const [data, setData] = useState<{ quote: any; items: any[] } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/quotes/${params.id}`);
      const json = await response.json();
      setData(json);
    }
    if (params.id) fetchData();
  }, [params.id]);

  if (!data)
    return (
      <div className="p-10 text-center font-bold text-slate-500">
        Offerte inladen...
      </div>
    );

  const { quote, items } = data;

  const totalAmount = items.reduce(
    (acc, item) => acc + Number(item.total_price || 0),
    0,
  );
  const depositAmount = totalAmount * 0.3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-4">
      {/* Navigatie & Print Knop */}
      <div className="flex justify-between items-center print:hidden">
        <Link
          href="/dashboard"
          className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">
          ← Terug naar dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-blue-700 active:scale-95 transition">
          PDF Opslaan / Printen
        </button>
      </div>

      {/* DE BRIEF */}
      <div className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div>
            <h2 className="text-3xl font-black text-blue-600 tracking-tighter uppercase">
              Mijn Bouwbedrijf
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-bold tracking-widest">
              VAKMANSCHAP OP MAAT
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            <p>Offerte-nummer: #2026-{String(quote.id).substring(0, 8)}</p>
            <p>
              Datum: {new Date(quote.created_at).toLocaleDateString("nl-NL")}
            </p>
          </div>
        </div>

        {/* Introductie & AI Tekst */}
        <div className="mb-12 space-y-6">
          <p className="font-black text-xl text-slate-900 tracking-tight">
            Beste {quote.client_name},
          </p>

          {quote.description ? (
            <div className="text-slate-600 leading-relaxed text-base whitespace-pre-wrap">
              {quote.description}
            </div>
          ) : (
            <p className="text-slate-600 leading-relaxed">
              Hierbij ontvangt u de offerte voor het project{" "}
              <strong>"{quote.project_name}"</strong>.
            </p>
          )}
        </div>

        {/* Tabel met werkzaamheden */}
        <div className="mb-10">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            Specificatie werkzaamheden
          </h3>
          <div className="border-t border-slate-200">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between py-4 border-b border-slate-100 items-center">
                <span className="text-slate-800 font-medium text-sm">
                  {item.description}
                </span>
                <span className="font-bold text-slate-900">
                  €{" "}
                  {Number(item.total_price).toLocaleString("nl-NL", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financiële Afsluiting (Nu wit en passend bij de brief) */}
        <div className="mt-12 space-y-3 border-t-2 border-slate-900 pt-6">
          <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
            <span>Totaalbedrag (excl. BTW)</span>
            <span className="text-slate-900 text-lg">
              €{" "}
              {totalAmount.toLocaleString("nl-NL", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              <p className="text-blue-600 font-black text-sm uppercase tracking-tight">
                Aanbetaling (30%)
              </p>
              <p className="text-[10px] text-slate-400">
                Voldoen voor aanvang werkzaamheden
              </p>
            </div>
            <p className="text-2xl font-black text-blue-600">
              €{" "}
              {depositAmount.toLocaleString("nl-NL", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Footer voetnoten */}
        <div className="mt-16 pt-8 border-t border-slate-100 text-[10px] text-slate-400 font-medium space-y-1">
          <p>* Deze offerte is 30 dagen geldig.</p>
          <p>
            * Na ontvangst van de aanbetaling wordt de planning definitief
            bevestigd.
          </p>
          <p>* Alle prijzen zijn exclusief BTW.</p>
        </div>
      </div>
    </div>
  );
}
