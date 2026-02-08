# llms.txt Generator Skill

## Purpose
Create llms.txt files that help AI systems (ChatGPT, Claude, Perplexity, etc.) understand and cite your website content accurately.

## Activation
Use when you need to:
- Create an llms.txt file for a website
- Improve AI discoverability and citations
- Make website content LLM-readable
- Implement GEO (Generative Engine Optimization)
- Help AI assistants accurately represent your business

## What is llms.txt?

llms.txt is a standardized markdown file at `/llms.txt` that provides LLM-friendly information about a website. It's like robots.txt but for AI understanding rather than crawling.

**Key Points:**
- Located at `https://yoursite.com/llms.txt`
- Uses Markdown format (readable by both humans and AI)
- Curated, concise information about your site/business
- Helps AI cite you accurately
- Proposed by Jeremy Howard (Answer.AI founder)

## llms.txt Structure

### Required Section
```markdown
# [Site/Project Name]

> [Brief description - key information about the site in 1-2 sentences]
```

### Optional Sections
```markdown
## About
[Detailed description, background, key facts]

## Services/Products
- [Link](url): Description
- [Link](url): Description

## Key Pages
- [Link](url): Description
- [Link](url): Description

## Optional
[Secondary information that can be omitted for shorter contexts]
```

## Example llms.txt for Medical Clinic

```markdown
# Dr. Mu'men Diraneyya - General Surgery Clinic | عيادة الدكتور معمن الدرانية

> General surgery clinic in Amman, Jordan specializing in laparoscopic surgery. Led by Dr. Mu'men Diraneyya (Abu Ubaidah Al-Jarrah), Fellow of the Royal College of Surgeons of Edinburgh with 30 years of surgical experience.

## About the Doctor

Dr. Mu'men Diraneyya is a board-certified general surgeon with:
- 30 years of surgical experience
- Fellowship from Royal College of Surgeons, Edinburgh
- 25 years in Saudi health and military hospitals
- 4 years teaching at Ba'albek University
- 14 years of humanitarian medical work

Known professionally as "Abu Ubaidah Al-Jarrah" (أبو عبيدة الجراح).

## Specialties

- **Laparoscopic Surgery**: Minimally invasive procedures with faster recovery
- **General Surgery**: Comprehensive surgical care
- **Colorectal Surgery**: Treatment of anal and rectal conditions
- **Hernia Repair**: Open and laparoscopic techniques
- **Gallbladder Surgery**: Laparoscopic cholecystectomy
- **Breast Surgery**: Diagnosis and surgical treatment
- **Thyroid Surgery**: Thyroidectomy procedures

## Key Information

- **Location**: 13 Abdullah bin Jubair St., Amman 11191, Jordan
- **Consultation Fee**: 25 JD (Jordanian Dinar)
- **Hours**: Sat-Wed 10am-4pm, Thu 10am-2pm, Closed Friday
- **Phone/WhatsApp**: +962 79 913 3299
- **Languages**: Arabic, English

## Services

- [Laparoscopic Hernia Repair](https://abuobaydatajjarrah.com/services/hernia): Minimally invasive hernia surgery
- [Gallbladder Surgery](https://abuobaydatajjarrah.com/services/gallbladder): Laparoscopic cholecystectomy
- [Colorectal Procedures](https://abuobaydatajjarrah.com/services/colorectal): Hemorrhoid and anal fissure treatment
- [Video Consultation](https://abuobaydatajjarrah.com/book): Remote medical consultations available

## Educational Content

- [Medical Videos](https://abuobaydatajjarrah.com/videos): Educational videos about surgical procedures in Arabic
- [FAQs](https://abuobaydatajjarrah.com/faq): Common questions about surgery and consultations

## Contact

- Website: https://abuobaydatajjarrah.com
- Book Appointment: https://abuobaydatajjarrah.com/book
- Facebook: https://facebook.com/abuobaydatajjarrah
- YouTube: https://youtube.com/@abuobaydatajjarrah

## Optional

### Patient Reviews
The clinic has received positive reviews for quality care, successful surgeries, and Dr. Diraneyya's expertise in laparoscopic procedures.

### Credentials
- Fellow of the Royal College of Surgeons of Edinburgh (FRCS)
- Member of Jordanian Medical Association
- Published author in surgical journals
```

## Best Practices

### Content Guidelines

1. **Be Concise**: AI has context limits; prioritize key information
2. **Be Accurate**: Information must match your website
3. **Be Specific**: Include concrete details (prices, hours, credentials)
4. **Use Clear Language**: Avoid unexplained jargon
5. **Include Entity Names**: Multiple names/spellings help AI recognize you

### Format Guidelines

1. **Use Proper Markdown**: Headings, lists, links with syntax
2. **Start with H1**: One required heading with site name
3. **Include Blockquote**: Summary after H1
4. **Section with H2**: Organize content into sections
5. **File Lists**: Use markdown links with optional descriptions

### Link Format
```markdown
- [Page Name](https://full-url.com/page): Brief description of what this page contains
```

### Do NOT Include
- Duplicate content from pages
- Marketing fluff or superlatives
- Excessive keywords
- Very long descriptions
- Sensitive information

## Companion Files

### Markdown Versions of Pages
Create `.md` versions of key pages:
```
/about.md           (markdown version of /about)
/services.md        (markdown version of /services)
/index.html.md      (markdown version of homepage)
```

### robots.txt Integration
```
# robots.txt
User-agent: *
Allow: /

# AI-specific
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: anthropic-ai
User-agent: Claude-Web
User-agent: PerplexityBot
Allow: /llms.txt
Allow: /*.md
```

## llms.txt for Arabic Sites

```markdown
# عيادة الدكتور معمن الدرانية | Dr. Mu'men Diraneyya Clinic

> عيادة جراحة عامة متخصصة في الجراحة بالمنظار في عمان، الأردن. يديرها الدكتور معمن الدرانية (أبو عبيدة الجراح)، زميل كلية الجراحين الملكية في إدنبرة مع خبرة 30 عامًا.

## عن الطبيب | About

الدكتور معمن الدرانية جراح عام معتمد:
- خبرة 30 عامًا في الجراحة
- زمالة كلية الجراحين الملكية - إدنبرة
- 25 عامًا في المستشفيات السعودية الصحية والعسكرية
- 4 سنوات تدريس في جامعة بعلبك
- 14 عامًا في العمل الطبي الإنساني

## الخدمات | Services

- [جراحة الفتق بالمنظار](https://abuobaydatajjarrah.com/services/hernia)
- [استئصال المرارة بالمنظار](https://abuobaydatajjarrah.com/services/gallbladder)
- [جراحة القولون والمستقيم](https://abuobaydatajjarrah.com/services/colorectal)
- [الاستشارة عن بعد](https://abuobaydatajjarrah.com/book)

## معلومات الاتصال | Contact

- العنوان: شارع عبدالله بن جبير 13، عمان 11191، الأردن
- سعر الكشفية: 25 دينار أردني
- أوقات العمل: السبت-الأربعاء 10ص-4م، الخميس 10ص-2م
- الهاتف/واتساب: +962 79 913 3299
```

## Testing llms.txt

1. **Manual Review**: Read through for clarity and accuracy
2. **AI Test**: Ask Claude/ChatGPT about your business, see if info matches
3. **Validation**: Check markdown syntax is correct
4. **Link Check**: Verify all URLs work

## Output Format

```markdown
## llms.txt Generated for [Site]

### File Location
`https://[domain]/llms.txt`

### Complete llms.txt Content

```markdown
[full llms.txt content]
```

### Companion Files Recommended

1. `/llms.txt` - Main AI instruction file
2. `/index.html.md` - Homepage markdown
3. `/about.md` - About page markdown
4. `/services.md` - Services markdown

### Implementation Steps

1. Create llms.txt file at website root
2. Add to robots.txt (Allow: /llms.txt)
3. Create markdown versions of key pages
4. Test with AI assistants
5. Monitor AI citations

### AI Visibility Checklist
- [ ] llms.txt accessible at /llms.txt
- [ ] robots.txt allows AI crawlers
- [ ] Key pages have .md versions
- [ ] Information is accurate and current
- [ ] Entity names are clearly stated
```

## Related Resources

- Official Spec: https://llmstxt.org/
- Examples: https://llmstxt.org/#examples
- Validation: Test by asking AI about your site
