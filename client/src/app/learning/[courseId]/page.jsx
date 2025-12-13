'use client';

import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle, PlayCircle, FileText, ChevronLeft, Menu, HelpCircle, Lock, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import MCQPlayer from '@/components/course/MCQPlayer';

export default function LearningPage() {
    const { courseId } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [completedModules, setCompletedModules] = useState([]);
    const [showSidebar, setShowSidebar] = useState(true);
    const [repoUrl, setRepoUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get course details (populated with modules)
                const courseRes = await api.get(`/courses/${courseId}`);
                setCourse(courseRes.data);

                // Get user enrollment to track progress
                const meRes = await api.get('/auth/me');
                if (meRes.data.enrolledCourses) {
                    const enrollment = meRes.data.enrolledCourses.find(e => e.course === courseId);
                    if (enrollment) {
                        setCompletedModules(enrollment.completedModules);
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load course data');
            }
        };
        fetchData();
    }, [courseId]);

    // Handle selecting a lesson
    const handleSelectLesson = (lesson, moduleId) => {
        setActiveLesson(lesson);
        setActiveModuleId(moduleId);
        setRepoUrl(''); // Reset repo url
    };

    const handleComplete = async () => {
        if (!activeLesson) return;
        try {
            await api.post(`/courses/${courseId}/modules/${activeModuleId}/complete`, {
                moduleId: activeModuleId
            });

            // Optimistically update
            if (!completedModules.includes(activeModuleId)) {
                setCompletedModules([...completedModules, activeModuleId]);
            }

            toast.success('Module segment completed');
        } catch (err) {
            // ignore if already complete or error
        }
    };

    const submitProject = async () => {
        if (!repoUrl) return toast.error("Please enter a GitHub URL");
        try {
            await api.post(`/courses/${courseId}/modules/${activeModuleId}/submit-project`, {
                repoUrl
            });
            toast.success("Project submitted successfully!");
            if (!completedModules.includes(activeModuleId)) {
                setCompletedModules([...completedModules, activeModuleId]);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Submission failed");
        }
    };

    if (!course) return <div className="p-8 text-center text-white">Loading Course...</div>;

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Main Content Area (Player) */}
            <div className={`flex-1 flex flex-col ${showSidebar ? 'mr-80' : ''} transition-all duration-300`}>
                <header className="h-16 flex items-center px-4 bg-gray-800 border-b border-gray-700 justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-300 hover:text-white">
                        <ChevronLeft /> Back to Dashboard
                    </button>
                    <h1 className="font-bold truncate max-w-xl">{course.title}</h1>
                    <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden">
                        <Menu />
                    </button>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
                    {activeLesson ? (
                        <div className="w-full max-w-5xl space-y-4 h-full flex flex-col justify-center">
                            {activeLesson.type === 'video' ? (
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                                    <ReactPlayer
                                        url={activeLesson.url}
                                        width="100%"
                                        height="100%"
                                        controls
                                        onEnded={handleComplete}
                                    />
                                </div>
                            ) : activeLesson.type === 'mcq' ? (
                                <MCQPlayer
                                    courseId={courseId}
                                    moduleId={activeModuleId}
                                    lesson={activeLesson}
                                    onComplete={handleComplete}
                                />
                            ) : activeLesson.type === 'project' ? (
                                <div className="p-8 h-full overflow-y-auto bg-gray-800 rounded-xl shadow-2xl">
                                    <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">{activeLesson.title}</h2>
                                    <div className="prose prose-invert max-w-none mb-8">
                                        <h3 className="text-xl font-bold text-blue-400">Project Instructions</h3>
                                        <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
                                        {/* Ideally parse markdown here */}
                                    </div>
                                    <div className="bg-gray-750 border border-gray-700 p-6 rounded-lg">
                                        <h3 className="font-bold mb-2 flex items-center gap-2"><Code size={20} /> Submit Your Project</h3>
                                        <p className="text-sm text-gray-400 mb-4">Upload your code to GitHub and paste the repository URL below.</p>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="https://github.com/username/repo"
                                                value={repoUrl}
                                                onChange={e => setRepoUrl(e.target.value)}
                                            />
                                            <button onClick={submitProject} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 h-full overflow-y-auto bg-gray-800 rounded-xl shadow-2xl">
                                    <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">{activeLesson.title}</h2>
                                    <div className="prose prose-invert max-w-none">
                                        {/* Simple rendering for now, maybe use react-markdown later if needed for display */}
                                        {activeLesson.content}
                                    </div>
                                </div>
                            )}

                            {(activeLesson.type !== 'mcq' && activeLesson.type !== 'project') && (
                                <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl">
                                    <h2 className="text-xl font-bold">{activeLesson.title}</h2>
                                    <button onClick={handleComplete} className="bg-green-600 px-6 py-2 rounded-lg font-bold hover:bg-green-700">
                                        Mark as Complete
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <PlayCircle size={64} className="mx-auto mb-4 opacity-50" />
                            <p className="text-xl">Select a lesson to start learning</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Sidebar (Curriculum) */}
            <aside className={`fixed right-0 top-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 flex flex-col transition-transform duration-300 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold">Course Content</h3>
                    <button onClick={() => setShowSidebar(false)} className="md:hidden"><CheckCircle /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {course.modules && course.modules.map((module, i) => {
                        const isModuleCompleted = completedModules.includes(module._id);
                        // Module is locked IF: Not first module AND Previous module is NOT completed
                        let isLocked = false;
                        if (i > 0) {
                            const prevModuleId = course.modules[i - 1]._id;
                            if (!completedModules.includes(prevModuleId)) {
                                isLocked = true;
                            }
                        }

                        return (
                            <div key={module._id} className={isLocked ? 'opacity-50 pointer-events-none grayscale' : ''}>
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">Module {i + 1}: {module.title}</h4>
                                    {isModuleCompleted ? (
                                        <CheckCircle size={14} className="text-green-500" />
                                    ) : isLocked ? (
                                        <Lock size={14} className="text-gray-500" />
                                    ) : null}
                                </div>
                                <div className="space-y-1">
                                    {module.subModules && module.subModules.map((lesson, j) => (
                                        <button
                                            key={j}
                                            disabled={isLocked}
                                            onClick={() => handleSelectLesson(lesson, module._id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${activeLesson === lesson ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'
                                                }`}
                                        >
                                            {lesson.type === 'video' && <PlayCircle size={16} />}
                                            {lesson.type === 'text' && <FileText size={16} />}
                                            {lesson.type === 'mcq' && <HelpCircle size={16} />}
                                            {lesson.type === 'project' && <Code size={16} />}
                                            <span className="text-sm font-medium line-clamp-1">{lesson.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>
        </div>
    );
}
