# Header Menu

The site header (`src/components/widgets/Header.astro`) implements a two-phase responsive design with a clean breakpoint at 768px (Tailwind's `md:` breakpoint).

## Two-Phase Design

### Mobile (< 768px)
- Hamburger menu icon on the left
- Logo on the right
- Tapping hamburger opens full-screen mobile navigation with:
  - All nav links
  - Phone call link ("اتصل بنا هاتفيًا")
  - Theme toggle with label ("تظليم")
  - Social media icons at bottom

### Desktop (≥ 768px)
- Theme toggle icon on the left
- Centered navigation menu
- Logo on the right
- Responsive font sizing scales menu items from small to logo-matching size

## Responsive Font Sizing

The navigation links use CSS `clamp()` for smooth responsive scaling:

```css
.nav-link {
  font-size: clamp(1rem, calc(0.25rem + 1.56vw), 1.25rem);
  font-weight: 500;
}
```

This formula:
- **768px**: Menu items at minimum 1rem (16px)
- **900px**: Menu items scale proportionally (~18px)
- **1024px+**: Menu items reach maximum 1.25rem (20px), matching the logo size

## Key Files

- `src/components/widgets/Header.astro` - Main header component with responsive layout
- `src/components/Logo.astro` - Logo component (consistent `text-xl` sizing)
- `src/components/common/BasicScripts.astro` - JavaScript for mobile menu toggle
- `src/assets/styles/tailwind.css` - Expanded menu styles

## DOM Structure

```
#header
├── .header-container
│   ├── .mobile-header (md:hidden)
│   │   ├── ToggleMenu (hamburger)
│   │   └── Logo
│   ├── .desktop-header (hidden md:flex)
│   │   ├── ToggleTheme
│   │   ├── nav.nav-desktop (centered)
│   │   └── Logo
│   └── nav.nav-mobile (hidden, shown when expanded)
│       ├── Nav links
│       ├── Phone link
│       ├── Theme toggle with label
│       └── Social links
```

## Mobile Menu Toggle

The mobile menu is controlled by JavaScript in `BasicScripts.astro`:

1. Clicking `[data-aw-toggle-menu]` toggles the `expanded` class
2. When expanded:
   - `.nav-mobile` becomes visible (via CSS in `tailwind.css`)
   - Body gets `overflow-hidden` to prevent scroll
   - Header gets `h-screen` and `expanded` classes
3. Clicking inside `.nav-mobile` or resizing past 767px closes the menu

**Important**: JavaScript selectors use `.nav-mobile` specifically (not generic `nav`) to avoid affecting the desktop navigation.

## CSS Classes

### Mobile Menu Expanded State (`tailwind.css`)

```css
#header.expanded .nav-mobile {
  display: flex !important;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0 !important;
  padding: 0 5px;
  background: white;
  z-index: 50;
}

html.dark #header.expanded .nav-mobile {
  background: rgb(15, 23, 42);
}
```

## Dynamic Blog Categories Menu

The "المنشورات" menu item dynamically generates dropdown sub-items from blog post categories, with nested submenus showing individual posts. This is implemented in `src/layouts/PageLayout.astro`.

### How It Works

1. Fetches all blog posts via `fetchPosts()`
2. Groups posts by category
3. Builds dropdown links with category names, each containing nested links to individual posts
4. Injects these as sub-links under the "المنشورات" menu item

### Category Order

Categories appear in a specific order defined in `PageLayout.astro`:

```javascript
const categoryOrder = [
  'مقاطع تعريفية ومقابلات عامة',
  'جراحة عامة',
  'القناة الشرجية',
  'فتوق جدار البطن',
];
```

**Important:** Category names must match exactly between this array and the `category` field in post frontmatter. If a category doesn't match, it won't appear in the menu.

### Adding a New Category

1. Add posts with the new category name in frontmatter
2. Add the exact category name to `categoryOrder` in `PageLayout.astro`
3. The menu will automatically show the category with its posts

### Menu Structure

The generated "المنشورات" dropdown contains:
- "جميع المنشورات" (link to all posts)
- Each category as a submenu item with:
  - A chevron icon indicating nested content
  - Hovering (desktop) or clicking (mobile) reveals individual post links
  - Clicking the category name navigates to the category page

### Nested Dropdown Implementation

**Desktop (hover-based):**
- Categories with posts show a left-pointing chevron (`tabler:chevron-left`)
- Hovering over a category reveals the nested menu to the left (RTL layout)
- CSS classes: `.nested-dropdown`, `.nested-menu`

**Mobile (click-based):**
- Categories with posts show a down chevron that rotates on expand
- Clicking toggles the nested posts list
- JavaScript in `BasicScripts.astro` handles the toggle
- CSS classes: `.mobile-nested-dropdown`, `.mobile-nested-menu`

**Key files:**
- `src/layouts/PageLayout.astro` - Builds the nested data structure
- `src/components/widgets/Header.astro` - Renders desktop and mobile menus
- `src/components/common/BasicScripts.astro` - Mobile toggle JavaScript
- `src/assets/styles/tailwind.css` - Nested dropdown styles

## Design Decisions

1. **Single breakpoint**: Using `md:` (768px) eliminates edge cases and inconsistencies that occurred with multiple breakpoints
2. **Separate nav elements**: `.nav-desktop` and `.nav-mobile` prevent JavaScript conflicts
3. **Consistent logo size**: Logo uses fixed `text-xl` (not responsive) so it never shrinks on wider screens
4. **Menu matches logo at wide screens**: The clamp formula ensures menu items reach logo size at 1024px+
