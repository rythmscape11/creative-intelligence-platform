'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PerformanceService } from '@/lib/services/performance-service';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  type?: 'hero' | 'thumbnail' | 'content' | 'avatar';
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  quality,
  format,
  type = 'content',
  onLoad,
  onError,
  loading = 'lazy',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const performanceService = PerformanceService.getInstance();

  // Get optimized configuration based on type
  const config = performanceService.getImageConfig(type);
  const finalQuality = quality || config.quality;
  const finalFormat = format || config.format;

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Generate responsive image URLs
  const generateSrcSet = () => {
    if (!isInView && !priority) return '';

    return config.sizes
      .map(size => {
        const url = performanceService.getOptimizedImageUrl(src, size, {
          ...config,
          quality: finalQuality,
          format: finalFormat,
        });
        return `${url} ${size}w`;
      })
      .join(', ');
  };

  // Generate main image URL
  const generateSrc = () => {
    if (!isInView && !priority) return '';

    const targetWidth = width || config.sizes[Math.floor(config.sizes.length / 2)];
    return performanceService.getOptimizedImageUrl(src, targetWidth, {
      ...config,
      quality: finalQuality,
      format: finalFormat,
    });
  };

  // Generate blur placeholder
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;

    // Generate a simple blur placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Create a simple gradient as placeholder
      const gradient = ctx.createLinearGradient(0, 0, 10, 10);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 10, 10);
    }

    return canvas.toDataURL();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  // Calculate responsive sizes if not provided
  const responsiveSizes = sizes || (() => {
    switch (type) {
      case 'hero':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px';
      case 'thumbnail':
        return '(max-width: 768px) 150px, 300px';
      case 'avatar':
        return '(max-width: 768px) 48px, 64px';
      default:
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px';
    }
  })();

  // Show placeholder while not in view or loading
  if (!isInView && !priority) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
        aria-label={`Loading ${alt}`}
      />
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center text-gray-700 ${className}`}
        style={{ width, height }}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <img
          src={generateBlurDataURL()}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={generateSrc()}
        srcSet={generateSrcSet()}
        sizes={responsiveSizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          aspectRatio: width && height ? `${width} / ${height}` : undefined,
        }}
      />

      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-600" />
        </div>
      )}
    </div>
  );
}

// Preload critical images
export function preloadImage(src: string, type: 'hero' | 'thumbnail' | 'content' | 'avatar' = 'content') {
  if (typeof window === 'undefined') return;

  const performanceService = PerformanceService.getInstance();
  const config = performanceService.getImageConfig(type);

  // Preload the main size
  const mainSize = config.sizes[Math.floor(config.sizes.length / 2)];
  const optimizedUrl = performanceService.getOptimizedImageUrl(src, mainSize, config);

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = optimizedUrl;
  link.type = `image/${config.format}`;

  document.head.appendChild(link);
}

// Generate image metadata for SEO
export function generateImageMetadata(src: string, alt: string, width?: number, height?: number) {
  return {
    url: src,
    alt,
    width,
    height,
    type: 'image/webp', // Default to WebP
  };
}

// Image performance analyzer
export function analyzeImagePerformance(): {
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  averageLoadTime: number;
  largestImage: PerformanceResourceTiming | null;
} {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return {
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0,
      averageLoadTime: 0,
      largestImage: null,
    };
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const imageResources = resources.filter(resource =>
    resource.initiatorType === 'img' ||
    resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)
  );

  const loadedImages = imageResources.filter(resource => resource.responseEnd > 0);
  const failedImages = imageResources.filter(resource => resource.responseEnd === 0);

  const totalLoadTime = loadedImages.reduce((total, resource) => {
    return total + (resource.responseEnd - resource.requestStart);
  }, 0);

  const averageLoadTime = loadedImages.length > 0 ? totalLoadTime / loadedImages.length : 0;

  const largestImage = imageResources.reduce((largest, resource) => {
    if (!largest || (resource.transferSize || 0) > (largest.transferSize || 0)) {
      return resource;
    }
    return largest;
  }, null as PerformanceResourceTiming | null);

  return {
    totalImages: imageResources.length,
    loadedImages: loadedImages.length,
    failedImages: failedImages.length,
    averageLoadTime,
    largestImage,
  };
}
