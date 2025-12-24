# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Local Development & Testing

**ALWAYS use `http://localhost:4321` for testing, NOT the production site.**

- Use Chrome DevTools MCP (`mcp__chrome-devtools__*` tools) to navigate, screenshot, and debug
- Production site (`abuobaydatajjarrah.com`) may have outdated code - never use it for testing
- **NEVER reload or navigate when asked to take a screenshot** - just take the screenshot of the current state. Reloading disrupts what the user is trying to show you.
- **NEVER start the dev server yourself** - always ask the user to start it. The user manages the dev server lifecycle.

## Working with External APIs

When consuming external API endpoints (e.g., n8n webhooks), if you notice issues like typos in field names or unexpected response formats:
- **Alert the user first** before writing code or documentation that uses the incorrect format
- Give the user the opportunity to fix the API before proceeding
- Don't document or code around API issues without flagging them

## Project Overview

Medical clinic website for Dr. Mu'men Diraneyya (د. مؤمن ديرانية). Built with Astro 5.0 + Tailwind CSS based on the AstroWind template. **This is a static site generator project** - Astro builds static HTML/CSS/JS files that are deployed to Cloudflare Pages. There is no server-side runtime.

### Static Site Architecture

**Critical understanding:** Astro is used here purely as a **static site generator (SSG)**. The output is plain HTML files served by Cloudflare Pages.

- `npm run build` generates static files in `./dist/`
- These files are uploaded to Cloudflare Pages
- Cloudflare Pages handles all URL routing, caching, and trailing slash behavior
- Astro's config settings (like `trailingSlash`) only affect **build-time file generation**, not runtime routing
- Production URL routing (e.g., whether `/page` and `/page/` both work) is determined by Cloudflare Pages, not Astro

**Do not confuse dev server behavior with production behavior.** The Astro dev server has quirks that don't exist in production because production serves pre-built static files.

### Known Dev Server Issue: trailingSlash breaks images

**IMPORTANT:** In `src/config.yaml`, `trailingSlash` must be set to `false` for local development.

```yaml
site:
  trailingSlash: false  # MUST be false - other values break dev server images
```

Setting `trailingSlash` to `true` or `ignore` breaks the Astro dev server's `/_image` endpoint, causing all images to 404. This is a **dev server bug only** - it does not affect production builds because:
1. Production images are pre-optimized at build time (no `/_image` endpoint)
2. Cloudflare Pages handles URL routing regardless of this setting

If images suddenly break during development with 404 errors on `/_image`, check this setting first.

### Known Issues Under Investigation

**Infinite spinner on `/book` page**
- Sometimes the `/book` page hangs with "جارٍ التحقق..." spinner indefinitely
- Occurs when redirecting from `/bookings` page (e.g., clicking booking button)
- Root cause not yet identified
- May be related to: token validation timing, Cal.com embed initialization, or race conditions in the verification flow
- Files to investigate: `src/pages/book.astro`, `src/components/booking/PhoneVerification.astro`

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
- **Blog categories in header menu**: The "المنشورات" dropdown dynamically lists categories, but category names are hardcoded in `PageLayout.astro`. See [context/header-menu.md](context/header-menu.md) for details on adding/changing categories.

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
- `src/utils/arabic.ts` - Arabic language utilities (server-side TypeScript)

### Arabic Language Utilities

Arabic has complex plural rules that differ from English. The site provides utilities for proper Arabic number/count formatting:

**Server-side (TypeScript):** `src/utils/arabic.ts`
- `describeNumberOfPosts(count)` - Blog post counts
- `describeNumberOfBookings(count)` - Booking counts

**Client-side (JavaScript):** `public/scripts/arabic-utils.js`
- `describeArabicCount(count, forms)` - Generic Arabic plural forms
- `describeNumberOfBookings(count)` - Booking count title
- `describeDuration(seconds, accusative)` - Duration in Arabic (e.g., "٣ ساعات و٢٠ دقيقة")
- `describeRelativeTime(date, reference, label)` - Relative time (e.g., "بعد يومين")

**Arabic plural rules:**
```javascript
// Forms array: [singular, dual, plural 3-10, plural 11+]
describeArabicCount(count, ['حجز واحد', 'حجزان اثنان', 'حجوزات', 'حجزًا']);
// 0: '' (empty)
// 1: 'حجز واحد'
// 2: 'حجزان اثنان'
// 3-10: '٥ حجوزات' (with Arabic numerals)
// 11+: '١٥ حجزًا' (accusative singular)
```

**Design principle:** When adding new count descriptions, use `describeArabicCount()` with appropriate forms rather than creating new functions. Only create a named wrapper (like `describeNumberOfBookings`) if the count will be used in multiple places.

### Client-Side Scripts Pattern

For JavaScript that runs in the browser (not at build time), use `public/scripts/`:

**Location:** `public/scripts/*.js`
- `phone-utils.js` - Phone number formatting
- `arabic-utils.js` - Arabic language utilities

**Usage in Astro pages:**
```html
<script src="/scripts/arabic-utils.js" is:inline></script>
<script is:inline>
  // Functions available on window object
  var title = window.describeNumberOfBookings(count);
</script>
```

**Why this pattern:**
- Astro's `is:inline` scripts don't support ES module imports
- Scripts in `public/` are served as-is (no bundling)
- Functions are exported to `window` for use in inline scripts
- Use ES5 syntax (`var`, `function`) for maximum browser compatibility

**Design principle:** When adding utilities needed by inline scripts, add them to the appropriate `public/scripts/*.js` file. If the utility is also useful at build time, add a TypeScript version to `src/utils/` as well.

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

The header (`src/components/widgets/Header.astro`) uses a two-phase responsive design with mobile hamburger menu and desktop horizontal menu. See [context/header-menu.md](context/header-menu.md) for detailed documentation.

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

### Phone Verification & Booking System

The booking system requires phone verification before scheduling. See [context/booking-system.md](context/booking-system.md) for complete documentation.

**Quick reference:**
- Phone verification components: `src/components/booking/PhoneVerification.astro`, `PhoneSelector.astro`
- Booking pages: `/book` (full flow), `/popup/book` (iframe popup), `/landing/booking-complete` (confirmation)
- Shared utilities: `public/scripts/phone-utils.js` (formatPhoneDisplay)
- JWT token stored in localStorage (`phone_verification_token`)
- Phone normalization: strips `+`, `00`, replaces leading `0` with `962` (Jordan)

**Query parameters for `/book`:**
- `type=clinic|remote` - Booking type
- `change=true` - Show verification form (ignore stored token)
- `change=false` - Auto-open Cal.com after showing selector

**Initialization pattern (prevents double-firing):**
```javascript
var initialized = false;
function init() {
  if (initialized) return;
  initialized = true;
  // ... init code
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
document.addEventListener('astro:page-load', init);
```

### Bookings Management Page

The `/bookings` page displays a user's upcoming appointments after phone verification.

**Key files:**
- `src/pages/bookings.astro` - Main page with phone display, verification flow, and booking list
- `src/components/booking/BookingCard.astro` - Reusable booking card component

**BookingCard utilities (`window.BookingCardUtils`):**
- `initBookingCard(cardId, booking, options)` - Initialize a card with booking data
- `formatArabicDate(dateStr)` - Format date in Arabic (e.g., "الأربعاء، ٣١ ديسمبر ٢٠٢٥")
- `formatArabicTime(dateStr)` - Format time in Arabic 12-hour format
- `toArabicNumerals(num)` - Convert Western numerals to Arabic (e.g., "123" → "١٢٣")

**initBookingCard options:**
```javascript
{
  index: 1,           // 1-based position in list
  total: 4,           // Total bookings count
  onLocationClick: (isClinic, meetingUrl) => { ... }
}
```

**Design principles:**
- Bookings are sorted by start time (earliest first) before rendering
- Use `toArabicNumerals()` from BookingCardUtils for consistent Arabic numeral display
- Card titles show position: "تفاصيل الحجز (١ من ٤)"

### Cal.com Booking

Appointment booking is integrated via Cal.com cloud embed. See [context/cal-com-embed.md](context/cal-com-embed.md) for detailed documentation.

**Quick reference:**
- Implementation: `src/pages/index.astro` (Hero content slot + inline script), `src/pages/book.astro`
- Event types: `/clinic` (in-person) and `/remote` (telemedicine)
- Cal.com link: `د.-مو-من-ديرانية-z6vyi6` (username-based, NOT private links)
- Uses custom `data-booking-*` attributes (NOT `data-cal-*`) to avoid Astro View Transitions conflicts
- Theme syncs automatically with AstroWind dark/light mode
- Supports prefilling fields via config: `attendeePhoneNumber`, `verificationToken`
- Supports rescheduling via `config.rescheduleUid`

**Important:** Private links (`/d/hash/event`) don't work with embeds - use username-based links only.

### Location Widget

The Location widget (`src/components/widgets/Location.astro`) displays clinic contact info:
- `phones` prop accepts array of `{ label, number }` objects
- Phone numbers render as clickable `tel:` links for mobile
- Example: `phones={[{ label: 'العيادة', number: '079 887 2899' }]}`

### Navigation & Anchor Links

Header navigation is configured in `src/navigation.ts`.

**Important:** For anchor links to homepage sections, use hardcoded strings (NOT `getPermalink`):
```typescript
// CORRECT - won't get trailing slash
href: '/#location'

// WRONG - getPermalink adds trailing slash: /#location/
href: getPermalink('/#location')
```