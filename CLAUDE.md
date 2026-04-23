# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Team & Collaboration Style

This is a family project. Orwa (developer) builds and maintains the site for his father Dr. Mu'men Diraneyya. Brothers Mamoun and Sufian also contribute.

- **Be terse.** No over-explanation. When told "commit and push", just do it.
- **Visual work is iterative.** Don't implement full UI features in one shot — start with the simplest visible change, get feedback, iterate.
- **Don't run builds** unless asked. The user has a dev server running with hot-reload.
- **Don't start the dev server.** Ask the user if needed.
- **Ask before making data promises.** Don't write policies or documentation claiming deletion processes exist unless you've verified the API supports it (learned from Cal.com data retention page).
- **The مسيرتنا page** is a deeply personal biography written by the doctor himself. Handle edits with care.

## Git & GitHub

- **This repo is a fork** of `arthelokyo/astrowind`. The `gh` CLI resolves to the upstream by default.
- **Always specify `--repo mumendiraneyya/clinic_website`** when using `gh pr create` or other `gh` commands.
- **PR images:** Leave HTML comment markers (`<!-- 📸 -->`) and ask the user to drag-and-drop images in the GitHub UI.
- **PR/comment attribution:** Use `🤖 برمجته [سوسن](https://claude.com/claude-code)` (سوسن is Claude's Arabic name). Do NOT use English "Generated with Claude Code".
- **Collaborator GitHub handles:** @mamouneyya (Mamoun), @SufianDira (Sufian), @mumendiraneyya (Dr. Mu'men)
- **n8n workflow sync:** Run `ssh root@n8n ./backup.sh 'commit message'` to backup workflows from the remote server, then `cd n8n && git pull` locally. Do not just `git pull` the submodule — workflows must be backed up from the server first.
- **Submodule `n8n`:** Contains n8n workflow backups.
- **Never use `git stash`** around commits that modify files. Stash pop can silently revert committed changes (happened with `book.astro` V2 integration — the stash captured the pre-edit state and overwrote the committed version on pop). If you need to work around uncommitted changes for `gh` commands, commit them first or use `--allow-dirty`.
- **After merging feature branches**, always verify that key files contain the expected changes. Don't trust the merge output alone.

## Knowledge Transfer Documents

Human-readable educational materials explaining complex topics encountered in this project:

- **[Astro View Transitions and Scripts](knowledge_transfer/astro-view-transitions-and-scripts.md)** - Understanding how View Transitions affect script execution, and the bug we fixed with the infinite spinner on `/book`

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

### Astro View Transitions and Inline Scripts

**Why we use `is:inline`:** With View Transitions (`ClientRouter`), Astro's processed scripts have unpredictable timing—they may not re-run on navigation, or may run before the DOM is ready. `is:inline` scripts run exactly where placed in the HTML, giving us explicit control over execution timing.

**Important:** When using `is:inline` scripts with View Transitions, the `astro:page-load` event may fire BEFORE the new page's script registers its listener. Use this pattern:

```javascript
// Use a global key to track initialization (survives script re-runs)
var initKey = 'my_page_initialized_' + window.location.search;

function init() {
  if (!window.location.pathname.startsWith('/my-page')) return;
  if (window[initKey]) return;  // Prevent double init
  window[initKey] = true;
  // ... initialization code
}

// Clear init flag when navigating away
document.addEventListener('astro:before-swap', function() {
  window[initKey] = false;
});

// Register listener (may miss the event if already fired)
document.addEventListener('astro:page-load', init);

// Also run on next microtask - handles both direct load and View Transitions
queueMicrotask(init);
```

Key points:
- `astro:page-load` listener may miss the event during View Transitions
- `queueMicrotask(init)` ensures init runs after DOM is ready
- Global `window[initKey]` prevents double initialization across event handlers
- `astro:before-swap` clears the flag for the next navigation

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
- `/bookings`
- `/video`
- `/book?type=clinic` (via customPages)
- `/book?type=remote` (via customPages)

**Excluded template pages** (deleted — no longer exist):
- These were removed: `/contact`, `/pricing`, `/services`, `/homes/*`

To add a page to the sitemap, update `astro.config.ts`. Use `filter` for regular pages and `customPages` for URLs with query parameters:

```typescript
sitemap({
  filter: (page) => {
    const url = new URL(page);
    const path = url.pathname;
    return (
      path === '/' ||
      path.startsWith('/blog') ||
      path.startsWith('/your-new-page')  // Add new pages here
    );
  },
  // URLs with query parameters must be added manually
  customPages: [
    'https://abuobaydatajjarrah.com/book?type=clinic',
    'https://abuobaydatajjarrah.com/book?type=remote',
  ],
}),
```

### Content Collections

Blog posts are defined in `src/content/config.ts` using Astro's content collections:
- Posts located in `src/data/post/` (not `src/content/post/`)
- Post images stored in `src/assets/images/posts/`
- Supports `.md` and `.mdx` files
- **Markdown line breaks:** A single newline between lines does NOT create a paragraph break — the lines merge into one paragraph. Use a **blank line** (double newline) between paragraphs. For a line break within a paragraph, add two trailing spaces before the newline.
- Schema includes: title, publishDate, excerpt, image, videoUrl, category, tags, author, hidden, metadata
- **`hidden: true`** generates the page but excludes it from blog listings (used for standalone pages like `/مسيرتنا`). Use `fetchPosts()` for listings (excludes hidden), `fetchAllPosts()` for page generation (includes hidden).
- Image paths use the `~` alias: `image: ~/assets/images/posts/filename.jpg`
- **Blog categories**: Category order is defined in `blogCategoryOrder` array in `src/navigation.ts` - this is the single source of truth used by both the header menu dropdown and the `BlogPostsByCategory` widget on the homepage.

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
- `#hero-image-container` - Hero image container (fades and scales down), contains `reviews` slot
- `#hero-actions-container` - Action buttons (desktop, becomes fixed)
- `#hero-below-content` - Title/subtitle that appears after scrolling past hero
- `#hero-mobile-actions` - Action buttons (mobile only)
- Mobile hero image section contains `mobile-reviews` slot

**Slots:** `content`, `actions`, `title`, `subtitle`, `bg`, `reviews` (desktop, inside fixed overlay), `mobile-reviews` (mobile, overlaid on hero image bottom)

**Anchor links and scroll behavior:**
When creating anchor links that should scroll past the hero image to show content:
- The heading content appears at approximately 150px scroll position
- Use JavaScript `window.scrollTo({ top: 150, behavior: 'smooth' })` rather than hash anchors
- Hash anchors won't work well with the snap scrolling implementation
- See `src/pages/index.astro` for example: "من نحن" link uses custom scroll handler

**Booking type selector (segmented pill):**
The hero action area contains a segmented pill control for choosing between clinic and remote booking, replacing the old toggle switch which was not discoverable enough (especially for older users).

- **Design:** Frosted glass pill (`backdrop-blur-[8px]`, `bg-white/40`, `border-white/50`) with a sliding primary-colored highlight that animates between segments. Icons flank the pill externally with a pop animation on switch.
- **Active segment:** Shows full label ("احجز موعدًا في العيادة" / "احجز استشارة عن بعد" on desktop; "احجز في العيادة" / "احجز عن بعد" on mobile) + icon in primary color
- **Inactive segment:** Shows short label ("عن بعد" / "في العيادة") + icon in muted color
- **Desktop:** Hover on inactive segment activates it (slider animates). Click on active segment opens booking flow
- **Mobile:** Tap inactive to switch, tap active to book. Inactive icon hidden to save space
- **Slider positioning:** Uses JS to measure active button's `offsetLeft`/`offsetWidth` and positions an absolutely-positioned div. Recalculates on `resize` event to handle window scaling
- **Icon pop:** Clone-and-replace technique to guarantee CSS animation restart on every toggle (the `animationend` event removes the class so it's fresh for next time)
- **CSS classes:** `.booking-pill-track`, `.booking-pill`, `.booking-pill-slider`, `.booking-pill-btn`, `.booking-pill-outer-icon`
- **JS functions:** `activateBookingType(type)`, `positionSlider(pill, skipTransition)`, `handleBookingClick()`

**Key CSS classes:**
- `.is-fixed` - Applied to action containers when pinned to bottom
- `.is-hidden` - Hides pinned buttons when user scrolls near the footer (reveals social links)
- Styles handle backdrop blur, safe area insets, and margin removal
- Dark mode uses `html.dark` selector for styling pinned action bar

### Patient Reviews (Trust Building)

Animated patient reviews on the landing page hero — visible immediately without scrolling. Two components, one data source:

- **Data:** `src/data/reviews.json` — all patient reviews with a `weight` field (1–3). Ordering logic in `index.astro` (`orderReviews`)
- **Desktop:** `ReviewScroller.astro` — vertical animated scroller, placed via `reviews` slot in Hero
- **Mobile:** `ReviewTicker.astro` — horizontal ticker, placed via `mobile-reviews` slot in Hero
- Both use semi-transparent backdrop-blur cards and edge fading (CSS mask-image)
- Animation duration scales with review count (`reviews.length * N seconds`)
- Separate from "قالوا عنا" section which holds longer personal messages

**Review weights and ordering:** Each review has a `weight` (1–3) based on trust-building specificity. The ordering algorithm treats each weight group differently because the value of a review shifts from date-dependent (generic praise) to content-dependent (specific trust signals):
- **Weight 3** (specific experiences, strong emotional trust): fully random — the content is powerful regardless of when it was written
- **Weight 2** (names specific qualities like "gives time", "accurate diagnosis"): loosely sorted by 2-year buckets, randomised within each bucket
- **Weight 1** (generic praise like "دكتور ممتاز"): strict date descending — recency is the only differentiator
- Groups are interleaved in a [3, 2, 3, 1] pattern so trust-heavy reviews appear most frequently

**Responsive positioning of vertical scroller:**
- **md–xl (768–1280px):** Left side of hero — avoids covering the doctor's face on the right
- **xl+ (1280px+):** Right side of hero — enough space for both

**Disclaimer text:** Both scrollers show "كلمات المرضى منقولة كما هي..." The ticker (mobile) breaks it into two lines below `sm` (640px) because on small screens the single-line text overlaps the doctor's coat. The scroller (desktop) uses `whitespace-nowrap` with responsive font sizing to fit the container width.

**WhatsApp button edge case** (in `index.astro`): In landscape phone orientation (wide but very short screen), the vertical review scroller overlaps the WhatsApp CTA button. A CSS media query `@media (max-width: 1220px) and (max-height: 540px)` adds a white background to the button only in this scenario, preventing the semi-transparent reviews from blending into the transparent button and making both unreadable. On normal desktop/portrait orientations the button stays transparent.

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

### PostHog MCP

PostHog analytics MCP (`mcp__posthog__*`) for querying data, creating insights, and managing dashboards. Project ID: `116305`. Use `query-run` to test queries, `insight-create-from-query` to save them.

### n8n MCP

n8n workflow automation MCP (`mcp__n8n-mcp__*`) for inspecting and modifying backend workflows. The phone verification workflow ID is `dwv7rpf8uHxyum02`. Use `search_workflows` to find workflows, `get_workflow_details` to inspect them.

## Integrations

### Phone Verification & Booking System

The booking system requires phone verification before scheduling. See [context/booking-system.md](context/booking-system.md) for complete documentation.

**Quick reference:**
- Phone verification: `PhoneVerificationV2.astro` (default on `/book`, `/bookings`, `/video` — WhatsApp button + QR code, no visible code), `PhoneVerification.astro` (V1 fallback, SMS/WhatsApp OTP), `PhoneSelector.astro`
- Booking pages: `/book` (full flow), `/popup/book` (iframe popup), `/landing/booking-complete` (confirmation)
- Shared utilities: `public/scripts/phone-utils.js` (formatPhoneDisplay), `public/scripts/qrcode-generator.js` (QR code for V2 desktop)
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

### Video Consultation Page

The `/video` page allows patients to join their remote video consultations with a countdown timer and auto-redirect.

**Key files:**
- `src/pages/video.astro` - Main video consultation page
- `src/components/booking/PhoneDisplayBar.astro` - Reusable phone display component (shared with `/bookings`)

**Features:**
- Countdown timer using Arabic time formatting (`describeRelativeTime`)
- Two modes: UID parameter (specific booking) or automatic (finds earliest remote booking)
- Phone verification flow with PhoneDisplayBar
- Timed button activation and auto-redirect

**Timing thresholds:**
- **5 minutes before**: "Join now" button becomes enabled
- **3 minutes before**: Pulsing warning message appears
- **1 minute before**: Auto-redirect to Cal.com video room

**API parameters:**
- `before_ms`: Include ongoing meetings (set to 20 min = 1,200,000 ms to catch meetings that already started)

**Query parameters:**
- `?uid=xxx` - Join a specific booking by its UID (linked from booking cards)

### PhoneDisplayBar Component

Reusable component for displaying verified phone numbers with change/forget functionality.

**Location:** `src/components/booking/PhoneDisplayBar.astro`

**Props:**
- `id` - Unique ID prefix for the instance (default: `'phone-display'`)
- `label` - Label text shown next to phone icon (default: `'رقم الهاتف المستخدم للحجز'`)

**JavaScript API (`window.PhoneDisplayBar`):**
- `init(containerId, phone)` - Initialize with a phone number
- `reset(containerId)` - Reset to normal state

**Events emitted:**
- `phone-display-change` - User wants to change their phone number
- `phone-display-delete` - User confirmed deletion of their phone number

**Usage:**
```astro
<PhoneDisplayBar id="my-phone-display" label="رقم الهاتف" />

<script is:inline>
  // Initialize
  window.PhoneDisplayBar.init('my-phone-display', '962791234567');

  // Listen for events
  document.getElementById('my-phone-display').addEventListener('phone-display-change', function() {
    // Show verification form
  });

  document.getElementById('my-phone-display').addEventListener('phone-display-delete', function() {
    // Clear token and show verification
  });
</script>
```

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

**View Transitions and anchor links:** `BasicScripts.astro` forces `window.location.href` for `/#anchor` links when on a different page (View Transitions would otherwise only handle the hash). The hero snap scroll in `Hero.astro` skips snapping when `window.location.hash` is present to avoid fighting the anchor scroll.

### Analytics & Tracking

PostHog custom events instrument the booking funnel and detect ad fraud. See [context/analytics-and-tracking.md](context/analytics-and-tracking.md) for complete documentation including all event names, properties, PostHog insight URLs, and the ad fraud detection system.

**Quick reference:**
- PostHog init: `src/components/common/PosthogAnalytics.astro` (production only — skips localhost and `*.pages.dev`)
- Booking funnel events: `PhoneVerification.astro` (6 events + `posthog.identify`), `book.astro` (2 events), `index.astro` (2 events)
- Backend event: `booking_completed` fired from n8n via PostHog server-side API, correlated by phone number
- Ad fraud detection: `ad_visit_engagement` event with `is_ghost_visit` flag (only fires for ad-attributed visits)
- Phone privacy: `MASK_PHONE_IN_ANALYTICS` flag in `PhoneVerification.astro` (currently `false`)
- All `posthog.capture()` calls use `window.posthog?.capture()` — safe to call even if PostHog isn't loaded
- CSP: `public/_headers` must whitelist external analytics/embed domains — check here first if things break silently

### n8n Backend & Local Services

See [context/n8n-backend.md](context/n8n-backend.md) for complete documentation of all n8n workflows, local services, SMS gateway, WhatsApp AI assistant, and V2 verification.

**Quick reference:**
- n8n instance: `https://n8n.orwa.tech` (self-hosted, v2.15.1)
- Local services: `clinic-service.service` on `127.0.0.1:3847` — `/validate` (phone validation) and `/send-sms` (async SMS)
- Key workflows: Verify Phone V1 (`dwv7rpf8uHxyum02`), V2 (`wpSDqlKO2iMoUZZ7`), Autoconfirm Appointments (`r09D20b6MASeLOeX`), WhatsApp AI (`XlYzvScd6xm3xlBI`), Telegram subflow (`C2F9UQOSqoWTqCg8`), Cal.com Notifications (`n1xrgJXoX6d74bjo`), Send Reminders (`WiqM8fag3FvWvW6t`)
- Cal.com Notifications: central messaging hub for booking events → WhatsApp templates + SMS + Telegram
- WhatsApp AI: Claude Haiku 4.5, intent classification, verification code interception
- SMS gateway: Termux phones via reverse SSH tunnels through VPS
- WhatsApp templates: `booking_clinic_completed` (location header), `booking_remote_completed`, `booking_cancelled_by_doctor`, `booking_cancelled_by_patient`, `booking_rescheduled_by_doctor`, `booking_rescheduled_by_patient`, `meeting_started_patient`, `booking_reminder` (pending), `verification_code`