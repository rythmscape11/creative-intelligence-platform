import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        category: true,
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 50, // Latest 50 posts
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
    const buildDate = new Date().toUTCString();

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>MediaPlanPro Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Marketing insights, strategies, and trends from MediaPlanPro</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>MediaPlanPro Blog</title>
      <link>${siteUrl}/blog</link>
    </image>
${posts
  .map(
    (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <dc:creator><![CDATA[${post.author?.name || 'MediaPlanPro'}]]></dc:creator>
      <pubDate>${post.publishedAt?.toUTCString()}</pubDate>
      ${post.category ? `<category><![CDATA[${post.category.name}]]></category>` : ''}
      ${post.tags.map((tag) => `<category><![CDATA[${tag.name}]]></category>`).join('\n      ')}
      ${post.featuredImage ? `<enclosure url="${post.featuredImage}" type="image/jpeg"/>` : ''}
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}

