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
| Instagram Business Account | `17841475544523609` (`@dr.mumen.diraneyya`) | Linked to clinic Page on 2026-05-05 by converting the doctor's IG to Business and connecting from Page → Linked Accounts. Business asset wrapper ID `760323957153973` (different from the underlying IG ID — see "Instagram linkage" below). Required for IG ad placements. |
| Personal Business Portfolio | `727807634660959` | Orwa's personal business — separate, not used for clinic ads |

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

### Instagram linkage — what it took

This was the most painful part of the whole setup. Document so we never re-discover it.

**The state we wanted:** Campaign 1's ads should serve on both Facebook AND Instagram placements (Stories, Reels, Feed) using `@dr.mumen.diraneyya` as the IG presence.

**The state we found:** The doctor had a personal Instagram account, completely independent. Not converted to Business. Not linked to the FB Page. Not visible to Business Manager.

**The Page-Backed Instagram Account (PBIA) trap:** Meta auto-creates a "Page-Backed Instagram Account" for any Page without a real linked IG (in our case PBIA was `17841445435602961`). It sounds like it would solve the problem — but it doesn't. Meta accepts the PBIA via `page_backed_instagram_accounts` API field, but **rejects it as `instagram_user_id` for ad creatives** with `(#100) Param instagram_user_id must be a valid Instagram account id`. Lesson: PBIA is for Page-side organic Instagram cross-posting, NOT for ads. For ads you need a real linked IG Business Account.

**The full sequence of steps required** (each one was a hidden gate we hit individually):

1. **Convert IG to Business in the IG mobile app.** Profile → ☰ → Settings and activity → For professionals → Account type and tools → Switch to professional account → pick category (e.g., "Doctor") → pick **Business** (not Creator).
2. **Connect IG to the Facebook Page.** Critical: do this from the **Facebook Page** side, not from inside the IG conversion flow (the IG flow's "Connect to Facebook" step often fails silently). Path: open the Page in browser → Settings → **Linked accounts → Instagram → Connect Account**. Log in with the IG credentials.
3. **Add the IG account to Business Manager assets.** From `business.facebook.com/settings → Accounts → Instagram accounts → Add → Connect Instagram account`.
4. **Grant the System User access to the IG asset.** Same UI: click the IG asset → Add People → System Users tab → select `api` → grant "Manage Instagram account".
5. **Regenerate the System User token with `instagram_basic` scope.** This is the step everyone forgets. Asset access ≠ token scope. Tokens are locked at generation time. Even if the System User has access to the IG asset, an existing token without `instagram_basic` will return empty data when querying IG fields.

**Two IDs, one Instagram account:** Once linked, querying surfaces two different IDs that get confused:
- **Business asset wrapper ID** (`760323957153973` for us): what Business Manager UI shows. Useful nowhere in the Marketing API. If you query this ID without specifying fields you get back `{ig_user_id, ig_username, id}` — the wrapper exposes the underlying IG ID.
- **Underlying IG Business Account ID** (`17841475544523609` for us, prefixed with `17841...`): the real Instagram account ID. This is what you pass to ad creatives as `instagram_user_id`.

**Field name gotcha:** `instagram_actor_id` is **deprecated** in current API versions. Meta returns `(#100) Param instagram_actor_id must be a valid Instagram account id` even when the ID *is* valid. Use `instagram_user_id` instead.

**Token scope reality:** As of writing, our token still lacks `instagram_basic` (regenerating it as instructed didn't include the scope, possibly because the app itself didn't declare needing it). **Ads still work** — referencing an IG ID in `instagram_user_id` doesn't require read access to the IG account. The scope only matters if we want to *read* IG insights, captions, follower counts, etc. Add it later when needed.

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
- `instagram_basic` — IG is now linked (`@dr.mumen.diraneyya`), but the token still lacks this scope (the app didn't declare it as a use case at app-creation time, so it doesn't appear as a tickable option in the token generator). Ads still serve on IG correctly because `instagram_user_id` doesn't require it; this scope only matters when we want to *read* IG account fields, captions, follower counts, insights, etc. Add when needed.
- `instagram_manage_insights` — for IG ad-performance analytics specifically.
- `pages_messaging` / `pages_manage_metadata` / `pages_manage_posts` — for managing organic Page activity, not strictly needed for ads.
- `leads_retrieval` — needed only if we run lead-form ads (instant forms inside Meta).

## Meta App Approval State (App 2)

The Ads Management app went through Meta's review for these use cases. Current status:

| Use case | Status | Notes |
|---|---|---|
| Marketing API (إنشاء إعلانات وإدارتها) | **In progress** — needs **500 successful Marketing API calls at ≥85% success rate** to unlock Standard Access | Read-only audits and routine campaign management both count |
| Customer comms via WhatsApp (التواصل مع العملاء عبر واتساب) | Tests for `whatsapp_business_management` and `whatsapp_business_messaging` completed | Used `messages` endpoint with deliberately invalid `message_id` to register the call without sending |
| Threads API access | Skipped — not relevant to clinic | Can be added later if the doctor goes on Threads |

**Meta API call gotchas we hit** (document these so we don't re-discover them):

1. **`is_adset_budget_sharing_enabled` is now mandatory** at campaign creation. Always set to `false` unless using campaign-level budget optimization (CBO). Error subcode `4834011`.
2. **DSA disclosure (`dsa_beneficiary` and `dsa_payor`)** is required on any ad set targeting EU countries (and UK). Use `"عيادة د. مؤمن ديرانية"` for both. Error subcode `3858081`.
3. **`location_types: ["home", "recent"]`** is auto-applied — this is what catches diaspora properly (someone whose declared home or recent activity is in the targeted country, not just current location).
4. **`effective_status: IN_PROCESS`** is the normal initial state for new ad sets / ads — Meta validates even paused ones. Becomes `PAUSED` once review completes.
5. **`/me/businesses` returns empty for system users** — that's normal. System users have implicit access to their own business; the endpoint only lists *external* businesses.
6. **Page access tokens leak in `/me/accounts` responses** if you don't restrict `fields=` — Meta returns a Page token by default. Always pass `fields=id,name,...` explicitly.
7. **`degrees_of_freedom_spec.standard_enhancements` is deprecated.** Setting `enroll_status: OPT_OUT` returns error subcode `3858504`. Either omit `degrees_of_freedom_spec` entirely (lets Meta defaults apply) or use individual feature toggles per the new schema.
8. **`video_feeds` Facebook position is deprecated** in current API versions. Returns error subcode `2490562` if specified in `targeting.facebook_positions`. Use `feed`, `marketplace`, `story`, `facebook_reels` instead.
9. **`instagram_actor_id` is deprecated**; current API requires `instagram_user_id` in `object_story_spec`. Same param semantics, just renamed.
10. **PBIA (Page-Backed Instagram Account) cannot be used as `instagram_user_id`** — Meta accepts it as a Page-side construct but rejects it for ad creatives. A real linked IG Business Account is mandatory for IG ad placements.
11. **Business asset wrapper IDs ≠ underlying asset IDs.** Meta Business Manager surfaces wrapper IDs (e.g., `760323957153973` for an IG account) which look like real IDs but aren't. Querying a wrapper ID with no fields returns `{ig_user_id, ig_username, id}` revealing the underlying ID (`17841...`). Always use the underlying ID in Marketing API calls.
12. **Token scopes are locked at generation time.** Granting a System User access to a new asset (e.g., IG account) does *not* update existing tokens. You must regenerate the token, ticking the relevant scope (`instagram_basic`, etc.), to actually use the new asset's read endpoints. Write/reference operations sometimes work without the scope (e.g., `instagram_user_id` in ad creatives works without `instagram_basic`).
13. **The token generator's scope picker only shows scopes the app itself has declared.** If `instagram_basic` doesn't appear as a tickable option when generating a System User token, the app needs to add the scope first via App Dashboard → Permissions and Features → Add → search the scope name.
14. **Wait for `video_status: ready` before referencing uploaded videos in creatives.** Polling `/{video_id}?fields=status` is the safest way; `processing_phase.status: complete` and `publishing_phase.status: complete` both need to be reached.
15. **Page-Backed Instagram Account ID** for our Page is `17841445435602961` — distinct from the real linked IG ID `17841475544523609`. Don't confuse them.

## Historical Baseline

Before any campaigns built via this repo went live, the clinic ad account had ~28 months of boost-post history (31 campaigns, $1,493.59 lifetime spend, 557 historical Messenger conversations at $1.11 each). All 31 were paused on 2026-05-04 as part of an audit.

See **[context/meta-ads-baseline.md](meta-ads-baseline.md)** for the full per-objective breakdown, key benchmarks new campaigns need to beat, caveats on direct comparability, and the reproducible audit query.

## Initial Campaign Plan (likely to evolve)

This is the starting plan as of when ads were first set up via the API. The actual structure will change after we see real data — treat this section as an anchor point, not a contract.

### Pre-launch tasks (status as of 2026-05-05)

1. ✅ **Audit existing ACTIVE campaigns** — done 2026-05-04. Found 31 zombie boost-posts, all paused; baseline frozen in [meta-ads-baseline.md](meta-ads-baseline.md).
2. ✅ **Install Meta Pixel** — done 2026-05-04. Pixel `1689501578909850` live on the site. Fires `PageView`, `Contact` (WhatsApp CTA), `InitiateCheckout` (Cal.com open), `Schedule` (booking confirmed).
3. ✅ **Link Instagram Business account** — done 2026-05-05. `@dr.mumen.diraneyya` (`17841475544523609`) linked to clinic Page. See "Instagram linkage" section above for the painful sequence of steps required.
4. ⬜ **Enable two-step verification** on the doctor's WhatsApp phone number (`code_verification_status: NOT_VERIFIED`) — defensive, prevents number hijacking. Low priority but worth doing.

### Campaign 1: Jordan / Click-to-WhatsApp — LIVE since 2026-05-05

**The campaign is running.** Original plan was to route to the AI bot's number; **decision changed** during setup to use the doctor's verified number directly so messages land in the same inbox the doctor checks (`+962 7 9913 3299`, phone ID `108275792371700`). The AI bot remains the n8n-side fallback for organic WhatsApp messages, but ad-driven traffic goes straight to the doctor for direct attribution in Meta Business Suite Inbox.

**IDs (as of launch):**
- Campaign: `120245104755200304` — `[١] الأردن — رسائل واتساب — Concept B`
- Ad Set: `120245104757340304` — `أردن — عام — ٢٥-٦٥+ — واتساب`
- Ads: `120245105540190304` (V1, 33s) / `120245105542850304` (V2, 38s) / `120245105544520304` (V3, 45s)

**Configuration:**
- Objective: `OUTCOME_ENGAGEMENT` with `destination_type=WHATSAPP`
- Optimization: `CONVERSATIONS` (not link clicks — direct apples-to-apples with the $1.11 historical Messenger conversation baseline)
- `promoted_object`: `{page_id: "103923884978487", whatsapp_phone_number: "+962799133299"}`
- Budget: $5 USD/day, daily, `LOWEST_COST_WITHOUT_CAP` bid strategy
- Targeting: Jordan only, age 25-65, Arabic locale (`28`), no interest narrowing, `location_types: [home, recent]` (auto)
- Placements: FB feed/marketplace + IG stream/explore for 1:1 videos; FB story/facebook_reels + IG story/reels for 9:16 videos
- DSA fields: Not required (no EU targeting).
- Pre-filled WhatsApp message: `السلام عليكم، أرغب بالاستفسار`

**Creative test design:** Three videos (Concept B = "specific condition"), each in two aspect ratios (1:1 + 9:16), placement-customized via `asset_feed_spec.asset_customization_rules`. Same primary text + headline across all 3 — independent variable is video content only.

**Meta UI optimizations accepted:** Some AI-suggested optimizations were enabled via the Ads Manager UI after launch (e.g., Advantage placements, dynamic creative refinements). These don't appear in the API spec we created — Meta layers them on top. This is fine; they generally improve delivery.

**What to do at the 7-day mark:** pull per-ad insights and compare V1 / V2 / V3 cost-per-conversation; pause the laggards. Reproducible query template in "Working with the API" below.

**What to do at the 14-day mark:** total cost-per-conversation vs. the $1.11 Messenger baseline. If we beat it, increase budget gradually (no more than 20% per change to avoid resetting learning phase). If we don't, examine creative angle and audience.

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

## Creative setup pattern (multi-aspect video CTWA ads)

The full sequence we used for Campaign 1, recorded as a runbook for the next time. **Upstream of this:** see [ad-video-production.md](ad-video-production.md) for how the 1:1 and 9:16 video files are produced from a source interview using ffmpeg + auto-editor.

**1. Upload videos** to the ad account (one POST per file, multipart):
```bash
direnv exec . sh -c 'curl -s -X POST "https://graph.facebook.com/v21.0/act_1260926961492067/advideos" \
  -F "access_token=$META_ACCESS_TOKEN" \
  -F "source=@/path/to/video.mp4" \
  -F "title=concept_v1_1x1"'
```
Returns `{"id": "<video_id>"}`. Repeat for each aspect ratio of each concept (e.g., 3 concepts × 2 ratios = 6 videos).

**2. Wait for processing**. Poll until `video_status: ready`:
```bash
curl -s -G "https://graph.facebook.com/v21.0/<video_id>" \
  --data-urlencode "access_token=$META_ACCESS_TOKEN" \
  --data-urlencode "fields=status,length"
```
Typical processing time: 10-30 seconds per video.

**3. Create campaign + ad set first**, *not* creatives. Reason: campaign and ad set don't depend on the creatives, but the creatives need an ad set ID to be attached via ads.

**4. Create one ad creative per concept**, with multi-aspect via `asset_feed_spec`:
```python
asset_feed_spec = {
    "ad_formats": ["SINGLE_VIDEO"],
    "videos": [
        {"video_id": "<vid_1x1>",  "adlabels": [{"name": "concept_sq"}]},
        {"video_id": "<vid_9x16>", "adlabels": [{"name": "concept_vert"}]},
    ],
    "bodies": [{"text": "<primary text>"}],
    "titles": [{"text": "<headline>"}],
    "link_urls": [{"website_url": "https://api.whatsapp.com/send?phone=...&text=..."}],
    "call_to_action_types": ["WHATSAPP_MESSAGE"],
    "asset_customization_rules": [
        {
            "customization_spec": {
                "publisher_platforms": ["facebook", "instagram"],
                "facebook_positions": ["feed", "marketplace"],
                "instagram_positions": ["stream", "explore"],
            },
            "video_label": {"name": "concept_sq"},
        },
        {
            "customization_spec": {
                "publisher_platforms": ["facebook", "instagram"],
                "facebook_positions": ["story", "facebook_reels"],
                "instagram_positions": ["story", "reels"],
            },
            "video_label": {"name": "concept_vert"},
        },
    ],
}
object_story_spec = {
    "page_id": "103923884978487",
    "instagram_user_id": "17841475544523609",  # required if customization rules include instagram
}
```
POST these as URL-encoded JSON params to `/act_{id}/adcreatives`. Do **NOT** include `degrees_of_freedom_spec.standard_enhancements` (deprecated, error subcode `3858504`). Do **NOT** include `video_feeds` Facebook position (deprecated, error subcode `2490562`).

**5. Create one ad per creative**:
```bash
curl -s -X POST "https://graph.facebook.com/v21.0/act_.../ads" \
  --data-urlencode "access_token=$META_ACCESS_TOKEN" \
  --data-urlencode "name=Concept B - V1" \
  --data-urlencode "adset_id=<adset_id>" \
  --data-urlencode "creative={\"creative_id\":\"<creative_id>\"}" \
  --data-urlencode "status=PAUSED"
```

**6. Verify before launch.** Check effective_status of campaign + ad set + each ad. New ads start at `IN_PROCESS` (Meta is reviewing); they transition to `PAUSED` once review passes. Issues flagged in `issues_info` must be resolved before activating.

**7. Activate when ready.** Flip `status` to `ACTIVE` on the campaign (cascades to ad set + ads). Or activate individually for staggered launch.

The full working script lives in `/tmp/create_ads.py` (regenerated each run, not committed). Reproduce by reading this section.

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
