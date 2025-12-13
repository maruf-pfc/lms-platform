'use client';

import { useEffect } from 'react';
import { useCourseStore } from '@/store/useCourseStore';
import Link from 'next/link';

export default function CoursesPage() {
    const { courses, fetchCourses, isLoading } = useCourseStore();

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    if (isLoading) return <div className="p-8 text-center">Loading courses...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Explore Courses</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-48 bg-gray-200 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {course.thumbnail && (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold">
                                    {course.category}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{course.description}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="text-sm text-gray-500">
                                        By {course.instructor?.name || 'Instructor'}
                                    </div>
                                    <Link
                                        href={`/courses/${course._id}`}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                                    >
                                        View Course
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
