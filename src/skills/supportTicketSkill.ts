import { ISkill, SkillConfig } from './ISkill.js';
import { logger } from '../core/logger.js';
import { aiModel } from '../core/langchain.js';
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export default class SupportTicketSkill implements ISkill {
  config: SkillConfig = { 
    name: 'supportTicket', 
    description: 'Análise e resolução inteligente de tickets de suporte interno', 
    version: '2.0.0', 
    category: 'Support' 
  };

  async execute(payload: { subject: string; description: string }): Promise<any> {
    logger.info('SupportTicketSkill: Analisando ticket de suporte...');

    const prompt = PromptTemplate.fromTemplate(`
      Analise este ticket de suporte interno de RH e forneça uma resolução ou encaminhamento.
      
      Assunto: {subject}
      Descrição: {description}

      Sua resposta deve ser um JSON (sem blocos de markdown):
      - aiResolution: Uma sugestão de resposta ou resolução imediata.
      - priority: "Baixa", "Média" ou "Alta".
      - escalation: Para qual departamento deve ser encaminhado caso não resolvido.
      - category: Categoria do problema (Ex: Benefícios, Folha, Técnico).
    `);

    const chain = prompt.pipe(aiModel).pipe(new StringOutputParser());

    try {
      const response = await chain.invoke({
        subject: payload.subject,
        description: payload.description
      });

      return JSON.parse(response.replace(/```json|```/g, "").trim());
    } catch (err) {
      logger.error('SupportTicketSkill error:', err);
      throw new Error('Falha na análise inteligente do ticket.');
    }
  }
}
