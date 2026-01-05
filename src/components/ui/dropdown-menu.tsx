'use client';

import * as React from 'react';
import { useState, useRef, useEffect, createContext, useContext } from 'react';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={dropdownRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within a DropdownMenu');

  return (
    <div onClick={() => context.setIsOpen(!context.isOpen)}>
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({ children, align }: { children: React.ReactNode; align?: string }) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuContent must be used within a DropdownMenu');

  if (!context.isOpen) return null;

  return (
    <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-bg-elevated shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-border-primary">
      <div className="py-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => {
  const context = useContext(DropdownContext);

  const handleClick = () => {
    if (onClick) onClick();
    context?.setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-text-primary hover:bg-gray-100 dark:hover:bg-bg-hover hover:text-gray-900 dark:hover:text-white ${className || ''}`}
    >
      {children}
    </button>
  );
};

export const DropdownMenuSeparator = () => {
  return <div className="my-1 h-px bg-gray-200 dark:bg-border-primary" />;
};

export const DropdownMenuLabel = ({ children }: { children: React.ReactNode }) => {
  return <div className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-text-primary">{children}</div>;
};

