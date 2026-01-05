'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ServiceInquiryForm } from '@/components/services/service-inquiry-form';
import { getServiceBySlug } from '@/config/services';
import {
  ArrowLeft,
  CheckCircle,
  Star,
  Shield,
  Zap,
  Clock,
  Users,
  TrendingUp,
  Award,
  ChevronDown,
} from 'lucide-react';

/**
 * CRO-Optimized Service Landing Page
 * 
 * Replaces purchase functionality with premium lead capture
 * Designed for ad platform traffic (Facebook Ads, Google Ads, LinkedIn Ads)
 */

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [service, setService] = useState<any>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const serviceData = getServiceBySlug(slug);
    if (serviceData) {
      setService(serviceData);
    }
  }, [slug]);

  if (!service) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F59E0B] mb-4"></div>
          <p className="text-text-secondary">Loading service...</p>
        </div>
      </div>
    );
  }

  // Service-specific benefits (can be customized per service)
  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Proven Results',
      description: 'Data-driven strategies that deliver measurable ROI and business growth.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Expert Team',
      description: '10+ years of experience with 500+ successful projects delivered.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Fast Turnaround',
      description: 'Quick delivery without compromising on quality or attention to detail.',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Quality Guaranteed',
      description: '100% satisfaction guarantee with unlimited revisions until perfect.',
    },
  ];

  // Service-specific testimonials
  const testimonials = [
    {
      quote: `The ${service.name.toLowerCase()} service exceeded our expectations. Professional, responsive, and delivered exceptional results.`,
      author: 'Sarah Chen',
      role: 'Marketing Director',
      company: 'TechStart Inc.',
      rating: 5,
    },
    {
      quote: 'Best investment we made this year. The ROI has been incredible and the team is always available to help.',
      author: 'Michael Rodriguez',
      role: 'CEO',
      company: 'Digital Growth',
      rating: 5,
    },
  ];

  // Process steps (can be customized per service)
  const processSteps = [
    {
      step: 1,
      title: 'Discovery Call',
      description: 'We discuss your goals, challenges, and requirements in a free 30-minute consultation.',
    },
    {
      step: 2,
      title: 'Custom Proposal',
      description: 'Receive a detailed proposal with strategy, timeline, and transparent pricing.',
    },
    {
      step: 3,
      title: 'Execution',
      description: 'Our expert team gets to work, keeping you updated every step of the way.',
    },
    {
      step: 4,
      title: 'Delivery & Support',
      description: 'Receive your deliverables with ongoing support and optimization.',
    },
  ];

  // FAQs (using service FAQs if available, otherwise default)
  const faqs: Array<{ question: string; answer: string }> = service.faqs || [
    {
      question: 'How long does it take to get started?',
      answer: 'We can typically start within 24-48 hours after our initial consultation and agreement on the project scope.',
    },
    {
      question: 'What is included in the service?',
      answer: 'Each package includes comprehensive deliverables tailored to your needs. We\'ll provide a detailed breakdown during our consultation.',
    },
    {
      question: 'Do you offer revisions?',
      answer: 'Yes! We offer unlimited revisions until you\'re 100% satisfied with the results.',
    },
    {
      question: 'What is your refund policy?',
      answer: 'We offer a 100% satisfaction guarantee. If you\'re not happy with our work, we\'ll make it right or provide a full refund.',
    },
    {
      question: 'Can I see examples of your work?',
      answer: 'Absolutely! We\'ll share relevant case studies and examples during our consultation call.',
    },
    {
      question: 'Do you work with businesses in my industry?',
      answer: 'We work with businesses across all industries including B2B, B2C, SaaS, eCommerce, and more.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      
      <main>
        {/* Hero Section - Above the Fold */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Hero Content */}
              <div>
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm mb-6 transition-colors text-text-tertiary hover:text-text-primary"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Services
                </Link>

                {service.popular && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[#F59E0B]/10 text-[#F59E0B] mb-4">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    Most Popular Service
                  </div>
                )}

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-text-primary mb-6 leading-tight">
                  {service.name}
                </h1>

                <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                  {service.description}
                </p>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-[#F59E0B] fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-text-primary">4.9/5</span>
                    <span className="text-sm text-text-tertiary">(500+ reviews)</span>
                  </div>
                  <div className="h-4 w-px bg-border-primary hidden sm:block" />
                  <div className="text-sm text-text-tertiary">
                    <span className="font-medium text-text-primary">1,000+</span> projects completed
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-bg-secondary border border-border-primary rounded-lg">
                    <Shield className="h-8 w-8 text-[#F59E0B] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-text-primary text-sm">Money-Back</div>
                      <div className="text-xs text-text-tertiary">100% Guaranteed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-bg-secondary border border-border-primary rounded-lg">
                    <Zap className="h-8 w-8 text-[#F59E0B] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-text-primary text-sm">Fast Delivery</div>
                      <div className="text-xs text-text-tertiary">On-time always</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-bg-secondary border border-border-primary rounded-lg">
                    <Award className="h-8 w-8 text-[#F59E0B] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-text-primary text-sm">Expert Team</div>
                      <div className="text-xs text-text-tertiary">10+ years exp</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Form CTA - Show on mobile, hide on desktop */}
                <div className="lg:hidden mb-8">
                  <a
                    href="#inquiry-form"
                    className="block w-full px-8 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                  >
                    Get Free Quote
                  </a>
                </div>
              </div>

              {/* Right Column - Lead Capture Form (Desktop) */}
              <div className="hidden lg:block" id="inquiry-form">
                <ServiceInquiryForm
                  serviceSlug={slug}
                  serviceName={service.name}
                  variant="sticky"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-secondary border-y border-border-primary">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-medium text-text-primary mb-4">
                Why Choose Our {service.name}?
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                We deliver exceptional results through proven strategies and expert execution.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-bg-primary border border-border-primary rounded-lg p-6 hover:border-[#F59E0B]/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center text-[#F59E0B] mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">{benefit.title}</h3>
                  <p className="text-sm text-text-secondary">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-medium text-text-primary mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-lg text-text-secondary">
                See what our clients say about working with us
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-bg-secondary border border-border-primary rounded-lg p-8 hover:border-[#F59E0B]/30 transition-all duration-300"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-[#F59E0B] fill-current" />
                    ))}
                  </div>
                  <p className="text-text-secondary mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#F59E0B]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#F59E0B] font-semibold">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-text-primary font-medium">{testimonial.author}</p>
                      <p className="text-sm text-text-tertiary">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features/What's Included Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-secondary border-y border-border-primary">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-medium text-text-primary mb-4">
                What's Included
              </h2>
              <p className="text-lg text-text-secondary">
                Comprehensive service packages tailored to your needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.pricingTiers[0]?.features.slice(0, 9).map((feature: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-bg-primary border border-border-primary rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">{feature.name}</span>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-text-tertiary text-sm">
                And much more! Get a detailed breakdown in your custom proposal.
              </p>
            </div>
          </div>
        </section>

        {/* Process/How It Works Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-medium text-text-primary mb-4">
                How It Works
              </h2>
              <p className="text-lg text-text-secondary">
                Simple, transparent process from start to finish
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connector Line (hidden on last item) */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border-primary" />
                  )}

                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-[#F59E0B]/10 rounded-full flex items-center justify-center border-4 border-bg-primary">
                      <span className="text-3xl font-bold text-[#F59E0B]">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-medium text-text-primary mb-2">{step.title}</h3>
                    <p className="text-sm text-text-secondary">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-secondary border-y border-border-primary">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-medium text-text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-text-secondary">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-bg-primary border border-border-primary rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-bg-elevated transition-colors"
                  >
                    <span className="font-medium text-text-primary pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-text-tertiary flex-shrink-0 transition-transform ${
                        openFaqIndex === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section with Form */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-medium text-text-primary mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-text-secondary mb-6">
                  Fill out the form and our team will get back to you within 24 hours with a custom proposal tailored to your needs.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-text-primary">Free Consultation</p>
                      <p className="text-sm text-text-tertiary">30-minute discovery call to understand your needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-text-primary">Custom Proposal</p>
                      <p className="text-sm text-text-tertiary">Detailed plan with transparent pricing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-text-primary">No Commitment</p>
                      <p className="text-sm text-text-tertiary">Zero obligation to move forward</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <ServiceInquiryForm
                  serviceSlug={slug}
                  serviceName={service.name}
                  variant="default"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
