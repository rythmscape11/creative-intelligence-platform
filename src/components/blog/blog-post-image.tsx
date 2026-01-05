'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BlogPostImageProps {
  src: string | null;
  alt: string;
  index: number;
  categoryName?: string;
}

export function BlogPostImage({ src, alt, index, categoryName = 'Marketing' }: BlogPostImageProps) {
  const [imageError, setImageError] = useState(false);

  // Show fallback if no src or image failed to load
  if (!src || imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-bg-tertiary border border-gray-200 dark:border-border-primary">
        <div className="text-center p-8">
          <div className="text-4xl mb-4 opacity-50">📝</div>
          <p className="text-sm font-medium text-gray-500 dark:text-text-secondary">{categoryName}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-110"
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      loading={index < 3 ? 'eager' : 'lazy'}
      priority={index < 3}
      onError={() => setImageError(true)}
      unoptimized={src.includes('unsplash.com') || src.includes('picsum.photos')}
    />
  );
}

