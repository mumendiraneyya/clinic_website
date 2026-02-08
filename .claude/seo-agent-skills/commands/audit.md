# /seo:audit Command

## Description
Perform a comprehensive SEO and GEO audit of a webpage or website.

## Usage
```
/seo:audit [URL]
/seo:audit https://abuobaydatajjarrah.com
```

## What It Does

This command performs a complete audit covering:

1. **On-Page SEO** (40 points)
   - Title tag analysis
   - Meta description review
   - Heading structure
   - Content quality
   - Image optimization
   - Internal linking

2. **Technical SEO** (25 points)
   - Crawlability (robots.txt, sitemap)
   - Indexability
   - Core Web Vitals
   - Mobile-friendliness
   - HTTPS/Security
   - Structured data

3. **GEO/AI Readiness** (20 points)
   - llms.txt presence
   - Entity clarity
   - Content quotability
   - AI crawler access
   - AI citation testing

4. **Local SEO** (15 points) - if applicable
   - Google Business Profile
   - NAP consistency
   - Local schema
   - Reviews

## Output Format

```markdown
# SEO & GEO Audit Report

## Website: [URL]
## Date: [Date]
## Overall Score: [X]/100

---

## Score Breakdown

| Category | Score | Status |
|----------|-------|--------|
| On-Page SEO | /40 | ✅/⚠️/❌ |
| Technical SEO | /25 | ✅/⚠️/❌ |
| GEO Readiness | /20 | ✅/⚠️/❌ |
| Local SEO | /15 | ✅/⚠️/❌ |

---

## Executive Summary
[3-5 sentence summary of key findings]

---

## Critical Issues (Fix Immediately)
1. [Issue with explanation and fix]
2. [Issue with explanation and fix]

## High Priority Issues
1. [Issue with fix]
2. [Issue with fix]

## Medium Priority Opportunities
1. [Opportunity]
2. [Opportunity]

---

## Detailed Findings

### On-Page SEO

#### Title Tag
**Current**: [title]
**Issues**: [issues]
**Recommendation**: [new title]

#### Meta Description
[Same format...]

[Continue for all elements...]

### Technical SEO
[Detailed findings...]

### GEO/AI Readiness
[Detailed findings...]

### Local SEO
[Detailed findings...]

---

## Action Plan

### This Week
1. [Action 1]
2. [Action 2]

### This Month
1. [Action 1]
2. [Action 2]

### Ongoing
1. [Action 1]
2. [Action 2]
```

## Related Skills
- on-page-seo-auditor
- technical-seo-checker
- geo-auditor
- local-seo-jordan
