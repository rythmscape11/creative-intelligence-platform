/**
 * Interactive Gantt Chart Component for Agency OS
 * Uses Frappe Gantt (open-source, FREE)
 * 
 * Features:
 * - Drag to reschedule tasks
 * - Task dependencies visualization
 * - Multiple view modes (Day, Week, Month)
 * - Progress tracking
 * - Click to view/edit task details
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Gantt from 'frappe-gantt';
import './gantt.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface GanttTask {
  id: string;
  name: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  progress: number; // 0-100
  dependencies?: string; // comma-separated task IDs
  custom_class?: string;
  // Extended properties
  assignee?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: string;
}

export interface InteractiveGanttProps {
  tasks: GanttTask[];
  projectName?: string;
  onTaskClick?: (task: GanttTask) => void;
  onTaskDateChange?: (task: GanttTask, start: Date, end: Date) => Promise<void>;
  onTaskProgressChange?: (task: GanttTask, progress: number) => Promise<void>;
  className?: string;
}

type ViewMode = 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month';

const VIEW_MODES: { label: string; value: ViewMode }[] = [
  { label: 'Day', value: 'Day' },
  { label: 'Week', value: 'Week' },
  { label: 'Month', value: 'Month' },
];

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'gantt-priority-low',
  MEDIUM: 'gantt-priority-medium',
  HIGH: 'gantt-priority-high',
  URGENT: 'gantt-priority-urgent',
};

export function InteractiveGantt({
  tasks,
  projectName = 'Project Timeline',
  onTaskClick,
  onTaskDateChange,
  onTaskProgressChange,
  className = '',
}: InteractiveGanttProps) {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<Gantt | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('Week');
  const [isLoading, setIsLoading] = useState(false);

  // Format tasks for Frappe Gantt
  const formatTasks = useCallback(() => {
    return tasks.map(task => ({
      ...task,
      custom_class: task.priority ? PRIORITY_COLORS[task.priority] : '',
    }));
  }, [tasks]);

  // Initialize Gantt chart
  useEffect(() => {
    console.log('[InteractiveGantt] Init - tasks.length:', tasks.length);
    console.log('[InteractiveGantt] Init - ganttRef.current:', !!ganttRef.current);

    if (!ganttRef.current || tasks.length === 0) {
      console.log('[InteractiveGantt] Skipping - no ref or no tasks');
      return;
    }

    // Clear previous instance
    if (ganttInstance.current) {
      ganttRef.current.innerHTML = '';
    }

    const formattedTasks = formatTasks();
    console.log('[InteractiveGantt] Formatted tasks sample:', formattedTasks.slice(0, 3));

    ganttInstance.current = new Gantt(ganttRef.current, formattedTasks, {
      view_mode: viewMode,
      date_format: 'YYYY-MM-DD',
      popup_trigger: 'click',
      custom_popup_html: (task: GanttTask) => {
        const priority = task.priority || 'MEDIUM';
        const priorityColor = {
          LOW: '#6b7280',
          MEDIUM: '#3b82f6',
          HIGH: '#f59e0b',
          URGENT: '#ef4444',
        }[priority];

        return `
          <div class="gantt-popup">
            <h5 class="gantt-popup-title">${task.name}</h5>
            <p class="gantt-popup-subtitle">
              ${new Date(task.start).toLocaleDateString()} - ${new Date(task.end).toLocaleDateString()}
            </p>
            <div class="gantt-popup-progress">
              <div class="gantt-popup-progress-bar" style="width: ${task.progress}%"></div>
            </div>
            <p class="gantt-popup-info">
              <span style="color: ${priorityColor}">● ${priority}</span>
              ${task.assignee ? ` • ${task.assignee}` : ''}
            </p>
          </div>
        `;
      },
      on_click: (task: GanttTask) => {
        if (onTaskClick) {
          onTaskClick(task);
        }
      },
      on_date_change: async (task: GanttTask, start: Date, end: Date) => {
        if (onTaskDateChange) {
          setIsLoading(true);
          try {
            await onTaskDateChange(task, start, end);
          } finally {
            setIsLoading(false);
          }
        }
      },
      on_progress_change: async (task: GanttTask, progress: number) => {
        if (onTaskProgressChange) {
          setIsLoading(true);
          try {
            await onTaskProgressChange(task, progress);
          } finally {
            setIsLoading(false);
          }
        }
      },
    });
  }, [tasks, viewMode, formatTasks, onTaskClick, onTaskDateChange, onTaskProgressChange]);

  // Change view mode
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (ganttInstance.current) {
      ganttInstance.current.change_view_mode(mode);
    }
  };

  // Scroll to today
  const scrollToToday = () => {
    if (ganttInstance.current) {
      ganttInstance.current.scroll_today();
    }
  };

  // Refresh chart
  const refresh = () => {
    if (ganttInstance.current && ganttRef.current) {
      ganttRef.current.innerHTML = '';
      ganttInstance.current = new Gantt(ganttRef.current, formatTasks(), {
        view_mode: viewMode,
      });
    }
  };

  // Export as SVG
  const exportSVG = () => {
    if (!ganttRef.current) return;
    const svg = ganttRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-')}-gantt.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (tasks.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Tasks to Display</h3>
          <p className="text-muted-foreground">
            Add tasks with start and end dates to see the Gantt chart.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              {projectName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {tasks.length} tasks • Drag bars to reschedule
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Buttons */}
            <div className="flex items-center border rounded-lg overflow-hidden">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => handleViewModeChange(mode.value)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === mode.value
                    ? 'bg-indigo-500 text-white'
                    : 'bg-background hover:bg-muted'
                    }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <Button variant="outline" size="sm" onClick={scrollToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={refresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={exportSVG}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-zinc-400" />
            <span className="text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Urgent</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        )}
        <div
          ref={ganttRef}
          className="gantt-container min-h-[400px]"
        />
      </CardContent>

      {/* Gantt Styles */}
      <style jsx global>{`
        .gantt-container {
          overflow-x: auto;
        }
        
        .gantt .bar-wrapper {
          cursor: pointer;
        }
        
        /* Bar Styles */
        .gantt .bar-wrapper .bar {
          transition: all 0.2s ease;
        }

        .gantt .bar-wrapper:hover .bar {
          filter: brightness(1.1);
          transform: scaleY(1.1);
        }

        .gantt .bar-label {
          fill: #1f2937 !important;
          font-weight: 500;
          pointer-events: none;
        }

        .dark .gantt .bar-label {
          fill: #f3f4f6 !important;
        }

        .gantt .bar-wrapper:hover .bar-label {
          fill: #000000 !important;
        }

        .dark .gantt .bar-wrapper:hover .bar-label {
          fill: #ffffff !important;
        }
        
        /* Priority Colors - Applied to bar-wrapper by custom_class */
        .gantt .bar-wrapper.gantt-priority-low .bar-progress {
          fill: #6b7280;
        }
        .gantt .bar-wrapper.gantt-priority-low .bar {
          fill: #9ca3af;
        }
        
        .gantt .bar-wrapper.gantt-priority-medium .bar-progress {
          fill: #3b82f6;
        }
        .gantt .bar-wrapper.gantt-priority-medium .bar {
          fill: #60a5fa;
        }
        
        .gantt .bar-wrapper.gantt-priority-high .bar-progress {
          fill: #f59e0b;
        }
        .gantt .bar-wrapper.gantt-priority-high .bar {
          fill: #fbbf24;
        }
        
        .gantt .bar-wrapper.gantt-priority-urgent .bar-progress {
          fill: #ef4444;
        }
        .gantt .bar-wrapper.gantt-priority-urgent .bar {
          fill: #f87171;
        }
        
        /* Popup Styles */
        .gantt-popup {
          padding: 12px;
          background: var(--background, white);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 200px;
        }
        
        .gantt-popup-title {
          font-weight: 600;
          font-size: 14px;
          margin: 0 0 4px 0;
        }
        
        .gantt-popup-subtitle {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 8px 0;
        }
        
        .gantt-popup-progress {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .gantt-popup-progress-bar {
          height: 100%;
          background: #6366f1;
          transition: width 0.3s ease;
        }
        
        .gantt-popup-info {
          font-size: 12px;
          margin: 0;
        }
        
        /* Dark mode adjustments */
        .dark .gantt .grid-header,
        .dark .gantt .grid-background {
          fill: #18181b;
        }
        
        .dark .gantt .row-line,
        .dark .gantt .tick {
          stroke: #27272a;
        }
        
        .dark .gantt .today-highlight {
          fill: rgba(99, 102, 241, 0.1);
        }
        
        .dark .gantt-popup {
          background: #18181b;
          border: 1px solid #27272a;
        }
      `}</style>
    </Card>
  );
}

export default InteractiveGantt;
