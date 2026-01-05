'use client';

import { useState, useCallback } from 'react';
import {
    Palette,
    Upload,
    Sparkles,
    Plus,
    Trash2,
    Check,
    Loader2,
    Image as ImageIcon,
    FileText,
    X,
    RefreshCw,
} from 'lucide-react';

interface BrandKit {
    id: string;
    clientName: string;
    colors: string[];
    toneOfVoice: string[];
    forbiddenImagery: string[];
    requiredElements: string[];
    loraStatus: 'none' | 'training' | 'ready';
    imageCount: number;
    createdAt: string;
}

export default function BrandKitsPage() {
    const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [newKitName, setNewKitName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleImagesUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUploadedImages(prev => [...prev, ...files].slice(0, 50)); // Max 50 images
    }, []);

    const handlePdfUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file?.type === 'application/pdf') {
            setPdfFile(file);
        }
    }, []);

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const createBrandKit = async () => {
        if (!newKitName.trim() || uploadedImages.length < 20) return;

        setIsCreating(true);
        try {
            // Upload images and create brand kit
            const formData = new FormData();
            formData.append('clientName', newKitName);
            uploadedImages.forEach((file, i) => formData.append(`image_${i}`, file));
            if (pdfFile) formData.append('guidelines', pdfFile);

            const response = await fetch('/api/forge/brand-kits', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setBrandKits(prev => [data.brandKit, ...prev]);
                setShowCreateModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Failed to create brand kit:', error);
        }
        setIsCreating(false);
    };

    const resetForm = () => {
        setNewKitName('');
        setUploadedImages([]);
        setPdfFile(null);
    };

    const estimatedTrainingSparks = uploadedImages.length * 10 + 500; // Per brief

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Brand Kits</h1>
                    <p className="text-gray-500">
                        Create LoRA fine-tuned models for brand consistency
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    New Brand Kit
                </button>
            </div>

            {/* Brand Kits Grid */}
            {brandKits.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <Palette className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Brand Kits Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Create your first Brand Kit to ensure every generated image matches your
                        {`client's`} visual identity perfectly.
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg inline-flex items-center gap-2"
                    >
                        <Upload className="h-5 w-5" />
                        Upload Brand Assets
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brandKits.map(kit => (
                        <div key={kit.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {/* Kit Header */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{kit.clientName}</h3>
                                        <p className="text-sm text-gray-500">{kit.imageCount} training images</p>
                                    </div>
                                    <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${kit.loraStatus === 'ready' ? 'bg-green-100 text-green-700' :
                                            kit.loraStatus === 'training' ? 'bg-amber-100 text-amber-700' :
                                                'bg-gray-100 text-gray-600'}
                  `}>
                                        {kit.loraStatus === 'ready' ? 'Ready' :
                                            kit.loraStatus === 'training' ? 'Training...' : 'No LoRA'}
                                    </span>
                                </div>
                            </div>

                            {/* Colors */}
                            {kit.colors.length > 0 && (
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-xs text-gray-500 mb-2">Brand Colors</p>
                                    <div className="flex gap-2">
                                        {kit.colors.slice(0, 5).map((color, i) => (
                                            <div
                                                key={i}
                                                className="w-6 h-6 rounded-full border border-gray-200"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="p-4 flex items-center justify-between">
                                <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                                    <RefreshCw className="h-4 w-4" />
                                    Retrain
                                </button>
                                <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Create Brand Kit</h2>
                                <p className="text-sm text-gray-500">Train a custom LoRA model for brand consistency</p>
                            </div>
                            <button
                                onClick={() => { setShowCreateModal(false); resetForm(); }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Client Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Client / Brand Name
                                </label>
                                <input
                                    type="text"
                                    value={newKitName}
                                    onChange={e => setNewKitName(e.target.value)}
                                    placeholder="e.g. Nike, Red Bull, Apple"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Training Images (20-50 recommended)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImagesUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600 font-medium">Drop images here or click to upload</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {uploadedImages.length} of 50 images selected
                                        </p>
                                    </label>
                                </div>

                                {/* Image Preview */}
                                {uploadedImages.length > 0 && (
                                    <div className="mt-4 grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                                        {uploadedImages.map((file, i) => (
                                            <div key={i} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Training ${i}`}
                                                    className="w-full aspect-square object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={() => removeImage(i)}
                                                    className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* PDF Guidelines */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand Guidelines PDF (optional)
                                </label>
                                <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handlePdfUpload}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label htmlFor="pdf-upload" className="flex-1 cursor-pointer">
                                        {pdfFile ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <Check className="h-5 w-5" />
                                                <span>{pdfFile.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <FileText className="h-5 w-5" />
                                                <span>Upload brand guidelines PDF</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Sparks Estimate */}
                            <div className="bg-amber-50 rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-amber-800">Estimated Training Cost</p>
                                    <p className="text-sm text-amber-600">LoRA fine-tuning takes ~10 minutes</p>
                                </div>
                                <div className="flex items-center gap-2 text-amber-700">
                                    <Sparkles className="h-5 w-5" />
                                    <span className="text-xl font-bold">{estimatedTrainingSparks}</span>
                                    <span className="text-sm">Sparks</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                {uploadedImages.length < 20 &&
                                    `Need at least ${20 - uploadedImages.length} more images`
                                }
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createBrandKit}
                                    disabled={isCreating || !newKitName.trim() || uploadedImages.length < 20}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Training...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4" />
                                            Create & Train LoRA
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
