import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children, icon }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm mb-6 text-gray-600 dark:text-[#A0A0A0] hover:text-blue-600 dark:hover:text-[#F59E0B] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-[#1A1A1A] rounded-xl p-8 md:p-12 border border-[#2A2A2A]">
          {icon && (
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}

          <h1 className="text-4xl font-bold mb-4 text-white text-center">
            {title}
          </h1>
          <p className="mb-8 text-center text-[#A0A0A0]">
            Last updated: {lastUpdated}
          </p>

          <div className="prose dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      {children}
    </section>
  );
}

interface SubsectionProps {
  title: string;
  children: ReactNode;
}

export function Subsection({ title, children }: SubsectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      {children}
    </div>
  );
}

interface ParagraphProps {
  children: ReactNode;
}

export function Paragraph({ children }: ParagraphProps) {
  return <p className="text-[#A0A0A0] mb-4">{children}</p>;
}

interface ListProps {
  items: string[];
}

export function List({ items }: ListProps) {
  return (
    <ul className="list-disc pl-6 mb-4 text-[#A0A0A0] space-y-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

interface InfoBoxProps {
  title: string;
  description: string;
}

export function InfoBox({ title, description }: InfoBoxProps) {
  return (
    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors">
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#A0A0A0]">{description}</p>
    </div>
  );
}

