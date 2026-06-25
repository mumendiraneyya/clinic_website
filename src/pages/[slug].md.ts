import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { fetchPosts } from '~/utils/blog';
import { buildProcedureFaq, buildProcedureFacts, resolveAlternatives } from '~/utils/procedure';

// Serves a clean markdown variant of each visible post AND each procedure at
// /<slug>.md — the AI/LLM-friendly twin of /<slug>. Following the llmstxt.org
// convention so assistants/crawlers retrieve clean source content (no JS, no
// boilerplate). Sourced from the content collections (bundled at build) — no
// readFile path/casing traps. Hidden posts (e.g. مسيرتنا) are excluded.

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchPosts(); // visible posts only, with canonical slug + title
  const postEntries = await getCollection('post');
  const bodyById = new Map(postEntries.map((entry) => [entry.id, entry.body ?? '']));

  const postPaths = posts.map((post) => ({
    params: { slug: post.slug },
    props: { kind: 'post' as const, title: post.title, body: bodyById.get(post.id) ?? '' },
  }));

  const procedures = await getCollection('procedure', ({ data }) => !data.draft);
  const procSlugs = new Set(procedures.map((e) => e.id));
  const procPaths = procedures.map((entry) => ({
    params: { slug: entry.id },
    props: {
      kind: 'procedure' as const,
      data: entry.data,
      body: entry.body ?? '',
      alternatives: resolveAlternatives(entry.data, (s) => procSlugs.has(s)),
    },
  }));

  return [...postPaths, ...procPaths];
};

export const GET: APIRoute = ({ props }) => {
  const p = props as
    | { kind: 'post'; title: string; body: string }
    | {
        kind: 'procedure';
        data: import('~/utils/procedure').ProcedureData;
        body: string;
        alternatives: { name: string; href?: string }[];
      };

  let markdown: string;

  if (p.kind === 'procedure') {
    const d = p.data;
    const facts = buildProcedureFacts(d)
      .map((f) => `- ${f.label}: ${f.value}`)
      .join('\n');
    const alts = p.alternatives
      .map((a) => (a.href ? `[${a.name}](${a.href})` : a.name))
      .join('، ');
    const faq = buildProcedureFaq(d)
      .map((f) => `### ${f.q}\n\n${f.a}`)
      .join('\n\n');

    markdown =
      `# ${d.title}\n\n` +
      `${d.nameEn}\n\n` +
      (d.condition ? `**الحالة المُعالَجة:** ${d.condition}\n\n` : '') +
      (facts ? `## حقائق سريعة\n\n${facts}\n\n` : '') +
      `${p.body.trim()}\n\n` +
      (alts ? `**البدائل لنفس الحالة:** ${alts}\n\n` : '') +
      (faq ? `## أسئلة شائعة\n\n${faq}\n` : '');
  } else {
    markdown = `# ${p.title}\n\n${p.body.trim()}\n`;
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
};
