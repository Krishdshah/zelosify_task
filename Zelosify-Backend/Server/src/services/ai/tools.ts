import { createStorageService } from "../storage/storageFactory.js";
import pdf from "pdf-extraction";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { execSync } from "child_process";

const storageService = createStorageService();

/**
 * Helper: Stream to Buffer
 */
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/**
 * Helper: Parse PDF text
 */
async function parsePdf(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text || "";
}

/**
 * Helper: Parse PPTX text natively using cross-platform tar
 */
async function parsePptx(buffer: Buffer): Promise<string> {
  const tempDir = path.join(os.tmpdir(), `pptx_parse_${Date.now()}`);
  const tempZip = path.join(os.tmpdir(), `pptx_temp_${Date.now()}.zip`);

  try {
    fs.writeFileSync(tempZip, buffer);
    fs.mkdirSync(tempDir, { recursive: true });

    // Use built-in cross-platform tar to extract the PPTX (which is a zip archive)
    execSync(`tar -xf "${tempZip}" -C "${tempDir}"`, { stdio: "ignore" });

    // Read all slide files (ppt/slides/slide1.xml, slide2.xml, etc.)
    const slidesDir = path.join(tempDir, "ppt", "slides");
    if (!fs.existsSync(slidesDir)) {
      return "[PPTX Parser] Warning: ppt/slides directory not found. Could not parse.";
    }

    const files = fs.readdirSync(slidesDir);
    const xmlFiles = files.filter((f) => f.startsWith("slide") && f.endsWith(".xml"));

    let extractedText = "";
    for (const xmlFile of xmlFiles) {
      const filePath = path.join(slidesDir, xmlFile);
      const xmlContent = fs.readFileSync(filePath, "utf-8");

      // Strip XML tags to get raw text
      const cleanText = xmlContent
        .replace(/<[^>]+>/g, " ") // replace tags with space
        .replace(/\s+/g, " ") // collapse whitespaces
        .trim();
      extractedText += ` [Slide: ${xmlFile}] ${cleanText}\n`;
    }

    return extractedText.trim();
  } catch (error: any) {
    console.warn("[PPTX Parser] Tar extraction failed, falling back to basic ASCII extraction:", error.message);
    // Simple fallback: scan buffer for ASCII text segments
    let fallbackText = "";
    const str = buffer.toString("ascii");
    const matches = str.match(/[a-zA-Z0-9\s]{4,100}/g);
    if (matches) {
      fallbackText = matches.join(" ");
    }
    return `[Fallback text due to extraction error] ${fallbackText.substring(0, 1000)}`;
  } finally {
    // Cleanup files
    try {
      if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      // ignore cleanup errors
    }
  }
}

/**
 * 1. Resume Parsing Tool
 */
export async function readResumeFile(s3Key: string): Promise<string> {
  console.log(`[Tool: readResumeFile] Downloading file from S3: ${s3Key}`);
  const stream = await storageService.getObjectStream(s3Key);
  const buffer = await streamToBuffer(stream);

  if (s3Key.toLowerCase().endsWith(".pdf")) {
    console.log("[Tool: readResumeFile] Parsing PDF format...");
    return await parsePdf(buffer);
  } else if (s3Key.toLowerCase().endsWith(".pptx")) {
    console.log("[Tool: readResumeFile] Parsing PPTX format...");
    return await parsePptx(buffer);
  } else {
    // Treat as plain text
    return buffer.toString("utf-8");
  }
}

/**
 * 2. Skill Normalization Tool
 */
export function normalizeSkills(skills: string[]): string[] {
  console.log(`[Tool: normalizeSkills] Normalizing ${skills.length} skills`);
  const standardSkills = skills.map((skill) => {
    let clean = skill.trim().toLowerCase();
    // Example rules for normalization
    if (clean === "js" || clean === "javascript (es6)") return "javascript";
    if (clean === "ts") return "typescript";
    if (clean === "k8s") return "kubernetes";
    if (clean === "aws cloud" || clean === "amazon web services") return "aws";
    if (clean === "postgres" || clean === "pg") return "postgresql";
    return clean;
  });
  // Return unique standard skills
  return Array.from(new Set(standardSkills));
}

/**
 * 3. Deterministic Matching & Scoring Engine
 */
export interface OpeningRequirements {
  experienceMin: number;
  experienceMax: number | null;
  requiredSkills: string[];
  location: string | null;
  contractType: string | null;
}

export interface MatchingResult {
  skillMatchScore: number;
  experienceMatchScore: number;
  locationMatchScore: number;
  finalScore: number;
}

export function calculateMatchingScore(
  candidateExp: number,
  candidateSkills: string[],
  candidateLocation: string,
  reqs: OpeningRequirements
): MatchingResult {
  console.log("[Tool: calculateMatchingScore] Invoked with features:", {
    candidateExp,
    candidateSkills,
    candidateLocation,
    reqs,
  });

  // A. Experience Logic
  let experienceMatchScore = 0;
  if (candidateExp < reqs.experienceMin) {
    experienceMatchScore = 0;
  } else if (reqs.experienceMax === null || candidateExp <= reqs.experienceMax) {
    experienceMatchScore = 1;
  } else {
    experienceMatchScore = 0.8;
  }

  // B. Skill Match Logic (overlap / requiredSkills)
  let skillMatchScore = 0;
  if (reqs.requiredSkills.length > 0) {
    const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase());
    const matchedCount = reqs.requiredSkills.filter((reqSkill) =>
      candidateSkillsLower.includes(reqSkill.toLowerCase())
    ).length;
    skillMatchScore = matchedCount / reqs.requiredSkills.length;
  } else {
    // If no skills are required, match is 100%
    skillMatchScore = 1;
  }

  // C. Location Match Logic
  let locationMatchScore = 0;
  const reqLoc = reqs.location?.toLowerCase().trim() || "";
  const candLoc = candidateLocation.toLowerCase().trim();

  if (reqLoc === "remote" || reqLoc === "") {
    locationMatchScore = 1;
  } else if (reqLoc === candLoc) {
    locationMatchScore = 1;
  } else {
    locationMatchScore = 0.5; // Onsite mismatch
  }

  // D. Final Score Formula: (0.5 * skill) + (0.3 * exp) + (0.2 * location)
  const finalScore =
    0.5 * skillMatchScore + 0.3 * experienceMatchScore + 0.2 * locationMatchScore;

  // Round to 2 decimal places
  const result = {
    skillMatchScore: Math.round(skillMatchScore * 100) / 100,
    experienceMatchScore: Math.round(experienceMatchScore * 100) / 100,
    locationMatchScore: Math.round(locationMatchScore * 100) / 100,
    finalScore: Math.round(finalScore * 100) / 100,
  };

  console.log("[Tool: calculateMatchingScore] Match Result calculated:", result);
  return result;
}
