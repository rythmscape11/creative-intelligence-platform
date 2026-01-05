'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';
import {
    Play,
    Pause,
    Clock,
    DollarSign,
    Calendar,
    BarChart3,
    Timer,
    StopCircle,
} from 'lucide-react';

interface TimeEntry {
    id: string;
    description?: string;
    startTime: string;
    endTime?: string;
    duration?: number;
    billable: boolean;
    hourlyRate?: number;
}

interface TimeStats {
    totalHours: number;
    billableHours: number;
    totalValue: number;
    entriesCount: number;
}

export default function TimeTrackerPage() {
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [stats, setStats] = useState<TimeStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isTracking, setIsTracking] = useState(false);
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [description, setDescription] = useState('');
    const [hourlyRate, setHourlyRate] = useState(75);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchEntries();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (isTracking) {
            timerRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTracking]);

    const STORAGE_KEY = 'aureon_time_entries';

    const fetchEntries = () => {
        setLoading(true);
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            let loadedEntries: TimeEntry[] = [];

            if (stored) {
                loadedEntries = JSON.parse(stored);
            } else {
                // Initialize with sample data
                loadedEntries = [
                    { id: '1', description: 'Client meeting - Project Alpha', startTime: '2024-12-07T09:00:00', endTime: '2024-12-07T10:30:00', duration: 90, billable: true, hourlyRate: 75 },
                    { id: '2', description: 'Campaign optimization', startTime: '2024-12-07T10:45:00', endTime: '2024-12-07T12:00:00', duration: 75, billable: true, hourlyRate: 75 },
                ];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedEntries));
            }

            setEntries(loadedEntries);

            // Calculate real stats from entries
            const totalMinutes = loadedEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
            const billableMinutes = loadedEntries.filter(e => e.billable).reduce((sum, e) => sum + (e.duration || 0), 0);
            const totalValue = loadedEntries
                .filter(e => e.billable && e.hourlyRate && e.duration)
                .reduce((sum, e) => sum + ((e.duration! / 60) * e.hourlyRate!), 0);

            setStats({
                totalHours: Number((totalMinutes / 60).toFixed(1)),
                billableHours: Number((billableMinutes / 60).toFixed(1)),
                totalValue: Number(totalValue.toFixed(2)),
                entriesCount: loadedEntries.length,
            });
        } catch (error) {
            console.error('Error loading time entries:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveEntries = (newEntries: TimeEntry[]) => {
        setEntries(newEntries);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));

        // Recalculate stats
        const totalMinutes = newEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
        const billableMinutes = newEntries.filter(e => e.billable).reduce((sum, e) => sum + (e.duration || 0), 0);
        const totalValue = newEntries
            .filter(e => e.billable && e.hourlyRate && e.duration)
            .reduce((sum, e) => sum + ((e.duration! / 60) * e.hourlyRate!), 0);

        setStats({
            totalHours: Number((totalMinutes / 60).toFixed(1)),
            billableHours: Number((billableMinutes / 60).toFixed(1)),
            totalValue: Number(totalValue.toFixed(2)),
            entriesCount: newEntries.length,
        });
    };

    const startTimer = () => {
        setIsTracking(true);
        setElapsedTime(0);
        // In real implementation, would call API to start entry
    };

    const stopTimer = () => {
        setIsTracking(false);
        // Save entry to localStorage
        const newEntry: TimeEntry = {
            id: Date.now().toString(),
            description: description || 'Untitled task',
            startTime: new Date(Date.now() - elapsedTime * 1000).toISOString(),
            endTime: new Date().toISOString(),
            duration: Math.round(elapsedTime / 60),
            billable: true,
            hourlyRate,
        };
        saveEntries([newEntry, ...entries]);
        setDescription('');
        setElapsedTime(0);
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    const formatTimeOfDay = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Time Tracker</h1>
                </div>
                <AgencyListSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Time Tracker
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Track billable hours and generate time reports
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            <Clock className="h-5 w-5 text-zinc-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats?.totalHours}h</div>
                            <div className="text-sm text-muted-foreground">Total Hours</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <Timer className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-emerald-600">{stats?.billableHours}h</div>
                            <div className="text-sm text-muted-foreground">Billable</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">${stats?.totalValue.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Value</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                            <BarChart3 className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats?.entriesCount}</div>
                            <div className="text-sm text-muted-foreground">Entries</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timer */}
            <Card className="border-2 border-zinc-200 dark:border-zinc-700">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        {/* Timer Display */}
                        <div className="text-center lg:text-left">
                            <div className={`text-5xl font-mono font-bold ${isTracking ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                {formatTime(elapsedTime)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {isTracking ? 'Tracking...' : 'Ready to start'}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full">
                            <Input
                                placeholder="What are you working on?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isTracking}
                                className="flex-1"
                            />
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                                    disabled={isTracking}
                                    className="w-20"
                                />
                                <span className="text-sm text-muted-foreground">/hr</span>
                            </div>
                        </div>

                        {/* Start/Stop Button */}
                        {isTracking ? (
                            <Button
                                size="lg"
                                variant="destructive"
                                className="gap-2 min-w-[120px]"
                                onClick={stopTimer}
                            >
                                <StopCircle className="h-5 w-5" />
                                Stop
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                className="gap-2 min-w-[120px] bg-emerald-600 hover:bg-emerald-700"
                                onClick={startTimer}
                            >
                                <Play className="h-5 w-5" />
                                Start
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Today's Entries */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Today&apos;s Entries
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {entries.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No time entries yet. Start tracking!
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {entries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${entry.billable ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                                        <div>
                                            <div className="font-medium">{entry.description}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {formatTimeOfDay(entry.startTime)}
                                                {entry.endTime && ` - ${formatTimeOfDay(entry.endTime)}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">
                                            {entry.duration ? formatDuration(entry.duration) : '--'}
                                        </div>
                                        {entry.billable && entry.hourlyRate && entry.duration && (
                                            <div className="text-sm text-emerald-600">
                                                ${((entry.duration / 60) * entry.hourlyRate).toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
