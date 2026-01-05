'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogList } from './blog-list';
import { BlogEditor } from './blog-editor';
import { CategoryManager } from './category-manager';
import { BlogAnalyticsDashboard } from './blog-analytics-dashboard';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Folder,
  Tag,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  categoryId: string;
  tagIds: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
}

type ViewMode = 'list' | 'create' | 'edit';

export function BlogManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
  const [activeTab, setActiveTab] = useState('posts');
  const { toast } = useToast();

  const handleCreatePost = () => {
    setEditingPost(undefined);
    setViewMode('create');
  };

  const handleEditPost = (post: any) => {
    setEditingPost({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      categoryId: post.category.id,
      tagIds: post.tags.map((tag: any) => tag.id),
      status: post.status,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      publishedAt: post.publishedAt,
    });
    setViewMode('edit');
  };

  const handleSavePost = async (postData: BlogPost) => {
    try {
      const url = postData.id ? `/api/blog/posts/${postData.id}` : '/api/blog/posts';
      const method = postData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to save blog post');
      }

      setViewMode('list');
      setEditingPost(undefined);
    } catch (error) {
      throw error; // Re-throw to let BlogEditor handle the error display
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setEditingPost(undefined);
  };

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog Management
          </Button>
        </div>
        
        <BlogEditor
          post={editingPost}
          onSave={handleSavePost}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog Management</h1>
        <p className="text-gray-600">
          Create, edit, and manage your blog content, categories, and tags
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Posts</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <Folder className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Tags</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <BlogList
            onCreatePost={handleCreatePost}
            onEditPost={handleEditPost}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="tags" className="space-y-6">
          <TagManager />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <BlogAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Tag Manager Component (simplified version)
function TagManager() {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/blog/tags');
      const data = await response.json();
      if (data.success) {
        setTags(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tags</h2>
          <p className="text-gray-600">Manage blog post tags</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tag Management</CardTitle>
          <CardDescription>
            Tag management functionality will be implemented here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Tags: {tags.length} total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


