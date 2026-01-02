'use client'
/* eslint-disable @next/next/no-img-element */

import { useCallback, useState } from 'react'
import { Upload, Image, Loader2 } from 'lucide-react'

interface UploadZoneProps {
    onUpload: (file: File) => void
    analyzing: boolean
}

export default function UploadZone({ onUpload, analyzing }: UploadZoneProps) {
    const [dragActive, setDragActive] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(file))
            onUpload(file)
        }
    }, [onUpload])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
            onUpload(file)
        }
    }, [onUpload])

    return (
        <div
            className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center transition-all
        ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400'}
        ${analyzing ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
      `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !analyzing && document.getElementById('file-input')?.click()}
        >
            <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />

            {preview && !analyzing ? (
                <div className="flex flex-col items-center gap-4">
                    <img src={preview} alt="Preview" className="max-h-48 rounded-lg shadow-md" />
                    <p className="text-sm text-slate-600">Click to change or drop another image</p>
                </div>
            ) : analyzing ? (
                <div className="flex flex-col items-center gap-4">
                    {preview && <img src={preview} alt="Analyzing" className="max-h-32 rounded-lg opacity-50" />}
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                    <p className="text-lg font-medium text-primary-600">Analyzing creative...</p>
                    <p className="text-sm text-slate-500">Running 100+ quality signals</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full">
                        <Upload className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-slate-900">Drop your creative here</p>
                        <p className="text-sm text-slate-500">or click to browse (PNG, JPG, WEBP)</p>
                    </div>
                </div>
            )}
        </div>
    )
}
