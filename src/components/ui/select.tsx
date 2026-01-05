'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  value?: string;
  selectedLabel?: React.ReactNode;
  placeholder?: string;
  open: boolean;
  disabled?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (value: string, label: React.ReactNode) => void;
  registerOption: (value: string, label: React.ReactNode) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

const Select = ({
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled,
  name,
  className,
  children,
  ...props
}: SelectProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [selectedLabel, setSelectedLabel] = React.useState<React.ReactNode>();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Map<string, React.ReactNode>>(new Map());
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Registering options lets us hydrate labels so dark mode dropdowns stay readable.
  const registerOption = React.useCallback((optionValue: string, label: React.ReactNode) => {
    setOptions((previous) => {
      const next = new Map(previous);
      next.set(optionValue, label);
      return next;
    });
  }, []);

  React.useEffect(() => {
    if (currentValue && options.has(currentValue)) {
      setSelectedLabel(options.get(currentValue));
    } else if (!currentValue) {
      setSelectedLabel(undefined);
    }
  }, [currentValue, options]);

  const handleSelect = (nextValue: string, label: React.ReactNode) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    setSelectedLabel(label);
    onValueChange?.(nextValue);
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const contextValue = React.useMemo(
    () => ({
      value: currentValue,
      selectedLabel,
      placeholder,
      open,
      disabled,
      setOpen,
      onSelect: handleSelect,
      registerOption,
    }),
    [currentValue, selectedLabel, placeholder, open, disabled, registerOption]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div
        ref={rootRef}
        className={cn('relative w-full text-sm', className)}
        data-state={open ? 'open' : 'closed'}
        {...props}
      >
        {name && <input type="hidden" name={name} value={currentValue ?? ''} />}
        {children}
      </div>
    </SelectContext.Provider>
  );
};

Select.displayName = 'Select';

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within <Select>');
  }
  return context;
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen, disabled } = useSelectContext();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  return (
    <button
      type="button"
      ref={ref}
      className={cn(
        'flex w-full items-center justify-between rounded-md border border-border-primary bg-input px-3 py-2 text-left text-sm text-text-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-disabled={disabled}
      onClick={() => !disabled && setOpen((prev) => !prev)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      data-state={open ? 'open' : 'closed'}
      {...props}
    >
      <span className="flex-1 truncate">{children ?? <SelectValue />}</span>
      <ChevronDown
        className="ml-2 h-4 w-4 flex-shrink-0 text-text-secondary transition-transform"
        aria-hidden="true"
        data-rotate={open ? 'true' : 'false'}
      />
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open } = useSelectContext();
  if (!open) return null;

  return (
    <div
      role="listbox"
      className={cn(
        'absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-md border border-border-primary bg-bg-secondary text-text-primary shadow-lg focus:outline-none',
        className
      )}
    >
      {children}
    </div>
  );
};

const SelectItem = ({
  value,
  children,
  className,
  ...props
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const { value: selectedValue, onSelect, registerOption, disabled } = useSelectContext();
  const isSelected = selectedValue === value;

  React.useEffect(() => {
    registerOption(value, children);
  }, [value, children, registerOption]);

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      disabled={disabled}
      className={cn(
        'flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-bg-hover focus-visible:outline-none focus-visible:bg-bg-hover aria-selected:bg-bg-hover',
        isSelected ? 'text-accent-highlight' : 'text-text-primary',
        className
      )}
      onClick={() => onSelect(value, children)}
      {...props}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check className="ml-2 h-4 w-4 flex-shrink-0 text-accent-highlight" aria-hidden="true" />}
    </button>
  );
};

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { selectedLabel, placeholder: contextPlaceholder } = useSelectContext();
  const label = selectedLabel ?? placeholder ?? contextPlaceholder ?? 'Select an option';
  const isPlaceholder = !selectedLabel;

  return (
    <span className={cn('block truncate', isPlaceholder && 'text-text-secondary')}>
      {label}
    </span>
  );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
