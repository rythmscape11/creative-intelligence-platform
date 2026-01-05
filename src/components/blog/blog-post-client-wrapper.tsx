'use client';

import { BlogAnalytics } from '@/components/analytics/blog-analytics';

interface BlogPostClientWrapperProps {
  postId: string;
  postTitle: string;
  postCategory?: string;
  postTags?: string[];
  children: React.ReactNode;
}

export function BlogPostClientWrapper({
  postId,
  postTitle,
  postCategory,
  postTags,
  children,
}: BlogPostClientWrapperProps) {
  return (
    <>
      <BlogAnalytics
        postId={postId}
        postTitle={postTitle}
        postCategory={postCategory}
        postTags={postTags}
      />
      {children}
    </>
  );
}

