'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, ThumbsUp, MessageSquare, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/community?type=blog&sort=top');
                setPosts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="text-purple-600" /> Community Blog</h1>
                    <p className="text-gray-500 mt-1">Stories, tutorials, and updates from the community.</p>
                </div>
                <Link href="/community/create?type=blog" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 flex items-center gap-2 transition">
                    <Plus size={20} /> Write Article
                </Link>
            </header>

            {loading ? <div className="p-8 text-center">Loading...</div> : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <Link href={`/community/${post._id}`} key={post._id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden flex flex-col group">
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                {post.image ? (
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300"><BookOpen size={48} /></div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-2">{post.tags?.[0] || 'Article'}</div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition line-clamp-2">{post.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">{post.content.substring(0, 150)}...</p>

                                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                            {post.author?.avatar && <img src={post.author.avatar} className="w-full h-full" />}
                                        </div>
                                        <span className="truncate max-w-[100px]">{post.author?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1"><ThumbsUp size={14} /> {(post.upvotes?.length || 0)}</span>
                                        <span className="flex items-center gap-1"><MessageSquare size={14} /> {post.comments?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {posts.length === 0 && <div className="col-span-full py-12 text-center text-gray-500">No blog posts yet. Be the first to write one!</div>}
                </div>
            )}
        </div>
    );
}
