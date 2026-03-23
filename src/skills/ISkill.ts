export interface SkillConfig {
  name: string;
  description: string;
  version: string;
  author?: string;
  category?: string;
}

export interface ISkill {
  config: SkillConfig;
  execute(payload: any): Promise<any>;
  initialize?(): Promise<void>;
  shutdown?(): Promise<void>;
}
