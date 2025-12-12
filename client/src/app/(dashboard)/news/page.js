'use client';

import { useEffect, useState } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch from DEV.to API (Free, no key)
        const fetchNews = async () => {
            try {
                const res = await fetch('https://dev.to/api/articles?tag=programming&top=7&per_page=12');
                const data = await res.json();
                setArticles(data);
            } catch (err) {
                toast.error('Failed to load news');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2"><Newspaper className="text-orange-600" /> Tech News</h1>
                    <p className="text-gray-500 mt-1">Latest updates from the developer community via DEV.to</p>
                </div>
            </header>

            {loading ? <div className="p-8 text-center">Loading News...</div> : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {articles.map(article => (
                        <a href={article.url} target="_blank" rel="noreferrer" key={article.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden flex flex-col group h-full">
                            <div className="h-40 bg-gray-100 relative overflow-hidden">
                                {article.cover_image ? (
                                    <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-400">
                                        <Newspaper size={40} />
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition line-clamp-2">{article.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">{article.description}</p>

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t mt-auto">
                                    <div className="flex items-center gap-2">
                                        <img src={article.user.profile_image} className="w-6 h-6 rounded-full" />
                                        <span className="truncate max-w-[100px]">{article.user.name}</span>
                                    </div>
                                    <span className="flex items-center gap-1 font-semibold text-blue-600">Read <ExternalLink size={12} /></span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
