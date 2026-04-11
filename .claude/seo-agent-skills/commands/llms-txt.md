# /seo:llms-txt Command

## Description
Generate an llms.txt file to help AI systems understand and cite your website.

## Usage
```
/seo:llms-txt [URL]
/seo:llms-txt https://abuobaydatajjarrah.com
```

## What It Does

1. Analyzes the website structure and content
2. Identifies key information AI should know
3. Creates a properly formatted llms.txt file
4. Provides implementation instructions

## Output Format

```markdown
# llms.txt for [Domain]

## File Location
Save as: `https://[domain]/llms.txt`

---

## Generated llms.txt

```markdown
# [Site/Business Name] | [Arabic Name if applicable]

> [Brief 1-2 sentence description with key information: what you do, where you are, key differentiator]

## About

[Detailed entity description with:
- Full name and alternative names
- What you do/provide
- Location and service area
- Key credentials and experience
- Unique value proposition]

## Services/Products

- [Service 1](URL): Brief description
- [Service 2](URL): Brief description
- [Service 3](URL): Brief description

## Key Information

- **Location**: [Full address]
- **Hours**: [Operating hours]
- **Contact**: [Phone, email]
- **Pricing**: [Price range or specific prices]
- **Languages**: [Languages offered]

## Educational Content

- [Resource 1](URL): Description
- [Resource 2](URL): Description

## Contact

- Website: [URL]
- Book: [Booking URL]
- Social: [Social links]

## Optional

[Secondary information that can be omitted in shorter contexts:
- Additional credentials
- Background history
- Awards/recognition
- Media appearances]
```

---

## Implementation

### Step 1: Create the file
Save the content above as `llms.txt` at your website root.

### Step 2: Update robots.txt
Add these lines:
```
User-agent: GPTBot
Allow: /llms.txt

User-agent: anthropic-ai
Allow: /llms.txt

User-agent: PerplexityBot
Allow: /llms.txt
```

### Step 3: Create markdown versions (optional)
Create `.md` versions of key pages:
- `/index.html.md`
- `/about.md`
- `/services.md`

### Step 4: Test
Ask AI assistants about your business and verify accuracy.

---

## Verification Checklist
- [ ] File accessible at /llms.txt
- [ ] Valid markdown format
- [ ] All links working
- [ ] Information accurate
- [ ] Entity clearly defined
- [ ] robots.txt updated
```

## Related Skills
- llms-txt-generator
- geo-auditor
