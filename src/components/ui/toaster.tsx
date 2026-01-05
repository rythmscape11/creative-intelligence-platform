'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToasterProps {
  toasts?: Toast[];
}

// Store toasts in a module-level array
let toasts: Toast[] = [];
const listeners: Set<(toasts: Toast[]) => void> = new Set();

function emitChange() {
  const currentToasts = [...toasts];
  listeners.forEach((listener) => listener(currentToasts));
}

export function toast(toastData: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast = { ...toastData, id };
  toasts = [...toasts, newToast];
  emitChange();

  // Auto remove after duration (default 4 seconds for errors, 3 for others)
  const duration = toastData.duration || (toastData.type === 'error' ? 4000 : 3000);
  setTimeout(() => {
    removeToast(id);
  }, duration);

  return id;
}

export function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emitChange();
}

export function clearAllToasts() {
  toasts = [];
  emitChange();
}

export function Toaster({ toasts: initialToasts = [] }: ToasterProps) {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(initialToasts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (newToasts: Toast[]) => setCurrentToasts(newToasts);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  if (!mounted) return null;

  const toastElements = (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
      {currentToasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  );

  return createPortal(toastElements, document.body);
}

function ToastComponent({ toast }: { toast: Toast }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 200); // Wait for exit animation
  }, [toast.id]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-900 border-green-700 text-green-100';
      case 'error':
        return 'bg-red-900 border-red-700 text-red-100';
      case 'warning':
        return 'bg-yellow-900 border-yellow-700 text-yellow-100';
      case 'info':
        return 'bg-blue-900 border-blue-700 text-blue-100';
      default:
        return 'bg-gray-900 border-gray-700 text-gray-100';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        ${getToastStyles()}
        pointer-events-auto
        border rounded-lg p-4 shadow-xl
        min-w-[300px] max-w-sm
        transform transition-all duration-200 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        cursor-pointer
      `}
      onClick={handleClose}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{getIcon()}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="mt-1 text-sm opacity-80">{toast.description}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
