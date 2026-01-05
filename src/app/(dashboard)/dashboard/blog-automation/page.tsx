'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Play, Calendar, FileText, Image as ImageIcon, Save, Plus, X, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useToolAccess } from '@/hooks/use-tool-access';
import Link from 'next/link';

export default function BlogAutomationPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<any>(null);
    const [newTopic, setNewTopic] = useState('');

    const [isRunning, setIsRunning] = useState(false);
    const [lastRun, setLastRun] = useState<Date | null>(null);

    const { isLoading: accessLoading, isAdmin } = useToolAccess();

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/blog/config');
            const data = await res.json();
            setConfig(data);
            if (data.lastRunAt) setLastRun(new Date(data.lastRunAt));
        } catch (error) {
            toast.error('Failed to load configuration');
        } finally {
            setLoading(false);
        }
    };

    const saveConfig = async (updates: any) => {
        setSaving(true);
        try {
            const newConfig = { ...config, ...updates };
            // Optimistic update
            setConfig(newConfig);

            const res = await fetch('/api/admin/blog/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig),
            });

            if (!res.ok) throw new Error('Failed to save');

            const data = await res.json();
            setConfig(data);
            toast.success('Settings saved');
        } catch (error) {
            toast.error('Failed to save settings');
            // Revert on error (fetch again)
            fetchConfig();
        } finally {
            setSaving(false);
        }
    };

    const handleAddTopic = () => {
        if (!newTopic.trim()) return;
        if (config.topics.includes(newTopic.trim())) return;

        const updatedTopics = [...config.topics, newTopic.trim()];
        saveConfig({ topics: updatedTopics });
        setNewTopic('');
    };

    const handleRemoveTopic = (topicToRemove: string) => {
        const updatedTopics = config.topics.filter((t: string) => t !== topicToRemove);
        saveConfig({ topics: updatedTopics });
    };

    const handleManualRun = async () => {
        setIsRunning(true);

        try {
            const res = await fetch('/api/admin/blog/trigger', { method: 'POST' });
            const data = await res.json();

            if (data.status === 'Success') {
                toast.success('Blog post generated successfully!');
                // Refresh config to get new logs and last run time
                await fetchConfig();
            } else {
                const message = data.reason || data.error || 'Unknown error';
                toast.error(`Generation failed: ${message}`);
            }
        } catch (error) {
            toast.error('Failed to trigger generation');
        } finally {
            setIsRunning(false);
            // Refresh logs one last time to ensure we have the latest status
            fetchConfig();
        }
    };

    // Loading state
    if (loading || accessLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    // Admin-only access control
    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-b from-muted/50 to-background rounded-xl border border-border">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
                    <ShieldAlert className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Admin Access Required
                </h2>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                    The Auto-Blog Engine is an admin-only feature. Contact your administrator for access.
                </p>
                <Link href="/dashboard">
                    <Button variant="outline">Return to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Auto-Blog Engine</h1>
                    <p className="text-muted-foreground">
                        Fully automated content generation pipeline powered by GPT-4 and DALL-E 3.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-amber-500 border-amber-500">ADMIN ONLY</Badge>
                    <Badge variant={config?.isActive ? 'default' : 'secondary'}>
                        {config?.isActive ? 'Active' : 'Paused'}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Manage your content generation settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="auto-publish" className="flex flex-col space-y-1">
                                <span>Auto-Publish</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Automatically publish generated posts to the blog.
                                </span>
                            </Label>
                            <Switch
                                id="auto-publish"
                                checked={config?.isActive || false}
                                onCheckedChange={(checked) => saveConfig({ isActive: checked })}
                                disabled={saving}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Frequency</Label>
                            <Select
                                value={config?.frequency || 'DAILY'}
                                onValueChange={(val) => saveConfig({ frequency: val })}
                                disabled={saving}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DAILY">Daily</SelectItem>
                                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                                    <SelectItem value="BIWEEKLY">Bi-Weekly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="word-count">Target Word Count</Label>
                            <Input
                                id="word-count"
                                type="number"
                                value={config?.wordCount || 2000}
                                onChange={(e) => setConfig({ ...config, wordCount: parseInt(e.target.value) })}
                                onBlur={() => saveConfig({ wordCount: config.wordCount })}
                                disabled={saving}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Niche / Topics</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {config?.topics?.map((topic: string) => (
                                    <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                                        {topic}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={() => handleRemoveTopic(topic)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a topic..."
                                    value={newTopic}
                                    onChange={(e) => setNewTopic(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                                />
                                <Button size="icon" variant="outline" onClick={handleAddTopic}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleManualRun}
                            disabled={isRunning}
                        >
                            {isRunning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Content...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Trigger Manual Run
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Activity Log</CardTitle>
                        <CardDescription>Real-time updates from the generation engine.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Last Run:</span>
                                <span className="font-medium">
                                    {lastRun ? lastRun.toLocaleString() : 'Never'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Next Scheduled:</span>
                                <span className="font-medium">
                                    {config?.nextRunAt ? new Date(config.nextRunAt).toLocaleString() : 'Not scheduled'}
                                </span>
                            </div>

                            <div className="h-[200px] w-full rounded-md border bg-muted/50 p-4 overflow-y-auto font-mono text-xs">
                                {config?.logs?.length > 0 ? (
                                    config.logs.map((log: any) => (
                                        <div key={log.id} className="mb-1">
                                            <span className="text-muted-foreground">[{new Date(log.createdAt).toLocaleTimeString()}]</span> {log.message}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground">No activity logs yet.</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Trending Topics</CardTitle>
                        <CardDescription>Recently generated blog posts and their categories.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {config?.recentPosts?.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {config.recentPosts.map((post: any) => (
                                        <div key={post.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline">{post.category?.name || 'Uncategorized'}</Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline line-clamp-2">
                                                {post.title}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No posts generated yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
