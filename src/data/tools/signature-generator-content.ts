import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const signatureGeneratorContent = {
  metadata: {
    title: 'Email Signature Generator - Create Professional Signatures | Aureon One',
    description: 'Generate professional HTML email signatures with social links, logos, and contact information. Free tool for professionals and businesses.',
    keywords: ['email signature generator', 'HTML email signature', 'professional signature creator', 'email signature template', 'business email signature'],
  },

  hero: {
    title: 'Email Signature Generator',
    subtitle: 'Create Professional HTML Email Signatures',
    description: 'Generate beautiful, responsive email signatures with your contact info, social links, and branding. Works with Gmail, Outlook, and all major email clients.',
    primaryCTA: 'Create Signature',
    secondaryCTA: 'View Templates',
  },

  quickAnswer: {
    question: 'What is an Email Signature?',
    answer: 'An email signature is a block of text, images, and links automatically appended to the end of email messages. Professional signatures include name, title, company, contact information, and social media links. Well-designed signatures reinforce branding, provide contact details, drive traffic to websites, and create professional impressions. HTML signatures allow formatting, images, and clickable links.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Create an Email Signature', level: 2 },
    { id: 'benefits', title: 'Benefits of Professional Signatures', level: 2 },
    { id: 'best-practices', title: 'Email Signature Best Practices', level: 2 },
    { id: 'installation', title: 'Installing Your Signature', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related Email Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Enter Your Information', text: 'Input your name, title, company, phone, email, and website.' },
    { name: 'Add Social Links', text: 'Include links to LinkedIn, Twitter, and other professional social profiles.' },
    { name: 'Upload Logo', text: 'Add your company logo or professional headshot (optional).' },
    { name: 'Choose Design', text: 'Select from professional templates and customize colors and layout.' },
    { name: 'Generate HTML', text: 'Get clean HTML code that works across all email clients.' },
    { name: 'Install Signature', text: 'Copy and paste the signature into your email client settings.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What should I include in my email signature?',
      answer: 'Include essential contact information: full name, job title, company name, phone number, email address, and website URL. Add professional social media links (LinkedIn, Twitter) relevant to your role. Consider including a professional headshot or company logo for visual branding. Optional elements include physical address, call-to-action (schedule a meeting, download resource), legal disclaimers if required, and certifications or credentials. Keep signatures concise—too much information overwhelms recipients. Prioritize information most relevant to your communication goals. Mobile-friendly design is essential as 60%+ of emails are opened on mobile devices.',
    },
    {
      question: 'How long should an email signature be?',
      answer: 'Email signatures should be 3-5 lines of text maximum, excluding logos or images. Ideal dimensions are 300-600 pixels wide and 100-150 pixels tall. Longer signatures push email content down, frustrating recipients and appearing unprofessional. Include only essential information—name, title, company, and 1-2 contact methods. Avoid lengthy quotes, multiple images, or excessive social media icons. Mobile users especially appreciate concise signatures. If you need to include more information, use a "View full profile" link to your website or LinkedIn. Remember: signatures should complement your message, not overshadow it.',
    },
    {
      question: 'Should I use images in my email signature?',
      answer: 'Use images sparingly and strategically. A small company logo (100-150px wide) or professional headshot adds visual branding without overwhelming the signature. However, many email clients block images by default, so ensure your signature works without images by including alt text and using HTML text for critical information. Avoid large images that slow email loading or push content down. Use optimized image formats (PNG for logos, JPG for photos) and keep file sizes under 50KB. Never use images for text—use HTML text for accessibility and reliability. Test image display across email clients before deploying.',
    },
    {
      question: 'How do I install an email signature in Gmail?',
      answer: 'Install Gmail signatures by opening Gmail settings (gear icon > See all settings), scrolling to the "Signature" section, clicking "Create new" to add a signature, pasting your HTML signature code (Gmail supports basic HTML), formatting as needed using Gmail\'s editor, choosing whether to use the signature for new emails and/or replies, and clicking "Save Changes" at the bottom. For G Suite/Google Workspace, administrators can create organization-wide signatures. Test by sending yourself an email. Note: Gmail may strip some HTML/CSS, so keep formatting simple. Use Gmail\'s built-in formatting tools for best compatibility.',
    },
    {
      question: 'How do I install an email signature in Outlook?',
      answer: 'Install Outlook signatures by opening Outlook and going to File > Options > Mail > Signatures (desktop) or Settings > View all Outlook settings > Compose and reply > Email signature (web), clicking "New" to create a signature, pasting your HTML code or using Outlook\'s editor to format, choosing which email account to associate the signature with, selecting whether to include signature in new messages and/or replies/forwards, and clicking "OK" or "Save". For Outlook desktop, signatures are stored locally. For Office 365, use web version for cloud-based signatures. Test across devices to ensure consistency.',
    },
    {
      question: 'Can I have different signatures for different purposes?',
      answer: 'Yes, creating multiple signatures for different contexts is recommended: a full signature for external communications with complete contact info and branding, a minimal signature for internal emails with just name and title, a mobile signature that\'s shorter for on-the-go emails, and campaign-specific signatures with relevant CTAs or promotions. Most email clients allow multiple signatures. Choose the appropriate signature based on recipient and context. Some email clients let you set default signatures for new emails versus replies. Multiple signatures provide flexibility while maintaining professionalism across different communication scenarios.',
    },
    {
      question: 'Should I include social media icons in my signature?',
      answer: 'Include 2-4 professional social media icons relevant to your role and industry. LinkedIn is essential for B2B professionals. Twitter works for thought leaders and media professionals. Instagram suits creative industries. Avoid personal social networks (Facebook, TikTok) in professional signatures unless directly relevant to your role. Use small, consistent icon sizes (20-30px). Ensure icons link to your professional profiles, not company pages. Too many icons clutter signatures and dilute focus. Prioritize quality over quantity—include only networks where you\'re active and professional. Test icon display across email clients.',
    },
    {
      question: 'What are email signature legal requirements?',
      answer: 'Legal requirements vary by jurisdiction and industry. Common requirements include: company registration details (required in UK, EU for business emails), VAT numbers (EU businesses), professional licensing information (lawyers, accountants, real estate agents), confidentiality disclaimers (legal, healthcare, finance), and unsubscribe links (marketing emails under CAN-SPAM, GDPR). Consult legal counsel for your specific requirements. Even without legal requirements, disclaimers can protect against liability. However, keep legal text concise and consider linking to full terms rather than including lengthy disclaimers that overwhelm signatures. Balance compliance with usability.',
    },
    {
      question: 'How do I make my email signature mobile-friendly?',
      answer: 'Create mobile-friendly signatures by keeping them short (3-4 lines maximum), using readable font sizes (14px+ for body text), ensuring clickable elements are large enough for touch (44x44px minimum), using single-column layouts that don\'t require horizontal scrolling, optimizing images for small screens (under 50KB), and testing on actual mobile devices. Avoid complex multi-column layouts that break on mobile. Use responsive HTML/CSS when possible. Consider creating a separate, simplified mobile signature. Remember that 60-70% of emails are opened on mobile, making mobile optimization essential for professional communication.',
    },
    {
      question: 'Can I track clicks in my email signature?',
      answer: 'Yes, track signature clicks using UTM parameters on links (website, social media) to monitor traffic in Google Analytics, link shorteners with analytics (Bitly, Rebrandly) for click tracking, email signature management platforms (WiseStamp, Exclaimer) with built-in analytics, and CRM integration to track signature-driven conversions. Tracking reveals which signature elements drive engagement, helps measure signature ROI, and informs optimization decisions. However, avoid excessive tracking that makes links look suspicious or spammy. Focus on tracking key links like website and primary CTA. Review analytics quarterly to optimize signature performance.',
    },
    {
      question: 'What are common email signature mistakes?',
      answer: 'Common mistakes include making signatures too long (6+ lines), using too many images or large file sizes, including irrelevant information (personal quotes, multiple addresses), using unprofessional fonts or colors, forgetting to update outdated information (old job titles, phone numbers), including broken links, using all caps or excessive formatting, adding animated GIFs (unprofessional in most contexts), and not testing across email clients. Avoid these by keeping signatures concise and professional, using web-safe fonts, regularly auditing and updating information, testing across clients, and prioritizing clarity over creativity. Professional signatures enhance credibility; poor signatures undermine it.',
    },
    {
      question: 'Should I use HTML or plain text signatures?',
      answer: 'Use HTML signatures for professional communications as they allow formatting, images, clickable links, and branding. However, always have a plain text fallback for email clients that do not support HTML or when recipients prefer plain text. Most modern email clients support HTML signatures. Plain text signatures are appropriate for highly technical audiences, security-conscious industries, or when replying to plain text emails. Create both versions—email clients automatically use the appropriate format. HTML signatures provide better branding and functionality, but ensure they degrade gracefully to plain text when needed.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'Email Preview',
      description: 'Preview emails across different clients',
      url: '/tools/email/email-preview-enhanced',
      category: 'Email',
    },
    {
      name: 'Email Subject Tester',
      description: 'Test and optimize email subject lines',
      url: '/tools/content/email-subject-tester-enhanced',
      category: 'Content',
    },
    {
      name: 'UTM Builder',
      description: 'Create trackable campaign URLs',
      url: '/tools/social/utm-builder-enhanced',
      category: 'Social',
    },
    {
      name: 'Image Resizer',
      description: 'Optimize images for email signatures',
      url: '/tools/social/image-resizer-enhanced',
      category: 'Social',
    },
  ] as RelatedTool[],
};

