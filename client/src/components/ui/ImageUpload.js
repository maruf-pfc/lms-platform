'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUpload({ value, onChange, label = "Upload Image" }) {
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onChange(res.data.url);
            toast.success('Image uploaded!');
        } catch (err) {
            toast.error('Upload failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {value ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                        onClick={() => onChange('')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {loading ? (
                                <Loader2 className="animate-spin text-gray-400" size={32} />
                            ) : (
                                <Upload className="text-gray-400 mb-2" size={32} />
                            )}
                            <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload</p>
                            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
                    </label>
                </div>
            )}
        </div>
    );
}
