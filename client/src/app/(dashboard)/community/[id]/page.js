'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, User, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function PostDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentContent, setCommentContent] = useState('');

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await api.get(`/community/${id}`);
            setPost(res.data);
        } catch (err) {
            toast.error('Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (type) => { // 'up' or 'down'
        if (!user) return toast.error('Login to vote');
        try {
            const res = await api.post(`/community/${id}/vote`, { voteType: type });
            // Optimistic update or refresh? Refresh is safer for sync
            setPost(res.data);
            // Wait, response handles populating authors? Controller didn't populate in vote response? 
            // The controller `res.json(post)` returns the post doc but probably unpopulated if `findById` didn't repopulate.
            // Let's re-fetch to be safe and lazy, or manually check controller. 
            // Controller: `await post.save(); res.json(post);` -> Mongoose `save` returns unpopulated doc usually.
            // Re-fetch is better UX eventually.
            fetchPost();
        } catch (err) {
            toast.error('Vote failed');
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;
        try {
            const res = await api.post(`/community/${id}/comments`, { content: commentContent });
            // Controller returns updated post populated
            setPost(res.data);
            setCommentContent('');
            toast.success('Comment added');
        } catch (err) {
            toast.error('Failed to add comment');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!post) return <div className="p-8 text-center">Post not found</div>;

    const isUpvoted = post.upvotes?.includes(user?.id);
    const isDownvoted = post.downvotes?.includes(user?.id);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Post Header */}
            <div className="bg-white p-8 rounded-xl shadow-sm border mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        {post.author?.avatar ? (
                            <img src={post.author.avatar} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-full h-full p-2 text-gray-500" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">{post.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="font-medium text-gray-700">{post.author?.name}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                            <span>•</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded uppercase text-xs font-bold">{post.type}</span>
                        </div>
                    </div>
                </div>

                {post.image && (
                    <div className="mb-8 rounded-xl overflow-hidden max-h-96">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="prose prose-lg max-w-none text-gray-800 mb-8">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mb-8">
                        {post.tags.map(tag => (
                            <span key={tag} className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 border-t pt-6">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                        <button
                            onClick={() => handleVote('up')}
                            className={`p-2 rounded hover:bg-white transition ${isUpvoted ? 'text-blue-600 bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                            <ThumbsUp size={20} />
                        </button>
                        <span className="font-bold text-gray-700 min-w-[20px] text-center">
                            {(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}
                        </span>
                        <button
                            onClick={() => handleVote('down')}
                            className={`p-2 rounded hover:bg-white transition ${isDownvoted ? 'text-red-500 bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                            <ThumbsDown size={20} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <MessageSquare size={20} />
                        <span>{post.comments?.length} Comments</span>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-6">Comments</h3>

                {/* Add Comment */}
                <form onSubmit={handleComment} className="mb-8 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold">
                        {user?.name?.[0]}
                    </div>
                    <div className="flex-1">
                        <textarea
                            className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                            placeholder="Write a thoughtful comment..."
                            value={commentContent}
                            onChange={e => setCommentContent(e.target.value)}
                        />
                        <div className="flex justify-end mt-2">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Post Comment</button>
                        </div>
                    </div>
                </form>

                {/* List */}
                <div className="space-y-6">
                    {post.comments?.map((comment) => (
                        <div key={comment._id} className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                {comment.user?.avatar ? (
                                    <img src={comment.user.avatar} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-full h-full p-2 text-gray-500" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-900">{comment.user?.name}</span>
                                    <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                                </div>
                                <p className="text-gray-700">{comment.content}</p>
                                {/* Reply button could go here */}
                            </div>
                        </div>
                    ))}
                    {post.comments?.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
