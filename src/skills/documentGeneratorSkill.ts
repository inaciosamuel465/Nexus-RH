import { ISkill, SkillConfig } from './ISkill.js';
import { logger } from '../core/logger.js';
import { aiModel } from '../core/langchain.js';
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export default class DocumentGeneratorSkill implements ISkill {
  config: SkillConfig = { 
    name: 'documentGenerator', 
    description: 'Gera minutas de documentos legais e de RH (CLT, Advertências, etc) via IA', 
    version: '2.0.0', 
    category: 'Content' 
  };

  async execute(payload: { documentType: string; variables: any }): Promise<any> {
    logger.info(`DocumentGeneratorSkill: Redigindo ${payload.documentType}...`);

    const prompt = PromptTemplate.fromTemplate(`
      Você é um assistente jurídico de RH. Escreva o conteúdo profissional de um documento do tipo: {documentType}.
      
      Variáveis para injeção: {variables}

      O texto deve ser formatado em Markdown profissional. 
      Responda em formato JSON (sem blocos de markdown):
      - title: Título do documento.
      - content: Conteúdo completo em Markdown.
      - keywords: array de palavras-chave para indexação.
    `);

    const chain = prompt.pipe(aiModel).pipe(new StringOutputParser());

    try {
      const response = await chain.invoke({
        documentType: payload.documentType,
        variables: JSON.stringify(payload.variables)
      });

      return JSON.parse(response.replace(/```json|```/g, "").trim());
    } catch (err) {
      logger.error('DocumentGeneratorSkill error:', err);
      throw new Error('Falha na geração inteligente do documento.');
    }
  }
}
