import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { fetchPosts } from '~/utils/blog';

// Serves the raw markdown of each visible post at /<slug>.md — the AI/LLM-
// friendly variant of /<slug>. Following the llmstxt.org convention: llms.txt
// references each post via these .md URLs so assistants and crawlers can
// retrieve clean source content (no JS, no boilerplate) per article.
// Hidden posts (e.g. مسيرتنا) are excluded — same rule as the blog listing.

export const prerender = true;

const POSTS_DIR = fileURLToPath(new URL('../data/post', import.meta.url));

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchPosts();
  return posts.map((post) => ({
    params: { slug: post.slug },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response('Not found', { status: 404 });
  }

  const raw = await readFile(join(POSTS_DIR, `${slug}.md`), 'utf8');

  return new Response(raw, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
};
