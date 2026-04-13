# Analytics, Tracking & Ad Fraud Detection

## Background & Goals

The clinic website had **zero online bookings** after 6 months live. PostHog session recordings showed users attempting to enter phone numbers but getting rejected. Privacy masking hid what was typed, and numbers rejected by client-side validation never reached the n8n backend — creating a complete blind spot.

Additionally, Google display ads were generating fraudulent traffic: accidental clicks from gaming devices that inflate visit counts and waste ad budget.

**Goals:**
1. Instrument the entire booking funnel to diagnose where and why users drop off
2. Detect and quantify fraudulent/low-quality ad traffic
3. Track WhatsApp CTA usage as a fallback engagement signal

## Architecture

### PostHog Setup

- **Init:** `src/components/common/PosthogAnalytics.astro` loads the PostHog stub and initializes it
- **Production only:** PostHog is skipped on `localhost`, `127.x.x.x`, and `*.pages.dev` (staging)
- **Config:** `src/config.yaml` under `analytics.vendors.posthog` — project ID, EU API host
- **Global access:** `window.posthog` is available on all pages (production); `window.posthog?.capture()` is safe everywhere since it no-ops if PostHog isn't loaded

### MCP Tools

- **PostHog MCP** (`mcp__posthog__*`): Query data, create/update insights, manage dashboards. Use for creating funnels, trends, and alerts. Project ID: `116305`.
- **n8n MCP** (`mcp__n8n-mcp__*`): Inspect and modify backend workflows. The phone verification workflow ID is `dwv7rpf8uHxyum02`. Use `get_workflow_details` to inspect webhook responses and validation logic.
- **Chrome DevTools MCP** (`mcp__chrome-devtools__*`): Test events locally by checking browser console for `posthog.capture` calls.

## Booking Funnel Events

All booking events are in 3 files. Helper functions live in `PhoneVerification.astro`'s `<script>` block.

### Events in `src/components/booking/PhoneVerification.astro`

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_phone_submitted` | User clicks "Send Code" (BEFORE validation) | `phone_raw`, `phone_normalized`, `phone_length_*`, `country_prefix`, `is_jordan`, `method`, `booking_type` |
| `booking_phone_client_rejected` | Client-side `length < 10` rejects | `phone_raw`, `phone_normalized`, `phone_length_normalized`, `country_prefix`, `booking_type` |
| `booking_code_request_result` | After n8n send-code API response | `success`, `method`, `failure_reason`, `http_status`, `is_jordan`, `booking_type` |
| `booking_code_entered` | User submits 4-digit code | `booking_type` |
| `booking_code_result` | After verify-code API response | `success`, `booking_type` |
| `booking_verified` | Verification complete, token received | `method`, `is_jordan`, `booking_type` |

### Events in `src/pages/book.astro`

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_token_validated` | After stored JWT validation | `token_valid`, `booking_type` |
| `booking_cal_opened` | Cal.com embed modal opens | `booking_type`, `entry_point: "book_page"` |

### Events in `src/pages/index.astro`

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_cal_opened` | Cal.com opens from homepage popup | `booking_type`, `entry_point: "homepage"` |
| `whatsapp_cta_clicked` | WhatsApp button clicked | `layout: "mobile" \| "desktop"` |

### Helper Functions (PhoneVerification.astro)

- `getPhoneMetadata(rawInput, normalized)` — Returns privacy-safe (or full) phone properties for events
- `categorizeSendCodeResponse(data, isNetworkError)` — Maps Arabic n8n error messages to enum: `success`, `invalid_number`, `landline`, `validation_failed`, `rate_limited`, `service_down`, `network_error`, `backoff`, `unknown`
- `getBookingType()` — Reads `?type=` from URL

### Phone Privacy Flag

`MASK_PHONE_IN_ANALYTICS` (boolean, in PhoneVerification.astro `<script>` block) — when `true`, replaces digits with `X` in `phone_raw` and `phone_normalized`. Currently **`false`** to diagnose input issues. Flip to `true` when no longer needed.

### Backend Failure Reason Mapping

The n8n "Verify Phone Number" workflow returns Arabic error messages. The `categorizeSendCodeResponse` function maps them:

| Arabic substring | `failure_reason` |
|-----------------|-----------------|
| `أرضي` | `landline` |
| `غير صحيح` | `invalid_number` |
| `لم نتمكن` | `validation_failed` |
| `الكثير من طلبات` | `rate_limited` |
| `متعطلة` | `service_down` |
| (network error) | `network_error` |
| (other message) | `backoff` |
| (no message) | `unknown` |

## Ad Fraud Detection

### Engagement Tracker (`PosthogAnalytics.astro`)

A lightweight script that **only activates for ad-attributed visits** (URL contains `utm_source`, `gclid`, or `fbclid`). Fires a single `ad_visit_engagement` event when the visitor leaves.

| Property | Type | Description |
|----------|------|-------------|
| `time_on_page_seconds` | number | Time before leaving |
| `has_scrolled` | boolean | Any scroll at all |
| `has_clicked` | boolean | Any click at all |
| `max_scroll_depth_pct` | number | 0-100, how far they scrolled |
| `is_ghost_visit` | boolean | **<=5 seconds AND no scroll AND no click** |
| `utm_source/medium/campaign/term/content` | string | Full UTM attribution |
| `gclid` | string | Google Ads click ID |
| `fbclid` | string | Facebook click ID |
| `referrer` | string | Full referrer URL |
| `referring_domain` | string | Referrer hostname |
| `landing_page` | string | Path user landed on |
| `screen_width/height` | number | Device screen dimensions |
| `device_pixel_ratio` | number | Helps identify device type |
| `is_touch_device` | boolean | Touch = likely phone/tablet/gaming device |

**Zero overhead for organic visitors** — the tracker exits immediately if no ad params are present.

## PostHog Insights (Saved Dashboards)

All insights are favorited and tagged for easy access:

### Booking (tag: `booking`)
1. **[Booking Funnel](https://eu.posthog.com/project/116305/insights/BI92mAFU)** — 5-step funnel: Phone Submitted → Code Sent (success) → Code Entered → Verified → Cal.com Opened
2. **[Phone Rejection Patterns](https://eu.posthog.com/project/116305/insights/37DxZVg8)** — Client-side rejections broken down by `phone_raw`
3. **[Backend Phone Rejection Reasons](https://eu.posthog.com/project/116305/insights/AoncriXj)** — Backend failures broken down by `failure_reason`

### Ad Fraud (tags: `ads`, `fraud`)
4. **[Ad Fraud: Ghost Visits by Source](https://eu.posthog.com/project/116305/insights/0wbhRUXg)** — Ghost visits vs total ad visits by `utm_source`
5. **[Ad Campaign Quality: Avg Time on Page](https://eu.posthog.com/project/116305/insights/5R9uGT1W)** — Avg time on page per `utm_campaign`

## Files Modified

| File | What was added |
|------|---------------|
| `src/components/common/PosthogAnalytics.astro` | Production-only gate, ad engagement tracker |
| `src/components/booking/PhoneVerification.astro` | 6 booking funnel events + helper functions |
| `src/pages/book.astro` | Token validation + Cal.com opened events |
| `src/pages/index.astro` | Cal.com opened event + WhatsApp CTA tracking |
