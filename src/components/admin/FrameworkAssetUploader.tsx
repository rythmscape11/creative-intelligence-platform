'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2, FileIcon, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Asset {
    name: string;
    url: string;
    key: string;
    size?: number;
    type?: string;
}

interface FrameworkAssetUploaderProps {
    frameworkId?: string;
    assets: Asset[];
    onAssetsChange: (assets: Asset[]) => void;
}

export function FrameworkAssetUploader({
    frameworkId,
    assets,
    onAssetsChange,
}: FrameworkAssetUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = async (files: File[]) => {
        setUploading(true);
        setProgress(0);

        const newAssets: Asset[] = [];
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                // Get presigned upload URL
                const urlRes = await fetch('/api/admin/frameworks/upload-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: file.name,
                        contentType: file.type,
                        frameworkId,
                    }),
                });

                if (!urlRes.ok) {
                    throw new Error('Failed to get upload URL');
                }

                const { uploadUrl, publicUrl, key, filename } = await urlRes.json();

                setProgress(((i + 0.5) / totalFiles) * 100);

                // Upload file to S3
                const uploadRes = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': file.type,
                    },
                    body: file,
                });

                if (!uploadRes.ok) {
                    throw new Error('Failed to upload file');
                }

                newAssets.push({
                    name: filename,
                    url: publicUrl,
                    key,
                    size: file.size,
                    type: file.type,
                });

                setProgress(((i + 1) / totalFiles) * 100);
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
            }
        }

        onAssetsChange([...assets, ...newAssets]);
        setUploading(false);
        setProgress(0);
    };

    const removeAsset = (index: number) => {
        const updated = [...assets];
        updated.splice(index, 1);
        onAssetsChange(updated);
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                    }
          ${uploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
        `}
            >
                <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {uploading ? (
                    <div className="space-y-3">
                        <Loader2 className="w-10 h-10 mx-auto text-indigo-500 animate-spin" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Uploading files...</p>
                        <Progress value={progress} className="w-48 mx-auto h-2" />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Upload className="w-10 h-10 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                Click to upload
                            </span>{' '}
                            or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                            PDF, ZIP, Images, Documents (Max 100MB each)
                        </p>
                    </div>
                )}
            </div>

            {/* Uploaded Assets List */}
            {assets.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Uploaded Files ({assets.length})
                    </h4>
                    <div className="space-y-2">
                        {assets.map((asset, index) => (
                            <div
                                key={asset.key || index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <FileIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {asset.name}
                                        </p>
                                        {asset.size && (
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(asset.size)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <a
                                        href={asset.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                                        title="Preview"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => removeAsset(index)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
