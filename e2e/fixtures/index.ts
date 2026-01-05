/**
 * Test Fixtures for MediaPlanPro E2E Tests
 * 
 * Provides common fixtures and mock data for tests
 */

// Mock strategy input data
export const mockStrategyInput = {
    businessName: 'Acme Marketing Co',
    industry: 'SaaS',
    targetAudience: 'B2B marketing managers at mid-size companies',
    monthlyBudget: '10000',
    currency: 'USD',
    goals: ['Lead Generation', 'Brand Awareness'],
    competitors: ['Competitor A', 'Competitor B'],
    timeline: '6 months',
};

// Mock domain for SEO analysis
export const mockDomain = {
    url: 'example.com',
    expectedMetrics: {
        trafficEstimate: true,
        authorityScore: true,
        topPages: true,
        keywords: true,
    },
};

// Mock ad campaign data
export const mockCampaignData = {
    campaigns: [
        {
            id: 'camp_1',
            name: 'Summer Sale 2024',
            platform: 'Meta',
            status: 'active',
            spend: 2500,
            impressions: 150000,
            clicks: 4500,
            ctr: 3.0,
            conversions: 120,
            roas: 3.5,
        },
        {
            id: 'camp_2',
            name: 'Brand Awareness Q4',
            platform: 'Google',
            status: 'active',
            spend: 3200,
            impressions: 280000,
            clicks: 5600,
            ctr: 2.0,
            conversions: 85,
            roas: 2.8,
        },
    ],
};

// Mock client data for Agency OS
export const mockClient = {
    name: 'Test Client Inc',
    email: 'client@testclient.com',
    phone: '+1-555-0123',
    company: 'Test Client Inc',
    industry: 'Technology',
};

// Mock project data
export const mockProject = {
    title: 'Q1 Marketing Campaign',
    description: 'Comprehensive marketing campaign for Q1',
    budget: 15000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

// Mock task data
export const mockTasks = [
    {
        title: 'Create campaign brief',
        description: 'Write the initial campaign brief document',
        status: 'todo',
    },
    {
        title: 'Design creative assets',
        description: 'Create visual assets for the campaign',
        status: 'todo',
    },
];

// Mock admin analytics data
export const mockAdminAnalytics = {
    totalMRR: 25000,
    totalARR: 280000,
    activeSubscriptions: 150,
    arpu: 167,
    churnRate: 2.5,
    products: {
        AGENCY_OS: { subscribers: 40, revenue: 6000 },
        OPTIMISER: { subscribers: 35, revenue: 7500 },
        ANALYSER: { subscribers: 45, revenue: 6500 },
        STRATEGISER: { subscribers: 30, revenue: 5000 },
    },
};

// Mock Razorpay checkout response
export const mockRazorpayCheckout = {
    success: {
        razorpay_payment_id: 'pay_test123',
        razorpay_subscription_id: 'sub_test123',
        razorpay_signature: 'signature_test123',
    },
    failure: {
        error: {
            code: 'BAD_REQUEST_ERROR',
            description: 'Payment failed',
        },
    },
};

// API endpoints for mocking
export const API_ENDPOINTS = {
    // Checkout
    checkout: '/api/checkout/product',
    subscriptions: '/api/subscriptions/manage',

    // Admin
    adminAnalytics: '/api/admin/analytics',
    adminUsers: '/api/admin/users',

    // Products
    strategy: '/api/strategy/generate',
    analyser: '/api/analyser/analyze',
    optimizer: '/api/optimizer/campaigns',
    agency: '/api/agency/clients',

    // Tracking
    tracking: '/api/tracking/*',
};

// Common selectors
export const SELECTORS = {
    // Navigation
    signInButton: 'button:has-text("Sign In"), a:has-text("Sign In")',
    signUpButton: 'button:has-text("Sign Up"), a:has-text("Get Started")',
    signOutButton: 'button:has-text("Sign Out")',

    // Product nav
    productsDropdown: 'button:has-text("Products")',
    agencyOsLink: 'a:has-text("Agency OS")',
    optimiserLink: 'a:has-text("Optimiser"), a:has-text("The Optimiser")',
    analyserLink: 'a:has-text("Analyser"), a:has-text("The Analyser")',
    strategiserLink: 'a:has-text("Strategiser"), a:has-text("The Strategiser")',

    // Pricing
    pricingTab: '[role="tab"]',
    subscribeButton: 'button:has-text("Subscribe"), button:has-text("Start")',

    // Admin
    adminSidebar: '[data-testid="admin-sidebar"]',
    analyticsCards: '[data-testid="kpi-card"]',
    usersTable: '[data-testid="users-table"]',
};
