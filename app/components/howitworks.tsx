import React from "react";
import { ClipboardList, Calculator, Send } from "lucide-react";

const WorkStep = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-start text-left p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all duration-300 group">
    <div className="mb-6 p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
  </div>
);

export default function HowItWorks() {
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
    /* mt-64 zet de grijze lijn een enorm stuk lager dan de hero */
    <section className="relative bg-white mt-43 pt-32 pb-32 px-4 border-t border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <h2 className="text-sm font-bold text-blue-600 tracking-wider mb-3">
            Het proces
          </h2>
          <p className="text-4xl font-black text-slate-900 tracking-tight">
            Hoe het werkt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
  );
}
