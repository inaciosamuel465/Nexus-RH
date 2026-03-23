import { GoogleGenAI } from "@google/genai";

// Obtém a chave da API do ambiente do Vite
// Usamos import.meta.env que é o padrão do Vite para exposição de variáveis VITE_*
const getApiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || "";
};

// Instancia o cliente Gemini (lazy)
let genAIInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (genAIInstance) return genAIInstance;
  
  const key = getApiKey();
  if (!key) {
    throw new Error("MISSING_API_KEY");
  }
  
  genAIInstance = new GoogleGenAI({ apiKey: key });
  return genAIInstance;
};

// Helper para converter base64 em parte multimodal
const fileToGenerativePart = (base64Data: string, mimeType: string) => ({
  inlineData: {
    data: base64Data.split(",")[1] || base64Data,
    mimeType,
  },
});

// Helper para formatar erros da API
const handleAIError = (error: any): string => {
  console.error("Gemini API Error:", error);
  const msg = error?.message || String(error);
  
  if (msg === "MISSING_API_KEY") {
    return "CHAVE_AUSENTE: A chave da API VITE_GEMINI_API_KEY não foi encontrada no arquivo .env.";
  }
  
  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota")) {
    return "QUOTA_EXCEDIDA: O limite de uso da API gratuita foi atingido ou esta chave não tem permissão para este modelo.";
  }
  
  if (msg.includes("403") || msg.includes("PERMISSION_DENIED")) {
    return "ACESSO_NEGADO: Chave de API inválida ou sem permissões necessárias.";
  }

  if (msg.includes("model not found") || msg.includes("404")) {
    return "MODELO_NAO_ENCONTRADO: O modelo selecionado (gemini-1.5-flash) pode não estar disponível para esta chave.";
  }

  return `ERRO_DESCONHECIDO: ${msg}`;
};

// ─── Análise Multimodal de Candidatos ─────────────────────────────────────────
export const analyzeCandidateMultimodal = async (
  jobRequirements: string,
  cvText?: string,
  cvImageBase64?: string,
  mimeType: string = "image/jpeg"
): Promise<any> => {
  try {
    const ai = getAI();
    const prompt = `Analise o currículo para a vaga: ${jobRequirements}. Use os dados: ${cvText || "Imagem anexa"}. Responda em JSON com score(0-100), strengths(array), weaknesses(array), recommendation(string).`;

    const parts: any[] = [{ text: prompt }];
    if (cvImageBase64) {
      parts.push(fileToGenerativePart(cvImageBase64, mimeType));
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: [{ role: "user", parts }],
    });

    const text = response.text || "{}";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (error) {
    throw new Error(handleAIError(error));
  }
};

// ─── Análise Simplificada ────────────────────────────────────────────────────
export const analyzeCandidate = (
  candidateName: string,
  cvText: string,
  jobRequirements: string
) => {
  return analyzeCandidateMultimodal(jobRequirements, cvText);
};

// ─── Resumo de Contratos ─────────────────────────────────────────────────────
export const summarizeContract = async (
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = "Analise este documento de RH e forneça um resumo com Tipo de Documento, Partes Envolvidas, Pontos Críticos e Resumo Executivo em Markdown.";

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Usando 1.5 para maior compatibilidade se o 2.0 falhar
      contents: [{ role: "user", parts: [{ text: prompt }, fileToGenerativePart(imageBase64, mimeType)] }],
    });

    return response.text || "Sem resposta.";
  } catch (error) {
    return handleAIError(error);
  }
};

// ─── Insights Estratégicos ───────────────────────────────────────────────────
export const getStrategicInsights = async (
  datasetJson: string
): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `Gere um relatório estratégico de RH (Diagnóstico, Riscos, Roadmap, KPIs) para este dataset: ${datasetJson}. Responda em Português do Brasil com Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text || "Erro ao gerar insights.";
  } catch (error) {
    return handleAIError(error);
  }
};

// ─── Chat para Assistente RH ────────────────────────────────────────────────
export const sendChatMessage = async (
  systemContext: string,
  userMessage: string,
  fileBase64?: string,
  fileMimeType?: string
): Promise<string> => {
  try {
    const ai = getAI();
    const parts: any[] = [{ text: `${systemContext}\n\nUsuário: ${userMessage}` }];
    
    if (fileBase64 && fileMimeType) {
      parts.push(fileToGenerativePart(fileBase64, fileMimeType));
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // 1.5-flash é mais provável de funcionar na camada gratuita estável
      contents: [{ role: "user", parts }],
    });

    return response.text || "Desculpe, não consegui processar.";
  } catch (error) {
    return handleAIError(error);
  }
};

