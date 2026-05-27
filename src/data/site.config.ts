export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  avatar: string;
  heroTexts: string[];
  social: {
    github: string;
    email: string;
    twitter: string;
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
  title: '星轨小站',
  description: '一个关于前端开发、技术探索与生活随笔的个人博客',
  author: 'StarTrail',
  avatar: '/avatar.png',
  heroTexts: [
    '你好，欢迎来到我的小站 👋',
    '我是一名前端开发者',
    '热爱开源，热爱技术',
    '在这里记录我的成长与思考',
  ],
  social: {
    github: 'https://github.com/startrail',
    email: 'mailto:hello@startrail.dev',
    twitter: 'https://twitter.com/startrail',
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
