import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.5-pro";

export interface Part {
  text?: string;
  functionCall?: {
    name: string;
    args: any;
  };
  functionResponse?: {
    name: string;
    response: any;
  };
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface Content {
  role: "user" | "model";
  parts: Part[];
}

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: "OBJECT";
    properties: { [key: string]: any };
    required?: string[];
  };
}

export async function callGemini(
  contents: Content[],
  tools?: FunctionDeclaration[],
  systemInstruction?: string
): Promise<any> {
  if (!API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  const body: any = {
    contents,
  };

  if (tools && tools.length > 0) {
    body.tools = [
      {
        functionDeclarations: tools,
      },
    ];
  }

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  // Enforce JSON format output when no function call is expected
  // (We will let the model output standard JSON matching our AJV validation)
  body.generationConfig = {
    temperature: 0.1,
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000, // 15 seconds max timeout
    });

    return response.data;
  } catch (error: any) {
    console.error("[Gemini Client] API Error:", error.response?.data || error.message);
    throw error;
  }
}
