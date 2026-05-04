# Meta Ads Management

## Overview

The clinic runs Meta (Facebook/Instagram) ads through a dedicated Meta App and a system user. This is **separate from** the Meta App that powers the n8n WhatsApp AI assistant — different apps, different system users, different WhatsApp numbers, different scopes. See "Two Meta Apps" below.

The ads infrastructure is managed primarily via the **Meta Marketing API** using `curl` from this repo. Tokens are loaded via `direnv` from `.envrc`.

## Two Meta Apps — Critical Distinction

There are **two independent Meta Apps** under the clinic business. They look similar from the outside but serve completely different purposes. Mixing them up is the most common source of confusion.

| | App 1: WhatsApp AI Assistant | App 2: Ads Management |
|---|---|---|
| **App name (Arabic)** | عيادة د. مؤمن ديرانية | تطبيق إعلانات |
| **App ID** | `25172580512336633` | `3937141059750735` |
| **Used by** | n8n workflows (WhatsApp AI assistant, verification, notifications) | API automation for ad campaigns from this repo |
| **System user ID** | `122133565809153336` | `122099406543298653` |
| **System user name** | `api` | `api` (different user, same name) |
| **WhatsApp number access** | The **automated WhatsApp number** that the n8n AI bot replies from | **Dr. Mu'men's personal verified WhatsApp Business number** (`+962 7 9913 3299`) |
| **Env var** | `WA_ACCESS_TOKEN` | `META_ACCESS_TOKEN` |
| **Token type** | System User token (long-lived, renewable) | System User token (never expires) |

### Why this distinction matters

- **Ads campaigns that send users to "click to WhatsApp" land in the AI bot's inbox** (App 1's WhatsApp number), not the doctor's personal one. That's by design — the AI handles intake, qualification, and verification before forwarding to the doctor.
- **The Ads Management app (App 2) has access to the doctor's personal WhatsApp number** via `whatsapp_business_management` and `whatsapp_business_messaging` scopes. We are **not** currently using these — but this opens a future possibility: building automation directly over the doctor's number (e.g. doctor-to-patient confirmations, post-visit follow-ups) without disturbing the AI bot's pipeline.
- Don't accidentally use `META_ACCESS_TOKEN` to send WhatsApp messages from the AI bot's number — it can't (it doesn't have access to that number). And vice versa.

### Resolving in code

Always pick the env var by purpose, not by guess:

- **Anything ad-related** (campaigns, ad sets, ads, insights, audiences, pixels, page management for ads) → `META_ACCESS_TOKEN`
- **Anything WhatsApp AI bot related** (sending messages from the bot, reading bot inbox, n8n flows) → `WA_ACCESS_TOKEN`

If a future workflow wants to message patients from the doctor's personal WhatsApp number programmatically, that uses `META_ACCESS_TOKEN` against WABA `111908905338065` and phone number ID `108275792371700` — but think hard before doing this; it bypasses the AI gatekeeper.

## Key IDs and Assets (App 2 — Ads Management)

| Asset | ID | Notes |
|---|---|---|
| Clinic Business Portfolio | `831302042036615` | "عيادة د. مؤمن ديرانية - أبو عبيدة الجرّاح" — owns all clinic assets |
| Clinic Facebook Page | `103923884978487` | Username: `Abuobaydatajjarrah`, ~3,389 followers, category: طبيب |
| Clinic Ad Account | `act_1260926961492067` | Created 2023-02-10, **trust tier 1**, USD currency, Asia/Amman timezone, ~$1,493 lifetime spend, funded by VISA *3095, capability `WHATSAPP_DESTINATION_ADS` |
| Clinic WABA | `111908905338065` | Doctor's personal verified WhatsApp Business |
| Doctor's WhatsApp Phone Number | `+962 7 9913 3299` (ID `108275792371700`) | Quality rating: GREEN, two-step verification: NOT yet enabled |
| Meta Pixel | `1689501578909850` | Created via API on 2026-05-04. Name: "عيادة د. مؤمن ديرانية - الموقع". First-party cookies enabled. Automatic Advanced Matching enabled (`em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country`). Owned by clinic business and ad account. **Only the Ads Management app's system user has access** — the WhatsApp AI app's system user gets `(#100) Missing perms` when reading it. See "Pixel ownership" below. |

### Pixel ownership — Pixels are NOT attached to Apps

A common confusion: with two apps in play, you'd expect the Pixel to "belong" to one of them. It doesn't. The Meta data model is:

- **Architectural ownership:** Pixels are owned by a **Business**, not an App. Our Pixel `1689501578909850` is owned by the clinic business `831302042036615`.
- **Practical access:** Each **system user** needs explicit "Manage Pixel" permission. The act of creating the Pixel via `META_ACCESS_TOKEN` automatically granted access to that token's system user (`122099406543298653`, the Ads app's `api` user). The WhatsApp AI app's system user (`122133565809153336`) has no permission on this Pixel and gets `Missing perms` if you try.
- **Frontend installation:** The `<script>` snippet on the website only contains the Pixel ID — no App ID, no token. The browser-side Pixel is app-agnostic.
- **Conversions API tokens:** When we send server-side events later, the token's *issuing app* is just an auth detail; events still land on the same Pixel. We'll typically use `META_ACCESS_TOKEN` since the Ads app's system user already has access.

**Future scenario:** if n8n needs to fire Meta Conversions API events (e.g., to feed Meta's optimizer with backend-confirmed bookings), we have two paths:
1. Use `META_ACCESS_TOKEN` from inside n8n for that specific call (cleanest — no permission changes needed)
2. Grant the WhatsApp AI app's system user explicit "Manage Pixel" permission on this Pixel via Business Settings → Data Sources → Pixels → People

Default to option 1 unless we have a strong reason to expand the WA app's surface area.
| Personal Business Portfolio | `727807634660959` | Orwa's personal business — separate, not used for clinic ads |

### Ad accounts to ignore

These exist in the system but are **not** the clinic ad account — don't accidentally target them:

- `act_3505689876247456` — Misplaced duplicate under personal business, status UNSETTLED, ignore
- `act_1033413165928220` — Personal account that received the €40 top-up. Not connected to a business. The €40 sits as credit; either spend it on a one-off personal ad later or request a refund. Not relevant to clinic campaigns.
- `act_1465354524548795` — Old personal account, PENDING_CLOSURE
- `act_979258678123013` / `act_2018819562037724` — Read-only test accounts, ignore

## App Capabilities and Permissions

`META_ACCESS_TOKEN` (System User token, never expires) currently has these scopes:

```
ads_management
ads_read
business_management
pages_show_list
pages_read_engagement
pages_manage_ads
whatsapp_business_management
whatsapp_business_messaging
whatsapp_business_manage_events
threads_business_basic
catalog_management
manage_app_solution
public_profile
```

Scopes intentionally **not granted yet** (request only when needed):

- `read_insights` — would help with reporting; add when we want richer audience analytics
- `instagram_basic` / `instagram_manage_*` — needed if we want to publish IG-specific ads or post to IG. Currently no IG account is linked to the clinic Page (worth fixing soon).
- `pages_messaging` / `pages_manage_metadata` / `pages_manage_posts` — for managing organic Page activity, not strictly needed for ads.
- `leads_retrieval` — needed only if we run lead-form ads (instant forms inside Meta).

## Meta App Approval State (App 2)

The Ads Management app went through Meta's review for these use cases. Current status:

| Use case | Status | Notes |
|---|---|---|
| Marketing API (إنشاء إعلانات وإدارتها) | **In progress** — needs **500 successful Marketing API calls at ≥85% success rate** to unlock Standard Access | Read-only audits and routine campaign management both count |
| Customer comms via WhatsApp (التواصل مع العملاء عبر واتساب) | Tests for `whatsapp_business_management` and `whatsapp_business_messaging` completed | Used `messages` endpoint with deliberately invalid `message_id` to register the call without sending |
| Threads API access | Skipped — not relevant to clinic | Can be added later if the doctor goes on Threads |

**Meta API call gotchas we hit during sandbox testing** (document these so we don't re-discover them):

1. **`is_adset_budget_sharing_enabled` is now mandatory** at campaign creation. Always set to `false` unless using campaign-level budget optimization (CBO).
2. **DSA disclosure (`dsa_beneficiary` and `dsa_payor`)** is required on any ad set targeting EU countries (and UK). Use `"عيادة د. مؤمن ديرانية"` for both.
3. **`location_types: ["home", "recent"]`** is auto-applied — this is what catches diaspora properly (someone whose declared home or recent activity is in the targeted country, not just current location).
4. **`effective_status: IN_PROCESS`** is the normal initial state for new ad sets — Meta validates even paused ones.
5. **`/me/businesses` returns empty for system users** — that's normal. System users have implicit access to their own business; the endpoint only lists *external* businesses.
6. **Page access tokens leak in `/me/accounts` responses** if you don't restrict `fields=` — Meta returns a Page token by default. Always pass `fields=id,name,...` explicitly.

## Historical Baseline

Before any campaigns built via this repo went live, the clinic ad account had ~28 months of boost-post history (31 campaigns, $1,493.59 lifetime spend, 557 historical Messenger conversations at $1.11 each). All 31 were paused on 2026-05-04 as part of an audit.

See **[context/meta-ads-baseline.md](meta-ads-baseline.md)** for the full per-objective breakdown, key benchmarks new campaigns need to beat, caveats on direct comparability, and the reproducible audit query.

## Initial Campaign Plan (likely to evolve)

This is the starting plan as of when ads were first set up via the API. The actual structure will change after we see real data — treat this section as an anchor point, not a contract.

### Pre-launch tasks (in order)

1. **Audit the ~25 existing ACTIVE campaigns** in `act_1260926961492067` — they were created during 2024 via the Boost-Post UI. We need to confirm none are silently spending money before launching new ones.
2. **Install Meta Pixel** on the website (`Layout.astro`) and configure standard events (`Lead`, `Contact`, `CompleteRegistration` for booking) so we can later run `OUTCOME_SALES` campaigns.
3. **Link Instagram Business** account to the clinic Page (UI step in Page settings) so IG placements are available.
4. **Enable two-step verification** on the doctor's WhatsApp phone number (currently `code_verification_status: NOT_VERIFIED`) — defensive, prevents number hijacking.

### Campaign 1: Jordan / Click to WhatsApp

- **Objective:** `OUTCOME_ENGAGEMENT` with `destination_type=WHATSAPP`
- **Targeting:** Jordan, Arabic locale (`28`), age 25–65+
- **Goal:** Drive WhatsApp conversations to the **AI bot's number** (App 1's WABA), where the AI handles initial intake and routes hot leads to the doctor.
- **Budget:** Start at 5 JOD/day per ad set. Run ≥7 days before judgment.
- **Pre-filled WhatsApp message:** "السلام عليكم، أرغب بالاستفسار" — gives the AI a clean intent signal.
- **DSA fields:** Not required (no EU targeting).

### Campaign 2: Diaspora 35+ / Site Traffic → Remote Booking

- **Objective:** `OUTCOME_TRAFFIC` initially; switch to `OUTCOME_SALES` once Pixel + booking events accumulate ~30–50/week.
- **Targeting:** Worldwide *excluding* Jordan, with explicit inclusion of GCC + Western diaspora hubs (SA, AE, KW, QA, DE, US, CA, GB), behavior `Expats (Jordan)`, age 35–65+, Arabic locale.
- **Destination:** `https://abuobaydatajjarrah.com/book?type=remote` with UTM tags (`utm_source=meta&utm_medium=paid&utm_campaign=diaspora_remote&utm_content=<creative-id>`).
- **DSA fields:** `dsa_beneficiary` and `dsa_payor` both `"عيادة د. مؤمن ديرانية"` (mandatory for DE/GB targeting).
- **Budget:** Start at 5–10 JOD/day. CPM is higher in GCC/Western markets; expect fewer impressions per dinar than Jordan-targeted ads.
- **Creative angle:** "استشر طبيبك من أي مكان في العالم" — emphasize the convenience of not needing to fly home.

### Campaign measurement

All ads must use UTM tags. PostHog already handles client-side attribution via `ad_visit_engagement` events (see `context/analytics-and-tracking.md`). After Pixel installation, we'll have parallel server-side attribution, allowing reconciliation between Meta-reported conversions and our own funnel data.

The booking-completed event fires from n8n via PostHog server-side API today. Once Meta Pixel is installed, we'll add a parallel client-side `Purchase` or `Lead` event on `/landing/booking-complete` to feed Meta's optimizer.

## Working with the API from this repo

Tokens load via `direnv exec .` — the `.envrc` is gitignored. Common patterns:

```bash
# Read clinic ad account
direnv exec . sh -c 'curl -s -G "https://graph.facebook.com/v21.0/act_1260926961492067" \
  --data-urlencode "access_token=$META_ACCESS_TOKEN" \
  --data-urlencode "fields=id,name,balance,amount_spent"'

# List campaigns
direnv exec . sh -c 'curl -s -G "https://graph.facebook.com/v21.0/act_1260926961492067/campaigns" \
  --data-urlencode "access_token=$META_ACCESS_TOKEN" \
  --data-urlencode "fields=id,name,objective,status,effective_status"'

# Pull last-30-days insights for a campaign
direnv exec . sh -c 'curl -s -G "https://graph.facebook.com/v21.0/<CAMPAIGN_ID>/insights" \
  --data-urlencode "access_token=$META_ACCESS_TOKEN" \
  --data-urlencode "date_preset=last_30d" \
  --data-urlencode "fields=spend,impressions,clicks,actions,cpm,ctr"'
```

**Never paste `META_ACCESS_TOKEN` into chat or commit it.** It's a never-expiring system user token with full ad/business management scope — leakage means someone else can spend the clinic's money.

## Sandbox

A separate sandbox ad account (`act_975128028405970`, EUR, Amsterdam, "New Sandbox Ad Account") exists for testing. No charges are billed against the sandbox. Use it for any structural experiments before touching `act_1260926961492067`.
