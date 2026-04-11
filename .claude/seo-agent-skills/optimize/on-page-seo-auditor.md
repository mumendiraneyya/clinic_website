# On-Page SEO Auditor Skill

## Purpose
Conduct comprehensive audits of on-page SEO elements with actionable recommendations and priority scoring.

## Activation
Use when you need to:
- Audit a specific page for SEO issues
- Review content optimization
- Check heading structure and keyword usage
- Evaluate E-E-A-T signals
- Assess Arabic/RTL formatting

## Audit Checklist

### 1. Title Tag Analysis

| Check | Requirement | Score Weight |
|-------|-------------|--------------|
| Length | 50-60 characters | 10% |
| Primary Keyword | Present, near beginning | 15% |
| Uniqueness | Not duplicated on site | 10% |
| Compelling | Click-worthy, not keyword-stuffed | 5% |

```
Example Audit:
Current: "Home - Dr. Mu'men" (20 chars)
Issues: ❌ Too short, ❌ No keywords, ❌ Generic
Recommendation: "جراح عام في عمان - الدكتور معمن الدرانية | خبرة 30 عامًا"
```

### 2. Meta Description Analysis

| Check | Requirement | Score Weight |
|-------|-------------|--------------|
| Length | 150-160 characters | 8% |
| Primary Keyword | Included naturally | 10% |
| CTA | Contains call-to-action | 5% |
| Uniqueness | Not duplicated | 7% |

```
Example Audit:
Current: [Missing]
Issues: ❌ No meta description
Recommendation: "جراح عام متخصص في عمان. خبرة 30 عامًا في الجراحة بالمنظار.
زمالة كلية الجراحين الملكية. احجز موعدك - 25 دينار فقط."
```

### 3. Heading Structure

| Check | Requirement | Score Weight |
|-------|-------------|--------------|
| Single H1 | Only one H1 per page | 10% |
| Keyword in H1 | Primary keyword present | 8% |
| Logical Hierarchy | H1 → H2 → H3 (no skipping) | 5% |
| H2 Coverage | Main sections have H2s | 5% |
| Descriptive | Headers describe content | 3% |

```
Correct Structure:
<h1>جراحة الفتق بالمنظار في عمان</h1>
  <h2>ما هو الفتق؟</h2>
  <h2>أنواع جراحة الفتق</h2>
    <h3>الجراحة المفتوحة</h3>
    <h3>الجراحة بالمنظار</h3>
  <h2>لماذا تختار عيادتنا؟</h2>
  <h2>احجز موعدك</h2>
```

### 4. Content Quality

| Check | Requirement | Score Weight |
|-------|-------------|--------------|
| Word Count | Adequate for topic (500-2000+) | 5% |
| Keyword Density | 1-2% primary keyword | 5% |
| Readability | Short paragraphs, lists | 5% |
| Originality | No duplicate content | 10% |
| Freshness | Content recently updated | 5% |

### 5. E-E-A-T Signals

| Check | Requirement | Score Weight |
|-------|-------------|--------------|
| Author Attribution | Byline with credentials | 8% |
| Expert Content | Demonstrates expertise | 7% |
| Trust Signals | Reviews, certifications | 5% |
| Citations | Links to authoritative sources | 5% |
| Updated Date | Shows last updated | 3% |

```
Medical Site E-E-A-T Checklist:
✅ Doctor name and credentials visible
✅ Medical qualifications listed (FRCS, etc.)
✅ Hospital affiliations mentioned
✅ Years of experience stated
✅ Patient testimonials present
✅ Contact information clear
✅ Physical location verified
```

### 6. Image Optimization

| Check | Requirement | Score Weight |
|-------|-------------|--------------|
| Alt Text | Descriptive, keyword-relevant | 5% |
| File Names | Descriptive (not IMG_001.jpg) | 2% |
| Compression | Optimized file sizes | 3% |
| Modern Format | WebP or AVIF when possible | 2% |
| Dimensions | Specified width/height | 3% |

```
Bad: <img src="image1.jpg">
Good: <img src="dr-mumen-diraneyya-clinic.jpg"
           alt="الدكتور معمن الدرانية في عيادته الجراحية في عمان"
           width="800" height="600" loading="lazy">
```

### 7. Internal Linking

| Check | Requirement | Score Weight |
|-------|-------------|--------------|
| Relevant Links | Links to related content | 5% |
| Anchor Text | Descriptive, not "click here" | 5% |
| Navigation | Clear site navigation | 3% |
| Breadcrumbs | Breadcrumb navigation present | 3% |
| No Orphan Pages | All pages linked from somewhere | 3% |

### 8. URL Structure

| Check | Requirement | Score Weight |
|-------|-------------|--------------|
| Keyword in URL | Relevant keyword included | 3% |
| Short & Clean | No unnecessary parameters | 3% |
| Hyphens | Words separated by hyphens | 2% |
| Lowercase | All lowercase letters | 2% |

```
Bad: example.com/page?id=123&ref=nav
Good: example.com/services/hernia-surgery
Arabic: example.com/ar/جراحة-الفتق (URL-encoded)
Better: example.com/ar/hernia-surgery (transliterated)
```

### 9. Mobile Optimization

| Check | Requirement | Score Weight |
|-------|-------------|--------------|
| Responsive | Works on all screen sizes | 5% |
| Tap Targets | Buttons easily tappable (48px min) | 3% |
| Font Size | Readable without zooming (16px+) | 2% |
| No Horizontal Scroll | Content fits viewport | 2% |

### 10. Arabic/RTL Specific

| Check | Requirement | Score Weight |
|-------|-------------|--------------|
| RTL Direction | dir="rtl" set correctly | 3% |
| Arabic Font | Proper Arabic typography | 2% |
| Mixed Content | LTR elements (numbers, English) handled | 2% |
| Quotation Marks | Proper Arabic quotation marks | 1% |

## Scoring System

**Overall Score Calculation:**
- Each check is weighted as shown
- Points deducted for issues found
- Final score: 0-100

**Score Interpretation:**
| Score | Rating | Action |
|-------|--------|--------|
| 90-100 | Excellent | Minor tweaks only |
| 75-89 | Good | Address key issues |
| 60-74 | Needs Work | Prioritize fixes |
| 40-59 | Poor | Significant overhaul needed |
| 0-39 | Critical | Major intervention required |

## Output Format

```markdown
## On-Page SEO Audit Report

### Page Analyzed
**URL**: [url]
**Date**: [date]
**Overall Score**: [X]/100 - [Rating]

---

### Executive Summary
[2-3 sentence summary of main findings]

### Score Breakdown

| Category | Score | Max | Status |
|----------|-------|-----|--------|
| Title Tag | | 40 | ✅/⚠️/❌ |
| Meta Description | | 30 | ✅/⚠️/❌ |
| Headings | | 31 | ✅/⚠️/❌ |
| Content | | 30 | ✅/⚠️/❌ |
| E-E-A-T | | 28 | ✅/⚠️/❌ |
| Images | | 15 | ✅/⚠️/❌ |
| Internal Links | | 16 | ✅/⚠️/❌ |
| URL | | 10 | ✅/⚠️/❌ |
| Mobile | | 12 | ✅/⚠️/❌ |
| Arabic/RTL | | 8 | ✅/⚠️/❌ |

---

### Critical Issues (Fix Immediately)
1. ❌ [Issue]: [Description]
   **Impact**: [Why it matters]
   **Fix**: [How to fix]

### High Priority Issues
1. ⚠️ [Issue]: [Description]
   **Fix**: [How to fix]

### Medium Priority Issues
1. [Issue]: [Description]
   **Fix**: [How to fix]

### Low Priority / Opportunities
1. [Opportunity]: [Description]

---

### Detailed Findings

#### Title Tag
**Current**: [title]
**Length**: [X] characters
**Issues**: [list]
**Recommendation**: [suggested title]

#### Meta Description
[Same format]

#### Heading Structure
```
[Current heading hierarchy]
```
**Issues**: [list]
**Recommended Structure**: [suggested hierarchy]

[Continue for each category...]

---

### Action Plan

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| 1 | [Task] | Low/Med/High | High |
| 2 | [Task] | | |
| 3 | [Task] | | |

### Next Steps
1. [Immediate action]
2. [Short-term action]
3. [Long-term action]
```

## Tools for Auditing
- Manual page inspection (View Source)
- Chrome DevTools
- Screaming Frog SEO Spider
- Ahrefs Site Audit
- SEMrush Site Audit
- Google Search Console
- PageSpeed Insights
