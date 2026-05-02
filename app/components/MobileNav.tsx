"use client";

import { useState, useEffect } from "react"; // Voeg useEffect toe
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function MobileNav({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Zorg dat de component pas rendert als de client klaar is
  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMenu = () => setOpen(false);

  // Als we nog niet op de client zijn, renderen we een simpele placeholder
  // Dit voorkomt de "children should not have changed" error
  if (!mounted) {
    return (
      <div className="md:hidden flex items-center justify-between w-full p-4 bg-white border-b">
        <div className="font-bold text-xl text-blue-600">KlusQuote</div>
        <Menu className="h-6 w-6 text-slate-300" />
      </div>
    );
  }

  return (
    <div className="md:hidden flex items-center justify-between w-full p-4 bg-white border-b sticky top-0 z-40 print:hidden">
      <div className="font-bold text-xl text-blue-600">KlusQuote</div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {/* asChild voorkomt dubbele button elementen */}
          <button className="p-2 hover:bg-slate-100 rounded-lg outline-none">
            <Menu className="h-6 w-6 text-slate-600" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-6 border-b text-left">
            <SheetTitle className="text-blue-600">KlusQuote</SheetTitle>
            <SheetDescription>
              Navigeer door je projecten en diensten.
            </SheetDescription>
          </SheetHeader>

          <nav className="flex flex-col p-4 gap-6">
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
              <UserButton showName />
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Projecten
              </p>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="flex px-3 py-2 text-slate-600 hover:bg-blue-50 rounded-lg transition-colors">
                Overzicht
              </Link>
              <Link
                href="/dashboard/new"
                onClick={closeMenu}
                className="flex px-3 py-2 text-slate-600 hover:bg-blue-50 rounded-lg transition-colors">
                Nieuwe Offerte
              </Link>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Catalogus
              </p>
              <div className="max-h-[300px] overflow-y-auto">
                {categories &&
                  categories.map((cat) => (
                    <Link
                      key={cat.category}
                      href={`/dashboard/services/${cat.category.toLowerCase().replace(/ /g, "-")}`}
                      onClick={closeMenu}
                      className="flex px-3 py-2 text-sm text-slate-500 hover:text-slate-900 capitalize">
                      {cat.category}
                    </Link>
                  ))}
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
