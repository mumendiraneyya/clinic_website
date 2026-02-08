# Core Web Vitals Optimizer Skill

## Purpose
Diagnose and fix Core Web Vitals issues to improve page experience and search rankings.

## Activation
Use when you need to:
- Improve page load speed (LCP)
- Fix layout shift issues (CLS)
- Improve interactivity (INP/FID)
- Pass Core Web Vitals assessment
- Optimize for mobile performance

## Core Web Vitals Overview

### The Three Metrics (2024+)

| Metric | What It Measures | Good | Poor |
|--------|-----------------|------|------|
| **LCP** | Loading - How fast main content loads | ≤2.5s | >4.0s |
| **INP** | Interactivity - How responsive to user input | ≤200ms | >500ms |
| **CLS** | Stability - How much layout shifts during load | ≤0.1 | >0.25 |

**Note**: INP (Interaction to Next Paint) replaced FID (First Input Delay) in March 2024.

## LCP (Largest Contentful Paint) Optimization

### What Triggers LCP
The largest element in the viewport, typically:
- Hero images
- Background images
- Large text blocks
- Video poster images

### Common LCP Issues & Fixes

#### 1. Slow Server Response (TTFB)
```
Issue: Time to First Byte > 600ms

Fixes:
- Use a faster hosting provider
- Implement server-side caching
- Use a CDN (Cloudflare, AWS CloudFront)
- Optimize database queries
- Use edge computing for static sites
```

#### 2. Render-Blocking Resources
```
Issue: CSS/JS blocking page render

Fixes:
- Inline critical CSS in <head>
- Defer non-critical CSS
- Use async/defer for JavaScript
- Remove unused CSS/JS
```

```html
<!-- Critical CSS inline -->
<style>
  /* Critical above-fold styles only */
</style>

<!-- Non-critical CSS deferred -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- JavaScript deferred -->
<script src="script.js" defer></script>
```

#### 3. Large Images
```
Issue: Unoptimized hero images

Fixes:
- Compress images (ImageOptim, Squoosh)
- Use modern formats (WebP, AVIF)
- Implement responsive images
- Preload LCP image
```

```html
<!-- Preload LCP image -->
<link rel="preload" as="image" href="hero.webp" fetchpriority="high">

<!-- Responsive images -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Description" width="1200" height="600"
       loading="eager" fetchpriority="high">
</picture>
```

#### 4. Client-Side Rendering Delay
```
Issue: JavaScript framework taking too long to render

Fixes:
- Use SSR (Server-Side Rendering) or SSG (Static Site Generation)
- Pre-render critical content
- Reduce JavaScript bundle size
- Use progressive hydration
```

### LCP Optimization Checklist
```
Server:
□ TTFB < 600ms
□ CDN configured
□ Caching headers set
□ Compression enabled (Brotli/Gzip)

Resources:
□ Critical CSS inlined
□ Non-critical CSS deferred
□ JavaScript deferred
□ Fonts preloaded

Images:
□ LCP image preloaded
□ WebP/AVIF format
□ Properly sized
□ Compressed
□ Using CDN
```

## INP (Interaction to Next Paint) Optimization

### What INP Measures
The latency of all user interactions (clicks, taps, key presses) throughout the page lifecycle.

### Common INP Issues & Fixes

#### 1. Long JavaScript Tasks
```
Issue: Tasks blocking main thread > 50ms

Fixes:
- Break up long tasks with yield/setTimeout
- Use Web Workers for heavy computation
- Remove or defer non-essential scripts
```

```javascript
// Bad: Long blocking task
function processLargeArray(items) {
  items.forEach(item => heavyProcessing(item));
}

// Good: Chunked processing
async function processLargeArray(items) {
  const chunkSize = 100;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(item => heavyProcessing(item));
    await new Promise(r => setTimeout(r, 0)); // Yield to main thread
  }
}
```

#### 2. Third-Party Scripts
```
Issue: Analytics, ads, widgets blocking

Fixes:
- Lazy load third-party scripts
- Use async loading
- Consider removing unnecessary scripts
- Use Partytown for third-party scripts
```

```html
<!-- Delay third-party until interaction -->
<script>
  document.addEventListener('click', function loadScripts() {
    // Load third-party scripts after first interaction
    loadAnalytics();
    loadChatWidget();
    document.removeEventListener('click', loadScripts);
  }, { once: true });
</script>
```

#### 3. Heavy Event Handlers
```
Issue: Event handlers doing too much work

Fixes:
- Debounce/throttle handlers
- Use passive event listeners for scroll
- Move work off main thread
```

```javascript
// Use passive listeners for scroll
element.addEventListener('scroll', handler, { passive: true });

// Debounce input handlers
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### INP Optimization Checklist
```
JavaScript:
□ No tasks > 50ms on main thread
□ Third-party scripts deferred/lazy loaded
□ Event handlers optimized
□ Heavy processing in Web Workers

Input Response:
□ Click handlers respond < 200ms
□ Form submissions handle gracefully
□ Visual feedback on interaction
```

## CLS (Cumulative Layout Shift) Optimization

### What Causes Layout Shifts
- Images without dimensions
- Ads/embeds without reserved space
- Dynamically injected content
- Web fonts causing text reflow
- Animations that trigger layout

### Common CLS Issues & Fixes

#### 1. Images Without Dimensions
```
Issue: Images causing layout shift when loading

Fix: Always specify width and height
```

```html
<!-- Bad -->
<img src="photo.jpg" alt="Photo">

<!-- Good -->
<img src="photo.jpg" alt="Photo" width="800" height="600">

<!-- CSS for responsive sizing -->
<style>
  img {
    max-width: 100%;
    height: auto;
  }
</style>
```

#### 2. Ads and Embeds
```
Issue: Dynamic content inserting and shifting layout

Fix: Reserve space with CSS
```

```html
<!-- Reserve ad space -->
<div class="ad-container" style="min-height: 250px;">
  <!-- Ad loads here -->
</div>

<!-- YouTube embed with aspect ratio -->
<div style="aspect-ratio: 16/9;">
  <iframe src="..." style="width: 100%; height: 100%;"></iframe>
</div>
```

#### 3. Web Fonts
```
Issue: FOUT (Flash of Unstyled Text) causing shift

Fixes:
- Preload fonts
- Use font-display: optional or swap
- Size-adjust for fallback fonts
```

```html
<!-- Preload critical fonts -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<style>
  @font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2');
    font-display: optional; /* Prevents FOUT completely */
  }

  /* Size-adjust for fallback */
  @font-face {
    font-family: 'Fallback';
    src: local('Arial');
    size-adjust: 105%; /* Match custom font sizing */
  }
</style>
```

#### 4. Dynamic Content
```
Issue: Content injected above existing content

Fix: Never insert content above visible content
```

```javascript
// Bad: Inserting at top
container.prepend(newContent);

// Good: Insert at bottom or in reserved space
container.append(newContent);

// Or: Reserve space for dynamic content
<div id="notification-area" style="min-height: 50px;"></div>
```

### CLS Optimization Checklist
```
Images:
□ All images have width/height
□ Using aspect-ratio where appropriate
□ Lazy images don't shift layout

Fonts:
□ Fonts preloaded
□ font-display set appropriately
□ Fallback fonts size-matched

Dynamic Content:
□ Ads have reserved space
□ Embeds have aspect-ratio containers
□ No content inserted above fold
□ Skeleton screens for loading states
```

## Testing & Measurement

### Lab Testing (Simulated)
```
Tools:
- Lighthouse (Chrome DevTools)
- PageSpeed Insights
- WebPageTest

Note: Lab data is simulated, may differ from real users
```

### Field Testing (Real Users)
```
Tools:
- Chrome User Experience Report (CrUX)
- Google Search Console (Core Web Vitals report)
- web-vitals JavaScript library
```

```javascript
// Using web-vitals library
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(metric => console.log('LCP:', metric));
onINP(metric => console.log('INP:', metric));
onCLS(metric => console.log('CLS:', metric));
```

## Output Format

```markdown
## Core Web Vitals Optimization Report

### Page Analyzed
**URL**: [url]
**Date**: [date]
**Device**: [Mobile/Desktop]

---

### Current Status

| Metric | Score | Threshold | Status |
|--------|-------|-----------|--------|
| LCP | [X.X]s | ≤2.5s | ✅/⚠️/❌ |
| INP | [X]ms | ≤200ms | ✅/⚠️/❌ |
| CLS | [0.XX] | ≤0.1 | ✅/⚠️/❌ |

**Overall Assessment**: [Pass/Needs Improvement/Fail]

---

### LCP Analysis

**Current**: [X.X]s
**Target**: ≤2.5s
**LCP Element**: [element description]

**Issues Identified**:
1. [Issue 1]
2. [Issue 2]

**Fixes**:
1. [Specific fix with code if applicable]
2. [Specific fix]

**Expected Improvement**: [X.X]s → [X.X]s

---

### INP Analysis

**Current**: [X]ms
**Target**: ≤200ms

**Long Tasks Identified**:
- [Script/task 1]: [X]ms
- [Script/task 2]: [X]ms

**Fixes**:
1. [Fix 1]
2. [Fix 2]

---

### CLS Analysis

**Current**: [0.XX]
**Target**: ≤0.1

**Shifting Elements**:
1. [Element 1]: shift of [0.XX]
2. [Element 2]: shift of [0.XX]

**Fixes**:
1. [Fix with code]
2. [Fix with code]

---

### Implementation Priority

| Priority | Fix | Impact | Effort |
|----------|-----|--------|--------|
| 1 | [Fix] | High | Low |
| 2 | [Fix] | High | Medium |
| 3 | [Fix] | Medium | Low |

---

### Code Changes Required

#### [Fix 1 Name]
```html
[Code snippet]
```

#### [Fix 2 Name]
```css
[Code snippet]
```

---

### Verification Steps
1. Implement fixes
2. Test with Lighthouse
3. Deploy and monitor CrUX data
4. Verify in Search Console after 28 days
```

## Quick Wins for Common Sites

### Static Sites (Astro, Hugo, etc.)
```
Usually good LCP/INP, focus on:
- Image optimization
- Font loading
- CLS from lazy images
```

### WordPress Sites
```
Common issues:
- Too many plugins (INP)
- Unoptimized images (LCP)
- Sliders/carousels (CLS)
- Render-blocking themes (LCP)
```

### React/Next.js Sites
```
Focus on:
- Server-side rendering
- Code splitting
- Image optimization (next/image)
- Hydration performance (INP)
```
