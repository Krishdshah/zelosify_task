import { describe, it, expect } from "vitest";
import {
  calculateMatchingScore,
  OpeningRequirements,
} from "../../src/services/ai/tools.js";

describe("Deterministic Scoring Engine", () => {
  const defaultReqs: OpeningRequirements = {
    experienceMin: 3,
    experienceMax: 6,
    requiredSkills: ["react", "node", "typescript"],
    location: "Gotham City",
    contractType: "Contract",
  };

  it("should score 1.0 for perfect candidate profile matches", () => {
    const candidateExp = 4; // within 3-6 range (score 1)
    const candidateSkills = ["react", "node", "typescript", "git"]; // all required present (score 1)
    const candidateLocation = "Gotham City"; // matches opening location (score 1)

    const result = calculateMatchingScore(
      candidateExp,
      candidateSkills,
      candidateLocation,
      defaultReqs
    );

    expect(result.experienceMatchScore).toBe(1.0);
    expect(result.skillMatchScore).toBe(1.0);
    expect(result.locationMatchScore).toBe(1.0);
    expect(result.finalScore).toBe(1.0); // 0.5*1 + 0.3*1 + 0.2*1 = 1.0
  });

  it("should score 0 for experience if candidate is below minimum requirements", () => {
    const candidateExp = 2; // below 3 (score 0)
    const candidateSkills = ["react", "node", "typescript"]; // all present (score 1)
    const candidateLocation = "Gotham City"; // matches (score 1)

    const result = calculateMatchingScore(
      candidateExp,
      candidateSkills,
      candidateLocation,
      defaultReqs
    );

    expect(result.experienceMatchScore).toBe(0.0);
    expect(result.finalScore).toBe(0.7); // 0.5*1 + 0.3*0 + 0.2*1 = 0.7
  });

  it("should score 0.8 for experience if candidate exceeds maximum requirements", () => {
    const candidateExp = 8; // above 6 (score 0.8)
    const candidateSkills = ["react", "node", "typescript"]; // all present (score 1)
    const candidateLocation = "Gotham City"; // matches (score 1)

    const result = calculateMatchingScore(
      candidateExp,
      candidateSkills,
      candidateLocation,
      defaultReqs
    );

    expect(result.experienceMatchScore).toBe(0.8);
    expect(result.finalScore).toBe(0.94); // 0.5*1 + 0.3*0.8 + 0.2*1 = 0.94
  });

  it("should calculate skill overlap ratio correctly", () => {
    const candidateExp = 4; // matches (score 1)
    const candidateSkills = ["react", "git"]; // only 1 out of 3 matches (score 0.33)
    const candidateLocation = "Gotham City"; // matches (score 1)

    const result = calculateMatchingScore(
      candidateExp,
      candidateSkills,
      candidateLocation,
      defaultReqs
    );

    expect(result.skillMatchScore).toBe(0.33); // 1/3 rounded
    // 0.5*0.33 + 0.3*1 + 0.2*1 = 0.165 + 0.3 + 0.2 = 0.665 (rounds to 0.67)
    expect(result.finalScore).toBe(0.67);
  });

  it("should score 0.5 for location on onsite mismatches", () => {
    const candidateExp = 4; // matches (score 1)
    const candidateSkills = ["react", "node", "typescript"]; // matches (score 1)
    const candidateLocation = "New York"; // mismatch Gotham City (score 0.5)

    const result = calculateMatchingScore(
      candidateExp,
      candidateSkills,
      candidateLocation,
      defaultReqs
    );

    expect(result.locationMatchScore).toBe(0.5);
    expect(result.finalScore).toBe(0.9); // 0.5*1 + 0.3*1 + 0.2*0.5 = 0.5 + 0.3 + 0.1 = 0.9
  });

  it("should score 1.0 for location if the opening is remote", () => {
    const remoteReqs = { ...defaultReqs, location: "Remote" };
    const candidateExp = 4;
    const candidateSkills = ["react", "node", "typescript"];
    const candidateLocation = "San Francisco"; // Remote matches any location (score 1)

    const result = calculateMatchingScore(
      candidateExp,
      candidateSkills,
      candidateLocation,
      remoteReqs
    );

    expect(result.locationMatchScore).toBe(1.0);
    expect(result.finalScore).toBe(1.0);
  });
});
