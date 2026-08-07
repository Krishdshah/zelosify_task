"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/Axios/AxiosInstance";
import { Button } from "@/components/UI/shadcn/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/shadcn/table";
import { Skeleton } from "@/components/UI/shadcn/skeleton";
import { Briefcase, MapPin, Calendar, Users, Eye } from "lucide-react";
import { toast } from "sonner";

export default function HiringManagerOpeningsPage() {
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/hiring-manager/openings");
        setOpenings(res.data.openings || []);
      } catch (error) {
        console.error("Failed to fetch openings:", error);
        toast.error("Failed to load your job openings.");
      } finally {
        setLoading(false);
      }
    };
    fetchOpenings();
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
      OPEN: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      CLOSED: "bg-gray-100 text-gray-600 border border-gray-200",
      ON_HOLD: "bg-amber-50 text-amber-700 border border-amber-200",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || styles.OPEN}`}>
        {status || "OPEN"}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
          My Openings
        </h1>
        <p className="text-sm text-gray-500 font-normal">
          View job openings you manage, check submitted candidate profiles, and take action via AI-assisted recommendations.
        </p>
      </div>

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
              You do not have any openings registered under your account yet.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#fcfdfd] border-b border-gray-150">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5 px-6">Role</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Location</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Contract</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Profiles</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Status</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5">Posted Date</TableHead>
                <TableHead className="font-semibold text-gray-400 text-xs py-3.5 text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openings.map((opening) => (
                <TableRow key={opening.id} className="hover:bg-gray-50/50 border-b border-gray-150 transition-colors">
                  <TableCell className="font-semibold text-sm max-w-[260px] truncate py-4 px-6">
                    {opening.title}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <span>{opening.location || "Remote"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-mono text-xs text-gray-600">
                      {opening.contractType || "Contract"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-semibold">{opening.profileCount ?? 0}</span>
                      <span className="text-gray-400">submitted</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {getStatusBadge(opening.status)}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span>{formatDate(opening.postedDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <Link href={`/hiring-manager/openings/${opening.id}`} passHref>
                      <Button size="sm" className="h-7 px-3 text-xs gap-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Eye className="h-3.5 w-3.5" />
                        View Candidates
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
