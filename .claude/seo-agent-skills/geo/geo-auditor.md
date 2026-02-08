# GEO Auditor Skill

## Purpose
Assess a website's visibility and discoverability in AI-powered search systems (ChatGPT, Claude, Perplexity, Google AI Overviews).

## Activation
Use when you need to:
- Evaluate AI discoverability of a website
- Identify GEO improvement opportunities
- Compare AI visibility with competitors
- Check if AI systems can accurately cite the website
- Prepare for the shift from traditional search to AI search

## What is GEO?

**Generative Engine Optimization (GEO)** is the practice of optimizing content so AI systems (LLMs) can:
1. Find your content
2. Understand it correctly
3. Cite it when relevant
4. Accurately represent your business/offering

## GEO vs SEO Comparison

| Aspect | Traditional SEO | GEO |
|--------|----------------|-----|
| Target | Search engine algorithms | Large Language Models |
| Goal | Rank high in SERPs | Get cited in AI responses |
| Focus | Keywords, backlinks | Entity clarity, quotability |
| Metrics | Rankings, CTR | AI mentions, citation accuracy |
| Content | Keyword-optimized | Clear, authoritative, citable |
| Technical | Crawlability, speed | llms.txt, structured data |

## GEO Audit Framework

### 1. AI Crawlability Check

#### robots.txt for AI Bots
```
Check if these bots are allowed:
- GPTBot (OpenAI/ChatGPT)
- ChatGPT-User
- anthropic-ai / Claude-Web
- PerplexityBot
- Google-Extended (Gemini training)
- Bingbot (affects Copilot)
```

**Audit Steps:**
1. Check `robots.txt` for AI bot rules
2. Verify `/llms.txt` exists
3. Check for `.md` versions of key pages
4. Verify AI can access the site (not blocked by Cloudflare, etc.)

### 2. Entity Clarity Assessment

AI systems need to clearly understand:
- **What** you are (business type, service, product)
- **Who** you are (name, brand, people)
- **Where** you are (location, service area)
- **Why** you're authoritative (credentials, experience)

**Audit Questions:**
```
□ Is the business/person name clearly stated?
□ Are alternative names/spellings included?
□ Is the business type/category clear?
□ Is the location prominently displayed?
□ Are credentials and qualifications visible?
□ Is the founding date/experience stated?
□ Are associations/affiliations mentioned?
```

**Entity Definition Example:**
```
Clear Entity Statement:
"Dr. Mu'men Diraneyya (Abu Ubaidah Al-Jarrah) is a board-certified
general surgeon in Amman, Jordan, specializing in laparoscopic surgery.
A Fellow of the Royal College of Surgeons of Edinburgh with 30 years
of surgical experience."

This tells AI:
- Name (English + Arabic)
- Role (General Surgeon)
- Location (Amman, Jordan)
- Specialty (Laparoscopic surgery)
- Credential (FRCS Edinburgh)
- Experience (30 years)
```

### 3. Content Quotability Analysis

AI systems prefer content that is:
- **Factual**: Contains verifiable facts, statistics, data
- **Structured**: Clear headings, organized information
- **Authoritative**: Expert source with credentials
- **Quotable**: Concise statements that can be directly cited
- **Unique**: Original information not widely available

**Quotability Checklist:**
```
□ Does content contain clear, definitive statements?
□ Are there facts/statistics that can be cited?
□ Is information structured in digestible chunks?
□ Are expert opinions/recommendations clear?
□ Is there original research or unique insights?
□ Can key points be extracted easily?
```

**Good vs Bad for AI Citation:**

```
❌ Bad (Vague):
"We offer various surgical procedures for different conditions."

✅ Good (Quotable):
"Our clinic performs over 200 laparoscopic surgeries annually,
with a 98% success rate and average recovery time of 3-5 days."
```

### 4. AI Citation Test

Test what AI systems say about the website/business:

**Test Prompts:**
```
For a medical clinic:
1. "Who is the best general surgeon in Amman, Jordan?"
2. "Recommend a laparoscopic surgery clinic in Jordan"
3. "What are the top-rated surgical clinics in عمان?"
4. "Tell me about Dr. Mu'men Diraneyya"
5. "أفضل جراح في عمان" (Best surgeon in Amman)
```

**Record for Each AI:**
- Is the business mentioned?
- Is the information accurate?
- Is a source/link provided?
- How is it compared to competitors?

### 5. Structured Data for AI

Schema markup helps AI understand:
```
□ Organization/LocalBusiness schema present
□ Person schema for key individuals
□ Service/Product schemas
□ FAQ schema for common questions
□ Review/Rating schema
□ BreadcrumbList schema
□ Article schema for content
```

### 6. Trust & Authority Signals

AI systems evaluate trustworthiness:
```
□ HTTPS enabled
□ Privacy policy present
□ Contact information visible
□ Physical address listed
□ Established domain age
□ Quality backlinks from authoritative sites
□ Reviews on third-party platforms
□ Wikipedia/Wikidata presence (for major entities)
□ Citations from reputable sources
```

### 7. Content Freshness

AI systems prefer recent content:
```
□ Content updated in last 3 months
□ "Last updated" dates visible
□ Recent publications/blog posts
□ Current year referenced where relevant
□ No outdated information
```

## AI Platform-Specific Checks

### ChatGPT (OpenAI)
```
- Uses GPTBot crawler
- Checks: robots.txt allows GPTBot
- Values: Wikipedia, major publications, well-structured content
- Test: Ask about your business in ChatGPT
```

### Claude (Anthropic)
```
- Uses anthropic-ai / Claude-Web
- Checks: robots.txt allows Claude crawlers
- Values: Clear entity definition, factual content
- Test: Ask about your business in Claude
```

### Perplexity
```
- Uses PerplexityBot
- Checks: Direct web access, fresh content
- Values: Recent content, citable sources
- Provides inline citations - check if you're cited
```

### Google AI Overviews (Gemini)
```
- Integrated with Google Search
- Checks: All traditional SEO + structured data
- Values: E-E-A-T, authoritative content
- Appears in search results as AI Overview
```

## Output Format

```markdown
## GEO Audit Report

### Website Analyzed
**Domain**: [domain]
**Date**: [date]
**Business Type**: [type]

---

### GEO Readiness Score: [X]/100

| Category | Score | Status |
|----------|-------|--------|
| AI Crawlability | /20 | ✅/⚠️/❌ |
| Entity Clarity | /20 | ✅/⚠️/❌ |
| Content Quotability | /20 | ✅/⚠️/❌ |
| Structured Data | /15 | ✅/⚠️/❌ |
| Trust Signals | /15 | ✅/⚠️/❌ |
| Content Freshness | /10 | ✅/⚠️/❌ |

---

### AI Crawlability

**robots.txt Analysis:**
| Bot | Status |
|-----|--------|
| GPTBot | ✅ Allowed / ❌ Blocked |
| ChatGPT-User | ✅ / ❌ |
| anthropic-ai | ✅ / ❌ |
| PerplexityBot | ✅ / ❌ |

**llms.txt**: [Present / Missing]
**Location**: [URL or N/A]

**Recommendations**:
- [Recommendation 1]
- [Recommendation 2]

---

### Entity Clarity

**Current Entity Definition:**
[What AI would understand about this entity]

**Missing/Unclear Information:**
- [Missing element 1]
- [Missing element 2]

**Recommendations:**
- [How to clarify entity]

---

### AI Citation Test Results

| AI Platform | Mentioned? | Accurate? | Linked? |
|-------------|------------|-----------|---------|
| ChatGPT | ✅/❌ | ✅/❌ | ✅/❌ |
| Claude | ✅/❌ | ✅/❌ | ✅/❌ |
| Perplexity | ✅/❌ | ✅/❌ | ✅/❌ |
| Google AI | ✅/❌ | ✅/❌ | ✅/❌ |

**Competitor Comparison:**
| Competitor | ChatGPT | Claude | Perplexity |
|------------|---------|--------|------------|
| [Competitor 1] | ✅/❌ | ✅/❌ | ✅/❌ |
| [Competitor 2] | ✅/❌ | ✅/❌ | ✅/❌ |

---

### Content Quotability Assessment

**Quotable Content Found:**
- "[Direct quote that could be cited]"
- "[Another quotable statement]"

**Missing Quotable Elements:**
- [ ] Statistics and data points
- [ ] Clear expert recommendations
- [ ] Definitive statements
- [ ] Original research/insights

**Sample Content Improvements:**

Current:
"[Current vague content]"

Recommended:
"[Improved quotable version]"

---

### Structured Data Assessment

| Schema Type | Present | Issues |
|-------------|---------|--------|
| LocalBusiness | ✅/❌ | [issues] |
| Person | ✅/❌ | [issues] |
| FAQPage | ✅/❌ | [issues] |
| Article | ✅/❌ | [issues] |

---

### Priority Actions

#### Immediate (High Impact, Low Effort)
1. [Action 1] - [expected impact]
2. [Action 2] - [expected impact]

#### Short-term (1-4 weeks)
1. [Action 1]
2. [Action 2]

#### Ongoing
1. [Action 1]
2. [Action 2]

---

### Implementation Guide

1. **Create llms.txt**
   [Specific guidance for this site]

2. **Improve Entity Definition**
   [Specific recommendations]

3. **Add Quotable Content**
   [Examples of what to add]

4. **Update Structured Data**
   [Specific schemas to add/fix]

5. **Monitor AI Citations**
   [How to track progress]
```

## Testing Tools

- ChatGPT, Claude, Perplexity (direct testing)
- Google Search (AI Overviews)
- Schema.org Validator
- Rich Results Test
- robots.txt tester
