---
name: jordan-medical-seo
description: SEO and GEO optimization for medical/doctor websites targeting Jordan. Covers Jordanian Arabic dialect, local search behavior, medical schema for Jordan, cultural trust signals, and healthcare-specific keyword patterns. Use when optimizing a medical practice website for Jordanian audience.
---

# Jordan Medical SEO & GEO

Optimizes medical practice websites for Jordanian patients searching in Arabic. Covers local search patterns, Jordanian dialect keywords, medical schema markup, cultural trust signals, and healthcare regulations.

## When to Use This Skill

- Optimizing a doctor or clinic website targeting patients in Jordan
- Building keyword strategy for medical services in Jordanian Arabic
- Creating or auditing medical schema markup for a Jordan-based practice
- Writing medical content that resonates with Jordanian patients
- Setting up local SEO for a clinic in Amman or other Jordanian cities

## Jordanian Arabic Dialect Keywords

Jordanian patients search using a mix of formal Arabic (فصحى) and Jordanian dialect (عامية أردنية). Target both.

### Common Medical Search Patterns

| Formal Arabic | Jordanian Dialect | English | Search Context |
|--------------|-------------------|---------|----------------|
| طبيب | دكتور, حكيم | Doctor | حكيم is colloquial, very common in search |
| عيادة | عيادة, كلينيك | Clinic | كلينيك (transliteration) used by younger demographic |
| موعد | موعد, أبوينتمنت | Appointment | أبوينتمنت rare but exists |
| فحص طبي | فحص, تشييك | Checkup | تشييك (from "check") common in speech |
| أشعة | أشعة, صورة | X-ray/imaging | صورة (image) commonly used for any imaging |
| تحاليل | تحاليل, فحوصات | Lab tests | Both widely used |
| وصفة طبية | وصفة, روشتة | Prescription | روشتة less common in Jordan than Egypt |
| حقنة | إبرة | Injection | إبرة (needle) is the Jordanian term |
| غرز | قطب, خياطة | Stitches | قطب more common in Jordan |

### Jordanian Location Keywords

Patients search with location qualifiers. Common patterns:

- `دكتور [specialty] في عمان` (doctor [specialty] in Amman)
- `أفضل دكتور [specialty] عمان` (best doctor [specialty] Amman)
- `عيادة [specialty] [neighborhood]` (clinic [specialty] [neighborhood])
- `دكتور [specialty] قريب مني` (doctor [specialty] near me)

Key Amman neighborhoods for local SEO:
عبدون, الشميساني, خلدا, الصويفية, جبل عمان, الرابية, تلاع العلي, الجبيهة, مرج الحمام, الدوار السابع, الدوار الخامس, ضاحية الرشيد, طبربور, أبو نصير, الزرقاء, إربد

### Medical Specialty Keywords (Jordan-specific)

| Specialty | Formal | Jordanian Search Terms |
|-----------|--------|----------------------|
| Pediatrics | طب الأطفال | دكتور اطفال, حكيم اطفال, طبيب اطفال عمان |
| Dermatology | طب الجلدية | دكتور جلدية, طبيب جلدية وتجميل |
| Orthopedics | جراحة العظام | دكتور عظام, دكتور عظام ومفاصل |
| ENT | أنف وأذن وحنجرة | دكتور انف واذن, دكتور حنجرة |
| Cardiology | أمراض القلب | دكتور قلب, طبيب قلب وشرايين |
| Ophthalmology | طب العيون | دكتور عيون, طبيب عيون |
| General Practice | طب عام | دكتور عام, طبيب عام |
| Internal Medicine | الباطنية | دكتور باطنية, طبيب باطني |

## Medical Schema Markup for Jordan

### Physician Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "د. [Name]",
  "alternateName": "Dr. [Name in English]",
  "medicalSpecialty": "[Specialty]",
  "inLanguage": "ar-JO",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "عمّان",
    "addressRegion": "محافظة العاصمة",
    "addressCountry": "JO",
    "streetAddress": "[Street in Arabic]"
  },
  "telephone": "+962-[number]",
  "availableService": {
    "@type": "MedicalProcedure",
    "name": "[Service in Arabic]"
  },
  "currenciesAccepted": "JOD",
  "paymentAccepted": "نقدي, فيزا, ماستركارد",
  "openingHoursSpecification": [],
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "",
    "longitude": ""
  }
}
```

### Key Schema Properties for Jordan

- Use `"JO"` for `addressCountry`
- Use `"JOD"` for `currenciesAccepted`
- Phone format: `+962-X-XXX-XXXX`
- Include both Arabic and English `name`/`alternateName`
- Add `"areaServed"` with city/neighborhood names in Arabic
- Include `"hasMap"` with Google Maps link (Jordanians rely heavily on Google Maps)
- Add `"sameAs"` with Facebook page (primary social platform in Jordan for medical practices)

## Cultural Trust Signals

Jordanian patients look for specific trust indicators:

### Credentials and Authority

- Display medical degree and university: `بكالوريوس طب وجراحة – الجامعة الأردنية`
- Board certifications: `البورد الأردني`, `البورد العربي`, `الزمالة البريطانية`
- Hospital affiliations: mention well-known hospitals (المستشفى الإسلامي, مستشفى الخالدي, المركز العربي الطبي, مستشفى الأردن, مستشفى الاستقلال)
- Years of experience: Jordanians value seniority
- Professional memberships: نقابة الأطباء الأردنية (Jordan Medical Association)

### Social Proof

- Google Reviews are the primary trust signal — encourage and display them
- Facebook page with active engagement
- Patient testimonials (with permission) in Arabic
- "Before and after" for relevant specialties (dermatology, orthopedics)

### Practical Information Patients Expect

- Exact location with Google Maps embed and landmark references (Jordanians navigate by landmarks: "مقابل مستشفى الخالدي", "بجانب بنك الإسكان")
- Working hours including Friday/Saturday status (Friday is the weekend day)
- Whether walk-ins are accepted: `بدون موعد مسبق` or `يلزم حجز موعد`
- Insurance accepted: list specific insurers (شركة التأمين الأردنية, ميدغلف, الشرق العربي)
- Parking availability
- Phone number prominently displayed (Jordanians prefer calling over online booking)

## Content Strategy for Medical Websites in Jordan

### Blog/Article Topics That Perform Well

- Seasonal health topics: `الإنفلونزا في الشتاء`, `ضربة الشمس في الصيف`
- Common conditions with home remedies: `علاج الزكام في البيت`
- "When to see a doctor" articles: `متى يجب زيارة الطبيب`
- Medication guides: `استخدامات [medication name]`
- Child health (very high search volume in Jordan): `تطعيمات الأطفال في الأردن`
- Insurance and cost questions: `كم سعر الكشفية`, `هل التأمين يغطي`

### Content Tone

- Professional but warm — Jordanian patients expect a personal touch
- Use "أنتم" (plural you) for respect, not "أنت" (singular)
- Avoid overly clinical language — explain in simple terms
- Include disclaimers: `هذا المحتوى لأغراض تثقيفية ولا يغني عن استشارة الطبيب`

### GEO for Medical Content

- Start articles with a clear, quotable definition
- Use `سؤال وجواب` (Q&A) format — maps well to AI citation
- Include bilingual terms: `السكري (Diabetes)` — helps AI cross-reference
- Cite Jordanian health authorities: وزارة الصحة الأردنية, المجلس الطبي الأردني
- Reference WHO and international guidelines with Arabic translations

## Local SEO Checklist for Jordan

- [ ] Google Business Profile claimed and fully filled in Arabic
- [ ] NAP (Name, Address, Phone) consistent across website, GBP, and directories
- [ ] Listed on Jordanian directories: Altibbi (الطبي), Webteb, Tabibi
- [ ] Facebook page active with clinic info matching website
- [ ] Schema markup with `Physician` or `MedicalBusiness` type
- [ ] Location pages for each clinic branch (if multiple)
- [ ] Google Maps embed on contact page
- [ ] Phone number clickable (`tel:+962...`) and prominent
- [ ] Working hours accurate including Fridays
- [ ] Insurance list up to date
- [ ] Patient reviews strategy in place (Google Reviews priority)
- [ ] Content covers top medical search queries for the specialty
- [ ] Both formal and dialect keywords present in content

## Related Skills

- arabic-seo — Arabic language technical requirements (RTL, spelling variants)
- keyword-research — extend with Jordanian medical keyword patterns
- schema-markup-generator — use Jordan-specific medical schema templates
- on-page-seo-auditor — add Jordan medical trust signal checks
- geo-content-optimizer — apply Arabic medical citation patterns
- technical-seo-checker — verify RTL and language markup
