/**
 * Tasks API Routes
 * GET /api/agency/tasks - List tasks (with Kanban grouping)
 * POST /api/agency/tasks - Create task
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { TaskService } from '@/lib/agency/task-service';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const view = searchParams.get('view');
        const projectId = searchParams.get('projectId') || undefined;

        if (view === 'kanban') {
            const columns = await TaskService.getKanbanBoard(projectId);
            return NextResponse.json({ columns });
        }

        const tasks = await TaskService.listTasks({
            jobId: searchParams.get('jobId') || undefined,
            status: searchParams.get('status') || undefined,
            assigneeId: searchParams.get('assigneeId') || undefined,
            priority: searchParams.get('priority') || undefined,
        });

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error('[Tasks API] Error:', error);
        return NextResponse.json({ error: 'Failed to list tasks' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        if (!body.jobId || !body.title) {
            return NextResponse.json({ error: 'jobId and title are required' }, { status: 400 });
        }

        const task = await TaskService.createTask(body);
        return NextResponse.json({ task }, { status: 201 });
    } catch (error) {
        console.error('[Tasks API] Error:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}
