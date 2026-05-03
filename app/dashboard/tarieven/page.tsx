import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import { addService } from "@/app/actions/services";

export default async function TarievenPage() {
  const { userId } = await auth();
  const sql = neon(process.env.DATABASE_URL!);

  // Haal de bestaande tarieven op voor deze aannemer
  const services = await sql`
    SELECT * FROM services 
    WHERE user_id = ${userId} 
    ORDER BY category, name ASC
  `;

  // Wrapper functie om TS error te voorkomen
  async function handleAction(formData: FormData) {
    "use server";
    await addService(formData);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Mijn Tarieven
        </h1>
        <p className="text-slate-500">
          Beheer hier je standaard prijzen voor de AI-offertes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* KOLOM 1: TOEVOEGEN */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-8">
            <h2 className="font-bold text-lg mb-4">Nieuw Tarief</h2>
            <form action={handleAction} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                  Naam Dienst
                </label>
                <input
                  name="name"
                  placeholder="bijv. Schilderen muren"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                  Categorie
                </label>
                <input
                  name="category"
                  placeholder="bijv. Schilderwerk"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Prijs
                  </label>
                  <input
                    name="rate"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Eenheid
                  </label>
                  <select
                    name="unit"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900">
                    <option value="uur">per uur</option>
                    <option value="m2">per m²</option>
                    <option value="stuk">per stuk</option>
                    <option value="totaal">totaal</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition active:scale-95">
                Tarief Opslaan
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM 2: DE LIJST */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-black text-slate-400 uppercase">
                    Dienst
                  </th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase text-right">
                    Prijs
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="p-10 text-center text-slate-400 italic">
                      Nog geen tarieven toegevoegd. Begin links!
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">
                          {service.name}
                        </p>
                        <p className="text-xs text-slate-400 uppercase font-bold">
                          {service.category}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-black text-blue-600">
                          €{" "}
                          {Number(service.rate).toLocaleString("nl-NL", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          /{service.unit}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
