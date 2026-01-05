'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    Layers,
    Target,
    Megaphone,
    ShoppingCart,
    TrendingUp,
    ArrowRight,
    Rocket,
    Users,
    Globe,
} from 'lucide-react';

const templates = [
    {
        id: 1,
        name: 'Product Launch',
        description: 'Complete go-to-market strategy for new product launches',
        icon: Rocket,
        category: 'Launch',
        popular: true,
    },
    {
        id: 2,
        name: 'Lead Generation',
        description: 'B2B lead generation funnel with multi-channel approach',
        icon: Users,
        category: 'B2B',
        popular: true,
    },
    {
        id: 3,
        name: 'Brand Awareness',
        description: 'Build brand recognition and market presence',
        icon: Megaphone,
        category: 'Branding',
        popular: false,
    },
    {
        id: 4,
        name: 'E-commerce Growth',
        description: 'Scale your online store with proven tactics',
        icon: ShoppingCart,
        category: 'E-commerce',
        popular: true,
    },
    {
        id: 5,
        name: 'Content Marketing',
        description: 'Content-first strategy to attract and convert',
        icon: Globe,
        category: 'Content',
        popular: false,
    },
    {
        id: 6,
        name: 'Performance Marketing',
        description: 'Paid media strategy optimized for ROAS',
        icon: TrendingUp,
        category: 'Paid',
        popular: false,
    },
];

export default function TemplatesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Strategy Templates</h1>
                <p className="text-muted-foreground">Start with proven frameworks and customize for your needs</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                    <Card key={template.id} className="hover:border-violet-500/50 transition-colors cursor-pointer group">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                                    <template.icon className="h-5 w-5 text-violet-600" />
                                </div>
                                {template.popular && (
                                    <Badge variant="secondary">Popular</Badge>
                                )}
                            </div>
                            <CardTitle className="mt-3">{template.name}</CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Badge variant="outline">{template.category}</Badge>
                                <Button variant="ghost" size="sm" className="text-violet-600 group-hover:gap-3 transition-all">
                                    Use template <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
