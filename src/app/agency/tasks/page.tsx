'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from '@hello-pangea/dnd';
import {
    Plus,
    GripVertical,
    Clock,
    MessageSquare,
    Calendar,
    User,
    AlertCircle,
    CheckCircle2,
    Circle,
    Loader2,
} from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    assigneeId?: string;
    dueDate?: string;
    estimatedHours?: number;
    job: { name: string; project?: { name: string } };
    comments: { id: string }[];
}

type KanbanColumns = {
    TODO: Task[];
    IN_PROGRESS: Task[];
    REVIEW: Task[];
    DONE: Task[];
};

const COLUMN_LABELS: Record<string, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'In Review',
    DONE: 'Done',
};

const COLUMN_COLORS: Record<string, string> = {
    TODO: 'border-zinc-500',
    IN_PROGRESS: 'border-blue-500',
    REVIEW: 'border-amber-500',
    DONE: 'border-emerald-500',
};

const PRIORITY_COLORS: Record<string, string> = {
    LOW: 'bg-zinc-500',
    MEDIUM: 'bg-blue-500',
    HIGH: 'bg-amber-500',
    URGENT: 'bg-red-500',
};

export default function TasksKanbanPage() {
    const [columns, setColumns] = useState<KanbanColumns | null>(null);
    const [loading, setLoading] = useState(true);
    const [moving, setMoving] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/agency/tasks?view=kanban');
            const data = await res.json();
            setColumns(data.columns);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const moveTask = async (taskId: string, newStatus: string) => {
        setMoving(taskId);
        try {
            await fetch(`/api/agency/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'move', status: newStatus }),
            });
        } catch (error) {
            console.error('Error moving task:', error);
            // Revert on error
            fetchTasks();
        } finally {
            setMoving(null);
        }
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        // Dropped outside a droppable area
        if (!destination) return;

        // Dropped in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (!columns) return;

        const sourceColumn = source.droppableId as keyof KanbanColumns;
        const destColumn = destination.droppableId as keyof KanbanColumns;

        // Get the task
        const sourceItems = [...columns[sourceColumn]];
        const [movedTask] = sourceItems.splice(source.index, 1);

        if (sourceColumn === destColumn) {
            // Reordering within the same column
            sourceItems.splice(destination.index, 0, movedTask);
            setColumns({
                ...columns,
                [sourceColumn]: sourceItems,
            });
        } else {
            // Moving to a different column
            const destItems = [...columns[destColumn]];
            const updatedTask = { ...movedTask, status: destColumn };
            destItems.splice(destination.index, 0, updatedTask);

            setColumns({
                ...columns,
                [sourceColumn]: sourceItems,
                [destColumn]: destItems,
            });

            // Update in backend
            moveTask(draggableId, destColumn);
        }
    };

    const getTaskStats = () => {
        if (!columns) return { total: 0, todo: 0, inProgress: 0, done: 0 };
        return {
            total: Object.values(columns).flat().length,
            todo: columns.TODO.length,
            inProgress: columns.IN_PROGRESS.length + columns.REVIEW.length,
            done: columns.DONE.length,
        };
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                </div>
                <AgencyListSkeleton count={4} />
            </div>
        );
    }

    if (!columns) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                </div>
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No tasks data available</p>
                </div>
            </div>
        );
    }

    const stats = getTaskStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Tasks Board
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Drag and drop tasks to update status
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Task
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            <Circle className="h-5 w-5 text-zinc-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-sm text-muted-foreground">Total Tasks</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            <AlertCircle className="h-5 w-5 text-zinc-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.todo}</div>
                            <div className="text-sm text-muted-foreground">To Do</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Loader2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.inProgress}</div>
                            <div className="text-sm text-muted-foreground">In Progress</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.done}</div>
                            <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Kanban Board with Drag and Drop */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
                    {columns && (['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const).map((columnKey) => (
                        <div key={columnKey} className="min-w-[280px]">
                            <Card className={`border-t-4 ${COLUMN_COLORS[columnKey]}`}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium">
                                            {COLUMN_LABELS[columnKey]}
                                        </CardTitle>
                                        <Badge variant="secondary" className="text-xs">
                                            {columns[columnKey].length}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <Droppable droppableId={columnKey}>
                                    {(provided, snapshot) => (
                                        <CardContent
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`space-y-3 min-h-[200px] max-h-[600px] overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-zinc-100 dark:bg-zinc-800/50' : ''
                                                }`}
                                        >
                                            {columns[columnKey].length === 0 ? (
                                                <div className="text-center py-8 text-muted-foreground text-sm">
                                                    Drop tasks here
                                                </div>
                                            ) : (
                                                columns[columnKey].map((task, index) => (
                                                    <Draggable
                                                        key={task.id}
                                                        draggableId={task.id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`p-3 rounded-lg border bg-card transition-all cursor-grab active:cursor-grabbing ${snapshot.isDragging
                                                                    ? 'shadow-lg ring-2 ring-blue-500 rotate-2'
                                                                    : 'hover:border-zinc-400 dark:hover:border-zinc-600'
                                                                    } ${moving === task.id ? 'opacity-50' : ''}`}
                                                            >
                                                                <div className="flex items-start gap-2">
                                                                    <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="font-medium text-sm truncate">{task.title}</div>
                                                                        {task.job && (
                                                                            <div className="text-xs text-muted-foreground mt-1 truncate">
                                                                                {task.job.project?.name} / {task.job.name}
                                                                            </div>
                                                                        )}

                                                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                                            <Badge className={`${PRIORITY_COLORS[task.priority]} text-white text-xs`}>
                                                                                {task.priority}
                                                                            </Badge>

                                                                            {task.dueDate && (
                                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                                    <Calendar className="h-3 w-3" />
                                                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                                                </div>
                                                                            )}

                                                                            {task.comments.length > 0 && (
                                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                                    <MessageSquare className="h-3 w-3" />
                                                                                    {task.comments.length}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            )}
                                            {provided.placeholder}
                                        </CardContent>
                                    )}
                                </Droppable>
                            </Card>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
