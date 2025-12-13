'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
    BookOpen,
    Layout,
    LogOut,
    Medal,
    MessageSquare,
    PlusCircle,
    Menu,
    X,
    Users,
    FileText,
    BarChart,
    Settings,
    Newspaper,
    User
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => pathname.startsWith(path);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const closeSidebar = () => setIsOpen(false);

    if (!user) return null;

    const NavItem = ({ href, icon: Icon, label }) => (
        <Link
            href={href}
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive(href)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
        >
            <Icon size={20} /> {label}
        </Link>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-slate-900 text-white rounded-lg shadow-md"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative
      `}>
                {/* Brand */}
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold flex items-center gap-2 text-white">
                        <Layout className="text-blue-500" /> LMS Platform
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider pl-8">{user.role}</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavItem href="/dashboard" icon={Layout} label="Dashboard" />

                    {/* Student Links */}
                    {user.role === 'student' && (
                        <>
                            <NavItem href="/courses" icon={BookOpen} label="Explore Courses" />
                            <NavItem href="/leaderboard" icon={Medal} label="Leaderboard" />
                        </>
                    )}

                    {/* Instructor Links */}
                    {user.role === 'instructor' && (
                        <>
                            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase">Instructor</div>
                            <NavItem href="/instructor/create-course" icon={PlusCircle} label="Create Course" />
                            <NavItem href="/courses" icon={BookOpen} label="My Courses" />
                        </>
                    )}

                    {/* Admin Links */}
                    {user.role === 'admin' && (
                        <>
                            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase">Administration</div>
                            <NavItem href="/dashboard" icon={BarChart} label="Analytics" />
                            <NavItem href="/admin/users" icon={Users} label="User Management" />
                            <NavItem href="/courses" icon={BookOpen} label="Manage Courses" />
                        </>
                    )}

                    {/* Common Community Links */}
                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase">Community</div>
                    <NavItem href="/forum" icon={MessageSquare} label="Forum" />
                    <NavItem href="/blog" icon={FileText} label="Blog" />
                    <NavItem href="/news" icon={Newspaper} label="Tech News" />
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <Link href="/profile" className="flex items-center gap-3 mb-4 px-2 hover:bg-slate-800 rounded-lg p-2 transition cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white group-hover:ring-2 ring-blue-500">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 capitalize">{user.email}</p>
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-red-500 hover:bg-slate-800 p-2 rounded-lg transition font-medium text-sm"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
