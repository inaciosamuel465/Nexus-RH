import fs from 'fs';
import path from 'path';
import { ISkill } from '../skills/ISkill';
import { logger } from './logger';

export class SkillManager {
  private skills: Map<string, ISkill> = new Map();

  constructor() {}

  /**
   * Varre o diretório de skills e tenta carregar e instanciar cada uma automaticamente.
   */
  public async loadSkills(skillsDir?: string): Promise<void> {
    const dir = skillsDir || path.join(process.cwd(), 'src', 'skills');
    
    if (!fs.existsSync(dir)) {
      logger.warn(`Diretório de skills não encontrado em ${dir}. Criando diretório default...`);
      fs.mkdirSync(dir, { recursive: true });
      return;
    }

    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      if ((file.endsWith('.ts') || file.endsWith('.js')) && !file.includes('ISkill')) {
        try {
          const fullPath = path.join(dir, file);
          const moduleUrl = `file://${fullPath.replace(/\\/g, '/')}`;
          const skillModule = await import(moduleUrl);

          const SkillClass = skillModule.default || Object.values(skillModule)[0];
          
          if (SkillClass && typeof SkillClass === 'function') {
            const skillInstance = new (SkillClass as any)() as ISkill;
            if (skillInstance.config && skillInstance.execute) {
              await this.registerSkill(skillInstance);
            }
          } else if (skillModule.config && skillModule.execute) {
             // Caso seja exportado diretamente como objeto
             await this.registerSkill(skillModule);
          }
        } catch (error) {
          logger.error(`Erro ao carregar skill no arquivo ${file}:`, error);
        }
      }
    }
  }

  public async registerSkill(skill: ISkill): Promise<void> {
    if (this.skills.has(skill.config.name)) {
      logger.warn(`Skill [${skill.config.name}] já foi registrada. Substituindo...`);
    }

    if (skill.initialize) {
      try {
        await skill.initialize();
      } catch (err) {
        logger.error(`Falha ao inicializar a skill [${skill.config.name}]:`, err);
        return;
      }
    }

    this.skills.set(skill.config.name, skill);
    logger.info(`Skill carregada e pronta: [${skill.config.name}] v${skill.config.version}`);
  }

  public getSkill(name: string): ISkill | undefined {
    return this.skills.get(name);
  }

  public getAllSkills(): ISkill[] {
    return Array.from(this.skills.values());
  }

  public async executeSkill(name: string, payload: any): Promise<any> {
    const skill = this.skills.get(name);
    if (!skill) {
      throw new Error(`Skill '${name}' não encontrada ou não carregada no motor.`);
    }
    
    logger.info(`Iniciando execução da skill [${name}]`);
    
    const start = Date.now();
    try {
      const result = await skill.execute(payload);
      const duration = Date.now() - start;
      logger.info(`Skill [${name}] concluída com sucesso em ${duration}ms`);
      return result;
    } catch (error) {
      logger.error(`Erro crítico executando a skill [${name}]:`, error);
      throw error;
    }
  }
}
