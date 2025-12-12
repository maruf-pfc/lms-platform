'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import MarkdownEditor from '@/components/ui/MarkdownEditor';
import { Image as ImageIcon, Code } from 'lucide-react';

export default function CreatePostPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultType = searchParams.get('type') || 'forum'; // 'forum' or 'blog'

    const [postData, setPostData] = useState({
        title: '',
        type: defaultType,
        content: '',
        tags: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...postData,
                tags: postData.tags.split(',').map(t => t.trim()).filter(Boolean)
            };
            await api.post('/community', payload);
            toast.success('Post created!');
            router.push(postData.type === 'blog' ? '/blog' : '/forum');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const toastId = toast.loading('Uploading image...');
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPostData({ ...postData, image: res.data.secure_url || res.data.url });
            toast.success('Image uploaded', { id: toastId });
        } catch (err) {
            toast.error('Upload failed');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Create New {postData.type === 'blog' ? 'Blog Post' : 'Forum Discussion'}</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
                <div className="flex gap-4 mb-4">
                    <button
                        type="button"
                        onClick={() => setPostData({ ...postData, type: 'forum' })}
                        className={`flex-1 py-2 rounded-lg font-bold border ${postData.type === 'forum' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Forum
                    </button>
                    <button
                        type="button"
                        onClick={() => setPostData({ ...postData, type: 'blog' })}
                        className={`flex-1 py-2 rounded-lg font-bold border ${postData.type === 'blog' ? 'bg-purple-600 text-white border-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Blog
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        className="w-full border p-3 rounded-lg text-lg font-semibold"
                        placeholder="Enter a descriptive title..."
                        value={postData.title}
                        onChange={e => setPostData({ ...postData, title: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Content (Markdown Supported)</label>
                    <MarkdownEditor
                        value={postData.content}
                        onChange={(val) => setPostData({ ...postData, content: val })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                        <input
                            className="w-full border p-2 rounded-lg"
                            placeholder="javascript, react, help..."
                            value={postData.tags}
                            onChange={e => setPostData({ ...postData, tags: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Cover Image</label>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 border p-2 rounded-lg"
                                placeholder="Image URL (or upload)"
                                value={postData.image}
                                onChange={e => setPostData({ ...postData, image: e.target.value })}
                            />
                            <label className="cursor-pointer bg-gray-100 border p-2 rounded-lg hover:bg-gray-200" title="Upload Image">
                                <ImageIcon size={24} className="text-gray-600" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        {loading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
