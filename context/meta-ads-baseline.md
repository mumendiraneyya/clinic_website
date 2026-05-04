# Meta Ads Historical Baseline

This document captures the lifetime performance of the clinic's Meta ad account `act_1260926961492067` **as of 2026-05-04**, before any campaigns built via this repo went live. It exists so we can compare the new programmatic campaigns against the previous boost-post-only era and judge whether our work is actually moving the needle.

## What was running before

From 2023-08-19 to 2025-12-10, **31 campaigns** were created in the clinic ad account. Every single one was a **"Boost Post"** action — someone (the doctor, his sons, or whoever was managing the page) clicked the Boost button on Facebook posts. Names are auto-generated and start with `"المنشور: ..."` ("Post: ...") or `"[date] الترويج لصفحة..."`.

These campaigns were all flagged ACTIVE in Meta's UI, but none had spent money in the 30 days before this audit — they're zombies whose budgets/end-dates expired long ago. **All 31 have been paused on 2026-05-04** as part of the audit.

## Headline numbers

```
Period:                   2023-08-19 → 2025-12-10  (~28 months)
Total spend:              $1,493.59 USD
Total impressions:        1,653,626
Total link clicks:        60,711
Total reach (non-dedup):  715,442  *
Account-wide CPM:         $0.90
Account-wide CPC:         $0.02
```

\* "Non-dedup reach" means the sum of each campaign's reach. Real unique-people reach is lower because many campaigns hit overlapping audiences. Treat it as upper bound.

## Breakdown by objective

| Objective | # | Spend | Impressions | Reach | Results | Result type | Cost / Result |
|---|---|---|---|---|---|---|---|
| `MESSAGES` | 20 | $616.48 | 295,930 | 146,726 | **557 conversations** | WhatsApp/Messenger conversations started | **$1.11** |
| `POST_ENGAGEMENT` | 5 | $368.39 | 268,087 | 171,010 | 9,280 engagements | Post engagements (likes/comments/shares) | $0.04 |
| `PAGE_LIKES` | 1 | $278.97 | 843,095 | 229,983 | 2,692 likes | Page likes | $0.10 |
| `VIDEO_VIEWS` | 4 | $139.90 | 146,772 | 109,156 | 86,079 views | 3-second video views | $0.002 |
| `OUTCOME_ENGAGEMENT` | 1 | $89.85 | 99,742 | 58,567 | 0 recorded * | (mixed — newest objective) | n/a |

\* The `OUTCOME_ENGAGEMENT` campaign reports 0 conversations because the 7-day attribution window has expired on those events — Meta only retains conversation results for 7 days after they happen.

## Key benchmarks for new campaigns to beat

These are the numbers our programmatic campaigns will be compared against. Not all are directly comparable (the boost posts were spread over 28 months and didn't have UTM tracking, Pixel, or strict targeting), but they're the only historical signal we have.

### For Campaign 1 (Jordan / Click-to-WhatsApp)

The most direct comparison is against the historical `MESSAGES` campaigns:

- **Cost per WhatsApp/Messenger conversation: $1.11** ← target to beat
- **Volume per dollar: ~0.9 conversations per dollar spent**
- Note: those historical conversations went to **Messenger**, not WhatsApp. The new campaigns will route to WhatsApp (the AI-bot's number, not the doctor's). This is a small variable that may shift cost in either direction.

If we can reach `OUTCOME_ENGAGEMENT` (the modern objective) with a cost per conversation **at or below $1.11**, our programmatic setup matches or beats the boost-post baseline. That's what success looks like for Campaign 1.

### For Campaign 2 (Diaspora 35+ / Site Traffic)

There is **no historical baseline** here — the boost posts targeted Jordan only and never drove site traffic. Diaspora traffic at 35+ in GCC and Western markets will have very different unit economics:

- **Expected CPM**: 5–20× higher than Jordan (GCC and Europe/US are far more expensive markets)
- **Expected CPC**: $0.30–$1.50 range, not $0.02
- **The conversion to compare** will be `Schedule` events (booking-completed), once Pixel volume lets us optimize for it. Initially we'll compare cost per `InitiateCheckout` (Cal.com modal opens).

So for Campaign 2, the baseline is being **established now, not compared against history**.

## Per-campaign top performers (for reference)

The five highest-spending boost campaigns:

| Campaign | Created | Objective | Spend |
|---|---|---|---|
| `[٠٩/١١/٢٠٢٤] الترويج لصفحة...` | 2024-11-09 | PAGE_LIKES | $278.97 |
| `المنشور: "حديث عن فتوق جدار البطن وعلاجها"` | 2025-09-04 | POST_ENGAGEMENT | $125.98 |
| `المنشور: "الناسور الشرجي"` | 2025-09-19 | POST_ENGAGEMENT | $89.96 |
| `المنشور: "حديث عن فتوق جدار البطن وعلاجها"` | 2025-12-10 | OUTCOME_ENGAGEMENT | $89.85 |
| `[١٩/٠٧/٢٠٢٤] الترويج لصفحة...` | 2024-07-19 | MESSAGES | $69.96 |

The full per-campaign data lived in `/tmp/meta_audit_detailed.json` at audit time but is also retrievable any time via:

```bash
direnv exec . sh -c 'curl -s -G "https://graph.facebook.com/v21.0/act_1260926961492067/insights" \
  --data-urlencode "access_token=$META_ACCESS_TOKEN" \
  --data-urlencode "level=campaign" \
  --data-urlencode "date_preset=maximum" \
  --data-urlencode "fields=campaign_id,campaign_name,objective,spend,impressions,clicks,reach,actions,cost_per_action_type" \
  --data-urlencode "limit=100"'
```

## Caveats — what makes this baseline imperfect

Acknowledge these honestly when comparing future campaigns:

1. **The boost posts had no Pixel** — there was no website conversion tracking. The "results" Meta records are on-Meta engagement (post likes, video plays, message starts on Messenger). They don't measure actual bookings, calls, or revenue.
2. **No UTM tracking** — we have no way to know how many of the 60,711 link clicks led to bookings on the site, vs. clicks that bounced.
3. **Objectives shifted over time** — early boosts used `MESSAGES` (deprecated since ODAX); later ones used `OUTCOME_ENGAGEMENT`. Direct apples-to-apples comparison across the 28-month span is impossible.
4. **Targeting is unknown** — boost posts use Meta's "automatic" audience by default (people who like the Page + lookalike). The new campaigns will use explicit Jordan / Diaspora targeting, which is structurally different.
5. **`reach` numbers across campaigns are not additive** — same person could be reached by multiple campaigns. Treat the 715K total reach as an upper bound; real unique reach is lower.
6. **Quality of historical results varies** — 9,280 "post engagements" sounds great but most are likes from people who'd already followed the page. The 557 `MESSAGES` conversations are a stronger signal because they required intent.

## How we'll measure new campaigns against this

For each new campaign, after 14+ days of delivery, we'll compare:

1. **CPM** — should be in line with or below historical $0.90 for Jordan campaigns, higher for diaspora (expected).
2. **Cost per WhatsApp conversation** (Campaign 1) — target ≤ $1.11.
3. **Click-through rate (CTR)** — historical aggregate ≈ 60,711 / 1,653,626 = **3.67%**. Our targeted campaigns should beat this with better creative and a real CTA.
4. **Cost per `InitiateCheckout`** (Campaign 2 — new metric, no historical equivalent).
5. **Cost per `Schedule`** (both campaigns — new metric, becomes the north star once Pixel has enough conversion volume).

Comparison data will be added to this file as campaigns mature. Don't overwrite the historical numbers above — they're frozen as of 2026-05-04 and exist as the "before" snapshot.

## Re-running this audit later

The audit is fully reproducible. To regenerate the headline numbers at any time:

```bash
direnv exec . sh -c 'curl -s -G "https://graph.facebook.com/v21.0/act_1260926961492067/insights" \
  --data-urlencode "access_token=$META_ACCESS_TOKEN" \
  --data-urlencode "level=campaign" \
  --data-urlencode "date_preset=maximum" \
  --data-urlencode "fields=campaign_id,campaign_name,objective,spend,impressions,clicks,reach,actions" \
  --data-urlencode "limit=100"'
```
