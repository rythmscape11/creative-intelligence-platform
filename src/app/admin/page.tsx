'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Users,
    CreditCard,
    Key,
    BarChart3,
    Shield,
    ArrowRight,
} from 'lucide-react';
import { MonetizationWidget } from '@/components/admin/MonetizationWidget';

const adminSections = [
    {
        title: 'User Management',
        description: 'Manage users, roles, and permissions',
        href: '/admin/users',
        icon: Users,
        color: 'bg-blue-500',
    },
    {
        title: 'Billing Dashboard',
        description: 'View MRR, subscriptions, and payment history',
        href: '/admin/billing',
        icon: CreditCard,
        color: 'bg-green-500',
    },
    {
        title: 'API Configuration',
        description: 'Configure third-party API keys and integrations',
        href: '/admin/api-config',
        icon: Key,
        color: 'bg-amber-500',
    },
    {
        title: 'Platform Analytics',
        description: 'Usage metrics, performance, and insights',
        href: '/admin/analytics',
        icon: BarChart3,
        color: 'bg-purple-500',
    },
];

export default function AdminPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Shield className="h-6 w-6 text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>
                <p className="text-muted-foreground">
                    Manage platform settings, users, and configurations
                </p>
            </div>

            {/* Admin Sections Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {adminSections.map((section) => (
                    <Link key={section.href} href={section.href}>
                        <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardHeader className="flex flex-row items-start gap-4">
                                <div className={`p-3 rounded-lg ${section.color}`}>
                                    <section.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="flex items-center justify-between">
                                        {section.title}
                                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {section.description}
                                    </p>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Monetization Signals */}
            <div className="mt-8">
                <MonetizationWidget />
            </div>

            {/* Quick Stats */}
            <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/users">
                        <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            View Users
                        </Button>
                    </Link>
                    <Link href="/admin/billing">
                        <Button variant="outline" size="sm">
                            <CreditCard className="h-4 w-4 mr-2" />
                            View Revenue
                        </Button>
                    </Link>
                    <Link href="/admin/api-config">
                        <Button variant="outline" size="sm">
                            <Key className="h-4 w-4 mr-2" />
                            Configure APIs
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            ← Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
