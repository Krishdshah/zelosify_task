import { Router, type RequestHandler } from "express";
import { authenticateUser } from "../../middlewares/auth/authenticateMiddleware.js";
import { authorizeRole } from "../../middlewares/auth/authorizeMiddleware.js";
import {
  getHiringManagerOpenings,
  getHiringManagerOpeningProfiles,
  shortlistProfile,
  rejectProfile,
} from "../../controllers/hiring/hiringManagerOpeningsController.js";

const router = Router();

// Apply authentication and role authorization for all routes
router.use(authenticateUser as RequestHandler);
router.use(authorizeRole("HIRING_MANAGER") as RequestHandler);

// GET /api/v1/hiring-manager/openings
router.get("/openings", getHiringManagerOpenings as any);

// GET /api/v1/hiring-manager/openings/:id/profiles
router.get("/openings/:id/profiles", getHiringManagerOpeningProfiles as any);
router.get("/openings/:id", getHiringManagerOpeningProfiles as any);
router.get("/openings/:id/candidates", getHiringManagerOpeningProfiles as any);

// POST /api/v1/hiring-manager/profiles/:id/shortlist
router.post("/profiles/:id/shortlist", shortlistProfile as any);
router.post("/shortlist/:id", shortlistProfile as any);

// POST /api/v1/hiring-manager/profiles/:id/reject
router.post("/profiles/:id/reject", rejectProfile as any);
router.post("/reject/:id", rejectProfile as any);

export default router;

