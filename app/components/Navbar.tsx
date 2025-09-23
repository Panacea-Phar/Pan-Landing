"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/20 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">Panacea</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              Features
            </Link>
            <Link
              href="/#compliance"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              Compliance
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              Pricing
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            <Link
              href="/sales"
              className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === "/sales"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 hover:shadow-xl"
              }`}
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
