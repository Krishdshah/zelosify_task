import express, { type RequestHandler } from "express";
import { authenticateUser } from "../../middlewares/auth/authenticateMiddleware.js";
import { authorizeRole } from "../../middlewares/auth/authorizeMiddleware.js";
import { deleteVendorProfile } from "../../controllers/vendor/vendorOpeningsController.js";
import vendorRequestRoutes from "./vendorRequestRoutes.js";
import vendorOpeningsRoutes from "./vendorOpeningsRoutes.js";

const router = express.Router();

/**
 * @route /vendor/requests
 */
router.use("/requests", vendorRequestRoutes);

/**
 * @route /vendor/openings
 */
router.use("/openings", vendorOpeningsRoutes);

/**
 * @route DELETE /vendor/profiles/:id
 */
router.delete(
  "/profiles/:id",
  authenticateUser as RequestHandler,
  authorizeRole("IT_VENDOR") as RequestHandler,
  deleteVendorProfile as any
);

export default router;


