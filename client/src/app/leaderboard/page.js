'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Medal, Trophy, User } from 'lucide-react';

export default function LeaderboardPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/gamification/leaderboard')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Loading rankings...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
                    <h1 className="text-4xl font-bold text-gray-900">Global Leaderboard</h1>
                    <p className="text-gray-600 mt-2">Top students by learning points</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {users.map((user, idx) => (
                        <div key={user._id} className="flex items-center p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="w-12 text-center font-bold text-xl text-gray-400">
                                {idx + 1 === 1 && <Medal className="mx-auto text-yellow-500" size={28} />}
                                {idx + 1 === 2 && <Medal className="mx-auto text-gray-400" size={28} />}
                                {idx + 1 === 3 && <Medal className="mx-auto text-amber-600" size={28} />}
                                {idx + 1 > 3 && `#${idx + 1}`}
                            </div>

                            <div className="ml-6 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : <User size={24} />}
                            </div>

                            <div className="ml-6 flex-1">
                                <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-500">Student</p>
                            </div>

                            <div className="text-right">
                                <div className="font-bold text-2xl text-blue-600">{user.points}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Points</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
