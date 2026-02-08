# Schema Markup Generator Skill

## Purpose
Generate JSON-LD structured data to help search engines understand your content and enable rich results in SERPs.

## Activation
Use when you need to:
- Add structured data to any webpage
- Enable rich snippets (reviews, FAQs, etc.)
- Improve entity recognition for AI/GEO
- Create medical/healthcare-specific schema
- Implement local business schema for Jordan

## Why Schema Matters

1. **Rich Results**: Star ratings, FAQs, how-tos in search results
2. **AI Understanding**: Helps LLMs parse and cite your content
3. **Knowledge Graph**: Connects your entity to Google's knowledge base
4. **Voice Search**: Enables better voice assistant answers
5. **Local SEO**: Improves local pack visibility

## Essential Schema Types

### 1. LocalBusiness / MedicalBusiness

For clinics, medical practices, local services:

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": "https://abuobaydatajjarrah.com/#organization",
  "name": "عيادة أبو عبيدة الجراح",
  "alternateName": ["Abu Ubaidah Clinic", "Dr. Mu'men Diraneyya Clinic"],
  "description": "عيادة جراحة عامة متخصصة في الجراحة بالمنظار في عمان، الأردن",
  "url": "https://abuobaydatajjarrah.com",
  "logo": "https://abuobaydatajjarrah.com/logo.png",
  "image": "https://abuobaydatajjarrah.com/clinic-image.jpg",
  "telephone": "+962799133299",
  "email": "info@abuobaydatajjarrah.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "13 Abdullah bin Jubair St.",
    "addressLocality": "عمان",
    "addressRegion": "Amman",
    "postalCode": "11191",
    "addressCountry": "JO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "31.9539",
    "longitude": "35.9106"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
      "opens": "10:00",
      "closes": "16:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Thursday",
      "opens": "10:00",
      "closes": "14:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/abuobaydatajjarrah",
    "https://www.instagram.com/abuobaydatajjarrah",
    "https://www.youtube.com/@abuobaydatajjarrah"
  ],
  "hasMap": "https://maps.google.com/?q=31.9539,35.9106"
}
```

### 2. Physician Schema

For individual doctor profiles:

```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "@id": "https://abuobaydatajjarrah.com/#physician",
  "name": "د. معمن الدرانية",
  "alternateName": ["Dr. Mu'men Diraneyya", "أبو عبيدة الجراح"],
  "description": "جراح عام متخصص في الجراحة بالمنظار مع خبرة 30 عامًا",
  "image": "https://abuobaydatajjarrah.com/dr-mumen.jpg",
  "telephone": "+962799133299",
  "url": "https://abuobaydatajjarrah.com",
  "medicalSpecialty": [
    {
      "@type": "MedicalSpecialty",
      "name": "General Surgery"
    },
    {
      "@type": "MedicalSpecialty",
      "name": "Laparoscopic Surgery"
    }
  ],
  "availableService": [
    {
      "@type": "MedicalProcedure",
      "name": "جراحة الفتق بالمنظار",
      "alternateName": "Laparoscopic Hernia Repair"
    },
    {
      "@type": "MedicalProcedure",
      "name": "استئصال المرارة بالمنظار",
      "alternateName": "Laparoscopic Cholecystectomy"
    }
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "Royal College of Surgeons of Edinburgh"
  },
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Ba'albek University"
  },
  "worksFor": {
    "@type": "MedicalBusiness",
    "@id": "https://abuobaydatajjarrah.com/#organization"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "13 Abdullah bin Jubair St.",
    "addressLocality": "عمان",
    "postalCode": "11191",
    "addressCountry": "JO"
  }
}
```

### 3. FAQPage Schema

For FAQ sections:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "كم تكلفة الكشفية؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "تكلفة الكشفية 25 دينار أردني، وتشمل الفحص الكامل والاستشارة الطبية."
      }
    },
    {
      "@type": "Question",
      "name": "ما هي ساعات عمل العيادة؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "العيادة مفتوحة من السبت إلى الأربعاء من 10 صباحاً حتى 4 مساءً، والخميس من 10 صباحاً حتى 2 ظهراً. مغلق يوم الجمعة."
      }
    },
    {
      "@type": "Question",
      "name": "هل تتوفر استشارات عن بعد؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "نعم، نوفر استشارات طبية عن بعد عبر الفيديو للمرضى الذين لا يستطيعون الحضور شخصياً."
      }
    }
  ]
}
```

### 4. Article Schema

For blog posts and educational content:

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "mainEntity": {
    "@type": "Article",
    "@id": "https://abuobaydatajjarrah.com/blog/hernia-symptoms#article",
    "headline": "أعراض الفتق وعلاماته - متى يجب زيارة الطبيب؟",
    "description": "تعرف على أعراض الفتق الشائعة وكيفية التعرف عليها، ومتى يجب عليك استشارة جراح متخصص",
    "image": "https://abuobaydatajjarrah.com/blog/hernia-symptoms/cover.jpg",
    "datePublished": "2024-01-15",
    "dateModified": "2024-06-20",
    "author": {
      "@type": "Person",
      "@id": "https://abuobaydatajjarrah.com/#physician",
      "name": "د. معمن الدرانية"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://abuobaydatajjarrah.com/#organization"
    },
    "inLanguage": "ar",
    "about": {
      "@type": "MedicalCondition",
      "name": "Hernia",
      "alternateName": "الفتق"
    }
  }
}
```

### 5. BreadcrumbList Schema

For navigation breadcrumbs:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "الرئيسية",
      "item": "https://abuobaydatajjarrah.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "الخدمات",
      "item": "https://abuobaydatajjarrah.com/services/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "جراحة الفتق",
      "item": "https://abuobaydatajjarrah.com/services/hernia-surgery/"
    }
  ]
}
```

### 6. VideoObject Schema

For embedded videos:

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "شرح عملية الفتق بالمنظار",
  "description": "الدكتور معمن الدرانية يشرح خطوات عملية الفتق بالمنظار ومميزاتها",
  "thumbnailUrl": "https://abuobaydatajjarrah.com/videos/hernia-thumbnail.jpg",
  "uploadDate": "2024-03-15",
  "duration": "PT5M30S",
  "contentUrl": "https://www.youtube.com/watch?v=XXXXX",
  "embedUrl": "https://www.youtube.com/embed/XXXXX",
  "publisher": {
    "@type": "Organization",
    "@id": "https://abuobaydatajjarrah.com/#organization"
  },
  "inLanguage": "ar"
}
```

### 7. Review/AggregateRating Schema

For testimonials:

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": "https://abuobaydatajjarrah.com/#organization",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "127"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "محمد أحمد"
      },
      "datePublished": "2024-06-01",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "تجربة ممتازة مع الدكتور معمن. العملية كانت ناجحة والتعافي كان سريعاً."
    }
  ]
}
```

### 8. Service Schema

For service pages:

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  "@id": "https://abuobaydatajjarrah.com/services/hernia-surgery/#service",
  "name": "جراحة الفتق بالمنظار",
  "alternateName": "Laparoscopic Hernia Repair",
  "description": "عملية جراحية طفيفة التوغل لإصلاح الفتق باستخدام تقنية المنظار",
  "procedureType": "SurgicalProcedure",
  "followup": "متابعة بعد أسبوع من العملية",
  "howPerformed": "من خلال فتحات صغيرة في البطن باستخدام أدوات جراحية دقيقة",
  "preparation": "صيام لمدة 8 ساعات قبل العملية",
  "status": "Available",
  "bodyLocation": "البطن",
  "provider": {
    "@type": "Physician",
    "@id": "https://abuobaydatajjarrah.com/#physician"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://abuobaydatajjarrah.com/book"
  }
}
```

## Implementation

### Method 1: Inline in HTML `<head>`
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  ... schema here ...
}
</script>
```

### Method 2: Multiple Schema Objects
```html
<script type="application/ld+json">
[
  { schema 1 },
  { schema 2 },
  { schema 3 }
]
</script>
```

### Method 3: @graph for Connected Entities
```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "MedicalBusiness", "@id": ".../#organization", ... },
    { "@type": "Physician", "@id": ".../#physician", "worksFor": { "@id": ".../#organization" } },
    { "@type": "WebSite", "@id": ".../#website", "publisher": { "@id": ".../#organization" } }
  ]
}
```

## Validation

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema.org Validator**: https://validator.schema.org/
3. **Google Search Console**: Check "Enhancements" section

## Output Format

```markdown
## Schema Markup for [Page URL]

### Recommended Schema Types
1. [Type 1] - [Purpose]
2. [Type 2] - [Purpose]

### Complete JSON-LD Code

```html
<script type="application/ld+json">
[complete schema here]
</script>
```

### Implementation Notes
- [Where to place]
- [Any dependencies]
- [Testing instructions]

### Expected Rich Results
- [List expected SERP enhancements]
```

## Common Mistakes to Avoid

1. **Wrong @type**: Use MedicalBusiness not just LocalBusiness for healthcare
2. **Missing @id**: Always include @id for entity linking
3. **Inaccurate data**: Schema must match visible page content
4. **Missing required fields**: Check schema.org for required properties
5. **Invalid JSON**: Use validators before deploying
6. **Keyword stuffing**: Don't stuff keywords in schema fields
