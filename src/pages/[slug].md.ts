import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { fetchPosts } from '~/utils/blog';

// Serves a clean markdown variant of each visible post at /<slug>.md — the
// AI/LLM-friendly twin of /<slug>. Following the llmstxt.org convention: llms.txt
// references each post via these .md URLs so assistants and crawlers can retrieve
// clean source content (no JS, no boilerplate) per article. Hidden posts (e.g.
// مسيرتنا) are excluded — same rule as the blog listing (via fetchPosts).

export const prerender = true;

// Source the body from Astro's content collection rather than readFile(). The
// content layer is bundled at build time, so there is no fragile filesystem path
// (import.meta.url resolves into dist/ at build, where src/data/post doesn't
// exist) and no case-sensitivity trap (the LIFT post's file is `…-LIFT.md` while
// its slug is `…-lift`). Correlating by id sidesteps both. The body excludes the
// YAML frontmatter, so we prepend the title as an H1 to keep the doc complete.
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
