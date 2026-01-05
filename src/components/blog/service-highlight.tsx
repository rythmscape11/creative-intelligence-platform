'use client';

import Link from 'next/link';
import {
  ChartBarIcon,
  LightBulbIcon,
  CpuChipIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';

export function ServiceHighlight() {
  const services = [
    {
      icon: CpuChipIcon,
      title: 'AI Strategy Builder',
      description: 'Create comprehensive marketing strategies in minutes with AI',
      link: '/auth/signup',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: ChartBarIcon,
      title: 'Growth Suite',
      description: 'Complete toolkit for marketing optimization and analytics',
      link: '/growth-suite',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: LightBulbIcon,
      title: 'Marketing Tools',
      description: '70+ free tools for content, SEO, social media & more',
      link: '/tools',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: PresentationChartLineIcon,
      title: 'Consultation',
      description: 'Expert guidance for your marketing challenges',
      link: '/contact',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-8 border border-gray-200 dark:border-[#2A2A2A]">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Our Marketing Services
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Everything you need to succeed in digital marketing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Link
              key={index}
              href={service.link}
              className="group bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#F59E0B] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${service.color} mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#F59E0B] transition-colors">
                {service.title}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-4 flex items-center text-[#F59E0B] font-semibold text-sm group-hover:gap-2 transition-all">
                Learn More
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          style={{ color: '#000000' }}
        >
          View All Plans & Pricing
        </Link>
      </div>
    </div>
  );
}

