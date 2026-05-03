import React from "react";
import { Check } from "lucide-react";

const PricingCard = ({
  plan,
  price,
  features,
  buttonText,
  highlight = false,
}: {
  plan: string;
  price: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
}) => (
  <div
    className={`p-8 rounded-3xl border ${highlight ? "border-blue-500 shadow-xl relative" : "border-slate-200 shadow-sm"} bg-white flex flex-col h-full`}>
    {highlight && (
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide">
        Meest gekozen
      </span>
    )}
    <h3 className="text-xl font-black text-slate-900 mb-2">{plan}</h3>
    <div className="mb-6">
      <span className="text-4xl font-black text-slate-900">{price}</span>
      {price !== "Gratis" && (
        <span className="text-slate-500 font-medium ml-1">/ maand</span>
      )}
    </div>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feature, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-slate-600 font-medium text-sm">
          <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-4 rounded-2xl font-black transition-all ${highlight ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-900 hover:bg-slate-100"}`}>
      {buttonText}
    </button>
  </div>
);

export default function Pricing() {
  return (
    <section className="py-32 bg-white px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-bold text-blue-600 tracking-wider mb-3">
            Tarieven
          </h2>
          <p className="text-4xl font-black text-slate-900 tracking-tight uppercase">
            Kies je plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PricingCard
            plan="Starter"
            price="Gratis"
            buttonText="Begin nu"
            features={[
              "1 offerte per maand",
              "Toegang tot alle sectoren",
              "Professionele PDF export",
              "Handmatige omschrijvingen",
            ]}
          />
          <PricingCard
            plan="Vakman Pro"
            price="€19"
            highlight={true}
            buttonText="Ga voor Pro"
            features={[
              "Onbeperkt aantal offertes",
              "Onbeperkt AI beschrijvingen",
              "Eigen logo op offertes",
              "Klant- en projectbeheer",
              "Vooraf ingestelde tarieven",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
