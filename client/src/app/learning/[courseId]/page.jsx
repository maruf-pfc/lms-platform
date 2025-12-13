'use client';

import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle, PlayCircle, FileText, ChevronLeft, Menu, HelpCircle, Lock, Code, Award, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import MCQPlayer from '@/components/course/MCQPlayer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
                const fetchedCourse = courseRes.data;
                setCourse(fetchedCourse);

                // Get user enrollment to track progress
                const meRes = await api.get('/auth/me');
                let completed = [];
                if (meRes.data.enrolledCourses) {
                    const enrollment = meRes.data.enrolledCourses.find(e => e.course === courseId);
                    if (enrollment) {
                        completed = enrollment.completedModules;
                        setCompletedModules(completed);
                    }
                }

                // Auto-Resume: Find first incomplete module and select its first lesson
                // Or if all complete, select first module
                if (fetchedCourse.modules && fetchedCourse.modules.length > 0) {
                     let targetModule = fetchedCourse.modules[0];
                     // Find first module that is NOT in completed list
                     for (const mod of fetchedCourse.modules) {
                         if (!completed.includes(mod._id)) {
                             targetModule = mod;
                             break;
                         }
                     }
                     
                     // Select first lesson of that module
                     if (targetModule && targetModule.subModules && targetModule.subModules.length > 0) {
                         setActiveLesson(targetModule.subModules[0]);
                         setActiveModuleId(targetModule._id);
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
                setCompletedModules(prev => [...prev, activeModuleId]);
            }
            
            // Auto-advance logic could go here (optional, strictly requested is just auto-resume on load)
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
                setCompletedModules(prev => [...prev, activeModuleId]);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Submission failed");
        }
    };

    if (!course) return <div className="p-8 text-center text-white">Loading Course...</div>;

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Main Content Area (Player) */}
            <div className={`flex-1 flex flex-col ${showSidebar ? 'mr-80' : ''} transition-all duration-300`}>
                <header className="h-16 flex items-center px-4 bg-muted/40 border-b border-border justify-between">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                        <ChevronLeft size={20} /> Back to Dashboard
                    </Button>
                    <h1 className="font-bold truncate max-w-xl text-lg">{course.title}</h1>
                    <Button variant="ghost" size="icon" onClick={() => setShowSidebar(!showSidebar)} className="md:hidden">
                        <Menu size={20} />
                    </Button>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto bg-muted/20">
                    {activeLesson ? (
                        <div className="w-full max-w-5xl space-y-4 h-full flex flex-col justify-center">
                            {activeLesson.type === 'video' ? (
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-border">
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
                                <Card className="flex-1 overflow-hidden flex flex-col h-full border-border shadow-md">
                                    <CardHeader className="border-b border-border bg-card">
                                        <CardTitle>{activeLesson.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto p-8 space-y-8">
                                         <div className="prose dark:prose-invert max-w-none">
                                            <h3 className="text-xl font-bold text-primary mb-4">Project Instructions</h3>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeLesson.content}</ReactMarkdown>
                                        </div>

                                        <Card className="bg-muted/50 border-dashed border-2">
                                            <CardContent className="pt-6">
                                                <h3 className="font-bold mb-2 flex items-center gap-2 text-lg"><Code size={20} className="text-primary" /> Submit Your Project</h3>
                                                <p className="text-sm text-muted-foreground mb-4">Upload your code to GitHub and paste the repository URL below.</p>
                                                <div className="flex gap-2">
                                                    <Input
                                                        className="flex-1 bg-background"
                                                        placeholder="https://github.com/username/repo"
                                                        value={repoUrl}
                                                        onChange={e => setRepoUrl(e.target.value)}
                                                    />
                                                    <Button onClick={submitProject}>Submit</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="flex-1 overflow-hidden flex flex-col h-full border-border shadow-md">
                                    <CardHeader className="border-b border-border bg-card">
                                        <CardTitle>{activeLesson.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto p-8">
                                        <div className="prose dark:prose-invert max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeLesson.content}</ReactMarkdown>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {(activeLesson.type !== 'mcq' && activeLesson.type !== 'project') && (
                                <Card className="bg-card border-border p-4 flex justify-between items-center shadow-md">
                                    <h2 className="text-lg font-bold">{activeLesson.title}</h2>
                                    <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700 text-white">
                                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                                    </Button>
                                </Card>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <PlayCircle size={64} className="mx-auto mb-4 opacity-20" />
                            <p className="text-xl font-medium">Select a lesson to start learning</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Sidebar (Curriculum) */}
            <aside className={`fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border flex flex-col transition-transform duration-300 z-20 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/40 h-16">
                    <h3 className="font-bold flex items-center gap-2"><Layers size={18} /> Course Content</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)} className="md:hidden">
                        <ChevronLeft size={20} />
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {course.modules && course.modules.map((module, i) => {
                        const isModuleCompleted = completedModules.includes(module._id);
                        // Module is locked IF: Not first module AND Previous module is NOT completed
                        let isLocked = false;
                        if (i > 0) {
                            // Traverse backwards to find the last *non-empty* module
                            let prevIndex = i - 1;
                            let prevModule = course.modules[prevIndex];
                            
                            // If previous module is empty, it shouldn't block. 
                            // We keep going back until we find a non-empty one or hit start.
                            while (prevIndex >= 0 && (!prevModule.subModules || prevModule.subModules.length === 0)) {
                                prevIndex--;
                                prevModule = course.modules[prevIndex];
                            }

                            if (prevIndex >= 0) {
                                // We found a non-empty previous module, check if it is completed
                                if (!completedModules.includes(prevModule._id)) {
                                    isLocked = true;
                                }
                            }
                        }

                        return (
                            <div key={module._id} className={isLocked ? 'opacity-50 pointer-events-none grayscale' : ''}>
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Module {i + 1}: {module.title}</h4>
                                    {isModuleCompleted ? (
                                        <CheckCircle size={14} className="text-green-500" />
                                    ) : isLocked ? (
                                        <Lock size={14} className="text-muted-foreground" />
                                    ) : null}
                                </div>
                                <div className="space-y-1">
                                    {module.subModules && module.subModules.map((lesson, j) => (
                                        <button
                                            key={j}
                                            disabled={isLocked}
                                            onClick={() => handleSelectLesson(lesson, module._id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-all text-sm ${activeLesson === lesson 
                                                ? 'bg-primary text-primary-foreground shadow-sm font-medium' 
                                                : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                                                }`}
                                        >
                                            {lesson.type === 'video' && <PlayCircle size={16} />}
                                            {lesson.type === 'text' && <FileText size={16} />}
                                            {lesson.type === 'mcq' && <HelpCircle size={16} />}
                                            {lesson.type === 'project' && <Code size={16} />}
                                            <span className="truncate">{lesson.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>
            
            {/* Certificate Modal or logic can go here, but for now just a button in sidebar or main area */}
            <div className="fixed bottom-8 right-8 z-50">
                 {course.modules && completedModules.length === course.modules.length && course.modules.length > 0 && (
                     <Button 
                        onClick={() => toast.success("Certificate functionalities will be implemented in the backend!")} 
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-xl animate-bounce rounded-full px-6 h-12"
                    >
                        <Award size={20} className="mr-2" /> Claim Certificate
                     </Button>
                 )}
            </div>
        </div>
    );
}
