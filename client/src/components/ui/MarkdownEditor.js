'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Edit3, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';

export default function MarkdownEditor({ value, onChange, label }) {
    const [view, setView] = useState('write'); // 'write' | 'preview'
    const [showImageUploader, setShowImageUploader] = useState(false);

    const handleImageUpload = (url) => {
        const imageMarkdown = `![Image](${url})`;
        onChange(value + '\n' + imageMarkdown);
        setShowImageUploader(false);
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setView('write')}
                            className={`p-2 rounded hover:bg-gray-200 transition ${view === 'write' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
                            title="Write"
                        >
                            <Edit3 size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setView('preview')}
                            className={`p-2 rounded hover:bg-gray-200 transition ${view === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
                            title="Preview"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowImageUploader(!showImageUploader)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition ${showImageUploader ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-700'
                                }`}
                        >
                            <ImageIcon size={16} /> Insert Image
                        </button>
                    </div>
                </div>

                {/* Image Uploader Panel */}
                {showImageUploader && (
                    <div className="p-4 bg-gray-50 border-b">
                        <ImageUpload
                            label="Upload image to insert"
                            value=""
                            onChange={handleImageUpload}
                        />
                        <button onClick={() => setShowImageUploader(false)} className="text-xs text-red-500 mt-2 hover:underline">Cancel</button>
                    </div>
                )}

                {/* Editor / Preview Area */}
                <div className="min-h-[300px]">
                    {view === 'write' ? (
                        <textarea
                            className="w-full h-full min-h-[300px] p-4 focus:outline-none resize-y font-mono text-sm"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Write in markdown..."
                        />
                    ) : (
                        <div className="prose prose-blue max-w-none p-4 min-h-[300px]">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {value || '*(Nothing to preview)*'}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
            <p className="text-xs text-gray-500 text-right">Supports Markdown & GFM</p>
        </div>
    );
}
