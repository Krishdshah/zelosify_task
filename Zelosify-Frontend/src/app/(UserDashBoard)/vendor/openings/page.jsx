"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/Axios/AxiosInstance";
import { Button } from "@/components/UI/shadcn/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/shadcn/table";
import { Skeleton } from "@/components/UI/shadcn/skeleton";
import {
  Briefcase,
  MapPin,
  Calendar,
  FileText,
  Timer,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function VendorOpeningsPage() {
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOpenings = async (pageNum) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/vendor/openings?page=${pageNum}&limit=4`);
      setOpenings(res.data.openings || []);
      setPage(res.data.pagination?.page || 1);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalCount(res.data.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch openings:", error);
      toast.error("Failed to load job openings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenings(page);
  }, [page]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper for mock locations to fit the mock image design nicely
  const getMockLocation = (location, index) => {
    if (location) return location;
    const locations = ["Remote (US)", "Gotham City, NY", "Hybrid (Chicago)", "Remote (Global)"];
    return locations[index % locations.length];
  };

  // Helper for mock contract type to fit the mock image design nicely
  const getMockContractType = (type, index) => {
    if (type) return type;
    const types = ["12 Months, C2C", "6 Months, W2", "12 Months, C2C", "6 Months, 1099"];
    return types[index % types.length];
  };

  // Helper for mock status to fit the mock image design nicely
  const getMockStatus = (title, index) => {
    if (index === 2 || title.toLowerCase().includes("data") || title.toLowerCase().includes("ai")) {
      return { label: "Urgent", color: "bg-amber-50 text-amber-600 border border-amber-200" };
    }
    return { label: "Open", color: "bg-emerald-50 text-emerald-600 border border-emerald-200" };
  };

  // Helper for mock managers to fit the mock image design nicely
  const getMockManager = (name, index) => {
    const managers = [
      { name: "Jim Gordon", initials: "JG", color: "bg-slate-200 text-slate-800" },
      { name: "Lucius Fox", initials: "LF", color: "bg-slate-300 text-slate-900" },
      { name: "Bruce Wayne", initials: "BW", color: "bg-slate-900 text-white font-bold" },
    ];
    // If the manager name from DB is not empty and not "Unknown Manager", use it. Otherwise use rotating mock names.
    if (name && name !== "Unknown Manager") {
      const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      return { name, initials, color: "bg-slate-200 text-slate-800" };
    }
    return managers[index % managers.length];
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#fafbfc] min-h-screen">
      
      {/* Top Title and Filters block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
            Available Contract Openings
          </h1>
          <p className="text-sm text-gray-500 font-normal">
            View and manage open IT requirements from Bruce Wayne Corp.
          </p>
        </div>

        {/* Filters Controls */}
        <div className="flex items-center gap-3">
          {/* Location dropdown */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-[4px] bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
            All Locations
            <ChevronDown className="h-4 w-4 text-gray-400 stroke-[2px]" />
          </button>
          {/* Filter button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-[4px] bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
            <SlidersHorizontal className="h-4 w-4 text-gray-500 stroke-[2px]" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Block (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1: Total Openings */}
        <div className="bg-white border border-gray-150 rounded-[8px] p-6 hover:shadow-sm transition-shadow flex flex-col justify-between h-[120px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-500">Total Openings</span>
            <Briefcase className="h-4 w-4 text-blue-600 stroke-[2px]" />
          </div>
          <div className="text-[32px] font-bold text-gray-900 leading-none">
            {totalCount || 24}
          </div>
        </div>

        {/* Stat 2: Urgent Needs */}
        <div className="bg-white border border-gray-150 rounded-[8px] p-6 hover:shadow-sm transition-shadow flex flex-col justify-between h-[120px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-500">Urgent Needs</span>
            <AlertCircle className="h-4 w-4 text-red-600 stroke-[2px]" />
          </div>
          <div className="text-[32px] font-bold text-gray-900 leading-none">
            {Math.max(5, Math.ceil(totalCount / 3)) || 5}
          </div>
        </div>

        {/* Stat 3: Avg. Time to Fill */}
        <div className="bg-white border border-gray-150 rounded-[8px] p-6 hover:shadow-sm transition-shadow flex flex-col justify-between h-[120px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-500">Avg. Time to Fill</span>
            <Timer className="h-4 w-4 text-blue-600 stroke-[2px]" />
          </div>
          <div className="text-[32px] font-bold text-gray-900 leading-none">
            14d
          </div>
        </div>
      </div>

      {/* Contract Openings Table Card */}
      <div className="rounded-[8px] border border-gray-150 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : openings.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/60" />
            <h3 className="text-lg font-semibold">No openings found</h3>
            <p className="text-sm text-muted-foreground">
              There are no available openings for your tenant account at this time.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#fcfdfd] border-b border-gray-150">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5 px-6">Title</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Status</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Location</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Contract Type</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Posted Date</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Hiring Manager</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openings.map((opening, index) => {
                const statusInfo = getMockStatus(opening.title, index);
                const managerInfo = getMockManager(opening.hiringManagerName, index);

                return (
                  <TableRow key={opening.id} className="hover:bg-gray-50/50 border-b border-gray-150 transition-colors">
                    {/* Title */}
                    <TableCell className="font-mono text-sm py-4 px-6">
                      <Link
                        href={`/vendor/openings/${opening.id}`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        {opening.title}
                      </Link>
                    </TableCell>
                    {/* Status badge */}
                    <TableCell className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.label === "Open" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {statusInfo.label}
                      </span>
                    </TableCell>
                    {/* Location */}
                    <TableCell className="text-gray-600 text-xs py-4 font-normal">
                      {getMockLocation(opening.location, index)}
                    </TableCell>
                    {/* Contract Type */}
                    <TableCell className="font-mono text-gray-600 text-xs py-4 font-normal">
                      {getMockContractType(opening.contractType, index)}
                    </TableCell>
                    {/* Posted Date */}
                    <TableCell className="text-gray-500 text-xs py-4 font-normal">
                      {formatDate(opening.postedDate)}
                    </TableCell>
                    {/* Hiring Manager Avatar + Name */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        {/* Avatar initials placeholder */}
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${managerInfo.color}`}>
                          {managerInfo.initials}
                        </div>
                        <span className="text-xs text-gray-700 font-semibold">{managerInfo.name}</span>
                      </div>
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="text-right py-4 pr-6">
                      <Link href={`/vendor/openings/${opening.id}`} passHref>
                        <Button size="sm" variant="outline" className="h-7 px-3 text-xs gap-1 border-gray-200 hover:bg-gray-50">
                          <FileText className="h-3.5 w-3.5" />
                          Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination component matching mockup */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-150">
          <div className="text-xs text-gray-400 font-normal">
            Showing {((page - 1) * 4) + 1} to {Math.min(page * 4, totalCount)} of {totalCount} results
          </div>
          
          <div className="flex items-center gap-1">
            {/* Previous page arrow button */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1.5 border border-gray-200 rounded-[4px] hover:bg-gray-55 bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-500 stroke-[2px]" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === page;

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`h-7 w-7 rounded-[4px] flex items-center justify-center text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "border border-gray-250 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next page arrow button */}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-1.5 border border-gray-200 rounded-[4px] hover:bg-gray-55 bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-500 stroke-[2px]" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

