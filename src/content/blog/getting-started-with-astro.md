---
title: 'Astro 6 入门指南：构建现代化静态网站'
description: '全面介绍 Astro 6 的核心特性，包括内容集合、服务端岛屿和全新的构建系统。'
pubDate: 2026-05-25
tags:
  - Astro
  - 教程
  - 前端
---

## 为什么选择 Astro 6？

Astro 6 是一次重大升级，带来了许多激动人心的新特性。如果你正在寻找一个高性能的内容驱动型框架，Astro 绝对值得一试。

### 核心特性

#### 1. 全新的内容集合 API

Astro 6 引入了基于 glob loader 的内容集合，让内容管理变得更加灵活：

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: 'src/content/blog',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

与之前的版本相比，新的 API 更加直观，支持更灵活的文件组织方式。

#### 2. 服务端岛屿（Server Islands）

服务端岛屿是 Astro 6 的一大亮点。它允许你在静态页面中嵌入动态的服务端组件：

```astro
---
// 静态页面中的动态组件
---
<StaticHeader />
<DynamicContent server:defer>
  <LoadingSkeleton slot="fallback" />
</DynamicContent>
<StaticFooter />
```

这种模式完美结合了静态生成的性能优势和服务端渲染的灵活性。

#### 3. 改进的构建性能

Astro 6 采用了全新的构建引擎，带来了显著的性能提升：

| 指标 | Astro 5 | Astro 6 | 提升 |
|------|---------|---------|------|
| 冷启动时间 | 1.2s | 0.4s | 3x |
| 热更新速度 | 300ms | 80ms | 3.75x |
| 构建时间 (1000页) | 45s | 12s | 3.75x |

### 快速上手

创建一个新的 Astro 6 项目非常简单：

```bash
# 创建新项目
npm create astro@latest my-blog

# 进入项目目录
cd my-blog

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 项目结构

一个典型的 Astro 6 项目结构如下：

```
├── public/              # 静态资源
├── src/
│   ├── components/      # UI 组件
│   ├── content/         # 内容集合
│   │   └── blog/        # 博客文章
│   ├── data/            # 数据文件
│   ├── layouts/         # 页面布局
│   ├── pages/           # 页面路由
│   └── content.config.ts # 内容集合配置
├── astro.config.mjs     # Astro 配置
└── package.json
```

### 小结

Astro 6 在保持其"内容优先"理念的同时，大幅提升了开发体验和构建性能。无论你是要搭建个人博客、文档站点还是营销页面，Astro 6 都是一个优秀的选择。

在下一篇文章中，我会分享如何为 Astro 博客集成 React 组件和 shadcn/ui，敬请期待！
