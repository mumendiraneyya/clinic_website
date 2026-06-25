import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    /** Hide from blog listing while still generating the page */
    hidden: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    imageCaption: z.string().optional(),

    /** YouTube video URL for video posts */
    videoUrl: z.string().url().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    /** Optional MedicalProcedure schema metadata. When present, the post
     *  template emits a MedicalProcedure JSON-LD block linked to the
     *  homepage Physician entity. Use the Arabic name (matches body copy)
     *  and the bilingual alternateName from the homepage availableService
     *  list to keep procedure naming consistent across the site. */
    procedure: z
      .object({
        name: z.string(),
        alternateName: z.string().optional(),
        bodyLocation: z.string().optional(),
        procedureType: z.string().optional(),
      })
      .optional(),

    metadata: metadataDefinition(),
  }),
});

const procedureCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/procedure' }),
  schema: z.object({
    /** Page/heading title in Arabic (the canonical procedure name). */
    title: z.string(),
    /** English/Latin name — the cross-lingual anchor for AI + search. */
    nameEn: z.string(),
    /** Explicit ordering within the category (Dr. Mu'men reorders freely). */
    order: z.number().default(0),
    /** Category key — see procedureCategoryOrder in navigation.ts. */
    category: z.string(),

    excerpt: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),

    /** The condition this procedure treats. */
    condition: z.string().optional(),
    conditionEn: z.string().optional(),

    /** Patient-facing facts (drive the FAQ + facts card + schema). */
    painLevel: z.string().optional(),
    hospitalStay: z.string().optional(),
    returnToDesk: z.string().optional(),
    returnToPhysical: z.string().optional(),
    /** Free string so it can carry the cost breakdown / conditions. */
    cost: z.string().optional(),

    benefit: z.string().optional(),
    /** Alternative procedures for the same condition. `slug` (optional) links
     *  to another procedure page; rendered as a link only when that procedure
     *  exists, otherwise plain text — so it never produces a dead link. */
    alternatives: z.array(z.object({ name: z.string(), slug: z.string().optional() })).optional(),
    candidate: z.string().optional(),
    contraindications: z.string().optional(),
    successRate: z.string().optional(),
    emergencySigns: z.array(z.string()).optional(),

    bodyLocation: z.string().optional(),
    procedureType: z.string().optional(),

    /** Slug of a related blog post to cross-link (المنشورات ↔ ماذا نعالج). */
    relatedArticle: z.string().optional(),

    /** Optional hand-authored Q&A appended to the auto-generated FAQ. */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
  procedure: procedureCollection,
};
