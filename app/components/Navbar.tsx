"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  // Haal de status op uit de hook
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Logo Sectie */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            KlusQuote
          </span>
        </Link>
      </div>

      {/* Navigatie Links (Desktop) */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <Link href="/#hoe-het-werkt" className="hover:text-blue-600 transition">
          Hoe het werkt
        </Link>
        <Link href="/#sectoren" className="hover:text-blue-600 transition">
          Sectoren
        </Link>
        <Link href="/#prijzen" className="hover:text-blue-600 transition">
          Prijzen
        </Link>
      </div>

      {/* Knoppen Sectie */}
      <div className="flex items-center gap-4">
        {!isLoaded ? (
          // Skeleton loader terwijl Clerk laadt
          <div className="w-20 h-8 rounded-full bg-slate-100 animate-pulse" />
        ) : !isSignedIn ? (
          // Getoond als gebruiker NIET is ingelogd
          <>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="text-sm font-semibold text-slate-700 hover:text-slate-900">
                Inloggen
              </button>
            </SignInButton>

            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition shadow-sm">
                Aanmelden
              </button>
            </SignUpButton>
          </>
        ) : (
          // Getoond als gebruiker WEL is ingelogd
          <>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition mr-2">
              Naar Dashboard
            </Link>
            <UserButton />
          </>
        )}
      </div>
    </nav>
  );
}
