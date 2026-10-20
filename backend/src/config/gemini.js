import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

let client;

// created on first use, so the server still starts if the key is missing
export const getAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in backend/.env");
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
};