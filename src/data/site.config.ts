// ============================================================
//  site.config.ts — 个人网站全局配置
//  修改这里即可更新网站所有个人信息
// ============================================================

export const siteConfig = {
  // ── 基本信息 ──────────────────────────────────────────────
  name: 'Dreamer',              // 昵称，显示在 Logo、首页、关于页
  title: 'Dreamer',             // 网站标题（浏览器 Tab）
  description: '一个热爱代码与梦想的开发者的个人空间',
  author: 'Dreamer',            // 版权署名
  avatar: '/avatar.webp',       // 头像路径（public/ 目录下），备用 /avatar.jpg
  favicon: '/favicon.png',      // Favicon 路径

  // ── 个人介绍（关于页） ──────────────────────────────────────
  bio: [
    '你好！👋 我是一名热爱编程的开发者，专注于 Web 前端和全栈开发。',
    '喜欢探索新技术，乐于分享所学，相信开源的力量。',
    '工作之余，我喜欢阅读、摄影和折腾各种有趣的开源项目。',
    '这个博客是我记录学习、思考和梦想的地方。',
  ],

  // ── 副标题 / Tagline ────────────────────────────────────────
  tagline: 'Full-Stack Developer · Open Source Dreamer',

  // ── 首页打字机文字 ───────────────────────────────────────────
  heroTexts: [
    '一个热爱编程的 Dreamer',
    '开源爱好者 & 技术写作者',
    '终身学习者，不断探索',
    '用代码构建梦想中的世界',
  ],

  // ── 社交链接 ────────────────────────────────────────────────
  social: {
    github:   'https://github.com/dream-oos',
    email:    'mailto:hello@dreamer.dev',
    bilibili: 'https://space.bilibili.com/',
    // twitter: '',   // 取消注释并填写即可启用
    // rss: '/rss.xml',
  },

  // ── 导航栏链接 ──────────────────────────────────────────────
  nav: [
    { text: '首页',  href: '/' },
    { text: '博客',  href: '/blog' },
    { text: '项目',  href: '/projects' },
    { text: '友链',  href: '/friends' },
    { text: '关于',  href: '/about' },
  ],

  // ── 评论系统（Waline） ──────────────────────────────────────
  // 填入你的 Waline 服务端地址，留空则不显示评论
  comment: {
    walineServerURL: 'https://waline.7s.nz',
  },

  // ── 友链申请邮箱 ────────────────────────────────────────────
  friendsEmail: 'hello@dreamer.dev',

  // ── 版权年份起始 ────────────────────────────────────────────
  since: 2024,
} as const;

// 类型导出（方便 IDE 补全）
export type SiteConfig = typeof siteConfig;
