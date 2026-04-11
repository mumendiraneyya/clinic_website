# Arabic SEO Optimizer Skill

## Purpose
Optimize websites for Arabic-speaking audiences with attention to RTL formatting, dialect variations, cultural considerations, and Arabic search behavior.

## Activation
Use when you need to:
- Optimize content for Arabic search queries
- Handle RTL (right-to-left) formatting
- Understand Arabic dialect differences
- Adapt content for different Arab regions
- Create culturally appropriate Arabic content

## Arabic Search Market Overview

### Market Size
- 250+ million Arabic speakers globally
- Arabic is the 5th most spoken language worldwide
- 88% of searches in the Middle East are in Arabic
- Arabic content is <2% of the web (huge opportunity)
- 97% of MENA internet traffic is from mobile devices

### Key Markets by Region

| Region | Countries | Dialect | Key Characteristics |
|--------|-----------|---------|---------------------|
| Levant | Jordan, Lebanon, Syria, Palestine | شامي (Levantine) | Well-educated, price-conscious |
| Gulf (GCC) | Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman | خليجي (Gulf) | High purchasing power, brand-conscious |
| North Africa | Egypt, Morocco, Tunisia, Algeria, Libya | مصري/مغربي | Large population, diverse dialects |
| Iraq | Iraq | عراقي | Growing digital market |

## Arabic Keyword Strategy

### Dialect Considerations

Keywords vary significantly by region:

| Meaning | Standard Arabic (MSA) | Jordan/Levant | Saudi Arabia | Egypt |
|---------|----------------------|---------------|--------------|-------|
| Phone | هاتف محمول | موبايل | جوال | موبايل |
| Car | سيارة | سيارة | سيارة | عربية |
| I want | أريد | بدي | أبي/أبغى | عايز |
| How | كيف | كيف/شلون | وش/كيف | إزاي |
| Good | جيد | منيح | زين/حلو | كويس |
| Money | مال | مصاري | فلوس | فلوس |
| Now | الآن | هلق/هلأ | الحين | دلوقتي |

### Keyword Research for Arabic

```markdown
1. Start with MSA (Modern Standard Arabic)
2. Research regional dialect variations
3. Check informal spellings (higher volume)
4. Include transliterated terms (common in tech)
5. Consider Franco-Arab (3arabizi)
```

### Spelling Variations

Arabic has multiple acceptable spellings:

```markdown
Examples:
- With/without ال (definite article)
- With/without hamza: إ vs ا
- ة vs ه at word end
- Long vs short vowels
- With/without diacritics (تشكيل)

Example keyword variations:
- دكتور / الدكتور
- طبيب / طبيب أسنان / طبيب الأسنان
- عمان / عمّان (with/without shadda)
```

### Franco-Arab (3arabizi) Keywords

Some users search using Latin characters:

```markdown
3 = ع (ain)
7 = ح (ha)
5 = خ (kha)
8 = غ (ghain)
9 = ق (qaf)
2 = ء (hamza)

Example:
- "7abibat 3omri" = حبيبة عمري
- "mar7aba" = مرحبا
- "do3a2" = دعاء
```

## RTL (Right-to-Left) Implementation

### HTML Configuration

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- RTL CSS -->
  <link rel="stylesheet" href="styles-rtl.css">
</head>
```

### CSS for RTL

```css
/* Base RTL styles */
body {
  direction: rtl;
  text-align: right;
}

/* Flip layout elements */
.container {
  margin-right: auto;
  margin-left: 0;
}

/* Handle mixed content (numbers, English) */
.ltr-content {
  direction: ltr;
  unicode-bidi: embed;
}

/* Arabic-optimized fonts */
body {
  font-family: 'Cairo', 'Tajawal', 'IBM Plex Arabic', sans-serif;
}

/* Adjust for Arabic typography */
h1, h2, h3 {
  line-height: 1.6; /* Arabic needs more line height */
}

p {
  line-height: 1.8;
}

/* Flip icons and arrows */
.icon-arrow {
  transform: scaleX(-1);
}

/* Flexbox RTL */
.flex-container {
  flex-direction: row-reverse;
}
```

### Common RTL Issues

```markdown
❌ Issues to avoid:
- Text alignment defaulting to left
- Icons/arrows pointing wrong direction
- Unflipped layouts (sidebar on wrong side)
- Mixed LTR/RTL content breaking
- Number/date display issues
- Form input direction problems

✅ Proper handling:
- Explicit dir="rtl" on html
- CSS logical properties (start/end vs left/right)
- Proper unicode-bidi for mixed content
- Testing with actual Arabic content
```

### Mixed Content Handling

```html
<!-- Arabic text with English/numbers -->
<p>تأسست العيادة عام <span dir="ltr">1995</span> في عمّان</p>

<!-- Arabic with English brand names -->
<p>احجز موعدك عبر <span dir="ltr" class="brand">WhatsApp</span></p>

<!-- Phone numbers -->
<p>اتصل بنا: <bdo dir="ltr">+962 79 913 3299</bdo></p>
```

## Arabic Content Optimization

### Title Tags (Arabic)

```html
<!-- Structure: Primary Keyword - Secondary - Brand -->
<title>جراح عام في عمان - الدكتور معمن الدرانية | خبرة 30 عامًا</title>

<!-- Character limits: ~55 characters for Arabic -->
<!-- Arabic characters are wider, so fewer fit -->
```

### Meta Descriptions (Arabic)

```html
<meta name="description" content="جراح عام متخصص في عمان، الأردن.
خبرة 30 عامًا في الجراحة بالمنظار. زمالة كلية الجراحين الملكية.
احجز موعدك - 25 دينار فقط.">

<!-- Aim for ~145 characters in Arabic -->
```

### Heading Structure (Arabic)

```html
<h1>جراحة الفتق بالمنظار في عمان</h1>

<h2>ما هو الفتق؟</h2>

<h2>أنواع جراحة الفتق</h2>
<h3>الجراحة المفتوحة التقليدية</h3>
<h3>الجراحة بالمنظار</h3>

<h2>لماذا تختار عيادتنا؟</h2>

<h2>الأسئلة الشائعة</h2>
```

## Cultural Considerations

### Content Timing

```markdown
Ramadan:
- Plan campaigns around Ramadan
- Respect fasting hours in scheduling
- Create Ramadan-specific content
- Adjust call-to-action timing

Eid:
- Eid Al-Fitr (end of Ramadan)
- Eid Al-Adha (Hajj season)
- Holiday greetings appropriate

Friday:
- Many businesses closed
- Reduced activity on sites
- Not ideal for urgent CTAs

Religious Sensitivity:
- Avoid haram topics in ads
- Respect Islamic values
- Gender-appropriate imagery
- Halal certifications if applicable
```

### Trust Signals for Arab Markets

```markdown
High Value:
- Family-owned/operated
- Years of experience
- International certifications
- Religious/ethical compliance
- Community involvement
- Personal recommendations

Display prominently:
- Founder/doctor credentials
- Awards and recognitions
- Hospital affiliations
- Professional memberships
- Patient testimonials
- Physical location/address
```

### Content Style Preferences

```markdown
Arab audiences often prefer:
- Personal, relationship-focused content
- Emphasis on expertise and credentials
- Formal tone (more formal than English)
- Respect for hierarchy
- Family values messaging
- Success stories and testimonials

Avoid:
- Overly casual tone
- Pushy sales language
- Insensitive imagery
- Ignoring cultural norms
```

## Arabic SEO Checklist

### Technical

```markdown
□ HTML lang="ar" dir="rtl"
□ UTF-8 encoding
□ Arabic-optimized fonts loaded
□ RTL CSS implemented
□ Mixed content handled correctly
□ Mobile-responsive RTL
□ Arabic URL handling (or transliteration)
□ hreflang tags for Arabic versions
```

### On-Page

```markdown
□ Arabic title tag (55 chars max)
□ Arabic meta description (145 chars max)
□ Arabic H1 with keyword
□ Content in appropriate dialect
□ Proper Arabic punctuation
□ No translation errors
□ Native Arabic copywriting
□ Cultural appropriateness
```

### Keywords

```markdown
□ Research dialect variations
□ Include informal spellings
□ Consider Franco-Arab terms
□ Include MSA variations
□ Local modifiers (city names)
□ Long-tail Arabic queries
```

### Local

```markdown
□ Arabic Google Business Profile
□ Local Arabic directories
□ Arabic reviews encouraged
□ NAP in Arabic and English
□ Local Arabic content
□ Regional targeting correct
```

## Output Format

```markdown
## Arabic SEO Optimization Report

### Site Analyzed
**Domain**: [domain]
**Primary Language**: [Arabic dialect]
**Target Market**: [Jordan/GCC/Egypt/etc.]

---

### RTL Implementation: [Score]/100

| Check | Status |
|-------|--------|
| HTML dir="rtl" | ✅/❌ |
| CSS RTL styles | ✅/❌ |
| Font optimization | ✅/❌ |
| Mixed content | ✅/❌ |
| Mobile RTL | ✅/❌ |

**Issues Found:**
- [Issue 1]
- [Issue 2]

---

### Arabic Content Quality

**Dialect Used**: [MSA/Levantine/Gulf/etc.]
**Target Audience Match**: [Yes/No]

**Issues:**
- [Content issue 1]
- [Content issue 2]

---

### Arabic Keyword Analysis

**Current Keywords:**
| Keyword | Volume | Dialect Match |
|---------|--------|---------------|
| | | |

**Recommended Keywords:**
| Keyword | Volume | Priority |
|---------|--------|----------|
| | | |

**Dialect Variations to Add:**
- [Variation 1]
- [Variation 2]

---

### Cultural Optimization

**Appropriate for Market**: [Yes/No]
**Issues:**
- [Cultural issue if any]

**Recommendations:**
- [Recommendation 1]
- [Recommendation 2]

---

### Action Items

1. **Technical RTL**
   - [Specific fix]

2. **Content**
   - [Content update]

3. **Keywords**
   - [Keyword addition]
```

## Arabic SEO Resources

### Fonts
- Cairo (Google Fonts)
- Tajawal (Google Fonts)
- IBM Plex Arabic
- Noto Kufi Arabic
- Amiri (for traditional look)

### Tools
- Google Keyword Planner (Arabic)
- Keyword Tool.io (Arabic support)
- Google Trends (regional data)
- Ahrefs (Arabic keywords)
- SEMrush (Arabic databases)
