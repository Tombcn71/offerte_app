"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuote } from "@/app/actions/quotes";

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

  const addItem = (category: string, service: string) => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        category,
        service,
        hours: 0,
        rate: 60,
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

  const handleSave = async () => {
    if (!projectName || items.length === 0) {
      alert("Vul een projectnaam in en voeg minimaal één onderdeel toe.");
      return;
    }

    setIsSubmitting(true);

    // Geen try-catch hier zodat de redirect van de Server Action werkt
    const result = await createQuote({
      projectName,
      clientName,
      items,
    });

    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 text-slate-900 px-4">
      <h1 className="text-3xl font-black mb-8 mt-8">Nieuwe Offerte</h1>

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400 ml-1">
            PROJECTNAAM
          </label>
          <input
            value={projectName}
            placeholder="bijv. Renovatie Fam. Jansen"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400 ml-1">
            KLANTNAAM
          </label>
          <input
            value={clientName}
            placeholder="Naam van de klant"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
      </div>

      {/* Selector */}
      <div className="mb-8">
        <h2 className="font-bold mb-4 text-slate-700">
          Werkzaamheden toevoegen:
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SERVICES_DATA).map(([cat, services]) => (
            <div key={cat} className="group relative">
              <button className="bg-white border border-slate-200 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-sm">
                {cat} +
              </button>
              <div className="hidden group-hover:block absolute top-full left-0 bg-white shadow-2xl border border-slate-200 rounded-xl p-2 z-50 w-72 mt-1">
                {services.map((s) => (
                  <button
                    key={s}
                    onClick={() => addItem(cat, s)}
                    className="block w-full text-left p-2 hover:bg-blue-50 rounded text-xs text-slate-700">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lijst */}
      <div className="space-y-4">
        {items.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-medium bg-white">
            Nog geen onderdelen toegevoegd. Kies hierboven een categorie.
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition">
              ✕
            </button>
            <h3 className="font-bold text-blue-600 mb-4 flex items-center gap-2">
              <span className="bg-blue-50 px-2 py-1 rounded text-[10px] uppercase">
                {item.category}
              </span>
              {item.service}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                  UREN
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded outline-none bg-slate-50"
                  onChange={(e) => updateItem(item.id, "hours", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                  MATERIAAL (€)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded outline-none bg-slate-50"
                  onChange={(e) =>
                    updateItem(item.id, "materials", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                  MARGE (%)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded outline-none bg-slate-50"
                  defaultValue={10}
                  onChange={(e) =>
                    updateItem(item.id, "margin", e.target.value)
                  }
                />
              </div>
              <div className="text-right flex flex-col justify-end">
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">
                  Subtotaal
                </label>
                <p className="text-xl font-black">
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

      {/* Footer */}
      {items.length > 0 && (
        <div className="mt-10 p-8 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
          <div>
            <p className="text-slate-400 font-medium">
              Totaalbedrag (Excl. BTW)
            </p>
            <p className="text-4xl font-black text-blue-400">
              €{" "}
              {items
                .reduce((acc, item) => acc + calculateTotal(item), 0)
                .toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-bold transition-all ${isSubmitting ? "opacity-50" : ""}`}>
            {isSubmitting
              ? "Bezig met opslaan..."
              : "Offerte Opslaan & Versturen"}
          </button>
        </div>
      )}
    </div>
  );
}
