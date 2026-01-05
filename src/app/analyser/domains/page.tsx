'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Globe,
    Plus,
    Search,
    TrendingUp,
    TrendingDown,
    ExternalLink,
    MoreHorizontal,
    RefreshCw,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const domains = [
    {
        id: '1',
        domain: 'acme.com',
        name: 'Acme Corporation',
        favicon: '🏢',
        monthlyVisits: 125000,
        authorityScore: 72,
        organicKeywords: 850,
        backlinks: 4200,
        trend: 'up',
        trendValue: '+12%',
        lastUpdated: '2 hours ago',
    },
    {
        id: '2',
        domain: 'techstartup.io',
        name: 'TechStartup',
        favicon: '🚀',
        monthlyVisits: 45000,
        authorityScore: 58,
        organicKeywords: 320,
        backlinks: 1800,
        trend: 'up',
        trendValue: '+8%',
        lastUpdated: '3 hours ago',
    },
    {
        id: '3',
        domain: 'marketingpro.com',
        name: 'Marketing Pro',
        favicon: '📊',
        monthlyVisits: 89000,
        authorityScore: 65,
        organicKeywords: 640,
        backlinks: 3100,
        trend: 'down',
        trendValue: '-3%',
        lastUpdated: '1 hour ago',
    },
    {
        id: '4',
        domain: 'ecommerce-brand.com',
        name: 'E-Commerce Brand',
        favicon: '🛒',
        monthlyVisits: 234000,
        authorityScore: 78,
        organicKeywords: 1200,
        backlinks: 5600,
        trend: 'up',
        trendValue: '+15%',
        lastUpdated: '4 hours ago',
    },
    {
        id: '5',
        domain: 'saasplatform.io',
        name: 'SaaS Platform',
        favicon: '☁️',
        monthlyVisits: 67000,
        authorityScore: 61,
        organicKeywords: 480,
        backlinks: 2100,
        trend: 'up',
        trendValue: '+5%',
        lastUpdated: '6 hours ago',
    },
];

export default function DomainsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    const filteredDomains = domains.filter(d =>
        d.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Globe className="h-8 w-8 text-emerald-500" />
                        Tracked Domains
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor SEO & traffic intelligence for your domains
                    </p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Domain
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Domain</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <label className="text-sm font-medium">Domain URL</label>
                                <Input placeholder="example.com" className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Display Name</label>
                                <Input placeholder="My Website" className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Country</label>
                                <Input placeholder="US" className="mt-1" />
                            </div>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                Start Tracking
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search domains..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            {/* Domain Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDomains.map((domain) => (
                    <Card key={domain.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xl">
                                        {domain.favicon}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{domain.domain}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{domain.name}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p className="text-xs text-muted-foreground">Monthly Visits</p>
                                    <p className="text-lg font-bold">{formatNumber(domain.monthlyVisits)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Authority</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-bold">{domain.authorityScore}</p>
                                        <Badge variant="secondary" className="text-xs">
                                            /100
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Keywords</p>
                                    <p className="text-lg font-bold">{formatNumber(domain.organicKeywords)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Backlinks</p>
                                    <p className="text-lg font-bold">{formatNumber(domain.backlinks)}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <div className={`flex items-center gap-1 text-sm ${domain.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {domain.trend === 'up' ? (
                                        <TrendingUp className="h-4 w-4" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4" />
                                    )}
                                    {domain.trendValue}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    Updated {domain.lastUpdated}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
