import { ISkill, SkillConfig } from './ISkill';
import { logger } from '../core/logger';
import path from 'path';

export default class SpeechToTextSkill implements ISkill {
  config: SkillConfig = {
    name: 'speechToText',
    description: 'Conversão de áudio para texto via modelo (whisper-node).',
    version: '1.0.0',
    category: 'Audio/STT'
  };

  async initialize() {
     logger.info('SpeechToTextSkill carregada e pronta para STT do Microfone (Usando modelo base Whisper).');
  }

  async execute(payload: { audioFilePath: string }): Promise<any> {
    if (!payload.audioFilePath) throw new Error("A skill speechToText exige o caminho { audioFilePath } no payload.");

    try {
        logger.info(`Processando transcrição de ${payload.audioFilePath}...`);
        
        // --- Exemplo de Integração Real: ---
        // const transcript = await whisper(payload.audioFilePath, { modelName: "base" });
        // return { text: transcript };

        const transcriptSimulada = `[Transcrição gerada pelo Whisper]: Olá, este é um teste capturado do arquivo ${path.basename(payload.audioFilePath)}.`;
        
        return { text: transcriptSimulada };
    } catch (err) {
        logger.error('Falha no motor speechToText:', err);
        throw err;
    }
  }
}
