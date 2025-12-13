'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Trash, ChevronRight, ChevronDown, Video, FileText, HelpCircle, Edit2, GripVertical, Trash2, Code } from 'lucide-react';
import MarkdownEditor from '@/components/ui/MarkdownEditor';

export default function EditCoursePage() {
    const router = useRouter();
    const { courseId } = useParams();
    const [activeTab, setActiveTab] = useState('modules'); // 'modules' or 'settings'
    const [loading, setLoading] = useState(true);

    // Course Data
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        category: '',
        thumbnail: '',
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
        duration: 0,
    });

    const [editingModuleId, setEditingModuleId] = useState(null);
    const [editingModuleTitle, setEditingModuleTitle] = useState('');

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            const res = await api.get(`/courses/${courseId}`);
            const course = res.data;
            setCourseData({
                title: course.title,
                description: course.description,
                category: course.category,
                thumbnail: course.thumbnail || '',
            });
            // Ideally backend getCourse returns modules or we fetch them separately
            // If getCourse includes modules:
            if (course.modules) {
                setModules(course.modules);
            } else {
                // Fetch modules explicitly if not included
                // const modRes = await api.get(`/courses/${courseId}/modules`);
                // setModules(modRes.data);
            }
            setLoading(false);
        } catch (err) {
            toast.error('Failed to load course details');
            setLoading(false);
        }
    };

    const updateCourse = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/courses/${courseId}`, courseData);
            toast.success('Course details updated!');
        } catch (err) {
            toast.error('Failed to update course');
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

    const saveLesson = async (e) => {
        e.preventDefault();
        if (!activeModuleId) return;

        try {
            let res;
            if (editingLessonId) {
                res = await api.put(`/courses/${courseId}/modules/${activeModuleId}/lessons/${editingLessonId}`, lessonData);
                toast.success('Lesson updated');
            } else {
                res = await api.post(`/courses/${courseId}/modules/${activeModuleId}/lessons`, lessonData);
                toast.success('Lesson added');
            }
            // res.data is the updated module usually? Or lesson?
            // Earlier implementation: backend returns updated MODULE
            // Verification: check backend implementation.
            // If we assume backend returns updated module:
            setModules(modules.map(m => m._id === activeModuleId ? res.data : m));

            // Reset
            setEditingLessonId(null);
            setLessonData({ title: '', type: 'video', content: '', url: '', duration: 0 });
        } catch (err) {
            toast.error('Failed to save lesson');
        }
    };

    const deleteLesson = async (moduleId, lessonId) => {
        if (!confirm('Delete this lesson?')) return;
        try {
            const res = await api.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
            setModules(modules.map(m => m._id === moduleId ? res.data : m));
            toast.success('Lesson deleted');
        } catch (err) {
            toast.error('Failed to delete lesson');
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

    if (loading) return <div className="p-8">Loading Course...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Edit Course: {courseData.title}</h1>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('modules')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'modules' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>Modules</button>
                    <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>Settings</button>
                </div>
            </header>

            {activeTab === 'settings' && (
                <form onSubmit={updateCourse} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
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
                    {/* Add more setting fields like category/thumbnail */}
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">Save Changes</button>
                </form>
            )}

            {activeTab === 'modules' && (
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

                    {/* Modules List - Reuse Loop */}
                    <div className="space-y-4">
                        {modules.map((module) => (
                            <div key={module._id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                                {/* Header */}
                                <div className="p-4 bg-gray-50 items-center justify-between flex border-b">
                                    <div className="flex items-center gap-3 flex-1">
                                        <GripVertical className="text-gray-400" size={20} />
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
                                        <button onClick={() => deleteModule(module._id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
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
                                            className={`text-sm font-semibold px-3 py-1.5 rounded transition ${activeModuleId === module._id ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                        >
                                            {activeModuleId === module._id ? 'Cancel' : '+ Add Lesson'}
                                        </button>
                                    </div>
                                </div>

                                {/* Lessons inside Module */}
                                <div className="p-4 space-y-2">
                                    {module.subModules && module.subModules.map((lesson, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200">
                                            <div className="flex items-center gap-3">
                                                {lesson.type === 'video' && <Video size={18} className="text-blue-500" />}
                                                {lesson.type === 'text' && <FileText size={18} className="text-green-500" />}
                                                {lesson.type === 'mcq' && <HelpCircle size={18} className="text-yellow-500" />}
                                                {lesson.type === 'project' && <Code size={18} className="text-purple-500" />}
                                                <span className="font-medium text-gray-700">{lesson.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => startEditLesson(module._id, lesson)} className="text-blue-400 hover:text-blue-600"><Edit2 size={16} /></button>
                                                <button onClick={() => deleteLesson(module._id, lesson._id)} className="text-red-400 hover:text-red-600"><Trash size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Lesson Editor Form */}
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

                                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 w-full md:w-auto">
                                                Save Lesson
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
