import { redirect } from 'next/navigation';

/**
 * Public Strategy Builder Page
 * Redirects to sign-up as we now offer a full 60-day free trial
 * instead of a limited free tool.
 */
export default function StrategyPage() {
  redirect('/auth/signup');
}

