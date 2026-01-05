import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCalculatorBySlug, getAllCalculatorSlugs } from '@/config/calculators';

interface Props {
    params: Promise<{ slug: string }>;
}

// Generate static paths for all calculators
export async function generateStaticParams() {
    const slugs = getAllCalculatorSlugs();
    return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const calculator = getCalculatorBySlug(slug);

    if (!calculator) {
        return {
            title: 'Calculator Not Found | Aureon One',
        };
    }

    return {
        title: calculator.metaTitle,
        description: calculator.metaDescription,
        keywords: [
            calculator.title.toLowerCase(),
            `${calculator.category} calculator`,
            'marketing calculator',
            'free calculator',
            'marketing roi',
            'media plan pro',
        ],
        openGraph: {
            title: calculator.metaTitle,
            description: calculator.metaDescription,
            type: 'website',
            url: `https://www.mediaplanpro.com/tools/calculators/${slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: calculator.metaTitle,
            description: calculator.metaDescription,
        },
        alternates: {
            canonical: `https://www.mediaplanpro.com/tools/calculators/${slug}`,
        },
    };
}

export { default } from './page';
