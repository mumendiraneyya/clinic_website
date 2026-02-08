# /seo:geo Command

## Description
Audit a website's Generative Engine Optimization (GEO) readiness - how well it can be found, understood, and cited by AI systems like ChatGPT, Claude, Perplexity, and Google AI Overviews.

## Usage
```
/seo:geo [URL]
/seo:geo https://abuobaydatajjarrah.com
```

## What It Does

1. Checks AI crawlability (robots.txt, llms.txt)
2. Evaluates entity clarity
3. Tests content quotability
4. Analyzes structured data for AI
5. Tests actual AI citations
6. Compares with competitors

## Output Format

```markdown
# GEO Audit Report

## Website: [URL]
## Date: [Date]

---

## GEO Readiness Score: [X]/100

| Category | Score | Status |
|----------|-------|--------|
| AI Crawlability | /20 | ✅/⚠️/❌ |
| Entity Clarity | /20 | ✅/⚠️/❌ |
| Content Quotability | /20 | ✅/⚠️/❌ |
| Structured Data | /15 | ✅/⚠️/❌ |
| Trust & Authority | /15 | ✅/⚠️/❌ |
| Content Freshness | /10 | ✅/⚠️/❌ |

---

## AI Crawlability

### robots.txt Analysis
| AI Bot | Status |
|--------|--------|
| GPTBot (OpenAI) | ✅ Allowed / ❌ Blocked / ⚠️ Not specified |
| anthropic-ai (Claude) | ✅ / ❌ / ⚠️ |
| PerplexityBot | ✅ / ❌ / ⚠️ |
| Google-Extended | ✅ / ❌ / ⚠️ |

### llms.txt
**Status**: [Present / Not Found]
**Location**: [URL or N/A]
**Quality**: [Good / Needs improvement / N/A]

### Markdown Versions
| Page | .md Version |
|------|-------------|
| Homepage | ✅/❌ |
| About | ✅/❌ |
| Services | ✅/❌ |

**Recommendations**:
1. [Crawlability recommendation]
2. [llms.txt recommendation]

---

## Entity Clarity

### Current Entity Understanding

Based on the website content, AI would understand:

**Who**: [What AI would identify]
**What**: [Business type/offering]
**Where**: [Location if identifiable]
**Why Trust**: [Authority signals found]

### Missing Entity Information
- [ ] [Missing element 1]
- [ ] [Missing element 2]

### Entity Statement (Current)
"[How the website currently defines itself - first paragraph of about/home]"

### Entity Statement (Recommended)
"[Optimized entity statement with all key information]"

---

## Content Quotability

### Quotable Content Found
These statements could be cited by AI:

1. "[Direct quote from site that's citable]"
2. "[Another quotable statement]"
3. "[Data point or statistic]"

### Missing Quotable Elements
- [ ] Specific statistics/data
- [ ] Clear expert recommendations
- [ ] Definitive statements
- [ ] Unique insights or research
- [ ] Process/methodology descriptions

### Content Improvements

**Before** (Current):
"[Current vague content]"

**After** (Optimized for AI):
"[Improved, quotable version]"

---

## AI Citation Test

### Test Queries Used
1. "[Query 1 in English]"
2. "[Query 2 in Arabic]"
3. "[Query 3 about specific service]"

### Results

| Platform | Mentioned? | Accurate? | Linked? | Notes |
|----------|------------|-----------|---------|-------|
| ChatGPT | ✅/❌ | ✅/❌ | ✅/❌ | |
| Claude | ✅/❌ | ✅/❌ | ✅/❌ | |
| Perplexity | ✅/❌ | ✅/❌ | ✅/❌ | |
| Google AI | ✅/❌ | ✅/❌ | ✅/❌ | |

### Competitor AI Visibility

| Competitor | ChatGPT | Claude | Perplexity |
|------------|---------|--------|------------|
| [Competitor 1] | ✅/❌ | ✅/❌ | ✅/❌ |
| [Competitor 2] | ✅/❌ | ✅/❌ | ✅/❌ |

---

## Structured Data for AI

### Current Schema
| Type | Present | Issues |
|------|---------|--------|
| Organization | ✅/❌ | |
| LocalBusiness | ✅/❌ | |
| Person | ✅/❌ | |
| FAQPage | ✅/❌ | |

### Schema Recommendations
[Specific schema additions that would help AI understanding]

---

## Trust & Authority Signals

| Signal | Present |
|--------|---------|
| About page with credentials | ✅/❌ |
| Contact information | ✅/❌ |
| Physical address | ✅/❌ |
| Professional certifications | ✅/❌ |
| Third-party reviews | ✅/❌ |
| External citations | ✅/❌ |
| Secure site (HTTPS) | ✅/❌ |

---

## Content Freshness

| Check | Status |
|-------|--------|
| Content updated in last 3 months | ✅/❌ |
| "Last updated" dates visible | ✅/❌ |
| Recent blog/news posts | ✅/❌ |
| Current year mentioned | ✅/❌ |

---

## Action Plan

### Priority 1: Quick Wins
1. [Action] - Impact: [High/Medium]
2. [Action] - Impact: [High/Medium]

### Priority 2: Content Improvements
1. [Content change]
2. [Content addition]

### Priority 3: Technical Setup
1. [Create llms.txt]
2. [Update robots.txt]

### Ongoing Monitoring
- Test AI citations monthly
- Update content quarterly
- Monitor competitor AI visibility

---

## llms.txt Template

Based on this audit, here's a recommended llms.txt:

```markdown
[Complete llms.txt content]
```
```

## Related Skills
- geo-auditor
- ai-citation-optimizer
- llm-readable-content
- llms-txt-generator
