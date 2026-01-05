// Script to populate framework products with full CMS content
// Run with: npx tsx scripts/populate-framework-content.ts

import { prisma } from '../src/lib/prisma';

const frameworkContent = {
    'ai-media-planning-framework': {
        shortDescription: 'Stop guessing, start planning with AI precision.',
        longDescription: `This framework gives you a systematic approach to AI-powered media planning that actually works.

Instead of spending weeks on manual research and guesswork, you'll have a proven system that delivers results in days.

Built from real-world experience managing millions in ad spend across diverse industries.`,
        problemStatement: `You're stuck in the old way of media planning.

Spreadsheets everywhere. Manual data pulls. Guessing at audience sizes. Hoping your budget allocation is right.

Meanwhile, your competitors are using AI tools you don't understand, and you're falling behind.

The truth? Most media planners are still working like it's 2015. And it shows in their results.`,
        outcomes: `Go from scattered planning to AI-powered precision in 48 hours.`,
        idealFor: `Media planners managing ₹50L+ annual budgets
Marketing managers responsible for paid media
Agency strategists handling multiple client accounts
Brand managers who need to justify every rupee spent`,
        notIdealFor: `Beginners just learning digital marketing
Students looking for theoretical frameworks
Anyone expecting fully automated "set and forget" solutions
Marketers with budgets under ₹5L/year`,
        deliverables: `AI Media Planning Framework (PDF, 40+ pages)
Audience Research Template (Excel)
Budget Allocation Calculator (Excel)
Platform Selection Matrix (PDF)
Campaign Brief Generator (Notion)
90-Day Implementation Roadmap`,
        howToUse: `Download and read the framework guide in one sitting
Complete the Audience Research Template for your next campaign
Use the Budget Calculator to optimize your spend allocation
Apply the Platform Matrix to select the right channels`,
        credibilityText: `This framework was developed over 8 years of managing ₹50Cr+ in media spend.

Used by 200+ brands across e-commerce, fintech, and SaaS.

Built by someone who's been in the trenches, not just reading about it.`,
        seoTitle: 'AI Media Planning Framework | Strategic Media Planning System',
        seoDescription: 'Stop guessing at media plans. Get a proven AI-powered framework for strategic media planning that delivers results. Used by 200+ brands.',
    },
    'revenue-forecast-toolkit': {
        shortDescription: 'Forecast revenue with confidence, not hope.',
        longDescription: `Finally, a revenue forecasting system that marketing leaders can actually use.

This toolkit gives you the models, templates, and frameworks to predict revenue outcomes with surprising accuracy.

No more "we'll know in 3 months" — know now.`,
        problemStatement: `Your revenue forecasts are embarrassing.

Leadership asks for projections. You pull together a spreadsheet. Three months later, you're off by 40%.

The problem isn't your data. It's your methodology.

Without a proper forecasting system, you're just making educated guesses. And those guesses cost real money.`,
        outcomes: `Build revenue forecasts with 85%+ accuracy within 2 weeks.`,
        idealFor: `Marketing directors reporting to C-suite
Revenue operations managers
Growth leaders at funded startups
Agency principals managing client expectations`,
        notIdealFor: `Early-stage startups with less than 6 months of data
Marketing interns or junior analysts
Anyone looking for a "magic prediction" tool
Businesses without historical revenue data`,
        deliverables: `Revenue Forecasting Framework (PDF, 35 pages)
Multi-Channel Attribution Model (Excel)
Cohort Analysis Template (Excel)
Quarterly Forecast Dashboard (Google Sheets)
Scenario Planning Calculator
Presentation Template for Leadership`,
        howToUse: `Import your historical data into the Attribution Model
Run the Cohort Analysis for the last 12 months
Input results into the Forecast Dashboard
Use Scenario Planning for best/worst case projections`,
        credibilityText: `Developed while leading growth at 3 venture-backed startups.

Refined through 100+ board presentations where accuracy matters.

The same methodology used by growth teams at companies scaling to ₹100Cr ARR.`,
        seoTitle: 'Revenue Forecast Toolkit | Marketing Revenue Prediction System',
        seoDescription: 'Stop guessing at revenue. Get the forecasting toolkit used by marketing leaders to predict outcomes with 85%+ accuracy.',
    },
    'marketing-os-bundle': {
        shortDescription: 'Everything you need to run marketing like an operator.',
        longDescription: `This bundle combines our complete suite of frameworks into one comprehensive marketing operating system.

You get the AI Media Planning Framework, Revenue Forecast Toolkit, and exclusive systems not available separately.

For marketing leaders who want the complete picture, not just pieces.`,
        problemStatement: `You're running marketing with disconnected tools and frameworks.

One system for planning. Another for tracking. A third for reporting. None of them talk to each other.

The result? You spend more time managing tools than managing marketing.

What you need is an integrated operating system. One source of truth. One way of working.`,
        outcomes: `Transform your marketing from chaos to clarity in 30 days.`,
        idealFor: `Marketing directors building their first proper system
Agency owners systematizing their operations
CMOs standardizing across teams
Startup founders wearing the marketing hat`,
        notIdealFor: `Individual contributors without team responsibility
Marketers happy with their current systems
Anyone looking for just one specific framework
Teams not ready for operational change`,
        deliverables: `AI Media Planning Framework (Complete)
Revenue Forecast Toolkit (Complete)
Marketing Operations Playbook (PDF, 60 pages)
Team Workflow Templates (Notion)
Quarterly Planning System (Excel + Notion)
Performance Dashboard Template
Priority Access to Future Frameworks`,
        howToUse: `Start with the Operations Playbook to understand the system
Implement the Media Planning Framework for your next campaign
Set up the Revenue Forecast for monthly tracking
Roll out team workflows to your full marketing org`,
        credibilityText: `The culmination of 10 years building marketing systems.

Used to scale marketing teams from 2 to 20+ people.

The same operating system that's run campaigns for Fortune 500 brands.`,
        seoTitle: 'Complete Marketing OS Bundle | Full Marketing System',
        seoDescription: 'Get the complete marketing operating system. Frameworks, templates, and systems used by top marketing teams. Everything you need in one bundle.',
    },
};

async function populateContent() {
    console.log('🚀 Populating framework content...\n');

    for (const [slug, content] of Object.entries(frameworkContent)) {
        try {
            const updated = await prisma.product.update({
                where: { slug },
                data: {
                    shortDescription: content.shortDescription,
                    longDescription: content.longDescription,
                    problemStatement: content.problemStatement,
                    outcomes: content.outcomes,
                    idealFor: content.idealFor,
                    notIdealFor: content.notIdealFor,
                    deliverables: content.deliverables,
                    howToUse: content.howToUse,
                    credibilityText: content.credibilityText,
                    seoTitle: content.seoTitle,
                    seoDescription: content.seoDescription,
                    status: 'published',
                },
            });
            console.log(`✅ Updated: ${updated.name}`);
        } catch (error: any) {
            console.error(`❌ Failed to update ${slug}:`, error.message);
        }
    }

    console.log('\n✅ Content population complete!');
    await prisma.$disconnect();
}

populateContent();
