import Link from 'next/link';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-xl text-white">
                        <BookOpen className="text-blue-500" /> LMS Platform
                    </div>
                    <p className="text-sm text-slate-400">
                        Empowering learners worldwide with cutting-edge skills and expert guidance.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a href="#" className="hover:text-blue-500 transition"><Twitter size={20}/></a>
                        <a href="#" className="hover:text-blue-500 transition"><Github size={20}/></a>
                        <a href="#" className="hover:text-blue-500 transition"><Linkedin size={20}/></a>
                    </div>
                </div>

                {/* Platform */}
                <div>
                    <h3 className="font-bold text-white mb-4">Platform</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/courses" className="hover:text-blue-400 transition">Browse Courses</Link></li>
                        <li><Link href="/pricing" className="hover:text-blue-400 transition">Pricing</Link></li>
                        <li><Link href="/for-business" className="hover:text-blue-400 transition">For Business</Link></li>
                        <li><Link href="/become-instructor" className="hover:text-blue-400 transition">Become an Instructor</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="font-bold text-white mb-4">Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/faq" className="hover:text-blue-400 transition">Help Center / FAQ</Link></li>
                        <li><Link href="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
                        <li><Link href="/community" className="hover:text-blue-400 transition">Community Forum</Link></li>
                        <li><Link href="/status" className="hover:text-blue-400 transition">System Status</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="font-bold text-white mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
                        <li><Link href="/cookies" className="hover:text-blue-400 transition">Cookie Policy</Link></li>
                        <li><Link href="/about" className="hover:text-blue-400 transition">About Us</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} LMS Platform. All rights reserved.
            </div>
        </footer>
    );
}
