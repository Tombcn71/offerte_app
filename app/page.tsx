import Navbar from "@/app/components/Navbar";
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <header className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full">
          Gemaakt voor de Nederlandse aannemer
        </span>

        {/* Responsive font size: text-4xl op mobiel, text-6xl op desktop */}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 md:mb-8 leading-[1.2] md:leading-[1.1]">
          Offertes maken in <span className="text-blue-600">minuten</span>,
          <br className="hidden md:block" /> niet in uren.
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Combineer badkamers, vloeren en schilderwerk naadloos in één offerte.
          Jouw tarieven, jouw materialen, direct klaar voor je klant.
        </p>

        {/* Button: breed op mobiel, inline op desktop */}
        <div className="w-full md:w-auto inline-block">
          <div className="bg-slate-900 text-white px-8 md:px-10 py-4 rounded-full text-lg font-bold hover:bg-slate-800 transition shadow-lg cursor-pointer w-full">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              Start je eerste offerte
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section
        id="sectoren"
        className="py-16 md:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Alles wat je nodig hebt staat klaar
            </h2>
            <p className="text-slate-500 mt-2">
              Kies uit onze voorgeprogrammeerde werkzaamheden:
            </p>
          </div>

          {/* Grid: 1 kolom op mobiel, 3 op desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Badkamer & Sanitair",
                items: [
                  "Toilet renovatie",
                  "Douchecabines",
                  "Sanitair installatie",
                ],
              },
              {
                title: "Vloeren & Wanden",
                items: [
                  "Klik-PVC & Laminaat",
                  "Tegelzetwerk",
                  "Behangen & Sauzen",
                ],
              },
              {
                title: "Buitenruimte",
                items: [
                  "Complete tuinaanleg",
                  "Schuttingen",
                  "Vlonderterrassen",
                ],
              },
            ].map((cat, i) => (
              <div
                key={i}
                className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-xl mb-4 text-blue-600">
                  {cat.title}
                </h3>
                <ul className="space-y-3">
                  {cat.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-slate-600">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Klaar om de administratie te verslaan?
        </h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Sluit je aan bij honderden aannemers die al sneller werken.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition w-full md:w-auto text-center">
            Open Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
