import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const pageSpeedAnalyzerContent = {
  metadata: {
    title: 'Page Speed Analyzer - Test Website Loading Speed | Aureon One',
    description: 'Analyze page speed, identify performance issues, and get optimization recommendations. Free tool to improve Core Web Vitals and SEO.',
    keywords: ['page speed analyzer', 'website speed test', 'core web vitals checker', 'page load time test', 'performance optimization tool'],
  },

  hero: {
    title: 'Page Speed Analyzer',
    subtitle: 'Test and Optimize Website Loading Speed',
    description: 'Analyze page speed, Core Web Vitals, and performance metrics. Get actionable recommendations to improve loading times and user experience.',
    primaryCTA: 'Test Page Speed',
    secondaryCTA: 'Learn Optimization',
  },

  quickAnswer: {
    question: 'What is Page Speed?',
    answer: 'Page speed is how quickly a webpage loads and becomes interactive. It\'s measured in seconds and affects user experience, SEO rankings, and conversions. Google considers page speed a ranking factor, and slow pages (over 3 seconds) see 40% higher bounce rates. Core Web Vitals—LCP, FID, and CLS—are key metrics measuring loading, interactivity, and visual stability.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Use the Page Speed Analyzer', level: 2 },
    { id: 'benefits', title: 'Benefits of Fast Page Speed', level: 2 },
    { id: 'core-web-vitals', title: 'Understanding Core Web Vitals', level: 2 },
    { id: 'optimization', title: 'Speed Optimization Techniques', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related SEO Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Enter URL', text: 'Input the webpage URL you want to analyze for speed performance.' },
    { name: 'Run Analysis', text: 'Get comprehensive speed metrics: load time, Core Web Vitals, performance score.' },
    { name: 'Review Metrics', text: 'Check LCP, FID, CLS, and other performance indicators against benchmarks.' },
    { name: 'Identify Issues', text: 'See specific problems: large images, render-blocking resources, slow server response.' },
    { name: 'Get Recommendations', text: 'Receive prioritized optimization suggestions with implementation guidance.' },
    { name: 'Implement and Retest', text: 'Apply fixes and retest to verify improvements and track progress.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'Why is page speed important for SEO?',
      answer: 'Page speed is a direct Google ranking factor since 2010 (desktop) and 2018 (mobile). Fast pages provide better user experience, leading to lower bounce rates, higher engagement, and more conversions—all positive ranking signals. Google\'s Core Web Vitals (LCP, FID, CLS) became ranking factors in 2021. Slow pages rank lower even with great content. Additionally, page speed affects crawl budget—faster sites get crawled more efficiently. For mobile-first indexing, mobile page speed is especially critical. Studies show 1-second delay reduces conversions by 7% and increases bounce rate by 32%.',
    },
    {
      question: 'What are Core Web Vitals?',
      answer: 'Core Web Vitals are three key metrics measuring user experience: LCP (Largest Contentful Paint) measures loading performance—should occur within 2.5 seconds. FID (First Input Delay) measures interactivity—should be under 100ms. CLS (Cumulative Layout Shift) measures visual stability—should be under 0.1. These metrics became Google ranking factors in 2021. Good Core Web Vitals improve rankings and user experience. Check them in Google Search Console, PageSpeed Insights, or Chrome DevTools. Optimize by improving server response, optimizing images, minimizing JavaScript, and ensuring stable layouts.',
    },
    {
      question: 'What is a good page load time?',
      answer: 'Ideal page load time is under 2 seconds. Google recommends under 3 seconds for mobile. Pages loading in 1-2 seconds have optimal conversion rates. Load times of 3-5 seconds are acceptable but not ideal. Over 5 seconds is slow and significantly hurts user experience and conversions. However, "load time" varies by metric: Time to First Byte (TTFB) should be under 600ms, First Contentful Paint (FCP) under 1.8 seconds, and Largest Contentful Paint (LCP) under 2.5 seconds. Focus on perceived performance—making pages feel fast through progressive loading and skeleton screens.',
    },
    {
      question: 'How do I improve page speed?',
      answer: 'Improve page speed through multiple optimizations: optimize and compress images (use WebP format, lazy loading), minify CSS, JavaScript, and HTML, enable compression (Gzip or Brotli), leverage browser caching, use a Content Delivery Network (CDN), reduce server response time (upgrade hosting, optimize database), eliminate render-blocking resources, defer non-critical JavaScript, reduce redirects, and implement critical CSS inline. Prioritize fixes based on impact—often image optimization and JavaScript reduction provide biggest gains. Use tools like PageSpeed Insights to identify specific issues. Test after each change to measure impact.',
    },
    {
      question: 'What is the difference between mobile and desktop page speed?',
      answer: 'Mobile page speed is typically slower than desktop due to slower network connections (4G vs. broadband), less powerful processors, and smaller screens requiring different layouts. Google uses mobile-first indexing, making mobile speed more important for SEO. Optimize for mobile by using responsive design, optimizing images for mobile screens, minimizing JavaScript execution, implementing AMP (Accelerated Mobile Pages) for content, and testing on real mobile devices and networks. Mobile users are more impatient—53% abandon pages taking over 3 seconds. Prioritize mobile optimization even if most traffic is desktop.',
    },
    {
      question: 'What tools should I use to test page speed?',
      answer: 'Use multiple tools for comprehensive analysis: Google PageSpeed Insights (free, provides Core Web Vitals and optimization suggestions), GTmetrix (free, detailed waterfall charts and recommendations), WebPageTest (free, advanced testing with multiple locations and devices), Chrome DevTools Lighthouse (free, built into Chrome), and Pingdom (freemium, monitoring and alerts). Each tool provides different insights—PageSpeed Insights shows Google\'s view, GTmetrix offers detailed technical analysis, WebPageTest allows custom testing scenarios. Test from multiple locations and devices. Regular monitoring catches performance regressions early.',
    },
    {
      question: 'How does hosting affect page speed?',
      answer: 'Hosting significantly impacts page speed through server response time (TTFB), resource allocation (CPU, RAM, bandwidth), server location relative to users, and server technology (Apache vs. Nginx, PHP version). Shared hosting is slowest due to resource sharing. VPS offers better performance. Dedicated servers provide maximum control. Cloud hosting (AWS, Google Cloud) offers scalability. Managed WordPress hosting optimizes for WordPress specifically. Choose hosting based on traffic, budget, and technical expertise. Upgrade hosting if TTFB consistently exceeds 600ms. Consider CDN to serve content from locations closer to users.',
    },
    {
      question: 'What is lazy loading and should I use it?',
      answer: 'Lazy loading defers loading of non-critical resources (images, videos, iframes) until they\'re needed—typically when users scroll near them. It improves initial page load time, reduces bandwidth usage, and improves Core Web Vitals (especially LCP). Implement lazy loading for images below the fold, videos, iframes, and non-critical scripts. Use native lazy loading (loading="lazy" attribute) for broad browser support. Avoid lazy loading above-the-fold content as it delays visibility. Lazy loading is especially beneficial for image-heavy pages, long-form content, and mobile users. Most modern CMSs and frameworks support lazy loading natively.',
    },
    {
      question: 'How do images affect page speed?',
      answer: 'Images typically account for 50-70% of page weight, making them the biggest page speed factor. Large, unoptimized images slow loading dramatically. Optimize images by compressing without quality loss (use tools like TinyPNG, ImageOptim), using modern formats (WebP is 25-35% smaller than JPEG), implementing responsive images (serve appropriate sizes for different devices), lazy loading below-the-fold images, and using CDN for image delivery. Aim for images under 100KB each. Use appropriate dimensions—don\'t serve 2000px images for 400px display. Image optimization often provides the single biggest page speed improvement.',
    },
    {
      question: 'What is render-blocking JavaScript and how do I fix it?',
      answer: 'Render-blocking JavaScript prevents page rendering until the script loads and executes, delaying visual display. Fix it by deferring non-critical JavaScript (defer attribute), async loading for independent scripts (async attribute), inlining critical JavaScript, moving scripts to page bottom, code splitting to load only necessary code, and removing unused JavaScript. Defer is usually best for most scripts. Async works for analytics and ads. Critical JavaScript (needed for initial render) should be minimal and inline. Analyze with PageSpeed Insights to identify render-blocking scripts. Reducing JavaScript execution time improves FID and overall performance.',
    },
    {
      question: 'How often should I test page speed?',
      answer: 'Test page speed weekly for active sites, monthly for stable sites, and after every significant change (new features, design updates, plugin installations). Set up continuous monitoring with tools like Google Search Console (tracks Core Web Vitals), Pingdom or UptimeRobot (alerts for slowdowns), and real user monitoring (RUM) for actual user experience data. Regular testing catches performance regressions before they impact users and rankings. Test from multiple locations and devices to understand global performance. Page speed can degrade over time as content and features accumulate—regular testing ensures you maintain optimal performance.',
    },
    {
      question: 'Does page speed affect conversions?',
      answer: 'Yes, page speed dramatically affects conversions. Studies show 1-second delay reduces conversions by 7%, 2-second delay reduces conversions by 15%, and pages loading in 5+ seconds see 70% higher bounce rates. Amazon found every 100ms delay costs 1% of sales. Mobile users are especially impatient. Fast pages improve user experience, build trust, reduce frustration, and keep users engaged through checkout. E-commerce sites should prioritize page speed as a conversion optimization strategy. Even small improvements (0.5-1 second) can significantly impact revenue. Page speed optimization often provides better ROI than other conversion tactics.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'SERP Preview',
      description: 'Preview how your page appears in search results',
      url: '/tools/seo/serp-preview-enhanced',
      category: 'SEO',
    },
    {
      name: 'Schema Generator',
      description: 'Generate schema markup for rich results',
      url: '/tools/seo/schema-generator-enhanced',
      category: 'SEO',
    },
    {
      name: 'Image Resizer',
      description: 'Optimize images for faster loading',
      url: '/tools/social/image-resizer-enhanced',
      category: 'Social',
    },
    {
      name: 'Backlink Checker',
      description: 'Analyze your backlink profile',
      url: '/tools/seo/backlink-checker-enhanced',
      category: 'SEO',
    },
  ] as RelatedTool[],
};

