import { SkillManager } from '../core/SkillManager';

export class SkillService {
  private manager: SkillManager;
  private initialized: boolean = false;

  constructor() {
    this.manager = new SkillManager();
  }

  public async boot(): Promise<void> {
    if (this.initialized) return;
    await this.manager.loadSkills();
    this.initialized = true;
  }

  public getAvailableSkills() {
    return this.manager.getAllSkills().map(s => s.config);
  }

  public async runSkill(skillName: string, payload: any) {
    if (!this.initialized) {
      await this.boot();
    }
    return this.manager.executeSkill(skillName, payload);
  }
}

export const skillService = new SkillService();
