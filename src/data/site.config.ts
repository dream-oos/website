// ============================================================
//  site.config.ts — 从 site.yaml 加载站点配置
//  如需修改站点信息，请编辑 site.yaml，无需改动此文件
// ============================================================
// @ts-ignore — YAML imports are handled by the custom Vite plugin in astro.config.mjs
import rawConfig from './site.yaml';

// ── 类型定义 ──────────────────────────────────────────────
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  author: string;
  avatar: string;
  favicon: string;
  since: number;
  tagline: string;
  heroTexts: string[];
  bio: string[];
  social: {
    github?: string;
    email?: string;
    bilibili?: string;
    twitter?: string;
    rss?: string;
  };
  fonts: {
    body: string;
    heading: string;
    code: string;
  };
  nav: Array<{ text: string; href: string }>;
  comment: {
    walineServerURL: string;
  };
  friendsEmail: string;
}

export const siteConfig = rawConfig as SiteConfig;
