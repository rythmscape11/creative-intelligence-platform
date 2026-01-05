/**
 * Gantt Chart Page for Agency OS
 * Interactive timeline view for project tasks
 */

'use client';

import { useState, useEffect } from 'react';
import { InteractiveGantt, type GanttTask } from '@/components/agency/InteractiveGantt';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Project {
    id: string;
    name: string;
    client: { name: string };
}

interface Task {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string | null;
    estimatedHours: number | null;
    job: { title: string; project: { name: string; id: string } };
}

export default function GanttPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('all');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
        fetchTasks();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/agency/projects');
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/agency/tasks');
            const data = await res.json();
            console.log('[Gantt] Raw API response:', data);
            // Handle both { tasks: [...] } and flat array responses
            const taskList = Array.isArray(data) ? data : (data.tasks || []);
            console.log('[Gantt] Extracted tasks:', taskList.length, 'tasks');
            setTasks(taskList);
        } catch (error) {
            console.error('[Gantt] Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Convert tasks to Gantt format
    const ganttTasks: GanttTask[] = tasks
        .filter(task => {
            // Filter by project if selected
            if (selectedProject !== 'all' && task.job?.project?.id !== selectedProject) {
                return false;
            }
            return true;
        })
        .map(task => {
            // Calculate dates
            const endDate = task.dueDate ? new Date(task.dueDate) : new Date();
            const duration = task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : 3; // days
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - duration);

            // Calculate progress based on status
            const progress = {
                'TODO': 0,
                'IN_PROGRESS': 40,
                'REVIEW': 80,
                'DONE': 100,
            }[task.status] || 0;

            return {
                id: task.id,
                name: task.title,
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0],
                progress,
                priority: task.priority as GanttTask['priority'],
                status: task.status,
            };
        });

    // Debug: Log mapped tasks
    console.log('[Gantt] Mapped ganttTasks:', ganttTasks.length, 'Sample:', ganttTasks[0]);

    const handleTaskClick = (task: GanttTask) => {
        toast.success(`Viewing: ${task.name}`);
        // Could open a modal or navigate to task details
    };

    const handleDateChange = async (task: GanttTask, start: Date, end: Date) => {
        try {
            await fetch(`/api/agency/tasks/${task.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dueDate: end.toISOString(),
                }),
            });
            toast.success('Task dates updated');
            fetchTasks();
        } catch (error) {
            toast.error('Failed to update dates');
        }
    };

    const handleProgressChange = async (task: GanttTask, progress: number) => {
        // Map progress to status
        let status = 'TODO';
        if (progress >= 100) status = 'DONE';
        else if (progress >= 70) status = 'REVIEW';
        else if (progress > 0) status = 'IN_PROGRESS';

        try {
            await fetch(`/api/agency/tasks/${task.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            toast.success(`Status updated to ${status.replace('_', ' ')}`);
            fetchTasks();
        } catch (error) {
            toast.error('Failed to update progress');
        }
    };

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
                        <h1 className="text-2xl font-bold tracking-tight">Gantt Chart</h1>
                        <p className="text-muted-foreground">
                            Drag tasks to reschedule • Click for details
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {projects.map(project => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.client?.name} - {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Gantt Chart */}
            {loading ? (
                <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
                </div>
            ) : (
                <InteractiveGantt
                    tasks={ganttTasks}
                    projectName={
                        selectedProject === 'all'
                            ? 'All Projects'
                            : projects.find(p => p.id === selectedProject)?.name || 'Project'
                    }
                    onTaskClick={handleTaskClick}
                    onTaskDateChange={handleDateChange}
                    onTaskProgressChange={handleProgressChange}
                />
            )}
        </div>
    );
}
