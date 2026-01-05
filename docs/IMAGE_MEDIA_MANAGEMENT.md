# Media (Images & Video) Management for MediaPlanPro Blog

This document explains how images and videos are sourced, stored, optimized, and rendered in the blog system.

## Overview
- Featured images: Pulled from Unsplash (preferred) or Picsum fallback, stored as URL in `BlogPost.featuredImage`.
- Avatars: Auto-generated via DiceBear when missing, stored as URL in `User.avatar`.
- Rendering: All UI uses Next.js `<Image>` for responsive, lazy-loaded, optimized images.
- Domains: `next.config.js` allows Unsplash, Picsum, DiceBear, and common CDNs.
- Optional video: Use `<VideoEmbed url="..." />` to render YouTube/Vimeo responsively.

## Populate/Refresh Media

1) Dry run (no writes):
```
npx tsx scripts/update-blog-media.ts --dry-run
```

2) Update only missing images/avatars:
```
UNSPLASH_ACCESS_KEY=YOUR_KEY npx tsx scripts/update-blog-media.ts
```

3) Force overwrite all media (use with caution):
```
UNSPLASH_ACCESS_KEY=YOUR_KEY npx tsx scripts/update-blog-media.ts --force
```

Notes:
- If `UNSPLASH_ACCESS_KEY` is not provided or rate-limited, the script falls back to deterministic Picsum URLs.
- Avatars are generated using DiceBear initials with gradient backgrounds.

## UI Integration
- Listing, category, tag, search, post pages all use `<Image />` with `fill` and appropriate `sizes`.
- Featured images use a 16:9 container with graceful gradient background.
- Author avatars: display `User.avatar` when present; fallback to gradient initials.

## Adding Video
- Component: `src/components/blog/video-embed.tsx`.
- Usage:
```
<VideoEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Campaign Walkthrough" />
```
- Schema: If you want a persistent per-post `videoUrl`, add a `videoUrl String?` field to `BlogPost` and migrate. Then render conditionally in the post template.

## Accessibility
- `alt` text for images uses the post title or contextually appropriate text.
- Iframes include `title` prop and standard `allow` attributes.

## Performance
- Next/Image provides: lazy loading, optimized formats (AVIF/WebP), responsive sizing, caching.
- `next.config.js` defines device sizes, image sizes, and allowed domains.

## Attribution & Licensing
- Unsplash images are usable under their license; attribution is appreciated but not required. Track search terms or store attribution as needed for compliance.
- Picsum images are CC0-based random images for placeholders/fallbacks.
- DiceBear avatars are free to use with attribution; see DiceBear license.

