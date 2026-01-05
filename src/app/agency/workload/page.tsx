/**
 * Workload Page for Agency OS
 * Team capacity and resource allocation view
 */

'use client';

import { useState, useEffect } from 'react';
import { WorkloadView } from '@/components/agency/WorkloadView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function WorkloadPage() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/agency/tasks">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Users className="h-6 w-6 text-indigo-500" />
                            Team Workload
                        </h1>
                        <p className="text-muted-foreground">
                            Monitor team capacity and balance workloads
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/agency/gantt">
                        <Button variant="outline" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Gantt View
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Workload View */}
            <WorkloadView />
        </div>
    );
}
