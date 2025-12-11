'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useCourseStore } from '@/store/useCourseStore';
import { Lock, Unlock, PlayCircle, FileText, CheckCircle } from 'lucide-react';

export default function CourseDetailsPage() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]); // In real app, modules should be fetched via /courses/:id/modules
    const [loading, setLoading] = useState(true);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user, isAuthenticated } = useAuthStore();
    const { enrollCourse } = useCourseStore();
    const router = useRouter();

    // Helper to check if enrolled
    const isEnrolled = user?.enrolledCourses?.some(e => e.course === id || e.course._id === id);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await api.get(`/courses/${id}`);
                setCourse(data);
                // Mock modules fetch if API doesn't return them formatted fully
                // But our seed data didn't expose modules in getCourseById yet.
                // We need to implement getModulesForCourse backend or populate it.
                // For now, let's assume getCourseById populates modules? 
                // Wait, backend getCourseById didn't populate modules! (It was ref? No, Course model doesn't ref Modules. Modules ref Course.)
                // I need to add an endpoint to get modules for a course.
            } catch (err) {
                setError("Failed to load course");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleEnroll = async () => {
        if (!isAuthenticated) return router.push('/login');

        setEnrollLoading(true);
        try {
            await enrollCourse(id);
            alert("Enrolled successfully!");
            router.refresh();
            // Re-fetch user to update enrolled list
            // In a real app, useAuthStore should handle re-fetching 'me'.
            // For now, simple redirect
            router.push('/dashboard');
        } catch (err) {
            alert(err);
        } finally {
            setEnrollLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!course) return <div className="p-8">Course not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl">{course.description}</p>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {course.instructor?.name?.[0]}
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Instructor</div>
                                <div className="font-medium">{course.instructor?.name}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        {isEnrolled ? (
                            <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition">
                                Continue Learning
                            </button>
                        ) : (
                            <button
                                onClick={handleEnroll}
                                disabled={enrollLoading}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {enrollLoading ? 'Processing...' : 'Enroll Now - Free'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modules List */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>

                {course.modules && course.modules.length > 0 ? (
                    <div className="space-y-4">
                        {course.modules.map((module) => (
                            <div key={module._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                    <span className="text-sm text-gray-500">{module.subModules?.length || 0} items</span>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {module.subModules?.map((sub, idx) => (
                                        <div key={idx} className="px-6 py-3 flex items-center gap-3 text-sm hover:bg-gray-50 transition-colors">
                                            {sub.type === 'video' && <PlayCircle size={16} className="text-blue-500" />}
                                            {sub.type === 'documentation' && <FileText size={16} className="text-gray-500" />}
                                            {sub.type === 'mcq' && <CheckCircle size={16} className="text-green-500" />}
                                            <span className="text-gray-700">{sub.title}</span>

                                            {/* Lock Icon - If not enrolled or previous not completed (logic can be complex, for now just show unlocked for first module) */}
                                            {!isEnrolled && module.order > 1 ? (
                                                <Lock size={14} className="ml-auto text-gray-400" />
                                            ) : (
                                                <Unlock size={14} className="ml-auto text-green-400 opacity-0" /> // Hidden spacer or show unlock
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 border border-dashed border-gray-300">
                        No modules available yet.
                    </div>
                )}
            </div>
        </div>
    );
}
