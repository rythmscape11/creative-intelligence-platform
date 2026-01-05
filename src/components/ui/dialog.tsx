'use client';

import * as React from 'react';
import { Button } from './button';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const Dialog = ({ children, open, onOpenChange }: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      <div className="relative z-50 bg-white dark:bg-bg-secondary rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export const DialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return <>{children}</>;
};

export const DialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-6 ${className || ''}`}>{children}</div>;
};

export const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{children}</h2>;
};

export const DialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{children}</p>;
};

export const DialogFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`flex justify-end gap-3 mt-6 ${className || ''}`}>{children}</div>;
};

export const DialogClose = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  return (
    <Button onClick={onClick} variant="outline">
      {children}
    </Button>
  );
};

