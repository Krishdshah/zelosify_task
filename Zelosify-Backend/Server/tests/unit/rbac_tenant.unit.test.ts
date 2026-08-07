import { describe, it, expect, vi, beforeEach } from "vitest";
import { getVendorOpenings, getVendorOpeningDetail } from "../../src/controllers/vendor/vendorOpeningsController.js";
import { getHiringManagerOpenings, getHiringManagerOpeningProfiles } from "../../src/controllers/hiring/hiringManagerOpeningsController.js";
import prisma from "../../src/config/prisma/prisma.js";

// Mock the Prisma client
vi.mock("../../src/config/prisma/prisma.js", () => {
  return {
    default: {
      opening: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
      },
      user: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      hiringProfile: {
        findMany: vi.fn(),
      },
    },
  };
});

describe("RBAC & Tenant Isolation Security Checks", () => {
  let mockRes: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  describe("IT Vendor Role Access", () => {
    it("should reject requests if req.user role is not IT_VENDOR", async () => {
      const mockReq: any = {
        user: { role: "HIRING_MANAGER", tenant: { tenantId: "tenant-1" } },
        query: {},
      };

      await getVendorOpenings(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("Requires IT_VENDOR role") })
      );
    });

    it("should restrict opening search query by vendor tenantId", async () => {
      const mockReq: any = {
        user: { role: "IT_VENDOR", tenant: { tenantId: "wayne-corp-id" } },
        query: { page: "1", limit: "10" },
      };

      (prisma.opening.findMany as any).mockResolvedValue([]);
      (prisma.opening.count as any).mockResolvedValue(0);
      (prisma.user.findMany as any).mockResolvedValue([]);

      await getVendorOpenings(mockReq, mockRes);

      // Verify that the prisma query explicitly filters by the vendor's tenantId (isolation verification)
      expect(prisma.opening.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tenantId: "wayne-corp-id" },
        })
      );
    });

    it("should restrict profile retrieval by vendor ownership and strip AI fields", async () => {
      const mockReq: any = {
        user: { role: "IT_VENDOR", email: "vendor1@example.com", tenant: { tenantId: "wayne-corp-id" } },
        params: { id: "opening-1" },
      };

      // Mock opening that belongs to vendor's tenant
      (prisma.opening.findUnique as any).mockResolvedValue({
        id: "opening-1",
        tenantId: "wayne-corp-id",
        hiringManagerId: "manager-1",
      });

      (prisma.user.findUnique as any).mockResolvedValue({
        firstName: "Alfred",
        lastName: "Pennyworth",
      });

      // Mock profiles, including some with AI recommendation data
      (prisma.hiringProfile.findMany as any).mockResolvedValue([
        {
          id: 1,
          openingId: "opening-1",
          s3Key: "wayne-corp-id/opening-1/1234_cv.pdf",
          uploadedBy: "vendor1@example.com",
          status: "SUBMITTED",
          recommended: true, // Should be stripped
          recommendationScore: 0.85, // Should be stripped
          recommendationReason: "Strong fit", // Should be stripped
          isDeleted: false,
        },
      ]);

      await getVendorOpeningDetail(mockReq, mockRes);

      // Assert that profiles query is isolated by uploadedBy (vendor ownership check)
      expect(prisma.hiringProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            openingId: "opening-1",
            uploadedBy: "vendor1@example.com",
            isDeleted: false,
          },
        })
      );

      // Assert that AI recommendation details are stripped from response (vendor data leak prevention check)
      const jsonResponse = mockRes.json.mock.calls[0][0];
      const returnedProfile = jsonResponse.profiles[0];
      expect(returnedProfile.recommended).toBeUndefined();
      expect(returnedProfile.recommendationScore).toBeUndefined();
      expect(returnedProfile.recommendationReason).toBeUndefined();
      expect(returnedProfile.s3Key).toBeDefined();
    });
  });

  describe("Hiring Manager Role Access", () => {
    it("should reject openings retrieval if role is not HIRING_MANAGER", async () => {
      const mockReq: any = {
        user: { role: "IT_VENDOR", id: "vendor-1" },
      };

      await getHiringManagerOpenings(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("Requires HIRING_MANAGER role") })
      );
    });

    it("should only return openings owned by the specific manager", async () => {
      const mockReq: any = {
        user: { role: "HIRING_MANAGER", id: "manager-1" },
      };

      (prisma.opening.findMany as any).mockResolvedValue([]);

      await getHiringManagerOpenings(mockReq, mockRes);

      // Verify that openings query matches the logged-in manager's ID
      expect(prisma.opening.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { hiringManagerId: "manager-1" },
        })
      );
    });

    it("should prevent a hiring manager from viewing profiles of openings they do not own", async () => {
      const mockReq: any = {
        user: { role: "HIRING_MANAGER", id: "manager-1" },
        params: { id: "opening-2" },
      };

      // Mock opening owned by a different manager
      (prisma.opening.findUnique as any).mockResolvedValue({
        id: "opening-2",
        hiringManagerId: "manager-2", // different manager
      });

      await getHiringManagerOpeningProfiles(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("You do not own this opening") })
      );
    });
  });
});
