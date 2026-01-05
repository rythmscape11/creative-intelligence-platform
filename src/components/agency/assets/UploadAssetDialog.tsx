
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Loader2, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface Project {
    id: string;
    name: string;
    client: { name: string };
}

interface UploadAssetDialogProps {
    onSuccess?: () => void;
    defaultProjectId?: string;
}

export function UploadAssetDialog({ onSuccess, defaultProjectId }: UploadAssetDialogProps) {
    const [open, setOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [projectId, setProjectId] = useState(defaultProjectId || '');
    const { toast } = useToast();

    // Fetch projects on mount or open
    useEffect(() => {
        if (open && projects.length === 0) {
            setLoading(true);
            fetch('/api/agency/projects')
                .then(res => res.json())
                .then(data => {
                    if (data.projects) setProjects(data.projects);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [open, projects.length]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const determineType = (mime: string) => {
        if (mime.startsWith('image/')) return 'IMAGE';
        if (mime.startsWith('video/')) return 'VIDEO';
        if (mime.startsWith('audio/')) return 'AUDIO';
        if (mime === 'application/pdf') return 'DOCUMENT';
        return 'OTHER';
    };

    const handleUpload = async () => {
        if (!selectedFile || !projectId) {
            toast({ title: 'Error', description: 'Please select a file and a project', variant: 'destructive' });
            return;
        }

        setUploading(true);
        setProgress(10);

        try {
            // 1. Get Presigned URL
            const urlRes = await fetch('/api/agency/assets/upload-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: selectedFile.name,
                    contentType: selectedFile.type,
                    projectId,
                }),
            });

            if (!urlRes.ok) throw new Error('Failed to get upload URL');
            const { uploadUrl, publicUrl, key } = await urlRes.json();

            setProgress(30);

            // 2. Upload to S3
            // Note: In a real app we would use XMLHttpRequest to track progress, but fetch is simpler
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Disposition': 'inline' }, // Important for viewing
                body: selectedFile,
            });

            if (!uploadRes.ok) throw new Error('Failed to upload file to storage');

            setProgress(80);

            // 3. Create Asset Record
            const createRes = await fetch('/api/agency/assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    name: selectedFile.name,
                    type: determineType(selectedFile.type),
                    storagePath: key,
                    publicUrl,
                    mimeType: selectedFile.type,
                    size: selectedFile.size,
                }),
            });

            if (!createRes.ok) throw new Error('Failed to save asset record');

            setProgress(100);
            toast({ title: 'Success', description: 'Asset uploaded successfully' });
            setSelectedFile(null);
            setOpen(false);
            if (onSuccess) onSuccess();

        } catch (error) {
            console.error(error);
            toast({ title: 'Upload Failed', description: 'Something went wrong', variant: 'destructive' });
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Asset
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload New Asset</DialogTitle>
                    <DialogDescription>
                        Select a file and assign it to a client project.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Project Selector */}
                    <div className="grid gap-2">
                        <Label htmlFor="project">Project</Label>
                        <Select value={projectId} onValueChange={setProjectId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {loading ? (
                                    <div className="p-2 flex justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>
                                ) : (
                                    projects.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.client.name})</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* File Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="file">File</Label>
                        {!selectedFile ? (
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 border rounded-md">
                                <div className="flex items-center gap-2 truncate">
                                    <File className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {uploading && (
                        <div className="space-y-1">
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-muted-foreground text-center">Uploading... {progress}%</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>Cancel</Button>
                    <Button onClick={handleUpload} disabled={!selectedFile || !projectId || uploading}>
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
