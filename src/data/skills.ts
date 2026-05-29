// ============================================================
//  skills.ts — 从 skills.yaml 加载技能配置
//  如需修改技能列表，请编辑 skills.yaml，无需改动此文件
// ============================================================
// @ts-ignore — YAML imports are handled by the custom Vite plugin in astro.config.mjs
import rawSkills from './skills.yaml';

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export const skills = (rawSkills ?? []) as Skill[];
