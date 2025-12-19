
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCandidate = async (candidateName: string, cvText: string, jobRequirements: string) => {
  const ai = getAI();
  // Using gemini-3-pro-preview for complex reasoning task of CV analysis and matching
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analise o seguinte currículo para a vaga especificada. 
    Vaga: ${jobRequirements}
    Currículo do Candidato ${candidateName}: ${cvText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Nota de 0 a 100 de compatibilidade" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pontos fortes" },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pontos a desenvolver" },
          recommendation: { type: Type.STRING, description: "Recomendação final" }
        },
        required: ["score", "strengths", "weaknesses", "recommendation"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const getHRInsights = async (data: string) => {
  const ai = getAI();
  // Using gemini-3-pro-preview for advanced strategic reasoning over HR datasets
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Como um consultor de RH sênior, analise estes dados e forneça 3 insights estratégicos curtos: ${data}`,
  });
  return response.text;
};
