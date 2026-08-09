"use client";

import Link from "next/link";
import { Play, Sparkles, Shield, Cpu, BarChart2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-slate-50/40 pt-24 pb-16 overflow-hidden">
      {/* Background Gradient Mesh Blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[45%] bg-gradient-to-tr from-indigo-200/50 to-blue-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-purple-200/40 to-pink-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 text-center relative z-10">
        {/* Modern Accent Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-bold text-indigo-700 mb-6 shadow-sm hover:scale-[1.02] transition-transform cursor-default">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
          <span>Powered by Gemini 2.5 Pro AI</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-[60px] font-extrabold tracking-tight text-[#0f172a] leading-[1.1] max-w-4xl mx-auto font-sans">
          The Future of <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Contract Hiring</span>,
          <span className="block mt-2 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">Powered by AI.</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-8 text-base sm:text-lg text-[#334155] max-w-[660px] mx-auto leading-relaxed font-semibold">
          Secure, multi-tenant platform connecting <strong>IT</strong> vendors and hiring managers with deterministic AI scoring and real-time candidate insights.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          <Link
            href="/login"
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 px-8 py-4 rounded-[6px] text-sm font-bold transition-all shadow-md shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </Link>
          <button className="flex items-center gap-2 bg-white text-[#334155] border border-slate-200 hover:bg-slate-50 px-7 py-4 rounded-[6px] text-sm font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]">
            <Play className="h-4 w-4 fill-current text-[#334155]" />
            Watch Demo
          </button>
        </div>

        {/* Interactive Mock Dashboard Component */}
        <div className="mt-20 max-w-5xl mx-auto relative group">
          {/* Glassmorphic border and background */}
          <div className="bg-white/80 border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/50 backdrop-blur-md p-6 md:p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
            {/* Header of Mock Dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Zelosify AI Engine</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Evaluation Pipeline Active
              </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
              {/* Column 1: AI Match Score */}
              <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 hover:bg-white hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Candidate Rating</h4>
                    <BarChart2 className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-4xl font-extrabold text-indigo-600">92%</span>
                    <span className="text-sm font-bold text-slate-500">Match</span>
                  </div>
                </div>
                <div className="mt-5 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" style={{ width: "92%" }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-3 font-medium">Highly recommended for Senior React Engineer roles.</p>
              </div>

              {/* Column 2: Extracted Profile */}
              <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 hover:bg-white hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">AI Skills Extraction</h4>
                    <Cpu className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded text-[10px] font-bold">React.js</span>
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded text-[10px] font-bold">Next.js</span>
                    <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded text-[10px] font-bold">TypeScript</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded text-[10px] font-bold">Node.js</span>
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded text-[10px] font-bold">AWS S3</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-4 font-medium">Auto-extracted from candidate resume PDF (latency: 320ms).</p>
              </div>

              {/* Column 3: Insights & Verdict */}
              <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 hover:bg-white hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Deterministic Verdict</h4>
                    <Shield className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs pb-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Exp Requirement</span>
                      <span className="text-slate-800 font-bold">Pass (8 Years)</span>
                    </div>
                    <div className="flex justify-between text-xs pb-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Location check</span>
                      <span className="text-slate-800 font-bold">Pass (US-Remote)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Rate Check</span>
                      <span className="text-slate-800 font-bold">Pass (Aligned)</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-3 font-medium">Scored via verified client requirements schema.</p>
              </div>
            </div>
          </div>
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
