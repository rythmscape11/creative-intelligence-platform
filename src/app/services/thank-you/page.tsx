'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Mail, Phone, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Service Inquiry Thank You Page
 * 
 * Confirms form submission and sets expectations
 * Includes conversion tracking and next steps
 */

function ThankYouContent() {
  const searchParams = useSearchParams();
  const serviceName = searchParams.get('service') || 'our service';

  useEffect(() => {
    // Track conversion with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        event_category: 'Service Inquiry',
        event_label: serviceName,
        value: 1,
      });
    }

    // Track with Facebook Pixel if available
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: serviceName,
        content_category: 'Service Inquiry',
      });
    }
  }, [serviceName]);

  return (
    <div className="min-h-screen bg-bg-primary">

      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>

            <h1 className="text-4xl md:text-5xl font-medium text-text-primary mb-4">
              Thank You for Your Inquiry!
            </h1>

            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              We've received your request for <span className="text-[#F59E0B] font-medium">{serviceName}</span> and our team is reviewing it now.
            </p>
          </div>

          {/* What Happens Next */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-medium text-text-primary mb-6">What Happens Next?</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F59E0B]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#F59E0B] font-semibold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-1">
                    Confirmation Email (Within 5 minutes)
                  </h3>
                  <p className="text-text-secondary">
                    Check your inbox for a confirmation email with your inquiry details and next steps.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F59E0B]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#F59E0B] font-semibold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-1">
                    Team Review (Within 24 hours)
                  </h3>
                  <p className="text-text-secondary">
                    Our expert team will review your requirements and prepare a customized proposal.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F59E0B]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#F59E0B] font-semibold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-1">
                    Personal Consultation (Within 48 hours)
                  </h3>
                  <p className="text-text-secondary">
                    We'll reach out to schedule a free consultation call to discuss your project in detail.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Download Free Guide */}
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 hover:border-[#F59E0B]/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                  <Download className="h-6 w-6 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    Free Marketing Guide
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Download our comprehensive guide while you wait for our response.
                  </p>
                  <Link
                    href="/resources/marketing-guide.pdf"
                    className="inline-flex items-center text-[#F59E0B] hover:text-[#FF8C00] transition-colors text-sm font-medium"
                  >
                    Download Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Book a Call */}
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 hover:border-[#F59E0B]/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    Book a Discovery Call
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Want to talk sooner? Schedule a free 30-minute consultation.
                  </p>
                  <Link
                    href="https://calendly.com/mediaplanpro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#F59E0B] hover:text-[#FF8C00] transition-colors text-sm font-medium"
                  >
                    Schedule Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-medium text-text-primary mb-6 text-center">
              Need Immediate Assistance?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-sm text-text-tertiary mb-1">Email Us</p>
                  <a
                    href="mailto:hello@aureonone.in"
                    className="text-text-primary hover:text-[#F59E0B] transition-colors font-medium"
                  >
                    hello@aureonone.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-sm text-text-tertiary mb-1">Call Us</p>
                  <a
                    href="tel:+15551234567"
                    className="text-text-primary hover:text-[#F59E0B] transition-colors font-medium"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-medium text-text-primary mb-6 text-center">
              Join 500+ Happy Clients
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-bg-primary border border-border-primary rounded-lg p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-secondary mb-4">
                  "Aureon One transformed our marketing strategy. Their team is professional, responsive, and delivers exceptional results."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F59E0B]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#F59E0B] font-semibold">SC</span>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">Sarah Chen</p>
                    <p className="text-sm text-text-tertiary">Marketing Director, TechStart</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-primary border border-border-primary rounded-lg p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-secondary mb-4">
                  "Best investment we made this year. The ROI from their services has been incredible. Highly recommend!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F59E0B]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#F59E0B] font-semibold">MR</span>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">Michael Rodriguez</p>
                    <p className="text-sm text-text-tertiary">CEO, Digital Growth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/services">
              <Button className="bg-bg-secondary hover:bg-bg-elevated border border-border-primary text-text-primary px-8 py-3">
                Explore More Services
              </Button>
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F59E0B] mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}

