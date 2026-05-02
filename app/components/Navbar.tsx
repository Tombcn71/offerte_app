"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { FileText } from "lucide-react"; // Zorg dat je lucide-react hebt geïnstalleerd

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHomePage = pathname === "/";

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo Sectie met FileDigit Icoon */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <FileText className="text-white w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              KlusQuote
            </span>
          </Link>
        </div>

        {/* Desktop Navigatie Links */}
        {isHomePage && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link
              href="#hoe-het-werkt"
              className="hover:text-blue-600 transition">
              Hoe het werkt
            </Link>
            <Link href="#sectoren" className="hover:text-blue-600 transition">
              Sectoren
            </Link>
            <Link href="#prijzen" className="hover:text-blue-600 transition">
              Prijzen
            </Link>
          </div>
        )}

        {/* Knoppen Sectie */}
        <div className="flex items-center gap-4">
          {!isLoaded ? (
            <div className="w-20 h-8 rounded-full bg-slate-100 animate-pulse" />
          ) : !isSignedIn ? (
            <>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-slate-900">
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
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-blue-600 transition mr-1">
                Dashboard
              </Link>
              <UserButton />
            </div>
          )}

          {/* Hamburger Menu (Alleen op home op mobile) */}
          {isHomePage && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isHomePage && isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <Link
            href="#hoe-het-werkt"
            onClick={() => setIsMenuOpen(false)}
            className="block text-base font-medium text-slate-600 hover:text-blue-600">
            Hoe het werkt
          </Link>
          <Link
            href="#sectoren"
            onClick={() => setIsMenuOpen(false)}
            className="block text-base font-medium text-slate-600 hover:text-blue-600">
            Sectoren
          </Link>
          <Link
            href="#prijzen"
            onClick={() => setIsMenuOpen(false)}
            className="block text-base font-medium text-slate-600 hover:text-blue-600">
            Prijzen
          </Link>
          {!isSignedIn && (
            <div className="pt-4 border-t border-slate-100">
              <SignInButton mode="modal">
                <button className="text-base font-semibold text-slate-900">
                  Inloggen
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
