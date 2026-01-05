/**
 * Task Detail API Routes
 * GET/PATCH/DELETE /api/agency/tasks/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { TaskService } from '@/lib/agency/task-service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const task = await TaskService.getTaskById(id);

        if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

        return NextResponse.json({ task });
    } catch (error) {
        console.error('[Task API] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await request.json();

        // Handle move action for Kanban
        if (body.action === 'move' && body.status) {
            const task = await TaskService.moveTask(id, body.status);
            return NextResponse.json({ task, message: `Task moved to ${body.status}` });
        }

        // Handle comment addition
        if (body.action === 'comment' && body.content) {
            const comment = await TaskService.addComment({
                taskId: id,
                userId,
                content: body.content,
            });
            return NextResponse.json({ comment }, { status: 201 });
        }

        const task = await TaskService.updateTask(id, body);
        return NextResponse.json({ task });
    } catch (error) {
        console.error('[Task API] Error:', error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        await TaskService.deleteTask(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Task API] Error:', error);
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}
