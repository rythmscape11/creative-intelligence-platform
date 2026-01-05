'use client';

import { FormHTMLAttributes } from 'react';
import { useCsrfToken } from './csrf-provider';

interface CsrfFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

/**
 * Form component with automatic CSRF token injection
 * 
 * Usage:
 * <CsrfForm onSubmit={handleSubmit}>
 *   <input name="field" />
 *   <button type="submit">Submit</button>
 * </CsrfForm>
 */
export function CsrfForm({ children, ...props }: CsrfFormProps) {
  const csrfToken = useCsrfToken();
  
  return (
    <form {...props}>
      <input type="hidden" name="_csrf" value={csrfToken} />
      {children}
    </form>
  );
}

