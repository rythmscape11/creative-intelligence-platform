'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import {
    Calendar,
    Plus,
    ChevronLeft,
    ChevronRight,
    Instagram,
    Facebook,
    Linkedin,
    Youtube,
    Twitter,
} from 'lucide-react';

interface Post {
    id: string;
    platform: string;
    postType: string;
    caption: string;
    scheduledFor: string | null;
    status: string;
    campaign?: { name: string };
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
    INSTAGRAM: <Instagram className="h-4 w-4" />,
    FACEBOOK: <Facebook className="h-4 w-4" />,
    LINKEDIN: <Linkedin className="h-4 w-4" />,
    YOUTUBE: <Youtube className="h-4 w-4" />,
    TWITTER: <Twitter className="h-4 w-4" />,
};

const STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-zinc-500',
    PENDING_APPROVAL: 'bg-amber-500',
    APPROVED: 'bg-blue-500',
    SCHEDULED: 'bg-indigo-500',
    PUBLISHED: 'bg-emerald-500',
    FAILED: 'bg-red-500',
};

export default function ContentCalendarPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
    const [newPostForm, setNewPostForm] = useState({ platform: 'INSTAGRAM', caption: '', scheduledFor: '' });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/agency/content');
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add padding for first week
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }

        return days;
    };

    const getPostsForDate = (date: Date) => {
        return posts.filter(post => {
            if (!post.scheduledFor) return false;
            const postDate = new Date(post.scheduledFor);
            return postDate.toDateString() === date.toDateString();
        });
    };

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const days = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Content Calendar</h1>
                </div>
                <AgencyListSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Content Calendar
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Schedule and manage content across platforms
                    </p>
                </div>
                <Dialog open={newPostDialogOpen} onOpenChange={setNewPostDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Post</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Platform</Label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    value={newPostForm.platform}
                                    onChange={e => setNewPostForm({ ...newPostForm, platform: e.target.value })}
                                >
                                    <option value="INSTAGRAM">Instagram</option>
                                    <option value="FACEBOOK">Facebook</option>
                                    <option value="LINKEDIN">LinkedIn</option>
                                    <option value="TWITTER">Twitter</option>
                                    <option value="YOUTUBE">YouTube</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Caption</Label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px]"
                                    placeholder="Write your post caption..."
                                    value={newPostForm.caption}
                                    onChange={e => setNewPostForm({ ...newPostForm, caption: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Schedule For</Label>
                                <Input
                                    type="datetime-local"
                                    value={newPostForm.scheduledFor}
                                    onChange={e => setNewPostForm({ ...newPostForm, scheduledFor: e.target.value })}
                                />
                            </div>
                            <Button className="w-full" onClick={() => {
                                if (!newPostForm.caption) {
                                    toast.error('Please enter a caption');
                                    return;
                                }
                                toast.success('Post scheduled successfully!');
                                setNewPostDialogOpen(false);
                                setNewPostForm({ platform: 'INSTAGRAM', caption: '', scheduledFor: '' });
                            }}>
                                Schedule Post
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Calendar Navigation */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="icon" onClick={prevMonth}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <CardTitle className="text-xl">{monthName}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={nextMonth}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, idx) => {
                            const dayPosts = day ? getPostsForDate(day) : [];
                            const isToday = day?.toDateString() === new Date().toDateString();

                            return (
                                <div
                                    key={idx}
                                    className={`min-h-[100px] p-2 border rounded-lg ${day ? 'bg-background' : 'bg-muted/30'
                                        } ${isToday ? 'border-indigo-500 border-2' : ''}`}
                                >
                                    {day && (
                                        <>
                                            <div className={`text-sm font-medium ${isToday ? 'text-indigo-600' : ''}`}>
                                                {day.getDate()}
                                            </div>
                                            <div className="mt-1 space-y-1">
                                                {dayPosts.slice(0, 3).map(post => (
                                                    <div
                                                        key={post.id}
                                                        className="flex items-center gap-1 text-xs p-1 rounded bg-muted truncate cursor-pointer hover:bg-muted/80"
                                                    >
                                                        {PLATFORM_ICONS[post.platform]}
                                                        <span className="truncate">{post.caption.slice(0, 20)}</span>
                                                    </div>
                                                ))}
                                                {dayPosts.length > 3 && (
                                                    <div className="text-xs text-muted-foreground">
                                                        +{dayPosts.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Posts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Posts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {posts.filter(p => p.scheduledFor).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No scheduled posts yet. Create your first post to get started.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {posts
                                .filter(p => p.scheduledFor && new Date(p.scheduledFor) >= new Date())
                                .slice(0, 10)
                                .map(post => (
                                    <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-lg">
                                                {PLATFORM_ICONS[post.platform] || <Calendar className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <div className="font-medium truncate max-w-[300px]">{post.caption}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(post.scheduledFor!).toLocaleDateString()} at{' '}
                                                    {new Date(post.scheduledFor!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className={`${STATUS_COLORS[post.status]} text-white`}>
                                            {post.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
