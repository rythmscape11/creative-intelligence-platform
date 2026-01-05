/**
 * Custom Dashboard Builder Component
 * Drag-and-drop dashboard with customizable widgets
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    PieChart,
    LineChart,
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    Target,
    Calendar,
    Clock,
    Plus,
    X,
    GripVertical,
    Settings,
    Download,
    Maximize2,
} from 'lucide-react';

interface Widget {
    id: string;
    type: 'metric' | 'chart' | 'list' | 'progress';
    title: string;
    size: 'small' | 'medium' | 'large';
    data?: unknown;
}

const WIDGET_LIBRARY: Partial<Widget>[] = [
    { type: 'metric', title: 'Total Revenue', size: 'small' },
    { type: 'metric', title: 'Active Projects', size: 'small' },
    { type: 'metric', title: 'Team Utilization', size: 'small' },
    { type: 'chart', title: 'Revenue Trend', size: 'medium' },
    { type: 'chart', title: 'Task Completion', size: 'medium' },
    { type: 'list', title: 'Recent Activity', size: 'medium' },
    { type: 'progress', title: 'Project Progress', size: 'large' },
];

const DEMO_WIDGETS: Widget[] = [
    { id: '1', type: 'metric', title: 'Total Revenue', size: 'small' },
    { id: '2', type: 'metric', title: 'Active Projects', size: 'small' },
    { id: '3', type: 'metric', title: 'Tasks Completed', size: 'small' },
    { id: '4', type: 'metric', title: 'Team Utilization', size: 'small' },
    { id: '5', type: 'chart', title: 'Revenue Trend', size: 'medium' },
    { id: '6', type: 'chart', title: 'Task Completion Rate', size: 'medium' },
    { id: '7', type: 'list', title: 'Recent Activity', size: 'large' },
];

export function DashboardBuilder() {
    const [widgets, setWidgets] = useState<Widget[]>(DEMO_WIDGETS);
    const [editing, setEditing] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);

    const addWidget = (template: Partial<Widget>) => {
        const newWidget: Widget = {
            id: `widget_${Date.now()}`,
            type: template.type || 'metric',
            title: template.title || 'New Widget',
            size: template.size || 'small',
        };
        setWidgets([...widgets, newWidget]);
        setShowLibrary(false);
    };

    const removeWidget = (id: string) => {
        setWidgets(widgets.filter(w => w.id !== id));
    };

    const renderWidget = (widget: Widget) => {
        const baseClasses = widget.size === 'small' ? 'col-span-1' :
            widget.size === 'medium' ? 'col-span-2' : 'col-span-4';

        return (
            <Card key={widget.id} className={`${baseClasses} relative group`}>
                {editing && (
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <GripVertical className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeWidget(widget.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {widget.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {widget.type === 'metric' && (
                        <div>
                            <div className="text-2xl font-bold">
                                {widget.title.includes('Revenue') ? '$124,500' :
                                    widget.title.includes('Projects') ? '12' :
                                        widget.title.includes('Tasks') ? '156' :
                                            widget.title.includes('Utilization') ? '78%' : '—'}
                            </div>
                            <div className="flex items-center text-sm text-green-600 mt-1">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                +12.5%
                            </div>
                        </div>
                    )}
                    {widget.type === 'chart' && (
                        <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
                            <LineChart className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                    {widget.type === 'list' && (
                        <div className="space-y-2">
                            {['New task created', 'Project completed', 'Client feedback', 'Meeting scheduled'].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm py-1 border-b last:border-0">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                    {widget.type === 'progress' && (
                        <div className="space-y-3">
                            {['Website Redesign', 'Q1 Campaign', 'App Development'].map((project, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{project}</span>
                                        <span>{[65, 45, 80][i]}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 transition-all"
                                            style={{ width: `${[65, 45, 80][i]}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-indigo-500" />
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">Customize your analytics view</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={editing ? 'default' : 'outline'}
                        onClick={() => setEditing(!editing)}
                        className="gap-2"
                    >
                        <Settings className="h-4 w-4" />
                        {editing ? 'Done' : 'Customize'}
                    </Button>
                    {editing && (
                        <Button onClick={() => setShowLibrary(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Widget
                        </Button>
                    )}
                    <Button variant="outline">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-4 gap-4">
                {widgets.map(renderWidget)}
            </div>

            {/* Widget Library Modal */}
            {showLibrary && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Add Widget</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowLibrary(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-3">
                                {WIDGET_LIBRARY.map((widget, i) => (
                                    <button
                                        key={i}
                                        onClick={() => addWidget(widget)}
                                        className="p-4 border rounded-lg text-left hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors"
                                    >
                                        <div className="font-medium mb-1">{widget.title}</div>
                                        <Badge variant="secondary" className="text-xs">
                                            {widget.type} • {widget.size}
                                        </Badge>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default DashboardBuilder;
