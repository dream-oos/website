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
