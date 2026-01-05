'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { FrameworkAssetUploader } from '@/components/admin/FrameworkAssetUploader';

interface FrameworkForm {
    slug: string;
    name: string;
    description: string;
    shortDescription: string;
    longDescription: string;
    problemStatement: string;
    outcomes: string;
    idealFor: string;
    notIdealFor: string;
    deliverables: string;
    howToUse: string;
    credibilityText: string;
    price: number;
    currency: string;
    assets: string;
    razorpayProductId: string;
    razorpayPriceId: string;
    seoTitle: string;
    seoDescription: string;
    status: string;
}

const defaultForm: FrameworkForm = {
    slug: '',
    name: '',
    description: '',
    shortDescription: '',
    longDescription: '',
    problemStatement: '',
    outcomes: '',
    idealFor: '',
    notIdealFor: '',
    deliverables: '',
    howToUse: '',
    credibilityText: '',
    price: 0,
    currency: 'INR',
    assets: '[]',
    razorpayProductId: '',
    razorpayPriceId: '',
    seoTitle: '',
    seoDescription: '',
    status: 'draft',
};

export default function EditFrameworkPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === 'new';

    const [form, setForm] = useState<FrameworkForm>(defaultForm);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetchFramework();
        }
    }, [id, isNew]);

    const fetchFramework = async () => {
        try {
            const res = await fetch(`/api/admin/frameworks/${id}`);
            if (res.ok) {
                const data = await res.json();
                setForm({
                    ...defaultForm,
                    ...data.framework,
                    price: data.framework.price || 0,
                });
            }
        } catch (error) {
            console.error('Failed to fetch framework:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'price' ? parseInt(value) * 100 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = isNew ? '/api/admin/frameworks' : `/api/admin/frameworks/${id}`;
            const method = isNew ? 'POST' : 'PATCH';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                router.push('/dashboard/admin/frameworks');
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to save framework');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save framework');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/admin/frameworks"
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isNew ? 'Create Framework' : 'Edit Framework'}
                    </h1>
                </div>
                {!isNew && form.slug && (
                    <Link
                        href={`/frameworks/${form.slug}`}
                        target="_blank"
                        className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Link>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                            <input
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                required
                                placeholder="e.g., ai-media-framework"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                            <input
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing & Razorpay</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (INR)</label>
                            <input
                                name="price"
                                type="number"
                                value={form.price / 100}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Razorpay Product ID</label>
                            <input
                                name="razorpayProductId"
                                value={form.razorpayProductId || ''}
                                onChange={handleChange}
                                placeholder="Optional"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Content Sections */}
                <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Page Content</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Statement</label>
                            <textarea
                                name="problemStatement"
                                value={form.problemStatement || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe the pain points this framework solves..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Outcomes</label>
                            <textarea
                                name="outcomes"
                                value={form.outcomes || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder="What results will users achieve..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Who Should Buy</label>
                                <textarea
                                    name="idealFor"
                                    value={form.idealFor || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Who Should NOT Buy</label>
                                <textarea
                                    name="notIdealFor"
                                    value={form.notIdealFor || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deliverables (one per line)</label>
                            <textarea
                                name="deliverables"
                                value={form.deliverables || ''}
                                onChange={handleChange}
                                rows={4}
                                placeholder="PDF Framework Guide&#10;Excel Templates&#10;Checklist..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </section>

                {/* Downloadable Assets */}
                <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Downloadable Assets</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Upload files that users can download after purchasing this framework (PDFs, ZIPs, templates, etc.)
                    </p>
                    <FrameworkAssetUploader
                        frameworkId={isNew ? undefined : id}
                        assets={(() => {
                            try {
                                return JSON.parse(form.assets || '[]');
                            } catch {
                                return [];
                            }
                        })()}
                        onAssetsChange={(newAssets) => {
                            setForm((prev) => ({
                                ...prev,
                                assets: JSON.stringify(newAssets),
                            }));
                        }}
                    />
                </section>

                {/* SEO */}
                <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SEO Title</label>
                            <input
                                name="seoTitle"
                                value={form.seoTitle || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SEO Description</label>
                            <textarea
                                name="seoDescription"
                                value={form.seoDescription || ''}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </section>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link
                        href="/dashboard/admin/frameworks"
                        className="px-6 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Framework'}
                    </button>
                </div>
            </form>
        </div>
    );
}
