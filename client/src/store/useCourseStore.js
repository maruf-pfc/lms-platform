import { create } from 'zustand';
import api from '@/lib/api';

export const useCourseStore = create((set) => ({
    courses: [],
    isLoading: false,
    error: null,

    fetchCourses: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/courses');
            set({ courses: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    enrollCourse: async (courseId) => {
        try {
            await api.post(`/courses/${courseId}/enroll`);
            // Update local state or re-fetch?
            // For now just return true
            return true;
        } catch (error) {
            throw error.response?.data?.message || 'Enrollment failed';
        }
    }
}));
