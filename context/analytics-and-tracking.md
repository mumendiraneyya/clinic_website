# Analytics, Tracking & Ad Fraud Detection

## Background & Goals

The clinic website had **zero online bookings** after 6 months live. PostHog session recordings showed users attempting to enter phone numbers but getting rejected. Privacy masking hid what was typed, and numbers rejected by client-side validation never reached the n8n backend — creating a complete blind spot.

Additionally, Google display ads were generating fraudulent traffic: accidental clicks from gaming devices that inflate visit counts and waste ad budget.

**Goals:**
1. Instrument the entire booking funnel to diagnose where and why users drop off
2. Detect and quantify fraudulent/low-quality ad traffic
3. Track WhatsApp CTA usage as a fallback engagement signal
4. Correlate frontend sessions with backend booking completions via phone number identity

## Architecture

### PostHog Setup

- **Init:** `src/components/common/PosthogAnalytics.astro` loads the PostHog stub and initializes it
- **Production only:** PostHog is skipped on `localhost`, `127.x.x.x`, and `*.pages.dev` (staging)
- **Config:** `src/config.yaml` under `analytics.vendors.posthog` — project ID, EU API host
- **Global access:** `window.posthog` is available on all pages (production); `window.posthog?.capture()` is safe everywhere since it no-ops if PostHog isn't loaded
- **CSP:** The `public/_headers` file must whitelist `*.posthog.com`, `*.i.posthog.com`, `*.google-analytics.com`, and `*.cal.com` in `connect-src` and `frame-src` — otherwise the browser blocks analytics and Cal.com embed requests

### MCP Tools

- **PostHog MCP** (`mcp__posthog__*`): Query data, create/update insights, manage dashboards. Use for creating funnels, trends, and alerts. Project ID: `116305`.
- **n8n MCP** (`mcp__n8n-mcp__*`): Inspect and modify backend workflows. The phone verification workflow ID is `dwv7rpf8uHxyum02`. Use `get_workflow_details` to inspect webhook responses and validation logic. **Limitation:** `update_workflow` replaces the entire workflow via SDK code — too risky for large workflows. For targeted node changes, guide the user to edit in the n8n UI instead.
- **Chrome DevTools MCP** (`mcp__chrome-devtools__*`): Test events locally by checking browser console for `posthog.capture` calls.

### User Identity Correlation

Frontend and backend events are linked via phone number:
1. **Frontend:** After phone verification succeeds, `posthog.identify('+' + phone)` links the anonymous browser session to the phone number
2. **Backend:** n8n fires `booking_completed` via PostHog's server-side capture API (`POST https://eu.i.posthog.com/i/v0/e/`) with `distinct_id` set to the same phone number (e.g., `+962791234567`)
3. **PostHog** merges both into one user journey, enabling end-to-end funnel analysis from first page visit to confirmed booking

## Booking Funnel Events

### Frontend Events (3 files)

Helper functions live in `PhoneVerification.astro`'s `<script>` block.

#### Events in `src/components/booking/PhoneVerification.astro`

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_phone_submitted` | User clicks "Send Code" (BEFORE validation) | `phone_raw`, `phone_normalized`, `phone_length_*`, `country_prefix`, `is_jordan`, `method`, `booking_type` |
| `booking_phone_client_rejected` | Client-side `length < 10` rejects | `phone_raw`, `phone_normalized`, `phone_length_normalized`, `country_prefix`, `booking_type` |
| `booking_code_request_result` | After n8n send-code API response | `success`, `method`, `failure_reason`, `http_status`, `is_jordan`, `booking_type` |
| `booking_code_entered` | User submits 4-digit code | `booking_type` |
| `booking_code_result` | After verify-code API response | `success`, `booking_type` |
| `booking_verified` | Verification complete, token received | `method`, `is_jordan`, `booking_type` |

After `booking_verified`, `posthog.identify('+' + phone)` is called to link the session.

#### Events in `src/pages/book.astro`

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_token_validated` | After stored JWT validation | `token_valid`, `booking_type` |
| `booking_cal_opened` | Cal.com embed modal opens | `booking_type`, `entry_point: "book_page"` |

#### Events in `src/pages/index.astro`

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_cal_opened` | Cal.com opens from homepage popup | `booking_type`, `entry_point: "homepage"` |
| `whatsapp_cta_clicked` | WhatsApp button clicked | `layout: "mobile" \| "desktop"` |

### Backend Event (n8n workflow)

| Event | When | Key Properties |
|-------|------|----------------|
| `booking_completed` | n8n confirms booking on Cal.com | `distinct_id: phone` (fired via PostHog server-side API using n8n's PostHog node) |

This fires after the "Confirm Booking on Cal.com" → "Invoke Booking Creation Webhook" chain in the verification workflow. The `distinct_id` is `+{phone}` from the JWT payload, matching what the frontend used in `posthog.identify()`.

### Helper Functions (PhoneVerification.astro)

- `getPhoneMetadata(rawInput, normalized)` — Returns phone properties for events (full or masked depending on flag)
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
1. **[Booking Funnel (Full)](https://eu.posthog.com/project/116305/insights/LGUWwM9U)** — 5-step funnel: Phone Submitted → Code Sent (success) → Phone Verified → Cal.com Opened → Booking Completed
2. **[Phone Rejection Patterns](https://eu.posthog.com/project/116305/insights/37DxZVg8)** — Client-side rejections broken down by `phone_raw`
3. **[Backend Phone Rejection Reasons](https://eu.posthog.com/project/116305/insights/AoncriXj)** — Backend failures broken down by `failure_reason`

### Ad Fraud (tags: `ads`, `fraud`)
4. **[Ad Fraud: Ghost Visits by Source](https://eu.posthog.com/project/116305/insights/0wbhRUXg)** — Ghost visits vs total ad visits by `utm_source`
5. **[Ad Campaign Quality: Avg Time on Page](https://eu.posthog.com/project/116305/insights/5R9uGT1W)** — Avg time on page per `utm_campaign`

## n8n Backend Services

### Local Services (systemd unit on n8n server)

After n8n 2.15.1 removed `n8n-nodes-base.executeCommand` and `n8n-nodes-base.localFileTrigger`, a standalone Node.js HTTP service was created to handle operations that require shell access or external libraries.

**Location:** `/root/dads-clinic-backup/service/` on the n8n server
**Managed by:** systemd service `clinic-service.service`
**Listens on:** `127.0.0.1:3847` (localhost only, not exposed externally)

#### Endpoints

**POST `/validate`** — Phone number validation using `google-libphonenumber`
- Input: `{ "phone": "962791234567" }` (no leading `+`)
- Output: `{ "success": true, "phone": "+962791234567", "isValid": true, "isMobile": true, "message": 1 }`
- Detects mobile vs landline, validates international number formats
- Called by the n8n verification workflow's "Validate Phone Number" HTTP Request node
- **Why standalone:** `google-libphonenumber` can't be installed inside n8n (dependency conflicts, removed on n8n updates)

**POST `/send-sms`** — Async SMS sending via SSH to Termux phones
- Input: `{ "phone": "+962791234567", "message": "Your code is 1234" }`
- Output: `{ "success": true, "queued": true }` (returns immediately)
- In the background: tries all 3 phones in parallel (`doctor.termux`, `assistant.termux`, `doctor2.termux`) with 10-second timeouts via SSH
- Logs results to `/root/dads-clinic-queues/sms.log`
- Called by the n8n verification workflow's "Send SMS Using Service" HTTP Request node
- **Why async:** Sequential SSH with 30s timeouts per phone was blocking the n8n workflow for up to 90 seconds

#### Setup & Maintenance

```bash
# On the n8n server:
cd /root/dads-clinic-backup/service
bash setup.sh    # npm install, install/restart systemd service
systemctl status service   # check status
journalctl -u service -f   # view logs
```

### n8n Workflow Changes (post-2.15.1 upgrade)

**Removed node types and replacements:**
- `n8n-nodes-base.executeCommand` → HTTP Request to `localhost:3847` or Code nodes
- `n8n-nodes-base.localFileTrigger` → No longer needed (queues moved to n8n data tables)

**Verification workflow** (`dwv7rpf8uHxyum02`):
- Phone validation: 3-node executeCommand chain → single HTTP Request to `/validate` + Set node
- SMS sending: executeCommand with SSH → HTTP Request to `/send-sms` (async)
- Telegram notifications: executeCommand writing to CSV → Execute Workflow calling "Dads Clinic-Send Telegram Messages" subflow (`C2F9UQOSqoWTqCg8`)
- Message queues: CSV files → n8n data tables (table `message_queue`, ID: `iPhhvNECkVRm88Ia`)
- Booking completion: PostHog node fires `booking_completed` with phone as `distinct_id`

**Telegram subflow** (`C2F9UQOSqoWTqCg8`):
- Receives `telegram_recepients` (array) + `notification_message` (string)
- Maps phone numbers to Telegram chat IDs via a Code node
- Sends via Telegram node with `appendAttribution: false`
- Created via n8n MCP `update_workflow` (small enough to safely replace via SDK)

**WhatsApp Webhook** (`XlYzvScd6xm3xlBI`):
- Receives incoming WhatsApp messages via `n8n-nodes-base.whatsAppTrigger`
- Currently echoes raw payload to Telegram (tech support chat `211021550`)
- **Important:** The WhatsApp Trigger node auto-registers its production webhook URL with Meta via the API when the workflow is activated. You never need to manually configure the webhook URL in Meta's dashboard. The "test URL" feature in the n8n editor is for development only — to return to production mode, deactivate and reactivate the workflow.

### SMS Gateway Architecture

Android phones running Termux act as SMS gateways. They connect to the n8n server via reverse SSH tunnels through a VPS (`213.165.86.237`).

| SSH Name | Phone Number | Tunnel Port | Status |
|----------|-------------|-------------|--------|
| `doctor.termux` | +962799133299 | 8024 | Active |
| `assistant.termux` | +962798872899 | 8023 | Active |
| `doctor2.termux` | +962799486661 | — | Active |

Setup script: `sms-gateway/setup.sh` in the parent `dads-clinic` repo.
SMS sending script on each phone: `~/send_sms.sh` (handles Arabic/non-Arabic segmentation, SIM selection, multi-part messages).

## Content Security Policy

The `public/_headers` file defines CSP headers for Cloudflare Pages. When external services add new subdomains (e.g., Google Analytics regional endpoints, Cal.com embed subdomains), the CSP must be updated or browsers will block requests silently.

**Current allowlist includes:**
- `*.google-analytics.com` (covers regional endpoints like `region1.`)
- `*.posthog.com`, `*.i.posthog.com`
- `*.cal.com` (covers embed subdomains)
- `n8n.orwa.tech`

If Cal.com or analytics suddenly break with "This content is blocked" errors, check `public/_headers` CSP first.

## Files Modified

| File | What was added |
|------|---------------|
| `src/components/common/PosthogAnalytics.astro` | Production-only gate, ad engagement tracker |
| `src/components/booking/PhoneVerification.astro` | 6 booking funnel events, helper functions, `posthog.identify(phone)` |
| `src/pages/book.astro` | Token validation + Cal.com opened events |
| `src/pages/index.astro` | Cal.com opened event, WhatsApp CTA tracking |
| `public/_headers` | CSP wildcards for Google Analytics, Cal.com subdomains |
