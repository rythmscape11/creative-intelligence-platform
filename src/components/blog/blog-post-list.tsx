'use client';

import { formatDistanceToNow } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface BlogPostListProps {
  posts: BlogPost[];
  loading: boolean;
  selectedPosts: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectPost: (postId: string, checked: boolean) => void;
  onDelete: (postId: string) => void;
  onDuplicate: (postId: string) => void;
  userRole?: string;
  currentUserId?: string;
}

export function BlogPostList({
  posts,
  loading,
  selectedPosts,
  onSelectAll,
  onSelectPost,
  onDelete,
  onDuplicate,
  userRole,
  currentUserId,
}: BlogPostListProps) {
  if (loading) {
    return (
      <div className="bg-bg-secondary border border-border-primary rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-highlight"></div>
          <span className="ml-3 text-text-secondary">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-bg-secondary border border-border-primary rounded-lg shadow-sm p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-text-tertiary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-text-primary">No blog posts</h3>
        <p className="mt-1 text-sm text-text-secondary">Get started by creating a new blog post.</p>
        <div className="mt-6">
          <a
            href="/dashboard/blog/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-highlight hover:bg-blue-600 transition-colors"
          >
            + New Post
          </a>
        </div>
      </div>
    );
  }

  const allSelected = posts.length > 0 && selectedPosts.length === posts.length;
  const someSelected = selectedPosts.length > 0 && selectedPosts.length < posts.length;

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-primary">
          <thead className="bg-bg-tertiary">
            <tr>
              <th scope="col" className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 text-accent-highlight focus:ring-accent-highlight border-border-primary rounded cursor-pointer bg-bg-tertiary"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Author
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-bg-secondary divide-y divide-border-primary">
            {posts.map((post) => {
              const isSelected = selectedPosts.includes(post.id);
              const isOwner = currentUserId === post.author.id;
              const canDelete = userRole === 'ADMIN';
              const canEdit = userRole === 'ADMIN' || isOwner;

              return (
                <tr key={post.id} className={isSelected ? 'bg-blue-500/10' : 'hover:bg-bg-tertiary transition-colors'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectPost(post.id, e.target.checked)}
                      className="h-4 w-4 text-accent-highlight focus:ring-accent-highlight border-border-primary rounded cursor-pointer bg-bg-tertiary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <a
                        href={`/dashboard/blog/edit/${post.id}`}
                        className="text-sm font-medium text-text-primary hover:text-accent-highlight line-clamp-1 transition-colors"
                      >
                        {post.title}
                      </a>
                      <p className="text-sm text-text-secondary line-clamp-1 mt-1">{post.excerpt}</p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-bg-tertiary border border-border-primary text-text-secondary"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-bg-tertiary border border-border-primary text-text-secondary">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {post.author.avatar ? (
                          <img className="h-8 w-8 rounded-full" src={post.author.avatar} alt="" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-bg-tertiary border border-border-primary flex items-center justify-center">
                            <span className="text-xs font-medium text-text-secondary">
                              {post.author.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-text-primary">{post.author.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: post.category.color ? `${post.category.color}20` : '#3B82F620',
                        borderColor: post.category.color || '#3B82F6',
                        color: post.category.color || '#3B82F6',
                      }}
                    >
                      {post.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        post.status === 'PUBLISHED'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : post.status === 'DRAFT'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : post.status === 'SCHEDULED'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    <div className="flex flex-col">
                      <span>
                        {post.publishedAt
                          ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
                          : formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        {post.publishedAt ? 'Published' : 'Created'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary hover:text-text-primary transition-colors"
                        title="Preview"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>

                      {canEdit && (
                        <a
                          href={`/dashboard/blog/edit/${post.id}`}
                          className="text-accent-highlight hover:text-blue-400 transition-colors"
                          title="Edit"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </a>
                      )}

                      <button
                        onClick={() => onDuplicate(post.id)}
                        className="text-green-400 hover:text-green-300 transition-colors"
                        title="Duplicate"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>

                      {canDelete && (
                        <button
                          onClick={() => onDelete(post.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

