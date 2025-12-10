# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medical clinic website for Dr. Mu'men Diraneyya (د. مؤمن ديرانية). Built with Astro 5.0 + Tailwind CSS based on the AstroWind template. Uses static site generation with RTL (Arabic) support.

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build locally
npm run check        # Run all checks (astro check, eslint, prettier)
npm run fix          # Auto-fix eslint and prettier issues
```

## Architecture

### Configuration System

The site uses a custom Astro integration (`vendor/integration/`) that:
- Loads configuration from `src/config.yaml`
- Exposes config via virtual module `astrowind:config` (SITE, I18N, METADATA, APP_BLOG, UI, ANALYTICS)
- Auto-updates robots.txt with sitemap URL on build

**Key config files:**
- `src/config.yaml` - Site metadata, SEO defaults, blog settings, analytics, theme
- `src/navigation.ts` - Header and footer navigation structure
- `astro.config.ts` - Astro integrations, Vite aliases (`~` maps to `./src`)

### Content Collections

Blog posts are defined in `src/content/config.ts` using Astro's content collections:
- Posts located in `src/data/post/` (not `src/content/post/`)
- Supports `.md` and `.mdx` files
- Schema includes: title, publishDate, excerpt, image, category, tags, author, metadata

### Component Structure

- **Layouts** (`src/layouts/`): Layout.astro (base), PageLayout.astro, LandingLayout.astro, MarkdownLayout.astro
- **Widgets** (`src/components/widgets/`): Reusable page sections (Hero, Features, FAQs, Pricing, Steps, Testimonials, etc.)
- **UI** (`src/components/ui/`): Basic UI elements
- **Blog** (`src/components/blog/`): Blog-specific components

### Utilities

- `src/utils/permalinks.ts` - URL generation helpers (getPermalink, getBlogPermalink, getAsset)
- `src/utils/blog.ts` - Blog data fetching and filtering
- `src/utils/frontmatter.ts` - Remark/rehype plugins for reading time, responsive tables, lazy images
- `src/utils/images-optimization.ts` - Image optimization utilities using Unpic

### Icon System

Uses `astro-icon` with Tabler icons (`tabler:*`) and Flat Color Icons. Icon sets configured in `astro.config.ts`.

### Styling & Theming

- Tailwind CSS with typography plugin
- Dark mode support (system/light/dark)
- RTL support (configured in `src/config.yaml`)
- Theme colors defined in `src/components/CustomStyles.astro` using CSS custom properties:
  - `--aw-color-primary`: Primary brand color (buttons, links)
  - `--aw-color-secondary`: Hover states
  - `--aw-color-accent`: Highlighted text
- Custom fonts in `public/fonts/`

### Brand Colors

- Primary: `hsl(191 49% 40%)` - Teal/green (#348799)
- Secondary: `hsl(191 49% 32%)` - Darker teal
- Accent: `hsl(191 49% 50%)` - Lighter teal
