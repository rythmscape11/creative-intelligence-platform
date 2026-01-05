'use client';

import { ReactNode, FormEvent, useState } from 'react';
import { z } from 'zod';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string | number | boolean;
  onChange?: (value: any) => void;
  error?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
  rows?: number;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  disabled,
  value,
  onChange,
  error,
  helpText,
  options,
  rows = 4,
}: FormFieldProps) {
  const baseInputClasses = `
    w-full px-4 py-2 border rounded-lg transition-colors
    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-300'}
  `;

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-2"
        style={{ color: 'var(--color-neutral-charcoal)' }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          rows={rows}
          className={baseInputClasses}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          required={required}
          disabled={disabled}
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          className={baseInputClasses}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            id={name}
            name={name}
            type="checkbox"
            disabled={disabled}
            checked={value as boolean}
            onChange={(e) => onChange?.(e.target.checked)}
            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
          />
          <label
            htmlFor={name}
            className="ml-2 text-sm"
            style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.8 }}
          >
            {helpText}
          </label>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          value={value as string | number}
          onChange={(e) => onChange?.(type === 'number' ? Number(e.target.value) : e.target.value)}
          className={baseInputClasses}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helpText && type !== 'checkbox' && (
        <p
          className="mt-1 text-xs"
          style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}
        >
          {helpText}
        </p>
      )}
    </div>
  );
}

export interface AdminFormProps<T extends z.ZodType> {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void> | void;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

export function AdminForm<T extends z.ZodType>({
  schema,
  onSubmit,
  children,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  loading = false,
  className = '',
}: AdminFormProps<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data: any = {};

      formData.forEach((value, key) => {
        // Handle checkboxes
        if (value === 'on') {
          data[key] = true;
        } else if (value === 'off') {
          data[key] = false;
        } else {
          data[key] = value;
        }
      });

      const validatedData = schema.parse(data);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Form submission error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}

      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </p>
          <ul className="list-disc list-inside text-sm text-red-700">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting || loading}
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Processing...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
}: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5"
          style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.4 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg
            className="h-5 w-5 text-gray-700 hover:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

