# Booking System Documentation

This document describes the phone verification and booking flow for the clinic website.

## Overview

The booking system integrates phone verification with Cal.com scheduling. Users must verify their phone number before booking appointments. The system stores a JWT token in localStorage to remember verified users.

## Architecture

### Components

```
src/components/booking/
├── PhoneVerification.astro  # Phone input + OTP verification flow
└── PhoneSelector.astro      # Shows verified phone with proceed/change options
```

### Pages

```
src/pages/
├── book.astro               # Full booking page with verification flow
├── popup/
│   └── book.astro           # Minimal popup for quick booking (iframe)
└── landing/
    └── booking-complete.astro  # Post-booking confirmation page
```

### Shared Utilities

```
public/scripts/
└── phone-utils.js           # Phone formatting (formatPhoneDisplay, PHONE_COUNTRY_CODES)
```

### Layouts

```
src/layouts/
└── PopupLayout.astro        # Minimal layout for popup pages (no header/footer)
```

## Flow Diagrams

### New User Flow
```
Homepage → Click "احجز موعدًا" → Popup shows PhoneSelector
→ No token found → Redirect to /book?type=clinic
→ Enter phone → Send OTP → Verify OTP
→ Token saved → Cal.com modal opens with prefilled data
```

### Returning User Flow (has valid token)
```
Homepage → Click "احجز موعدًا" → Popup shows PhoneSelector
→ Token validated → Shows stored phone number
→ Click "المتابعة بهذا الرقم" → Cal.com modal opens
```

### Change Phone Flow
```
Popup → Click "ليس رقمك؟" → Redirect to /book?type=clinic&change=true
→ Shows verification form directly (skips phone selector)
→ Enter new phone → Verify → Token saved → Redirect to /book?type=clinic&change=false
→ Page loads with PhoneSelector showing new number → Cal.com auto-opens
→ If user cancels Cal.com, they see PhoneSelector (not verification form)
```

## Key Files

### `/src/pages/index.astro`
- Contains booking button click handler
- Creates popup modal with iframe to `/popup/book`
- Listens for postMessage from popup
- Opens Cal.com modal with prefilled phone and token
- Handles `proceed`, `change-phone`, and `close` actions

Key functions:
- `showBookingPopup(bookingType)` - Creates and shows popup modal
- `closeBookingPopup(callback)` - Animates and removes popup
- `openCalModal(phone, token, bookingType)` - Opens Cal.com with config
- `handlePopupMessage(event)` - Processes iframe messages

### `/src/pages/popup/book.astro`
- Minimal page using PopupLayout (no header/footer)
- Validates stored token on load
- Shows PhoneSelector if token valid
- Communicates with parent via postMessage

PostMessage actions sent to parent:
- `{ action: 'proceed', phone, token, bookingType }` - User confirmed phone
- `{ action: 'change-phone', bookingType }` - User wants different number
- `{ action: 'close' }` - Close popup

### `/src/pages/book.astro`
- Full page with header/footer
- Shows PhoneSelector if valid token exists
- Shows PhoneVerification if no token or `?change=true`
- Opens Cal.com modal after verification

Query parameters:
- `type=clinic|remote` - Booking type
- `change=true` - Skip to verification form (ignore stored token)
- `change=false` - After successful verification, show selector and auto-open Cal.com

### `/src/components/booking/PhoneVerification.astro`
- Phone input with SMS/WhatsApp method selector
- Sends OTP via webhook
- Verifies OTP and receives JWT token
- Dispatches `phone-verified` event with `{ token, phone }`

Phone normalization:
- `0782760965` → `962782760965` (replaces leading 0 with Jordan code)
- `+962782760965` → `962782760965` (strips +)
- `00962782760965` → `962782760965` (strips 00)

API endpoints:
- Send code: `https://n8n.orwa.tech/webhook/c6c748c4-6c9d-4b13-a395-e014cbaf6e05`
- Verify code: `https://n8n.orwa.tech/webhook/9298e44c-0a64-49ea-9b1e-e1db3c4f1b11`

### `/src/components/booking/PhoneSelector.astro`
- Displays formatted phone number
- "المتابعة بهذا الرقم" button dispatches `phone-selected` event
- "ليس رقمك؟" link dispatches `change-phone` event
- Reads `dataset.phone` fresh at click time (not at init)

### `/src/pages/landing/booking-complete.astro`
- Shows booking confirmation after Cal.com redirect
- Parses URL parameters from Cal.com
- Displays date/time in Arabic
- Shows clinic location map for in-person appointments

## localStorage

Key: `phone_verification_token`
Value: JWT token from verification endpoint

Token validation endpoint: `https://n8n.orwa.tech/webhook/b1ac96a5-c166-4ec0-9a3a-37198d210e46`

## Cal.com Integration

Config passed to Cal.com modal:
```javascript
{
  layout: 'month_view',
  theme: 'light' | 'dark',
  attendeePhoneNumber: '+962xxxxxxxxx',
  verificationToken: 'jwt-token-here'
}
```

Cal.com base link: `د.-مو-من-ديرانية-z6vyi6`
Event types: `/clinic` (in-person), `/remote` (telemedicine)

See `context/cal-com-embed.md` for more Cal.com details.

## Styling

Both PhoneVerification and PhoneSelector use:
- Font: Source Code Pro (weight 400)
- Phone input: `letter-spacing: 0.05em`
- Code input: `letter-spacing: 0.5em`

## Event System

Custom events (bubble up through DOM):
- `phone-verified` - From PhoneVerification, detail: `{ token, phone }`
- `phone-selected` - From PhoneSelector, detail: `{ phone }`
- `change-phone` - From PhoneSelector, no detail

## Initialization Patterns

Both pages and components use dual initialization for compatibility, with a guard to prevent double-firing (which causes issues like Cal.com modal opening twice):

```javascript
var initialized = false;
function init() {
  // Prevent double initialization (DOMContentLoaded + astro:page-load can both fire)
  if (initialized) return;
  initialized = true;

  // ... initialization code
}

// Fallback for direct navigation / iframes
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// For pages with View Transitions
document.addEventListener('astro:page-load', init);
```

**Why the guard?** Both `DOMContentLoaded` and `astro:page-load` can fire on page load, causing initialization code to run twice. The `initialized` flag ensures it only runs once.

## Future Enhancements

Planned features for the booking system:
- Booking management dashboard
- View/cancel upcoming appointments
- Booking history
- SMS reminders integration
- Multiple phone numbers per user
