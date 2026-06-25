import type { CollectionEntry } from 'astro:content';

export type ProcedureData = CollectionEntry<'procedure'>['data'];

/** Patient FAQ derived from the structured fields (single source), with any
 *  hand-authored Q&A from frontmatter appended. Used by both the procedure
 *  page (visible FAQ + FAQPage schema) and the .md endpoint. */
export function buildProcedureFaq(d: ProcedureData): { q: string; a: string }[] {
  const auto = [
    d.painLevel && {
      q: `هل عملية ${d.title} مؤلمة؟`,
      a: `مستوى الألم بعد العملية ${d.painLevel}، ويُضبط عادةً بالمسكنات الفموية.`,
    },
    (d.hospitalStay || d.returnToDesk || d.returnToPhysical) && {
      q: `كم مدة التعافي بعد عملية ${d.title}؟`,
      a: [
        d.hospitalStay && `الإقامة في المستشفى: ${d.hospitalStay}.`,
        d.returnToDesk && `العودة للعمل المكتبي: ${d.returnToDesk}.`,
        d.returnToPhysical && `العودة للجهد البدني: ${d.returnToPhysical}.`,
      ]
        .filter(Boolean)
        .join(' '),
    },
    d.cost && { q: `كم تكلفة عملية ${d.title} تقريبًا؟`, a: d.cost },
    d.emergencySigns?.length && {
      q: `متى يجب مراجعة الطوارئ بعد العملية؟`,
      a: `عند ظهور أيٍّ من العلامات التالية: ${d.emergencySigns.join('، ')}.`,
    },
  ].filter(Boolean) as { q: string; a: string }[];

  return [...auto, ...(d.faq ?? [])];
}

/** Scannable "حقائق سريعة" rows derived from the structured fields. */
export function buildProcedureFacts(d: ProcedureData): { label: string; value: string }[] {
  return [
    d.painLevel && { label: 'مستوى الألم', value: d.painLevel },
    d.hospitalStay && { label: 'الإقامة بالمستشفى', value: d.hospitalStay },
    d.returnToDesk && { label: 'العودة للعمل المكتبي', value: d.returnToDesk },
    d.returnToPhysical && { label: 'العودة للجهد البدني', value: d.returnToPhysical },
    d.cost && { label: 'التكلفة التقريبية', value: d.cost },
    d.successRate && { label: 'نسبة النجاح التقريبية', value: d.successRate },
  ].filter(Boolean) as { label: string; value: string }[];
}
