# Video Blog Posts Feature

This document describes the video blog posts feature implementation.

## Overview

Video posts are blog posts that display a YouTube video instead of a static image. They have:
- A YouTube video URL
- A thumbnail (auto-generated from YouTube)
- Optional text content below the video
- Scheduled publishing support via `publishDate`

## Schema

### Content Schema (`src/content/config.ts`)

The post schema includes:
```typescript
videoUrl: z.string().url().optional(),
draft: z.boolean().optional(),
publishDate: z.date().optional(),
```

### Post Type (`src/types.d.ts`)

```typescript
/** YouTube video URL for video posts */
videoUrl?: string;
```

## Post Visibility

Posts are hidden from listings when:
1. `draft: true` is set in frontmatter
2. `publishDate` is in the future

This allows scheduling posts to appear on specific dates.

## Utility Functions (`src/utils/utils.ts`)

```typescript
/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
 */
export const getYouTubeVideoId = (url: string): string | null

/**
 * Generates YouTube thumbnail URL from video ID
 * Quality options: default, mqdefault, hqdefault, sddefault, maxresdefault
 */
export const getYouTubeThumbnail = (videoId: string, quality: string = 'maxresdefault'): string
```

## Components

### YouTubeEmbed (`src/components/blog/YouTubeEmbed.astro`)

Embeds YouTube videos with:
- Responsive 16:9 aspect ratio
- Rounded corners and shadow styling

```astro
<YouTubeEmbed videoId={videoId} title={post.title} />
```

### SinglePost (`src/components/blog/SinglePost.astro`)

- Renders YouTube embed instead of image for video posts
- Hides reading time for video posts

### ListItem & GridItem (`src/components/blog/`)

- Display YouTube thumbnail with red play button overlay
- Use plain `<img>` tag for YouTube thumbnails (not Astro's Image optimizer) to avoid remote image dimension fetch errors

## Example Video Post

```yaml
---
publishDate: 2025-12-22T00:00:00Z
author: د. مؤمن ديرانية
title: الآفات الشرجية
excerpt: الآفات الشرجية وأنواعها وطرق علاجها.
videoUrl: https://youtu.be/IhYdtrg2MOk
category: القناة الشرجية
tags:
  - فيديو
---
```

## Video Posts Created

14 video posts across 4 categories:

**مقاطع تعريفية ومقابلات عامة:**
- تعريف بالطبيب
- لقاء على قناة الأردن الفضائية
- لقاء على قناة آرام

**جراحة عامة:**
- التشخيص والعلاج المبكران
- الرضوح والأذيات (YouTube Short)
- عدوى الأنسجة الرخوة
- المضادات الحيوية واستئصال الزائدة الدودية

**القناة الشرجية:**
- الآفات الشرجية
- البواسير الشرجية
- استئصال البواسير بالدباسة الشرجية
- الناسور الشرجي
- عملية ربط قناة الناسور الشرجي LIFT
- الشرخ الشرجي

**فتوق جدار البطن:**
- فتوق جدار البطن وأسبابها وطرق علاجها
- فتق جدار البطن

## Known Limitations

### Scroll on Play (Not Implemented)

Detecting YouTube iframe play events reliably proved impractical. Attempted approaches:
- `window.blur` event - unreliable across browsers
- YouTube postMessage API - requires "listening" event, still inconsistent

### Inline Playback in List View (Not Implemented)

Clicking video thumbnail navigates to post page rather than playing inline.

## Files

**Modified:**
- `src/content/config.ts` - Schema
- `src/types.d.ts` - TypeScript types
- `src/utils/blog.ts` - Blog data processing, future date filtering
- `src/utils/utils.ts` - YouTube helper functions (including shorts support)
- `src/components/blog/SinglePost.astro` - Video rendering
- `src/components/blog/ListItem.astro` - Thumbnail + play overlay
- `src/components/blog/GridItem.astro` - Thumbnail + play overlay
- `src/pages/[...blog]/[category]/[...page].astro` - Navigation links
- `src/pages/[...blog]/[tag]/[...page].astro` - Navigation links

**Created:**
- `src/components/blog/YouTubeEmbed.astro`
- `src/data/post/*.md` - 14 video post files
- `context/video-posts.md` (this file)
