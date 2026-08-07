"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/Axios/AxiosInstance";
import { Button } from "@/components/UI/shadcn/button";
import { Skeleton } from "@/components/UI/shadcn/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/UI/shadcn/card";
import { Badge } from "@/components/UI/shadcn/badge";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

export default function HiringManagerOpeningDetailPage({ params }) {
  const router = useRouter();
  // Unwrap route params
  const { id } = use(params);

  const [opening, setOpening] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Slicing-based virtualization for lists > 50 records to ensure P95 UI rendering performance
  const [visibleCount, setVisibleCount] = useState(50);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/hiring-manager/openings/${id}/profiles`);
      setOpening(res.data.opening);
      setProfiles(res.data.profiles || []);
    } catch (error) {
      console.error("Failed to fetch details:", error);
      toast.error("Failed to load candidates profiles.");
      router.push("/hiring-manager/openings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  // Infinite Scroll logic for virtualized list extension
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (visibleCount < profiles.length) {
        setVisibleCount((prev) => Math.min(prev + 50, profiles.length));
      }
    }
  }, [profiles.length, visibleCount]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleShortlist = async (profileId) => {
    const actionToastId = toast.loading("Shortlisting candidate...");
    try {
      await axiosInstance.post(`/hiring-manager/profiles/${profileId}/shortlist`);
      toast.success("Candidate shortlisted successfully!", { id: actionToastId });
      fetchDetail();
    } catch (error) {
      console.error("Failed to shortlist candidate:", error);
      toast.error("Failed to shortlist candidate profile.", { id: actionToastId });
    }
  };

  const handleReject = async (profileId) => {
    const actionToastId = toast.loading("Rejecting candidate...");
    try {
      await axiosInstance.post(`/hiring-manager/profiles/${profileId}/reject`);
      toast.success("Candidate rejected successfully.", { id: actionToastId });
      fetchDetail();
    } catch (error) {
      console.error("Failed to reject candidate:", error);
      toast.error("Failed to reject candidate profile.", { id: actionToastId });
    }
  };

  const handlePreviewFile = async (s3Key) => {
    try {
      const res = await axiosInstance.post("/aws/preview", { s3Key });
      if (res.data.url) {
        window.open(res.data.url, "_blank");
      } else {
        toast.error("Preview URL not generated.");
      }
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Failed to generate file preview.");
    }
  };

  const getRecommendationBadge = (score) => {
    if (score === null || score === undefined) {
      return (
        <Badge variant="outline" className="animate-pulse bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          AI Processing...
        </Badge>
      );
    }
    
    // Score decision boundaries
    if (score >= 0.75) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400">
          Recommended
        </Badge>
      );
    } else if (score >= 0.5) {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400">
          Borderline
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400">
          Not Recommended
        </Badge>
      );
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const virtualizedProfiles = profiles.slice(0, visibleCount);

  if (loading && !opening) {
    return (
      <div className="p-8 space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/hiring-manager/openings")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to openings
        </Button>
      </div>

      {opening && (
        <Card className="shadow-md">
          <CardHeader className="space-y-2 border-b bg-muted/20">
            <div className="flex items-start justify-between">
              <CardTitle className="text-2xl font-bold">{opening.title}</CardTitle>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                {opening.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {opening.location || "Remote"}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" /> {opening.contractType || "Contract"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Posted: {formatDate(opening.postedDate)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm font-semibold">
              Experience Requirement: {opening.experienceMin} to {opening.experienceMax || "Any"} years.
            </p>
            {opening.description && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {opening.description}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Candidates List Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Candidate Profiles</h2>
        <span className="text-sm text-muted-foreground">{profiles.length} total profiles</span>
      </div>

      {/* Candidate Cards Grid */}
      <div className="space-y-4">
        {profiles.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground text-sm">
            No profiles submitted for this job opening yet.
          </Card>
        ) : (
          virtualizedProfiles.map((profile) => (
            <Card
              key={profile.id}
              className={`shadow-sm border transition-shadow hover:shadow-md ${
                profile.status === "SHORTLISTED"
                  ? "border-l-4 border-l-emerald-500"
                  : profile.status === "REJECTED"
                  ? "border-l-4 border-l-rose-500"
                  : ""
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-base truncate pr-4 text-gray-900 dark:text-gray-100">
                        {profile.filename}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Uploaded on {formatDate(profile.submittedAt)} • Vendor: {profile.uploadedBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getRecommendationBadge(profile.recommendationScore)}
                    <Button variant="ghost" size="icon" onClick={() => handlePreviewFile(profile.s3Key)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* AI Agent Recommendation Breakdown */}
                {profile.recommendationScore !== null && (
                  <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-4 border border-muted/50 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> AI AGENT MATCH METRICS
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Latency: {profile.recommendationLatencyMs}ms
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Match Score</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                          {Math.round(profile.recommendationScore * 100)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Confidence</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                          {Math.round((profile.recommendationConfidence || 0) * 100)}%
                        </div>
                      </div>
                    </div>

                    {profile.recommendationReason && (
                      <div className="text-xs text-muted-foreground border-t pt-2 mt-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Explanation:</span>{" "}
                        {profile.recommendationReason}
                      </div>
                    )}
                  </div>
                )}

                {/* Candidate Action Buttons */}
                <div className="flex items-center justify-between border-t pt-4 mt-2">
                  <div className="text-xs text-muted-foreground">
                    Current Status:{" "}
                    <span
                      className={`font-semibold ${
                        profile.status === "SHORTLISTED"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : profile.status === "REJECTED"
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {profile.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {profile.status !== "SHORTLISTED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                        onClick={() => handleShortlist(profile.id)}
                      >
                        <CheckCircle className="h-4 w-4" /> Shortlist
                      </Button>
                    )}
                    {profile.status !== "REJECTED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 hover:text-rose-600 dark:text-rose-400"
                        onClick={() => handleReject(profile.id)}
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {visibleCount < profiles.length && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setVisibleCount((prev) => prev + 50)}>
            <ChevronDown className="h-4 w-4" /> Load More Profiles
          </Button>
        </div>
      )}
    </div>
  );
}
