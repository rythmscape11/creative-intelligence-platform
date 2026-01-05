import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Label Component - Formless.xyz Inspired
 *
 * Features:
 * - Clear, readable labels
 * - Positioned above inputs
 * - Medium weight for emphasis
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-relaxed text-neutral-800 mb-2 block',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';

export { Label };

