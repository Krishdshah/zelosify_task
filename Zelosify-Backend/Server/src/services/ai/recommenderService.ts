import prisma from "../../config/prisma/prisma.js";
import { runAgentOrchestrator, AgentOutput } from "./agentOrchestrator.js";
import { validateOutput, getValidationErrorString } from "./schemaValidator.js";

/**
 * Maps opening titles/descriptions to a set of required skills for deterministic matching.
 */
export function extractRequiredSkills(title: string, description: string | null): string[] {
  const desc = (description || "").toLowerCase();
  const t = title.toLowerCase();

  const skills: string[] = [];

  // Match common tech stack keywords
  if (t.includes("frontend") || desc.includes("react") || desc.includes("next.js")) {
    skills.push("react", "next.js", "javascript");
  }
  if (t.includes("devops") || desc.includes("kubernetes") || desc.includes("k8s")) {
    skills.push("kubernetes", "docker", "aws");
  }
  if (t.includes("cloud") || desc.includes("aws") || desc.includes("infrastructure")) {
    skills.push("aws", "cloud", "security");
  }
  if (t.includes("ml") || t.includes("ai") || desc.includes("machine learning")) {
    skills.push("python", "tensorflow", "pytorch");
  }
  if (t.includes("security") || desc.includes("cybersecurity") || desc.includes("incident")) {
    skills.push("security", "network", "firewall");
  }
  if (t.includes("database") || desc.includes("postgres") || desc.includes("sql")) {
    skills.push("postgresql", "sql", "database");
  }
  if (t.includes("qa") || desc.includes("cypress") || desc.includes("playwright")) {
    skills.push("cypress", "testing", "javascript");
  }
  if (t.includes("embedded") || desc.includes("firmware") || desc.includes("c/c++")) {
    skills.push("c++", "firmware", "embedded");
  }

  // Fallbacks if no specific keywords match
  if (skills.length === 0) {
    skills.push("typescript", "node.js", "git");
  }

  return Array.from(new Set(skills));
}

export class RecommenderService {
  /**
   * Main entrypoint to process profile recommendation asynchronously
   */
  async processRecommendation(profileId: number): Promise<void> {
    const startTime = Date.now();
    console.log(`[Recommender Service] 🤖 Starting AI Agent evaluation for profile ID: ${profileId}`);

    try {
      // 1. Fetch profile and opening data
      const profile = await prisma.hiringProfile.findUnique({
        where: { id: profileId },
        include: { opening: true },
      });

      if (!profile) {
        throw new Error(`Profile with ID ${profileId} not found`);
      }

      const opening = profile.opening;
      const requiredSkills = extractRequiredSkills(opening.title, opening.description);

      // 2. Run agent orchestrator with retry logic for malformed outputs
      let agentResult: AgentOutput | null = null;
      let attempts = 0;
      const maxAttempts = 3;
      let errorMessages: string[] = [];

      while (attempts < maxAttempts) {
        attempts++;
        try {
          console.log(`[Recommender Service] Recommendation attempt #${attempts}`);
          agentResult = await runAgentOrchestrator(
            profile.s3Key,
            {
              title: opening.title,
              experienceMin: opening.experienceMin,
              experienceMax: opening.experienceMax,
              location: opening.location,
              contractType: opening.contractType,
            },
            requiredSkills
          );

          // Validate final output using schema validator
          const isValid = validateOutput({
            recommended: agentResult.recommended,
            score: agentResult.score,
            confidence: agentResult.confidence,
            reason: agentResult.reason,
          });

          if (!isValid) {
            const valError = getValidationErrorString();
            throw new Error(`Schema validation failed on agent output: ${valError}`);
          }

          break; // Success! Exit retry loop
        } catch (err: any) {
          console.warn(`[Recommender Service] Attempt #${attempts} failed:`, err.message);
          errorMessages.push(`Attempt #${attempts}: ${err.message}`);
          if (attempts >= maxAttempts) {
            throw new Error(`All ${maxAttempts} attempts to run LLM Agent failed. Details:\n` + errorMessages.join("\n"));
          }
          // Simple backoff
          await new Promise((resolve) => setTimeout(resolve, 500 * attempts));
        }
      }

      if (!agentResult) {
        throw new Error("AI Agent completed execution but returned no payload");
      }

      const latencyMs = Date.now() - startTime;

      // 3. Persist the recommendation results inside a database transaction
      await prisma.$transaction(async (tx) => {
        await tx.hiringProfile.update({
          where: { id: profileId },
          data: {
            recommended: agentResult!.recommended,
            recommendationScore: agentResult!.score,
            recommendationReason: agentResult!.reason,
            recommendationConfidence: agentResult!.confidence,
            recommendationLatencyMs: latencyMs,
            recommendationVersion: "v1.0.0",
            recommendedAt: new Date(),
          },
        });
      });

      // 4. Observability: Structured JSON log to stdout
      const logPayload = {
        timestamp: new Date().toISOString(),
        event: "AI_RECOMMENDATION_SUCCESS",
        profileId,
        openingId: opening.id,
        parsingTimeMs: agentResult.metadata.latencyMs, // Reasoning loop latency
        totalProcessingTimeMs: latencyMs,
        score: agentResult.score,
        recommended: agentResult.recommended,
        confidence: agentResult.confidence,
        skillsNormalized: agentResult.metadata.parsedFeatures?.skills || [],
        experienceExtracted: agentResult.metadata.parsedFeatures?.experienceYears || 0,
        matchingBreakdown: agentResult.metadata.scoringBreakdown,
        attempts,
      };

      console.log(JSON.stringify(logPayload));
      console.log(`[Recommender Service] ✅ Recommendation saved successfully for profile ID: ${profileId}`);
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;

      // Structured error log
      const errorLog = {
        timestamp: new Date().toISOString(),
        event: "AI_RECOMMENDATION_FAILURE",
        profileId,
        totalProcessingTimeMs: latencyMs,
        error: error.message,
        stack: error.stack,
      };
      console.error(JSON.stringify(errorLog));
    }
  }

  /**
   * Async trigger method: executes AI recommendation in background
   */
  triggerRecommendation(profileId: number): void {
    // Run asynchronously in the background so HTTP thread is non-blocking
    setImmediate(() => {
      this.processRecommendation(profileId).catch((err) => {
        console.error(`[Recommender Service] Fatal background error for profile ${profileId}:`, err);
      });
    });
  }
}
