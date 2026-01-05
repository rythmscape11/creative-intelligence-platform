import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ensureUserInDb } from '@/lib/ensure-user';

export async function POST() {
    const logs: string[] = [];
    const log = (msg: string) => {
        console.log(`[Seed] ${msg}`);
        logs.push(msg);
    };

    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure user exists in Prisma
        const userResult = await ensureUserInDb(userId);
        if (!userResult.success) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        log('Starting seed process...');
        const timestamp = Date.now().toString().slice(-6);

        // Create 1 client linked to the user
        log('Creating client...');
        const client = await prisma.agencyClient.create({
            data: {
                userId, // Link to the user!
                name: `Demo Agency ${timestamp}`,
                industry: 'Technology',
                website: 'https://example.com',
                status: 'ACTIVE',
            },
        });
        log(`Client created: ${client.id}`);

        // Create 1 project for this client
        log('Creating project...');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 10);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 45);

        const project = await prisma.agencyProject.create({
            data: {
                name: `Marketing Campaign ${timestamp}`,
                description: 'Demo marketing campaign with tasks for Gantt chart',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                budget: 50000,
                clientId: client.id,
                startDate,
                endDate,
                tags: ['demo'],
            },
        });
        log(`Project created: ${project.id}`);

        // Create 2 jobs for this project
        log('Creating jobs...');
        const jobs = [];
        const jobData = [
            { title: 'Creative Development', type: 'CREATIVE', status: 'IN_PROGRESS' },
            { title: 'Digital Marketing', type: 'MEDIA', status: 'TODO' },
        ];

        for (const jd of jobData) {
            const job = await prisma.agencyJob.create({
                data: {
                    title: jd.title,
                    type: jd.type,
                    status: jd.status,
                    description: `${jd.title} for the project`,
                    projectId: project.id,
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                },
            });
            jobs.push(job);
            log(`Job created: ${job.id} - ${job.title}`);
        }

        // Create 4 tasks per job (8 total) - with different dates for Gantt
        log('Creating tasks...');
        let tasksCreated = 0;
        const taskTemplates = [
            { title: 'Design hero banner', priority: 'HIGH', status: 'DONE', days: 0 },
            { title: 'Write ad copy', priority: 'MEDIUM', status: 'IN_PROGRESS', days: 3 },
            { title: 'Setup tracking', priority: 'HIGH', status: 'TODO', days: 7 },
            { title: 'Launch campaign', priority: 'URGENT', status: 'TODO', days: 14 },
        ];

        for (const job of jobs) {
            for (let i = 0; i < taskTemplates.length; i++) {
                const t = taskTemplates[i];
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + t.days);

                await prisma.agencyTask.create({
                    data: {
                        title: `${t.title} - ${job.title}`,
                        priority: t.priority,
                        status: t.status,
                        estimatedHours: 4 + i,
                        description: `Task ${i + 1} for ${job.title}`,
                        jobId: job.id,
                        dueDate,
                        labels: ['demo'],
                    },
                });
                tasksCreated++;
                log(`Task ${tasksCreated} created: ${t.title}`);
            }
        }

        // Create 1 campaign
        log('Creating campaign...');
        await prisma.agencyCampaign.create({
            data: {
                projectId: project.id,
                name: `Spring Campaign ${timestamp}`,
                description: 'Demo marketing campaign',
                objective: 'SALES',
                status: 'ACTIVE',
                budget: 35000,
                spentAmount: 10000,
                channels: JSON.stringify(['FACEBOOK', 'GOOGLE_ADS']),
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                tags: ['demo'],
            },
        });
        log('Campaign created');

        const summary = `1 client, 1 project, ${jobs.length} jobs, ${tasksCreated} tasks, 1 campaign`;
        log(`Seed complete: ${summary}`);

        return NextResponse.json({
            success: true,
            summary,
            logs,
            data: {
                clientId: client.id,
                projectId: project.id,
                jobIds: jobs.map(j => j.id),
                tasksCreated,
            },
        });
    } catch (error) {
        console.error('Seed Demo Data Error:', error);
        return NextResponse.json({
            error: 'Failed to seed demo data',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            logs,
        }, { status: 500 });
    }
}
