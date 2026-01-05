'use client';

import { useState, useEffect } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

interface ScrollToTopProps {
  threshold?: number;
  showScrollToBottom?: boolean;
}

export function ScrollToTop({ threshold = 300, showScrollToBottom = false }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show button after scrolling past threshold
      setIsVisible(scrolled > threshold);
      
      // Check if at bottom (within 100px of bottom)
      setIsAtBottom(scrolled + windowHeight >= documentHeight - 100);
    };

    // Add smooth scroll behavior to html element
    document.documentElement.style.scrollBehavior = 'smooth';

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Check initial state

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-yellow) 0%, var(--color-accent-amber) 100%)',
          boxShadow: '0 4px 12px rgba(168, 216, 234, 0.4)',
        }}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <ArrowUpIcon className="h-6 w-6 text-white" />
      </button>

      {/* Scroll to Bottom Button (optional) */}
      {showScrollToBottom && !isAtBottom && (
        <button
          onClick={scrollToBottom}
          className={`fixed bottom-24 right-8 z-40 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
          }`}
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-orange) 0%, var(--color-primary-yellow-dark) 100%)',
            boxShadow: '0 4px 12px rgba(255, 171, 145, 0.4)',
          }}
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <ArrowUpIcon className="h-6 w-6 text-white transform rotate-180" />
        </button>
      )}
    </>
  );
}

