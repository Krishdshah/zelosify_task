"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="w-full bg-[#fafbfc] pt-16 pb-8 border-t border-gray-150">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Top grid section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/assets/logos/zelosify_Dark.png"
                alt="Zelosify Logo"
                className="h-5 w-auto"
              />
              <span className="text-lg font-bold tracking-tight text-black">Zelosify</span>
            </Link>
            <p className="text-xs text-[#64748b] max-w-[240px] leading-relaxed font-normal">
              The intelligent infrastructure for modern contract hiring.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6 sm:gap-8">
            
            {/* Column 1: COMPANY */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold tracking-[0.1em] text-black uppercase">
                Company
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="text-xs text-[#64748b] hover:text-black transition-colors font-normal">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-xs text-[#64748b] hover:text-black transition-colors font-normal">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-xs text-[#64748b] hover:text-black transition-colors font-normal">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: LEGAL */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold tracking-[0.1em] text-black uppercase">
                Legal
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy" className="text-xs text-[#64748b] hover:text-black transition-colors font-normal">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-xs text-[#64748b] hover:text-black transition-colors font-normal">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-xs text-[#64748b] hover:text-black transition-colors font-normal">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: SUPPORT */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold tracking-[0.1em] text-black uppercase">
                Support
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/help" className="text-xs text-[#64748b] hover:text-black transition-colors font-normal">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/api-docs" className="text-xs text-[#64748b] hover:text-black transition-colors font-normal">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-xs text-[#64748b] hover:text-black transition-colors font-normal">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom copyright section */}
        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-[10px] text-[#94a3b8] font-normal">
            &copy; 2024 Zelosify Inc. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
