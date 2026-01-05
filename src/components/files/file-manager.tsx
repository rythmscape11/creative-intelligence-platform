'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  Trash2, 
  File, 
  Image, 
  FileText, 
  FileSpreadsheet,
  Loader2,
  Cloud,
  HardDrive
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileItem {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  category: string;
  description?: string;
  createdAt: string;
}

interface StorageUsage {
  totalSize: number;
  fileCount: number;
  s3TotalSize: number;
  s3FileCount: number;
}

interface FileManagerProps {
  category?: 'avatar' | 'logo' | 'document' | 'image' | 'temp';
  allowedTypes?: string[];
  maxFileSize?: number;
  onFileSelect?: (file: FileItem) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (contentType: string) => {
  if (contentType.startsWith('image/')) return Image;
  if (contentType.includes('spreadsheet') || contentType.includes('excel')) return FileSpreadsheet;
  if (contentType.includes('text') || contentType.includes('document')) return FileText;
  return File;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'avatar': return 'bg-amber-100 text-amber-800';
    case 'logo': return 'bg-purple-100 text-purple-800';
    case 'document': return 'bg-green-100 text-green-800';
    case 'image': return 'bg-yellow-100 text-yellow-800';
    case 'temp': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function FileManager({ 
  category = 'document', 
  allowedTypes = ['image/*', 'application/pdf', 'text/*'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  onFileSelect 
}: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.size > maxFileSize) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds the maximum size of ${formatFileSize(maxFileSize)}`,
          variant: 'destructive',
        });
        continue;
      }

      await uploadFile(file);
    }
  }, [maxFileSize, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxFileSize,
  });

  const uploadFile = async (file: File) => {
    const fileId = Math.random().toString(36).substring(2, 15);
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: Math.min(prev[fileId] + 10, 90)
        }));
      }, 200);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (data.success) {
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        
        const newFile: FileItem = {
          id: data.data.id,
          filename: data.data.filename,
          contentType: data.data.contentType,
          size: data.data.size,
          category: data.data.category,
          createdAt: data.data.uploadedAt,
        };

        setFiles(prev => [newFile, ...prev]);
        
        toast({
          title: 'Upload successful',
          description: `${file.name} has been uploaded successfully.`,
        });

        // Remove progress after delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const { [fileId]: _, ...rest } = prev;
            return rest;
          });
        }, 2000);

        // Refresh storage usage
        await fetchStorageUsage();
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      setUploadProgress(prev => {
        const { [fileId]: _, ...rest } = prev;
        return rest;
      });

      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
    }
  };

  const downloadFile = async (fileId: string, filename: string) => {
    try {
      const response = await fetch(`/api/files/download/${fileId}`);
      const data = await response.json();

      if (data.success) {
        window.open(data.data.downloadUrl, '_blank');
        
        toast({
          title: 'Download started',
          description: `${filename} download has started.`,
        });
      } else {
        throw new Error(data.message || 'Download failed');
      }
    } catch (error) {
      toast({
        title: 'Download failed',
        description: error instanceof Error ? error.message : 'Failed to download file',
        variant: 'destructive',
      });
    }
  };

  const deleteFile = async (fileId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setFiles(prev => prev.filter(file => file.id !== fileId));
        
        toast({
          title: 'File deleted',
          description: `${filename} has been deleted successfully.`,
        });

        // Refresh storage usage
        await fetchStorageUsage();
      } else {
        throw new Error(data.message || 'Delete failed');
      }
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/files/list?category=${category}`);
      const data = await response.json();

      if (data.success) {
        setFiles(data.data.files);
      } else {
        throw new Error(data.message || 'Failed to fetch files');
      }
    } catch (error) {
      toast({
        title: 'Failed to load files',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStorageUsage = async () => {
    try {
      const response = await fetch('/api/files/storage/usage');
      const data = await response.json();

      if (data.success) {
        setStorageUsage(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch storage usage:', error);
    }
  };

  React.useEffect(() => {
    fetchFiles();
    fetchStorageUsage();
  }, [category]);

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      {storageUsage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5" />
              <span>Storage Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Cloud className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Cloud Storage</span>
                </div>
                <div className="text-2xl font-bold">{formatFileSize(storageUsage.s3TotalSize)}</div>
                <div className="text-sm text-gray-700">{storageUsage.s3FileCount} files</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <div className="text-2xl font-bold">{formatFileSize(storageUsage.totalSize)}</div>
                <div className="text-sm text-gray-700">{storageUsage.fileCount} records</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Drag and drop files here or click to browse. Max size: {formatFileSize(maxFileSize)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-amber-500 bg-amber-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-700 mb-4" />
            {isDragActive ? (
              <p className="text-amber-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-gray-700">
                  Supported: {allowedTypes.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {Object.entries(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File List */}
      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
          <CardDescription>
            Manage your uploaded files
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading files...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-700">
              No files uploaded yet
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.contentType);
                
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <FileIcon className="h-8 w-8 text-gray-700" />
                      <div>
                        <div className="font-medium">{file.filename}</div>
                        <div className="text-sm text-gray-700">
                          {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={getCategoryColor(file.category)}>
                        {file.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {onFileSelect && (
                        <Button
                          onClick={() => onFileSelect(file)}
                          size="sm"
                          variant="outline"
                        >
                          Select
                        </Button>
                      )}
                      <Button
                        onClick={() => downloadFile(file.id, file.filename)}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteFile(file.id, file.filename)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
