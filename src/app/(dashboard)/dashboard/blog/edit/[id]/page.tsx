import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserRole } from '@/types';
import { BlogPostEditor } from '@/components/blog/blog-post-editor';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

interface EditBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getBlogPost(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  });

  if (!post) {
    return null;
  }

  return {
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    categoryId: post.categoryId,
    tagIds: post.tags.map((tag) => tag.id),
    status: post.status,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    publishedAt: post.publishedAt?.toISOString() || null,
  };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { userId } = await auth();
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  // Check if user has permission to edit this post
  const dbPost = await prisma.blogPost.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg shadow-sm border border-border-primary p-12 text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Access Denied</h1>
            <p className="text-text-secondary">You must be signed in to edit posts.</p>
          </div>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  // Editors can only edit their own posts, admins can edit any post
  if (user?.role === 'EDITOR' && dbPost?.authorId !== userId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg shadow-sm border border-border-primary p-12 text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Access Denied</h1>
            <p className="text-text-secondary">You can only edit your own blog posts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.EDITOR]}>
      <div className="min-h-screen bg-gray-50 dark:bg-bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-text-primary">
          <BlogPostEditor postId={id} initialData={post} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
