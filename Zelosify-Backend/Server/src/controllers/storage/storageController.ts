// src/controllers/storageController.ts
import { Response } from "express";
import { createStorageService } from "../../services/storage/storageFactory.js";
import { getUserFolderPath } from "../../utils/aws/getUserFolderPath.js";
import type {
  AuthenticatedRequest,
  FileListResponse,
  ApiResponse,
} from "../../types/typeIndex.js";

const storageService = createStorageService();

/**
 * List objects in user's storage folder
 * @param req - Authenticated request
 * @param res - Response with file list
 */
export const listOfObjects = async (
  req: AuthenticatedRequest,
  res: Response<FileListResponse | ApiResponse>
): Promise<void> => {
  try {
    if (!req.user) {
      const errorResponse: ApiResponse = {
        status: "error",
        error: "Unauthorized: User not logged in",
      };
      res.status(401).json(errorResponse);
      return;
    }
    const userId = req.user?.id;
    const tenantId = req.user?.tenant?.tenantId;
    const department = req.user?.department;

    // Get folder path
    const folderPath = getUserFolderPath(
      "contract-uploads",
      tenantId,
      department,
      userId
    );

    const objects = await storageService.listObjects(folderPath);
    const files = objects.map((f: any) => ({
      key: f.Key,
      lastModified: f.LastModified,
      size: f.Size,
    }));

    const response: FileListResponse = { files };
    res.status(200).json(response);
  } catch (error: any) {
    console.error("[List] Error listing objects:", error);
    const errorResponse: ApiResponse = {
      status: "error",
      error: error.message,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * Generates a signed GET URL for S3 objects to preview resumes
 */
export const previewS3Object = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: "error", error: "Unauthorized" });
      return;
    }
    const { s3Key } = req.body;
    if (!s3Key) {
      res.status(400).json({ status: "error", error: "s3Key is required" });
      return;
    }

    // Verify tenant-level secure boundaries (tenantId matching)
    // S3 keys are prefixed with <tenantId>/...
    const tenantId = req.user.tenant?.tenantId;
    if (!tenantId) {
      res.status(400).json({ status: "error", error: "User tenant ID not found" });
      return;
    }

    // Ensure the user belongs to the tenant prefixing the S3 Key
    const keyPrefix = s3Key.split("/")[0];
    if (keyPrefix !== tenantId) {
      res.status(403).json({ status: "error", error: "Access Denied: Tenant boundary violation" });
      return;
    }

    const url = await storageService.getObjectURL(s3Key);
    res.status(200).json({ url });
  } catch (error: any) {
    console.error("[Preview] Error generating GET URL:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

