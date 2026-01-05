import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserRole } from '@/types';
import { BlogPostEditor } from '@/components/blog/blog-post-editor';

export default function CreateBlogPostPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.EDITOR]}>
      <div className="min-h-screen bg-gray-50 dark:bg-bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-text-primary">
          <BlogPostEditor />
        </div>
      </div>
    </ProtectedRoute>
  );
}
