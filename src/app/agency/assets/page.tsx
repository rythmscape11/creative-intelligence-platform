/**
 * Enhanced Asset Management Page
 * Digital Asset Management with preview, versioning, and organization
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    FolderOpen,
    Upload,
    Search,
    Grid3X3,
    List,
    Image,
    FileText,
    Video,
    Music,
    File,
    Download,
    Trash2,
    Eye,
    Share2,
    Plus,
    Filter,
    SortAsc,
    MoreHorizontal,
    X,
    Check,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Asset {
    id: string;
    name: string;
    type: 'image' | 'video' | 'document' | 'audio' | 'other';
    size: number;
    mimeType: string;
    url: string;
    thumbnail?: string;
    folder?: string;
    tags: string[];
    uploadedBy: string;
    uploadedAt: Date;
    versions?: { version: number; url: string; uploadedAt: Date }[];
}

const DEMO_ASSETS: Asset[] = [
    {
        id: '1',
        name: 'Brand Logo.png',
        type: 'image',
        size: 245000,
        mimeType: 'image/png',
        url: '/placeholder-logo.png',
        folder: 'Brand Kit',
        tags: ['logo', 'brand'],
        uploadedBy: 'Alex',
        uploadedAt: new Date('2025-12-01'),
    },
    {
        id: '2',
        name: 'Product Demo.mp4',
        type: 'video',
        size: 52000000,
        mimeType: 'video/mp4',
        url: '/demo.mp4',
        folder: 'Videos',
        tags: ['demo', 'product'],
        uploadedBy: 'Sarah',
        uploadedAt: new Date('2025-12-05'),
    },
    {
        id: '3',
        name: 'Q1 Report.pdf',
        type: 'document',
        size: 1200000,
        mimeType: 'application/pdf',
        url: '/report.pdf',
        folder: 'Reports',
        tags: ['report', 'Q1'],
        uploadedBy: 'Mike',
        uploadedAt: new Date('2025-12-07'),
    },
    {
        id: '4',
        name: 'Social Banner.jpg',
        type: 'image',
        size: 890000,
        mimeType: 'image/jpeg',
        url: '/banner.jpg',
        folder: 'Social Media',
        tags: ['social', 'banner'],
        uploadedBy: 'Emma',
        uploadedAt: new Date('2025-12-08'),
    },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
    image: <Image className="h-5 w-5 text-emerald-500" />,
    video: <Video className="h-5 w-5 text-purple-500" />,
    document: <FileText className="h-5 w-5 text-blue-500" />,
    audio: <Music className="h-5 w-5 text-amber-500" />,
    other: <File className="h-5 w-5 text-zinc-500" />,
};

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>(DEMO_ASSETS);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const folders = [...new Set(assets.map(a => a.folder).filter(Boolean))];

    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFolder = !selectedFolder || asset.folder === selectedFolder;
        return matchesSearch && matchesFolder;
    });

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        // Simulate upload
        for (const file of Array.from(files)) {
            const type = file.type.startsWith('image/') ? 'image' :
                file.type.startsWith('video/') ? 'video' :
                    file.type.startsWith('audio/') ? 'audio' :
                        file.type.includes('pdf') || file.type.includes('document') ? 'document' : 'other';

            const newAsset: Asset = {
                id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                type,
                size: file.size,
                mimeType: file.type,
                url: URL.createObjectURL(file),
                folder: 'Uploads',
                tags: [],
                uploadedBy: 'You',
                uploadedAt: new Date(),
            };

            setAssets(prev => [newAsset, ...prev]);
        }

        setUploading(false);
        toast.success(`${files.length} file(s) uploaded`);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const deleteAsset = (id: string) => {
        setAssets(assets.filter(a => a.id !== id));
        if (selectedAsset?.id === id) setSelectedAsset(null);
        toast.success('Asset deleted');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FolderOpen className="h-6 w-6 text-blue-500" />
                        Asset Library
                    </h1>
                    <p className="text-muted-foreground">
                        {assets.length} assets • {formatSize(assets.reduce((s, a) => s + a.size, 0))} total
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleUpload}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search assets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedFolder || ''}
                        onChange={(e) => setSelectedFolder(e.target.value || null)}
                        className="px-3 py-2 border rounded-md bg-background text-sm"
                    >
                        <option value="">All Folders</option>
                        {folders.map(folder => (
                            <option key={folder} value={folder}>{folder}</option>
                        ))}
                    </select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                        {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Assets Grid/List */}
            <div className={viewMode === 'grid'
                ? 'grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                : 'space-y-2'
            }>
                {filteredAssets.map(asset => (
                    <Card
                        key={asset.id}
                        className={`cursor-pointer transition-all hover:border-blue-500/50 ${selectedAsset?.id === asset.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                        onClick={() => setSelectedAsset(asset)}
                    >
                        <CardContent className={viewMode === 'grid' ? 'p-3' : 'p-4 flex items-center gap-4'}>
                            {/* Thumbnail/Icon */}
                            <div className={`${viewMode === 'grid' ? 'aspect-square mb-3' : 'w-12 h-12'} 
                bg-muted rounded-lg flex items-center justify-center overflow-hidden`}
                            >
                                {asset.type === 'image' ? (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                        <Image className="h-8 w-8 text-emerald-500" />
                                    </div>
                                ) : (
                                    TYPE_ICONS[asset.type]
                                )}
                            </div>

                            {/* Info */}
                            <div className={viewMode === 'grid' ? '' : 'flex-1 min-w-0'}>
                                <div className="font-medium truncate text-sm">{asset.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {formatSize(asset.size)}
                                    {viewMode === 'list' && ` • ${asset.folder || 'Uncategorized'}`}
                                </div>
                            </div>

                            {/* Actions (list view) */}
                            {viewMode === 'list' && (
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteAsset(asset.id);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Preview Modal */}
            {selectedAsset && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {TYPE_ICONS[selectedAsset.type]}
                                <div>
                                    <h2 className="font-semibold">{selectedAsset.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {formatSize(selectedAsset.size)} • {selectedAsset.mimeType}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedAsset(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                                {TYPE_ICONS[selectedAsset.type]}
                                <span className="ml-2 text-muted-foreground">Preview</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedAsset.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button className="gap-2">
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <Share2 className="h-4 w-4" />
                                    Share
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 text-red-500 hover:text-red-600"
                                    onClick={() => deleteAsset(selectedAsset.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
