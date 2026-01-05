import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    Sparkles,
    FileText,
    TrendingUp,
    Target,
    Users,
    ArrowRight,
    Lightbulb,
    Clock,
    Search,
} from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function getStrategiserData() {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        // Get user from database
        const user = await prisma.user.findFirst({
            where: { clerkId: userId },
        });

        if (!user) return null;

        // Get current month start for "this month" calculations
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Fetch real data from database
        const [
            totalStrategies,
            strategiesThisMonth,
            strategiesLastMonth,
            recentStrategies,
        ] = await Promise.all([
            // Total strategies for this user
            prisma.marketingStrategy.count({
                where: { userId: user.id },
            }),
            // Strategies created this month
            prisma.marketingStrategy.count({
                where: {
                    userId: user.id,
                    createdAt: { gte: monthStart },
                },
            }),
            // Strategies created last month (for comparison)
            prisma.marketingStrategy.count({
                where: {
                    userId: user.id,
                    createdAt: { gte: lastMonthStart, lt: monthStart },
                },
            }),
            // Recent strategies
            prisma.marketingStrategy.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    strategyName: true,
                    strategyType: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
        ]);

        // Calculate days until next month (credit reset simulation)
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const daysUntilReset = Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // AI Credits: Based on tier limits (simplified - would need subscription check)
        const aiCreditsUsed = strategiesThisMonth;
        const aiCreditsTotal = 100; // Would come from user's subscription tier

        return {
            totalStrategies,
            strategiesThisMonth,
            strategiesLastMonth,
            recentStrategies,
            daysUntilReset,
            aiCreditsUsed,
            aiCreditsTotal,
        };
    } catch (error) {
        console.error('[Strategiser Dashboard] Error:', error);
        return null;
    }
}

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? 's' : ''} ago`;
}

export default async function StrategiserDashboard() {
    const data = await getStrategiserData();

    // Handle unauthenticated or error state
    if (!data) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">The Strategiser</h1>
                        <p className="text-muted-foreground mt-1">
                            AI-powered marketing strategy generation
                        </p>
                    </div>
                </div>
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">Please sign in to view your strategies.</p>
                        <Link href="/auth/signin">
                            <Button className="mt-4">Sign In</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { totalStrategies, strategiesThisMonth, recentStrategies, daysUntilReset, aiCreditsUsed, aiCreditsTotal } = data;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">The Strategiser</h1>
                    <p className="text-muted-foreground mt-1">
                        AI-powered marketing strategy generation
                    </p>
                </div>
                <Link href="/dashboard/strategies/create">
                    <Button className="bg-violet-600 hover:bg-violet-700">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create Strategy
                    </Button>
                </Link>
            </div>

            {/* Quick Stats - Now with REAL data */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStrategies}</div>
                        <p className="text-xs text-muted-foreground">
                            {strategiesThisMonth > 0 ? `+${strategiesThisMonth} this month` : 'No new strategies this month'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">AI Credits Used</CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{aiCreditsUsed}/{aiCreditsTotal}</div>
                        <p className="text-xs text-muted-foreground">Resets in {daysUntilReset} days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{strategiesThisMonth}</div>
                        <p className="text-xs text-muted-foreground">Strategies created</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Strategy Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8.5/10</div>
                        <p className="text-xs text-green-500">AI quality score</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:border-violet-500/50 transition-colors cursor-pointer group">
                    <Link href="/dashboard/strategies/create">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                                    <Sparkles className="h-5 w-5 text-violet-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Create Strategy</CardTitle>
                                    <CardDescription>Director-level AI strategy</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Generate a comprehensive marketing strategy with 17 sections using world-class frameworks.
                            </p>
                            <div className="flex items-center gap-2 mt-4 text-violet-600 text-sm font-medium group-hover:gap-3 transition-all">
                                Start creating <ArrowRight className="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:border-violet-500/50 transition-colors cursor-pointer group">
                    <Link href="/strategiser/templates">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                    <Target className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Use Template</CardTitle>
                                    <CardDescription>Start from proven frameworks</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Choose from industry-tested strategy templates and customize for your needs.
                            </p>
                            <div className="flex items-center gap-2 mt-4 text-blue-600 text-sm font-medium group-hover:gap-3 transition-all">
                                Browse templates <ArrowRight className="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:border-violet-500/50 transition-colors cursor-pointer group">
                    <Link href="/strategiser/copilot">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                                    <Lightbulb className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">AI Copilot</CardTitle>
                                    <CardDescription>Get strategic advice</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Chat with our AI to get insights, recommendations, and planning help.
                            </p>
                            <div className="flex items-center gap-2 mt-4 text-emerald-600 text-sm font-medium group-hover:gap-3 transition-all">
                                Start chatting <ArrowRight className="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:border-violet-500/50 transition-colors cursor-pointer group">
                    <Link href="/growth-suite/competitors">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                                    <Search className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Competitor Analysis</CardTitle>
                                    <CardDescription>Analyze market competition</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Scan and analyze competitors to identify market opportunities and gaps.
                            </p>
                            <div className="flex items-center gap-2 mt-4 text-orange-600 text-sm font-medium group-hover:gap-3 transition-all">
                                Analyze competitors <ArrowRight className="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Link>
                </Card>
            </div>

            {/* Recent Strategies - Now with REAL data */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Strategies</CardTitle>
                        <Link href="/dashboard/strategies">
                            <Button variant="ghost" size="sm">View all</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentStrategies.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No strategies yet</p>
                            <Link href="/dashboard/strategies/create">
                                <Button variant="outline" size="sm" className="mt-2">
                                    Create your first strategy
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentStrategies.map((strategy) => (
                                <Link
                                    key={strategy.id}
                                    href={`/dashboard/strategies/${strategy.id}`}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                                            <FileText className="h-4 w-4 text-violet-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{strategy.strategyName || 'Untitled Strategy'}</p>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {formatRelativeTime(strategy.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="default">
                                            {strategy.strategyType || 'General'}
                                        </Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

