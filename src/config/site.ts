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
  name: 'Dream',
  tagline: '程序员 · 聆听音乐 · 喜欢小狗',
  bio: [
    '你好,我是Dream。我喜欢把复杂的东西做简单。',
    '这里记录我的作品、随手写的文字,还有最近在读的书。',
  ],
  avatar: undefined,
  email: '3448104699@qq.com',
  url: 'https://dream.vercel.app',
  socials: [
    { label: 'GitHub', href: 'https://github.com/dream-oos' },
    { label: '邮箱', href: 'mailto:3448104699@qq.com' },
  ],
};
