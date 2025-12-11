'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { User, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [role, setRole] = useState(null); // 'student' | 'instructor'
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuthStore();
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register({ ...formData, role });
            router.push('/dashboard'); // Redirect to dashboard after success
        } catch (err) {
            setError(err.toString());
        } finally {
            setIsLoading(false);
        }
    };

    if (!role) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-4xl w-full space-y-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Join as a...</h1>
                    <p className="text-lg text-gray-600">Choose your path to get started</p>

                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <button
                            onClick={() => setRole('student')}
                            className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-md transition-all duration-300"
                        >
                            <div className="p-4 bg-blue-100 rounded-full text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                <BookOpen size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Student</h3>
                            <p className="text-gray-500 mt-2">I want to learn and enroll in courses</p>
                        </button>

                        <button
                            onClick={() => setRole('instructor')}
                            className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-indigo-500 hover:shadow-md transition-all duration-300"
                        >
                            <div className="p-4 bg-indigo-100 rounded-full text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                                <GraduationCap size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Instructor</h3>
                            <p className="text-gray-500 mt-2">I want to teach and create content</p>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link href="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-500 mt-2">Signing up as <span className="font-semibold text-blue-600 capitalize">{role}</span></p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                    >
                        <span>{isLoading ? 'Creating Account...' : 'Get Started'}</span>
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <button onClick={() => setRole(null)} className="text-gray-500 hover:text-gray-900 hover:underline">
                        Change Role
                    </button>
                </div>
            </div>
        </div>
    );
}
