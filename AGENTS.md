# Repository Guidelines

Static Astro personal website. Source in `src/`, tests in `test/`.

## Commands

Use `pnpm` for everything.

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server at `http://localhost:4321` |
| `pnpm check` | Astro type + content validation |
| `pnpm build` | Static build to `dist/` |
| `pnpm test` | Vitest (includes `--passWithNoTests`) |
| `pnpm preview` | Preview built site |

Before handing off: `pnpm check && pnpm build && pnpm test`.

## Architecture

- `src/config/site.yaml` — main customization file (name, bio, socials, avatar, logo, walineServerURL). Validated by `src/config/site.ts` via Zod + YAML `?raw` import.
- `src/content/config.ts` — Astro content collections (`blog`, `projects`) using glob loader. Schemas in `src/content/schemas.ts`.
- `src/lib/content.ts` — pure helpers: `excludeDrafts`, `sortByDateDesc`, `getRecentPosts`, `getFeaturedProjects`.
- `src/pages/` — routes including `rss.xml.js`, `index.astro`, `about.astro`, `guestbook.astro`, dynamic `blog/` and `projects/` pages.
- `astro.config.mjs` — imports `site.url` from config, Shiki theme `rose-pine`, sitemap integration.

## Testing

Vitest with `getViteConfig` from `astro/config`. Astro components tested via `experimental_AstroContainer`. Test files: `test/**/*.test.ts`.

## Style

- Two-space indentation, single quotes, semicolons in `.ts`.
- Components PascalCase (`ProjectCard.astro`).
- Conventional Commit prefixes, often in Chinese (`feat:`, `fix:`, `chore:`).
