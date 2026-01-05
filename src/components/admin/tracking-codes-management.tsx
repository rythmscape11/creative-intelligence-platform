'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { Plus, Edit, Trash2, Code, Eye, EyeOff } from 'lucide-react';

interface TrackingCode {
  id: string;
  name: string;
  code: string;
  type: string;
  position: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface TrackingCodesManagementProps {
  initialTrackingCodes: TrackingCode[];
}

export function TrackingCodesManagement({ initialTrackingCodes }: TrackingCodesManagementProps) {
  const [trackingCodes, setTrackingCodes] = useState<TrackingCode[]>(initialTrackingCodes);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState<TrackingCode | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'ANALYTICS',
    position: 'HEAD',
    isActive: true,
  });

  const fetchTrackingCodes = async () => {
    try {
      const response = await fetch('/api/admin/tracking-codes');
      const data = await response.json();
      
      if (response.ok) {
        setTrackingCodes(data.trackingCodes);
      } else {
        toast({
          type: 'error',
          title: 'Error',
          description: 'Failed to fetch tracking codes',
        });
      }
    } catch (error) {
      toast({
        type: 'error',
        title: 'Error',
        description: 'An error occurred while fetching tracking codes',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingCode
        ? `/api/admin/tracking-codes/${editingCode.id}`
        : '/api/admin/tracking-codes';
      
      const method = editingCode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          type: 'success',
          title: 'Success',
          description: editingCode
            ? 'Tracking code updated successfully'
            : 'Tracking code created successfully',
        });
        setShowModal(false);
        setEditingCode(null);
        setFormData({
          name: '',
          code: '',
          type: 'ANALYTICS',
          position: 'HEAD',
          isActive: true,
        });
        fetchTrackingCodes();
      } else {
        toast({
          type: 'error',
          title: 'Error',
          description: data.message || 'Failed to save tracking code',
        });
      }
    } catch (error) {
      toast({
        type: 'error',
        title: 'Error',
        description: 'An error occurred while saving the tracking code',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (code: TrackingCode) => {
    setEditingCode(code);
    setFormData({
      name: code.name,
      code: code.code,
      type: code.type,
      position: code.position,
      isActive: code.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tracking code?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tracking-codes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          type: 'success',
          title: 'Success',
          description: 'Tracking code deleted successfully',
        });
        fetchTrackingCodes();
      } else {
        toast({
          type: 'error',
          title: 'Error',
          description: 'Failed to delete tracking code',
        });
      }
    } catch (error) {
      toast({
        type: 'error',
        title: 'Error',
        description: 'An error occurred while deleting the tracking code',
      });
    }
  };

  const toggleActive = async (code: TrackingCode) => {
    try {
      const response = await fetch(`/api/admin/tracking-codes/${code.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !code.isActive }),
      });

      if (response.ok) {
        toast({
          type: 'success',
          title: 'Success',
          description: `Tracking code ${!code.isActive ? 'activated' : 'deactivated'}`,
        });
        fetchTrackingCodes();
      } else {
        toast({
          type: 'error',
          title: 'Error',
          description: 'Failed to update tracking code',
        });
      }
    } catch (error) {
      toast({
        type: 'error',
        title: 'Error',
        description: 'An error occurred while updating the tracking code',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingCode(null);
            setFormData({
              name: '',
              code: '',
              type: 'ANALYTICS',
              position: 'HEAD',
              isActive: true,
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Tracking Code
        </Button>
      </div>

      {/* Tracking Codes List */}
      {trackingCodes.length === 0 ? (
        <div className="card glass-card p-12 text-center">
          <Code className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.3 }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-neutral-charcoal)' }}>
            No tracking codes yet
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.7 }}>
            Add your first tracking code to start monitoring your website
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add Tracking Code
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {trackingCodes.map((code) => (
            <div
              key={code.id}
              className="card glass-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold" style={{ color: 'var(--color-neutral-charcoal)' }}>
                      {code.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        code.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {code.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {code.type}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {code.position}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}>
                    Created: {new Date(code.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleActive(code)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {code.isActive ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleEdit(code)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(code.id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-4 mt-4">
                <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap break-all">
                  {code.code}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-neutral-charcoal)' }}>
                {editingCode ? 'Edit Tracking Code' : 'Add Tracking Code'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.8 }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Google Analytics"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.8 }}>
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="ANALYTICS">Analytics</option>
                    <option value="PIXEL">Pixel</option>
                    <option value="TAG_MANAGER">Tag Manager</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.8 }}>
                    Position
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="HEAD">Head (before &lt;/head&gt;)</option>
                    <option value="BODY_START">Body Start (after &lt;body&gt;)</option>
                    <option value="BODY_END">Body End (before &lt;/body&gt;)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.8 }}>
                    Tracking Code
                  </label>
                  <textarea
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                    rows={10}
                    placeholder="Paste your tracking code here..."
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm font-medium"
                    style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.8 }}
                  >
                    Active (code will be injected into the website)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading
                      ? 'Saving...'
                      : editingCode
                      ? 'Update Code'
                      : 'Add Code'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCode(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

