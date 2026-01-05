import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { BackButton } from '@/components/layout/back-button';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/services/logger-service';

// Dynamic import for RelatedPosts (below the fold)
const RelatedPosts = dynamic(() => import('@/components/blog/related-posts').then(mod => ({ default: mod.RelatedPosts })), {
  loading: () => <div className="py-12 text-center text-gray-400">Loading related posts...</div>,
});

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    return post;
  } catch (error) {
    logger.error('Error fetching blog post', error as Error, { slug });
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Aureon One Blog',
    };
  }

  return {
    title: post.seoTitle || `${post.title} | Aureon One`,
    description: post.seoDescription || post.excerpt || undefined,
    keywords: post.tags?.map(tag => tag.name).join(', '),
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.seoDescription || post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Convert markdown to HTML (basic conversion for now)
  const contentHtml = post.content
    .replace(/^# (.*$)/gim, '<h1 class="article-h1">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="article-h2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="article-h3">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="article-h4">$1</h4>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul class="article-list">$1</ul>')
    .replace(/^---$/gim, '<hr class="article-divider" />')
    .replace(/\n\n/g, '</p><p class="article-paragraph">')
    .replace(/^(?!<[h|u|l|d|p])/gim, '<p class="article-paragraph">');

  // Generate JSON-LD structured data for SEO and GEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.seoDescription || '',
    image: post.featuredImage || '',
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString() || post.publishedAt?.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Aureon One Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aureon One',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.aureonone.in/images/logos/mediaplanpro-icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.aureonone.in/blog/${post.slug}`,
    },
    keywords: post.tags?.map(tag => tag.name).join(', '),
    articleSection: post.category?.name,
  };

  return (
    <div className="blog-page bg-white dark:bg-zinc-950">
      {/* JSON-LD Structured Data for SEO and GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      <main id="main-content" className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Article Container - Max width for readability */}
        <article className="max-w-4xl mx-auto">
          {/* Breadcrumbs and Back Button */}
          <div className="mb-8 flex items-center justify-between">
            <BreadcrumbSchema
              items={[
                { name: 'Home', url: '/' },
                { name: 'Blog', url: '/blog' },
                { name: post.title, url: `/blog/${post.slug}` }
              ]}
            />
            <BackButton href="/blog" label="Back to Blog" />
          </div>

          {/* Article Header */}
          <header className="mb-12">
            {/* Category Badge */}
            {post.category && (
              <div className="mb-4">
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-black dark:text-gray-900 transition-colors"
                >
                  {post.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white"
              style={{
                fontFamily: 'var(--font-family-display)',
                lineHeight: '1.2'
              }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p
                className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-700 dark:text-gray-300"
                style={{
                  lineHeight: '1.6'
                }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm pb-8 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
              {post.author && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{post.author.name}</span>
                </div>
              )}
              {post.publishedAt && (
                <time dateTime={post.publishedAt.toISOString()}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              )}
              <span>10 min read</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 via-indigo-100 to-purple-100">
            {post.featuredImage ? (
              <div className="relative w-full" style={{ height: '600px' }}>
                <Image
                  src={post.featuredImage}
                  alt={`Featured image for ${post.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
              </div>
            ) : (
              <div className="w-full flex items-center justify-center py-32">
                <div className="text-center">
                  <div className="text-8xl mb-6">📊</div>
                  <p className="text-2xl font-bold text-gray-700">
                    {post.category?.name || 'Marketing Insights'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div
            className="article-content prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-amber-600 hover:prose-a:text-amber-700 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.8',
            }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <a
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 hover:border-amber-400"
                  >
                    {tag.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          <RelatedPosts postId={post.id} />
        </article>
      </main>

    </div>
  );
}
