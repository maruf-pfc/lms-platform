'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Medal, Trophy, User } from 'lucide-react';

export default function LeaderboardPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users/leaderboard')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Leaderboard...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-8 text-center">
                <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
                    <Trophy size={48} className="text-yellow-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
                <p className="text-gray-500">Top learners on the platform</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {users.map((user, index) => (
                    <div key={user._id} className={`flex items-center p-4 border-b last:border-0 hover:bg-gray-50 transition ${index < 3 ? 'bg-yellow-50/30' : ''}`}>
                        <div className="w-12 text-center font-bold text-xl text-gray-400">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </div>
                        <div className="ml-4 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-gray-400" />
                            )}
                        </div>
                        <div className="ml-4 flex-1">
                            <h4 className="font-bold text-gray-900">{user.name}</h4>
                            <p className="text-xs text-gray-500">Student</p>
                        </div>
                        <div className="font-bold text-blue-600 text-lg">
                            {user.points} pts
                        </div>
                    </div>
                ))}
                {users.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No data available.</div>
                )}
            </div>
        </div>
    );
}
