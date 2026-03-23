import { ISkill, SkillConfig } from './ISkill.js';
import { logger } from '../core/logger.js';
import { aiModel } from '../core/langchain.js';
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export default class CvAnalyzerSkill implements ISkill {
  config: SkillConfig = { 
    name: 'cvAnalyzer', 
    description: 'Analisa currículos e extrai dados estruturados usando LangChain e Gemini', 
    version: '2.0.0', 
    category: 'Recruitment' 
  };

  async execute(payload: { cvText: string; jobDescription?: string }): Promise<any> {
    logger.info('CvAnalyzerSkill: Iniciando análise via LangChain...');

    const prompt = PromptTemplate.fromTemplate(`
      Você é um recrutador técnico sênior. Analise o currículo abaixo em relação à vaga fornecida.
      
      Vaga: {jobDescription}
      Currículo: {cvText}

      Sua resposta deve ser um JSON válido (sem blocos de markdown) com:
      - score: numérico de 0 a 100 baseado no fit.
      - summary: um resumo profissional do candidato.
      - strengths: array de principais habilidades.
      - recommendation: string explicando se deve ou não avançar.
    `);

    const chain = prompt.pipe(aiModel).pipe(new StringOutputParser());

    try {
      const response = await chain.invoke({
        cvText: payload.cvText,
        jobDescription: payload.jobDescription || "Perfil Geral de Tecnologia"
      });

      const cleanJson = response.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      logger.error('CvAnalyzerSkill: Erro na orquestração LangChain:', err);
      throw new Error('Falha na análise inteligente do currículo.');
    }
  }
}
