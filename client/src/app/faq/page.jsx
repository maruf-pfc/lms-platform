'use client';
import Footer from '@/components/layout/Footer';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqs = [
    { 
        q: "How do I enroll in a course?", 
        a: "Simply browse our catalog, click on a course you like, and hit the 'Enroll Now' button. If it's your first time, you'll be asked to create an account."
    },
    { 
        q: "Can I get a refund?", 
        a: "Yes, we offer a 30-day money-back guarantee for all paid courses. Contact support if you are not satisfied."
    },
    { 
        q: "Do I get a certificate?", 
        a: "Yes! Upon completing all modules and passing the final quiz for a course, you will receive a verifiable digital certificate."
    },
    { 
        q: "Can I teach on this platform?", 
        a: "Absolutely. Sign up for an account and navigate to 'Become an Instructor' in your profile settings to request instructor access."
    },
     { 
        q: "Is there a mobile app?", 
        a: "Currently we refuse a web-based platform that is fully responsive on mobile devices. A native app is on our roadmap for next year."
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <main className="flex-grow container mx-auto px-6 py-12 max-w-3xl">
                <div className="text-center mb-12">
                     <h1 className="text-4xl font-bold mb-4 text-slate-900">Frequently Asked Questions</h1>
                     <p className="text-slate-600 text-lg">Have questions? We're here to help.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((item, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition"
                            >
                                <span className="font-bold text-slate-800 text-lg">{item.q}</span>
                                {openIndex === i ? <ChevronUp className="text-blue-600"/> : <ChevronDown className="text-gray-400"/>}
                            </button>
                            {openIndex === i && (
                                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t bg-slate-50/50">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center p-8 bg-blue-50 rounded-2xl">
                    <HelpCircle className="mx-auto text-blue-600 mb-4" size={32}/>
                    <h3 className="font-bold text-xl mb-2">Still have questions?</h3>
                    <p className="text-slate-600 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <a href="/contact" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">Contact Support</a>
                </div>
            </main>
            <Footer />
        </div>
    );
}
