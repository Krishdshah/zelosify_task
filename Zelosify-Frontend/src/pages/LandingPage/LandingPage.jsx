import Link from "next/link";
import LandingNavbar from "@/components/LandingPage/navbar/LandingNavbar";
import { Button } from "@/components/UI/shadcn/button";
import {
  Briefcase,
  Shield,
  Cpu,
  UploadCloud,
  FileText,
  UserCheck,
  BrainCircuit,
  Lock,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:text-slate-50 overflow-x-hidden">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Colorful blur blobs for modern aesthetics */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50">
            <Cpu className="h-3 w-3 animate-spin" /> Production-Grade AI Match Module
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
            AI-Assisted Contract Hiring
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              With Strict Multi-Tenant Isolation
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Empower IT Vendors to securely submit candidate profiles, and equip Hiring Managers with deterministic AI-scoring and explainable candidate match reports.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/login">
              <span className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
                Enter Vendor Portal <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link href="/login">
              <span className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border border-slate-700/30">
                Hiring Manager Login
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-950 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Core Platform Architecture</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Engineered with clean architectural patterns, robust security bounds, and state-of-the-art AI parsing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 hover:border-blue-500/50 transition-colors space-y-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl w-fit">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Deterministic AI Scoring</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Matches candidate profiles using strict logic (experience boundaries, skill overlap ratios, location alignment) run dynamically as tools by our LLM Agent.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 hover:border-indigo-500/50 transition-colors space-y-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Strict Multi-Tenancy</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero data leakage. All DB queries scope records strictly via tenant identifiers. Vendors can only query their own submissions and active openings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 hover:border-purple-500/50 transition-colors space-y-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl w-fit">
                <UploadCloud className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Secure S3 Uploads</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload resumes directly from clients to S3 storage via backend pre-signed URL tokens, protecting private AWS access keys from public exposure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Persona-Driven Workflows</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Role-Based Access Control (RBAC) maps secure features directly to user roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vendor Portal */}
            <div className="border bg-white dark:bg-slate-900/30 rounded-2xl p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">IT Vendor Portal</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> View openings available under your tenant
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Drag-and-drop multiple candidate resumes (PDF/PPTX)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Soft delete submissions and preview files securely
                </li>
                <li className="flex items-center gap-2 text-rose-500 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> AI recommendations & shortlists are completely hidden
                </li>
              </ul>
              <Link href="/login" className="block">
                <Button className="w-full bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700">
                  Access Vendor Tools
                </Button>
              </Link>
            </div>

            {/* Hiring Manager Portal */}
            <div className="border bg-white dark:bg-slate-900/30 rounded-2xl p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Hiring Manager Hub</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Manage vacancies owned exclusively by you
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Inspect detailed AI recommendation reports
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Read transparent matching explanations & latency benchmarks
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Shortlist or reject candidates in one click
                </li>
              </ul>
              <Link href="/login" className="block">
                <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                  Access Manager Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 py-12 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-slate-900 dark:text-white">Zelosify Recruit</span>
          </div>
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Zelosify Systems Inc. All rights reserved. Secure, isolated Multi-Tenant AI Placements.
          </p>
        </div>
      </footer>
    </div>
  );
}

