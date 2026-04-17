# Analytics, Tracking & Ad Fraud Detection

## Background

The clinic website had zero online bookings after 6 months. PostHog instrumentation was added to diagnose where users drop off in the booking funnel and detect fraudulent ad traffic.

## PostHog Setup

- **Init:** `src/components/common/PosthogAnalytics.astro` — loads stub, initializes PostHog
- **Production only:** Skipped on `localhost`, `127.x.x.x`, `*.pages.dev` (staging)
- **Config:** `src/config.yaml` under `analytics.vendors.posthog` — project `116305`, EU API host
- **Global access:** `window.posthog?.capture()` safe everywhere — no-ops if not loaded
- **PostHog MCP:** `mcp__posthog__*` tools for querying data and managing insights. Use `query-run` to test, `insight-create` to save.

## User Identity Correlation

Frontend and backend events linked via phone number:
1. Frontend: `posthog.identify('+' + phone)` after phone verification
2. Backend: n8n fires `booking_completed` via PostHog capture API (`POST https://eu.i.posthog.com/i/v0/e/`) with same phone as `distinct_id`
3. PostHog merges both into one user journey

## Booking Funnel Events

### PhoneVerification.astro (V1)

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_phone_submitted` | "Send Code" clicked (before validation) | `phone_raw`, `phone_normalized`, `phone_length_*`, `country_prefix`, `is_jordan`, `method`, `booking_type` |
| `booking_phone_client_rejected` | Client-side `length < 10` rejects | `phone_raw`, `phone_normalized`, `phone_length_normalized`, `country_prefix`, `booking_type` |
| `booking_code_request_result` | After n8n send-code API response | `success`, `method`, `failure_reason`, `http_status`, `is_jordan`, `booking_type` |
| `booking_code_entered` | User submits 4-digit code | `booking_type` |
| `booking_code_result` | After verify-code API response | `success`, `booking_type` |
| `booking_verified` | Verification complete | `method`, `is_jordan`, `booking_type` |

### PhoneVerificationV2.astro (V2)

| Event | When | Key Properties |
|-------|------|----------------|
| `verify_v2_code_generated` | Code generated and shown to user | `booking_type` |
| `verify_v2_code_matched` | WhatsApp message matched the code | `booking_type` |
| `verify_v2_expired` | 5-minute code window expired | `booking_type` |

### book.astro

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_token_validated` | After stored JWT validation | `token_valid`, `booking_type` |
| `booking_cal_opened` | Cal.com embed modal opens | `booking_type`, `entry_point` |

### index.astro

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_cal_opened` | Cal.com opens from homepage | `booking_type`, `entry_point: "homepage"` |
| `whatsapp_cta_clicked` | WhatsApp button clicked | `layout: "mobile" \| "desktop"` |

### Backend (n8n)

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_completed` | n8n confirms booking on Cal.com | `distinct_id: phone` (PostHog node) |

### Helper Functions (PhoneVerification.astro)

- `getPhoneMetadata(rawInput, normalized)` — phone properties for events (full or masked)
- `categorizeSendCodeResponse(data, isNetworkError)` — maps Arabic n8n errors to: `success`, `invalid_number`, `landline`, `validation_failed`, `rate_limited`, `service_down`, `network_error`, `backoff`, `unknown`
- `getBookingType()` — reads `?type=` from URL

### Phone Privacy Flag

`MASK_PHONE_IN_ANALYTICS` in PhoneVerification.astro — `true` replaces digits with `X`. Currently **`false`** for diagnostics.

## Ad Fraud Detection

Lightweight tracker in `PosthogAnalytics.astro` — only activates for ad-attributed visits (has `utm_source`, `gclid`, or `fbclid`). Fires `ad_visit_engagement` on page leave.

| Property | Description |
|----------|-------------|
| `time_on_page_seconds` | Time before leaving |
| `has_scrolled` / `has_clicked` | Any interaction |
| `max_scroll_depth_pct` | 0-100 |
| `is_ghost_visit` | **<=5s, no scroll, no click** |
| `utm_*`, `gclid`, `fbclid` | Full attribution |
| `screen_width/height`, `device_pixel_ratio`, `is_touch_device` | Device info |

Zero overhead for organic visitors.

## PostHog Insights

### Booking (tag: `booking`)
1. [Booking Funnel (Unified V1+V2)](https://eu.posthog.com/project/116305/insights/68NeDfUQ) — Verification Started → Verification Completed → Cal.com → Booking Completed (broken down by `verification_method`: `v1` or `v2`)
2. [Phone Rejection Patterns](https://eu.posthog.com/project/116305/insights/37DxZVg8) — client-side rejections by `phone_raw`
3. [Backend Rejection Reasons](https://eu.posthog.com/project/116305/insights/AoncriXj) — backend failures by `failure_reason`
4. [WhatsApp Fallback](https://eu.posthog.com/project/116305/insights/0elBhZDK) — users who tried booking then clicked WhatsApp
5. [WhatsApp CTA Clicks](https://eu.posthog.com/project/116305/insights/BQio88Xu) — all WhatsApp clicks by mobile/desktop

### Ad Fraud (tags: `ads`, `fraud`)
6. [Ghost Visits by Source](https://eu.posthog.com/project/116305/insights/0wbhRUXg) — ghost vs total ad visits by `utm_source`
7. [Campaign Quality](https://eu.posthog.com/project/116305/insights/5R9uGT1W) — avg time on page per `utm_campaign`

## Content Security Policy

`public/_headers` defines CSP for Cloudflare Pages. Must whitelist:
- `*.google-analytics.com` (regional endpoints)
- `*.posthog.com`, `*.i.posthog.com`
- `*.cal.com` (embed subdomains)
- `n8n.orwa.tech`

If analytics or Cal.com break with "This content is blocked", check CSP first.
