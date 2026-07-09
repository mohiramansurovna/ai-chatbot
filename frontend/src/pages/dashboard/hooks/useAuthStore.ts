import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/schemas';

type AuthState = {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => void;
    setToken: (token: string) => void;
    setUser: (user: User) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,

            setAuth: (token, user) =>
                set({ accessToken: token, user, isAuthenticated: true }),

            setToken: token =>
                set(state => ({
                    accessToken: token,
                    isAuthenticated: !!token,
                    user: state.user,
                })),

            setUser: user => set({ user }),

            clearAuth: () =>
                set({ accessToken: null, user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-store',
            partialize: state => ({
                accessToken: state.accessToken,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);