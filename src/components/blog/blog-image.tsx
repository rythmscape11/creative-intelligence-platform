'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BlogImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

// Default placeholder image
const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop';

/**
 * Blog Image Component with automatic fallback
 * 
 * Features:
 * - Automatic fallback to placeholder on error
 * - Handles null/undefined src
 * - Optimized with Next.js Image component
 * - Lazy loading by default
 */
export function BlogImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  sizes,
}: BlogImageProps) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_PLACEHOLDER);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(DEFAULT_PLACEHOLDER);
    }
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        priority={priority}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 1200}
      height={height || 630}
      className={className}
      onError={handleError}
      priority={priority}
      sizes={sizes}
    />
  );
}

/**
 * Validate if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });

    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') ?? false);
  } catch (error) {
    return false;
  }
}

/**
 * Get a placeholder image URL
 */
export function getPlaceholderImage(seed?: string): string {
  const placeholders = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop',
  ];

  if (seed) {
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return placeholders[hash % placeholders.length];
  }

  return placeholders[0];
}

