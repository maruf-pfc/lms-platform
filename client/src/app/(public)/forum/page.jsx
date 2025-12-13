'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, ThumbsUp, MessageSquare, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ForumPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Should we sort by newest for Forum? or top? User said "most upvote and new posts will appear in the top".
                // Let's do newest by default but maybe sticky?
                // For now, sorting by newest (default controller)
                const res = await api.get('/community?type=forum');
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
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2"><MessageCircle className="text-blue-600" /> Discussion Forum</h1>
                    <p className="text-gray-500 mt-1">Ask questions, share knowledge, and help others.</p>
                </div>
                <Link href="/community/create?type=forum" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 transition">
                    <Plus size={20} /> New Discussion
                </Link>
            </header>

            {loading ? <div className="p-8 text-center">Loading...</div> : (
                <div className="space-y-4">
                    {posts.map(post => (
                        <Link href={`/community/${post._id}`} key={post._id} className="block bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition group">
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center gap-1 min-w-[50px] text-gray-500">
                                    <ThumbsUp size={20} className={post.upvotes?.length > 0 ? 'text-blue-600' : ''} />
                                    <span className="font-bold">{(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">{post.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-1 mb-2">{post.content}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span className="font-medium text-gray-600">{post.author?.name}</span>
                                        <span>posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                        <div className="flex gap-2">
                                            {post.tags?.map(t => <span key={t} className="bg-gray-100 px-2 py-0.5 rounded text-gray-500">#{t}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MessageSquare size={18} />
                                    <span>{post.comments?.length || 0}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {posts.length === 0 && <div className="py-12 text-center text-gray-500">No discussions yet. Start one!</div>}
                </div>
            )}
        </div>
    );
}
