import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email, password) => {
                try {
                    const { data } = await api.post('/auth/login', { email, password });
                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                    });
                    return data;
                } catch (error) {
                    throw error.response?.data?.message || 'Login failed';
                }
            },

            register: async (userData) => {
                try {
                    const { data } = await api.post('/auth/register', userData);
                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                    });
                    return data;
                } catch (error) {
                    throw error.response?.data?.message || 'Registration failed';
                }
            },

            checkAuth: async () => {
                try {
                    const { data } = await api.get('/auth/me');
                    set({ user: data, isAuthenticated: true });
                } catch (error) {
                    // Optional: logout if 401?
                    // set({ user: null, token: null, isAuthenticated: false }); 
                    // Better not to auto-logout on every error, maybe just dont update
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            // Add a method to hydrate state if needed, but persist handles it
        }),
        {
            name: 'auth-storage', // local storage key
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
