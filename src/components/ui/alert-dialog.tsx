'use client';

import * as React from 'react';
import { Button } from './button';

export const AlertDialog = ({ children, open, onOpenChange }: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      <div className="relative z-50 bg-white dark:bg-bg-secondary rounded-lg shadow-xl max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

export const AlertDialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return <>{children}</>;
};

export const AlertDialogContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-6">{children}</div>;
};

export const AlertDialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>;
};

export const AlertDialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{children}</h2>;
};

export const AlertDialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{children}</p>;
};

export const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex justify-end gap-3 mt-6">{children}</div>;
};

export const AlertDialogAction = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => {
  return (
    <Button onClick={onClick} variant="default" className={className}>
      {children}
    </Button>
  );
};

export const AlertDialogCancel = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => {
  return (
    <Button onClick={onClick} variant="outline" className={className}>
      {children}
    </Button>
  );
};

