'use client';

import Link from 'next/link';
import { BookOpen, User, LogOut, Layout } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const pathname = usePathname();

    const isActive = (path) => pathname.startsWith(path);

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
                        <BookOpen className="text-blue-600" />
                        <span>LMS Platform</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link 
                            href="/courses" 
                            className={`text-sm font-medium transition-colors ${isActive('/courses') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Browse Courses
                        </Link>
                        <Link 
                            href="/forum" 
                            className={`text-sm font-medium transition-colors ${isActive('/forum') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Forum
                        </Link>
                        <Link 
                            href="/blog" 
                            className={`text-sm font-medium transition-colors ${isActive('/blog') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Blog
                        </Link>
                         <Link 
                            href="/news" 
                            className={`text-sm font-medium transition-colors ${isActive('/news') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            News
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link 
                                href="/dashboard" 
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                            >
                                <Layout size={18} />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <>
                                <Link 
                                    href="/login" 
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Log In
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-500 transition"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
