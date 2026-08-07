import { Response } from "express";
import prisma from "../../config/prisma/prisma.js";
import { createStorageService } from "../../services/storage/storageFactory.js";
import { RecommenderService } from "../../services/ai/recommenderService.js";
import type { AuthenticatedRequest } from "../../types/typeIndex.js";

const storageService = createStorageService();
const recommenderService = new RecommenderService();

/**
 * GET /api/v1/vendor/openings
 * Fetch paginated job openings scoped to the vendor's tenant.
 */
export async function getVendorOpenings(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== "IT_VENDOR") {
      res.status(403).json({ error: "Access Denied: Requires IT_VENDOR role" });
      return;
    }

    const tenantId = req.user.tenant?.tenantId;
    if (!tenantId) {
      res.status(400).json({ error: "User is not associated with any tenant" });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fetch openings for vendor's tenant
    const openings = await prisma.opening.findMany({
      where: { tenantId },
      skip,
      take: limit,
      orderBy: { postedDate: "desc" },
    });

    const total = await prisma.opening.count({
      where: { tenantId },
    });

    // Resolve hiring manager names
    const managerIds = Array.from(new Set(openings.map((o) => o.hiringManagerId)));
    const managers = await prisma.user.findMany({
      where: { id: { in: managerIds } },
      select: { id: true, firstName: true, lastName: true },
    });

    const managerMap = new Map(
      managers.map((m) => [m.id, `${m.firstName || ""} ${m.lastName || ""}`.trim()])
    );

    const mappedOpenings = openings.map((o) => ({
      ...o,
      hiringManagerName: managerMap.get(o.hiringManagerId) || "Unknown Manager",
    }));

    res.status(200).json({
      openings: mappedOpenings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("[Vendor Controller] getVendorOpenings failed:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

/**
 * GET /api/v1/vendor/openings/:id
 * Retrieve details for a single job opening, including files uploaded by this vendor.
 */
export async function getVendorOpeningDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== "IT_VENDOR") {
      res.status(403).json({ error: "Access Denied: Requires IT_VENDOR role" });
      return;
    }

    const { id } = req.params;
    const tenantId = req.user.tenant?.tenantId;

    const opening = await prisma.opening.findUnique({
      where: { id },
    });

    // Strict RBAC: Opening must exist and belong to the vendor's tenant
    if (!opening || opening.tenantId !== tenantId) {
      res.status(404).json({ error: "Opening not found" });
      return;
    }

    // Retrieve hiring manager info
    const manager = await prisma.user.findUnique({
      where: { id: opening.hiringManagerId },
      select: { firstName: true, lastName: true },
    });
    const managerName = manager ? `${manager.firstName || ""} ${manager.lastName || ""}`.trim() : "Unknown Manager";

    // Retrieve profiles uploaded by this specific vendor only
    const vendorEmail = req.user.email;
    const profiles = await prisma.hiringProfile.findMany({
      where: {
        openingId: id,
        uploadedBy: vendorEmail,
        isDeleted: false,
      },
      orderBy: { submittedAt: "desc" },
    });

    // Strict Security enforcement: Strip AI Agent recommendation data from vendor response
    const sanitizedProfiles = profiles.map((p) => ({
      id: p.id,
      openingId: p.openingId,
      s3Key: p.s3Key,
      filename: p.s3Key.split("/").pop()?.split("_").slice(1).join("_") || "resume.pdf",
      uploadedBy: p.uploadedBy,
      submittedAt: p.submittedAt,
      status: p.status,
    }));

    res.status(200).json({
      opening: {
        ...opening,
        hiringManagerName: managerName,
      },
      profilesCount: sanitizedProfiles.length,
      profiles: sanitizedProfiles,
    });
  } catch (error: any) {
    console.error("[Vendor Controller] getVendorOpeningDetail failed:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

/**
 * POST /api/v1/vendor/openings/:id/profiles/presign
 * Generates an S3 pre-signed upload URL for candidates.
 */
export async function getVendorProfileUploadPresign(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== "IT_VENDOR") {
      res.status(403).json({ error: "Access Denied: Requires IT_VENDOR role" });
      return;
    }

    const { id } = req.params;
    const { filename } = req.body;
    const tenantId = req.user.tenant?.tenantId;

    if (!filename) {
      res.status(400).json({ error: "Filename is required in body" });
      return;
    }

    // Enforce file extension check (PDF, PPTX)
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "pptx") {
      res.status(400).json({ error: "Invalid file format. Only PDF and PPTX files are supported." });
      return;
    }

    // Verify opening belongs to the vendor's tenant
    const opening = await prisma.opening.findUnique({
      where: { id },
    });
    if (!opening || opening.tenantId !== tenantId) {
      res.status(404).json({ error: "Opening not found" });
      return;
    }

    // S3 path template: <bucket>/<tenantId>/<openingId>/<timestamp>_<filename>
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/\s+/g, "_");
    const s3Key = `${tenantId}/${id}/${timestamp}_${sanitizedFilename}`;

    const uploadUrl = await storageService.getUploadURL(s3Key);

    res.status(200).json({
      uploadUrl,
      s3Key,
    });
  } catch (error: any) {
    console.error("[Vendor Controller] getVendorProfileUploadPresign failed:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

/**
 * POST /api/v1/vendor/openings/:id/profiles/upload
 * Finalizes profile metadata registration and kicks off async AI Agent evaluation.
 */
export async function submitVendorCandidateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== "IT_VENDOR") {
      res.status(403).json({ error: "Access Denied: Requires IT_VENDOR role" });
      return;
    }

    const { id } = req.params;
    const { s3Key } = req.body;
    const tenantId = req.user.tenant?.tenantId;

    if (!s3Key) {
      res.status(400).json({ error: "s3Key is required in body" });
      return;
    }

    // Verify the opening exists and belongs to the vendor's tenant
    const opening = await prisma.opening.findUnique({
      where: { id },
    });
    if (!opening || opening.tenantId !== tenantId) {
      res.status(404).json({ error: "Opening not found" });
      return;
    }

    const vendorEmail = req.user.email;

    // Use Prisma transaction to write profile and check uniqueness
    const newProfile = await prisma.$transaction(async (tx) => {
      // Check if S3 key is already submitted
      const existing = await tx.hiringProfile.findUnique({
        where: { s3Key },
      });
      if (existing) {
        throw new Error("Duplicate submission: File already registered.");
      }

      return await tx.hiringProfile.create({
        data: {
          openingId: id,
          s3Key,
          uploadedBy: vendorEmail,
          status: "SUBMITTED",
        },
      });
    });

    // Trigger AI Agent scoring asynchronously (Non-blocking background job)
    recommenderService.triggerRecommendation(newProfile.id);

    res.status(201).json({
      message: "Candidate profile registered successfully. AI Agent recommendation triggered in the background.",
      profile: {
        id: newProfile.id,
        openingId: newProfile.openingId,
        s3Key: newProfile.s3Key,
        uploadedBy: newProfile.uploadedBy,
        submittedAt: newProfile.submittedAt,
        status: newProfile.status,
      },
    });
  } catch (error: any) {
    console.error("[Vendor Controller] submitVendorCandidateProfile failed:", error);
    if (error.message.includes("Duplicate submission")) {
      res.status(409).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

/**
 * DELETE /api/v1/vendor/profiles/:id
 * Soft deletes a candidate profile uploaded by the vendor.
 */
export async function deleteVendorProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== "IT_VENDOR") {
      res.status(403).json({ error: "Access Denied: Requires IT_VENDOR role" });
      return;
    }

    const { id } = req.params;
    const profileId = parseInt(id);

    if (isNaN(profileId)) {
      res.status(400).json({ error: "Invalid profile ID" });
      return;
    }

    const profile = await prisma.hiringProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    // Verify vendor owns this submission
    if (profile.uploadedBy !== req.user.email) {
      res.status(403).json({ error: "Access Denied: You do not own this candidate profile" });
      return;
    }

    // Soft delete profile in a database transaction
    const updated = await prisma.hiringProfile.update({
      where: { id: profileId },
      data: { isDeleted: true },
    });

    res.status(200).json({
      message: "Profile deleted successfully (soft-deleted)",
      profile: {
        id: updated.id,
        isDeleted: updated.isDeleted,
      },
    });
  } catch (error: any) {
    console.error("[Vendor Controller] deleteVendorProfile failed:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

