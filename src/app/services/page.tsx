'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Target,
  Search,
  PenTool,
  TrendingUp,
  Share2,
  Mail,
  BarChart,
  Globe,
  Palette,
  Wrench,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Award,
  Clock,
} from 'lucide-react';
import { toast } from '@/components/ui/toaster';

// Service category icons mapping
const categoryIcons: Record<string, LucideIcon> = {
  MARKETING_STRATEGY: Target,
  SEO: Search,
  CONTENT_MARKETING: PenTool,
  PAID_ADVERTISING: TrendingUp,
  SOCIAL_MEDIA: Share2,
  EMAIL_MARKETING: Mail,
  ANALYTICS: BarChart,
  WEB_DEVELOPMENT: Globe,
  WEB_DESIGN: Palette,
  WEB_MAINTENANCE: Wrench,
};

// Testimonials
const testimonials = [
  {
    name: 'Sarah Johnson',
    company: 'TechStart Inc.',
    role: 'Marketing Director',
    content: 'Aureon One transformed our marketing strategy. We saw a 300% increase in qualified leads within 3 months.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    company: 'GrowthCo',
    role: 'CEO',
    content: 'The SEO services delivered exceptional results. We\'re now ranking #1 for our top 10 keywords.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    company: 'E-Shop Plus',
    role: 'Founder',
    content: 'Their web development team built us a stunning e-commerce site that doubled our conversion rate.',
    rating: 5,
  },
];

interface ServiceRecord {
  id: string;
  name: string;
  slug: string;
  category: string;
  popular?: boolean;
  summary?: string;
  description?: string;
  features?: string[];
  icon?: string;
  pricingTiers: Array<{
    tier: string;
    name: string;
    deliveryTime?: string;
    billingType: string;
    features: Array<{ name: string; included: boolean }>;
  }>;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `/api/services?category=${selectedCategory}`
        : '/api/services?popular=true';

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to load services',
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const categories = [
    { id: 'MARKETING_STRATEGY', name: 'Marketing Strategy', icon: Target },
    { id: 'SEO', name: 'SEO Services', icon: Search },
    { id: 'CONTENT_MARKETING', name: 'Content Marketing', icon: PenTool },
    { id: 'PAID_ADVERTISING', name: 'Paid Advertising', icon: TrendingUp },
    { id: 'WEB_DEVELOPMENT', name: 'Web Development', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Agency Services</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            We Build Empires
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-muted-foreground mb-8">
            Don't just compete. Dominate with our elite agency services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#services"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl inline-flex items-center"
            >
              Browse Services
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-300 font-bold text-lg inline-flex items-center"
            >
              Request Access
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <Award className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">24h</div>
            <div className="text-sm text-muted-foreground">Response Time</div>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <Star className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">10+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12" id="services">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Choose Your Service Category
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground border border-border hover:border-primary'
                }`}
            >
              Popular Services
            </button>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center ${selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground border border-border hover:border-primary'
                    }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service) => {
                const Icon = categoryIcons[service.category] || Target;
                return (
                  <div
                    key={service.id}
                    className="bg-card rounded-xl border border-border hover:border-primary transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="p-3 bg-primary/10 rounded-lg mr-4">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-foreground mb-1">
                              {service.name}
                            </h3>
                            {service.popular && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                                <Star className="h-3 w-3 mr-1" />
                                Popular
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6">{service.description}</p>

                      {/* Service Packages */}
                      <div className="space-y-3 mb-6">
                        {service.pricingTiers.map((tier) => (
                          <div
                            key={tier.tier}
                            className="border border-border rounded-lg p-4"
                          >
                            <div className="mb-3">
                              <h4 className="font-bold text-foreground text-lg mb-1">{tier.name}</h4>
                              <p className="text-sm text-muted-foreground">{tier.deliveryTime || tier.billingType.replace('_', ' ')}</p>
                            </div>

                            <ul className="space-y-2">
                              {tier.features.slice(0, 4).map((feature, idx) => (
                                <li key={idx} className="flex items-start text-sm">
                                  <CheckCircle className={`h-4 w-4 mr-2 flex-shrink-0 mt-0.5 ${feature.included ? 'text-primary' : 'text-muted-foreground/50'}`} />
                                  <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/50 line-through'}>
                                    {feature.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/services/${service.slug}`}
                          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-center"
                        >
                          Get a Quote
                        </Link>
                        <Link
                          href={`/services/${service.slug}#details`}
                          className="flex-1 px-6 py-3 bg-transparent border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold text-center"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            What Our Clients Say
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Don't just take our word for it - hear from businesses we've helped grow
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-primary fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-sm text-primary">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4 text-primary-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Let's discuss your project and create a custom solution for your business
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-background text-foreground rounded-lg hover:bg-background/90 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl inline-flex items-center"
            >
              Schedule Free Consultation
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
