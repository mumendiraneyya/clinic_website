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
  font-size: clamp(0.75rem, calc(-0.75rem + 3.125vw), 1.25rem);
  font-weight: 500;
}
```

This formula:
- **768px**: Menu items at minimum 0.75rem (12px)
- **900px**: Menu items scale proportionally (~16px)
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

## Design Decisions

1. **Single breakpoint**: Using `md:` (768px) eliminates edge cases and inconsistencies that occurred with multiple breakpoints
2. **Separate nav elements**: `.nav-desktop` and `.nav-mobile` prevent JavaScript conflicts
3. **Consistent logo size**: Logo uses fixed `text-xl` (not responsive) so it never shrinks on wider screens
4. **Menu matches logo at wide screens**: The clamp formula ensures menu items reach logo size at 1024px+
