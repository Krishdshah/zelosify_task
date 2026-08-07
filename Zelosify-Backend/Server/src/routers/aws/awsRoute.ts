import express, { type RequestHandler } from "express";
import { listOfObjects, previewS3Object } from "../../controllers/controllers.js";
import { authenticateUser } from "../../middlewares/auth/authenticateMiddleware.js";

const router = express.Router();

/**
 * =============================================================================
 * AWS S3 FILE MANAGEMENT ROUTES
 * =============================================================================
 */

// GET /api/v1/aws/list - List all objects stored in the S3 bucket
router.get("/list", authenticateUser as RequestHandler, listOfObjects as any);

// POST /api/v1/aws/preview - Generate signed GET URL for file preview
router.post("/preview", authenticateUser as RequestHandler, previewS3Object as any);

export default router;

