"use client";

import { Shield } from "lucide-react";

export default function SecurityBanner() {
  return (
    <section className="w-full bg-[#090d16] py-14 border-b border-gray-900 overflow-hidden relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-[#090f1e]/40 border border-blue-950/40 rounded-xl p-8 md:p-10 backdrop-blur-sm">
          
          {/* Left Side Info */}
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="mt-1 text-blue-400">
              <Shield className="h-6 w-6 stroke-[2px]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Multi-Tenant Security
              </h3>
              <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                Bruce Wayne Corp levels of isolation and data protection. Complete siloed environments ensure your proprietary candidate data and hiring metrics remain strictly confidential and compliant.
              </p>
            </div>
          </div>

          {/* Right Side Button */}
          <div className="flex-shrink-0 self-start md:self-center">
            <button className="bg-white text-[#0f172a] hover:bg-slate-100 px-6 py-3 rounded-[4px] text-xs sm:text-sm font-semibold transition-all shadow-md">
              View Architecture
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
