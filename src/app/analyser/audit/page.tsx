'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Shield,
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCircle2,
    RefreshCw,
    Download,
} from 'lucide-react';

const auditScore = 78;

const auditCategories = [
    { name: 'Meta Tags', score: 85, errors: 3, warnings: 12, passed: 45 },
    { name: 'Content', score: 72, errors: 5, warnings: 18, passed: 38 },
    { name: 'Links', score: 82, errors: 2, warnings: 8, passed: 52 },
    { name: 'Performance', score: 68, errors: 8, warnings: 22, passed: 30 },
    { name: 'Mobile', score: 88, errors: 1, warnings: 5, passed: 55 },
];

const issues = [
    {
        severity: 'error',
        category: 'Meta Tags',
        type: 'Missing Title Tag',
        message: '5 pages are missing title tags',
        count: 5,
        impact: 'High',
    },
    {
        severity: 'error',
        category: 'Performance',
        type: 'Large Page Size',
        message: '8 pages exceed 3MB in size',
        count: 8,
        impact: 'High',
    },
    {
        severity: 'error',
        category: 'Content',
        type: 'Duplicate H1 Tags',
        message: '3 pages have duplicate H1 tags',
        count: 3,
        impact: 'Medium',
    },
    {
        severity: 'warning',
        category: 'Meta Tags',
        type: 'Short Meta Description',
        message: '12 pages have meta descriptions under 120 characters',
        count: 12,
        impact: 'Medium',
    },
    {
        severity: 'warning',
        category: 'Links',
        type: 'Broken Internal Links',
        message: '8 internal links are broken (404)',
        count: 8,
        impact: 'Medium',
    },
    {
        severity: 'warning',
        category: 'Performance',
        type: 'Missing Alt Text',
        message: '22 images are missing alt text',
        count: 22,
        impact: 'Low',
    },
    {
        severity: 'info',
        category: 'Content',
        type: 'Thin Content',
        message: '15 pages have less than 300 words',
        count: 15,
        impact: 'Low',
    },
];

const getSeverityIcon = (severity: string) => {
    switch (severity) {
        case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
        case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
        case 'info': return <Info className="h-4 w-4 text-blue-500" />;
        default: return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
};

const getSeverityBadge = (severity: string) => {
    switch (severity) {
        case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        case 'warning': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
        case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        default: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
};

export default function AuditPage() {
    const totalErrors = issues.filter(i => i.severity === 'error').length;
    const totalWarnings = issues.filter(i => i.severity === 'warning').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Shield className="h-8 w-8 text-emerald-500" />
                        Site Audit
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Technical SEO health check and issue detection
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Run New Audit
                    </Button>
                </div>
            </div>

            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="col-span-1">
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24">
                            <svg className="w-24 h-24 transform -rotate-90">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    className="text-muted"
                                />
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${auditScore * 2.51} 251`}
                                    className="text-emerald-500"
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                                {auditScore}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Health Score</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="font-medium">Errors</span>
                        </div>
                        <p className="text-3xl font-bold text-red-600">{totalErrors}</p>
                        <p className="text-sm text-muted-foreground">Critical issues</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <span className="font-medium">Warnings</span>
                        </div>
                        <p className="text-3xl font-bold text-amber-600">{totalWarnings}</p>
                        <p className="text-sm text-muted-foreground">Should fix</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span className="font-medium">Passed</span>
                        </div>
                        <p className="text-3xl font-bold text-green-600">220</p>
                        <p className="text-sm text-muted-foreground">Checks passed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {auditCategories.map((cat) => (
                            <div key={cat.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{cat.name}</span>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-red-600">{cat.errors} errors</span>
                                        <span className="text-amber-600">{cat.warnings} warnings</span>
                                        <span className="text-green-600">{cat.passed} passed</span>
                                        <Badge variant="secondary">{cat.score}%</Badge>
                                    </div>
                                </div>
                                <Progress value={cat.score} className="h-2" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Issues List */}
            <Card>
                <CardHeader>
                    <CardTitle>Issues to Fix</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {issues.map((issue, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                                {getSeverityIcon(issue.severity)}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{issue.type}</span>
                                        <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{issue.message}</p>
                                </div>
                                <Badge className={getSeverityBadge(issue.severity)}>
                                    {issue.count} {issue.count === 1 ? 'issue' : 'issues'}
                                </Badge>
                                <Badge variant="outline">{issue.impact} Impact</Badge>
                                <Button variant="outline" size="sm">View</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
