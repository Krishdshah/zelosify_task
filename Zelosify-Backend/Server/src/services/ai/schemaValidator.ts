import Ajv from "ajv";

const ajv = new Ajv();

const agentOutputSchema = {
  type: "object",
  properties: {
    recommended: { type: "boolean" },
    score: { type: "number" },
    confidence: { type: "number" },
    reason: { type: "string" },
  },
  required: ["recommended", "score", "confidence", "reason"],
  additionalProperties: true, // Allow additional metadata properties if generated
};

const validateAgentOutput = ajv.compile(agentOutputSchema);

/**
 * Validates the structured output from the LLM agent.
 * @param data - The parsed output object to validate
 * @returns boolean indicating if the data is valid
 */
export function validateOutput(data: any): boolean {
  return validateAgentOutput(data) as boolean;
}

/**
 * Returns a formatted error string from the last validation run.
 */
export function getValidationErrorString(): string {
  if (!validateAgentOutput.errors) return "";
  return ajv.errorsText(validateAgentOutput.errors);
}
