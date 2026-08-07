"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import MobileMenu from "../MobileMenu";

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/assets/logos/zelosify_Dark.png"
              alt="Zelosify Logo"
              className="h-6 w-auto"
            />
            <span className="text-xl font-bold tracking-tight text-black">Zelosify</span>
          </Link>

          {/* Centered Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#platform"
              className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              Platform
            </Link>
            <Link
              href="#solutions"
              className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              Solutions
            </Link>
            <Link
              href="#resources"
              className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              Resources
            </Link>
          </nav>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-gray-500 hover:text-gray-900 transition-colors">
              <Search className="h-5 w-5 stroke-[2px]" />
            </button>
            <Link
              href="/login"
              className="bg-black text-white px-5 py-2 rounded-[4px] text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-gray-500">
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-1 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        closeMenu={() => setIsMenuOpen(false)}
      />
    </>
  );
}

