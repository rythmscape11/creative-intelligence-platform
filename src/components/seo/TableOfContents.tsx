'use client';

import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export interface TOCItem {
  id: string;
  title: string;
  level: number; // 2 for H2, 3 for H3
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export function TableOfContents({ items, className = '' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className={`bg-bg-secondary border border-border-primary rounded-lg p-6 ${className} ${isSticky ? 'sticky top-24' : ''
        }`}
      aria-label="Table of contents"
    >
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-text-secondary" />
        <h2 className="text-lg font-bold text-text-primary">Table of Contents</h2>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`${item.level === 3 ? 'ml-4' : ''}`}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className={`text-left w-full py-1.5 px-3 rounded transition-colors ${activeId === item.id
                  ? 'bg-zinc-500/10 text-zinc-400 font-semibold'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                } ${item.level === 2 ? 'text-sm' : 'text-xs'}`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TableOfContents;

