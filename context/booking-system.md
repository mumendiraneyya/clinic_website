# Booking System Documentation

This document describes the phone verification and booking flow for the clinic website.

## Overview

The booking system integrates phone verification with Cal.com scheduling. Users must verify their phone number before booking appointments. The system stores a JWT token in localStorage to remember verified users.

## Architecture

### Components

```
src/components/booking/
├── PhoneVerification.astro  # Phone input + OTP verification flow
├── PhoneSelector.astro      # Shows verified phone with proceed/change options
└── BookingCard.astro        # Displays booking details with calendar actions
```

### Pages

```
src/pages/
├── book.astro               # Full booking page with verification flow
├── bookings.astro           # Booking management dashboard (view upcoming appointments)
├── popup/
│   └── book.astro           # Minimal popup for quick booking (iframe)
└── landing/
    └── booking-complete.astro  # Post-booking confirmation page
```

### Shared Utilities

```
public/scripts/
└── phone-utils.js           # Phone formatting and country detection utilities
```

**phone-utils.js exports (via window):**
- `PHONE_COUNTRY_CODES` - Array of valid country calling codes (1-3 digits)
- `PHONE_COUNTRY_FLAGS` - Object mapping country codes to flag emojis
- `formatPhoneDisplay(phone)` - Formats phone for display: `962782760965` → `+962 782 760 965`
- `getFlagForCountryCode(code)` - Returns flag emoji for a country code
- `getFlagFromPhone(phone)` - Extracts country code from phone and returns flag emoji

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
- Country flag indicator (appears when valid country code detected)
- Sends OTP via webhook
- Verifies OTP and receives JWT token
- Dispatches `phone-verified` event with `{ token, phone }`

Country flag behavior:
- Hidden when input is empty or no valid country code detected
- Uses `window.getFlagFromPhone()` from phone-utils.js
- Updates in real-time as user types

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

### `/src/components/booking/BookingCard.astro`
- Reusable card component for displaying booking details
- Shows: appointment type, date, time (with timezone), location/video link
- "Add to Calendar" dropdown (Google, Apple, Outlook)
- Optional reschedule and cancel buttons (hidden by default, enabled via `showReschedule`/`showCancel` options)
- Cancel confirmation overlay with loading/success/error states
- Exposes `window.BookingCardUtils` with:
  - `initBookingCard(cardId, booking, options)` - Initialize card with booking data
  - `formatArabicDate(dateStr)` - Format date in Arabic
  - `formatArabicTime(dateStr)` - Format time in Arabic (12-hour)
  - `getArabicTimezoneName(timeZone)` - Get Arabic timezone name
  - `toArabicNumerals(num)` - Convert Western numerals to Arabic
  - `cancelBooking(cardId, bookingUid, onSuccess, onError)` - Cancel booking via Cal.com API

### `/src/pages/bookings.astro`
- Booking management dashboard
- Requires phone verification (uses stored token)
- Fetches upcoming bookings from API
- Displays bookings as cards using `BookingCard` component (cloned from template)
- Shows phone number with "تغيير الرقم" option (LTR, New Rail font)
- Empty state when no upcoming bookings
- "حجز موعد جديد" button to create new booking

States:
- Loading: Shows spinner while fetching
- No token: Shows PhoneVerification form
- Token invalid: Clears token, shows verification
- Network error: Shows error state with retry button (keeps token)
- Success with bookings: Shows list of BookingCard components
- Success without bookings: Shows empty state

**Phone number change flow (token preservation):**
- User clicks "تغيير الرقم" → verification form shows with cancel button
- Token is NOT removed until new verification completes
- Cancel button returns to bookings view using cached data
- Only when new phone is verified, the new token replaces the old one

**Script initialization:**
- Runs immediately on script load (no DOMContentLoaded wait needed)
- Also listens for `astro:page-load` for View Transitions navigation
- `setupEventHandlers()` runs on both initial load AND View Transitions (DOM elements are replaced)
- `initBookingsPage()` runs on both initial load and View Transitions
- Note: Document-level event listeners (like `phone-verified`) may be added multiple times; this is acceptable since the handler reloads the page

**BookingCard template cloning:**
- Uses `<template id="booking-card-template">` containing `<BookingCard />`
- Cards are cloned and initialized via `window.BookingCardUtils.initBookingCard()`
- Polling waits for `BookingCardUtils` to be available (async script loading)

### `/src/pages/landing/booking-complete.astro`
- Shows booking confirmation after Cal.com redirect
- **Polls Cal.com API** (`/v2/bookings/{uid}`) to verify booking status
- Initial state shows "pending" with loading indicator
- Updates to accepted/rejected/cancelled based on API response
- Displays date/time in Arabic with attendee's timezone from API
- "Add to Calendar" dropdown (Google Calendar, Apple Calendar, Outlook)
- Shows clinic location map for in-person appointments
- Home button always visible; calendar button only on success

**Booking status polling:**
- Polls every 3 seconds, max 40 attempts (~2 minutes)
- Status states: `pending` → `accepted` | `rejected` | `cancelled` | `error`
- Uses `cal-api-version: 2024-08-13` header

## API Endpoints

All endpoints use POST with `Content-Type: application/x-www-form-urlencoded`.

### Phone Verification

**Send code:**
```
POST https://n8n.orwa.tech/webhook/c6c748c4-6c9d-4b13-a395-e014cbaf6e05
Body: phone=<normalized>&method=<sms|whatsapp>
Response: { success: true, method: "sms" }
```

**Verify code:**
```
POST https://n8n.orwa.tech/webhook/9298e44c-0a64-49ea-9b1e-e1db3c4f1b11
Body: phone=<normalized>&code=<4-digit>
Response: { success: true, token: "jwt..." }
```

### Token & Bookings

**Validate token:**
```
POST https://n8n.orwa.tech/webhook/b1ac96a5-c166-4ec0-9a3a-37198d210e46
Body: token=<jwt>
Response: { success: true, payload: { phone, method, iat }, age: <days> }
```

**Fetch bookings:**
```
POST https://n8n.orwa.tech/webhook/4900724b-a648-42f5-91da-7711f0006da1
Body: token=<jwt>
Response: { status: "success", data: [...bookings], pagination: {...}, token_payload: {...} }
         or { status: "error" } if token invalid
```

The response includes:
- `data` - Array of upcoming, accepted appointments
- `pagination` - Pagination info (totalItems, currentPage, etc.)
- `token_payload` - Decoded JWT payload with `{ phone, method, iat }`

Each booking includes:
- `uid` - Booking unique identifier
- `start`, `end` - ISO datetime strings
- `eventType.slug` - "clinic" or "remote"
- `meetingUrl` - Video link for remote, location for clinic
- `attendees[0].timeZone` - Attendee's timezone

## localStorage

Key: `phone_verification_token`
Value: JWT token from verification endpoint

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
- Font: New Rail Alphabet (weight 400)
- Phone input: `letter-spacing: 0.05em`
- Code input: `letter-spacing: 0.5em`

## Event System

Custom events (bubble up through DOM):
- `phone-verified` - From PhoneVerification, detail: `{ token, phone }`
- `phone-selected` - From PhoneSelector, detail: `{ phone }`
- `change-phone` - From PhoneSelector, no detail

## Initialization Patterns

### Simple Pattern (bookings.astro)
For pages with `is:inline` scripts that need View Transitions support:

```javascript
// Run immediately on script load
setupEventHandlers();
initBookingsPage();

// Re-run initialization on View Transitions navigation
document.addEventListener('astro:page-load', function() {
  if (window.location.pathname.startsWith('/bookings')) {
    initBookingsPage();
  }
});
```

**Key points:**
- `is:inline` scripts run synchronously when the DOM parser reaches them
- No need for DOMContentLoaded since script is after the elements it references
- `astro:page-load` fires on View Transitions navigation to the page
- Check pathname to avoid running on unrelated pages

### Guarded Pattern (book.astro, popup/book.astro)
For pages where initialization should only happen once per page load:

```javascript
var initialized = false;
function init() {
  if (initialized) return;
  initialized = true;
  // ... initialization code
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
document.addEventListener('astro:page-load', init);
```

**Why the guard?** Both `DOMContentLoaded` and `astro:page-load` can fire on page load, causing initialization code to run twice. The `initialized` flag ensures it only runs once.

## Reschedule & Cancellation

Users can reschedule or cancel appointments from the `/bookings` page.

### Rescheduling

**Flow:**
1. User clicks "تغيير الموعد" button on a booking card
2. Cal.com modal opens in reschedule mode via `config.rescheduleUid`
3. User selects new time slot
4. Cal.com redirects to `/landing/booking-complete` with new booking details

**Implementation:**
- Cal.com embed script loaded on `/bookings` page (namespace: `bookings`)
- `onReschedule` callback opens Cal.com modal with `rescheduleUid` config
- Same modal as new booking, but pre-populated with existing booking

### Cancellation

**Flow:**
1. User clicks "إلغاء" button on a booking card
2. Confirmation overlay appears: "هل تريد إلغاء هذا الحجز؟"
3. User confirms with "نعم، إلغاء الحجز"
4. API call to Cal.com cancel endpoint
5. Loading → Success/Error state shown
6. Card removed from list after success

**Key Discovery:** Cal.com cancel API works **without authentication** - just the booking UID is sufficient:
```bash
POST https://api.cal.com/v2/bookings/{bookingUid}/cancel
Headers: Content-Type: application/json, cal-api-version: 2024-08-13
Body: { "cancellationReason": "ألغاه المستخدم", "cancelSubsequentBookings": false }
```

**Implementation:**
- `BookingCardUtils.cancelBooking(cardId, bookingUid, onSuccess, onError)` utility function
- Direct client-side API call to Cal.com (no n8n webhook needed)
- UI states: confirmation overlay → loading → success/error

### BookingCard Options

```javascript
window.BookingCardUtils.initBookingCard(cardId, booking, {
  index: 1,                    // Position in list (optional)
  total: 3,                    // Total bookings (optional)
  showReschedule: true,        // Show reschedule button
  showCancel: true,            // Show cancel button
  onLocationClick: (isClinic, meetingUrl) => { ... },
  onReschedule: (booking) => { ... },   // Called when reschedule clicked
  onCancel: (booking) => { ... }        // Called when cancel confirmed
});
```

### Post-Booking Navigation

The `/landing/booking-complete` page shows "الذهاب إلى صفحة حجوزاتي" button after booking confirmation, allowing users to easily access the bookings management page.

## Future Enhancements

Planned features for the booking system:
- Booking history (past appointments)
- SMS reminders integration
- Multiple phone numbers per user
