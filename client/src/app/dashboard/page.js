'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { BookOpen, Users, BarChart, Medal, MessageSquare, Plus, LogOut, Layout } from 'lucide-react';

export default function DashboardPage() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            if (user?.role === 'admin') {
                api.get('/admin/stats').then(res => setStats(res.data)).catch(err => console.error(err));
            }
        }
    }, [isAuthenticated, router, user]);

    if (!user) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Layout /> LMS Platform
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
                        <Layout size={20} /> Dashboard
                    </Link>
                    <Link href="/courses" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
                        <BookOpen size={20} /> Courses
                    </Link>
                    <Link href="/leaderboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
                        <Medal size={20} /> Leaderboard
                    </Link>
                    <Link href="/forum" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
                        <MessageSquare size={20} /> Community
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                            {user.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); router.push('/login'); }}
                        className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back, {user.name}!</h2>
                    <p className="text-gray-500 mt-2">Here is what is happening with your learning journey.</p>
                </header>

                {/* ADMIN VIEW */}
                {user.role === 'admin' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-gray-500 text-sm font-medium mb-1">Total Users</div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.totalUsers || '...'}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-gray-500 text-sm font-medium mb-1">Total Courses</div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.totalCourses || '...'}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-gray-500 text-sm font-medium mb-1">Students</div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.students || '...'}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-gray-500 text-sm font-medium mb-1">Instructors</div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.instructors || '...'}</div>
                        </div>
                    </div>
                )}

                {/* INSTRUCTOR VIEW */}
                {user.role === 'instructor' && (
                    <div className="space-y-6">
                        <div className="bg-blue-600 rounded-2xl p-8 text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Create a New Course</h3>
                                <p className="text-blue-100">Share your knowledge with the world.</p>
                            </div>
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
                                Create Course
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">My Courses</h3>
                        <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-dashed">
                            You haven't created any courses yet.
                        </div>
                    </div>
                )}

                {/* STUDENT VIEW */}
                {user.role === 'student' && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BookOpen size={24} className="text-blue-600" /> My Enrollments
                        </h3>

                        {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {user.enrolledCourses.map(enrollment => {
                                    const course = enrollment.course; // If populated, otherwise generic
                                    // Note: zustand user object might not have deep populated course info unless login returned it.
                                    // Check auth service login return. It returned generic user info. 
                                    // We might need to handle this display carefully or refetch user profile.
                                    // For MVP, assuming rudimentary display.
                                    return (
                                        <Link href={typeof course === 'object' ? `/courses/${course._id}` : '#'} key={enrollment._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 block">
                                            <h4 className="font-bold text-lg mb-2 text-gray-800">
                                                {typeof course === 'object' ? course.title : 'Course ID: ' + course}
                                            </h4>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${enrollment.progress}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">{enrollment.progress}% Complete</span>
                                                <span className="text-blue-600 font-semibold">Continue</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-xl text-center border-2 border-dashed border-gray-200">
                                <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                                <h4 className="text-lg font-bold text-gray-900">No active enrollments</h4>
                                <p className="text-gray-500 mb-6">Explore our catalog and start learning today.</p>
                                <Link href="/courses" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
                                    Browse Courses
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
