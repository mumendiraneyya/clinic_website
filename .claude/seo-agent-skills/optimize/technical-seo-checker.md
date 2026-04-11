# Technical SEO Checker Skill

## Purpose
Audit technical SEO elements including crawlability, indexing, site architecture, and security to ensure search engines can properly access and understand the website.

## Activation
Use when you need to:
- Check if a site is properly indexed
- Diagnose crawling issues
- Review site architecture
- Audit security and HTTPS
- Check Core Web Vitals
- Verify mobile-friendliness

## Technical SEO Audit Areas

### 1. Crawlability

#### robots.txt Analysis
```
Location: https://domain.com/robots.txt

Check for:
✅ File exists and is accessible
✅ Not blocking important pages
✅ Allows search engine bots
✅ Points to sitemap
✅ Allows AI bots (for GEO)
```

**Recommended robots.txt for Medical Site:**
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# AI Crawlers (for GEO)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

# Sitemap
Sitemap: https://abuobaydatajjarrah.com/sitemap.xml
```

#### XML Sitemap Analysis
```
Location: https://domain.com/sitemap.xml

Check for:
✅ Sitemap exists
✅ Valid XML format
✅ All important pages included
✅ No 404/error pages listed
✅ Submitted to Google Search Console
✅ Last modified dates accurate
✅ Proper URL encoding (for Arabic URLs)
```

**Sitemap Format:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://abuobaydatajjarrah.com/</loc>
    <lastmod>2024-06-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://abuobaydatajjarrah.com/services/</loc>
    <lastmod>2024-06-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 2. Indexability

#### Indexing Status Checks
```
For each important page:
1. site:domain.com/page - Is it indexed?
2. Check <meta name="robots"> tag
3. Check X-Robots-Tag header
4. Check canonical tag
5. Verify in Google Search Console
```

#### Meta Robots Tags
```html
<!-- Allow indexing (default) -->
<meta name="robots" content="index, follow">

<!-- Block indexing -->
<meta name="robots" content="noindex, nofollow">

<!-- Index but don't follow links -->
<meta name="robots" content="index, nofollow">
```

#### Canonical Tags
```html
<!-- Self-referencing canonical -->
<link rel="canonical" href="https://abuobaydatajjarrah.com/services/">

<!-- Issues to check -->
❌ Missing canonical
❌ Wrong canonical (pointing to different page)
❌ HTTP instead of HTTPS
❌ Non-www pointing to www (or vice versa)
```

### 3. Site Architecture

#### URL Structure
```
Ideal Structure:
domain.com/                     (Home)
domain.com/about/               (About)
domain.com/services/            (Services hub)
domain.com/services/hernia/     (Specific service)
domain.com/blog/                (Blog hub)
domain.com/blog/article-name/   (Blog post)
domain.com/contact/             (Contact)

Maximum depth: 3 clicks from homepage
```

#### Navigation Analysis
```
Check:
✅ Clear primary navigation
✅ Footer navigation with key links
✅ Breadcrumbs implemented
✅ No orphan pages
✅ Internal linking between related pages
✅ Arabic/RTL navigation works correctly
```

#### Redirect Audit
```
HTTP Status Codes:
200 - OK (good)
301 - Permanent redirect (good, use for moved pages)
302 - Temporary redirect (avoid for permanent moves)
404 - Not found (fix or redirect)
500 - Server error (fix immediately)

Redirect Chains (BAD):
A → B → C → D (too many hops)
Should be: A → D (single redirect)
```

### 4. HTTPS & Security

#### SSL/TLS Check
```
✅ HTTPS enabled site-wide
✅ Valid SSL certificate
✅ Certificate not expired
✅ Proper certificate chain
✅ HTTP redirects to HTTPS (301)
✅ No mixed content (HTTP resources on HTTPS page)
✅ HSTS header enabled
```

#### Security Headers
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
X-XSS-Protection: 1; mode=block
```

### 5. Page Speed & Core Web Vitals

#### Core Web Vitals Thresholds
| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤2.5s | 2.5-4.0s | >4.0s |
| INP (Interaction to Next Paint) | ≤200ms | 200-500ms | >500ms |
| CLS (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |

#### Common Speed Issues
```
LCP Issues:
- Slow server response (TTFB)
- Render-blocking resources
- Large hero images
- Client-side rendering delay

INP/FID Issues:
- Heavy JavaScript
- Long main thread tasks
- Third-party scripts blocking
- Too many event listeners

CLS Issues:
- Images without dimensions
- Ads/embeds without reserved space
- Web fonts causing FOIT/FOUT
- Dynamic content insertion
```

### 6. Mobile Friendliness

#### Mobile Checks
```
✅ Responsive design
✅ Viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">
✅ Text readable without zooming (16px+ base)
✅ Tap targets adequately sized (48px minimum)
✅ No horizontal scrolling
✅ Mobile menu works correctly
✅ RTL works on mobile
```

#### Mobile Testing Tools
- Google Mobile-Friendly Test
- Chrome DevTools Device Mode
- BrowserStack real device testing

### 7. International SEO (Arabic/Multilingual)

#### hreflang Implementation
```html
<!-- For Arabic main content with English alternative -->
<link rel="alternate" hreflang="ar" href="https://abuobaydatajjarrah.com/">
<link rel="alternate" hreflang="en" href="https://abuobaydatajjarrah.com/en/">
<link rel="alternate" hreflang="x-default" href="https://abuobaydatajjarrah.com/">
```

#### Language/Region Targeting
```html
<html lang="ar" dir="rtl">
<meta property="og:locale" content="ar_JO">
<meta name="geo.region" content="JO-AM">
<meta name="geo.placename" content="Amman, Jordan">
```

### 8. Structured Data Validation

```
Checks:
✅ JSON-LD syntax valid
✅ Required properties present
✅ No errors in Rich Results Test
✅ No warnings in Google Search Console
✅ Matches visible page content
```

### 9. Log File Analysis (Advanced)

```
Check server logs for:
- Bot crawl frequency
- Crawl errors
- Pages consuming crawl budget
- Unusual bot behavior
- 404 errors from bots
```

## Output Format

```markdown
## Technical SEO Audit Report

### Site Analyzed
**Domain**: [domain]
**Date**: [date]
**Pages Crawled**: [X]

---

### Technical Health Score: [X]/100

| Category | Status | Score |
|----------|--------|-------|
| Crawlability | ✅/⚠️/❌ | /20 |
| Indexability | ✅/⚠️/❌ | /20 |
| Site Architecture | ✅/⚠️/❌ | /15 |
| HTTPS & Security | ✅/⚠️/❌ | /15 |
| Page Speed | ✅/⚠️/❌ | /15 |
| Mobile | ✅/⚠️/❌ | /10 |
| Structured Data | ✅/⚠️/❌ | /5 |

---

### Critical Issues

#### 🔴 [Issue Title]
**Problem**: [Description]
**Impact**: [SEO impact]
**Fix**: [Step-by-step solution]

---

### Crawlability Analysis

#### robots.txt
**Status**: [Found/Not Found]
**Location**: [URL]
**Issues**:
- [Issue 1]
- [Issue 2]

**Current Content**:
```
[robots.txt content]
```

**Recommended Changes**:
```
[suggested robots.txt]
```

#### XML Sitemap
**Status**: [Found/Not Found]
**Location**: [URL]
**Pages Listed**: [X]
**Issues**:
- [Issue 1]

---

### Indexability Analysis

#### Index Status
| Page | Indexed | Canonical | Issues |
|------|---------|-----------|--------|
| Homepage | ✅/❌ | ✅/❌ | |
| Services | ✅/❌ | ✅/❌ | |
| ... | | | |

---

### Core Web Vitals

| Metric | Mobile | Desktop | Status |
|--------|--------|---------|--------|
| LCP | [X]s | [X]s | ✅/⚠️/❌ |
| INP | [X]ms | [X]ms | ✅/⚠️/❌ |
| CLS | [X] | [X] | ✅/⚠️/❌ |

**Recommendations**:
1. [Speed improvement 1]
2. [Speed improvement 2]

---

### HTTPS & Security

| Check | Status |
|-------|--------|
| SSL Valid | ✅/❌ |
| HTTP→HTTPS Redirect | ✅/❌ |
| No Mixed Content | ✅/❌ |
| HSTS Enabled | ✅/❌ |

---

### Mobile Friendliness

**Status**: [Mobile-Friendly / Issues Found]

| Check | Status |
|-------|--------|
| Responsive Design | ✅/❌ |
| Viewport Set | ✅/❌ |
| Text Size | ✅/❌ |
| Tap Targets | ✅/❌ |
| RTL on Mobile | ✅/❌ |

---

### Priority Action Plan

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P1 | [Critical issue] | [Low/Med/High] | High |
| P2 | [High priority] | | |
| P3 | [Medium priority] | | |

---

### Tools Used
- [Tool 1]
- [Tool 2]
```

## Testing Tools

- **Crawlability**: Screaming Frog, Sitebulb
- **Indexability**: Google Search Console
- **Speed**: PageSpeed Insights, GTmetrix, WebPageTest
- **Mobile**: Google Mobile-Friendly Test
- **Security**: SSL Labs, Security Headers
- **Structured Data**: Rich Results Test, Schema Validator
