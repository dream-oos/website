# Repository Guidelines

## Project Structure & Module Organization

This is a static Astro personal website. Source code lives in `src/`.

- `src/pages/`: route files, including dynamic blog/project pages and `rss.xml.js`.
- `src/layouts/`: shared page shells such as `BaseLayout.astro` and `PostLayout.astro`.
- `src/components/`: reusable Astro UI components.
- `src/content/`: Markdown content collections for `blog/` and `projects/`, plus schemas in `schemas.ts`.
- `src/config/site.ts`: site identity, bio, email, URL, and social links. Treat this as the main customization file.
- `src/lib/`: pure helper functions, especially content filtering and sorting.
- `src/styles/global.css`: design tokens and global prose styles.
- `test/`: Vitest unit and Astro Container component tests.

Generated folders such as `.astro/`, `dist/`, and `node_modules/` must not be committed.

## Build, Test, and Development Commands

Use `pnpm` for all package operations.

- `pnpm install`: install dependencies and run approved native build scripts.
- `pnpm dev`: start the Astro dev server at `http://localhost:4321`.
- `pnpm check`: run Astro type and content validation.
- `pnpm build`: build the static site into `dist/`.
- `pnpm preview`: preview the built site locally.
- `pnpm test`: run all Vitest unit/component tests.

Before handing off substantial changes, run `pnpm check && pnpm build && pnpm test`.

## Coding Style & Naming Conventions

Use TypeScript and Astro with ESM imports. Match existing style: two-space indentation in markup, single quotes in TypeScript/JavaScript, semicolons in `.ts` files, and concise component props interfaces. Name components in PascalCase, for example `ProjectCard.astro`; name tests with `*.test.ts`.

Keep display components prop-driven. Keep data transformation logic in `src/lib/` as pure functions with focused tests.

## Testing Guidelines

Vitest is the test runner. Pure functions are tested directly, while Astro components use `experimental_AstroContainer` from `astro/container`.

When changing behavior, add or update a focused test in `test/`. For content/schema changes, run `pnpm check` as well as `pnpm test`.

## Commit & Pull Request Guidelines

Commit history uses concise Conventional Commit-style prefixes, often in Chinese, such as `feat:`, `fix:`, `docs:`, and `chore:`. Keep each commit scoped to one concern.

Pull requests should include a short summary, verification commands run, and screenshots for visible UI changes. Mention content/schema changes and any deployment-impacting config updates, especially changes to `src/config/site.ts` or `astro.config.mjs`.
