'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { MessageSquare, Plus } from 'lucide-react';

export default function ForumPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/forum/posts')
            .then(res => setPosts(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
                    <Link href="/forum/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700">
                        <Plus size={20} /> New Post
                    </Link>
                </div>

                {loading ? <div>Loading...</div> : (
                    <div className="space-y-4">
                        {posts.map(post => (
                            <Link key={post._id} href={`/forum/${post._id}`} className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${post.type === 'question' ? 'bg-orange-100 text-orange-600' :
                                                    post.type === 'blog' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {post.type}
                                            </span>
                                            <span className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span>By {post.author?.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <MessageSquare size={18} />
                                        {/* Comment count would be ideal here */}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
