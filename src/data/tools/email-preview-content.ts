import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const emailPreviewContent = {
  metadata: {
    title: 'Email Preview Tool - Test Emails Across Clients | Aureon One',
    description: 'Preview emails across different email clients and devices before sending. Free tool for email marketers and designers.',
    keywords: ['email preview tool', 'email rendering test', 'email client preview', 'responsive email tester', 'email compatibility checker'],
  },

  hero: {
    title: 'Email Preview Tool',
    subtitle: 'Test Emails Across All Clients and Devices',
    description: 'Preview how your emails render in Gmail, Outlook, Apple Mail, and mobile devices. Ensure perfect display before sending campaigns.',
    primaryCTA: 'Preview Email',
    secondaryCTA: 'Learn More',
  },

  quickAnswer: {
    question: 'What is an Email Preview Tool?',
    answer: 'An email preview tool shows how your email campaigns render across different email clients (Gmail, Outlook, Apple Mail) and devices (desktop, mobile, tablet). It identifies rendering issues, broken layouts, and display problems before sending, ensuring consistent appearance for all recipients. This testing prevents deliverability issues and improves campaign effectiveness.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Use the Email Preview Tool', level: 2 },
    { id: 'benefits', title: 'Benefits & Use Cases', level: 2 },
    { id: 'email-clients', title: 'Email Client Differences', level: 2 },
    { id: 'best-practices', title: 'Email Design Best Practices', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related Email Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Upload Email HTML', text: 'Paste your email HTML code or upload your email template file.' },
    { name: 'Select Clients', text: 'Choose email clients and devices to test (Gmail, Outlook, Apple Mail, mobile).' },
    { name: 'Generate Previews', text: 'Get instant previews showing how your email renders in each client.' },
    { name: 'Identify Issues', text: 'Review rendering differences, broken layouts, or display problems.' },
    { name: 'Fix and Retest', text: 'Make necessary adjustments and retest until email displays correctly everywhere.' },
    { name: 'Send with Confidence', text: 'Launch your campaign knowing it will display properly for all recipients.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'Why do emails look different in different email clients?',
      answer: 'Emails render differently because each email client (Gmail, Outlook, Apple Mail) uses different rendering engines with varying CSS and HTML support. Outlook uses Microsoft Word\'s rendering engine, which has limited CSS support. Gmail strips certain CSS properties for security. Apple Mail has excellent CSS support but unique quirks. Mobile clients have different screen sizes and touch interfaces. These differences mean a perfectly designed email in one client may break in another. Email preview tools identify these inconsistencies before sending, allowing designers to create emails that work across all clients.',
    },
    {
      question: 'What email clients should I test?',
      answer: 'Test the most popular email clients your audience uses: Gmail (desktop and mobile) - 35-40% market share, Apple Mail (iPhone, iPad, Mac) - 30-35%, Outlook (2013, 2016, 2019, 365) - 10-15%, Yahoo Mail - 5-10%, and mobile clients (iOS Mail, Android) - 60%+ of opens. Check your email analytics to identify which clients your subscribers use most. Prioritize testing on those clients. At minimum, test on Gmail, Outlook, and one mobile client. Comprehensive testing includes 10-15 different client/device combinations for maximum compatibility.',
    },
    {
      question: 'How do I create mobile-responsive emails?',
      answer: 'Create responsive emails using mobile-first design approach, single-column layouts that stack on mobile, fluid width tables (max-width: 600px), large touch-friendly buttons (44x44px minimum), readable font sizes (14px+ for body, 22px+ for headings), and media queries for responsive behavior. Test on actual mobile devices, not just desktop previews. Use responsive email templates from reputable sources. Avoid complex multi-column layouts that break on small screens. Ensure images scale properly and CTAs are easily tappable. 60-70% of emails are opened on mobile, making responsive design essential.',
    },
    {
      question: 'What are common email rendering issues?',
      answer: 'Common rendering issues include broken layouts in Outlook due to limited CSS support, images not displaying (blocked by default in many clients), fonts reverting to defaults when custom fonts aren\'t supported, buttons appearing as links instead of styled buttons, spacing and padding inconsistencies, background images not showing in Outlook, and mobile layouts not stacking properly. Dark mode causing color contrast issues is increasingly common. Prevent these by using table-based layouts, inline CSS, web-safe fonts, bulletproof buttons, and thorough testing across clients before sending.',
    },
    {
      question: 'Should I use images or HTML for email design?',
      answer: 'Use a combination of both for optimal results. HTML text ensures content displays even when images are blocked, improves accessibility for screen readers, allows text selection and copying, and loads faster than image-heavy emails. Images add visual appeal, showcase products, and reinforce branding. Best practice: use HTML for critical content (headlines, body copy, CTAs) and images for visual enhancement (product photos, graphics, logos). Always include alt text for images. Aim for 60% text, 40% images ratio. Never create emails that are entirely images—they often land in spam and provide poor user experience.',
    },
    {
      question: 'How do I handle dark mode in emails?',
      answer: 'Handle dark mode by using transparent PNGs for logos and graphics, avoiding pure white (#FFFFFF) or pure black (#000000) backgrounds, testing emails in dark mode across clients, using CSS media queries to detect dark mode, providing dark mode-specific styles when possible, and ensuring sufficient color contrast in both modes. Some clients automatically invert colors in dark mode, which can break designs. Use mid-tone colors that work in both light and dark modes. Test extensively as dark mode implementation varies by client. Consider providing dark mode-optimized versions for better user experience.',
    },
    {
      question: 'What is email client market share?',
      answer: 'Email client market share varies by audience but generally: Apple iPhone (30-35%), Gmail (25-30%), Apple Mail desktop (10-15%), Outlook (10-15%), Apple iPad (5-10%), and others (10-15%). Mobile clients (iPhone, Android, iPad) account for 60-70% of total email opens. B2B audiences use Outlook more heavily (20-30%), while B2C skews toward Gmail and Apple Mail. Check your specific email analytics for accurate data. Market share shifts over time and varies by industry, geography, and audience demographics. Test on clients your audience actually uses.',
    },
    {
      question: 'How do I test emails without sending them?',
      answer: 'Test emails using email preview tools that render emails across multiple clients without sending, sending test emails to seed lists with various email addresses, using email testing services like Litmus or Email on Acid, creating test accounts on major email clients, and using browser developer tools to inspect HTML/CSS. Send tests to yourself on different devices and clients. Use spam testing tools to check deliverability. Preview tools save time by showing multiple client renderings simultaneously. Always test before sending to your full list—catching issues in testing prevents embarrassing mistakes and poor campaign performance.',
    },
    {
      question: 'What are web-safe fonts for emails?',
      answer: 'Web-safe fonts reliably display across all email clients: Arial, Helvetica, Georgia, Times New Roman, Courier, Verdana, and Tahoma. These fonts are pre-installed on most devices and email clients. Custom web fonts (Google Fonts, etc.) have limited support—they work in Apple Mail and some other clients but fall back to defaults in Outlook and Gmail. If using custom fonts, always specify fallback fonts: font-family: "Custom Font", Arial, sans-serif. For maximum compatibility, stick with web-safe fonts or use images for custom typography in headers. Test custom fonts across clients before using in campaigns.',
    },
    {
      question: 'How do I create bulletproof buttons in emails?',
      answer: 'Create bulletproof buttons using table-based button code that works across all clients, including Outlook. Use background colors with padding instead of CSS buttons, include border-radius for rounded corners (degrades gracefully in Outlook), ensure minimum touch target size (44x44px for mobile), use contrasting colors for visibility, and include descriptive link text. Avoid using <button> tags or CSS-only buttons that break in Outlook. Use VML (Vector Markup Language) for Outlook-specific button rendering. Test buttons across clients to ensure they\'re clickable and visually consistent. Bulletproof button generators can help create cross-client compatible code.',
    },
    {
      question: 'What is the ideal email width?',
      answer: 'The ideal email width is 600-650 pixels for desktop display. This width displays properly in most email clients without horizontal scrolling and fits comfortably in preview panes. Use max-width: 600px with width: 100% for responsive behavior on mobile. Narrower emails (500-550px) work well for text-heavy content. Wider emails (700px+) may require horizontal scrolling in some clients. Mobile emails should be single-column and fluid-width to adapt to screen sizes. Test your specific design across clients—some audiences may prefer different widths based on typical viewing environment.',
    },
    {
      question: 'How do I ensure emails are accessible?',
      answer: 'Ensure email accessibility by using semantic HTML with proper heading hierarchy, including descriptive alt text for all images, maintaining sufficient color contrast (4.5:1 minimum for text), using readable font sizes (14px+ for body text), creating logical reading order for screen readers, avoiding relying solely on color to convey information, and including text versions of important content. Test with screen readers like NVDA or JAWS. Use role="presentation" on layout tables. Ensure emails are keyboard-navigable. Accessible emails reach wider audiences and often have better deliverability. Follow WCAG 2.1 AA guidelines for email accessibility.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'Email Subject Tester',
      description: 'Test and optimize email subject lines',
      url: '/tools/content/email-subject-tester-enhanced',
      category: 'Content',
    },
    {
      name: 'Spam Score Checker',
      description: 'Check email content for spam triggers',
      url: '/tools/email/spam-score-checker-enhanced',
      category: 'Email',
    },
    {
      name: 'Email Signature Generator',
      description: 'Create professional HTML email signatures',
      url: '/tools/email/signature-generator-enhanced',
      category: 'Email',
    },
    {
      name: 'List Segmentation Calculator',
      description: 'Calculate optimal email list segments',
      url: '/tools/email/list-segmentation-calculator-enhanced',
      category: 'Email',
    },
  ] as RelatedTool[],
};

