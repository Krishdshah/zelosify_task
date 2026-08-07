import { Router, type RequestHandler } from "express";
import { authenticateUser } from "../../middlewares/auth/authenticateMiddleware.js";
import { authorizeRole } from "../../middlewares/auth/authorizeMiddleware.js";
import {
  getVendorOpenings,
  getVendorOpeningDetail,
  getVendorProfileUploadPresign,
  submitVendorCandidateProfile,
} from "../../controllers/vendor/vendorOpeningsController.js";

const router = Router();

// Apply auth and role check to all vendor openings routes
router.use(authenticateUser as RequestHandler);
router.use(authorizeRole("IT_VENDOR") as RequestHandler);

// GET /api/v1/vendor/openings
router.get("/", getVendorOpenings as any);

// GET /api/v1/vendor/openings/:id
router.get("/:id", getVendorOpeningDetail as any);

// POST /api/v1/vendor/openings/:id/profiles/presign
router.post("/:id/profiles/presign", getVendorProfileUploadPresign as any);

// POST /api/v1/vendor/openings/:id/profiles/upload
router.post("/:id/profiles/upload", submitVendorCandidateProfile as any);

export default router;
