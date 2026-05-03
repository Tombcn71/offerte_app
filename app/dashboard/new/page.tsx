"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuote } from "@/app/actions/quotes";
import { Sparkles, Loader2, Plus, X } from "lucide-react";

const SERVICES_DATA = {
  Badkamer: [
    "Badkamer laten plaatsen",
    "Sanitair laten installeren",
    "Toilet renovatie",
    "Douchecabine laten monteren",
  ],
  Vloeren: [
    "Klik-pvc, houten vloer en laminaat laten leggen",
    "Dryback-vloeren en plak-pvc laten leggen",
    "Wand- en vloertegels laten leggen en plaatsen",
    "Vinyl en tapijt laten leggen",
  ],
  "Keuken en woonruimtes": [
    "Keuken laten plaatsen",
    "Muren laten behangen & sauzen",
    "Raamdecoratie laten plaatsen",
    "Trappen laten renoveren",
  ],
  "Ramen en deuren": [
    "Binnendeur laten plaatsen",
    "Raamkozijn laten plaatsen",
    "Buitendeur laten plaatsen",
    "Rolluiken laten plaatsen",
    "Gevelbekleding laten monteren",
    "Dakraam laten plaatsen",
  ],
  "Energie, klimaat en verwarming": ["Airco's laten plaatsen"],
  "Tuin en terras": [
    "Zonnescherm laten plaatsen",
    "Complete tuinaanleg",
    "Schutting laten plaatsen",
    "Vlonderterras laten aanleggen",
    "Carport en overkapping laten plaatsen",
    "Tuin laten bestraten",
    "Tuinhuizen en blokhutten laten plaatsen",
  ],
};

export default function NewQuotePage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const addItem = (category: string, service: string) => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        category,
        service,
        hours: 0,
        rate: 60, // Standaard tarief
        materials: 0,
        margin: 10,
      },
    ]);
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  const updateItem = (id: string, field: string, value: string) => {
    setItems(
      items.map((i) =>
        i.id === id ? { ...i, [field]: parseFloat(value) || 0 } : i,
      ),
    );
  };

  const calculateTotal = (item: any) => {
    const subtotal = item.hours * item.rate + item.materials;
    return subtotal * (1 + item.margin / 100);
  };

  const generateAIDescription = async () => {
    if (!projectName || items.length === 0) {
      alert("Vul eerst een projectnaam in en voeg werkzaamheden toe.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          clientName,
          items: items.map((i) => ({
            service: i.service,
            category: i.category,
          })),
        }),
      });
      const data = await res.json();
      if (data.text) {
        setDescription(data.text);
      }
    } catch (error) {
      console.error("AI Generation failed", error);
      alert("Er ging iets mis met de AI. Probeer het opnieuw.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!projectName || items.length === 0) {
      alert("Vul een projectnaam in en voeg minimaal één onderdeel toe.");
      return;
    }

    setIsSubmitting(true);
    const result = await createQuote({
      projectName,
      clientName,
      items,
      description,
    });

    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 text-slate-900 px-4">
      <h1 className="text-3xl font-black mb-8 mt-8 tracking-tight uppercase italic text-blue-600">
        Nieuwe Offerte
      </h1>

      {/* Project & Klant Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider italic">
            Projectnaam
          </label>
          <input
            value={projectName}
            placeholder="bijv. Renovatie Badkamer"
            className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50 text-slate-900 font-bold"
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider italic">
            Klantnaam
          </label>
          <input
            value={clientName}
            placeholder="Naam van de klant"
            className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50 text-slate-900 font-bold"
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
      </div>

      {/* Werkzaamheden Kiezer */}
      <div className="mb-8">
        <h2 className="font-bold mb-4 text-slate-700 flex items-center gap-2">
          Werkzaamheden toevoegen:
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SERVICES_DATA).map(([cat, services]) => (
            <div key={cat} className="relative group">
              <button
                type="button"
                className="bg-white border border-slate-200 group-hover:border-blue-500 px-4 py-2 rounded-full text-sm font-bold transition shadow-sm flex items-center gap-1 outline-none">
                {cat} <Plus className="w-3 h-3 text-slate-400" />
              </button>
              <div className="hidden group-hover:block absolute top-full left-0 z-50 w-72 pt-2">
                <div className="bg-white shadow-2xl border border-slate-200 rounded-xl p-2 max-h-80 overflow-y-auto">
                  {services.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addItem(cat, s)}
                      className="block w-full text-left p-3 hover:bg-blue-600 hover:text-white rounded-lg text-xs text-slate-700 transition-colors font-bold">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geselecteerde Items */}
      <div className="space-y-4 mb-8">
        {items.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-medium bg-white shadow-sm">
            Voeg werkzaamheden toe om de berekening te starten.
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative animate-in slide-in-from-top-2">
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest">
                {item.category}
              </span>
              <h3 className="font-bold text-slate-800">{item.service}</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Uren / Aantal
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => updateItem(item.id, "hours", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Tarief (€)
                </label>
                <input
                  type="number"
                  defaultValue={item.rate}
                  className="w-full p-2 border rounded-lg bg-slate-50 font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Materiaal (€)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) =>
                    updateItem(item.id, "materials", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Marge (%)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  defaultValue={10}
                  onChange={(e) =>
                    updateItem(item.id, "margin", e.target.value)
                  }
                />
              </div>
              <div className="text-right flex flex-col justify-end">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Subtotaal
                </label>
                <p className="text-xl font-black text-slate-900">
                  €{" "}
                  {calculateTotal(item).toLocaleString("nl-NL", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Sectie */}
      {items.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> Introductie Tekst
            </h3>
            <button
              onClick={generateAIDescription}
              disabled={isGenerating}
              className="text-xs font-bold flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition">
              {isGenerating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "✨ Genereer met AI"
              )}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 border rounded-xl h-32 text-sm bg-slate-50 focus:bg-white transition-all outline-none font-medium border-slate-200"
            placeholder="Beschrijf hier het project of gebruik de AI knop..."
          />
        </div>
      )}

      {/* Opslaan & Totaal - LICHT ONTWERP (GEEN ZWART) */}
      {items.length > 0 && (
        <div className="mt-10 p-8 bg-white rounded-[2rem] text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl border border-blue-100 relative overflow-hidden mb-10">
          <div className="absolute top-0 left-0 w-2 bg-blue-600 h-full"></div>

          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">
              Totaalbedrag (Excl. BTW)
            </p>
            <p className="text-5xl font-black text-blue-600">
              €{" "}
              {items
                .reduce((acc, item) => acc + calculateTotal(item), 0)
                .toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-blue-200 flex items-center gap-3 text-lg">
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Opslaan...
              </>
            ) : (
              "Offerte definitief maken"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
