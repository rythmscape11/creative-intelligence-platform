export interface PageSpeedAnalysis {
  score: number;
  metrics: {
    images: number;
    scripts: number;
    stylesheets: number;
    totalResources: number;
  };
  suggestions: string[];
  rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor';
}

export function analyzePageSpeed(
  images: number,
  scripts: number,
  stylesheets: number,
  pageSize: number // in KB
): PageSpeedAnalysis {
  let score = 100;
  const suggestions: string[] = [];

  // Analyze images
  if (images > 20) {
    score -= 20;
    suggestions.push('Too many images. Consider lazy loading or image optimization.');
  } else if (images > 10) {
    score -= 10;
    suggestions.push('Optimize images with compression and modern formats (WebP, AVIF).');
  }

  // Analyze scripts
  if (scripts > 15) {
    score -= 20;
    suggestions.push('Too many JavaScript files. Bundle and minify scripts.');
  } else if (scripts > 8) {
    score -= 10;
    suggestions.push('Consider code splitting and async loading for JavaScript.');
  }

  // Analyze stylesheets
  if (stylesheets > 5) {
    score -= 15;
    suggestions.push('Too many CSS files. Combine and minify stylesheets.');
  } else if (stylesheets > 3) {
    score -= 5;
    suggestions.push('Inline critical CSS and defer non-critical styles.');
  }

  // Analyze page size
  if (pageSize > 3000) {
    score -= 25;
    suggestions.push('Page size is too large (>3MB). Optimize all resources.');
  } else if (pageSize > 1500) {
    score -= 15;
    suggestions.push('Page size is large (>1.5MB). Consider optimization.');
  }

  // General suggestions
  if (score < 100) {
    suggestions.push('Enable GZIP/Brotli compression on your server.');
    suggestions.push('Use a CDN to serve static assets.');
    suggestions.push('Implement browser caching with proper cache headers.');
  }

  if (images > 0) {
    suggestions.push('Use responsive images with srcset attribute.');
  }

  if (scripts > 0) {
    suggestions.push('Defer non-critical JavaScript execution.');
  }

  score = Math.max(0, score);

  let rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor';
  if (score >= 90) rating = 'Excellent';
  else if (score >= 70) rating = 'Good';
  else if (score >= 50) rating = 'Needs Improvement';
  else rating = 'Poor';

  return {
    score,
    metrics: {
      images,
      scripts,
      stylesheets,
      totalResources: images + scripts + stylesheets
    },
    suggestions: [...new Set(suggestions)], // Remove duplicates
    rating
  };
}

