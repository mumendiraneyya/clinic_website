# LLM-Readable Content Skill

## Purpose
Create and format content that AI systems can easily parse, understand, and cite accurately.

## Activation
Use when you need to:
- Create new content optimized for AI understanding
- Reformat existing content for better AI parsing
- Build AI-friendly page structures
- Create markdown versions of key pages
- Develop content that maximizes AI citation potential

## Principles of LLM-Readable Content

### 1. Clarity Over Cleverness

LLMs interpret literally - avoid ambiguity:

```markdown
❌ Avoid:
"Our surgeon has magic hands"
(LLM might literally interpret this)

✅ Use:
"Our surgeon has 30 years of experience and a 98% success rate"
(Clear, factual, parseable)
```

### 2. Entity-First Structure

Define the subject immediately:

```markdown
❌ Bad Opening:
"Welcome to our website! We're excited to share information about..."

✅ Good Opening:
"Dr. Mu'men Diraneyya is a board-certified general surgeon based in
Amman, Jordan, specializing in laparoscopic surgery with 30 years
of experience."
```

### 3. Hierarchical Information

Most important information first, details follow:

```markdown
## Hernia Surgery at Our Clinic

[Key Facts - First Paragraph]
We offer laparoscopic hernia repair with a 98% success rate. Surgery
takes 45-60 minutes under general anesthesia. Most patients return
home the same day and resume normal activities within 1-2 weeks.

[Details - Following Paragraphs]
Our approach uses three small incisions...

[Supporting Information]
The procedure was pioneered in the 1990s...
```

## Content Structures That Work

### 1. Definition Pattern

```markdown
## What is Laparoscopic Surgery?

Laparoscopic surgery, also known as keyhole surgery or minimally
invasive surgery, is a surgical technique that uses small incisions
(typically 0.5-1.5 cm) instead of large open incisions.

**Key characteristics:**
- Uses 3-4 small incisions
- Surgeon operates via camera and specialized instruments
- Shorter recovery time than open surgery
- Less scarring and post-operative pain

**Common laparoscopic procedures include:**
- Cholecystectomy (gallbladder removal)
- Hernia repair
- Appendectomy
```

### 2. FAQ Pattern

```markdown
## Frequently Asked Questions

### How much does hernia surgery cost in Jordan?

Hernia surgery in Jordan costs between 800-1,500 JOD. At our clinic,
laparoscopic hernia repair costs 1,200 JOD, including:
- Surgeon's fee
- Anesthesia
- One-night hospital stay
- Post-operative follow-up

### How long is the recovery after hernia surgery?

Most patients recover within 1-2 weeks after laparoscopic hernia
repair. The typical timeline:
- Day 1-3: Rest at home, light walking
- Week 1: Return to desk work
- Week 2: Resume most activities
- Week 4-6: Full physical activity
```

### 3. Comparison Pattern

```markdown
## Laparoscopic vs. Open Hernia Surgery

| Factor | Laparoscopic | Open Surgery |
|--------|-------------|--------------|
| Incision size | 3-4 incisions, 0.5-1cm each | Single 6-10cm incision |
| Hospital stay | Same-day discharge | 1-2 days |
| Recovery time | 1-2 weeks | 4-6 weeks |
| Pain level | Lower | Higher |
| Scarring | Minimal | Visible scar |
| Cost | Similar | Similar |
| Success rate | 98% | 95% |

**Best for:** Laparoscopic surgery is recommended for most patients,
especially those with bilateral hernias or recurrent hernias.
```

### 4. Process Pattern

```markdown
## What to Expect: Your Hernia Surgery Journey

### Before Surgery

**2 weeks before:**
- Pre-operative consultation
- Blood tests and medical clearance
- Stop blood-thinning medications (as advised)

**Night before:**
- No food after midnight
- Take prescribed medications
- Prepare loose, comfortable clothing

### During Surgery

1. Check-in at hospital (arrive 2 hours early)
2. Pre-operative preparation and anesthesia
3. Surgery (45-60 minutes)
4. Recovery room (1-2 hours)

### After Surgery

**Day 1:** Rest, take prescribed pain medication
**Days 2-3:** Light walking encouraged
**Week 1:** Gradual return to normal activities
**Week 2:** Follow-up appointment
```

### 5. Expert Statement Pattern

```markdown
## Dr. Diraneyya's Approach to Hernia Repair

> "I recommend laparoscopic repair for most hernia patients because
> it offers faster recovery with less pain. In my 30 years of practice,
> I've performed over 3,000 hernia repairs with a 98% success rate."
> — Dr. Mu'men Diraneyya, FRCS

### Our Surgical Philosophy

We prioritize:
1. **Patient safety** - Comprehensive pre-operative assessment
2. **Minimal invasiveness** - Smallest incisions possible
3. **Quick recovery** - Same-day discharge when safe
4. **Long-term success** - Use of quality mesh materials
```

## Page Templates

### Service Page Template

```markdown
# [Service Name] in [Location]

## Overview

[Entity + Service Definition]
[Key Doctor/Clinic] offers [service] in [location]. [Service] is
[definition in 1-2 sentences]. [Key benefit or differentiator].

## Key Facts

- **Procedure time:** [duration]
- **Recovery:** [timeline]
- **Success rate:** [percentage]
- **Cost:** [range in local currency]

## About the Procedure

[2-3 paragraphs explaining the procedure, written clearly]

## Why Choose Us

- [Credential/experience point]
- [Technology/technique point]
- [Patient care point]

## What Patients Say

> "[Patient testimonial with specific details]"
> — [Patient name], [date/year]

## Frequently Asked Questions

### [Question 1]
[Clear answer]

### [Question 2]
[Clear answer]

## Book Your Consultation

[Contact information, booking link]
- **Phone:** [number]
- **Location:** [address]
- **Hours:** [schedule]
```

### About Page Template

```markdown
# About [Doctor Name / Clinic Name]

## Overview

[Full entity statement - name, title, location, specialty, experience]

## Credentials

- **Education:** [Degrees, universities]
- **Specialization:** [Board certifications]
- **Fellowships:** [Special training]
- **Years of Experience:** [Number]

## Professional Background

[2-3 paragraphs of career history with specific achievements]

## Philosophy

[1-2 paragraphs on approach to care]

## Affiliations

- [Hospital/Organization 1]
- [Hospital/Organization 2]
- [Professional Association]

## In the Media

- [Publication/Interview 1]
- [Publication/Interview 2]

## Contact

[Full contact details]
```

## Markdown Version Strategy

Create `.md` versions of key pages:

### File Structure
```
/llms.txt                 # AI instruction file
/index.html.md            # Homepage markdown
/about.md                 # About page markdown
/services.md              # Services overview
/services/hernia.md       # Service detail
/faq.md                   # FAQ page
```

### Markdown Format Guidelines

```markdown
# Keep it simple and clean

Use standard Markdown:
- Headers: # ## ###
- Lists: - or 1. 2. 3.
- Links: [text](url)
- Bold: **important**
- Tables: | Column | Column |
- Quotes: > Quote text

Avoid:
- Complex HTML
- JavaScript/dynamic content
- Images without context
- Unclear abbreviations
```

## Arabic Content Guidelines

### Bilingual Clarity

```markdown
# جراحة الفتق بالمنظار | Laparoscopic Hernia Surgery

## نظرة عامة | Overview

**بالعربية:**
جراحة الفتق بالمنظار هي إجراء طفيف التوغل يستخدم شقوقاً صغيرة
بدلاً من شق كبير واحد. نسبة النجاح 98% مع شفاء أسرع.

**In English:**
Laparoscopic hernia surgery is a minimally invasive procedure using
small incisions instead of one large cut. 98% success rate with
faster recovery.

## معلومات أساسية | Key Information

| العربية | English | القيمة / Value |
|---------|---------|----------------|
| مدة العملية | Surgery duration | 45-60 دقيقة |
| فترة التعافي | Recovery time | 1-2 أسابيع |
| التكلفة | Cost | 1,200 دينار |
```

### Entity Definition (Bilingual)

```markdown
الدكتور معمن الدرانية (Dr. Mu'men Diraneyya)، المعروف أيضاً
بـ "أبو عبيدة الجراح"، هو جراح عام معتمد في عمان، الأردن.
حاصل على زمالة كلية الجراحين الملكية في إدنبرة مع خبرة
30 عاماً في الجراحة.

Dr. Mu'men Diraneyya (معمن الدرانية), also known as "Abu Ubaidah
Al-Jarrah", is a board-certified general surgeon in Amman, Jordan.
Fellow of the Royal College of Surgeons of Edinburgh with 30 years
of surgical experience.
```

## Content Quality Checklist

```markdown
□ Clear entity statement in first paragraph
□ All claims supported by facts/credentials
□ Short paragraphs (2-4 sentences max)
□ One idea per paragraph
□ Headings describe content below
□ Lists for multiple items
□ Tables for comparisons
□ FAQ format for common questions
□ Expert credentials cited
□ Specific numbers and data
□ No jargon without explanation
□ No ambiguous pronouns
□ No idioms or figures of speech
□ Active voice preferred
□ Updated date visible
```

## Output Format

```markdown
## LLM-Readable Content Recommendations

### Page: [URL]

#### Current Issues
1. [Issue 1]
2. [Issue 2]

#### Recommended Content Structure

```markdown
[Complete recommended markdown content]
```

#### Key Improvements Made
- [Improvement 1]
- [Improvement 2]

#### Markdown Version
Create: `[filename].md`
Content:
```markdown
[Simplified markdown version for /llms.txt reference]
```
```
