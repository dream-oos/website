# 个人网站

温暖简约柔和风格的中文个人主页。技术栈:Astro(纯静态)+ Vercel。站点自定义信息集中在 YAML 配置文件里,方便查看和修改。

## 本地开发

```bash
pnpm install
pnpm dev        # 本地预览 http://localhost:4321
pnpm build      # 生成 dist/
pnpm preview    # 预览构建产物
pnpm check      # 类型与内容校验
pnpm test       # 单元/组件测试
```

## 改成你自己的

1. 编辑 `src/config/site.yaml`:名字、简介、邮箱、社交链接、站点 URL。
2. Logo/头像:把图片放进 `public/images/`,把路径填到 `avatar` 和 `logo`。不需要头像时保持 `avatar:` 为空。
3. `src/config/site.ts` 只负责读取和校验 YAML,通常不需要改。

配置示例:

```yaml
name: Dream
tagline: 程序员 · 聆听音乐 · 喜欢小狗
bio:
  - 你好,我是Dream。我喜欢把复杂的东西做简单。
avatar: /images/logo-256x256.png
logo:
  mark: /images/logo-64x64.png
  favicon32: /images/logo-32x32.png
  favicon64: /images/logo-64x64.png
  appleTouchIcon: /images/logo-256x256.png
email: 3448104699@qq.com
url: https://dream.vercel.app
socials:
  - label: GitHub
    href: https://github.com/dream-oos
```

### Logo 文件放哪里、显示在哪里

建议把你的文件复制到:

```text
public/images/logo-32x32.png
public/images/logo-64x64.png
public/images/logo-128x128.png
public/images/logo-256x256.png
```

网站访问路径对应为 `/images/logo-32x32.png` 等。当前配置会这样使用:

- `logo-32x32.png`: 浏览器标签页 favicon。
- `logo-64x64.png`: 高清 favicon,同时显示在顶部导航栏左侧品牌圆标。
- `logo-256x256.png`: 移动端收藏/主屏幕图标,同时作为首页 Hero 卡片头像。
- `logo-128x128.png`: 预留给你后续需要更大中间尺寸时使用,当前不会主动显示。

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
3. 部署后把 `src/config/site.yaml` 的 `url` 改为实际域名,重新部署(用于 SEO / canonical / RSS 的绝对链接)。自定义域名可在 Vercel 后台绑定。
