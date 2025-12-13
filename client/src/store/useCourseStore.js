import { create } from 'zustand';
import api from '@/lib/api';

export const useCourseStore = create((set) => ({
    courses: [],
    isLoading: false,
    error: null,

    fetchCourses: async (params = {}) => {
        set({ isLoading: true });
        try {
            // Build query string
            const queryString = new URLSearchParams(params).toString();
            const { data } = await api.get(`/courses?${queryString}`);
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
