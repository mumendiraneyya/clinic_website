# Meta Tags Optimizer Skill

## Purpose
Optimize title tags, meta descriptions, and Open Graph tags for better search visibility and click-through rates.

## Activation
Use when you need to:
- Write or improve title tags
- Create compelling meta descriptions
- Set up Open Graph and Twitter cards
- Audit existing meta tags
- Optimize for Arabic/English bilingual sites

## Core Meta Tags

### Title Tag
```html
<title>Primary Keyword - Secondary Keyword | Brand Name</title>
```

**Requirements:**
- 50-60 characters (desktop shows ~600px)
- Primary keyword near the beginning
- Brand name at end (if space)
- Unique for every page
- Compelling and click-worthy

**Formulas:**
```
[Primary Keyword]: [Benefit/Promise] | [Brand]
[How to/What is] [Topic] - [Year] [Guide/Tips] | [Brand]
[Service] في [Location] - [USP] | [Brand]
```

**Examples:**
```
English:
✅ General Surgery in Amman - 30 Years Experience | Dr. Mu'men Clinic
✅ Laparoscopic Hernia Repair - Minimally Invasive | Abu Ubaidah Clinic
❌ Home - Dr. Mu'men Website (too generic)

Arabic:
✅ جراحة عامة في عمان - خبرة 30 عامًا | عيادة الدكتور معمن
✅ عملية الفتق بالمنظار - أقل ألم، شفاء أسرع | أبو عبيدة الجراح
❌ الصفحة الرئيسية (too generic)
```

### Meta Description
```html
<meta name="description" content="Your compelling description here...">
```

**Requirements:**
- 150-160 characters (Google may truncate at ~920px)
- Include primary keyword naturally
- Include a call-to-action
- Unique for every page
- Accurately describe page content
- Entice users to click

**Formulas:**
```
[Problem/Question]? [Solution]. [Benefit]. [CTA with specifics].
[Service description]. [Credentials]. [CTA] - [Contact info].
تبحث عن [الخدمة]? [القيمة المقدمة]. [الميزة]. [CTA].
```

**Examples:**
```
English:
✅ Looking for an experienced general surgeon in Amman? Dr. Mu'men
   Diraneyya offers laparoscopic surgery with 30 years of expertise.
   Book your consultation today - 25 JD only.

Arabic:
✅ هل تبحث عن جراح عام متخصص في عمان؟ الدكتور معمن الدرانية - خبرة 30
   عامًا في الجراحة بالمنظار. احجز موعدك الآن - 25 دينار فقط.

❌ We are a clinic that does surgery. Contact us. (too vague)
```

## Open Graph Tags

```html
<!-- Essential OG Tags -->
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Brand Name">

<!-- Optional but recommended -->
<meta property="og:locale" content="ar_JO">
<meta property="og:locale:alternate" content="en_US">
```

**Image Requirements:**
- Minimum: 1200 x 630 pixels
- Ratio: 1.91:1
- File size: Under 8MB
- Include text overlay for context
- Brand colors/logo visible

### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourbrand">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="https://example.com/image.jpg">
```

## Complete Meta Tag Template

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary Meta Tags -->
    <title>جراحة عامة في عمان - الدكتور معمن الدرانية | 30 عام خبرة</title>
    <meta name="title" content="جراحة عامة في عمان - الدكتور معمن الدرانية | 30 عام خبرة">
    <meta name="description" content="جراح عام متخصص في الجراحة بالمنظار. خبرة 30 عامًا. زمالة كلية الجراحين الملكية - إدنبرة. احجز موعدك اليوم - 25 دينار فقط.">

    <!-- Language and Region -->
    <meta name="language" content="Arabic">
    <meta name="geo.region" content="JO-AM">
    <meta name="geo.placename" content="Amman">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://abuobaydatajjarrah.com/">
    <meta property="og:title" content="جراحة عامة في عمان - الدكتور معمن الدرانية">
    <meta property="og:description" content="جراح عام متخصص في الجراحة بالمنظار. خبرة 30 عامًا. زمالة كلية الجراحين الملكية.">
    <meta property="og:image" content="https://abuobaydatajjarrah.com/og-image.jpg">
    <meta property="og:locale" content="ar_JO">
    <meta property="og:locale:alternate" content="en_US">
    <meta property="og:site_name" content="عيادة أبو عبيدة الجراح">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://abuobaydatajjarrah.com/">
    <meta name="twitter:title" content="جراحة عامة في عمان - الدكتور معمن الدرانية">
    <meta name="twitter:description" content="جراح عام متخصص في الجراحة بالمنظار. خبرة 30 عامًا.">
    <meta name="twitter:image" content="https://abuobaydatajjarrah.com/twitter-image.jpg">

    <!-- Canonical -->
    <link rel="canonical" href="https://abuobaydatajjarrah.com/">

    <!-- Language alternates -->
    <link rel="alternate" hreflang="ar" href="https://abuobaydatajjarrah.com/">
    <link rel="alternate" hreflang="en" href="https://abuobaydatajjarrah.com/en/">
    <link rel="alternate" hreflang="x-default" href="https://abuobaydatajjarrah.com/">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
```

## Meta Tags Audit Checklist

### Title Tag
- [ ] Unique across all pages
- [ ] Contains primary keyword
- [ ] 50-60 characters
- [ ] Compelling/click-worthy
- [ ] Brand included (if room)
- [ ] No duplicate titles on site

### Meta Description
- [ ] Unique across all pages
- [ ] Contains primary keyword
- [ ] 150-160 characters
- [ ] Includes CTA
- [ ] Accurately describes page
- [ ] Compelling to click

### Open Graph
- [ ] og:title set
- [ ] og:description set
- [ ] og:image set (1200x630)
- [ ] og:url set
- [ ] og:type set
- [ ] og:locale set for Arabic

### Technical
- [ ] Canonical URL set
- [ ] hreflang for languages
- [ ] robots meta (if needed)
- [ ] viewport meta set

## Arabic-Specific Considerations

### Character Limits
Arabic characters often take more horizontal space. Test at:
- 55 characters for titles (conservative)
- 145 characters for descriptions (conservative)

### Language Tags
```html
<html lang="ar" dir="rtl">
<meta property="og:locale" content="ar_JO">
```

### Bilingual Sites
For pages with both Arabic and English:
```html
<!-- Arabic version -->
<link rel="alternate" hreflang="ar" href="https://site.com/ar/page">

<!-- English version -->
<link rel="alternate" hreflang="en" href="https://site.com/en/page">

<!-- Default -->
<link rel="alternate" hreflang="x-default" href="https://site.com/">
```

## Output Format

```markdown
## Meta Tags Recommendations

### Page: [URL]

#### Current State
**Title**: [current title]
**Issues**: [list issues]

**Description**: [current description]
**Issues**: [list issues]

#### Recommended Changes

**Title Tag (Arabic)**:
```html
<title>[new title]</title>
```

**Title Tag (English)**:
```html
<title>[new title]</title>
```

**Meta Description (Arabic)**:
```html
<meta name="description" content="[new description]">
```

**Open Graph**:
```html
[complete OG tags]
```

**Twitter Card**:
```html
[complete Twitter tags]
```

### Implementation Priority
1. [Highest priority change]
2. [Second priority]
3. [Third priority]
```

## Testing Tools
- Google Search Console (URL Inspection)
- Facebook Sharing Debugger
- Twitter Card Validator
- LinkedIn Post Inspector
- SEOmofo SERP Preview
- Portent SERP Preview Tool
