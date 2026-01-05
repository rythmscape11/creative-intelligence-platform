'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, FileText } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Strategy Reports</h1>
                <p className="text-muted-foreground">Generate and download strategy reports</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Executive Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">High-level overview of all active strategies</p>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Performance Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Detailed metrics and KPI tracking</p>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
