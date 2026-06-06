# 个人网站设计文档

- 日期:2026-06-06
- 状态:已确认(待写实现计划)
- 作者:与 dream 的头脑风暴

## 1. 概述与目标

做一个**温暖、简约、柔和**风格的中文个人网站,作为作者在网上的"主页枢纽",
集自我介绍、作品、博客、联系方式于一体。

成功标准:

- 一个奶油暖调、单列居中的中文个人主页,四块内容齐全(关于 / 作品 / 博客 / 联系)
- **写博客 = 在内容目录丢一个 Markdown 文件**;加作品同理
- `git push` 后自动部署上线
- 纯静态、加载快、几乎零 JS;移动端自适应;具备基础无障碍与 SEO
- 整体观感符合既定设计系统(见第 4 节)

## 2. 非目标(v1 明确不做)

为保持"简单",以下内容刻意不在第一版实现,但在架构上为其预留扩展空间:

- ❌ 中英双语切换(本站纯中文为主)
- ❌ 深色模式(仅浅色;但 CSS 以变量组织,后续可低成本加暖色深色主题)
- ❌ 评论系统
- ❌ 后台 / CMS(内容全部用 Markdown 文件管理)
- ❌ 联系表单(用 `mailto:` + 社交链接代替,保持纯静态)
- ❌ 博客标签筛选页(文章可显示标签,但 v1 不做按标签聚合的页面)
- ❌ 访问统计 / Analytics(后续可选接入隐私友好的方案)

## 3. 技术选型

- **框架**:[Astro](https://astro.build/),`output: 'static'` 纯静态生成
- **部署**:Vercel,通过 Git 集成自动构建(`astro build` → `dist/`),无需 SSR adapter
- **语言**:纯中文为主(内容中可随手夹英文)
- **内容**:Astro Content Collections + Zod schema 校验(frontmatter 写错时构建即报错)
- **代码高亮**:Astro 内置 Shiki,选用暖色调主题
- **集成**:`@astrojs/rss`(RSS)、`@astrojs/sitemap`(站点地图)、`@astrojs/mdx`(可选,
  若作品/文章需要内嵌组件)

## 4. 设计系统(已定稿)

### 4.1 配色(浅色)

以 CSS 自定义属性(变量)组织,便于日后扩展深色模式。

| 语义 | 名称 | 值 |
| --- | --- | --- |
| `--color-bg` | 纸白 / 页面底色 | `#FAF6EF` |
| `--color-surface` | 卡面 / 浮层 | `#FFFEFB` |
| `--color-border` | 描边 / 分隔线 | `#E7DDCC` |
| `--color-text-secondary` | 次要文字 | `#8A7A6D` |
| `--color-text` | 正文 / 标题 | `#3A2E26` |
| `--color-accent` | 玫瑰陶强调 | `#C57E6E` |
| `--color-accent-hover` | 强调 hover(稍深) | `#B5685A` |

强调色只用于:链接、按钮、当前导航项、小标记/标签点。

### 4.2 字体

字体栈:

```css
--font-serif: 'Fraunces', 'Noto Serif SC', Georgia, 'Songti SC', serif;   /* 标题 */
--font-sans:  'Inter', system-ui, -apple-system, 'PingFang SC',
              'Microsoft YaHei', 'Noto Sans SC', sans-serif;               /* 正文 */
```

加载策略(兼顾"温暖一致的观感"与"性能"):

- **拉丁字体** Fraunces、Inter:用 `@fontsource` 自托管(无额外 DNS、无 FOUT)
- **中文标题** Noto Serif SC:经 Google Fonts 按 `unicode-range` 子集加载(标题文字量小,
  代价可控),拿到标志性的宋体标题观感
- **中文正文**:优先走系统中文字体(PingFang SC / 微软雅黑等),不默认下载整套黑体,
  以保证正文加载轻快;`Noto Sans SC` 仅作为兜底
- 全部 `font-display: swap`
- 备注:若上线后 Lighthouse 提示中文字体仍偏重,降级为标题也用系统字体;若反之希望各端
  渲染完全一致,可显式加载 Noto Sans SC 子集。该取舍在实现期以实测决定。

### 4.3 排版与质感

- 排版尺度(响应式,标题用 `clamp()`):Hero 标题 ≈ 2.5rem;h2 ≈ 1.6rem;h3 ≈ 1.2rem;
  正文 ≈ 1rem(17px),行高 1.75;次要文字 ≈ 0.85rem
- 阅读列最大宽约 **660px**;首页各区块容器约 720–760px;移动端留足左右内边距
- 圆角 8–12px;柔描边(`--color-border`);仅用极轻阴影
- 大量留白,克制的 hover 过渡(如链接下划线渐显),整体安静温润

## 5. 信息架构与页面

单列居中布局。顶部导航:**名字(回首页) + 关于 / 作品 / 博客**。

| 路由 | 说明 |
| --- | --- |
| `/` | 首页:Hero(头像 + 名字 + 一句话简介 + 社交链接)→ 关于(2–3 段简介)→ 作品精选(3–4 个)→ 最近文章(3–5 篇)→ 页脚(邮箱 / 社交) |
| `/about` | 关于:更完整的自我介绍 |
| `/projects` | 作品列表:全部作品卡片(标题、年份、简介、标签、链接) |
| `/blog` | 博客列表:按日期倒序;每项显示标题、日期、摘要、标签 |
| `/blog/[slug]` | 文章详情:Markdown 渲染 + 代码高亮,文章阅读版式(prose) |
| `/rss.xml` | 博客 RSS 订阅 |
| `/404` | 暖调风格的走失页 |

作品条目支持两种去向:**外部链接**(如 GitHub / 线上地址)或**站内详情**。v1 默认以外链/简介卡片为主;
若某作品 Markdown 含正文,则生成 `/projects/[slug]` 详情页(实现期按需开启)。

联系方式不单独成页:集中在**页脚**与**关于页**(邮箱 `mailto:` + 社交链接,数据来自站点配置)。

## 6. 内容模型

使用 Astro Content Collections,Zod 定义 schema。

### 6.1 `blog` 集合(`src/content/blog/*.md`)

frontmatter:

- `title: string`
- `date: Date`
- `description: string`
- `tags: string[]`(可选)
- `draft: boolean`(可选,默认 `false`;为 `true` 时不在生产构建中输出)

### 6.2 `projects` 集合(`src/content/projects/*.md`)

frontmatter:

- `title: string`
- `year: number`
- `description: string`
- `tags: string[]`(可选)
- `link: string`(可选,外部链接;有则卡片指向它)
- `cover: string`(可选,封面图)
- `order: number`(可选,用于精选/排序)
- 正文(可选):有正文则可生成站内详情页

### 6.3 站点配置(`src/data/site.ts`)

集中存放:站点名称、作者名、一句话简介、关于页简介、头像路径、社交链接(GitHub / 邮箱 / 其他)、
站点 URL(用于 SEO / RSS / sitemap)。

## 7. 代码结构(建议)

```
src/
  pages/
    index.astro              # 首页
    about.astro              # 关于
    projects/index.astro     # 作品列表
    projects/[slug].astro    # 作品详情(可选,按需启用)
    blog/index.astro         # 博客列表
    blog/[slug].astro        # 文章详情
    rss.xml.js               # RSS
    404.astro
  layouts/
    BaseLayout.astro         # <head>、字体、SEO/OG、导航、页脚
    PostLayout.astro         # 文章阅读版式(prose)
  components/
    Nav.astro
    Footer.astro
    Hero.astro
    ProjectCard.astro
    PostList.astro
    SocialLinks.astro
  content/
    config.ts                # 集合 schema(zod)
    blog/*.md
    projects/*.md
  data/
    site.ts                  # 站点与作者信息、社交链接
  styles/
    global.css               # 设计 token(颜色/字体/尺度)、基础样式、prose 文章样式
  assets/                    # 头像、作品封面等
astro.config.mjs             # 集成:sitemap、rss、(可选 mdx)
package.json
```

每个组件职责单一、通过明确的 props 通信,可独立理解与替换:

- `BaseLayout`:页面骨架与全局元信息;输入 `title`/`description`/`og` 等
- `Nav` / `Footer` / `SocialLinks`:从 `site.ts` 读取展示
- `Hero`:首页头部;输入作者信息
- `ProjectCard`:渲染单个作品;输入一条 project 数据
- `PostList`:渲染文章列表项;输入文章集合

## 8. 关键功能

- **RSS**:`/rss.xml` 输出博客文章摘要并链接到原文
- **SEO / 社交分享**:每页 `<title>`、`description`、Open Graph 元信息;由 `@astrojs/sitemap` 生成 `sitemap-index.xml`
- **代码高亮**:Shiki,暖色调主题,适配开发者博客
- **响应式**:移动端单列良好;触控目标与间距充足
- **无障碍基础**:语义化标签、合理对比度(强调色/正文与底色对比达标)、`alt`、键盘可达、
  焦点可见

## 9. 部署

- Vercel + Git 集成:推送即构建(`astro build`),产物 `dist/` 静态托管
- 纯静态,无需 serverless / adapter
- 自定义域名为可选的后续步骤(先用 Vercel 提供的子域名)

## 10. 验收与验证

静态内容站,验证以构建与人工冒烟为主:

- `astro check` 通过(TypeScript + 内容集合 schema 校验)
- `astro build` 无错误、无坏链警告
- 人工冒烟清单:
  - 各页面正常渲染;顶部导航与内部链接可达
  - 新增一个示例博客 md → 出现在 `/blog` 且详情页正常、代码高亮生效
  - 新增一个示例作品 md → 出现在 `/projects` 与首页精选
  - `/rss.xml`、`/sitemap-index.xml` 可访问且格式正确
  - 移动端布局正常;`/404` 正常
  - 草稿(`draft: true`)不出现在生产构建
- 可选(后续增强):Playwright 冒烟脚本、Lighthouse 性能/无障碍体检(性能与 a11y)

## 11. 未来扩展(已预留,不在 v1)

深色模式(暖色调)、博客标签聚合页、联系表单、隐私友好的访问统计、中英双语、作品详情页全面启用、
评论。CSS 变量化与内容集合的结构使这些都可增量添加。

## 12. 待补充的素材(非阻塞)

- 头像图(无则先用首字母占位)
- 真实的关于文案、首批作品与文章(可先用占位内容跑通,再替换)
- 社交链接的实际地址
