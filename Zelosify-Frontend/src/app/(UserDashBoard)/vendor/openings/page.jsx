"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/Axios/AxiosInstance";
import { Button } from "@/components/UI/shadcn/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/shadcn/table";
import { Skeleton } from "@/components/UI/shadcn/skeleton";
import { Briefcase, MapPin, Calendar, User, FileText } from "lucide-react";
import { toast } from "sonner";

export default function VendorOpeningsPage() {
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOpenings = async (pageNum) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/vendor/openings?page=${pageNum}&limit=8`);
      setOpenings(res.data.openings || []);
      setPage(res.data.pagination?.page || 1);
      setTotalPages(res.data.pagination?.totalPages || 1);
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

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Available Openings
        </h1>
        <p className="text-muted-foreground">
          View and participate in contract openings under your tenant. Securely upload candidate resumes for evaluation.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
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
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Title</TableHead>
                <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Location</TableHead>
                <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Contract Type</TableHead>
                <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Posted Date</TableHead>
                <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Hiring Manager</TableHead>
                <TableHead className="text-right font-semibold text-gray-800 dark:text-gray-200">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openings.map((opening) => (
                <TableRow key={opening.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium max-w-[240px] truncate">{opening.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{opening.location || "Remote"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {opening.contractType || "Contract"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(opening.postedDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{opening.hiringManagerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/vendor/openings/${opening.id}`} passHref>
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <FileText className="h-4 w-4" />
                        Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="text-sm font-medium text-muted-foreground px-2">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
