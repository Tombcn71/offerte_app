// app/dashboard/layout.tsx
import { sql } from "@/lib/db";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { MobileNav } from "@/app/components/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: any[] = [];
  try {
    categories =
      await sql`SELECT DISTINCT category FROM services WHERE category IS NOT NULL AND category != '' ORDER BY category ASC`;
  } catch (e) {
    console.log("Kon categorieën niet ophalen");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
      {/* 1. MOBILE NAV */}
      <MobileNav categories={categories} />

      {/* 2. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 p-6 flex-col gap-8 flex-shrink-0 sticky top-0 h-screen print:hidden">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl text-blue-600 tracking-tighter">
            KlusQuote
          </div>
          <UserButton />
        </div>

        <nav className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Projecten
          </p>
          <Link
            href="/dashboard"
            className="px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition">
            Overzicht
          </Link>
          <Link
            href="/dashboard/new"
            className="px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition">
            Nieuwe Offerte
          </Link>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2">
            Beheer
          </p>
          <Link
            href="/dashboard/tarieven"
            className="px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition flex items-center gap-2">
            Tarieven
          </Link>

          <Link
            href="/dashboard/profiel"
            className="px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition flex items-center gap-2">
            Bedrijfsprofiel
          </Link>
        </nav>
      </aside>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 print:p-0 print:bg-white w-full">
        {children}
      </main>
    </div>
  );
}
