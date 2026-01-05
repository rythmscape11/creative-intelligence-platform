import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Demo - See Aureon One in Action | Aureon One',
  description: 'Watch how Aureon One uses AI to generate professional marketing strategies in minutes. See our platform in action with live demos and video tutorials.',
  keywords: 'demo, product demo, marketing strategy demo, AI marketing demo, platform demo, video tutorial',
  alternates: {
    canonical: '/demo',
  },
};

const features = [
  'AI-powered strategy generation',
  'Multi-step guided workflow',
  'Professional export formats (PPTX, DOCX, XLSX)',
  'Customizable templates',
  'Real-time collaboration',
  'Analytics and insights',
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-mesh">

      <main id="main-content">
        {/* Hero Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center glass-card p-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-accent-secondary text-white">
                <Sparkles className="h-4 w-4" />
                See Aureon One in Action
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-text-primary">
                Watch How AI Creates Your Marketing Strategy
              </h1>
              <p className="text-xl text-gray-600 dark:text-text-secondary">
                See how Aureon One transforms your business ideas into comprehensive marketing strategies in just minutes
              </p>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {/* Video Placeholder */}
              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full mb-6 transition-all duration-300 hover:scale-110 cursor-pointer bg-accent-secondary">
                      <Play className="h-10 w-10 text-white ml-1" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-text-primary">
                      Product Demo Video
                    </h3>
                    <p className="text-gray-600 dark:text-text-secondary">
                      Click to watch the demo
                    </p>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`glass-card flex items-start gap-3 p-4 rounded-lg transition-all duration-300 hover:scale-105 ${index < 3 ? `stagger-${index + 1}` : ''
                      }`}
                  >
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5 text-accent-secondary" />
                    <span className="text-gray-600 dark:text-text-secondary">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-text-primary">
                How It Works
              </h2>
              <div className="space-y-8">
                {[
                  {
                    step: '1',
                    title: 'Enter Your Business Information',
                    description: 'Tell us about your business, industry, and target audience in our simple guided form.',
                  },
                  {
                    step: '2',
                    title: 'AI Analyzes Your Inputs',
                    description: 'Our advanced AI processes your information and generates tailored marketing strategies based on industry best practices.',
                  },
                  {
                    step: '3',
                    title: 'Review & Customize',
                    description: 'Review the generated strategy, make adjustments, and customize it to perfectly fit your needs.',
                  },
                  {
                    step: '4',
                    title: 'Export & Implement',
                    description: 'Export your strategy to PowerPoint, Word, or Excel and start implementing your marketing plan immediately.',
                  },
                ].map((item, idx) => (
                  <div
                    key={item.step}
                    className={`glass-card p-6 flex gap-6 transition-all duration-300 hover:scale-105 ${idx < 4 ? `stagger-${(idx % 3) + 1}` : ''
                      }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 text-white rounded-full text-xl font-bold bg-accent-secondary">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-text-primary">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-text-secondary">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center glass-card p-10">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-text-primary">
                Ready to Create Your Marketing Strategy?
              </h2>
              <p className="text-xl mb-8 text-gray-600 dark:text-text-secondary">
                Start building professional marketing strategies in minutes with AI
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button variant="default" size="lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

