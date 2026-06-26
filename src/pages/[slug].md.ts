import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { fetchPosts } from '~/utils/blog';

// Serves a clean markdown variant of each visible post at /<slug>.md — the
// AI/LLM-friendly twin of /<slug> (llmstxt.org convention). Procedures have
// their own .md twin under /عمليات/<slug>.md (see src/pages/عمليات/). Sourced
// from the content collection (bundled at build) — no readFile path/casing
// traps. Hidden posts (e.g. مسيرتنا) are excluded.

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchPosts(); // visible posts only, with canonical slug + title
  const entries = await getCollection('post');
  const bodyById = new Map(entries.map((entry) => [entry.id, entry.body ?? '']));

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.title, body: bodyById.get(post.id) ?? '' },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { title, body } = props as { title: string; body: string };
  const markdown = `# ${title}\n\n${body.trim()}\n`;

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
};
