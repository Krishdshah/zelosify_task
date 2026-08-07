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

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          My Openings
        </h1>
        <p className="text-muted-foreground">
          View job openings you own, check AI-assisted resume screening matching metrics, and shortlist high-quality talent.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
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
              You do not have any active openings registered under your account.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Title</TableHead>
                <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Location</TableHead>
                <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Contract Type</TableHead>
                <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Posted Date</TableHead>
                <TableHead className="text-right font-semibold text-gray-800 dark:text-gray-200">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openings.map((opening) => (
                <TableRow key={opening.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold max-w-[280px] truncate">{opening.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{opening.location || "Remote"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {opening.contractType || "Contract"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(opening.postedDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/hiring-manager/openings/${opening.id}`} passHref>
                      <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Eye className="h-4 w-4" />
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
