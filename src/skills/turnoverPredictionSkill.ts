import { ISkill, SkillConfig } from './ISkill.js';
import { logger } from '../core/logger.js';
import { aiModel } from '../core/langchain.js';
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export default class TurnoverPredictionSkill implements ISkill {
  config: SkillConfig = { 
    name: 'turnoverPrediction', 
    description: 'Predição de risco de saída de colaboradores baseada em histórico e benchmarks', 
    version: '2.0.0', 
    category: 'Employee' 
  };

  async execute(payload: { employeeData: any; companyContext?: string }): Promise<any> {
    logger.info('TurnoverPredictionSkill: Calculando riscos de retenção...');

    const prompt = PromptTemplate.fromTemplate(`
      Analise os dados deste colaborador e preveja o risco dele sair da empresa (Turnover).
      
      Empresa: {companyContext}
      Dados do Colaborador: {employeeData}

      Sua resposta deve ser um JSON (sem blocos de markdown):
      - riskScore: 0 a 100 (100 = risco máximo).
      - riskLevel: "Baixo", "Médio", "Alto" ou "Crítico".
      - factors: array de motivos que levam a esse risco.
      - mitigationPlans: array de sugestões para reter este talento.
    `);

    const chain = prompt.pipe(aiModel).pipe(new StringOutputParser());

    try {
      const response = await chain.invoke({
        employeeData: JSON.stringify(payload.employeeData),
        companyContext: payload.companyContext || "Padrão de Mercado TI"
      });

      return JSON.parse(response.replace(/```json|```/g, "").trim());
    } catch (err) {
      logger.error('TurnoverPredictionSkill error:', err);
      throw new Error('Falha no modelo preditivo de retenção.');
    }
  }
}
