'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Trash, ChevronRight, ChevronDown, Video, FileText, HelpCircle, Edit2, GripVertical, Trash2 } from 'lucide-react';
import MarkdownEditor from '@/components/ui/MarkdownEditor';

export default function CreateCoursePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [courseId, setCourseId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Course Data
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        category: '',
        thumbnail: 'https://placehold.co/600x400',
    });

    // Modules State
    const [modules, setModules] = useState([]);
    const [newModuleTitle, setNewModuleTitle] = useState('');

    // Lesson Modal
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [editingLessonId, setEditingLessonId] = useState(null);
    const [lessonData, setLessonData] = useState({
        title: '',
        type: 'video',
        content: '',
        url: '',
        url: '',
        duration: 0,
        questions: [], // Array of { questionText, options: [], correctAnswer: '', points: 10 }
    });

    const [editingModuleId, setEditingModuleId] = useState(null);
    const [editingModuleTitle, setEditingModuleTitle] = useState('');

    const createCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/courses', courseData);
            setCourseId(res.data._id);
            setStep(2);
            toast.success('Course created! Now add modules.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    const addModule = async () => {
        if (!newModuleTitle) return;
        try {
            const res = await api.post(`/courses/${courseId}/modules`, {
                title: newModuleTitle,
                order: modules.length
            });
            setModules([...modules, { ...res.data, subModules: [] }]);
            setNewModuleTitle('');
            toast.success('Module added');
        } catch (err) {
            toast.error('Failed to add module');
        }
    };

    const deleteModule = async (moduleId) => {
        if (!confirm('Are you sure you want to delete this module?')) return;
        try {
            await api.delete(`/courses/${courseId}/modules/${moduleId}`);
            setModules(modules.filter(m => m._id !== moduleId));
            toast.success('Module deleted');
        } catch (err) {
            toast.error('Failed to delete module');
        }
    };

    const addLesson = async (e) => {
        e.preventDefault();
        if (!activeModuleId) return;

        try {
            const res = await api.post(`/courses/${courseId}/modules/${activeModuleId}/lessons`, lessonData);
            // res.data is the updated module
            setModules(modules.map(m => m._id === activeModuleId ? res.data : m));
            setLessonData({ title: '', type: 'video', content: '', url: '', duration: 0 }); // Don't close modal to allow adding more? or Maybe just reset
            toast.success('Lesson added');
        } catch (err) {
            toast.error('Failed to add lesson');
        }
    };

    const deleteLesson = async (moduleId, lessonId) => {
        if (!confirm('Delete this lesson?')) return;
        try {
            const res = await api.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
            // res.data is the updated module
            setModules(modules.map(m => m._id === moduleId ? res.data : m));
            toast.success('Lesson deleted');
        } catch (err) {
            toast.error('Failed to delete lesson');
        }
    };

    const updateModuleTitle = async (moduleId) => {
        try {
            const res = await api.put(`/courses/${courseId}/modules/${moduleId}`, { title: editingModuleTitle });
            setModules(modules.map(m => m._id === moduleId ? res.data : m));
            setEditingModuleId(null);
            toast.success('Module updated');
        } catch (err) {
            toast.error('Failed to update module');
        }
    };

    const startEditLesson = (moduleId, lesson) => {
        setActiveModuleId(moduleId);
        setEditingLessonId(lesson._id);
        setLessonData({
            title: lesson.title,
            type: lesson.type,
            content: lesson.content || '',
            url: lesson.url || '',
            duration: lesson.duration || 0
        });
    };

    const saveLesson = async (e) => {
        e.preventDefault();
        if (!activeModuleId) return;

        try {
            if (editingLessonId) {
                // Update
                const res = await api.put(`/courses/${courseId}/modules/${activeModuleId}/lessons/${editingLessonId}`, lessonData);
                setModules(modules.map(m => m._id === activeModuleId ? res.data : m));
                toast.success('Lesson updated');
            } else {
                // Create
                const res = await api.post(`/courses/${courseId}/modules/${activeModuleId}/lessons`, lessonData);
                setModules(modules.map(m => m._id === activeModuleId ? res.data : m));
                toast.success('Lesson added');
            }
            // Reset
            setEditingLessonId(null);
            setLessonData({ title: '', type: 'video', content: '', url: '', duration: 0, questions: [] });
            // Keep modal open? No, maybe close it or keep generic. 
            // If I want to add another, I can click add again.
            // But if I was editing, I should definitely reset.
        } catch (err) {
            toast.error('Failed to save lesson');
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Create New Course</h1>

            {/* Stepper */}
            <div className="flex items-center mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
                <div className="w-16 h-1 bg-gray-200 mx-2"><div className={`h-full bg-blue-600 ${step >= 2 ? 'w-full' : 'w-0'} transition-all`}></div></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
            </div>

            {step === 1 && (
                <form onSubmit={createCourse} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Course Title</label>
                        <input
                            className="w-full border p-2 rounded-lg"
                            value={courseData.title}
                            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            className="w-full border p-2 rounded-lg h-32"
                            value={courseData.description}
                            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            className="w-full border p-2 rounded-lg"
                            value={courseData.category}
                            onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Programming">Programming</option>
                            <option value="Design">Design</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>
                    <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                        {loading ? 'Creating...' : 'Create & Continue'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    {/* Add Module */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border flex gap-4">
                        <input
                            className="flex-1 border p-2 rounded-lg"
                            placeholder="New Module Title..."
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                        />
                        <button onClick={addModule} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">Add Module</button>
                    </div>

                    {/* Modules List */}
                    <div className="space-y-4">
                        {modules.map((module) => (
                            <div key={module._id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                                <div className="p-4 bg-gray-50 items-center justify-between flex border-b">
                                    <div className="flex items-center gap-3 flex-1">
                                        <GripVertical className="text-gray-400 cursor-move" size={20} />
                                        {editingModuleId === module._id ? (
                                            <div className="flex gap-2 flex-1 mr-4">
                                                <input
                                                    className="border p-1 rounded px-2 w-full"
                                                    value={editingModuleTitle}
                                                    onChange={e => setEditingModuleTitle(e.target.value)}
                                                />
                                                <button onClick={() => updateModuleTitle(module._id)} className="bg-blue-600 text-white px-3 rounded text-sm">Save</button>
                                                <button onClick={() => setEditingModuleId(null)} className="text-gray-500 text-sm">Cancel</button>
                                            </div>
                                        ) : (
                                            <h3 className="font-bold text-lg text-gray-800 cursor-pointer hover:text-blue-600" onClick={() => {
                                                setEditingModuleId(module._id);
                                                setEditingModuleTitle(module.title);
                                            }}>
                                                {module.title} <span className="text-xs text-gray-400 ml-2 font-normal">(Click to edit)</span>
                                            </h3>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => deleteModule(module._id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded"
                                            title="Delete Module"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (activeModuleId === module._id) {
                                                    setActiveModuleId(null);
                                                } else {
                                                    setActiveModuleId(module._id);
                                                    setEditingLessonId(null);
                                                    setLessonData({ title: '', type: 'video', content: '', url: '', duration: 0 });
                                                }
                                            }}
                                            className={`text-sm font-semibold px-3 py-1.5 rounded transition ${activeModuleId === module._id ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                }`}
                                        >
                                            {activeModuleId === module._id ? 'Cancel' : '+ Add Lesson'}
                                        </button>
                                    </div>
                                </div>

                                {/* Lessons */}
                                <div className="p-4 space-y-2">
                                    {module.subModules && module.subModules.length === 0 && <p className="text-gray-400 text-sm ml-8">No lessons yet.</p>}
                                    {module.subModules && module.subModules.map((lesson, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group border border-transparent hover:border-gray-200 transition">
                                            <div className="flex items-center gap-3">
                                                {/* <GripVertical className="text-gray-300" size={16} /> */}
                                                {lesson.type === 'video' && <Video size={18} className="text-blue-500" />}
                                                {lesson.type === 'text' && <FileText size={18} className="text-green-500" />}
                                                {lesson.type === 'mcq' && <HelpCircle size={18} className="text-yellow-500" />}
                                                <span className="font-medium text-gray-700">{lesson.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => startEditLesson(module._id, lesson)}
                                                    className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-600 transition"
                                                    title="Edit Lesson"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteLesson(module._id, lesson._id)}
                                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition"
                                                    title="Delete Lesson"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add/Edit Lesson Form Inside Module */}
                                {activeModuleId === module._id && (
                                    <div className="p-6 bg-blue-50/50 border-t">
                                        <h4 className="font-bold text-sm mb-4 text-gray-700 uppercase tracking-wide">
                                            {editingLessonId ? 'Edit Lesson' : 'New Lesson'} Details
                                        </h4>
                                        <form onSubmit={saveLesson} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                                                    <input
                                                        className="w-full border p-2 rounded"
                                                        placeholder="Lesson Title"
                                                        value={lessonData.title}
                                                        onChange={e => setLessonData({ ...lessonData, title: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                                                    <select
                                                        className="w-full border p-2 rounded"
                                                        value={lessonData.type}
                                                        onChange={e => setLessonData({ ...lessonData, type: e.target.value })}
                                                    >
                                                        <option value="video">Video</option>
                                                        <option value="text">Text / Article / Markdown</option>
                                                        <option value="mcq">Quiz (MCQ)</option>
                                                        <option value="project">Project / Assignment</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {lessonData.type === 'video' && (
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1">Video URL</label>
                                                    <input
                                                        className="w-full border p-2 rounded"
                                                        placeholder="YouTube / Vimeo URL"
                                                        value={lessonData.url}
                                                        onChange={e => setLessonData({ ...lessonData, url: e.target.value })}
                                                    />
                                                </div>
                                            )}

                                            {(lessonData.type === 'text' || lessonData.type === 'project') && (
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1">
                                                        {lessonData.type === 'project' ? 'Project Instructions' : 'Content (Markdown)'}
                                                    </label>
                                                    <MarkdownEditor
                                                        value={lessonData.content}
                                                        onChange={(val) => setLessonData({ ...lessonData, content: val })}
                                                    />
                                                </div>
                                            )}

                                            {lessonData.type === 'mcq' && (
                                                <div className="space-y-4 border p-4 rounded bg-white">
                                                    <h3 className="font-bold text-gray-700">Quiz Questions</h3>
                                                    
                                                    {lessonData.questions && lessonData.questions.map((q, qIdx) => (
                                                        <div key={qIdx} className="border p-4 rounded-lg bg-gray-50 relative">
                                                            <button 
                                                                type="button"
                                                                onClick={() => {
                                                                    const newQ = [...lessonData.questions];
                                                                    newQ.splice(qIdx, 1);
                                                                    setLessonData({ ...lessonData, questions: newQ });
                                                                }}
                                                                className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded"
                                                            >
                                                                <Trash size={16} />
                                                            </button>
                                                            
                                                            <div className="mb-2">
                                                                <label className="block text-xs font-bold text-gray-500 mb-1">Question {qIdx + 1}</label>
                                                                <input 
                                                                    className="w-full border p-2 rounded"
                                                                    placeholder="Enter question text"
                                                                    value={q.questionText}
                                                                    onChange={(e) => {
                                                                        const newQ = [...lessonData.questions];
                                                                        newQ[qIdx].questionText = e.target.value;
                                                                        setLessonData({ ...lessonData, questions: newQ });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="my-2">
                                                                <label className="block text-xs font-bold text-gray-500 mb-1">Options</label>
                                                                {q.options.map((opt, oIdx) => (
                                                                    <div key={oIdx} className="flex gap-2 mb-2">
                                                                         <input 
                                                                            className="flex-1 border p-1 rounded text-sm"
                                                                            placeholder={`Option ${oIdx + 1}`}
                                                                            value={opt}
                                                                            onChange={(e) => {
                                                                                const newQ = [...lessonData.questions];
                                                                                newQ[qIdx].options[oIdx] = e.target.value;
                                                                                // If this option was correct and changed, we might need to update correctAnswer logic if we stored index, but we store string. 
                                                                                // Ideally we update the string too if it matches, but for now simple input.
                                                                                setLessonData({ ...lessonData, questions: newQ });
                                                                            }}
                                                                        />
                                                                        <button 
                                                                            type="button"
                                                                            onClick={() => {
                                                                                 const newQ = [...lessonData.questions];
                                                                                 newQ[qIdx].options.splice(oIdx, 1);
                                                                                 setLessonData({ ...lessonData, questions: newQ });
                                                                            }}
                                                                            className="text-red-400 hover:text-red-600"
                                                                        >
                                                                            <Trash size={14} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newQ = [...lessonData.questions];
                                                                        newQ[qIdx].options.push('');
                                                                        setLessonData({ ...lessonData, questions: newQ });
                                                                    }}
                                                                    className="text-xs text-blue-600 font-bold hover:underline"
                                                                >
                                                                    + Add Option
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 mt-3">
                                                                <div>
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1">Correct Answer</label>
                                                                    <select 
                                                                        className="w-full border p-2 rounded"
                                                                        value={q.correctAnswer}
                                                                        onChange={(e) => {
                                                                            const newQ = [...lessonData.questions];
                                                                            newQ[qIdx].correctAnswer = e.target.value;
                                                                            setLessonData({ ...lessonData, questions: newQ });
                                                                        }}
                                                                    >
                                                                        <option value="">Select Correct Option</option>
                                                                        {q.options.map((opt, i) => (
                                                                            opt && <option key={i} value={opt}>{opt}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                     <label className="block text-xs font-bold text-gray-500 mb-1">Points</label>
                                                                     <input 
                                                                        type="number"
                                                                        className="w-full border p-2 rounded"
                                                                        value={q.points}
                                                                        onChange={(e) => {
                                                                            const newQ = [...lessonData.questions];
                                                                            newQ[qIdx].points = parseInt(e.target.value) || 0;
                                                                            setLessonData({ ...lessonData, questions: newQ });
                                                                        }}
                                                                     />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            setLessonData({
                                                                ...lessonData,
                                                                questions: [
                                                                    ...(lessonData.questions || []),
                                                                    { questionText: '', options: ['', '', '', ''], correctAnswer: '', points: 10 }
                                                                ]
                                                            });
                                                        }}
                                                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition font-bold"
                                                    >
                                                        + Add Question
                                                    </button>
                                                </div>
                                            )}

                                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 w-full md:w-auto">
                                                Save Lesson
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-8">
                        <button onClick={() => router.push('/courses')} className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition shadow-lg">
                            Finish & Publish Course
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
