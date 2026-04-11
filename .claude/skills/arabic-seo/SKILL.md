---
name: arabic-seo
description: Arabic language SEO and GEO optimization covering RTL markup, common misspellings, dialect variations, and Arabic-specific search behavior. Use when optimizing Arabic content for search engines and AI systems.
---

# Arabic SEO & GEO

Optimizes Arabic-language websites for search engines and AI systems, covering RTL technical requirements, Arabic typography pitfalls, and dialect-aware keyword strategy.

## When to Use This Skill

- Auditing or creating Arabic-language web content
- Fixing RTL layout and markup issues
- Building keyword lists that account for Arabic spelling variations
- Optimizing meta tags, titles, and descriptions in Arabic
- Making Arabic content citable by AI systems (GEO)
- Reviewing hreflang and language targeting setup

## RTL Technical Requirements

### HTML and CSS

- Set `dir="rtl"` on `<html>` or the nearest container element
- Set `lang="ar"` (or `lang="ar-JO"` for Jordanian Arabic) on `<html>`
- Use CSS logical properties (`margin-inline-start`, `padding-inline-end`) instead of physical (`margin-left`, `margin-right`)
- Flip navigation, breadcrumbs, and icon directions
- Ensure form inputs, placeholders, and validation messages are RTL
- Check that `text-align` defaults to `right` in RTL context
- Use `direction: rtl` in CSS only as fallback; prefer the HTML `dir` attribute

### Common RTL Bugs to Check

- Icons pointing the wrong direction (arrows, chevrons, back buttons)
- Progress bars filling right-to-left
- Misaligned form labels
- Mixed LTR/RTL content not wrapped in `<bdi>` or using `dir="auto"`
- Phone numbers, URLs, and code snippets breaking RTL flow (wrap in `<span dir="ltr">`)
- CSS `float: left` not flipped to `float: right`
- Absolute positioning using `left`/`right` instead of `inset-inline-start`/`inset-inline-end`

### Structured Data for Arabic

- Use `"inLanguage": "ar"` in JSON-LD
- For Jordan-targeted content: `"inLanguage": "ar-JO"`
- Provide `"name"` and `"description"` in Arabic within schema markup
- For `MedicalBusiness` or `Physician` schema, include Arabic `"name"` and `"address"`

## Arabic Spelling Variations and Search Forgiveness

Arabic search queries frequently contain predictable spelling errors. The principle: **always write grammatically correct Arabic, but make the site forgivable to incorrect searches** through technical SEO mechanisms — never by inserting wrong spellings into visible content.

### Common User Misspellings to Be Forgiving Of

#### Hamza Variations (أ إ آ ا)

| Correct | What Users Type | Example |
|---------|----------------|---------|
| أطفال (children) | اطفال | طبيب أطفال → user types: طبيب اطفال |
| إنفلونزا (influenza) | انفلونزا | علاج إنفلونزا → user types: علاج انفلونزا |
| أسنان (teeth) | اسنان | طبيب أسنان → user types: طبيب اسنان |
| أذن (ear) | اذن | طبيب أذن → user types: طبيب اذن |
| إسهال (diarrhea) | اسهال | علاج إسهال → user types: علاج اسهال |
| آلام (pain) | الام, ألام | آلام الظهر → user types: الام الظهر |

#### Ta Marbuta vs Ha (ة vs ه)

| Correct | What Users Type | Example |
|---------|----------------|---------|
| عيادة (clinic) | عياده | عيادة الدكتور → user types: عياده الدكتور |
| صحة (health) | صحه | صحة الطفل → user types: صحه الطفل |
| وصفة (prescription) | وصفه | وصفة طبية → user types: وصفه طبيه |
| تغذية (nutrition) | تغذيه | تغذية الأطفال → user types: تغذيه الاطفال |
| حساسية (allergy) | حساسيه | حساسية الجلد → user types: حساسيه الجلد |

#### Other Common Variations

| Type | Correct | What Users Type | Notes |
|------|---------|----------------|-------|
| ي vs ى | يعاني (suffers) | يعانى | Final-ya confusion |
| ئ vs ي | طوارئ (emergency) | طواري | Hamza on ya |
| ؤ vs و | مؤمن (Mu'men) | مومن | Hamza on waw |
| Double letters | تخصّص (specialty) | تخصص | Missing shadda |
| ذ vs ز | أذن (ear) | أزن | Regional pronunciation |
| ث vs ت | ثلاثة (three) | تلاتة | Dialect influence |

### Forgiveness Strategy (How to Catch Misspelled Searches Without Wrong Grammar)

The goal: search engines and AI systems index your page for misspelled queries, but your visible content stays grammatically correct.

**1. Schema `alternateName` — best mechanism for variant spellings:**
```json
{
  "@type": "Physician",
  "name": "د. مؤمن ديرانية",
  "alternateName": ["د. مومن ديرانيه", "دكتور مؤمن ديرانية", "حكيم مومن ديرانيه"]
}
```
```json
{
  "@type": "MedicalSpecialty",
  "name": "طب الأطفال",
  "alternateName": ["طب الاطفال", "دكتور اطفال"]
}
```

**2. FAQ schema with question variants — users ask in misspelled forms:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "ما هي اعراض الانفلونزا عند الاطفال؟",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "من أبرز أعراض الإنفلونزا عند الأطفال: ..."
    }
  }]
}
```
The question uses the misspelled form (how users actually type it). The answer uses correct grammar.

**3. `<meta name="keywords">` — still indexed by some Arabic search engines:**
```html
<meta name="keywords" content="طبيب اطفال عمان, طبيب أطفال عمّان, دكتور اطفال, حكيم اطفال">
```

**4. `llms.txt` and `llms-ar.txt` — for AI system indexing:**
Include variant spellings in the LLM-facing files that AI crawlers read. These are not user-visible content.

**5. Sitemap `<image:caption>` and image alt in schema — not visible on page:**
```xml
<image:caption>عياده دكتور اطفال في عمان</image:caption>
```

**6. Internal search / site search synonyms:**
If the site has search, configure synonym mappings: اطفال → أطفال, عياده → عيادة, etc.

### What NOT to Do

- Do NOT insert misspelled Arabic into visible headings, body text, or UI
- Do NOT use ه where ة is correct in any reader-facing content
- Do NOT strip hamza from visible text to "cover both forms"
- Do NOT create separate pages for misspelled variants (duplicate content)
- Do NOT use hidden text or CSS-hidden spans with misspellings (search engines penalize this)

## Arabic Meta Tag Guidelines

### Title Tags

- Keep under 60 characters (Arabic characters are wider, so aim for 50-55)
- Put the primary keyword first
- Use `|` or `–` as separators (avoid `-` which can confuse RTL rendering)
- Include location for local SEO: `طبيب أطفال في عمّان | د. [Name]`

### Meta Descriptions

- Keep under 150 characters for Arabic (displays shorter than Latin text)
- Include a call to action: `احجز موعدك الآن` (Book your appointment now)
- Use the primary keyword and one variant naturally

### Open Graph

- Set `og:locale` to `ar_JO` for Jordanian Arabic
- Provide Arabic `og:title` and `og:description`
- Ensure OG images have Arabic text rendered correctly (RTL, proper font)

## Arabic GEO (AI Citation Optimization)

For Arabic content to be cited by AI systems:

- Write clear, direct definitions: `[Term] هو [definition]` format
- Use numbered lists for procedures and steps
- Provide bilingual medical terms: `الحساسية (Allergy)` — AI systems cross-reference both
- Structure FAQ sections with `<details>` or FAQ schema in Arabic
- Include authoritative framing: `وفقاً لمنظمة الصحة العالمية` (According to WHO)
- Write quotable one-sentence summaries at the start of each section

## Validation Checklist

- [ ] `dir="rtl"` and `lang="ar"` (or `ar-JO`) set on `<html>`
- [ ] No broken RTL layout (icons, navigation, forms)
- [ ] LTR content (numbers, URLs, English terms) wrapped properly
- [ ] Title tag under 55 Arabic characters with primary keyword first
- [ ] Meta description under 150 Arabic characters with CTA
- [ ] Schema markup includes `"inLanguage": "ar"` and Arabic text
- [ ] Common spelling variants covered via schema `alternateName` and FAQ schema
- [ ] No misspellings in visible content — all reader-facing text is grammatically correct
- [ ] FAQ schema questions use common misspelled forms, answers use correct grammar
- [ ] OG tags set with `ar_JO` locale and Arabic text
- [ ] hreflang tags present if multilingual (`ar-JO` for Arabic, `en` for English)

## Related Skills

- keyword-research — extend with Arabic variant keywords
- on-page-seo-auditor — apply Arabic-specific checks on top of standard audit
- schema-markup-generator — add Arabic language properties
- meta-tags-optimizer — apply Arabic length and RTL guidelines
- geo-content-optimizer — apply Arabic citation patterns
