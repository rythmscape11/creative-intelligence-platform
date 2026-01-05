'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from './rich-text-editor';
import { generateSlug } from '@/lib/validations/blog';
import { validateImageUrl, getPlaceholderImage } from './blog-image';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPostEditorProps {
  postId?: string;
  initialData?: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string | null;
    categoryId: string;
    tagIds: string[];
    status: string;
    seoTitle: string | null;
    seoDescription: string | null;
    publishedAt: string | null;
  };
}

export function BlogPostEditor({ postId, initialData }: BlogPostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [imageValidating, setImageValidating] = useState(false);
  const [imageValid, setImageValid] = useState<boolean | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    featuredImage: initialData?.featuredImage || '',
    categoryId: initialData?.categoryId || '',
    tagIds: initialData?.tagIds || [],
    status: initialData?.status || 'DRAFT',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    publishedAt: initialData?.publishedAt || '',
    sendNewsletter: false, // New field for newsletter toggle
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!postId && formData.title && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title, postId]);

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/blog/categories'),
          fetch('/api/blog/tags'),
        ]);

        const categoriesData = await categoriesRes.json();
        const tagsData = await tagsRes.json();

        if (categoriesData.success) setCategories(categoriesData.data);
        if (tagsData.success) setTags(tagsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load categories and tags');
      }
    };

    fetchData();
  }, []);

  // Validate image URL when it changes
  useEffect(() => {
    const validateImage = async () => {
      if (!formData.featuredImage) {
        setImageValid(null);
        return;
      }

      setImageValidating(true);
      const isValid = await validateImageUrl(formData.featuredImage);
      setImageValid(isValid);
      setImageValidating(false);
    };

    const debounce = setTimeout(validateImage, 500);
    return () => clearTimeout(debounce);
  }, [formData.featuredImage]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!postId) return; // Only autosave for existing posts

    const timer = setInterval(() => {
      handleAutoSave();
    }, 30000); // 30 seconds

    return () => clearInterval(timer);
  }, [postId, formData]);

  const handleAutoSave = async () => {
    if (!postId) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/blog/posts/${postId}/autosave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!data.success) {
        console.error('Autosave failed:', data.error);
      }
    } catch (error) {
      console.error('Autosave error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Excerpt is required');
      return;
    }
    if (!formData.categoryId) {
      toast.error('Category is required');
      return;
    }
    if (formData.tagIds.length < 2) {
      toast.error('At least 2 tags are required');
      return;
    }

    try {
      setLoading(true);

      const url = postId ? `/api/blog/posts/${postId}` : '/api/blog/posts';
      const method = postId ? 'PATCH' : 'POST';

      const { sendNewsletter: _unusedNewsletterFlag, ...postFields } = formData;
      const payload = {
        ...postFields,
        featuredImage: postFields.featuredImage?.trim() ? postFields.featuredImage.trim() : null,
        seoTitle: postFields.seoTitle?.trim() || postFields.title,
        seoDescription: postFields.seoDescription?.trim() || postFields.excerpt,
        publishedAt: postFields.publishedAt ? new Date(postFields.publishedAt).toISOString() : null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        // If post was published and newsletter option was checked, send newsletter
        if (formData.status === 'PUBLISHED' && formData.sendNewsletter) {
          try {
            toast.loading('Sending newsletter...', { id: 'newsletter-toast' });

            const newsletterRes = await fetch('/api/integrations/mailchimp/send-newsletter', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                postId: data.data.id,
                title: formData.title,
                excerpt: formData.excerpt,
                slug: formData.slug,
                featuredImage: formData.featuredImage,
              }),
            });

            const newsletterData = await newsletterRes.json();

            if (newsletterData.success) {
              toast.success('Newsletter sent successfully!', { id: 'newsletter-toast' });
            } else {
              toast.error(`Newsletter failed: ${newsletterData.error}`, { id: 'newsletter-toast' });
            }
          } catch (newsletterError) {
            console.error('Newsletter error:', newsletterError);
            toast.error('Failed to trigger newsletter', { id: 'newsletter-toast' });
          }
        }

        toast.success(postId ? 'Post updated successfully' : 'Post created successfully');
        router.push('/dashboard/blog');
      } else {
        toast.error(data.error || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-bg-primary">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-bg-primary/80 backdrop-blur-md border-b border-border-primary px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/blog')}
              className="p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full transition-colors"
              title="Back to Posts"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary">
                {postId ? 'Editing Post' : 'New Post'}
              </span>
              {saving ? (
                <span className="text-xs text-amber-500 flex items-center gap-1">
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="text-xs text-green-500">Saved</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <div className="h-6 w-px bg-border-primary mx-1" />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  {postId ? 'Update' : 'Publish'}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - 8 cols */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title & Slug */}
            <div className="space-y-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Post Title"
                className="w-full text-4xl lg:text-5xl font-bold bg-transparent border-none p-0 placeholder:text-text-tertiary focus:ring-0 text-text-primary"
                required
              />

              <div className="flex items-center gap-2 text-sm text-text-secondary group">
                <span className="text-text-tertiary">aureonone.in/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="post-slug"
                  className="bg-transparent border-none p-0 focus:ring-0 text-text-secondary font-mono text-sm w-full max-w-md hover:text-amber-600 transition-colors"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div className="prose-editor min-h-[500px]">
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>
          </div>

          {/* Sidebar - 4 cols */}
          <div className="lg:col-span-4 space-y-6">

            {/* Publishing Card */}
            <div className="bg-white dark:bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Publishing
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                {formData.status === 'SCHEDULED' && (
                  <div>
                    <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Publish Date</label>
                    <input
                      type="datetime-local"
                      value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishedAt: e.target.value ? new Date(e.target.value).toISOString() : '',
                        })
                      }
                      className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="pt-3 border-t border-border-primary">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.sendNewsletter}
                        onChange={(e) => setFormData({ ...formData, sendNewsletter: e.target.checked })}
                        className="peer h-4 w-4 text-amber-600 border-border-primary rounded focus:ring-amber-500"
                        disabled={formData.status !== 'PUBLISHED' || initialData?.status === 'PUBLISHED'}
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-text-primary group-hover:text-amber-600 transition-colors">
                        Send Newsletter
                      </span>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {formData.status !== 'PUBLISHED'
                          ? 'Enable when published'
                          : initialData?.status === 'PUBLISHED'
                            ? 'Already sent'
                            : 'Notify Mailchimp subscribers'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Organization Card */}
            <div className="bg-white dark:bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Organization
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isSelected = formData.tagIds.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${isSelected
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-bg-primary text-text-secondary border border-border-primary hover:border-text-secondary'
                            }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image Card */}
            <div className="bg-white dark:bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Featured Image
              </h3>

              <div className="space-y-3">
                <div className="relative group">
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="Image URL..."
                    className={`w-full px-3 py-2 pr-10 border rounded-lg bg-bg-primary text-text-primary text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent ${imageValid === false ? 'border-red-500' : imageValid === true ? 'border-green-500' : 'border-border-primary'
                      }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                    {imageValidating ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    )}
                  </div>
                </div>

                {formData.featuredImage && imageValid !== false && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-border-primary bg-bg-primary">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageValid(false)}
                    />
                  </div>
                )}

                {imageValid === false && (
                  <p className="text-xs text-red-500">Unable to load image from URL</p>
                )}
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-white dark:bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                SEO & Meta
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Short summary..."
                  />
                  <p className="text-xs text-text-tertiary mt-1 text-right">{formData.excerpt.length}/300</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Optional (defaults to title)"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">SEO Description</label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Optional (defaults to excerpt)"
                  />
                  <p className="text-xs text-text-tertiary mt-1 text-right">{formData.seoDescription.length}/160</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-bg-tertiary rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-bg-tertiary border-b border-border-primary p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Preview</h2>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-text-secondary hover:text-text-secondary"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8">
              <article className="article-content">
                <h1 className="article-h1">{formData.title || 'Untitled Post'}</h1>
                <div className="article-meta">
                  <time>{new Date().toLocaleDateString()}</time>
                  <span className="reading-time">
                    {Math.ceil(formData.content.split(' ').length / 200)} min read
                  </span>
                </div>
                <div
                  className="article-paragraph"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </article>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
