import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    name: 'Healthcare Marketing Strategy',
    slug: 'healthcare',
    industry: 'Healthcare',
    description: 'Comprehensive marketing strategy for healthcare providers, clinics, and medical practices',
    icon: '🏥',
    objectives: JSON.stringify([
      'Increase patient acquisition by 30%',
      'Build trust and credibility in the community',
      'Improve patient retention and loyalty',
      'Enhance online reputation and reviews',
      'Educate patients about services and treatments'
    ]),
    audience: JSON.stringify({
      primary: 'Adults 35-65 seeking quality healthcare',
      secondary: 'Families with children, seniors',
      demographics: 'Middle to upper-middle income, health-conscious',
      psychographics: 'Value quality care, convenience, and trust',
      painPoints: 'Finding reliable healthcare providers, long wait times, lack of information'
    }),
    channels: JSON.stringify([
      { name: 'Google My Business', priority: 'High', budget: 15 },
      { name: 'Healthcare SEO', priority: 'High', budget: 20 },
      { name: 'Patient Reviews Management', priority: 'High', budget: 10 },
      { name: 'Facebook & Instagram Ads', priority: 'Medium', budget: 25 },
      { name: 'Email Marketing', priority: 'Medium', budget: 10 },
      { name: 'Content Marketing (Blog)', priority: 'Medium', budget: 15 },
      { name: 'Community Events', priority: 'Low', budget: 5 }
    ]),
    budget: JSON.stringify({
      total: 10000,
      breakdown: {
        digital: 70,
        traditional: 10,
        content: 15,
        events: 5
      }
    }),
    kpis: JSON.stringify([
      { metric: 'New Patient Appointments', target: '+30% MoM', category: 'Acquisition' },
      { metric: 'Website Traffic', target: '+50% MoM', category: 'Awareness' },
      { metric: 'Online Reviews', target: '4.5+ stars, 50+ reviews', category: 'Reputation' },
      { metric: 'Patient Retention Rate', target: '85%+', category: 'Retention' },
      { metric: 'Cost Per Acquisition', target: '<$150', category: 'Efficiency' }
    ]),
    isPro: true,
    isActive: true
  },
  {
    name: 'E-commerce Marketing Strategy',
    slug: 'ecommerce',
    industry: 'E-commerce',
    description: 'Data-driven marketing strategy for online stores and e-commerce businesses',
    icon: '🛒',
    objectives: JSON.stringify([
      'Increase online sales by 40%',
      'Reduce cart abandonment rate by 25%',
      'Improve customer lifetime value',
      'Build brand awareness and loyalty',
      'Optimize conversion rate across all channels'
    ]),
    audience: JSON.stringify({
      primary: 'Online shoppers aged 25-45',
      secondary: 'Mobile-first shoppers, deal seekers',
      demographics: 'Middle income, tech-savvy, urban/suburban',
      psychographics: 'Convenience-focused, value quality and reviews',
      painPoints: 'Shipping costs, product quality concerns, return hassles'
    }),
    channels: JSON.stringify([
      { name: 'Google Shopping Ads', priority: 'High', budget: 30 },
      { name: 'Facebook & Instagram Ads', priority: 'High', budget: 25 },
      { name: 'Email Marketing & Automation', priority: 'High', budget: 15 },
      { name: 'SEO & Content Marketing', priority: 'Medium', budget: 15 },
      { name: 'Influencer Partnerships', priority: 'Medium', budget: 10 },
      { name: 'Retargeting Campaigns', priority: 'High', budget: 5 }
    ]),
    budget: JSON.stringify({
      total: 15000,
      breakdown: {
        paidAds: 60,
        email: 15,
        content: 15,
        influencer: 10
      }
    }),
    kpis: JSON.stringify([
      { metric: 'Revenue', target: '+40% MoM', category: 'Sales' },
      { metric: 'Conversion Rate', target: '3.5%+', category: 'Conversion' },
      { metric: 'Average Order Value', target: '+15%', category: 'Revenue' },
      { metric: 'Cart Abandonment Rate', target: '<65%', category: 'Conversion' },
      { metric: 'Return on Ad Spend (ROAS)', target: '4:1+', category: 'Efficiency' }
    ]),
    isPro: true,
    isActive: true
  },
  {
    name: 'SaaS Marketing Strategy',
    slug: 'saas',
    industry: 'SaaS',
    description: 'Growth-focused marketing strategy for SaaS and software companies',
    icon: '💻',
    objectives: JSON.stringify([
      'Acquire 500+ qualified leads per month',
      'Achieve 20% trial-to-paid conversion rate',
      'Reduce customer acquisition cost (CAC)',
      'Increase product-led growth',
      'Build thought leadership in the industry'
    ]),
    audience: JSON.stringify({
      primary: 'B2B decision-makers, CTOs, Product Managers',
      secondary: 'Small business owners, startup founders',
      demographics: 'Tech-savvy professionals, 30-50 years old',
      psychographics: 'Efficiency-focused, data-driven, innovation-seeking',
      painPoints: 'Complex workflows, lack of integration, poor support'
    }),
    channels: JSON.stringify([
      { name: 'Content Marketing & SEO', priority: 'High', budget: 25 },
      { name: 'LinkedIn Ads', priority: 'High', budget: 20 },
      { name: 'Product-Led Growth', priority: 'High', budget: 15 },
      { name: 'Email Nurture Campaigns', priority: 'High', budget: 15 },
      { name: 'Webinars & Events', priority: 'Medium', budget: 15 },
      { name: 'Affiliate/Partner Program', priority: 'Medium', budget: 10 }
    ]),
    budget: JSON.stringify({
      total: 20000,
      breakdown: {
        content: 25,
        paidAds: 35,
        productLed: 15,
        events: 15,
        partnerships: 10
      }
    }),
    kpis: JSON.stringify([
      { metric: 'Monthly Recurring Revenue (MRR)', target: '+25% MoM', category: 'Revenue' },
      { metric: 'Trial Sign-ups', target: '500+/month', category: 'Acquisition' },
      { metric: 'Trial-to-Paid Conversion', target: '20%+', category: 'Conversion' },
      { metric: 'Customer Acquisition Cost (CAC)', target: '<$500', category: 'Efficiency' },
      { metric: 'Churn Rate', target: '<5%', category: 'Retention' }
    ]),
    isPro: true,
    isActive: true
  },
  {
    name: 'Real Estate Marketing Strategy',
    slug: 'real-estate',
    industry: 'Real Estate',
    description: 'Local-focused marketing strategy for real estate agents and agencies',
    icon: '🏡',
    objectives: JSON.stringify([
      'Generate 50+ qualified leads per month',
      'Increase property listing visibility',
      'Build local market authority',
      'Improve client referral rate',
      'Showcase sold properties and testimonials'
    ]),
    audience: JSON.stringify({
      primary: 'Home buyers and sellers aged 30-55',
      secondary: 'First-time buyers, investors, relocating families',
      demographics: 'Middle to upper income, local area residents',
      psychographics: 'Value trust, local expertise, and responsiveness',
      painPoints: 'Finding the right property, navigating the buying process, pricing concerns'
    }),
    channels: JSON.stringify([
      { name: 'Facebook & Instagram Ads', priority: 'High', budget: 30 },
      { name: 'Google Local Ads', priority: 'High', budget: 20 },
      { name: 'Real Estate Portals (Zillow, etc.)', priority: 'High', budget: 20 },
      { name: 'Email Marketing', priority: 'Medium', budget: 10 },
      { name: 'Video Marketing (YouTube)', priority: 'Medium', budget: 15 },
      { name: 'Direct Mail', priority: 'Low', budget: 5 }
    ]),
    budget: JSON.stringify({
      total: 8000,
      breakdown: {
        digital: 75,
        portals: 20,
        traditional: 5
      }
    }),
    kpis: JSON.stringify([
      { metric: 'Qualified Leads', target: '50+/month', category: 'Acquisition' },
      { metric: 'Listing Views', target: '+100% MoM', category: 'Awareness' },
      { metric: 'Lead-to-Client Conversion', target: '15%+', category: 'Conversion' },
      { metric: 'Cost Per Lead', target: '<$50', category: 'Efficiency' },
      { metric: 'Referral Rate', target: '30%+', category: 'Retention' }
    ]),
    isPro: true,
    isActive: true
  },
  {
    name: 'Education Marketing Strategy',
    slug: 'education',
    industry: 'Education',
    description: 'Enrollment-focused marketing strategy for schools, colleges, and online courses',
    icon: '🎓',
    objectives: JSON.stringify([
      'Increase student enrollment by 25%',
      'Build brand awareness in target markets',
      'Improve student engagement and retention',
      'Showcase success stories and outcomes',
      'Expand reach to international students'
    ]),
    audience: JSON.stringify({
      primary: 'Students aged 18-25, parents of school-age children',
      secondary: 'Working professionals seeking upskilling',
      demographics: 'Diverse income levels, education-focused families',
      psychographics: 'Value quality education, career outcomes, affordability',
      painPoints: 'Cost of education, program quality, career prospects'
    }),
    channels: JSON.stringify([
      { name: 'Google Search Ads', priority: 'High', budget: 25 },
      { name: 'Facebook & Instagram Ads', priority: 'High', budget: 20 },
      { name: 'Content Marketing & SEO', priority: 'High', budget: 20 },
      { name: 'Email Marketing', priority: 'Medium', budget: 15 },
      { name: 'Virtual Events & Webinars', priority: 'Medium', budget: 15 },
      { name: 'Student Referral Program', priority: 'Low', budget: 5 }
    ]),
    budget: JSON.stringify({
      total: 12000,
      breakdown: {
        paidAds: 45,
        content: 20,
        email: 15,
        events: 15,
        referrals: 5
      }
    }),
    kpis: JSON.stringify([
      { metric: 'Enrollment Applications', target: '+25% YoY', category: 'Acquisition' },
      { metric: 'Website Traffic', target: '+60% MoM', category: 'Awareness' },
      { metric: 'Application-to-Enrollment Rate', target: '40%+', category: 'Conversion' },
      { metric: 'Cost Per Enrollment', target: '<$300', category: 'Efficiency' },
      { metric: 'Student Retention Rate', target: '90%+', category: 'Retention' }
    ]),
    isPro: true,
    isActive: true
  }
];

async function main() {
  console.log('🌱 Seeding strategy templates...');

  for (const template of templates) {
    await prisma.strategyTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
    console.log(`✅ Created/Updated template: ${template.name}`);
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding templates:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

