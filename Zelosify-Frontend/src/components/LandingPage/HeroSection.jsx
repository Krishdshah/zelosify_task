"use client";

import Link from "next/link";
import { Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white pt-20 pb-0">
      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight text-[#0f172a] leading-[1.15] max-w-4xl mx-auto">
          The Future of Contract Hiring,
          <span className="block mt-1">Powered by AI.</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-6 text-base sm:text-lg text-[#475569] max-w-[620px] mx-auto leading-relaxed font-normal">
          Secure, multi-tenant platform connecting <strong>IT</strong> vendors and hiring managers with deterministic AI scoring and real-time candidate insights.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          <Link
            href="/login"
            className="bg-[#0f172a] text-white hover:bg-slate-800 px-8 py-3.5 rounded-[4px] text-sm font-semibold transition-all shadow-sm"
          >
            Get Started
          </Link>
          <button className="flex items-center gap-2 bg-white text-[#334155] border border-gray-300 hover:bg-gray-50 px-7 py-3.5 rounded-[4px] text-sm font-semibold transition-all shadow-sm">
            <Play className="h-4 w-4 fill-current text-[#334155]" />
            Watch Demo
          </button>
        </div>
      </div>

      {/* Trusted Leaders Logo Strip */}
      <div className="mt-20 w-full bg-[#f8fafc] border-y border-gray-100 py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#94a3b8] uppercase">
            Trusted by Enterprise Leaders
          </p>
          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 md:gap-x-16 text-xl sm:text-2xl font-bold text-[#94a3b8]/80">
            <span className="hover:text-slate-500 transition-colors cursor-default">Acme Corp</span>
            <span className="hover:text-slate-500 transition-colors cursor-default">Global Tech</span>
            <span className="hover:text-slate-500 transition-colors cursor-default">Initech</span>
            <span className="hover:text-slate-500 transition-colors cursor-default">Soylent</span>
            <span className="hover:text-slate-500 transition-colors cursor-default">Massive Dynamic</span>
          </div>
        </div>
      </div>
    </section>
  );
}
