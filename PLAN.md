# Project Journal Blog — Implementation Plan

## Context

Building a blog to document AI-assisted development projects with Claude Code. Each post captures a project's GitHub repo, Claude transcript links, commentary, prompt effectiveness, cost tracking, and lessons learned. The blog serves as both a portfolio and a reference for what works (and doesn't) when building with AI.

**Tech stack:** Astro 5 + Tailwind CSS v4 + TypeScript + MDX, deployed to GitHub Pages.

---

## Phase 1: Scaffold & Configure

**Goal:** Empty directory → working Astro project with all integrations wired up.

```bash
npm create astro@latest . -- --template minimal --typescript strict --install
npx astro add mdx sitemap
npm install tailwindcss @tailwindcss/vite @tailwindcss/typography @astrojs/rss fuse.js satori sharp
```

**Files:**
- `astro.config.mjs` — Astro + Tailwind v4 (via `@tailwindcss/vite`) + MDX + sitemap + Shiki dual themes (github-light/github-dark)
- `tsconfig.json` — strict mode, path aliases (`@/*`, `@components/*`, etc.)
- `src/styles/global.css` — Tailwind v4 `@theme` tokens, typography plugin, dark mode, status/brand colors
- `public/favicon.svg`
- `public/fonts/Inter-Bold.ttf` — self-hosted for OG image generation

**Key decisions:**
- Tailwind v4 uses `@tailwindcss/vite` plugin (not deprecated `@astrojs/tailwind`)
- Shiki built into Astro for syntax highlighting with light/dark dual themes
- Class-based dark mode with inline `<script>` in `<head>` to prevent FOUC

---

## Phase 2: Content Schema

**Goal:** Type-safe content collection with rich frontmatter for every feature.

**File:** `src/content.config.ts`

Single `projects` collection with schema including:
- Core: `title`, `description`, `pubDate`, `status` (complete/in-progress/abandoned), `difficulty`, `ambitionRating` (1-5)
- Links: `repoUrl`, `liveUrl`, `transcriptUrls[]`
- Categorization: `techStack[]`, `projectType`, `claudeTechniques[]`, `tags[]`
- Claude-specific: `promptSnippets[]` (prompt, context, effectiveness, notes), `costTracking` (tokens, cost, sessions), `lessonsLearned` (whatWorked, whatDidnt, whatIdDoDifferently)
- Display: `heroImage`, `featured`, `draft`, `readingOrder`

**File:** `src/data/techniques.ts` — canonical technique taxonomy (plan-mode, subagents, memory-files, hooks, etc.)

---

## Phase 3: Layouts & Components (~25 components)

**Layouts:**
- `BaseLayout.astro` — HTML shell, SEO head, header, footer, dark mode script
- `ProjectLayout.astro` — article header (status badge, difficulty, tech tags, links), two-column layout (prose + sticky TOC/cost sidebar), lessons learned, prompt snippets

**Common components:** `Header`, `Footer`, `SEOHead`, `ThemeToggle`, `MobileMenu`

**Blog components:** `ProjectCard`, `ProjectGrid`, `StatusBadge`, `TechTag`, `DifficultyRating`, `TableOfContents`, `LessonsLearned`, `ProjectLinks`, `TagCloud`, `TimelineEntry`

**Claude components:** `PromptSnippets`, `PromptBlock`, `CostTracking`, `TechniqueTag`, `DiffDisplay`, `BeforeAfter`

**Search components:** `SearchBar`, `FilterBar`

---

## Phase 4: Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/pages/index.astro` | Project grid with search + filters |
| `/projects/[slug]` | `src/pages/projects/[...slug].astro` | Individual project post |
| `/timeline` | `src/pages/timeline.astro` | Chronological vertical timeline |
| `/about` | `src/pages/about.astro` | Bio, what this blog is, how Claude Code is used |
| `/stats` | `src/pages/stats.astro` | Dashboard: total projects, success rate, top tech, top techniques, cost totals |
| `/start-here` | `src/pages/start-here.astro` | Curated reading order (posts with `readingOrder`) |
| `/search.json` | `src/pages/search.json.ts` | Build-time search index for Fuse.js |
| `/rss.xml` | `src/pages/rss.xml.ts` | RSS feed |
| `/og/[slug].png` | `src/pages/og/[...slug].png.ts` | Auto-generated OG images via Satori + Sharp |

---

## Phase 5: Search & Filtering (client-side)

- Build-time JSON endpoint with project metadata
- Fuse.js fuzzy search on title, description, tags, tech, techniques
- Filter bar with clickable pills for status, tech stack, tags
- Project cards use `data-*` attributes; JS shows/hides based on active filters
- No framework needed — vanilla TypeScript in `<script>` tags

---

## Phase 6: GitHub Actions Deploy

**File:** `.github/workflows/deploy.yml` — uses `withastro/action@v5` + `actions/deploy-pages@v4`

---

## Phase 7: Sample Content (4 posts)

1. `building-this-blog.mdx` — complete post demonstrating all features (meta project, this blog itself)
2. `cli-task-manager.mdx` — status: complete, beginner difficulty
3. `react-dashboard.mdx` — status: abandoned, advanced difficulty
4. `mac-setup-script.mdx` — status: complete, beginner difficulty

These populate the grid, demonstrate filtering, and provide data for the stats page.

---

## Build Order

```
1. Scaffold & config (Phase 1)
2. Content schema + global CSS (Phase 2 + part of Phase 3)
3. Layouts + components (Phase 3)
4. Sample content (Phase 7) — at least 1 post to test rendering
5. Pages (Phase 4)
6. Search & filtering (Phase 5)
7. RSS, OG images, sitemap (from Phase 4 pages)
8. GitHub Actions (Phase 6)
```

---

## Verification

After each phase, run `npm run dev` and verify:
1. Home page renders project grid with cards, badges, tags
2. Individual post renders with TOC, lessons learned, prompt snippets, cost sidebar
3. Dark/light mode toggle works without flash
4. Search filters projects correctly
5. Timeline, stats, start-here, about pages render
6. `npm run build` succeeds with no errors
7. RSS feed is valid XML
8. OG images generate as PNGs

**Total: ~42 files to create.**
