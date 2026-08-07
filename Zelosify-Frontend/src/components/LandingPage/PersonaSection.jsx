"use client";

import Link from "next/link";
import { UserCheck, Briefcase, ArrowRight } from "lucide-react";

export default function PersonaSection() {
  return (
    <section className="w-full bg-[#fafbfc] py-20 md:py-24 border-b border-gray-150">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: For Hiring Managers */}
          <div className="bg-white border border-gray-150 rounded-[8px] p-8 md:p-10 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Icon */}
              <div className="text-black mb-6">
                <UserCheck className="h-6 w-6 stroke-[2px]" />
              </div>
              {/* Title */}
              <h3 className="text-xl sm:text-[22px] font-bold text-[#0f172a]">
                For Hiring Managers
              </h3>
              {/* Paragraph */}
              <p className="mt-4 text-[#475569] text-sm leading-relaxed font-normal max-w-md">
                Review candidates with confidence. See AI reasoning and latency-optimized results directly integrated into your daily workflow.
              </p>
            </div>
            
            <div>
              {/* Divider */}
              <div className="border-t border-gray-100 my-6" />
              {/* Link */}
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-black hover:text-gray-600 transition-colors uppercase"
              >
                Explore Manager Portal
                <ArrowRight className="h-3 w-3 stroke-[2.5px]" />
              </Link>
            </div>
          </div>

          {/* Card 2: For IT Vendors */}
          <div className="bg-white border border-gray-150 rounded-[8px] p-8 md:p-10 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Icon */}
              <div className="text-black mb-6">
                <Briefcase className="h-5 w-5 stroke-[2px]" />
              </div>
              {/* Title */}
              <h3 className="text-xl sm:text-[22px] font-bold text-[#0f172a]">
                For IT Vendors
              </h3>
              {/* Paragraph */}
              <p className="mt-4 text-[#475569] text-sm leading-relaxed font-normal max-w-md">
                Upload profiles seamlessly. Track status and participate in top-tier contract openings with immediate feedback loops.
              </p>
            </div>
            
            <div>
              {/* Divider */}
              <div className="border-t border-gray-100 my-6" />
              {/* Link */}
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-black hover:text-gray-600 transition-colors uppercase"
              >
                Explore Vendor Portal
                <ArrowRight className="h-3 w-3 stroke-[2.5px]" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
