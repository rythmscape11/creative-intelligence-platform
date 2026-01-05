'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
    FileText,
    Search,
    Filter,
    Download,
    Trash2,
    Edit,
    Eye,
    Clock,
    Star,
} from 'lucide-react';

const strategies = [
    { id: 1, name: 'Q1 2025 Growth Strategy', status: 'Complete', date: '2024-12-07', score: 9.2, industry: 'SaaS' },
    { id: 2, name: 'Product Launch Campaign', status: 'Draft', date: '2024-12-02', score: 7.8, industry: 'E-commerce' },
    { id: 3, name: 'Brand Awareness Initiative', status: 'Complete', date: '2024-12-01', score: 8.5, industry: 'Healthcare' },
    { id: 4, name: 'Lead Generation Funnel', status: 'Complete', date: '2024-11-28', score: 8.9, industry: 'B2B' },
    { id: 5, name: 'Social Media Expansion', status: 'In Progress', date: '2024-11-25', score: 6.5, industry: 'Retail' },
];

export default function StrategiesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStrategies = strategies.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Strategies</h1>
                    <p className="text-muted-foreground">View and manage all your marketing strategies</p>
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700">
                    + New Strategy
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search strategies..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </div>

            {/* Strategies List */}
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {filteredStrategies.map((strategy) => (
                            <div key={strategy.id} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                                        <FileText className="h-5 w-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{strategy.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(strategy.date).toLocaleDateString()}
                                            </span>
                                            <span>•</span>
                                            <span>{strategy.industry}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-amber-500" />
                                        <span className="font-medium">{strategy.score}</span>
                                    </div>
                                    <Badge variant={
                                        strategy.status === 'Complete' ? 'default' :
                                            strategy.status === 'Draft' ? 'secondary' : 'outline'
                                    }>
                                        {strategy.status}
                                    </Badge>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
