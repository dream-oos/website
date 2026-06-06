export type SocialLink = { label: string; href: string };

export interface SiteConfig {
  name: string;
  tagline: string;
  bio: string[];
  avatar?: string;
  email: string;
  url: string;
  socials: SocialLink[];
}

export const site: SiteConfig = {
  name: '林深',
  tagline: '设计师 · 偶尔写字 · 喜欢猫和咖啡',
  bio: [
    '你好,我是林深。我喜欢把复杂的东西做简单。',
    '这里记录我的作品、随手写的文字,还有最近在读的书。',
  ],
  avatar: undefined,
  email: 'hi@example.com',
  url: 'https://lin-shen.vercel.app',
  socials: [
    { label: 'GitHub', href: 'https://github.com/yourname' },
    { label: '邮箱', href: 'mailto:hi@example.com' },
  ],
};
