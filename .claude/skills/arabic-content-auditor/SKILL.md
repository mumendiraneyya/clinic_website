---
name: arabic-content-auditor
description: Audits Arabic website content for language quality, RTL rendering, spelling variant coverage, cultural appropriateness, and Arabic-specific SEO issues. Use when reviewing or auditing an existing Arabic website for content and technical quality.
---

# Arabic Content Auditor

Audits Arabic web content for language quality, RTL correctness, spelling variant coverage, and cultural fit. Designed to layer on top of the standard on-page-seo-auditor and content-quality-auditor skills with Arabic-specific checks.

## When to Use This Skill

- Auditing an existing Arabic website for quality issues
- Reviewing Arabic content before publishing
- Checking RTL rendering and mixed-direction content
- Verifying spelling variant coverage for target keywords
- Assessing cultural appropriateness for the target audience

## Audit Process

### Step 1: Language and Direction Audit

Check the page source and rendered output for:

**HTML-level:**
- `<html lang="ar">` or `<html lang="ar-JO">` present
- `<html dir="rtl">` present
- `<meta charset="UTF-8">` (required for Arabic characters)

**Content-level:**
- English/Latin text (URLs, emails, phone numbers, brand names) wrapped in `<span dir="ltr">` or `<bdi>`
- Numbers display correctly in context (Arabic-Indic ٠١٢ vs Western 012 — either is acceptable in Jordan, but be consistent)
- Punctuation marks are Arabic where appropriate: `،` not `,` and `؟` not `?` and `؛` not `;`

**CSS-level:**
- No hardcoded `left`/`right` positioning without RTL equivalents
- Logical properties used (`margin-inline-start` not `margin-left`)
- Text alignment defaults to right in RTL context
- Flexbox/Grid direction respects RTL (`flex-direction` flips automatically with `dir="rtl"`)

### Step 2: Spelling Variant Forgiveness

For each target keyword on the page:

1. Identify the correct (فصحى) spelling — confirm it's used in all visible content (headings, body, UI)
2. Check that NO misspellings appear in reader-facing text (ه where ة belongs, bare ا where أ/إ belongs)
3. Check that variant spellings ARE covered through technical mechanisms:
   - Schema `alternateName` includes common misspellings
   - FAQ schema `Question` fields use misspelled forms users actually type
   - `<meta name="keywords">` includes variant spellings
   - `llms.txt` / `llms-ar.txt` includes variants for AI indexing
4. Flag any visible misspelling as a grammar error to fix
5. Flag any keyword with zero technical forgiveness coverage as a missed SEO opportunity

**Scoring:**
- Correct grammar everywhere + variants in schema/meta: Pass
- Correct grammar but no technical forgiveness for variants: Warning
- Misspellings in visible content: Fail

### Step 3: Content Quality for Arabic

**Readability:**
- Sentences are not overly long (Arabic tends toward long sentences — flag any over 40 words)
- Paragraphs are short (3-5 sentences max)
- Diacritics (تشكيل) used only where ambiguity exists, not everywhere (over-diacritization looks unnatural)
- Medical terms explained in simple language on first use

**Tone:**
- Respectful address form used (أنتم not أنت for patient-facing content)
- No direct translation artifacts from English (e.g., "نحن متحمسون" — "we are excited" — sounds unnatural in Arabic medical context)
- Professional but approachable tone

**Cultural fit:**
- Gender-appropriate language where relevant
- Islamic greetings acceptable but not required (بسم الله الرحمن الرحيم at page top is common for medical sites in Jordan)
- Prices in JOD if mentioned
- Phone numbers in +962 format
- References to local institutions, not foreign ones, for trust

### Step 4: Technical Arabic SEO

**Meta tags:**
- Title tag: primary keyword in Arabic, under 55 characters, location included
- Meta description: Arabic, under 150 characters, includes CTA
- OG tags: `og:locale` set to `ar_JO`

**Schema markup:**
- `inLanguage` set to `ar` or `ar-JO`
- Arabic text in `name`, `description`, `address` fields
- No English-only schema on an Arabic page

**URL structure:**
- Arabic slugs are acceptable but Latin transliteration is more reliable for sharing
- If Arabic slugs used, ensure proper URL encoding
- Consistent slug strategy across the site

**hreflang:**
- If bilingual: `<link rel="alternate" hreflang="ar-JO" href="...">` and `<link rel="alternate" hreflang="en" href="...">`
- Self-referencing hreflang present
- x-default set to the primary language version

### Step 5: Accessibility in Arabic

- `lang="ar"` enables screen readers to use Arabic pronunciation
- Image alt text in Arabic, not English
- ARIA labels in Arabic
- Focus order follows RTL reading direction
- Skip-to-content link text in Arabic

## Audit Report Format

```
## Arabic Content Audit: [Page URL]

### Direction & Language: [Pass/Warn/Fail]
- [findings]

### Spelling Variant Coverage: [Pass/Warn/Fail]
- Target keyword: [keyword]
  - Formal form: [found/missing]
  - Variants covered: [list]
  - Variants missing: [list]

### Content Quality: [Pass/Warn/Fail]
- [findings]

### Technical Arabic SEO: [Pass/Warn/Fail]
- [findings]

### Accessibility: [Pass/Warn/Fail]
- [findings]

### Priority Fixes:
1. [highest impact fix]
2. [next fix]
3. [next fix]
```

## Validation Checklist

- [ ] `lang="ar"` or `lang="ar-JO"` on `<html>`
- [ ] `dir="rtl"` on `<html>`
- [ ] UTF-8 charset declared
- [ ] LTR content properly isolated
- [ ] Arabic punctuation used (،؟؛)
- [ ] Target keywords grammatically correct in all visible content
- [ ] Spelling variants covered via schema alternateName, FAQ schema, meta keywords
- [ ] No misspellings in reader-facing text
- [ ] No over-diacritization
- [ ] Respectful tone (أنتم)
- [ ] No translation artifacts
- [ ] Meta tags in Arabic with proper lengths
- [ ] Schema includes Arabic text and `inLanguage`
- [ ] Alt text in Arabic
- [ ] ARIA labels in Arabic

## Related Skills

- arabic-seo — technical RTL and spelling variant reference
- jordan-medical-seo — cultural and medical-specific checks
- on-page-seo-auditor — standard on-page audit (run first, then layer this)
- content-quality-auditor — CORE-EEAT audit (run alongside this)
- technical-seo-checker — standard technical checks (run first, then layer this)
