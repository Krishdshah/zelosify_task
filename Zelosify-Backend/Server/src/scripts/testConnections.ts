import prisma from "../config/prisma/prisma.js";
import { callGemini } from "../services/ai/geminiClient.js";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testModel(modelName: string) {
  console.log(`\nTesting model: "${modelName}"...`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: "Hello! Answer with one word: Success" }],
      },
    ],
    generationConfig: { temperature: 0.1 }
  };

  try {
    const startTime = Date.now();
    const response = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000
    });
    const latency = Date.now() - startTime;
    console.log(`✅ Success for "${modelName}"! Latency: ${latency}ms`);
    console.log("Response:", response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
    return true;
  } catch (err: any) {
    console.error(`❌ Failed for "${modelName}":`, err.response?.data?.error?.message || err.message);
    return false;
  }
}

async function main() {
  if (!API_KEY) {
    console.error("No GEMINI_API_KEY found!");
    return;
  }

  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.5-flash-latest",
  ];

  for (const model of modelsToTest) {
    await testModel(model);
  }
}

main().catch(console.error);
