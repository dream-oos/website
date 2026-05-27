export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  nickname: string;
  avatar: string;
  heroTexts: string[];
  social: {
    github: string;
    email: string;
    bilibili: string;
  };
  navLinks: {
    text: string;
    href: string;
  }[];
  comment: {
    provider: 'none' | 'twikoo' | 'waline';
    twikoo: {
      envId: string;
    };
    waline: {
      serverURL: string;
    };
  };
  i18n: {
    defaultLocale: string;
  };
}

export const siteConfig: SiteConfig = {
  title: 'Dreamer',
  description: '一个热爱代码与梦想的开发者的个人空间',
  author: 'Dreamer',
  nickname: 'Dreamer',
  avatar: '/avatar.png',
  heroTexts: [
    '一个热爱编程的 Dreamer 🚀',
    '开源爱好者 & 技术写作者 ✍️',
    '终身学习者，不断探索 🌟',
    '用代码构建梦想中的世界 💫',
  ],
  social: {
    github: 'https://github.com/dreamer-oos',
    email: 'mailto:hello@dreamer.dev',
    bilibili: 'https://space.bilibili.com/',
  },
  navLinks: [
    { text: '首页', href: '/' },
    { text: '博客', href: '/blog' },
    { text: '项目', href: '/projects' },
    { text: '友链', href: '/friends' },
    { text: '关于', href: '/about' },
  ],
  comment: {
    provider: 'none',
    twikoo: {
      envId: '',
    },
    waline: {
      serverURL: '',
    },
  },
  i18n: {
    defaultLocale: 'zh-CN',
  },
};
