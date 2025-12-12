import Link from 'next/link';
import { BookOpen, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 text-white flex flex-col">
      <nav className="p-6 max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="text-blue-400" /> LMS Platform
        </div>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 hover:text-blue-300 transition">Log In</Link>
          <Link href="/register" className="px-4 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 transition">Get Started</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
          Master New Skills.<br />Advance Your Career.
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mb-10">
          Join thousands of learners on the most advanced learning management system.
          Create, share, and learn with ease.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="px-8 py-4 bg-blue-600 rounded-xl font-bold text-lg hover:bg-blue-500 transition flex items-center justify-center gap-2">
            Start Learning Now <ArrowRight size={20} />
          </Link>
          <Link href="/courses" className="px-8 py-4 bg-gray-800 rounded-xl font-bold text-lg hover:bg-gray-700 transition">
            Browse Courses
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl text-left">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <CheckCircle className="text-green-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Expert Instructors</h3>
            <p className="text-gray-400">Learn from industry experts sharing real-world experience.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <CheckCircle className="text-blue-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Interactive Learning</h3>
            <p className="text-gray-400">Quizzes, assignments, and discussions to enforce learning.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <CheckCircle className="text-purple-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Track Progress</h3>
            <p className="text-gray-400">Visualize your journey and earn certificates upon completion.</p>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-gray-500 text-sm">
        © 2025 LMS Platform. Built with Next.js & Node.js.
      </footer>
    </div>
  );
}
