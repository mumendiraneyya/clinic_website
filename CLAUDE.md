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

### Sitemap Configuration

The sitemap is filtered to only include active pages. Many template pages from AstroWind exist in `src/pages/` but are excluded from the sitemap:

**Currently included in sitemap:**
- `/` (homepage)
- `/blog/*` (all blog pages)
- `/privacy`
- `/terms`

**Excluded template pages** (still exist but not in sitemap):
- `/about`, `/contact`, `/pricing`, `/services`
- `/homes/*` (saas, startup, personal, mobile-app)
- `/landing/*` (click-through, lead-generation, pre-launch, product, sales, subscription)

To add a page to the sitemap when bringing it back into use, update the `filter` function in `astro.config.ts`:

```typescript
sitemap({
  filter: (page) => {
    const url = new URL(page);
    const path = url.pathname;
    return (
      path === '/' ||
      path.startsWith('/blog') ||
      path.startsWith('/privacy') ||
      path.startsWith('/terms') ||
      path.startsWith('/your-new-page')  // Add new pages here
    );
  },
}),
```

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

The site logo (`src/components/Logo.astro`) displays a stethoscope emoji (🩺) followed by the site name. Uses consistent `text-xl` sizing across all breakpoints.

### Header Menu

The header (`src/components/widgets/Header.astro`) uses a two-phase responsive design. See [context/header-menu.md](context/header-menu.md) for detailed documentation.

**Quick reference:**
- **Mobile (< 768px)**: Hamburger menu with full-screen navigation
- **Desktop (≥ 768px)**: Horizontal menu with responsive font sizing
- Menu font scales from 0.75rem at 768px to 1.25rem at 1024px+ (matching logo)
- Uses `clamp(0.75rem, calc(-0.75rem + 3.125vw), 1.25rem)` for smooth scaling

### Hero Component

The Hero widget (`src/components/widgets/Hero.astro`) has a custom `fullHeight` mode used on the landing page:

**Desktop behavior:**
- Hero image displays in a fixed overlay (`#hero-fixed-overlay`) that fades on scroll
- Action buttons pin to bottom when scrolled past threshold
- Snap scrolling prevents partial fade states

**Mobile behavior:**
- Compact layout with image, title, subtitle, and buttons all visible
- Buttons pin to bottom when scrolled past

**Key scroll values (defined in Hero.astro script):**
- `fadeDistance = 120` - Hero image fully fades within 120px of scroll
- Snap scrolling triggers when scroll stops between 0-120px, snapping to nearest boundary
- Action buttons fix to bottom at ~80% of fadeDistance (96px)
- Title/subtitle content (`#hero-below-content`) appears below the fading overlay

**DOM structure for fullHeight mode:**
- `#hero-fixed-overlay` - Fixed overlay containing hero image (fades 0→120px)
- `#hero-bg-container` - Background within the overlay
- `#hero-image-container` - Hero image container (fades and scales down)
- `#hero-actions-container` - Action buttons (desktop, becomes fixed)
- `#hero-below-content` - Title/subtitle that appears after scrolling past hero
- `#hero-mobile-actions` - Action buttons (mobile only)

**Anchor links and scroll behavior:**
When creating anchor links that should scroll past the hero image to show content:
- The heading content appears at approximately 150px scroll position
- Use JavaScript `window.scrollTo({ top: 150, behavior: 'smooth' })` rather than hash anchors
- Hash anchors won't work well with the snap scrolling implementation
- See `src/pages/index.astro` for example: "من نحن" link uses custom scroll handler

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
- Supports prefilling fields via config: `attendeePhoneNumber`, `name`, `email`, custom fields by identifier
- Supports rescheduling via `config.rescheduleUid`