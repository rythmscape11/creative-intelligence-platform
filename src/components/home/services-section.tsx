'use client';

import Link from 'next/link';
import {
  ChartBarIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  MegaphoneIcon,
  CodeBracketIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    name: 'Marketing Strategy',
    description: 'Comprehensive marketing plans tailored to your business goals and target audience.',
    icon: ChartBarIcon,
    color: 'from-blue-500 to-blue-600',
    href: '/services/marketing-strategy-consultation',
  },
  {
    name: 'SEO Services',
    description: 'Boost your search rankings with data-driven SEO strategies and optimization.',
    icon: MagnifyingGlassIcon,
    color: 'from-green-500 to-green-600',
    href: '/services/seo-audit-optimization',
  },
  {
    name: 'Content Marketing',
    description: 'Engage your audience with compelling content that drives conversions.',
    icon: PencilSquareIcon,
    color: 'from-purple-500 to-purple-600',
    href: '/services/content-marketing-strategy',
  },
  {
    name: 'Paid Advertising',
    description: 'Maximize ROI with expertly managed Google Ads, Facebook Ads, and more.',
    icon: MegaphoneIcon,
    color: 'from-orange-500 to-orange-600',
    href: '/services/google-ads-management',
  },
  {
    name: 'Web Development',
    description: 'Build high-performance websites and landing pages that convert visitors.',
    icon: CodeBracketIcon,
    color: 'from-pink-500 to-pink-600',
    href: '/services/landing-page-development',
  },
];

export function ServicesSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-bg-secondary">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-text-primary mb-4">
            Professional Marketing Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-text-secondary max-w-3xl mx-auto">
            From strategy to execution, we offer comprehensive marketing services to help your business grow
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.name}
                href={service.href}
                className="group bg-white dark:bg-bg-primary border border-gray-200 dark:border-border-primary rounded-xl p-8 hover:border-accent-primary transition-all duration-300 hover:shadow-xl"
              >
                <div className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 dark:text-text-secondary mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center text-accent-primary font-semibold group-hover:gap-2 transition-all">
                  Learn More
                  <ArrowRightIcon className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-4 bg-accent-primary rounded-lg hover:bg-accent-hover transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
            style={{ color: '#000000' }}
          >
            View All Services
            <ArrowRightIcon className="h-5 w-5 ml-2" style={{ color: '#000000' }} />
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-accent-primary mb-2">500+</div>
            <div className="text-gray-600 dark:text-text-secondary">Happy Clients</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-primary mb-2">98%</div>
            <div className="text-gray-600 dark:text-text-secondary">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-primary mb-2">24h</div>
            <div className="text-gray-600 dark:text-text-secondary">Response Time</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-primary mb-2">10+</div>
            <div className="text-gray-600 dark:text-text-secondary">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
}

