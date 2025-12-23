# trailingSlash Dev Server Bug

## Background: Why This Setting Exists

The `trailingSlash` setting is a relic from traditional web server behavior.

**How traditional servers (Apache, nginx) worked:**
1. You request `/blog`
2. Server looks for a **file** named `blog` - doesn't exist
3. Server finds a **directory** named `blog/`
4. Server sends `301 Redirect → /blog/`
5. Browser follows redirect, requests `/blog/`
6. Server serves `blog/index.html`

This required **two requests** instead of one. To avoid this extra redirect, developers could:
- Generate links with trailing slashes upfront (`/blog/` instead of `/blog`)
- Structure output files as directories with `index.html` inside

**This was never about broken links** - just saving one redirect round-trip that most users wouldn't notice.

**Modern CDNs (Cloudflare Pages, Vercel, Netlify) make this irrelevant** - they serve the correct file regardless of trailing slashes, with no redirects. The setting now only affects:
1. How `<a href>` links are generated (with or without trailing `/`)
2. The file structure in `dist/` (flat `.html` files vs nested `index.html`)

For Cloudflare Pages, **the setting doesn't matter for production**. Keep it `false` to avoid the dev server bug.

## The Problem

Setting `trailingSlash` to anything other than `false` in `src/config.yaml` breaks the Astro dev server's `/_image` endpoint, causing all images to 404.

## Root Cause

This is a known Astro issue ([GitHub #10149](https://github.com/withastro/astro/issues/10149)) introduced in Astro v4.1.0. When `trailingSlash: "always"` or `"ignore"` is set, the dev server expects `/_image/` (with trailing slash) but browsers request `/_image?params` (without).

The Astro team closed this as "not planned" - they consider it intentional behavior.

## Solution

Keep `trailingSlash: false` in `src/config.yaml`:

```yaml
site:
  trailingSlash: false
```

## Why This Doesn't Affect Production

This is a **dev server issue only**. In production:

1. Images are pre-optimized at build time - there is no `/_image` endpoint
2. Cloudflare Pages handles URL routing (both `/page` and `/page/` work regardless of this setting)
3. The `trailingSlash` setting only affects how Astro generates output files, not how they're served

## Symptoms

If you see this in dev server logs:
```
[404] /_image 19ms
[404] /_image 19ms
```

Check `src/config.yaml` and ensure `trailingSlash: false`.

## References

- [GitHub Issue #10149](https://github.com/withastro/astro/issues/10149) - Static File Endpoints broken with `trailingSlash: "always"`
- [GitHub Issue #8735](https://github.com/withastro/astro/issues/8735) - _image endpoint returning 404 for local images
- [GitHub Issue #11447](https://github.com/withastro/astro/issues/11447) - Inconsistent DEV/PROD behavior with trailingSlash
