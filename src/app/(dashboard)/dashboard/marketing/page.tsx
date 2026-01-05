'use client';

import { MailchimpWidget } from '@/components/marketing/mailchimp-widget';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Settings, Users, Plus, Megaphone } from 'lucide-react';
import Link from 'next/link';

import { FeatureGuard } from '@/components/feature-guard';
import { notFound } from 'next/navigation'; // In strict mode, maybe redirect? But accessing logic is handled by sidebar hiding.

export default function MarketingDashboardPage() {
    return (
        <FeatureGuard feature="optimiser" showComingSoon={true} fallback={null}>
            <div className="min-h-screen bg-bg-primary py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-text-primary mb-2 flex items-center gap-3">
                                <Megaphone className="h-8 w-8 text-amber-500" />
                                Marketing Hub
                            </h1>
                            <p className="text-text-secondary">
                                Manage your email campaigns, subscribers, and automation
                            </p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button variant="outline" className="flex-1 sm:flex-none" asChild>
                                <Link href="/dashboard/admin/integrations/mailchimp">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </Link>
                            </Button>
                            <Button className="bg-amber-600 hover:bg-amber-700 text-white flex-1 sm:flex-none" asChild>
                                <Link href="/dashboard/marketing/campaigns">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Campaign
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Widgets Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Mailchimp Widget */}
                        <div className="h-full">
                            <MailchimpWidget />
                        </div>

                        {/* Quick Actions */}
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    Audience
                                </CardTitle>
                                <CardDescription>Manage your subscribers</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="secondary" className="w-full justify-start" asChild>
                                    <Link href="/dashboard/admin/users">
                                        <Users className="h-4 w-4 mr-2" />
                                        View All Users
                                    </Link>
                                </Button>
                                <Button variant="secondary" className="w-full justify-start" asChild>
                                    <Link href="/dashboard/admin/integrations/mailchimp">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Manage Segments
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Campaigns (Placeholder for now) */}
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-green-500" />
                                    Recent Campaigns
                                </CardTitle>
                                <CardDescription>Latest email performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                        <div>
                                            <p className="font-medium text-sm">November Newsletter</p>
                                            <p className="text-xs text-muted-foreground">Sent 2 days ago</p>
                                        </div>
                                        <span className="text-xs font-bold text-green-500">24% Open</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                        <div>
                                            <p className="font-medium text-sm">Welcome Series</p>
                                            <p className="text-xs text-muted-foreground">Ongoing</p>
                                        </div>
                                        <span className="text-xs font-bold text-blue-500">Active</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </FeatureGuard>
    );
}
