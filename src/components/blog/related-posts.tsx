'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  publishedAt: string | null;
  category: {
    name: string;
    color: string | null;
  };
}

interface RelatedPostsProps {
  postId: string;
}

export function RelatedPosts({ postId }: RelatedPostsProps) {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${postId}/related`);
        const data = await response.json();

        if (data.success) {
          setPosts(data.data);
        }
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [postId]);

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600">
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-sm font-semibold text-white">
                      {post.category.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: post.category.color || '#E5E7EB',
                    color: '#1F2937',
                  }}
                >
                  {post.category.name}
                </span>
                {post.publishedAt && (
                  <span className="text-xs text-gray-700">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

