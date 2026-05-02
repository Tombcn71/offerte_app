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
  let categories = [];
  try {
    categories =
      await sql`SELECT DISTINCT category FROM services ORDER BY category ASC`;
  } catch (e) {
    console.log("Kon categorieën niet ophalen");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* 1. MOBILE NAV: Alleen zichtbaar op kleine schermen */}
      <MobileNav categories={categories} />

      {/* 2. DESKTOP SIDEBAR: Verborgen op mobiel (hidden md:flex) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 p-6 flex-col gap-8 flex-shrink-0 sticky top-0 h-screen print:hidden">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl text-blue-600">KlusQuote</div>
          <UserButton afterSignOutUrl="/" />
        </div>

        <nav className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Projecten
          </p>
          <Link
            href="/dashboard"
            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
            Overzicht
          </Link>
          <Link
            href="/dashboard/new"
            className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            Nieuwe Offerte
          </Link>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2">
            Diensten Catalogus
          </p>
          {categories.map((cat) => (
            <Link
              key={cat.category}
              href={`/dashboard/services/${cat.category.toLowerCase().replace(/ /g, "-")}`}
              className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg capitalize">
              {cat.category}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 print:p-0 print:bg-white w-full">
        {children}
      </main>
    </div>
  );
}
