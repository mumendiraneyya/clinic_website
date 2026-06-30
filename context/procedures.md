# Procedures (ماذا نعالج)

Per-operation pages under `/عمليات/<slug>`, driven by a dedicated `procedure`
content collection. Each page is patient-facing (facts card + prose + FAQ +
alternatives), emits medical schema, has an AI/LLM `.md` twin, and is
cross-linked with the blog. The "ماذا نعالج" header menu and the landing-page
`#features` section both link into these pages.

## Content collection

Defined in `src/content/config.ts` as `procedureCollection`, exported under
`collections.procedure`. Markdown/MDX files live in **`src/data/procedure/`**
(one file per operation; the filename is the slug). The Arabic slug is the
canonical URL segment — keep it stable once shared.

Schema fields (all optional unless noted):

- `title` (**required**) — Arabic heading / canonical procedure name.
- `nameEn` (**required**) — English/Latin name; the cross-lingual anchor for AI + search, and the `alternateName` in schema.
- `order` (number, default 0) — ordering **within** its category. Dr. Mu'men reorders freely.
- `category` (**required**) — key matching `procedureCategoryOrder` in `src/navigation.ts` (`hemorrhoids` | `anal` | `hernias` | `general`).
- `excerpt`, `image`, `draft` — `draft: true` excludes the page everywhere (route, menu, llms.txt) via the `!data.draft` filter used in every `getCollection('procedure', …)` call.
- `condition`, `conditionEn` — the condition the procedure treats.
- Patient facts: `painLevel`, `hospitalStay`, `returnToDesk`, `returnToPhysical`, `cost` (free string — can carry a breakdown), `successRate`. These drive both the facts card and the auto-FAQ.
- `benefit`, `candidate`, `contraindications`, `emergencySigns` (string[]).
- `alternatives` — `{ name, slug? }[]`. `slug` links to another procedure page **only when that procedure exists**, otherwise it renders as plain text (no dead links). See `resolveAlternatives`.
- `bodyLocation`, `procedureType` — fed into `MedicalProcedure` schema.
- `relatedArticle` — slug of a blog post to cross-link (bidirectional; see below).
- `faq` — `{ q, a }[]`, hand-authored Q&A appended after the auto-generated FAQ.
- `metadata` — standard `metadataDefinition()`.

## Routes

- **`src/pages/عمليات/[procedure].astro`** — the HTML page. `getStaticPaths` maps each non-draft entry's `id` → `params.procedure`. Renders header (title + `nameEn` + condition), a "حقائق سريعة" facts card, the prose `<Content/>`, candidate/alternatives/contraindications block, an "أسئلة شائعة" `<details>` accordion, and a "اقرأ أيضًا" link to the related post.
- **`src/pages/عمليات/[procedure].md.ts`** — the LLM-friendly `.md` twin at `/عمليات/<slug>.md` (title + nameEn + condition + facts + body + alternatives + FAQ). Listed in `public/llms.txt` / `public/llms-ar.txt`.

**Namespacing:** procedures live under `/عمليات/` on purpose. Root-level
procedure pages collided with same-named blog posts (which live at `/%slug%`),
producing a silent build-time route override. The `/عمليات/` prefix keeps URLs
shareable while avoiding the collision.

## Helpers — `src/utils/procedure.ts`

Single source for the derived content, shared by the page and the `.md` twin:

- `buildProcedureFaq(d)` — generates pain / recovery / cost / emergency Q&A from the structured fields, then appends any frontmatter `faq`. Drives the visible FAQ **and** the `FAQPage` schema.
- `buildProcedureFacts(d)` — the "حقائق سريعة" rows (pain, stay, return-to-desk/physical, cost, success rate).
- `resolveAlternatives(d, exists)` — maps `alternatives` to `{ name, href? }`; `href` is set only when `exists(slug)` is true. The caller passes a `Set` of real procedure ids.

## Cross-linking (المنشورات ↔ ماذا نعالج)

Bidirectional, declared **once** on the procedure side via `relatedArticle`:

- **Procedure → post:** the procedure page resolves `relatedArticle` to the post's real title and links it ("اقرأ أيضًا"). Matching is by `cleanSlug(p.id)` so case-mismatched slugs (e.g. the LIFT post, file `…-LIFT`, URL `…-lift`) resolve correctly.
- **Post → procedures:** `src/pages/[...blog]/index.astro` reverses the relation at build time — it filters procedures whose `relatedArticle === post.slug` and renders an "عمليات ذات صلة" list. No data is duplicated on the post side.

## Schema.org

Each procedure page emits three JSON-LD blocks:

- `MedicalProcedure` (`@id` = `<url>#procedure`) with `alternateName` (nameEn), optional `bodyLocation` / `procedureType` / `indication` (candidate) / `contraindication`, and `performer` linked by `@id` to the homepage `#physician` node so Google merges the surgeon identity across the corpus.
- `FAQPage` — built from `buildProcedureFaq` (only when non-empty).
- `BreadcrumbList` — الرئيسية → ماذا نعالج → procedure.

## Navigation — "ماذا نعالج" dynamic submenus

`procedureCategoryOrder` in `src/navigation.ts` defines category **key → Arabic title** and the cross-category order. "ماذا نعالج" is a flat top-level item (`href: '/#features'`) in `headerData`; `src/layouts/PageLayout.astro` injects its submenus exactly like the blog "المنشورات" menu:

1. `getCollection('procedure', !draft)`, sorted by `order`.
2. For each category in `procedureCategoryOrder`, build a submenu of its procedures (`text: title`, nested `links` → `/عمليات/<id>`). Empty categories are dropped.
3. Replace the "ماذا نعالج" item's `links` in `dynamicHeaderData`.

So the nested-dropdown rendering (chevrons, hover/click) is shared with the blog menu — see [header-menu.md](header-menu.md).

## Landing-page `#features` links

The `#features` section (`src/pages/index.astro`) is Dr. Mu'men's curated prose
describing broad surgical **areas** — it is **not** a 1:1 list of procedures.
Inline links are added **only** where a span of his text maps unambiguously to a
single procedure article; his wording is never edited (attached prefixes like
the `بـ` in "بربط" are kept inside the link rather than splitting a joined word).
Multi-operation or article-less spans (e.g. الخرّاج, "الناسور المرتفع المعقد")
stay unlinked. Links are `<a class="text-primary underline" href="/عمليات/<slug>">`
inside the `set:html` description strings.

## Sitemap, llms.txt, build cache

- **Sitemap:** procedure pages are picked up by the catch-all rule in `astro.config.ts` (they don't match any excluded prefix) — no config change needed.
- **llms.txt:** `public/llms.txt` and `public/llms-ar.txt` carry a Procedures section listing every `/عمليات/<slug>.md` twin.
- **Build cache:** `package.json`'s build script is `rm -rf .astro node_modules/.astro && astro build`. The content-layer cache otherwise persists a stale empty `procedure` collection across builds (this bit us on Cloudflare: a cached `.astro` made the new collection load empty, emptying the menu).
