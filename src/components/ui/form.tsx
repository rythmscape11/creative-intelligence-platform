import * as React from 'react';
import { cn } from '@/lib/utils';

// Form Field Component
export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function FormField({ label, error, required, children, className, htmlFor }: FormFieldProps) {
  const fieldId = htmlFor || React.useId();

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && index === 0) {
          // Only add id to the first form control element
          return React.cloneElement(child as React.ReactElement<any>, { id: fieldId });
        }
        return child;
      })}
      {error && (
        <p className="text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
}

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

// Select Component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = 'Select';

// Multi-Select Component for Objectives
export interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: boolean;
  maxSelections?: number;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  error,
  maxSelections = 10,
}: MultiSelectProps) {
  const [customInput, setCustomInput] = React.useState('');
  const [showCustomInput, setShowCustomInput] = React.useState(false);

  const handleToggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else if (selected.length < maxSelections) {
      onChange([...selected, option]);
    }
  };

  const handleAddCustom = () => {
    if (customInput.trim() && !selected.includes(customInput.trim()) && selected.length < maxSelections) {
      onChange([...selected, customInput.trim()]);
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  const handleRemoveSelected = (option: string) => {
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="space-y-3">
      {/* Selected Items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemoveSelected(item)}
                className="ml-2 text-primary-600 hover:text-primary-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Options Grid */}
      <div className={cn(
        'border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto',
        error ? 'border-red-500' : 'border-gray-300'
      )}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleToggleOption(option)}
                disabled={!selected.includes(option) && selected.length >= maxSelections}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>

        {/* Custom Input */}
        <div className="border-t pt-2">
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              disabled={selected.length >= maxSelections}
              className="text-sm text-primary-600 hover:text-primary-800 disabled:text-gray-700"
            >
              + Add custom objective
            </button>
          ) : (
            <div className="flex gap-2">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom objective"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
              />
              <button
                type="button"
                onClick={handleAddCustom}
                disabled={!customInput.trim() || selected.length >= maxSelections}
                className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:bg-gray-400"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomInput('');
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {selected.length >= maxSelections && (
        <p className="text-sm text-amber-600">
          Maximum {maxSelections} objectives allowed
        </p>
      )}
    </div>
  );
}

// Currency Input Component
export interface CurrencyInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
}

export function CurrencyInput({
  value,
  onChange,
  currency = 'USD',
  error,
  className,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState(
    value ? value.toLocaleString() : ''
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const numericValue = parseInt(rawValue) || 0;

    setDisplayValue(numericValue ? numericValue.toLocaleString() : '');
    onChange(numericValue);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-700 sm:text-sm">$</span>
      </div>
      <Input
        {...props}
        type="text"
        value={displayValue}
        onChange={handleChange}
        error={error}
        className={cn('pl-7', className)}
      />
    </div>
  );
}
