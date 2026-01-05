'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileBarChart,
    Download,
    Calendar,
    TrendingUp,
    DollarSign,
    Target,
    BarChart2,
    PieChart,
    Share2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    icon: any;
    type: string;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
    {
        id: '1',
        name: 'Executive Summary',
        description: 'High-level KPIs and trends for stakeholders',
        icon: BarChart2,
        type: 'SUMMARY',
    },
    {
        id: '2',
        name: 'Campaign Performance',
        description: 'Detailed campaign metrics with comparisons',
        icon: TrendingUp,
        type: 'CAMPAIGNS',
    },
    {
        id: '3',
        name: 'Budget Utilization',
        description: 'Spend breakdown and budget pacing',
        icon: DollarSign,
        type: 'BUDGET',
    },
    {
        id: '4',
        name: 'Conversion Analysis',
        description: 'Funnel analysis and conversion paths',
        icon: Target,
        type: 'CONVERSIONS',
    },
    {
        id: '5',
        name: 'Channel Mix',
        description: 'Performance by platform and channel',
        icon: PieChart,
        type: 'CHANNELS',
    },
];

interface GeneratedReport {
    id: string;
    name: string;
    type: string;
    dateRange: string;
    createdAt: string;
    status: string;
}

const DEMO_REPORTS: GeneratedReport[] = [
    {
        id: '1',
        name: 'Executive Summary - December 2024',
        type: 'SUMMARY',
        dateRange: 'Dec 1-7, 2024',
        createdAt: '2024-12-08',
        status: 'READY',
    },
    {
        id: '2',
        name: 'Campaign Performance - Week 49',
        type: 'CAMPAIGNS',
        dateRange: 'Nov 25 - Dec 1, 2024',
        createdAt: '2024-12-02',
        status: 'READY',
    },
];

export default function ReportsPage() {
    const [reports, setReports] = useState<GeneratedReport[]>(DEMO_REPORTS);
    const [generating, setGenerating] = useState<string | null>(null);

    const handleGenerate = (template: ReportTemplate) => {
        setGenerating(template.id);
        setTimeout(() => {
            toast.success(`${template.name} generated!`);
            setReports([
                {
                    id: Date.now().toString(),
                    name: `${template.name} - ${new Date().toLocaleDateString()}`,
                    type: template.type,
                    dateRange: 'Last 7 days',
                    createdAt: new Date().toISOString(),
                    status: 'READY',
                },
                ...reports,
            ]);
            setGenerating(null);
        }, 2000);
    };

    const handleExport = (reportId: string, format: string) => {
        toast.success(`Exporting as ${format}...`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <FileBarChart className="h-8 w-8 text-emerald-500" />
                        Reports
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Generate and export performance reports
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="px-3 py-2 border rounded-md bg-background text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>This month</option>
                        <option>Last month</option>
                        <option>Custom range</option>
                    </select>
                </div>
            </div>

            {/* Report Templates */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Generate New Report</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {REPORT_TEMPLATES.map((template) => (
                        <Card
                            key={template.id}
                            className="cursor-pointer hover:border-emerald-500/50 transition-colors"
                            onClick={() => handleGenerate(template)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <template.icon className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{template.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {template.description}
                                        </p>
                                    </div>
                                    {generating === template.id ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full" />
                                    ) : (
                                        <Button variant="ghost" size="sm">
                                            Generate
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Generated Reports */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
                {reports.length === 0 ? (
                    <Card className="p-8 text-center">
                        <FileBarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">No reports yet</h3>
                        <p className="text-muted-foreground">
                            Generate your first report using the templates above.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {reports.map((report) => (
                            <Card key={report.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                <FileBarChart className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{report.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {report.dateRange}
                                                    <span>•</span>
                                                    Created {new Date(report.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                {report.status}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleExport(report.id, 'PDF')}
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                PDF
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleExport(report.id, 'CSV')}
                                            >
                                                CSV
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
