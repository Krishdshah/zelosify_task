"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/Axios/AxiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/UI/shadcn/card";
import { Skeleton } from "@/components/UI/shadcn/skeleton";
import { Button } from "@/components/UI/shadcn/button";
import { Briefcase, Users, Sparkles, XCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function HiringManagerDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/hiring-manager/dashboard-stats");
        setStats(res.data.stats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        toast.error("Failed to load hiring analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
          Hiring Dashboard
        </h1>
        <p className="text-sm text-gray-500 font-normal">
          Overview of your active job postings, application pipelines, and AI recommendation metrics.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="shadow-sm border-gray-150">
          <CardContent className="p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">My Openings</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.myOpenings ?? 0}</h3>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-150">
          <CardContent className="p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.pendingCandidates ?? 0}</h3>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-150">
          <CardContent className="p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.recommendedCandidates ?? 0}</h3>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-150">
          <CardContent className="p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shortlisted</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.shortlistedCandidates ?? 0}</h3>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-150">
          <CardContent className="p-5 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rejected</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <XCircle className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.rejectedCandidates ?? 0}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Action Shortcut Banner */}
      <Card className="shadow-sm border-indigo-100 bg-indigo-50/30">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-gray-900 text-base">Explore Candidate Pipelines</h3>
            <p className="text-sm text-gray-500">Go to your active job vacancies list to evaluate submissions and run automated AI suitability checks.</p>
          </div>
          <Link href="/hiring-manager/openings" passHref>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 px-4 gap-1.5 shrink-0">
              Go to My Openings <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
