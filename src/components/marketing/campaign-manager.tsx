'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toaster';
import { Mail, Send, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Audience {
    id: string;
    name: string;
    memberCount: number;
}

export function CampaignManager() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [audiences, setAudiences] = useState<Audience[]>([]);

    const [formData, setFormData] = useState({
        subject: '',
        previewText: '',
        audienceId: '',
        content: '', // In a real app, this would be a rich text editor
    });

    useEffect(() => {
        fetchAudiences();
    }, []);

    const fetchAudiences = async () => {
        try {
            setLoading(true);
            // Fetch audiences from our integration API
            // For now, we'll mock it or try to get it from the integration test endpoint
            const response = await fetch('/api/integrations?type=MAILCHIMP');
            const data = await response.json();

            if (data.success && data.integrations.length > 0) {
                const integration = data.integrations[0];
                // We can use the test endpoint to get audiences
                const testRes = await fetch('/api/integrations/mailchimp/test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        apiKey: 'dummy', // The backend handles this if integrationId is provided
                        serverPrefix: 'dummy',
                        integrationId: integration.id
                    })
                });
                const testData = await testRes.json();

                if (testData.success && testData.audiences) {
                    setAudiences(testData.audiences.map((a: any) => ({
                        id: a.id,
                        name: a.name,
                        memberCount: a.stats?.member_count || 0
                    })));

                    // Set default audience if available
                    if (integration.settings?.defaultAudienceId) {
                        setFormData(prev => ({ ...prev, audienceId: integration.settings.defaultAudienceId }));
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch audiences:', error);
            toast({
                type: 'error',
                title: 'Error',
                description: 'Failed to load audiences',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.subject || !formData.content || !formData.audienceId) {
            toast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please fill in all required fields',
            });
            return;
        }

        try {
            setSending(true);
            const response = await fetch('/api/marketing/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    type: 'success',
                    title: 'Campaign Sent',
                    description: 'Your email campaign has been scheduled successfully.',
                });
                router.push('/dashboard/marketing');
            } else {
                throw new Error(data.error || 'Failed to send campaign');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to send campaign';
            toast({
                type: 'error',
                title: 'Send Failed',
                description: message,
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/dashboard/marketing"
                    className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Marketing
                </Link>
                <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
                    <Mail className="h-8 w-8 text-amber-500" />
                    Create Campaign
                </h1>
                <p className="text-text-secondary mt-2">
                    Design and send a new email campaign to your subscribers
                </p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject Line <span className="text-red-500">*</span></Label>
                                <Input
                                    id="subject"
                                    placeholder="e.g., Big News: Our Summer Sale Starts Now!"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="audience">Audience <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.audienceId}
                                    onValueChange={(value) => setFormData({ ...formData, audienceId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an audience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {audiences.map((audience) => (
                                            <SelectItem key={audience.id} value={audience.id}>
                                                {audience.name} ({audience.memberCount} members)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="previewText">Preview Text</Label>
                            <Input
                                id="previewText"
                                placeholder="A short summary that appears in the inbox..."
                                value={formData.previewText}
                                onChange={(e) => setFormData({ ...formData, previewText: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Email Content <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="content"
                                placeholder="Write your email content here (HTML supported)..."
                                className="min-h-[300px] font-mono text-sm"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                            <p className="text-xs text-text-secondary">
                                Tip: You can use basic HTML tags for formatting.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
                            <Button variant="outline" type="button" asChild>
                                <Link href="/dashboard/marketing">Cancel</Link>
                            </Button>
                            <Button
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                                disabled={sending || loading}
                            >
                                {sending ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Campaign
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
