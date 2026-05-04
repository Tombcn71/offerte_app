"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuote } from "@/app/actions/quotes";
import { Sparkles, Loader2, Plus, X } from "lucide-react";

const SERVICES_DATA = {
  "Schilderwerk (9% BTW)": [
    { s: "Sauzen plafond per laag", r: 9.45 },
    { s: "Sauzen met structuur per laag", r: 8.25 },
    { s: "Sauzen gladde muur per laag", r: 7.1 },
    { s: "Sauzen glasvezelbehang per laag", r: 7.1 },
    { s: "Latex spuiten per laag", r: 6.5 },
    { s: "Behang vlies plakken", r: 6.5 },
    { s: "Behangpapier en motief plakken", r: 8.0 },
    { s: "Glasvezel- en glasvliesbehang plakken", r: 8.25 },
    { s: "Fotobehang plakken (unit max 8 delen)", r: 159.3 },
    { s: "Afkitten muur-plafond", r: 4.45 },
    { s: "Afdekken vloer en meubels", r: 76.7 },
    { s: "Voorstrijken", r: 4.15 },
    { s: "Verwijderen behang (1-laag)", r: 4.15 },
    { s: "Schuren en stofvrij maken", r: 3.5 }, // Item 14
    { s: "Kleine reparaties ondergrond", r: 5.25 }, // Item 15
    { s: "Nicotinevlekken behandelen", r: 6.1 }, // Item 16
    { s: "Stucwerk reparatie (klein)", r: 12.5 }, // Item 17
  ],
  "Schilderwerk (21% BTW)": [
    { s: "Sauzen plafond per laag", r: 10.25 },
    { s: "Sauzen met structuur per laag", r: 9.1 },
    { s: "Sauzen gladde muur per laag", r: 7.8 },
    { s: "Sauzen glasvezelbehang per laag", r: 7.8 },
    { s: "Latex spuiten per laag", r: 7.15 },
    { s: "Behang vlies plakken", r: 7.15 },
    { s: "Behangpapier en motief plakken", r: 8.8 },
    { s: "Glasvezel- en glasvliesbehang plakken", r: 9.1 },
    { s: "Fotobehang plakken (unit max 8 delen)", r: 175.0 },
    { s: "Afkitten muur-plafond", r: 4.9 },
    { s: "Afdekken vloer en meubels", r: 84.5 },
    { s: "Voorstrijken", r: 4.5 },
    { s: "Verwijderen behang (1-laag)", r: 4.5 },
    { s: "Schuren en stofvrij maken", r: 3.85 },
    { s: "Kleine reparaties ondergrond", r: 5.8 },
    { s: "Nicotinevlekken behandelen", r: 6.75 },
    { s: "Stucwerk reparatie (klein)", r: 13.75 },
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
  const [isLowBtw, setIsLowBtw] = useState(true);

  const addItem = (category: string, serviceObj: any) => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        category,
        service: serviceObj.s,
        hours: 0,
        layers: 1,
        rate: serviceObj.r,
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
    const subtotal =
      item.hours * item.rate * (item.layers || 1) + item.materials;
    return subtotal * (1 + item.margin / 100);
  };

  // GEMINI 3 FLASH OPTIMIZED CALL
  const generateAIDescription = async () => {
    if (!projectName || items.length === 0) return;
    setIsGenerating(true);

    // Alleen de essentie meesturen voor maximale snelheid
    const minimalItems = items.map(
      (i) => `${i.service} (${i.layers} lagen, ${i.hours}m2)`,
    );

    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, clientName, items: minimalItems }),
      });
      const data = await res.json();
      if (data.text) setDescription(data.text);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!projectName || items.length === 0) return alert("Vul alles in.");
    setIsSubmitting(true);

    // Zorg dat de lagen tekstueel in de naam van de dienst komen voor de PDF
    const finalItems = items.map((item) => ({
      ...item,
      service: `${item.service} (${item.hours} m2 x ${item.layers} ${item.layers > 1 ? "lagen" : "laag"})`,
    }));

    const result = await createQuote({
      projectName,
      clientName,
      items: finalItems,
      description,
    });

    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/quotes");
      router.refresh();
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 text-slate-900 px-4">
      {/* Header & BTW Toggle */}
      <div className="flex justify-between items-center mb-8 mt-8">
        <h1 className="text-3xl font-black tracking-tight uppercase italic text-blue-600">
          Nieuwe Offerte
        </h1>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm font-bold text-xs italic">
          <button
            onClick={() => setIsLowBtw(true)}
            className={`px-4 py-2 rounded-lg transition-all ${isLowBtw ? "bg-white shadow text-blue-600" : "text-slate-400"}`}>
            Woning {">"} 2jr (9%)
          </button>
          <button
            onClick={() => setIsLowBtw(false)}
            className={`px-4 py-2 rounded-lg transition-all ${!isLowBtw ? "bg-white shadow text-blue-600" : "text-slate-400"}`}>
            Woning {"<"} 2jr (21%)
          </button>
        </div>
      </div>

      {/* Info Velden */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <input
          value={projectName}
          placeholder="Projectnaam"
          className="p-3 border rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setProjectName(e.target.value)}
        />
        <input
          value={clientName}
          placeholder="Klantnaam"
          className="p-3 border rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setClientName(e.target.value)}
        />
      </div>

      {/* Services Dropdown */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {Object.entries(SERVICES_DATA)
            .filter(([cat]) =>
              isLowBtw ? cat.includes("9%") : cat.includes("21%"),
            )
            .map(([cat, services]) => (
              <div key={cat} className="relative group">
                <button
                  type="button"
                  className="bg-white border border-slate-200 group-hover:border-blue-600 px-6 py-3 rounded-full text-sm font-black transition shadow-sm flex items-center gap-2 outline-none uppercase italic tracking-wider">
                  Kies werkzaamheden <Plus className="w-4 h-4 text-blue-600" />
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 z-50 w-80 pt-2">
                  <div className="bg-white shadow-2xl border border-slate-200 rounded-xl p-2 max-h-80 overflow-y-auto">
                    {services.map((s: any) => (
                      <button
                        key={s.s}
                        type="button"
                        onClick={() => addItem(cat, s)}
                        className="block w-full text-left p-3 hover:bg-blue-600 hover:text-white rounded-lg text-xs transition-colors font-bold border-b border-slate-50 last:border-0 italic uppercase">
                        {s.s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative border-l-4 border-l-blue-600">
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4 italic">
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest">
                {item.category}
              </span>
              <h3 className="font-black text-slate-800 mt-1 text-lg italic uppercase">
                {item.service}
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase italic">
                  M2 / Aantal
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg bg-slate-50 font-bold outline-none"
                  onChange={(e) => updateItem(item.id, "hours", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-blue-600 uppercase italic">
                  Lagen
                </label>
                <input
                  type="number"
                  defaultValue={1}
                  className="w-full p-2 border border-blue-200 rounded-lg bg-blue-50 font-black text-blue-600 outline-none"
                  onChange={(e) =>
                    updateItem(item.id, "layers", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase italic">
                  Tarief (€)
                </label>
                <input
                  type="number"
                  value={item.rate}
                  className="w-full p-2 border rounded-lg bg-slate-50 font-bold"
                  onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase italic">
                  Materiaal
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg bg-slate-50 font-bold outline-none"
                  onChange={(e) =>
                    updateItem(item.id, "materials", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase italic">
                  Marge %
                </label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full p-2 border rounded-lg bg-slate-50 font-bold outline-none"
                  onChange={(e) =>
                    updateItem(item.id, "margin", e.target.value)
                  }
                />
              </div>
              <div className="text-right flex flex-col justify-end italic">
                <p className="text-xl font-black text-blue-600 italic">
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-hidden relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-slate-800 flex items-center gap-2 italic uppercase text-sm tracking-widest">
              <Sparkles className="w-4 h-4 text-blue-600" /> Introductie Tekst
            </h3>
            <button
              onClick={generateAIDescription}
              disabled={isGenerating}
              className="text-xs font-black flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition shadow-lg italic uppercase tracking-tighter disabled:bg-slate-300">
              {isGenerating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "⚡ Snel genereren"
              )}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 border rounded-xl h-32 text-sm bg-slate-50 outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Klik op de bliksem voor een AI beschrijving..."
          />
        </div>
      )}

      {/* Footer / Opslaan */}
      {items.length > 0 && (
        <div className="mt-10 p-8 bg-white rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl border border-blue-100 mb-10">
          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1 italic">
              Totaal (Excl. BTW)
            </p>
            <p className="text-5xl font-black text-blue-600 italic">
              €{" "}
              {items
                .reduce((acc, item) => acc + calculateTotal(item), 0)
                .toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black transition-all shadow-lg text-lg uppercase italic flex items-center gap-3 active:scale-95 disabled:bg-slate-300">
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Offerte definitief maken"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
