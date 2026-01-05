'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserRole } from '@/types';
import { BlogManagementDashboard } from '@/components/blog/blog-management-dashboard';

export default function BlogManagementPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.EDITOR]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Blog Management
            </h1>
            <p className="text-text-secondary mt-2">
              Create, edit, and manage your blog posts
            </p>
          </div>

          <a
            href="/dashboard/blog/create"
            className="px-6 py-3 rounded-lg font-semibold text-white bg-accent-highlight hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            + New Post
          </a>
        </div>

        <BlogManagementDashboard />
      </div>
    </ProtectedRoute>
  );
}

