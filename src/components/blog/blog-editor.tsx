'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Eye, 
  Calendar, 
  Tag, 
  Folder,
  Image,
  Settings,
  X
} from 'lucide-react';

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

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: BlogPost) => Promise<void>;
  onCancel: () => void;
}

export function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categoryId: '',
    tagIds: [],
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: '',
    publishedAt: '',
    ...post,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSeoSettings, setShowSeoSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    if (post?.tagIds) {
      const postTags = tags.filter(tag => post.tagIds.includes(tag.id));
      setSelectedTags(postTags);
    }
  }, [post?.tagIds, tags]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/blog/tags');
      const data = await response.json();
      if (data.success) {
        setTags(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleInputChange = (field: keyof BlogPost, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      const newSelectedTags = selectedTags.filter(t => t.id !== tag.id);
      setSelectedTags(newSelectedTags);
      setFormData(prev => ({
        ...prev,
        tagIds: newSelectedTags.map(t => t.id),
      }));
    } else {
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);
      setFormData(prev => ({
        ...prev,
        tagIds: newSelectedTags.map(t => t.id),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim() || !formData.categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      toast({
        title: 'Success',
        description: `Blog post ${post ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save blog post',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateExcerpt = () => {
    if (formData.content) {
      const plainText = formData.content.replace(/<[^>]*>/g, '');
      const excerpt = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
      handleInputChange('excerpt', excerpt);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter blog post title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your blog post content here..."
                    rows={15}
                    required
                  />
                  <p className="text-sm text-gray-700 mt-1">
                    You can use HTML tags for formatting
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateExcerpt}
                    >
                      Auto-generate
                    </Button>
                  </div>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief description of the blog post"
                    rows={3}
                    maxLength={500}
                    required
                  />
                  <p className="text-sm text-gray-700 mt-1">
                    {formData.excerpt.length}/500 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>SEO Settings</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSeoSettings(!showSeoSettings)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              {showSeoSettings && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                      placeholder="SEO optimized title (max 60 characters)"
                      maxLength={60}
                    />
                    <p className="text-sm text-gray-700 mt-1">
                      {(formData.seoTitle || '').length}/60 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                      placeholder="SEO meta description (max 160 characters)"
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-sm text-gray-700 mt-1">
                      {(formData.seoDescription || '').length}/160 characters
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.status === 'SCHEDULED' && (
                  <div>
                    <Label htmlFor="publishedAt">Publish Date</Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) => handleInputChange('publishedAt', e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleInputChange('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag.name}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.some(t => t.id === tag.id);
                      return (
                        <div
                          key={tag.id}
                          className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${
                            isSelected ? 'bg-amber-50 text-amber-700' : ''
                          }`}
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
