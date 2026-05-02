"use client"; // Dit bestand is WEL interactief

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors print:hidden">
      Printen / PDF
    </button>
  );
}
