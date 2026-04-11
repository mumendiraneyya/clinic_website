# /seo:meta Command

## Description
Optimize meta tags (title, description, Open Graph, Twitter cards) for a webpage.

## Usage
```
/seo:meta [URL]
/seo:meta https://abuobaydatajjarrah.com
/seo:meta https://abuobaydatajjarrah.com/services/hernia
```

## What It Does

1. Analyzes current meta tags
2. Evaluates against best practices
3. Generates optimized alternatives
4. Provides complete implementation code

## Output Format

```markdown
# Meta Tags Optimization for [URL]

## Current State Analysis

### Title Tag
**Current**: [current title]
**Length**: [X] characters
**Issues**:
- [Issue 1]
- [Issue 2]

### Meta Description
**Current**: [current description or "Missing"]
**Length**: [X] characters
**Issues**:
- [Issue 1]

### Open Graph
**Status**: [Complete/Partial/Missing]
**Issues**:
- [Issue 1]

### Twitter Cards
**Status**: [Complete/Partial/Missing]

---

## Optimized Meta Tags

### Title Tag (Arabic)
```html
<title>جراحة عامة في عمان - الدكتور معمن الدرانية | خبرة 30 عامًا</title>
```
**Length**: [X] characters ✅

### Title Tag (English) - if applicable
```html
<title>General Surgery in Amman - Dr. Mu'men Diraneyya | 30 Years Experience</title>
```

### Meta Description (Arabic)
```html
<meta name="description" content="جراح عام متخصص في عمان. خبرة 30 عامًا في الجراحة بالمنظار. زمالة كلية الجراحين الملكية. احجز موعدك - 25 دينار فقط.">
```
**Length**: [X] characters ✅

### Complete Meta Block
```html
<!-- Primary Meta Tags -->
<title>[optimized title]</title>
<meta name="title" content="[optimized title]">
<meta name="description" content="[optimized description]">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="[URL]">
<meta property="og:title" content="[title]">
<meta property="og:description" content="[description]">
<meta property="og:image" content="[image URL]">
<meta property="og:locale" content="ar_JO">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="[URL]">
<meta name="twitter:title" content="[title]">
<meta name="twitter:description" content="[description]">
<meta name="twitter:image" content="[image URL]">

<!-- Canonical -->
<link rel="canonical" href="[canonical URL]">
```

---

## Image Requirements

**OG/Twitter Image:**
- Size: 1200 x 630 pixels
- Format: JPG or PNG
- Max size: 8MB
- Include: Brand + key message

---

## Implementation Notes
1. [Specific note for this page]
2. [Another note]
```

## Related Skills
- meta-tags-optimizer
