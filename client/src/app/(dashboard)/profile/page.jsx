'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Briefcase, GraduationCap, Code, Shield, Trash2, Camera, Upload, Plus, X } from 'lucide-react';

export default function ProfilePage() {
    const { user, checkAuth } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal'); // personal, experience, education, skills, security
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        headline: '',
        bio: '',
        socialLinks: { website: '', linkedin: '', github: '', twitter: '' },
        skills: [],
        experience: [],
        education: [],
        cv: ''
    });

    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // Re-fetch user data to get full profile
            await checkAuth(); // Ensures store is fresh, but we might need direct API if store is light
            // Assuming checkAuth populates basic info. If extended fields not in store, we need explicit get
            const res = await api.get('/auth/me'); // Verify this route exists!
            const d = res.data;
            
            setFormData({
                name: d.name || '',
                headline: d.headline || '',
                bio: d.bio || '',
                socialLinks: d.socialLinks || { website: '', linkedin: '', github: '', twitter: '' },
                skills: d.skills || [],
                experience: d.experience || [],
                education: d.education || [],
                cv: d.cv || ''
            });

        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (e) => {
        setFormData({ 
            ...formData, 
            socialLinks: { ...formData.socialLinks, [e.target.name]: e.target.value } 
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/users/profile', formData);
            toast.success('Profile updated!');
            await checkAuth(); // Refresh global store
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Skills
    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(skillInput.trim())) {
                setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
            }
            setSkillInput('');
        }
    };
    const removeSkill = (skill) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    };

    // Arrays (Experience/Education) - Simplified for brevity, usually needs modal or form list
    // Let's implement specific Add methods
    const addExperience = () => {
        const newExp = { company: '', role: '', startDate: '', endDate: '', description: '', current: false };
        setFormData({ ...formData, experience: [...formData.experience, newExp] });
    };
    
    // Handling array updates is tricky in a single large state object without complex handlers
    // We will use index-based update helpers
    const updateExperience = (index, field, value) => {
        const newExp = [...formData.experience];
        newExp[index][field] = value;
        setFormData({ ...formData, experience: newExp });
    };
    
    const removeExperience = (index) => {
        setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });
    };
    
     const addEducation = () => {
        const newEdu = { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' };
        setFormData({ ...formData, education: [...formData.education, newEdu] });
    };
    
    const updateEducation = (index, field, value) => {
        const newEdu = [...formData.education];
        newEdu[index][field] = value;
        setFormData({ ...formData, education: newEdu });
    };
    
    const removeEducation = (index) => {
        setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
    };


    // Assets
    const handleFileUpload = async (e, type) => { // type: 'avatar' or 'cv'
        const file = e.target.files[0];
        if (!file) return;
        
        const fd = new FormData();
        fd.append('image', file); 

        try {
            const toastId = toast.loading('Uploading...');
            const res = await api.post('/upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const url = res.data.secure_url || res.data.url;
            
            // Immediately save to profile? or just update state?
            // Better to update state and let user click Save, OR auto-save for avatar.
            // Let's update state.
            if (type === 'avatar') {
                // For avatar, usually we want immediate feedback
                await api.put('/users/profile', { avatar: url });
                await checkAuth();
                toast.success('Avatar updated', { id: toastId });
            } else {
                setFormData({ ...formData, cv: url });
                toast.success('CV uploaded (Click Save to persist)', { id: toastId });
            }
        } catch (err) {
            toast.error('Upload failed');
        }
    };
    
    const handleDeleteAccount = async () => {
        if (!confirm('Are you ABSOLUTELY SURE? This action cannot be undone.')) return;
        try {
            await api.delete('/users/profile');
            toast.success('Account deleted');
            window.location.href = '/login';
        } catch(err) {
            toast.error('Failed to delete account');
        }
    };


    if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8 flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                         {(user?.avatar) ? (
                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-full h-full p-6 text-gray-400" />
                        )}
                    </div>
                     <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer text-white">
                        <Camera size={24} />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                    </label>
                </div>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{formData.name}</h1>
                    <p className="text-gray-500 font-medium text-lg mb-2">{formData.headline || 'No headline set'}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {formData.skills.slice(0, 5).map(skill => (
                            <span key={skill} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                        ))}
                    </div>
                </div>
                <div>
                     <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-2">
                    {[
                        { id: 'personal', icon: User, label: 'Personal Info' },
                        { id: 'experience', icon: Briefcase, label: 'Experience' },
                        { id: 'education', icon: GraduationCap, label: 'Education' },
                        { id: 'skills', icon: Code, label: 'Skills & CV' },
                        { id: 'security', icon: Shield, label: 'Danger Zone', className: 'text-red-600 hover:bg-red-50' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === tab.id ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-100'} ${tab.className}`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="md:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border p-8 min-h-[500px]">
                        
                        {/* PERSONAL */}
                        {activeTab === 'personal' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1">Full Name</label>
                                        <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-lg" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1">Headline</label>
                                        <input name="headline" value={formData.headline} onChange={handleChange} placeholder="e.g. Senior Full Stack Developer" className="w-full border p-3 rounded-lg" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1">Bio</label>
                                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full border p-3 rounded-lg resize-y" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Website</label>
                                        <input name="website" value={formData.socialLinks.website} onChange={handleSocialChange} className="w-full border p-3 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">LinkedIn</label>
                                        <input name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialChange} className="w-full border p-3 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">GitHub</label>
                                        <input name="github" value={formData.socialLinks.github} onChange={handleSocialChange} className="w-full border p-3 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Twitter</label>
                                        <input name="twitter" value={formData.socialLinks.twitter} onChange={handleSocialChange} className="w-full border p-3 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* EXPERIENCE */}
                        {activeTab === 'experience' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Work Experience</h2>
                                    <button onClick={addExperience} className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg"><Plus size={18}/> Add Position</button>
                                </div>
                                <div className="space-y-8">
                                    {formData.experience.map((exp, i) => (
                                        <div key={i} className="p-6 bg-gray-50 rounded-xl relative group border">
                                            <button onClick={() => removeExperience(i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={20}/></button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <input placeholder="Company Name" className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-bold text-lg p-1" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} />
                                                </div>
                                                <div>
                                                    <input placeholder="Role / Title" className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none p-1" value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" checked={exp.current} onChange={e => updateExperience(i, 'current', e.target.checked)} id={`curr-${i}`} />
                                                    <label htmlFor={`curr-${i}`} className="text-sm">Current Role</label>
                                                </div>
                                                <div className="col-span-2">
                                                    <textarea placeholder="Description" rows={2} className="w-full border p-2 rounded-lg text-sm bg-white" value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.experience.length === 0 && <p className="text-center text-gray-400 py-8">No experience added yet.</p>}
                                </div>
                            </div>
                        )}

                        {/* EDUCATION */}
                         {activeTab === 'education' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Education</h2>
                                    <button onClick={addEducation} className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg"><Plus size={18}/> Add School</button>
                                </div>
                                <div className="space-y-8">
                                    {formData.education.map((edu, i) => (
                                        <div key={i} className="p-6 bg-gray-50 rounded-xl relative group border">
                                            <button onClick={() => removeEducation(i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={20}/></button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <input placeholder="School / University" className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-bold text-lg p-1" value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} />
                                                </div>
                                                <div>
                                                    <input placeholder="Degree" className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none p-1" value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} />
                                                </div>
                                                <div>
                                                    <input placeholder="Field of Study" className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none p-1" value={edu.fieldOfStudy} onChange={e => updateEducation(i, 'fieldOfStudy', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                     {formData.education.length === 0 && <p className="text-center text-gray-400 py-8">No education added yet.</p>}

                                </div>
                            </div>
                        )}

                        {/* SKILLS & CV */}
                        {activeTab === 'skills' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Skills</h2>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {formData.skills.map(skill => (
                                            <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} className="hover:text-red-500"><X size={14}/></button>
                                            </span>
                                        ))}
                                    </div>
                                    <input 
                                        className="w-full border p-3 rounded-lg" 
                                        placeholder="Type skill and press Enter..." 
                                        value={skillInput}
                                        onChange={e => setSkillInput(e.target.value)}
                                        onKeyDown={addSkill}
                                    />
                                </div>
                                
                                <div className="pt-8 border-t">
                                    <h2 className="text-2xl font-bold mb-6">Resume / CV</h2>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'cv')} />
                                        <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                                        {formData.cv ? (
                                            <div>
                                                <p className="text-green-600 font-bold mb-2">CV Uploaded Successfully</p>
                                                <a href={formData.cv} target="_blank" className="text-blue-600 underline text-sm z-10 relative" onClick={e => e.stopPropagation()}>View Current CV</a>
                                                <p className="text-xs text-gray-500 mt-2">Click to replace</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-bold text-gray-700">Drop your resume here or click to upload</p>
                                                <p className="text-sm text-gray-500">PDF, DOCX supported</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DANGER ZONE */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6 text-red-600 flex items-center gap-2"><Shield className="text-red-600"/> Danger Zone</h2>
                                <p className="text-gray-600">Once you delete your account, there is no going back. Please be certain.</p>
                                
                                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-red-700">Delete Account</h3>
                                        <p className="text-red-600 text-sm">Permanently remove your account and all data</p>
                                    </div>
                                    <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700">Delete Account</button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
