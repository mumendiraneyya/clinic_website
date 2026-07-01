import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { procedureCategoryOrder } from '~/navigation';
import { buildProcedureFacts, resolveAlternatives, type ProcedureData } from '~/utils/procedure';

// Condensed, metadata-focused digest of ALL procedures in one document — the
// knowledge base the WhatsApp AI assistant taps into. A scheduled n8n workflow
// refreshes a `clinic_knowledge` DataTable row from this endpoint; the assistant
// injects that row into its system prompt. Kept tight (facts + candidate +
// contraindications + emergency signs + alternatives + hand-authored FAQ, no
// prose body) so it stays cheap to feed to the model on every turn.

export const prerender = true;

function procedureBlock(d: ProcedureData, alternatives: { name: string }[]): string {
  const facts = buildProcedureFacts(d)
    .map((f) => `- ${f.label}: ${f.value}`)
    .join('\n');
  const alts = alternatives.map((a) => a.name).join('، ');
  const faq = (d.faq ?? []).map((f) => `- س: ${f.q}\n  ج: ${f.a}`).join('\n');

  return [
    `### ${d.title} (${d.nameEn})`,
    d.condition && `**الحالة المُعالَجة:** ${d.condition}`,
    d.excerpt,
    facts && facts,
    d.benefit && `**الفائدة:** ${d.benefit}`,
    d.candidate && `**المرشّح للعملية:** ${d.candidate}`,
    d.contraindications && `**موانع/محاذير:** ${d.contraindications}`,
    d.emergencySigns?.length && `**علامات تستدعي الطوارئ:** ${d.emergencySigns.join('، ')}`,
    alts && `**البدائل لنفس الحالة:** ${alts}`,
    faq && `**أسئلة شائعة:**\n${faq}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export const GET: APIRoute = async () => {
  const procedures = await getCollection('procedure', ({ data }) => !data.draft);
  const procSlugs = new Set(procedures.map((e) => e.id));
  const sorted = [...procedures].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));

  const sections = procedureCategoryOrder
    .map(({ key, title }) => {
      const inCategory = sorted.filter((p) => p.data.category === key);
      if (!inCategory.length) return '';
      const blocks = inCategory
        .map((p) => procedureBlock(p.data, resolveAlternatives(p.data, (s) => procSlugs.has(s))))
        .join('\n\n');
      return `## ${title}\n\n${blocks}`;
    })
    .filter(Boolean)
    .join('\n\n');

  const markdown =
    `# دليل عمليات عيادة الدكتور مؤمن ديرانية\n\n` +
    `هذه قائمة مرجعية بالعمليات التي تُجرى في العيادة وحقائقها (التكلفة، الألم، التعافي، ` +
    `البدائل، موانع الإجراء). استخدمها للإجابة على استفسارات المرضى دون تقديم نصيحة طبية شخصية.\n\n` +
    sections +
    '\n';

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
};
