# Core Web Vitals Thresholds Reference

## Current Metrics (2024+)

### LCP - Largest Contentful Paint
**Measures**: Loading performance

| Rating | Threshold | Description |
|--------|-----------|-------------|
| Good | ≤ 2.5 seconds | Fast loading |
| Needs Improvement | 2.5 - 4.0 seconds | Acceptable but slow |
| Poor | > 4.0 seconds | Too slow |

**Common LCP Elements:**
- Hero images
- Background images (CSS)
- Large text blocks
- Video poster images
- SVG elements

### INP - Interaction to Next Paint
**Measures**: Responsiveness (replaced FID in March 2024)

| Rating | Threshold | Description |
|--------|-----------|-------------|
| Good | ≤ 200ms | Responsive |
| Needs Improvement | 200 - 500ms | Sluggish |
| Poor | > 500ms | Unresponsive |

**What triggers INP:**
- Clicks
- Taps
- Keyboard input
- All interactions throughout page lifecycle

### CLS - Cumulative Layout Shift
**Measures**: Visual stability

| Rating | Threshold | Description |
|--------|-----------|-------------|
| Good | ≤ 0.1 | Stable |
| Needs Improvement | 0.1 - 0.25 | Some shifting |
| Poor | > 0.25 | Unstable |

**What causes CLS:**
- Images without dimensions
- Ads/embeds without reserved space
- Dynamically injected content
- Web fonts loading (FOUT)
- Animations causing layout changes

## Deprecated Metrics

### FID - First Input Delay
**Status**: Replaced by INP (March 2024)

| Rating | Threshold |
|--------|-----------|
| Good | ≤ 100ms |
| Needs Improvement | 100 - 300ms |
| Poor | > 300ms |

## Quick Reference Card

```
┌─────────────────────────────────────────────┐
│         CORE WEB VITALS 2024                │
├─────────────────────────────────────────────┤
│  METRIC  │  GOOD    │  OKAY     │  POOR    │
├──────────┼──────────┼───────────┼──────────┤
│  LCP     │  ≤2.5s   │  2.5-4s   │  >4s     │
│  INP     │  ≤200ms  │  200-500ms│  >500ms  │
│  CLS     │  ≤0.1    │  0.1-0.25 │  >0.25   │
└─────────────────────────────────────────────┘
```

## Measurement Methods

### Lab Data (Simulated)
- Lighthouse
- PageSpeed Insights (lab tab)
- Chrome DevTools
- WebPageTest

**Pros**: Reproducible, debug-friendly
**Cons**: May not match real-user experience

### Field Data (Real Users)
- Chrome User Experience Report (CrUX)
- PageSpeed Insights (field tab)
- Google Search Console
- web-vitals JavaScript library

**Pros**: Represents actual user experience
**Cons**: Requires traffic to collect data

## Google Search Console Thresholds

In Search Console Core Web Vitals report:

| Status | Meaning |
|--------|---------|
| Good | All three metrics pass |
| Needs Improvement | At least one metric in yellow |
| Poor | At least one metric in red |

## Impact on Rankings

- Core Web Vitals are a confirmed ranking factor
- Part of "Page Experience" signals
- More impactful when content quality is similar between competitors
- Mobile metrics used for mobile rankings
- Desktop metrics used for desktop rankings

## Testing Tools

| Tool | Type | URL |
|------|------|-----|
| PageSpeed Insights | Both | https://pagespeed.web.dev |
| Search Console | Field | https://search.google.com/search-console |
| Chrome DevTools | Lab | Built into Chrome |
| web.dev/measure | Lab | https://web.dev/measure |
| GTmetrix | Lab | https://gtmetrix.com |
| WebPageTest | Lab | https://webpagetest.org |

## Mobile-First Importance

- Google uses mobile-first indexing
- Mobile CWV scores matter more for rankings
- Test on mobile devices, not just desktop
- Different thresholds may apply based on connection speed

## Regional Considerations (MENA)

For Middle East markets:
- Variable connection speeds
- High mobile usage (97%)
- CDN coverage important
- Consider regional hosting (AWS Bahrain, Azure UAE)
