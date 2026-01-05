import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea Component - Formless.xyz Inspired
 *
 * Features:
 * - Larger minimum height (120px)
 * - Subtle borders (neutral-300)
 * - Primary color focus ring
 * - Generous padding
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-lg border border-border-primary bg-bg-tertiary px-4 py-3 text-base text-text-primary transition-all duration-300 ease-out',
          'placeholder:text-text-tertiary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary focus-visible:border-white',
          'hover:border-border-hover hover:bg-bg-hover',
          'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-bg-secondary',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };

