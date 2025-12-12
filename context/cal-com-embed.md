# Cal.com Embed Integration

This document describes how Cal.com booking is integrated into the clinic website.

## Overview

The website uses Cal.com's cloud embed to provide appointment booking functionality. The embed opens as a modal popup when the user clicks the booking button.

## Event Types

Two Cal.com event types are configured:
- **Clinic appointment**: `د.-مو-من-ديرانية-z6vyi6/clinic`
- **Remote appointment**: `د.-مو-من-ديرانية-z6vyi6/remote`

The user selects between these using a toggle switch on the landing page.

## Implementation Details

### Location
- Main implementation: `src/pages/index.astro`
- The booking UI is in the Hero widget's `content` slot

### Key Components

1. **Toggle Switch**: A checkbox styled as a toggle that switches between clinic and remote booking
   - Default (checked): "موعد في العيادة" (Clinic appointment)
   - Unchecked: "موعد عن بعد" (Remote appointment)

2. **Booking Button**: Primary action button that triggers the Cal.com modal

3. **Cal.com Script**: Inline script that initializes Cal.com and handles the modal

### Custom Data Attributes

We use custom `data-booking-*` attributes instead of Cal.com's standard `data-cal-*` attributes:
- `data-booking-link`: Base Cal.com link (without `/clinic` or `/remote` suffix)
- `data-booking-namespace`: Cal.com namespace (e.g., "landing")
- `data-booking-config`: JSON config for the modal (layout, etc.)

**Why custom attributes?** Cal.com's auto-binding on `data-cal-*` attributes conflicts with Astro View Transitions, causing the modal to trigger twice. Using custom attributes and a manual click handler avoids this issue.

### Theme Synchronization

The Cal.com modal theme automatically syncs with AstroWind's current theme state:
```javascript
config.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
```

### Script Initialization

The click handler is registered on `astro:page-load` event, which fires on both initial page load and after View Transitions:
```javascript
document.addEventListener('astro:page-load', setupCalButton);
```

**Important**: Do NOT call `setupCalButton()` directly in addition to the event listener - `astro:page-load` fires on initial load too, so calling it twice would register duplicate event handlers.

## Customization Limitations

Cal.com cloud embeds have **limited styling customization**:
- Theme (light/dark/system) works
- Layout options work (month_view, week_view)
- `cssVarsPerTheme` and `styles` options do **NOT work** for cloud embeds
- Custom fonts cannot be applied to the embed
- Brand colors must be configured in Cal.com account settings, not via the embed API

For full styling control, self-hosting Cal.com would be required.

## Code Structure

```
src/pages/index.astro
├── Hero component
│   └── content slot
│       ├── Toggle container (pill-shaped)
│       │   ├── Label with dynamic text
│       │   ├── Toggle switch (checkbox)
│       │   └── Booking button (with data-booking-* attributes)
│       └── WhatsApp contact button
└── Cal.com embed script
    ├── Cal.com loader (IIFE)
    ├── Cal initialization
    └── setupCalButton() - manual click handler
```

## Troubleshooting

### Modal opens twice
- Ensure `data-cal-*` attributes are NOT used (use `data-booking-*` instead)
- Ensure `setupCalButton()` is only called via `astro:page-load`, not additionally in the script body

### Modal doesn't open
- Check browser console for Cal.com script errors
- Verify the Cal.com link is correct
- Ensure the namespace matches between `Cal("init", "namespace", ...)` and `data-booking-namespace`

### Theme doesn't match
- The theme is determined at click time based on `document.documentElement.classList.contains('dark')`
- If AstroWind's theme detection changes, the selector may need updating
