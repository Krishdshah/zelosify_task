"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/Axios/AxiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/UI/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/shadcn/table";
import { Skeleton } from "@/components/UI/shadcn/skeleton";
import { Button } from "@/components/UI/shadcn/button";
import { Briefcase, UploadCloud, Clock, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { toast } from "sonner";

export default function VendorDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/vendor/dashboard-stats");
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        toast.error("Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
      SHORTLISTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || styles.SUBMITTED}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const { stats, recentSubmissions } = data || { stats: {}, recentSubmissions: [] };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
          Vendor Dashboard
        </h1>
        <p className="text-sm text-gray-500 font-normal">
          Monitor your candidate submissions status and manage applications for open job openings.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-gray-150">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Open Vacancies</span>
              <h3 className="text-3xl font-bold text-gray-900">{stats.openVacancies ?? 0}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Briefcase className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-150">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Submissions</span>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalSubmissions ?? 0}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <UploadCloud className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-150">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Reviews</span>
              <h3 className="text-3xl font-bold text-gray-900">{stats.pendingReviews ?? 0}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recently Uploaded Profiles</h2>
          <Link href="/vendor/openings" passHref>
            <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold gap-1">
              View All Openings <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Card className="shadow-sm border-gray-150 overflow-hidden">
          {recentSubmissions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <UploadCloud className="h-10 w-10 mx-auto text-gray-300" />
              <h3 className="text-sm font-semibold text-gray-700">No submissions yet</h3>
              <p className="text-xs text-gray-400">Navigate to job openings to submit candidate resumes.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#fcfdfd] border-b border-gray-150">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-gray-400 text-xs py-3.5 px-6">Filename</TableHead>
                  <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Vacancy</TableHead>
                  <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Uploaded Date</TableHead>
                  <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.map((sub) => (
                  <TableRow key={sub.id} className="hover:bg-gray-50/50 border-b border-gray-150 transition-colors">
                    <TableCell className="font-semibold text-sm max-w-[280px] truncate py-4 px-6 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{sub.filename}</span>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-600">
                      {sub.openingTitle}
                    </TableCell>
                    <TableCell className="py-4 text-xs text-gray-500">
                      {formatDate(sub.submittedAt)}
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(sub.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
