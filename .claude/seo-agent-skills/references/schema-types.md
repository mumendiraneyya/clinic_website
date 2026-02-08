# Schema.org Types Reference

## Common Schema Types for SEO

### Organization Types

| Type | Use Case | Rich Result |
|------|----------|-------------|
| Organization | General business | Knowledge Panel |
| LocalBusiness | Physical location | Local Pack |
| MedicalBusiness | Healthcare facility | Local Pack |
| Restaurant | Food service | Local Pack + Menu |
| Store | Retail | Local Pack |
| ProfessionalService | Services | Local Pack |

### Person Types

| Type | Use Case | Rich Result |
|------|----------|-------------|
| Person | Individual | Knowledge Panel |
| Physician | Doctor | Medical rich results |
| Author | Content creator | Article bylines |

### Content Types

| Type | Use Case | Rich Result |
|------|----------|-------------|
| Article | Blog/news | Article rich result |
| NewsArticle | News content | Top Stories |
| BlogPosting | Blog posts | Article snippet |
| HowTo | Instructions | How-to rich result |
| FAQPage | Q&A pages | FAQ rich result |
| Recipe | Recipes | Recipe card |
| Review | Reviews | Review snippet |
| Product | Products | Product snippet |
| Event | Events | Event listing |
| Course | Online courses | Course rich result |

### Navigation Types

| Type | Use Case | Rich Result |
|------|----------|-------------|
| BreadcrumbList | Breadcrumbs | Breadcrumb trail |
| WebSite | Site-wide | Sitelinks search box |
| WebPage | Any page | General markup |
| ItemList | Lists | Carousel |

### Media Types

| Type | Use Case | Rich Result |
|------|----------|-------------|
| VideoObject | Videos | Video carousel |
| ImageObject | Images | Image search |
| ImageGallery | Photo galleries | Image carousel |

## Healthcare-Specific Schema

### MedicalBusiness
```json
{
  "@type": "MedicalBusiness",
  "name": "Clinic Name",
  "medicalSpecialty": "General Surgery",
  "address": {},
  "telephone": "",
  "openingHours": ""
}
```

### Physician
```json
{
  "@type": "Physician",
  "name": "Dr. Name",
  "medicalSpecialty": [],
  "availableService": [],
  "memberOf": {},
  "alumniOf": {}
}
```

### MedicalProcedure
```json
{
  "@type": "MedicalProcedure",
  "name": "Procedure Name",
  "procedureType": "SurgicalProcedure",
  "bodyLocation": "",
  "howPerformed": "",
  "preparation": "",
  "followup": ""
}
```

### MedicalCondition
```json
{
  "@type": "MedicalCondition",
  "name": "Condition Name",
  "associatedAnatomy": {},
  "cause": {},
  "possibleTreatment": {},
  "riskFactor": [],
  "signOrSymptom": []
}
```

## Required Properties by Type

### LocalBusiness (Minimum)
```json
{
  "@type": "LocalBusiness",
  "name": "Required",
  "address": "Required",
  "@id": "Recommended"
}
```

### FAQPage (Minimum)
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Required",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Required"
      }
    }
  ]
}
```

### Article (Minimum)
```json
{
  "@type": "Article",
  "headline": "Required",
  "image": "Required",
  "datePublished": "Required",
  "author": "Recommended"
}
```

### Product (Minimum)
```json
{
  "@type": "Product",
  "name": "Required",
  "offers": {
    "@type": "Offer",
    "price": "Required",
    "priceCurrency": "Required"
  }
}
```

## @id Best Practices

Use @id to connect related entities:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://site.com/#organization",
      "name": "Company Name"
    },
    {
      "@type": "WebSite",
      "@id": "https://site.com/#website",
      "publisher": { "@id": "https://site.com/#organization" }
    },
    {
      "@type": "WebPage",
      "@id": "https://site.com/page/#webpage",
      "isPartOf": { "@id": "https://site.com/#website" }
    }
  ]
}
```

## Rich Results Eligibility

| Schema Type | Potential Rich Result |
|-------------|----------------------|
| FAQPage | Accordion FAQs in SERP |
| HowTo | Step-by-step with images |
| LocalBusiness | Local pack, knowledge panel |
| Product | Price, rating in snippet |
| Review | Star rating in snippet |
| Recipe | Recipe card with image |
| Event | Event listing |
| Video | Video carousel |
| Article | Enhanced article snippet |
| BreadcrumbList | Breadcrumb trail |

## Testing and Validation

1. **Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Validator**: https://validator.schema.org/
3. **Google Search Console**: Enhancements section

## Common Errors to Avoid

1. Wrong @type for business
2. Missing required properties
3. Invalid JSON syntax
4. Data doesn't match page content
5. Using deprecated properties
6. Missing @id for entity linking
7. Incorrect date formats (use ISO 8601)
8. Invalid price/currency formats
