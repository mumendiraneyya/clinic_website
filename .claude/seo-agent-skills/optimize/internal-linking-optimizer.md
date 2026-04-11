# Internal Linking Optimizer Skill

## Purpose
Optimize internal link structure to distribute page authority, improve crawlability, and enhance user navigation.

## Activation
Use when you need to:
- Audit internal linking structure
- Improve PageRank flow to key pages
- Fix orphan pages
- Create topic clusters
- Improve site navigation for Arabic sites

## Why Internal Linking Matters

1. **Crawlability**: Helps search engines discover all pages
2. **PageRank Distribution**: Passes authority to important pages
3. **User Experience**: Guides users to relevant content
4. **Topical Authority**: Groups related content together
5. **Reduces Bounce Rate**: Keeps users engaged longer

## Internal Linking Audit

### Step 1: Map Current Links

Create a link matrix:

```
| Source Page | Target Page | Anchor Text | Context |
|-------------|-------------|-------------|---------|
| /homepage   | /services   | خدماتنا      | Nav     |
| /homepage   | /hernia     | جراحة الفتق  | Body    |
| /blog/post1 | /services   | our services | Body    |
```

### Step 2: Identify Issues

#### Orphan Pages
Pages with no internal links pointing to them:
```
Finding orphan pages:
1. Crawl all pages (Screaming Frog)
2. List pages with 0 incoming internal links
3. These are orphan pages - need linking!
```

#### Broken Internal Links
```
Check for:
- 404 errors (page doesn't exist)
- Redirect chains (A → B → C)
- Soft 404s (page exists but shows error content)
```

#### Link Distribution Problems
```
Issues:
- Homepage has too many links (>100)
- Important pages have few incoming links
- Unimportant pages have many links
- No contextual links in content
```

#### Anchor Text Issues
```
Bad anchor text:
- "Click here"
- "Read more"
- "This page"
- Generic URLs

Good anchor text:
- Descriptive of target page
- Includes relevant keywords
- Natural in context
- Varies (not exact match every time)
```

### Step 3: Link Analysis Metrics

| Metric | Ideal | Warning | Problem |
|--------|-------|---------|---------|
| Internal links per page | 3-10 | 1-2 | 0 |
| Incoming links to key pages | 10+ | 3-9 | 0-2 |
| Click depth from homepage | 1-2 | 3 | 4+ |
| % orphan pages | 0% | 1-5% | >5% |

## Internal Linking Strategies

### 1. Hub and Spoke Model (Topic Clusters)

```
Hub Page: /services/surgery (الجراحة العامة)
├── Spoke: /services/hernia-surgery (جراحة الفتق)
├── Spoke: /services/gallbladder-surgery (جراحة المرارة)
├── Spoke: /services/colorectal-surgery (جراحة القولون)
└── Spoke: /services/thyroid-surgery (جراحة الغدة الدرقية)

Linking Rules:
- Hub links to all spokes
- Spokes link back to hub
- Related spokes link to each other
```

### 2. Contextual Linking in Content

```markdown
# جراحة الفتق بالمنظار

الفتق حالة شائعة تحتاج علاجًا جراحيًا. في
[عيادتنا للجراحة العامة](/services) نستخدم تقنية
[الجراحة بالمنظار](/services/laparoscopic) لضمان
تعافٍ أسرع. إذا كنت تعاني من
[أعراض الفتق](/blog/hernia-symptoms)، احجز موعدك اليوم.
```

### 3. Footer and Sidebar Links

```
Footer Links (Site-wide):
- Key service pages
- Contact information
- About page
- Legal pages

Sidebar Links (Contextual):
- Related services
- Recent blog posts
- Popular content
```

### 4. Breadcrumb Navigation

```html
<nav aria-label="Breadcrumb">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/"><span itemprop="name">الرئيسية</span></a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/services/"><span itemprop="name">الخدمات</span></a>
      <meta itemprop="position" content="2" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span itemprop="name">جراحة الفتق</span>
      <meta itemprop="position" content="3" />
    </li>
  </ol>
</nav>
```

### 5. Related Content Blocks

```html
<section class="related-content">
  <h2>مقالات ذات صلة</h2>
  <ul>
    <li><a href="/blog/hernia-symptoms">أعراض الفتق وعلاماته</a></li>
    <li><a href="/blog/surgery-preparation">كيف تستعد للعملية الجراحية</a></li>
    <li><a href="/blog/recovery-tips">نصائح للتعافي بعد الجراحة</a></li>
  </ul>
</section>
```

## Priority Pages for Linking

### High Priority (Most Internal Links)
1. Service/product pages that drive revenue
2. Content that targets high-value keywords
3. Pages that support E-E-A-T (About, Credentials)
4. Conversion pages (Contact, Book)

### Medium Priority
1. Blog posts targeting competitive keywords
2. FAQ pages
3. Category/hub pages

### Low Priority
1. Legal pages (Privacy, Terms)
2. Archive pages
3. Author pages

## Arabic Site Considerations

### RTL Link Display
```css
/* Ensure links display correctly in RTL */
a {
  direction: rtl;
  unicode-bidi: embed;
}

/* Handle mixed Arabic/English links */
a[hreflang="en"] {
  direction: ltr;
  unicode-bidi: embed;
}
```

### Anchor Text Best Practices for Arabic
```
Good Arabic Anchors:
- اقرأ المزيد عن جراحة الفتق (Read more about hernia surgery)
- احجز موعدك الآن (Book your appointment now)
- تعرف على خدماتنا الجراحية (Learn about our surgical services)

Avoid:
- اضغط هنا (Click here)
- المزيد (More)
- هنا (Here)
```

## Implementation Process

### Step 1: Audit Current State
```
Tools needed:
- Screaming Frog (crawl site)
- Ahrefs/Moz (link analysis)
- Google Search Console (internal links report)

Collect:
- All pages and their internal links
- Anchor text used
- Link location (nav, footer, body)
- Click depth from homepage
```

### Step 2: Identify Opportunities
```
1. List orphan pages → Add links to them
2. List key pages with few links → Add more links
3. List generic anchor text → Improve to descriptive
4. List deep pages (4+ clicks) → Create shorter paths
```

### Step 3: Create Link Plan
```
For each page, document:
- Links to add (target URL + anchor text)
- Links to remove (if harmful)
- Links to modify (anchor text change)
```

### Step 4: Implement Changes
```
Priority order:
1. Fix broken links (immediately)
2. Link to orphan pages (high priority)
3. Add links to key pages (high priority)
4. Improve anchor text (medium priority)
5. Add contextual links in content (ongoing)
```

## Output Format

```markdown
## Internal Linking Audit Report

### Site Overview
**Domain**: [domain]
**Total Pages**: [X]
**Total Internal Links**: [X]

---

### Current State Analysis

#### Link Distribution
| Page | Incoming Links | Priority | Status |
|------|---------------|----------|--------|
| Homepage | [X] | High | ✅ |
| /services | [X] | High | ⚠️ Needs more |
| /about | [X] | Medium | ✅ |
| /contact | [X] | High | ✅ |

#### Issues Found

**Orphan Pages** ([X] found):
| Page | Traffic Potential | Fix Priority |
|------|------------------|--------------|
| [URL] | [High/Med/Low] | [High/Med/Low] |

**Broken Internal Links** ([X] found):
| Source | Target | Error |
|--------|--------|-------|
| [URL] | [URL] | 404 |

**Poor Anchor Text** ([X] instances):
| Current Anchor | Target | Suggestion |
|----------------|--------|------------|
| اضغط هنا | /services | خدماتنا الجراحية |

**Deep Pages** (4+ clicks from homepage):
| Page | Current Depth | Target Depth |
|------|---------------|--------------|
| [URL] | 5 clicks | 2-3 clicks |

---

### Recommendations

#### 1. Link Building for Key Pages

**Service Page: /services/hernia**
Add links from:
- Homepage → "جراحة الفتق بالمنظار"
- /blog/hernia-symptoms → "العلاج الجراحي للفتق"
- /services → "تعرف على جراحة الفتق"

#### 2. Topic Cluster Structure

**Hub**: /services/surgery
**Spokes**:
- /services/hernia → Link to hub with "الجراحة العامة"
- /services/gallbladder → Link to hub
- /blog/surgery-guide → Link to hub

#### 3. Orphan Page Fixes

| Orphan Page | Link From | Anchor Text |
|-------------|-----------|-------------|
| [URL] | [Source] | [Anchor] |

---

### Implementation Checklist

□ Fix [X] broken links
□ Add links to [X] orphan pages
□ Add [X] links to priority pages
□ Update [X] anchor texts
□ Implement breadcrumbs
□ Add related content sections

---

### Expected Impact
- Improved crawl efficiency
- Better PageRank flow to key pages
- Reduced orphan pages from [X]% to 0%
- Improved user navigation and engagement
```

## Tools for Internal Linking

- **Screaming Frog**: Crawl and analyze internal links
- **Ahrefs Site Audit**: Internal link analysis
- **Google Search Console**: Internal links report
- **Link Whisper** (WordPress): Internal link suggestions
- **Internal Link Juicer**: Automated internal linking
