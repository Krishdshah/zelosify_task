import { Response } from "express";
import prisma from "../../config/prisma/prisma.js";
import type { AuthenticatedRequest } from "../../types/typeIndex.js";

/**
 * GET /api/v1/hiring-manager/openings
 * Retrieve job openings owned by the logged-in hiring manager.
 */
export async function getHiringManagerOpenings(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== "HIRING_MANAGER") {
      res.status(403).json({ error: "Access Denied: Requires HIRING_MANAGER role" });
      return;
    }

    const hiringManagerId = req.user.id;

    // Fetch only openings owned by this manager
    const openings = await prisma.opening.findMany({
      where: { hiringManagerId },
      orderBy: { postedDate: "desc" },
    });

    res.status(200).json({ openings });
  } catch (error: any) {
    console.error("[Hiring Manager Controller] getHiringManagerOpenings failed:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

/**
 * GET /api/v1/hiring-manager/openings/:id/profiles
 * Retrieve profiles submitted to a specific opening, including full AI recommendation scores.
 */
export async function getHiringManagerOpeningProfiles(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== "HIRING_MANAGER") {
      res.status(403).json({ error: "Access Denied: Requires HIRING_MANAGER role" });
      return;
    }

    const { id } = req.params;
    const hiringManagerId = req.user.id;

    // 1. Fetch opening and confirm ownership
    const opening = await prisma.opening.findUnique({
      where: { id },
    });

    if (!opening) {
      res.status(404).json({ error: "Opening not found" });
      return;
    }

    // Enforce condition: opening.hiringManagerId === loggedInUser.id
    if (opening.hiringManagerId !== hiringManagerId) {
      res.status(403).json({ error: "Access Denied: You do not own this opening" });
      return;
    }

    // 2. Fetch profiles submitted to this opening
    const profiles = await prisma.hiringProfile.findMany({
      where: {
        openingId: id,
        isDeleted: false,
      },
      orderBy: { submittedAt: "desc" },
    });

    // Map profiles to display clean file names
    const mappedProfiles = profiles.map((p) => ({
      ...p,
      filename: p.s3Key.split("/").pop()?.split("_").slice(1).join("_") || "resume.pdf",
    }));

    res.status(200).json({
      opening,
      profiles: mappedProfiles,
    });
  } catch (error: any) {
    console.error("[Hiring Manager Controller] getHiringManagerOpeningProfiles failed:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

/**
 * POST /api/v1/hiring-manager/profiles/:id/shortlist
 * Shortlists a candidate profile.
 */
export async function shortlistProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== "HIRING_MANAGER") {
      res.status(403).json({ error: "Access Denied: Requires HIRING_MANAGER role" });
      return;
    }

    const { id } = req.params;
    const hiringManagerId = req.user.id;

    const profileId = parseInt(id);
    if (isNaN(profileId)) {
      res.status(400).json({ error: "Invalid profile ID" });
      return;
    }

    // Retrieve profile with opening to check ownership
    const profile = await prisma.hiringProfile.findUnique({
      where: { id: profileId },
      include: { opening: true },
    });

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    // Enforce owner check
    if (profile.opening.hiringManagerId !== hiringManagerId) {
      res.status(403).json({ error: "Access Denied: You do not own the opening associated with this profile" });
      return;
    }

    // Update profile status transactionally
    const updated = await prisma.$transaction(async (tx) => {
      return await tx.hiringProfile.update({
        where: { id: profileId },
        data: {
          status: "SHORTLISTED",
          shortlistedBy: req.user?.email || null,
          shortlistedAt: new Date(),
          rejectedBy: null,
          rejectedAt: null,
        },
      });
    });

    res.status(200).json({
      message: "Candidate profile shortlisted successfully",
      profile: updated,
    });
  } catch (error: any) {
    console.error("[Hiring Manager Controller] shortlistProfile failed:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

/**
 * POST /api/v1/hiring-manager/profiles/:id/reject
 * Rejects a candidate profile.
 */
export async function rejectProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== "HIRING_MANAGER") {
      res.status(403).json({ error: "Access Denied: Requires HIRING_MANAGER role" });
      return;
    }

    const { id } = req.params;
    const hiringManagerId = req.user.id;

    const profileId = parseInt(id);
    if (isNaN(profileId)) {
      res.status(400).json({ error: "Invalid profile ID" });
      return;
    }

    // Retrieve profile with opening to check ownership
    const profile = await prisma.hiringProfile.findUnique({
      where: { id: profileId },
      include: { opening: true },
    });

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    // Enforce owner check
    if (profile.opening.hiringManagerId !== hiringManagerId) {
      res.status(403).json({ error: "Access Denied: You do not own the opening associated with this profile" });
      return;
    }

    // Update profile status transactionally
    const updated = await prisma.$transaction(async (tx) => {
      return await tx.hiringProfile.update({
        where: { id: profileId },
        data: {
          status: "REJECTED",
          rejectedBy: req.user?.email || null,
          rejectedAt: new Date(),
          shortlistedBy: null,
          shortlistedAt: null,
        },
      });
    });


    res.status(200).json({
      message: "Candidate profile rejected successfully",
      profile: updated,
    });
  } catch (error: any) {
    console.error("[Hiring Manager Controller] rejectProfile failed:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
