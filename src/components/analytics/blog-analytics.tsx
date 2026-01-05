'use client';

import { useEffect } from 'react';
import { trackEvent } from './google-analytics';

interface BlogAnalyticsProps {
  postId: string;
  postTitle: string;
  postCategory?: string;
  postTags?: string[];
}

export function BlogAnalytics({ postId, postTitle, postCategory, postTags }: BlogAnalyticsProps) {
  useEffect(() => {
    // Track blog post view
    trackEvent('blog_post_view', {
      post_id: postId,
      post_title: postTitle,
      post_category: postCategory,
      post_tags: postTags?.join(', '),
    });

    // Track reading progress
    let maxScroll = 0;
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;

        // Track milestones
        if (scrollPercentage === 25 || scrollPercentage === 50 || scrollPercentage === 75 || scrollPercentage === 100) {
          trackEvent('blog_reading_progress', {
            post_id: postId,
            post_title: postTitle,
            scroll_percentage: scrollPercentage,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
      trackEvent('blog_time_on_page', {
        post_id: postId,
        post_title: postTitle,
        time_spent_seconds: timeSpent,
      });
    };

    window.addEventListener('beforeunload', trackTimeOnPage);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', trackTimeOnPage);
    };
  }, [postId, postTitle, postCategory, postTags]);

  return null;
}

// Track newsletter signup
export function trackNewsletterSignup(source: string) {
  trackEvent('newsletter_signup', {
    source,
  });
}

// Track social share
export function trackSocialShare(platform: string, postId: string, postTitle: string) {
  trackEvent('social_share', {
    platform,
    post_id: postId,
    post_title: postTitle,
  });
}

// Track comment submission
export function trackCommentSubmission(postId: string, postTitle: string) {
  trackEvent('comment_submission', {
    post_id: postId,
    post_title: postTitle,
  });
}

// Track search
export function trackSearch(query: string, resultsCount: number) {
  trackEvent('blog_search', {
    search_query: query,
    results_count: resultsCount,
  });
}

// Track category/tag click
export function trackCategoryClick(categoryName: string) {
  trackEvent('category_click', {
    category_name: categoryName,
  });
}

export function trackTagClick(tagName: string) {
  trackEvent('tag_click', {
    tag_name: tagName,
  });
}

