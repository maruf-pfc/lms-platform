'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { BookOpen, Users, BarChart, Medal, MessageSquare, Plus, LogOut, Layout, Award, DollarSign } from 'lucide-react';

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [instructorStats, setInstructorStats] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            if (user?.role === 'admin') {
                api.get('/admin/stats').then(res => setStats(res.data)).catch(err => console.error(err));
            } else if (user?.role === 'instructor') {
                api.get('/courses/instructor/stats').then(res => setInstructorStats(res.data)).catch(err => console.error(err));
            }
        }
    }, [isAuthenticated, router, user]);

    if (!isAuthenticated && !user) return null; // Router will push to login
    if (!user) return <div className="p-8">Loading Dashboard...</div>;

    return (
        <div className="p-8">
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
                </div>
            )}

            {/* INSTRUCTOR VIEW */}
            {user.role === 'instructor' && (
                <div className="space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><BookOpen size={24} /></div>
                            <div>
                                <div className="text-gray-500 text-sm">My Courses</div>
                                <div className="text-2xl font-bold">{instructorStats?.courses?.length || 0}</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-full text-green-600"><Users size={24} /></div>
                            <div>
                                <div className="text-gray-500 text-sm">Total Students</div>
                                <div className="text-2xl font-bold">{instructorStats?.totalStudents || 0}</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
                            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600"><DollarSign size={24} /></div>
                            <div>
                                <div className="text-gray-500 text-sm">Earnings</div>
                                <div className="text-2xl font-bold">${instructorStats?.totalEarnings || 0}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 rounded-2xl p-8 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">Create a New Course</h3>
                            <p className="text-blue-100">Share your knowledge with the world.</p>
                        </div>
                        <Link href="/instructor/create-course" className="relative z-10 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
                            Create Course
                        </Link>
                        {/* Decor */}
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                            <BookOpen size={200} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">My Courses</h3>
                        {instructorStats?.courses?.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {instructorStats.courses.map(course => (
                                    <div key={course._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-lg mb-2 truncate">{course.title}</h4>
                                        <p className="text-sm text-gray-500 mb-4">{course.enrolledCount} students</p>
                                        <div className="flex gap-4 mt-2">
                                            <Link href={`/courses/${course._id}`} className="text-blue-600 text-sm font-bold hover:underline">View</Link>
                                            <Link href={`/instructor/edit-course/${course._id}`} className="text-green-600 text-sm font-bold hover:underline">Edit</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-dashed">
                                You haven't created any courses yet.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STUDENT VIEW */}
            {user.role === 'student' && (
                <div className="space-y-8">
                    {/* Enrollments */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BookOpen size={24} className="text-blue-600" /> My Enrollments
                        </h3>

                        {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {user.enrolledCourses.map(enrollment => {
                                    const course = enrollment.course;
                                    const courseId = typeof course === 'object' ? course._id : course;
                                    const courseTitle = typeof course === 'object' ? course.title : 'Course Listing';

                                    return (
                                        <Link href={`/learning/${courseId}`} key={enrollment._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 block group">
                                            <h4 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-blue-600 transition">
                                                {courseTitle}
                                            </h4>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${enrollment.progress}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">{enrollment.progress}% Complete</span>
                                                <span className="text-blue-600 font-semibold">Continue Learning</span>
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

                    {/* Certificates (Placeholder for Phase 3) */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Award size={24} className="text-yellow-600" /> My Certificates
                        </h3>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-32 text-gray-400">
                            Complete a course to earn certificates!
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
