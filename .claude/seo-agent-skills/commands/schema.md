# /seo:schema Command

## Description
Generate JSON-LD structured data for a webpage based on its content and business type.

## Usage
```
/seo:schema [URL] [schema-type]
/seo:schema https://abuobaydatajjarrah.com
/seo:schema https://abuobaydatajjarrah.com medical
/seo:schema https://example.com/faq faqpage
```

## Schema Types Supported

| Type | Use Case | Key Properties |
|------|----------|----------------|
| `local` | Local businesses | Address, hours, geo |
| `medical` | Healthcare/Medical | Physician, MedicalBusiness |
| `faqpage` | FAQ pages | Question, Answer pairs |
| `article` | Blog posts/articles | Author, datePublished |
| `service` | Service pages | Service, provider |
| `product` | Product pages | Price, availability |
| `review` | Review aggregation | Rating, count |
| `video` | Video content | VideoObject |
| `breadcrumb` | Navigation | BreadcrumbList |
| `organization` | Company info | Organization |

## What It Does

1. Analyzes the page content
2. Determines appropriate schema types
3. Extracts relevant information
4. Generates valid JSON-LD
5. Provides implementation instructions

## Output Format

```markdown
# Schema Markup for [URL]

## Recommended Schema Types
1. [Type 1] - [Why it's recommended]
2. [Type 2] - [Why it's recommended]

---

## Generated JSON-LD

### [Schema Type 1]

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  ...complete schema...
}
</script>
```

### [Schema Type 2]

```html
<script type="application/ld+json">
{
  ...complete schema...
}
</script>
```

---

## Implementation

### Where to Place
Add this code to the `<head>` section of your HTML.

### For Astro Sites
```astro
---
// In your Layout or page component
---
<head>
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
</head>
```

### Validation
1. Copy the JSON-LD
2. Visit: https://search.google.com/test/rich-results
3. Paste and validate
4. Fix any errors

---

## Expected Rich Results
- [Feature 1 that may appear]
- [Feature 2 that may appear]
```

## Related Skills
- schema-markup-generator
