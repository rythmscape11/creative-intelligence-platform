'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '@/components/ui/toaster';
import {
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Target,
  Search,
  PenTool,
  TrendingUp,
  Share2,
  Globe,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

// Note: metadata export doesn't work in 'use client' components
// Metadata should be added in a parent layout or converted to server component

// Service categories for lead generation
const serviceCategories = [
  {
    icon: Target,
    name: 'Marketing Strategy',
    description: 'Comprehensive marketing plans and strategic consultation',
    features: ['Market Research', 'Competitor Analysis', 'Growth Roadmap'],
    link: '/services#marketing-strategy',
  },
  {
    icon: Search,
    name: 'SEO Services',
    description: 'Boost your organic visibility and search rankings',
    features: ['Technical SEO', 'Content Optimization', 'Link Building'],
    link: '/services#seo',
  },
  {
    icon: PenTool,
    name: 'Content Marketing',
    description: 'Engaging content that drives traffic and conversions',
    features: ['Blog Writing', 'Social Content', 'Email Campaigns'],
    link: '/services#content',
  },
  {
    icon: TrendingUp,
    name: 'Paid Advertising',
    description: 'ROI-focused campaigns across all major platforms',
    features: ['Google Ads', 'Social Ads', 'Retargeting'],
    link: '/services#advertising',
  },
  {
    icon: Share2,
    name: 'Social Media',
    description: 'Build and engage your audience on social platforms',
    features: ['Content Creation', 'Community Management', 'Analytics'],
    link: '/services#social',
  },
  {
    icon: Globe,
    name: 'Web Development',
    description: 'Professional websites and landing pages that convert',
    features: ['Custom Design', 'Responsive Development', 'E-commerce'],
    link: '/services#web-development',
  },
];

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    serviceInterest: '',
    budgetRange: '',
    hearAboutUs: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to thank you page with name parameter
        router.push(`/thank-you?name=${encodeURIComponent(formData.name)}&type=contact`);
      } else {
        toast({
          type: 'error',
          title: 'Error',
          description: data.error || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] py-8 px-4 sm:px-6 lg:px-8">
      <main id="main-content" className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Link
            href="/"
            className="inline-flex items-center text-sm mb-6 transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Let's Grow Your Business Together
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Get expert marketing services and web development solutions tailored to your business goals.
            From strategy to execution, we're here to help you succeed.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#F59E0B] mb-2">500+</div>
            <div className="text-sm text-gray-400">Projects Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#F59E0B] mb-2">98%</div>
            <div className="text-sm text-gray-400">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#F59E0B] mb-2">24h</div>
            <div className="text-sm text-gray-400">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#F59E0B] mb-2">10+</div>
            <div className="text-sm text-gray-400">Years Experience</div>
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Our Services
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Choose from our comprehensive range of marketing and web development services
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#F59E0B] transition-all duration-300 hover:shadow-lg hover:shadow-[#F59E0B]/20"
                >
                  <div className="flex items-start mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Icon className="h-6 w-6 text-[#F59E0B]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    {category.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {category.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#F59E0B] mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={category.link}
                    className="inline-flex items-center text-[#F59E0B] hover:text-[#D97706] font-semibold text-sm transition-colors"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-6 space-y-6 sticky top-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Get in Touch
                </h2>
                <p className="text-gray-400">
                  Ready to take your marketing to the next level? Let's talk about your project.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 mt-1 mr-3 flex-shrink-0 text-[#F59E0B]" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Email
                    </h3>
                    <a
                      href="mailto:hello@aureonone.in"
                      className="transition-colors text-gray-400 hover:text-[#F59E0B]"
                    >
                      hello@aureonone.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 mt-1 mr-3 flex-shrink-0 text-[#F59E0B]" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Phone
                    </h3>
                    <a
                      href="tel:+1-555-123-4567"
                      className="transition-colors text-gray-400 hover:text-[#F59E0B]"
                    >
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 mt-1 mr-3 flex-shrink-0 text-[#F59E0B]" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Office
                    </h3>
                    <p className="text-gray-400">
                      123 Marketing Street<br />
                      San Francisco, CA 94102<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#2A2A2A]">
                <h3 className="font-semibold mb-3 text-white">
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  <p>Saturday - Sunday: Closed</p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#2A2A2A]">
                <Link
                  href="/services"
                  className="block w-full px-6 py-3 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-semibold text-center shadow-lg hover:shadow-xl"
                  style={{ color: '#000000' }}
                >
                  View All Services
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 stagger-2">
            <div className="bg-[#1A1A1A] rounded-xl p-8 border border-[#2A2A2A]">
              <h2 className="text-2xl font-semibold mb-6 text-white">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2 text-[#FFFFFF]"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-white placeholder-gray-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2 text-[#FFFFFF]"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-white placeholder-gray-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2 text-[#FFFFFF]"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-white placeholder-gray-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium mb-2 text-[#FFFFFF]"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-white placeholder-gray-500"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2 text-[#FFFFFF]"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales Question</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Service Interest and Budget Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="serviceInterest"
                      className="block text-sm font-medium mb-2 text-[#FFFFFF]"
                    >
                      Service Interest
                    </label>
                    <select
                      id="serviceInterest"
                      name="serviceInterest"
                      value={formData.serviceInterest}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-white"
                    >
                      <option value="">Select a service</option>
                      <option value="Marketing Strategy Development">Marketing Strategy Development</option>
                      <option value="SEO Audit & Optimization">SEO Audit & Optimization</option>
                      <option value="Content Marketing">Content Marketing</option>
                      <option value="Social Media Management">Social Media Management</option>
                      <option value="Email Marketing">Email Marketing</option>
                      <option value="Analytics & Reporting">Analytics & Reporting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="budgetRange"
                      className="block text-sm font-medium mb-2 text-[#FFFFFF]"
                    >
                      Budget Range
                    </label>
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-white"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under $1,000">Under $1,000</option>
                      <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="$10,000+">$10,000+</option>
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </div>
                </div>

                {/* How did you hear about us */}
                <div>
                  <label
                    htmlFor="hearAboutUs"
                    className="block text-sm font-medium mb-2 text-[#FFFFFF]"
                  >
                    How did you hear about us?
                  </label>
                  <select
                    id="hearAboutUs"
                    name="hearAboutUs"
                    value={formData.hearAboutUs}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-white"
                  >
                    <option value="">Select an option</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Referral">Referral</option>
                    <option value="Blog/Content">Blog/Content</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2 text-[#FFFFFF]"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-white placeholder-gray-500"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#F59E0B] transition-all duration-300">
              <h3 className="font-semibold mb-2 text-white">
                How quickly will I get a response?
              </h3>
              <p className="text-sm text-[#A0A0A0]">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#F59E0B] transition-all duration-300">
              <h3 className="font-semibold mb-2 text-white">
                Do you offer phone support?
              </h3>
              <p className="text-sm text-[#A0A0A0]">
                Yes! Phone support is available for Professional and Enterprise plan customers.
              </p>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#F59E0B] transition-all duration-300">
              <h3 className="font-semibold mb-2 text-white">
                Can I schedule a demo?
              </h3>
              <p className="text-sm text-[#A0A0A0]">
                Absolutely! Select "Sales Question" as the subject and mention you'd like a demo.
              </p>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#F59E0B] transition-all duration-300">
              <h3 className="font-semibold mb-2 text-white">
                Where can I find documentation?
              </h3>
              <p className="text-sm text-[#A0A0A0]">
                Visit our <Link href="/help" className="text-[#F59E0B] hover:text-[#D97706] transition-colors">Help Center</Link> for comprehensive guides and tutorials.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
