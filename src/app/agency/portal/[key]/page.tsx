import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, FileText, CheckCircle } from 'lucide-react';

// Force dynamic to ensure data is fresh
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        key: string;
    }>;
}

async function getClientByKey(key: string) {
    return await prisma.agencyClient.findUnique({
        where: { portalAccessKey: key },
        include: {
            projects: {
                where: { status: 'IN_PROGRESS' },
                take: 5
            }
        }
    });
}

// In Next.js 15, page props are promises. We must await them.
export default async function ClientPortalPage({ params }: PageProps) {
    const resolvedParams = await params;
    const client = await getClientByKey(resolvedParams.key);

    if (!client) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Portal Access Denied</h1>
                    <p className="text-zinc-500 mt-2">Invalid or expired access key.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <header className="flex items-center justify-between border-b pb-6 border-zinc-200 dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Welcome, {client.name}
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Client Portal</p>
                    </div>
                    <div className="text-sm text-zinc-400">
                        Internal ID: {client.industry || 'N/A'}
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{client.projects.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">Active</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Projects</CardTitle>
                        <CardDescription>Real-time status of your ongoing campaigns.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {client.projects.length > 0 ? (
                            <div className="space-y-4">
                                {client.projects.map(project => (
                                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-zinc-900/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded text-indigo-600 dark:text-indigo-400">
                                                <Briefcase className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{project.name}</div>
                                                <div className="text-xs text-zinc-500">Started {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                                            {project.status.toLowerCase().replace('_', ' ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-zinc-500 italic">No active projects visible.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
