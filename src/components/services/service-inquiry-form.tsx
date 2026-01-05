'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';

/**
 * Premium Service Inquiry Form Component
 * 
 * CRO-optimized lead capture form for service pages
 * Replaces purchase/checkout functionality
 */

interface ServiceInquiryFormProps {
  serviceSlug: string;
  serviceName: string;
  defaultTier?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'sticky';
}

const BUDGET_RANGES = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: 'over-100k', label: 'Over $100,000' },
  { value: 'not-sure', label: 'Not Sure Yet' },
];

const HEAR_ABOUT_US_OPTIONS = [
  { value: 'google-search', label: 'Google Search' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'referral', label: 'Referral' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook-ads', label: 'Facebook Ads' },
  { value: 'google-ads', label: 'Google Ads' },
  { value: 'blog-article', label: 'Blog Article' },
  { value: 'other', label: 'Other' },
];

export function ServiceInquiryForm({
  serviceSlug,
  serviceName,
  defaultTier,
  className = '',
  variant = 'default',
}: ServiceInquiryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: serviceName,
    budgetRange: '',
    message: '',
    hearAboutUs: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.serviceInterest.trim()) {
      newErrors.serviceInterest = 'Please select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/services/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceSlug,
          tier: defaultTier,
          source: 'service_page',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      // Success - redirect to thank you page
      router.push(`/services/thank-you?service=${encodeURIComponent(serviceName)}`);
    } catch (error: any) {
      console.error('Inquiry submission error:', error);
      toast({
        type: 'error',
        title: 'Submission Failed',
        description: error.message || 'Failed to submit inquiry. Please try again.',
      });
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const isCompact = variant === 'compact';
  const isSticky = variant === 'sticky';

  return (
    <form
      onSubmit={handleSubmit}
      className={`${className} ${isSticky ? 'sticky top-20' : ''
        } bg-bg-secondary border border-border-primary rounded-lg p-6 shadow-xl`}
    >
      {/* Form Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-medium text-text-primary mb-2">
          {isCompact ? 'Get Started' : 'Request a Quote'}
        </h3>
        <p className="text-sm text-text-secondary">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </div>

      {/* Name (Required) */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-bg-primary border ${errors.name ? 'border-red-500' : 'border-border-primary'
            } rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-[#F59E0B] transition-colors`}
          placeholder="John Doe"
          required
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Email (Required) */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-bg-primary border ${errors.email ? 'border-red-500' : 'border-border-primary'
            } rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-[#F59E0B] transition-colors`}
          placeholder="john@company.com"
          required
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Phone (Optional) */}
      {!isCompact && (
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-[#F59E0B] transition-colors"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      )}

      {/* Company (Optional) */}
      {!isCompact && (
        <div className="mb-4">
          <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-[#F59E0B] transition-colors"
            placeholder="Acme Inc."
          />
        </div>
      )}

      {/* Budget Range (Optional) */}
      {!isCompact && (
        <div className="mb-4">
          <label htmlFor="budgetRange" className="block text-sm font-medium text-text-primary mb-2">
            Budget Range
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-[#F59E0B] transition-colors"
          >
            <option value="">Select budget range</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Message/Requirements (Optional) */}
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
          {isCompact ? 'Message' : 'Project Requirements'}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={isCompact ? 3 : 4}
          className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-[#F59E0B] transition-colors resize-none"
          placeholder="Tell us about your project goals, timeline, and any specific requirements..."
        />
      </div>

      {/* How Did You Hear About Us (Optional) */}
      {!isCompact && (
        <div className="mb-6">
          <label htmlFor="hearAboutUs" className="block text-sm font-medium text-text-primary mb-2">
            How did you hear about us?
          </label>
          <select
            id="hearAboutUs"
            name="hearAboutUs"
            value={formData.hearAboutUs}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-[#F59E0B] transition-colors"
          >
            <option value="">Select an option</option>
            {HEAR_ABOUT_US_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Get Free Quote'
        )}
      </button>

      {/* Trust Indicators */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-tertiary">
        <div className="flex items-center gap-1">
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>No commitment</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>24-hour response</span>
        </div>
      </div>
    </form>
  );
}

