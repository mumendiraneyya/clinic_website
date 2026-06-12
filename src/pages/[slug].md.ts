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

// Pass the post's original id (the on-disk filename, minus extension) through
// as a prop. The slug is NOT a safe filename: cleanSlug() lowercases it, so the
// LIFT post's slug is `…-lift` while the file is `…-LIFT.md`. Reading by slug
// only works on case-insensitive filesystems (macOS); the Cloudflare Pages
// build runs on Linux (case-sensitive) and would throw ENOENT → build fails.
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchPosts();
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { id: post.id },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const id = props.id as string | undefined;
  if (!id) {
    return new Response('Not found', { status: 404 });
  }

  // id has no extension; posts may be .md or .mdx (try .md first — all current
  // posts are .md — and fall back to .mdx so future .mdx posts don't 404).
  let raw: string;
  try {
    raw = await readFile(join(POSTS_DIR, `${id}.md`), 'utf8');
  } catch {
    raw = await readFile(join(POSTS_DIR, `${id}.mdx`), 'utf8');
  }

  return new Response(raw, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
};
