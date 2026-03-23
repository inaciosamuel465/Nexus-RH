import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { logger } from "./logger.js";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  logger.error("LangChain: VITE_GEMINI_API_KEY não encontrada no ambiente.");
}

// Configuração padrão do modelo LangChain para a plataforma
export const aiModel = new ChatGoogleGenerativeAI({
  apiKey: apiKey,
  modelName: "gemini-1.5-flash",
  maxOutputTokens: 2048,
  temperature: 0.7,
});

logger.info("LangChain: Engine Google Generative AI inicializada.");
