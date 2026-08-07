"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/Axios/AxiosInstance";
import axios from "axios"; // Plain axios for direct S3 uploads
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/UI/shadcn/button";
import { Skeleton } from "@/components/UI/shadcn/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/UI/shadcn/card";
import {
  UploadCloud,
  FileText,
  Trash2,
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function VendorOpeningDetailPage({ params }) {
  const router = useRouter();
  // Unwrap route params
  const { id } = use(params);

  const [opening, setOpening] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/vendor/openings/${id}`);
      setOpening(res.data.opening);
      setProfiles(res.data.profiles || []);
    } catch (error) {
      console.error("Failed to fetch details:", error);
      toast.error("Failed to load job details.");
      router.push("/vendor/openings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      setUploading(true);

      for (const file of acceptedFiles) {
        const fileToastId = toast.loading(`Uploading '${file.name}'...`);
        try {
          // 1. Get presigned upload URL
          const presignRes = await axiosInstance.post(`/vendor/openings/${id}/profiles/presign`, {
            filename: file.name,
          });
          const { uploadUrl, s3Key } = presignRes.data;

          // 2. Direct PUT request to S3 (using vanilla axios)
          await axios.put(uploadUrl, file, {
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
          });

          // 3. Complete submission with backend Express server
          await axiosInstance.post(`/vendor/openings/${id}/profiles/upload`, {
            s3Key,
          });

          toast.success(`Candidate '${file.name}' submitted successfully!`, { id: fileToastId });
        } catch (error) {
          console.error("Upload error for file:", file.name, error);
          const errorMsg = error.response?.data?.error || error.message || "Upload failed";
          toast.error(`Failed to upload candidate file '${file.name}': ${errorMsg}`, { id: fileToastId });
        }
      }

      setUploading(false);
      fetchDetail();
    },
    [id]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    },
    multiple: true,
  });

  const handleDeleteProfile = async (profileId, filename) => {
    if (!confirm(`Are you sure you want to delete profile for '${filename}'?`)) return;

    try {
      await axiosInstance.delete(`/vendor/profiles/${profileId}`);
      toast.success("Profile deleted successfully");
      fetchDetail();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete candidate profile.");
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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/vendor/openings")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to openings
        </Button>
      </div>

      {opening && (
        <Card className="shadow-md">
          <CardHeader className="space-y-2 border-b bg-muted/20">
            <div className="flex items-start justify-between">
              <CardTitle className="text-2xl font-bold">{opening.title}</CardTitle>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
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
                <User className="h-4 w-4" /> Manager: {opening.hiringManagerName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Posted: {formatDate(opening.postedDate)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h4 className="font-semibold mb-1 text-sm text-gray-800 dark:text-gray-200">Requirements:</h4>
              <p className="text-sm text-muted-foreground">
                Experience Range: {opening.experienceMin} to {opening.experienceMax || "Any"} years.
              </p>
            </div>
            {opening.description && (
              <div>
                <h4 className="font-semibold mb-1 text-sm text-gray-800 dark:text-gray-200">Description:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {opening.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Resumes Box */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Upload Candidate Resumes</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/35 hover:border-primary"
            } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground/80 mb-3" />
            {isDragActive ? (
              <p className="text-sm text-primary font-medium">Drop the files here...</p>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium">Drag & drop candidate profiles, or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports PDF and PPTX file formats</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Candidates List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <span>Submitted Candidates</span>
            <span className="text-sm font-normal text-muted-foreground">{profiles.length} profiles</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {profiles.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No profiles submitted yet for this opening.
            </div>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate pr-4">{profile.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted at {new Date(profile.submittedAt).toLocaleDateString()} by {profile.uploadedBy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 mr-2">
                    {profile.status}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => handlePreviewFile(profile.s3Key)}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => handleDeleteProfile(profile.id, profile.filename)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
