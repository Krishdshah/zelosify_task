"use client";

import { Sparkles, SlidersHorizontal, Check } from "lucide-react";

export default function PrecisionSection() {
  return (
    <section className="w-full bg-[#fcfdfd] py-20 md:py-28 border-b border-gray-150">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <h2 className="text-center text-3xl sm:text-[34px] font-bold tracking-tight text-[#0f172a] mb-16">
          Deterministic Precision. Frictionless Execution.
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: AI-Driven Recommendations */}
          <div className="flex flex-col justify-between p-8 bg-white border border-gray-150 rounded-[8px] hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 text-[#0f172a]">
                <div className="text-black">
                  <Sparkles className="h-5 w-5 stroke-[2px]" />
                </div>
                <h3 className="text-lg font-bold">AI-Driven Recommendations</h3>
              </div>
              <p className="mt-4 text-[#475569] text-sm leading-relaxed max-w-lg font-normal">
                Instantly identify top tier talent with scoring models trained on millions of successful contract placements.
              </p>
            </div>

            {/* Candidate Card Preview */}
            <div className="mt-8 border border-gray-150 rounded-[6px] p-5 bg-white shadow-sm max-w-md">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#0f172a]">Sarah Jenkins</h4>
                  <p className="text-xs text-[#64748b] mt-0.5 font-normal">Senior React Developer</p>
                </div>
                {/* 94% Match Badge */}
                <div className="flex items-center gap-1 bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-1 rounded-[4px] text-[10px] font-bold text-[#15803d]">
                  <Check className="h-3 w-3 stroke-[2.5px]" />
                  <span>94% Match</span>
                </div>
              </div>

              {/* Candidate Info Table */}
              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-100">
                  <span className="text-[#64748b] font-normal">Experience</span>
                  <span className="text-[#0f172a] font-bold">8 Yrs</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-1">
                  <span className="text-[#64748b] font-normal">Skill Alignment</span>
                  <span className="text-[#0f172a] font-bold">High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Deterministic Scoring */}
          <div className="flex flex-col justify-between p-8 bg-white border border-gray-150 rounded-[8px] hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 text-[#0f172a]">
                <div className="text-black">
                  <SlidersHorizontal className="h-5 w-5 stroke-[2px]" />
                </div>
                <h3 className="text-lg font-bold">Deterministic Scoring</h3>
              </div>
              <p className="mt-4 text-[#475569] text-sm leading-relaxed max-w-lg font-normal">
                Transparent matching logic based on verifiable parameters. No black-box algorithms.
              </p>
            </div>

            {/* Verification Checklist Container */}
            <div className="mt-8 border border-gray-150 rounded-[6px] p-6 bg-[#f8fafc]">
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-xs text-[#334155] font-semibold">
                  <div className="flex items-center justify-center h-4 w-4 rounded-full bg-white border border-gray-200">
                    <Check className="h-3 w-3 text-gray-500 stroke-[2.5px]" />
                  </div>
                  Hard Skills Match
                </li>
                <li className="flex items-center gap-3 text-xs text-[#334155] font-semibold">
                  <div className="flex items-center justify-center h-4 w-4 rounded-full bg-white border border-gray-200">
                    <Check className="h-3 w-3 text-gray-500 stroke-[2.5px]" />
                  </div>
                  Location Validation
                </li>
                <li className="flex items-center gap-3 text-xs text-[#334155] font-semibold">
                  <div className="flex items-center justify-center h-4 w-4 rounded-full bg-white border border-gray-200">
                    <Check className="h-3 w-3 text-gray-500 stroke-[2.5px]" />
                  </div>
                  Rate Alignment
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
