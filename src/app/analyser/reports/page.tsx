'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ClipboardList,
    Plus,
    Calendar,
    FileText,
    Download,
    Clock,
} from 'lucide-react';

const reports = [
    {
        id: '1',
        name: 'Monthly SEO Report - December 2024',
        type: 'overview',
        domain: 'acme.com',
        createdAt: '2024-12-01',
        status: 'ready',
    },
    {
        id: '2',
        name: 'Keyword Gap Analysis Q4',
        type: 'keywords',
        domain: 'acme.com',
        createdAt: '2024-11-28',
        status: 'ready',
    },
    {
        id: '3',
        name: 'Competitor Benchmark Report',
        type: 'competitors',
        domain: 'techstartup.io',
        createdAt: '2024-11-25',
        status: 'ready',
    },
    {
        id: '4',
        name: 'Site Audit Summary',
        type: 'audit',
        domain: 'marketingpro.com',
        createdAt: '2024-11-20',
        status: 'ready',
    },
];

const scheduledReports = [
    {
        id: '1',
        name: 'Weekly Rankings Update',
        schedule: 'Every Monday 9:00 AM',
        nextRun: '2024-12-16',
    },
    {
        id: '2',
        name: 'Monthly Performance Summary',
        schedule: '1st of each month',
        nextRun: '2025-01-01',
    },
];

const getTypeBadge = (type: string) => {
    switch (type) {
        case 'overview': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
        case 'keywords': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'competitors': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
        case 'audit': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <ClipboardList className="h-8 w-8 text-emerald-500" />
                        Reports
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Generate and schedule SEO intelligence reports
                    </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Report
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {reports.map((report) => (
                                    <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                                <FileText className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{report.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {report.domain} • {new Date(report.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={getTypeBadge(report.type)}>{report.type}</Badge>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-1" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Scheduled Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {scheduledReports.map((report) => (
                                <div key={report.id} className="p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-4 w-4 text-emerald-500" />
                                        <span className="font-medium text-sm">{report.name}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {report.schedule}
                                        </div>
                                        <div className="mt-1">Next: {new Date(report.nextRun).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule New
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
