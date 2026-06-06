# 个人网站 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Astro 搭一个温暖简约柔和的中文个人主页(关于 / 作品 / 博客 / 联系),内容用 Markdown 管理,部署到 Vercel。

**Architecture:** Astro 纯静态站点。内容用 Content Collections(Content Layer + glob loader)+ 独立 zod schema 管理;把"过滤草稿 / 排序 / 取精选"等逻辑抽成纯函数放 `src/lib/content.ts` 做单元测试;展示型组件通过 props 通信,用 Astro Container API 做渲染测试;页面、布局、RSS 用 `astro build` 作为验收闸门。设计 token 全部走 CSS 变量,便于日后加深色模式。

**Tech Stack:** Astro 5(静态)、@astrojs/rss、@astrojs/sitemap、@fontsource-variable/{fraunces,inter} + 思源宋体(Google Fonts,仅标题)、zod、Vitest(含 Astro Container API)、部署 Vercel。

参考规格:`docs/superpowers/specs/2026-06-06-personal-website-design.md`

---

## 文件结构总览

```
.gitignore                      # 追加 node_modules/ dist/ .astro/
package.json                    # 依赖与脚本
tsconfig.json                   # 继承 astro strict
astro.config.mjs                # site、sitemap、shiki 主题
vitest.config.ts                # 基于 astro 的 vite 配置跑测试
README.md                       # 开发/部署/加内容说明
src/
  data/site.ts                  # 站点&作者信息、社交链接(唯一真源)
  styles/global.css             # 设计 token + 基础排版 + prose 文章样式
  content/
    schemas.ts                  # zod schema + 类型(可单测)
    config.ts                   # 集合定义(glob loader + schema)
    blog/*.md                   # 文章
    projects/*.md               # 作品
  lib/content.ts                # 纯函数:excludeDrafts/sortByDateDesc/getRecentPosts/getFeaturedProjects
  components/
    SocialLinks.astro
    Footer.astro
    Nav.astro
    ProjectCard.astro
    PostList.astro
    Hero.astro
  layouts/
    BaseLayout.astro            # <head>、字体、SEO/OG、Nav、Footer
    PostLayout.astro            # 文章阅读版式
  pages/
    index.astro                 # 首页
    about.astro                 # 关于
    projects/index.astro        # 作品列表
    projects/[slug].astro       # 作品详情
    blog/index.astro            # 博客列表
    blog/[slug].astro           # 文章详情
    rss.xml.js                  # RSS
    404.astro
test/
  content.test.ts               # lib/content 纯函数
  project-card.test.ts          # 组件渲染
  post-list.test.ts
  hero.test.ts
  social-links.test.ts
```

---

## Task 1: 项目脚手架、依赖与构建/测试链

**Files:**
- Create: `package.json`, `tsconfig.json`, `astro.config.mjs`, `vitest.config.ts`, `src/pages/index.astro`
- Modify: `.gitignore`

- [ ] **Step 1: 追加忽略项到 `.gitignore`**

在 `.gitignore` 末尾追加:

```
# Node / Astro
node_modules/
dist/
.astro/
```

- [ ] **Step 2: 创建 `package.json`**

```json
{
  "name": "personal-website",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run --passWithNoTests"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/rss": "^4.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@fontsource-variable/fraunces": "^5.0.0",
    "@fontsource-variable/inter": "^5.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.5.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 3: 创建 `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: 创建 `astro.config.mjs`**

`site` 先用一个具体的 Vercel 子域名占位,Task 3 会改成从 `site.ts` 读取(单一真源)。

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lin-shen.vercel.app',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'rose-pine-dawn', wrap: true },
  },
});
```

- [ ] **Step 5: 创建 `vitest.config.ts`**

```ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
```

- [ ] **Step 6: 创建最小首页 `src/pages/index.astro`(占位,Task 11 会替换)**

```astro
<!doctype html>
<html lang="zh-CN">
  <head><meta charset="utf-8" /><title>个人网站</title></head>
  <body><h1>建设中</h1></body>
</html>
```

- [ ] **Step 7: 安装依赖**

Run: `npm install`
Expected: 安装成功,生成 `node_modules/` 与 `package-lock.json`

- [ ] **Step 8: 验证构建与测试链**

Run: `npm run build && npm run test`
Expected: build 成功生成 `dist/`;test 输出 "no test files" 但因 `--passWithNoTests` 退出码为 0

- [ ] **Step 9: Commit**

```bash
git add .gitignore package.json package-lock.json tsconfig.json astro.config.mjs vitest.config.ts src/pages/index.astro
git commit -m "chore: 初始化 Astro 项目与构建/测试链"
```

---

## Task 2: 设计 token 与全局样式

**Files:**
- Create: `src/styles/global.css`

设计 token 来自规格第 4 节。本任务无单测,验收=构建通过(样式在后续页面里目视确认)。

- [ ] **Step 1: 创建 `src/styles/global.css`**

```css
@import '@fontsource-variable/fraunces';
@import '@fontsource-variable/inter';

:root {
  --color-bg: #FAF6EF;
  --color-surface: #FFFEFB;
  --color-border: #E7DDCC;
  --color-text-secondary: #8A7A6D;
  --color-text: #3A2E26;
  --color-accent: #C57E6E;
  --color-accent-hover: #B5685A;

  --font-serif: 'Fraunces Variable', 'Noto Serif SC', Georgia, 'Songti SC', serif;
  --font-sans: 'Inter Variable', system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;

  --radius: 10px;
  --content-width: 660px;
  --wide-width: 760px;
}

*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1, h2, h3, h4 { font-family: var(--font-serif); color: var(--color-text); line-height: 1.2; font-weight: 600; }
h1 { font-size: clamp(2rem, 5vw, 2.5rem); }
h2 { font-size: 1.6rem; }
h3 { font-size: 1.2rem; }

.muted, small { color: var(--color-text-secondary); }

a { color: var(--color-accent); text-decoration: none; transition: color .15s ease; }
a:hover { color: var(--color-accent-hover); }

img { max-width: 100%; height: auto; display: block; }

:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

.container { width: 100%; max-width: var(--content-width); margin-inline: auto; padding-inline: 1.25rem; }
.container--wide { max-width: var(--wide-width); }
.section { margin-block: 3rem; }
.eyebrow { font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 1rem; }

/* 文章正文 */
.prose { padding-block: 1rem 2rem; }
.prose p, .prose ul, .prose ol, .prose blockquote { margin-block: 1.1em; }
.prose h2 { margin-block: 1.6em .4em; }
.prose h3 { margin-block: 1.3em .3em; }
.prose a { text-decoration: underline; text-underline-offset: 3px; }
.prose code { font-size: .9em; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 5px; padding: .1em .35em; }
.prose pre { border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1rem 1.1rem; overflow-x: auto; }
.prose pre code { background: none; border: 0; padding: 0; }
.prose blockquote { border-left: 3px solid var(--color-border); padding-left: 1rem; color: var(--color-text-secondary); }
.prose img { border-radius: var(--radius); }
:target { scroll-margin-top: 2rem; }
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: 成功(此时样式尚未被页面引用,只验证 CSS 与字体包能被解析)

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: 设计 token 与全局样式"
```

---

## Task 3: 站点配置(唯一真源)

**Files:**
- Create: `src/data/site.ts`
- Modify: `astro.config.mjs`
- Test: `test/site.test.ts`

- [ ] **Step 1: 写失败测试 `test/site.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { site } from '../src/data/site';

describe('site config', () => {
  it('有必填字段', () => {
    expect(site.name).toBeTruthy();
    expect(site.tagline).toBeTruthy();
    expect(Array.isArray(site.bio)).toBe(true);
    expect(site.bio.length).toBeGreaterThan(0);
    expect(site.url).toMatch(/^https?:\/\//);
  });
  it('社交链接都有 label 和 href', () => {
    expect(site.socials.length).toBeGreaterThan(0);
    for (const s of site.socials) {
      expect(s.label).toBeTruthy();
      expect(s.href).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `npx vitest run test/site.test.ts`
Expected: FAIL —— 无法解析模块 `../src/data/site`

- [ ] **Step 3: 创建 `src/data/site.ts`**

内容为占位真值,使用者后续替换为自己的信息。

```ts
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
```

- [ ] **Step 4: 运行测试,确认通过**

Run: `npx vitest run test/site.test.ts`
Expected: PASS

- [ ] **Step 5: 让 `astro.config.mjs` 从 `site.ts` 读取 URL(单一真源)**

将 `astro.config.mjs` 顶部加入 import,并把 `site:` 改为引用:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/data/site';

export default defineConfig({
  site: site.url,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'rose-pine-dawn', wrap: true },
  },
});
```

- [ ] **Step 6: 验证构建仍通过**

Run: `npm run build`
Expected: 成功(`Astro.site` 取自 `site.url`)

- [ ] **Step 7: Commit**

```bash
git add src/data/site.ts astro.config.mjs test/site.test.ts
git commit -m "feat: 站点配置作为单一真源,并接入 astro.config"
```

---

## Task 4: 内容集合 schema 与示例内容

**Files:**
- Create: `src/content/schemas.ts`, `src/content/config.ts`
- Create: `src/content/blog/hello-world.md`, `src/content/blog/less-is-more.md`
- Create: `src/content/projects/notes-app.md`, `src/content/projects/city-sound-map.md`
- Test: `test/schemas.test.ts`

- [ ] **Step 1: 写失败测试 `test/schemas.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { blogSchema, projectSchema } from '../src/content/schemas';

describe('blogSchema', () => {
  it('接受合法 frontmatter 并把日期转为 Date,draft 默认 false', () => {
    const parsed = blogSchema.parse({ title: 'A', date: '2026-06-01', description: 'd' });
    expect(parsed.date instanceof Date).toBe(true);
    expect(parsed.draft).toBe(false);
  });
  it('缺少 title 时报错', () => {
    expect(() => blogSchema.parse({ date: '2026-06-01', description: 'd' })).toThrow();
  });
});

describe('projectSchema', () => {
  it('接受合法 frontmatter', () => {
    const p = projectSchema.parse({ title: 'P', year: 2025, description: 'd', link: 'https://x.com' });
    expect(p.year).toBe(2025);
  });
  it('link 非法 URL 时报错', () => {
    expect(() => projectSchema.parse({ title: 'P', year: 2025, description: 'd', link: 'not-a-url' })).toThrow();
  });
});
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `npx vitest run test/schemas.test.ts`
Expected: FAIL —— 无法解析 `../src/content/schemas`

- [ ] **Step 3: 创建 `src/content/schemas.ts`**

```ts
import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false),
});

export const projectSchema = z.object({
  title: z.string(),
  year: z.number().int(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  link: z.string().url().optional(),
  cover: z.string().optional(),
  order: z.number().optional(),
});

export type PostData = z.infer<typeof blogSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
export type PostEntry = { id: string; data: PostData };
export type ProjectEntry = { id: string; data: ProjectData };
```

- [ ] **Step 4: 运行测试,确认通过**

Run: `npx vitest run test/schemas.test.ts`
Expected: PASS

- [ ] **Step 5: 创建 `src/content/config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema, projectSchema } from './schemas';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: projectSchema,
});

export const collections = { blog, projects };
```

- [ ] **Step 6: 创建示例文章(两篇,含代码块以验证高亮)**

`src/content/blog/hello-world.md`:

````md
---
title: 你好,世界
date: 2026-06-01
description: 第一篇文章,顺便试试排版和代码高亮。
tags: [随笔]
---

这是正文。可以用 **加粗**、*斜体* 和 [链接](https://astro.build)。

```js
console.log('hello, world');
```
````

`src/content/blog/less-is-more.md`:

```md
---
title: 关于「少即是多」的一些反思
date: 2026-05-12
description: 为什么克制比堆砌更难。
tags: [设计, 随笔]
---

少不是空,而是把注意力留给真正重要的东西。
```

- [ ] **Step 7: 创建示例作品(两个:一个外链、一个内页)**

`src/content/projects/notes-app.md`:

```md
---
title: 一个安静的笔记应用
year: 2025
description: 专注写作、零干扰的本地笔记工具。
tags: [设计, 前端]
link: https://github.com/yourname/notes-app
order: 1
---
```

`src/content/projects/city-sound-map.md`(无 link,走站内详情页):

```md
---
title: 城市声音地图
year: 2024
description: 收集城市环境声、可在地图上聆听的实验项目。
tags: [实验]
order: 2
---

一个把城市声景标注到地图上的小项目。点击地点即可聆听当地录制的环境声。
```

- [ ] **Step 8: 验证内容校验与构建**

Run: `npm run check && npm run build`
Expected: `astro check` 通过(内容符合 schema);build 成功

- [ ] **Step 9: Commit**

```bash
git add src/content test/schemas.test.ts
git commit -m "feat: 内容集合 schema 与示例文章/作品"
```

---

## Task 5: 内容逻辑纯函数

**Files:**
- Create: `src/lib/content.ts`
- Test: `test/content.test.ts`

- [ ] **Step 1: 写失败测试 `test/content.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  excludeDrafts, sortByDateDesc, getRecentPosts, getFeaturedProjects,
} from '../src/lib/content';
import type { PostEntry, ProjectEntry } from '../src/content/schemas';

const post = (id: string, date: string, draft = false): PostEntry => ({
  id, data: { title: id, date: new Date(date), description: '', draft },
});
const proj = (id: string, year: number, order?: number): ProjectEntry => ({
  id, data: { title: id, year, description: '', order },
});

describe('content helpers', () => {
  it('excludeDrafts 去掉草稿', () => {
    expect(excludeDrafts([post('a', '2026-01-01'), post('b', '2026-01-02', true)]).map(p => p.id))
      .toEqual(['a']);
  });
  it('sortByDateDesc 新的在前', () => {
    expect(sortByDateDesc([post('old', '2026-01-01'), post('new', '2026-02-01')]).map(p => p.id))
      .toEqual(['new', 'old']);
  });
  it('getRecentPosts 去草稿+排序+截断', () => {
    const r = getRecentPosts(
      [post('a', '2026-01-01'), post('b', '2026-03-01'), post('c', '2026-02-01', true)], 1);
    expect(r.map(p => p.id)).toEqual(['b']);
  });
  it('getFeaturedProjects 先按 order 升序,无 order 的按 year 降序', () => {
    const r = getFeaturedProjects([proj('x', 2024), proj('y', 2025, 1), proj('z', 2023)], 3);
    expect(r.map(p => p.id)).toEqual(['y', 'x', 'z']);
  });
});
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `npx vitest run test/content.test.ts`
Expected: FAIL —— 无法解析 `../src/lib/content`

- [ ] **Step 3: 创建 `src/lib/content.ts`**

```ts
import type { PostEntry, ProjectEntry } from '../content/schemas';

export function excludeDrafts(posts: PostEntry[]): PostEntry[] {
  return posts.filter((p) => !p.data.draft);
}

export function sortByDateDesc(posts: PostEntry[]): PostEntry[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getRecentPosts(posts: PostEntry[], limit: number): PostEntry[] {
  return sortByDateDesc(excludeDrafts(posts)).slice(0, limit);
}

export function getFeaturedProjects(projects: ProjectEntry[], limit: number): ProjectEntry[] {
  const sorted = [...projects].sort((a, b) => {
    const ao = a.data.order ?? Number.POSITIVE_INFINITY;
    const bo = b.data.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return b.data.year - a.data.year;
  });
  return sorted.slice(0, limit);
}
```

- [ ] **Step 4: 运行测试,确认通过**

Run: `npx vitest run test/content.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/content.ts test/content.test.ts
git commit -m "feat: 内容过滤/排序/精选纯函数"
```

---

## Task 6: SocialLinks 与 Footer 组件

**Files:**
- Create: `src/components/SocialLinks.astro`, `src/components/Footer.astro`
- Test: `test/social-links.test.ts`

- [ ] **Step 1: 写失败测试 `test/social-links.test.ts`**

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import SocialLinks from '../src/components/SocialLinks.astro';

describe('SocialLinks', () => {
  it('渲染每个链接的 label 和 href', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SocialLinks, {
      props: { links: [{ label: 'GitHub', href: 'https://github.com/x' }] },
    });
    expect(html).toContain('GitHub');
    expect(html).toContain('href="https://github.com/x"');
  });
});
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `npx vitest run test/social-links.test.ts`
Expected: FAIL —— 无法解析 `../src/components/SocialLinks.astro`

- [ ] **Step 3: 创建 `src/components/SocialLinks.astro`**

```astro
---
import type { SocialLink } from '../data/site';
interface Props { links: SocialLink[]; }
const { links } = Astro.props;
---
<ul class="socials">
  {links.map((l) => (
    <li><a href={l.href} rel="me">{l.label}</a></li>
  ))}
</ul>
<style>
  .socials { list-style: none; display: flex; gap: .75rem; padding: 0; flex-wrap: wrap; }
  .socials a { font-size: .85rem; }
</style>
```

- [ ] **Step 4: 运行测试,确认通过**

Run: `npx vitest run test/social-links.test.ts`
Expected: PASS

- [ ] **Step 5: 创建 `src/components/Footer.astro`**

```astro
---
import SocialLinks from './SocialLinks.astro';
import { site } from '../data/site';
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="container container--wide">
    <SocialLinks links={site.socials} />
    <p class="muted">© {year} {site.name} · <a href={`mailto:${site.email}`}>{site.email}</a></p>
  </div>
</footer>
<style>
  .site-footer { border-top: 1px solid var(--color-border); margin-top: 4rem; padding-block: 2rem; }
  .site-footer p { font-size: .8rem; margin-top: .5rem; }
</style>
```

- [ ] **Step 6: 验证构建**

Run: `npm run build`
Expected: 成功(组件可编译)

- [ ] **Step 7: Commit**

```bash
git add src/components/SocialLinks.astro src/components/Footer.astro test/social-links.test.ts
git commit -m "feat: SocialLinks 与 Footer 组件"
```

---

## Task 7: Nav 与 BaseLayout

**Files:**
- Create: `src/components/Nav.astro`, `src/layouts/BaseLayout.astro`

BaseLayout 依赖 `Astro.site`/`Astro.url`,在容器测试里不稳定,故本任务以 `astro build` + 产物检查作为验收。

- [ ] **Step 1: 创建 `src/components/Nav.astro`**

`Astro.url` 用可选链兜底,避免无 URL 上下文时报错。

```astro
---
import { site } from '../data/site';
const links = [
  { href: '/about', label: '关于' },
  { href: '/projects', label: '作品' },
  { href: '/blog', label: '博客' },
];
const path = Astro.url?.pathname ?? '';
---
<nav class="site-nav container container--wide">
  <a class="brand" href="/">{site.name}</a>
  <ul>
    {links.map((l) => (
      <li><a href={l.href} aria-current={path.startsWith(l.href) ? 'page' : undefined}>{l.label}</a></li>
    ))}
  </ul>
</nav>
<style>
  .site-nav { display: flex; align-items: center; justify-content: space-between; padding-block: 1.25rem; }
  .brand { font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-text); }
  .site-nav ul { list-style: none; display: flex; gap: 1.1rem; padding: 0; }
  .site-nav ul a { color: var(--color-text-secondary); font-size: .9rem; }
  .site-nav ul a[aria-current='page'] { color: var(--color-accent); }
</style>
```

- [ ] **Step 2: 创建 `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import { site } from '../data/site';

interface Props { title?: string; description?: string; }
const { title, description } = Astro.props;
const pageTitle = title ? `${title} · ${site.name}` : `${site.name} · ${site.tagline}`;
const desc = description ?? site.bio[0];
const canonical = Astro.site ? new URL(Astro.url.pathname, Astro.site).toString() : Astro.url.pathname;
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    <meta name="description" content={desc} />
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={desc} />
    <meta property="og:url" content={canonical} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;600&display=swap" />
    <link rel="alternate" type="application/rss+xml" title={site.name} href="/rss.xml" />
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 3: 临时让首页用上 BaseLayout 以便验收**

把 `src/pages/index.astro` 暂时替换为(Task 11 会写正式版):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <div class="container"><h1>建设中</h1></div>
</BaseLayout>
```

- [ ] **Step 4: 构建并检查产物含关键 head 标签**

Run: `npm run build`
然后:
Run: `grep -o '<title>[^<]*</title>' dist/index.html && grep -c 'og:title' dist/index.html && grep -c 'rss.xml' dist/index.html`
Expected: 打印出 `<title>…</title>`;`og:title` 计数 ≥ 1;`rss.xml` 计数 ≥ 1

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.astro src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: Nav 与 BaseLayout(含 SEO/OG/字体/RSS 链接)"
```

---

## Task 8: ProjectCard 组件

**Files:**
- Create: `src/components/ProjectCard.astro`
- Test: `test/project-card.test.ts`

- [ ] **Step 1: 写失败测试 `test/project-card.test.ts`**

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import ProjectCard from '../src/components/ProjectCard.astro';
import type { ProjectEntry } from '../src/content/schemas';

const withLink: ProjectEntry = { id: 'a', data: { title: '外链项目', year: 2025, description: 'desc', link: 'https://example.com' } };
const noLink: ProjectEntry = { id: 'b', data: { title: '内页项目', year: 2024, description: 'desc' } };

describe('ProjectCard', () => {
  it('有 link 时外链且 target=_blank', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(ProjectCard, { props: { project: withLink } });
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('外链项目');
  });
  it('无 link 时指向站内详情页 /projects/{id}', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(ProjectCard, { props: { project: noLink } });
    expect(html).toContain('href="/projects/b"');
  });
});
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `npx vitest run test/project-card.test.ts`
Expected: FAIL —— 无法解析 `../src/components/ProjectCard.astro`

- [ ] **Step 3: 创建 `src/components/ProjectCard.astro`**

```astro
---
import type { ProjectEntry } from '../content/schemas';
interface Props { project: ProjectEntry; }
const { project } = Astro.props;
const { title, year, description, tags = [], link } = project.data;
const external = Boolean(link);
const href = link ?? `/projects/${project.id}`;
---
<a class="card" href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
  <div class="card__head">
    <h3>{title}</h3>
    <span class="muted year">{year}</span>
  </div>
  <p class="muted desc">{description}</p>
  {tags.length > 0 && <ul class="tags">{tags.map((t) => <li>{t}</li>)}</ul>}
</a>
<style>
  .card { display: block; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1.1rem 1.2rem; color: var(--color-text); transition: border-color .15s ease, transform .15s ease; }
  .card:hover { border-color: var(--color-accent); transform: translateY(-2px); }
  .card__head { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
  .card__head h3 { font-size: 1.1rem; }
  .year { font-size: .8rem; }
  .desc { font-size: .9rem; margin-top: .35rem; }
  .tags { list-style: none; display: flex; gap: .4rem; flex-wrap: wrap; padding: 0; margin-top: .7rem; }
  .tags li { font-size: .7rem; color: var(--color-text-secondary); border: 1px solid var(--color-border); border-radius: 999px; padding: .1rem .55rem; }
</style>
```

- [ ] **Step 4: 运行测试,确认通过**

Run: `npx vitest run test/project-card.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.astro test/project-card.test.ts
git commit -m "feat: ProjectCard 组件(外链/内页两种去向)"
```

---

## Task 9: PostList 组件

**Files:**
- Create: `src/components/PostList.astro`
- Test: `test/post-list.test.ts`

- [ ] **Step 1: 写失败测试 `test/post-list.test.ts`**

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import PostList from '../src/components/PostList.astro';
import type { PostEntry } from '../src/content/schemas';

const posts: PostEntry[] = [
  { id: 'p1', data: { title: '第一篇', date: new Date('2026-06-01'), description: '', draft: false } },
  { id: 'p2', data: { title: '第二篇', date: new Date('2026-05-01'), description: '', draft: false } },
];

describe('PostList', () => {
  it('渲染标题与 /blog/{id} 链接', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(PostList, { props: { posts } });
    expect(html).toContain('第一篇');
    expect(html).toContain('href="/blog/p1"');
    expect(html).toContain('href="/blog/p2"');
  });
});
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `npx vitest run test/post-list.test.ts`
Expected: FAIL —— 无法解析 `../src/components/PostList.astro`

- [ ] **Step 3: 创建 `src/components/PostList.astro`**

```astro
---
import type { PostEntry } from '../content/schemas';
interface Props { posts: PostEntry[]; }
const { posts } = Astro.props;
const fmt = (d: Date) => d.toISOString().slice(0, 10);
---
<ul class="post-list">
  {posts.map((post) => (
    <li>
      <a href={`/blog/${post.id}`}>{post.data.title}</a>
      <time datetime={post.data.date.toISOString()}>{fmt(post.data.date)}</time>
    </li>
  ))}
</ul>
<style>
  .post-list { list-style: none; padding: 0; }
  .post-list li { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; padding-block: .6rem; border-bottom: 1px solid var(--color-border); }
  .post-list a { color: var(--color-text); }
  .post-list a:hover { color: var(--color-accent); }
  .post-list time { color: var(--color-text-secondary); font-size: .8rem; white-space: nowrap; }
</style>
```

- [ ] **Step 4: 运行测试,确认通过**

Run: `npx vitest run test/post-list.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/PostList.astro test/post-list.test.ts
git commit -m "feat: PostList 组件"
```

---

## Task 10: Hero 组件

**Files:**
- Create: `src/components/Hero.astro`
- Test: `test/hero.test.ts`

- [ ] **Step 1: 写失败测试 `test/hero.test.ts`**

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Hero from '../src/components/Hero.astro';
import { site } from '../src/data/site';

describe('Hero', () => {
  it('渲染站点名字与一句话简介', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Hero);
    expect(html).toContain(site.name);
    expect(html).toContain(site.tagline);
  });
});
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `npx vitest run test/hero.test.ts`
Expected: FAIL —— 无法解析 `../src/components/Hero.astro`

- [ ] **Step 3: 创建 `src/components/Hero.astro`**

```astro
---
import SocialLinks from './SocialLinks.astro';
import { site } from '../data/site';
---
<header class="hero">
  {site.avatar && <img class="hero__avatar" src={site.avatar} alt={site.name} width="72" height="72" />}
  <h1>你好,我是{site.name}</h1>
  <p class="muted hero__tagline">{site.tagline}</p>
  <SocialLinks links={site.socials} />
</header>
<style>
  .hero { text-align: center; display: flex; flex-direction: column; align-items: center; gap: .6rem; padding-block: 2rem 1rem; }
  .hero__avatar { border-radius: 50%; background: var(--color-border); }
  .hero__tagline { font-size: .95rem; }
  .hero :global(.socials) { justify-content: center; margin-top: .4rem; }
</style>
```

- [ ] **Step 4: 运行测试,确认通过**

Run: `npx vitest run test/hero.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro test/hero.test.ts
git commit -m "feat: Hero 组件"
```

---

## Task 11: 首页(正式版)

**Files:**
- Modify: `src/pages/index.astro`(整体替换)

- [ ] **Step 1: 替换 `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import ProjectCard from '../components/ProjectCard.astro';
import PostList from '../components/PostList.astro';
import { getRecentPosts, getFeaturedProjects } from '../lib/content';
import { site } from '../data/site';

const posts = await getCollection('blog');
const projects = await getCollection('projects');
const recent = getRecentPosts(posts, 5);
const featured = getFeaturedProjects(projects, 4);
---
<BaseLayout>
  <div class="container">
    <Hero />

    <section class="section" id="about">
      <p class="eyebrow">关于</p>
      {site.bio.map((para) => <p>{para}</p>)}
      <p class="more"><a href="/about">了解更多 →</a></p>
    </section>

    <section class="section" id="projects">
      <p class="eyebrow">作品</p>
      <div class="grid">
        {featured.map((project) => <ProjectCard project={project} />)}
      </div>
      <p class="more"><a href="/projects">全部作品 →</a></p>
    </section>

    <section class="section" id="writing">
      <p class="eyebrow">最近写的</p>
      <PostList posts={recent} />
      <p class="more"><a href="/blog">全部文章 →</a></p>
    </section>
  </div>
</BaseLayout>
<style>
  .grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }
  @media (min-width: 560px) { .grid { grid-template-columns: 1fr 1fr; } }
  .more { margin-top: 1rem; font-size: .85rem; }
</style>
```

- [ ] **Step 2: 构建并检查首页含示例内容**

Run: `npm run build`
然后:
Run: `grep -c '一个安静的笔记应用' dist/index.html && grep -c '你好,世界' dist/index.html`
Expected: 两个计数都 ≥ 1(精选作品与最近文章已渲染)

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: 首页(Hero + 关于 + 作品精选 + 最近文章)"
```

---

## Task 12: 关于页

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: 创建 `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../data/site';
---
<BaseLayout title="关于" description={site.bio[0]}>
  <article class="container prose">
    <h1>关于</h1>
    {site.bio.map((para) => <p>{para}</p>)}
  </article>
</BaseLayout>
```

- [ ] **Step 2: 构建验证**

Run: `npm run build && test -f dist/about/index.html && echo OK`
Expected: 打印 `OK`

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: 关于页"
```

---

## Task 13: 作品列表与详情页

**Files:**
- Create: `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`

- [ ] **Step 1: 创建 `src/pages/projects/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import { getFeaturedProjects } from '../../lib/content';

const projects = await getCollection('projects');
const all = getFeaturedProjects(projects, projects.length);
---
<BaseLayout title="作品" description="我做过的一些项目和作品">
  <div class="container">
    <h1>作品</h1>
    <div class="grid">
      {all.map((project) => <ProjectCard project={project} />)}
    </div>
  </div>
</BaseLayout>
<style>
  .grid { display: grid; gap: 1rem; grid-template-columns: 1fr; margin-top: 1.5rem; }
  @media (min-width: 560px) { .grid { grid-template-columns: 1fr 1fr; } }
</style>
```

- [ ] **Step 2: 创建 `src/pages/projects/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({ params: { slug: project.id }, props: { project } }));
}

const { project } = Astro.props;
const { Content } = await render(project);
const { title, year, description, link, tags = [] } = project.data;
---
<BaseLayout title={title} description={description}>
  <article class="container prose">
    <h1>{title}</h1>
    <p class="muted">{year}{tags.length > 0 && <> · {tags.join(' · ')}</>}</p>
    <p>{description}</p>
    <Content />
    {link && <p><a href={link} target="_blank" rel="noopener">访问项目 →</a></p>}
  </article>
</BaseLayout>
```

- [ ] **Step 3: 构建并验证内页生成**

Run: `npm run build && test -f dist/projects/index.html && test -f dist/projects/city-sound-map/index.html && echo OK`
Expected: 打印 `OK`(列表页与无外链作品的详情页都生成)

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/index.astro src/pages/projects/[slug].astro
git commit -m "feat: 作品列表与详情页"
```

---

## Task 14: 博客列表页

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: 创建 `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostList from '../../components/PostList.astro';
import { getRecentPosts } from '../../lib/content';

const posts = await getCollection('blog');
const all = getRecentPosts(posts, posts.length);
---
<BaseLayout title="博客" description="我写的文章和随笔">
  <div class="container">
    <h1>博客</h1>
    <PostList posts={all} />
  </div>
</BaseLayout>
```

- [ ] **Step 2: 构建验证**

Run: `npm run build && grep -c '关于「少即是多」' dist/blog/index.html`
Expected: 计数 ≥ 1

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: 博客列表页"
```

---

## Task 15: 文章详情页与阅读版式(含代码高亮)

**Files:**
- Create: `src/layouts/PostLayout.astro`, `src/pages/blog/[slug].astro`

- [ ] **Step 1: 创建 `src/layouts/PostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
interface Props { title: string; date: Date; description?: string; tags?: string[]; }
const { title, date, description, tags = [] } = Astro.props;
const fmt = date.toISOString().slice(0, 10);
---
<BaseLayout title={title} description={description}>
  <article class="container prose">
    <h1>{title}</h1>
    <p class="muted post-meta">
      <time datetime={date.toISOString()}>{fmt}</time>
      {tags.length > 0 && <span> · {tags.join(' · ')}</span>}
    </p>
    <slot />
  </article>
</BaseLayout>
<style>
  .post-meta { font-size: .85rem; margin-top: -.5rem; margin-bottom: 1.5rem; }
</style>
```

- [ ] **Step 2: 创建 `src/pages/blog/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import { excludeDrafts } from '../../lib/content';

export async function getStaticPaths() {
  const posts = excludeDrafts(await getCollection('blog'));
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<PostLayout
  title={post.data.title}
  date={post.data.date}
  description={post.data.description}
  tags={post.data.tags}
>
  <Content />
</PostLayout>
```

- [ ] **Step 3: 构建并验证文章页 + 代码高亮 + 草稿不输出**

Run: `npm run build`
然后:
Run: `test -f dist/blog/hello-world/index.html && grep -c 'class="astro-code' dist/blog/hello-world/index.html`
Expected: 文件存在;`astro-code`(Shiki 高亮容器)计数 ≥ 1

- [ ] **Step 4: Commit**

```bash
git add src/layouts/PostLayout.astro src/pages/blog/[slug].astro
git commit -m "feat: 文章详情页与阅读版式(Shiki 代码高亮)"
```

---

## Task 16: RSS 订阅

**Files:**
- Create: `src/pages/rss.xml.js`

- [ ] **Step 1: 创建 `src/pages/rss.xml.js`**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getRecentPosts } from '../lib/content';
import { site } from '../data/site';

export async function GET(context) {
  const posts = getRecentPosts(await getCollection('blog'), 50);
  return rss({
    title: site.name,
    description: site.tagline,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
```

- [ ] **Step 2: 构建并验证 RSS 输出**

Run: `npm run build`
然后:
Run: `test -f dist/rss.xml && grep -c '<item>' dist/rss.xml && grep -c '你好,世界' dist/rss.xml`
Expected: 文件存在;`<item>` 计数 ≥ 1;含文章标题

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.js
git commit -m "feat: 博客 RSS 订阅"
```

---

## Task 17: 404 页

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: 创建 `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="走失了" description="页面没找到">
  <div class="container not-found">
    <h1>404</h1>
    <p class="muted">这里什么都没有,可能走错路了。</p>
    <p><a href="/">← 回首页</a></p>
  </div>
</BaseLayout>
<style>
  .not-found { text-align: center; padding-block: 4rem; }
</style>
```

- [ ] **Step 2: 构建验证**

Run: `npm run build && test -f dist/404.html && echo OK`
Expected: 打印 `OK`

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: 404 页"
```

---

## Task 18: README、部署说明与最终验收

**Files:**
- Create: `README.md`

- [ ] **Step 1: 创建 `README.md`**

`````md
# 个人网站

温暖简约柔和风格的中文个人主页。技术栈:Astro(纯静态)+ Vercel。

## 本地开发

```bash
npm install
npm run dev        # 本地预览 http://localhost:4321
npm run build      # 生成 dist/
npm run preview    # 预览构建产物
npm run check      # 类型与内容校验
npm run test       # 单元/组件测试
```

## 改成你自己的

1. 编辑 `src/data/site.ts`:名字、简介、邮箱、社交链接、站点 URL。
2. 头像:把图片放进 `src/assets/`(或 `public/`),把路径填到 `site.avatar`。

## 写文章

在 `src/content/blog/` 新建 `my-post.md`:

```md
---
title: 标题
date: 2026-06-06
description: 一句话摘要
tags: [随笔]
draft: false
---

正文……
```

`draft: true` 的文章不会出现在网站和 RSS 中。

## 加作品

在 `src/content/projects/` 新建 `my-project.md`。有 `link` 则卡片直接外链,没有则生成站内详情页(可在正文里写更多内容)。

## 部署到 Vercel

1. 把仓库推到 GitHub/GitLab。
2. 在 Vercel 选 Import Project,框架会被自动识别为 Astro(Build: `astro build`,Output: `dist`)。
3. 部署后把 `src/data/site.ts` 的 `url` 改为实际域名,重新部署(用于 SEO / canonical / RSS 的绝对链接)。自定义域名可在 Vercel 后台绑定。
`````

- [ ] **Step 2: 全量校验、构建、测试**

Run: `npm run check && npm run build && npm run test`
Expected:
- `astro check`:0 errors
- `astro build`:成功,无坏链警告
- `vitest`:全部测试通过

- [ ] **Step 3: 站点地图验证**

Run: `test -f dist/sitemap-index.xml && echo OK`
Expected: 打印 `OK`

- [ ] **Step 4: 人工冒烟清单(本地)**

Run: `npm run preview`,在浏览器逐项确认:
- [ ] 首页:Hero、关于、作品精选、最近文章、页脚都正常,配色/字体符合设计
- [ ] 顶部导航在各页可点,当前页高亮
- [ ] `/projects` 列表、某个无外链作品的详情页正常
- [ ] `/blog` 列表、文章详情、代码高亮正常
- [ ] 手机宽度(开发者工具)下单列布局正常
- [ ] 访问一个不存在的路径显示 404 页
- [ ] 中文标题显示为宋体、正文为系统黑体/Inter

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: README 与部署说明"
```

---

## Task 19(可选): Playwright 端到端冒烟

仅在希望有自动化端到端保障时执行。静态站点,默认可跳过。

**Files:**
- Modify: `package.json`(加 `@playwright/test` 与 `e2e` 脚本)
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`

- [ ] **Step 1: 安装 Playwright**

Run: `npm i -D @playwright/test && npx playwright install chromium`
Expected: 安装成功

- [ ] **Step 2: 创建 `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  use: { baseURL: 'http://localhost:4321' },
});
```

- [ ] **Step 3: 创建 `e2e/smoke.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('首页到文章可达', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('link', { name: '博客' }).first().click();
  await expect(page).toHaveURL(/\/blog/);
  await page.getByText('你好,世界').click();
  await expect(page.getByRole('heading', { name: '你好,世界' })).toBeVisible();
});

test('RSS 可访问', async ({ request }) => {
  const res = await request.get('/rss.xml');
  expect(res.ok()).toBeTruthy();
});
```

- [ ] **Step 4: 加脚本并运行**

在 `package.json` 的 `scripts` 加:`"e2e": "playwright test"`
Run: `npm run e2e`
Expected: 两个用例通过

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json playwright.config.ts e2e/smoke.spec.ts
git commit -m "test: Playwright 端到端冒烟(可选)"
```

---

## 附:验收标准回顾(对应规格第 10 节)

- `astro check` 通过、`astro build` 无错误 → Task 18 Step 2
- 新增 md 即出现在列表/详情、代码高亮生效 → Task 11/14/15 的 grep 验证 + Task 18 冒烟
- `/rss.xml`、`/sitemap-index.xml` 正常 → Task 16、Task 18 Step 3
- 响应式、404、草稿不输出 → Task 18 冒烟清单 + Task 15(草稿被 `excludeDrafts` 过滤)
- `git push` 自动部署 → Task 18 README 部署说明
