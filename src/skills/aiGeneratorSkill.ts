import { ISkill, SkillConfig } from './ISkill';
import { GoogleGenAI } from '@google/genai';
import { logger } from '../core/logger';

export default class AIGeneratorSkill implements ISkill {
  config: SkillConfig = {
    name: 'aiGenerator',
    description: 'Gera exercícios automaticamente baseados em nível e tema usando Gemini.',
    version: '1.0.0',
    category: 'Content Generation'
  };

  private ai: GoogleGenAI | null = null;

  async initialize() {
    // Usando a chave que já está no .env do projeto
    const key = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (key) {
      this.ai = new GoogleGenAI({ apiKey: key });
      logger.info('AIGeneratorSkill integrado com Gemini com sucesso.');
    } else {
      logger.warn('AIGeneratorSkill: GEMINI_API_KEY não localizada. O gerador falhará no momento da execução.');
    }
  }

  async execute(payload: { level: string; theme: string }): Promise<any> {
    if (!this.ai) {
      throw new Error('AIGeneratorSkill não está configurada (API Key ausente).');
    }

    if (!payload.level || !payload.theme) {
      throw new Error('AIGeneratorSkill: Payload inválido (nível ou tema ausentes).');
    }

    const prompt = `Crie um exercício de múltipla escolha.
Nível: ${payload.level}
Tema: ${payload.theme}

Sua resposta OBRIGATORIAMENTE deve ser um objeto JSON válido (sem markdown de bloco como \`\`\`json) com este exato formato:
{
  "pergunta": "...",
  "opcoes": ["A", "B", "C", "D"],
  "resposta": "A opção correta."
}`;

    const response = await this.ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text || "{}";
    try {
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      logger.error('AIGeneratorSkill: Falha ao estruturar JSON.', err);
      return { erro: "Falha ao gerar os dados do formato de exercicio adequadamente." };
    }
  }
}
