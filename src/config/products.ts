export const FRAMEWORK_PRODUCTS = [
    {
        slug: 'ai-media-planning-framework',
        name: 'AI Media Planning Framework',
        description: 'A comprehensive framework for AI-driven media planning.',
        price: 99900, // ₹999 in paise
        currency: 'INR',
        features: [
            'Comprehensive AI Media Planning Guide',
            'Template Spreadsheets',
            'Video Walkthroughs'
        ],
        assets: [
            {
                name: 'AI Media Planning Guide PDF',
                url: 'https://cdn.aureonone.in/frameworks/ai-media-planning-guide.pdf'
            }
        ]
    },
    {
        slug: 'revenue-forecast-toolkit',
        name: 'Revenue Forecast Toolkit',
        description: 'Tools and templates for accurate revenue forecasting.',
        price: 199900, // ₹1,999 in paise
        currency: 'INR',
        features: [
            'Advanced Forecasting Models',
            'Scenario Planning Tools',
            'Dashboard Templates'
        ],
        assets: [
            {
                name: 'Revenue Forecast Toolkit ZIP',
                url: 'https://cdn.aureonone.in/frameworks/revenue-forecast-toolkit.zip'
            }
        ]
    },
    {
        slug: 'marketing-os-bundle',
        name: 'Complete Marketing OS Bundle',
        description: 'The ultimate marketing operating system bundle.',
        price: 499900, // ₹4,999 in paise
        currency: 'INR',
        features: [
            'All Frameworks Included',
            'Exclusive Strategy Workshops',
            '12 Months of Updates'
        ],
        assets: [
            {
                name: 'Marketing OS Bundle Access',
                url: 'https://cdn.aureonone.in/frameworks/marketing-os-bundle.pdf'
            }
        ]
    }
] as const;

export type FrameworkProduct = typeof FRAMEWORK_PRODUCTS[number];
