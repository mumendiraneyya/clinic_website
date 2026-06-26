# Bug: mobile hamburger menu can't scroll to its top items

**Status:** open — documented for a dedicated session. A candidate one-line fix is below but is **not** applied.

## Symptom

On phone screens (viewport `< 768px`), opening the hamburger menu shows the list
**clipped at the top**. You cannot scroll up past **"أسئلة شائعة"**, so the items above it —
**عن العيادة, من نحن, ماذا نعالج** — are unreachable, and the full menu can't be browsed.

Reported by Mamoun on mobile Safari (screenshot on the family chat). Confirmed: the items
**are** present in the built DOM, so this is purely a scroll/layout bug, not a data/rendering one.

## Where

- **Markup:** `src/components/widgets/Header.astro` — the mobile `<nav class="nav-mobile …">`
  (~line 162). Current classes:
  `nav-mobile items-center w-full hidden text-default overflow-y-auto overflow-x-hidden md:!hidden`
- **Expanded styles:** `src/assets/styles/tailwind.css` — `#header.expanded .nav-mobile { … }`
  (~line 54): `display: flex !important; position: fixed; top: 70px; left: 0; right: 0;
  bottom: 0 !important; … }`
- **Toggle JS:** `src/components/common/BasicScripts.astro` — adds/removes `.expanded` on
  `#header` (plus `h-screen` on `#header` and `overflow-hidden` on `body`).

## Root cause (high confidence)

Classic **flexbox-centering + overflow trap.** When expanded, `.nav-mobile` is a
**fixed-height scroll container** (`position: fixed; top: 70px; bottom: 0; overflow-y: auto`)
that is *also* `display: flex` with **`align-items: center`** (the `items-center` class). Once the
menu is taller than the viewport, vertical centering pushes the list's **top above the
container's top edge** — and `overflow-y` **cannot scroll to content that overflows above the
scroll origin**. So only downward scrolling works; the upper items are permanently unreachable.

It surfaced **now** because the menu grew tall enough to overflow the viewport (recently added
items: the **ماذا نعالج** dropdown + procedure links, on top of the **المنشورات** category
dropdown injected in `PageLayout`). On shorter menus it didn't overflow, so the centering was
harmless — which is why this is a latent, pre-existing bug rather than a regression from any one
change.

## Suggested fix (one line)

Align the scroll container to the **top** instead of centering it. In `Header.astro`, change the
mobile-nav class `items-center` → `items-start`:

```html
<nav
  class="nav-mobile items-start w-full hidden text-default overflow-y-auto overflow-x-hidden md:!hidden"
  aria-label="Mobile navigation"
>
```

(Equivalent CSS override: `#header.expanded .nav-mobile { align-items: flex-start; }`.)

**Optional hardening:**
- add `overscroll-contain` — stop scroll-chaining to the page behind the menu;
- add `pb-[env(safe-area-inset-bottom)]` — so the last item clears the iOS home indicator;
- verify the hardcoded `top: 70px` matches the actual mobile header height.

## How to reproduce / verify

1. Mobile viewport `< 768px` (Chrome DevTools device emulation, or a real phone).
2. Open the hamburger menu — with the current menu it should overflow the screen.
3. **Before fix:** stuck at "أسئلة شائعة"; can't reach عن العيادة / من نحن / ماذا نعالج.
4. **After fix:** the list scrolls from the first item (عن العيادة) to the last
   (اتصل بنا هاتفيًا).

Test with `npm run dev` (localhost:4321) under device emulation, or on the deployed preview.

## Notes

- This is independent of the procedure-pages work (on the `procedures` branch). The IA change
  there — promoting **ماذا نعالج** to a top-level menu item — does **not** fix this scroll bug;
  the top of the menu is still unreachable whenever it overflows.
- Keep the fix on `main` (shared Header), separate from the procedures branch.
