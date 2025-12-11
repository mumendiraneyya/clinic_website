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
- Post images stored in `src/assets/images/posts/`
- Supports `.md` and `.mdx` files
- Schema includes: title, publishDate, excerpt, image, category, tags, author, metadata
- Image paths use the `~` alias: `image: ~/assets/images/posts/filename.jpg`

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
  - `--aw-color-tertiary`: Warm accent color (amber/gold)
- Custom fonts in `public/fonts/`

### Brand Colors

Based on color theory with teal (hue 191°) as the primary:

- **Primary**: `hsl(191 49% 40%)` - Teal (#348799)
- **Secondary**: `hsl(191 49% 32%)` - Darker teal
- **Accent**: `hsl(191 49% 50%)` - Lighter teal
- **Tertiary**: `rgb(219 165 67)` - Amber/gold (hue ~38°, split-complementary to teal)

The tertiary color is defined directly as RGB in `tailwind.config.js` (not as a CSS variable) to support Tailwind's opacity modifiers like `bg-tertiary/20`.

### Logo

The site logo (`src/components/Logo.astro`) displays a stethoscope emoji (🩺) followed by the site name.

### Hero Component

The Hero widget (`src/components/widgets/Hero.astro`) has a custom `fullHeight` mode used on the landing page:

**Desktop behavior:**
- Hero image displays in a fixed overlay that fades on scroll (0-120px)
- Action buttons pin to bottom when scrolled past threshold
- Snap scrolling prevents partial fade states

**Mobile behavior:**
- Compact layout with image, title, subtitle, and buttons all visible
- Buttons pin to bottom when scrolled past

**Key CSS classes:**
- `.is-fixed` - Applied to action containers when pinned to bottom
- `.is-hidden` - Hides pinned buttons when user scrolls near the footer (reveals social links)
- Styles handle backdrop blur, safe area insets, and margin removal
- Dark mode uses `html.dark` selector for styling pinned action bar

### Stats Widget

The Stats widget (`src/components/widgets/Stats.astro`) displays statistics with separator borders:
- Uses RTL-aware Tailwind classes: `border-e` (not `border-r`) for proper RTL support
- `md:last:border-e-0` removes border from last item

### Social Media Links

Social links are configured in `src/navigation.ts` under `footerData.socialLinks`:
- Facebook: Clinic's Facebook page
- Instagram: Dr.'s Instagram profile
- YouTube: Clinic's YouTube channel
- Google Business: Google Business profile

Icons use Tabler icon set (e.g., `tabler:brand-facebook`, `tabler:brand-youtube`)

## Development Tools

### Chrome DevTools MCP

A Chrome DevTools MCP server is available for browser automation and testing:
- Navigate pages, take screenshots, interact with elements
- Inspect console messages and network requests
- Test scroll behaviors and responsive layouts
- Use `mcp__chrome-devtools__*` tools (e.g., `navigate_page`, `take_screenshot`, `evaluate_script`)

The dev server runs at `localhost:4321` - navigate there to test changes visually.

## Integrations

### Cal.com Booking

Appointment booking is integrated via Cal.com cloud embed. See [context/cal-com-embed.md](context/cal-com-embed.md) for detailed documentation.

**Quick reference:**
- Implementation: `src/pages/index.astro` (Hero content slot + inline script)
- Event types: `/clinic` (in-person) and `/remote` (telemedicine)
- Uses custom `data-booking-*` attributes (NOT `data-cal-*`) to avoid Astro View Transitions conflicts
- Theme syncs automatically with AstroWind dark/light mode
