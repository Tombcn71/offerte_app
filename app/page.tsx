import Navbar from "@/app/components/Navbar";
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { ClipboardList, Calculator, Send } from "lucide-react";

// Interne helper component voor de stappen
const WorkStep = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-start text-left p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all duration-300 group">
    <div className="mb-6 p-4 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 leading-relaxed font-medium text-sm md:text-base">
      {description}
    </p>
  </div>
);

export default function HomePage() {
  const steps = [
    {
      icon: ClipboardList,
      title: "1. Selecteer",
      description:
        "Kies direct de juiste werkzaamheden uit onze database. Geen gedoe met typen, maar snel en foutloos toevoegen.",
    },
    {
      icon: Calculator,
      title: "2. Bereken",
      description:
        "De app rekent direct uren, materialen en marges door op basis van jouw tarieven. Altijd een kloppende prijs.",
    },
    {
      icon: Send,
      title: "3. Verstuur",
      description:
        "Genereer direct een professionele PDF-offerte en stuur deze naar de klant. Klaar terwijl je bij de klant staat.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <header className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full">
          Gemaakt voor de Nederlandse aannemer
        </span>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 md:mb-8 leading-[1.2] md:leading-[1.1]">
          Offertes maken in <span className="text-blue-600">minuten</span>,
          <br className="hidden md:block" /> niet in uren.
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
          Combineer badkamers, vloeren en schilderwerk naadloos in één offerte.
          Jouw tarieven, jouw materialen, direct klaar voor je klant.
        </p>

        {/* Gefixte knop: geen fullwidth op mobiel, mooi gecentreerd */}
        <div className="flex justify-center">
          <div className="bg-slate-900 text-white px-8 md:px-10 py-4 rounded-full text-lg font-bold hover:bg-slate-800 transition shadow-lg cursor-pointer w-fit">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              Start je eerste offerte
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hoe het werkt Section */}
      <section
        id="hoe-het-werkt"
        className="py-16 md:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-blue-600 tracking-wider mb-2">
              Het proces
            </h2>
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Hoe het werkt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <WorkStep
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-slate-900">
          Klaar om de administratie te verslaan?
        </h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
          Sluit je aan bij honderden aannemers die al sneller werken.
        </p>
        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition w-fit text-center shadow-md">
            Open Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
