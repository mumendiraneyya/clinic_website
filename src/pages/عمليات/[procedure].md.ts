import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { buildProcedureFaq, buildProcedureFacts, resolveAlternatives } from '~/utils/procedure';

// Clean markdown twin of each procedure page at /عمليات/<slug>.md — the
// AI/LLM-friendly variant (facts + prose + FAQ). Sourced from the content
// collection (bundled at build), listed in llms.txt.

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const procedures = await getCollection('procedure', ({ data }) => !data.draft);
  const procSlugs = new Set(procedures.map((e) => e.id));
  return procedures.map((entry) => ({
    params: { procedure: entry.id },
    props: {
      data: entry.data,
      body: entry.body ?? '',
      alternatives: resolveAlternatives(entry.data, (s) => procSlugs.has(s)),
    },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { data: d, body, alternatives } = props as {
    data: import('~/utils/procedure').ProcedureData;
    body: string;
    alternatives: { name: string; href?: string }[];
  };

  const facts = buildProcedureFacts(d)
    .map((f) => `- ${f.label}: ${f.value}`)
    .join('\n');
  const alts = alternatives.map((a) => (a.href ? `[${a.name}](${a.href})` : a.name)).join('، ');
  const faq = buildProcedureFaq(d)
    .map((f) => `### ${f.q}\n\n${f.a}`)
    .join('\n\n');

  const markdown =
    `# ${d.title}\n\n` +
    `${d.nameEn}\n\n` +
    (d.condition ? `**الحالة المُعالَجة:** ${d.condition}\n\n` : '') +
    (facts ? `## حقائق سريعة\n\n${facts}\n\n` : '') +
    `${body.trim()}\n\n` +
    (alts ? `**البدائل لنفس الحالة:** ${alts}\n\n` : '') +
    (faq ? `## أسئلة شائعة\n\n${faq}\n` : '');

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
};
