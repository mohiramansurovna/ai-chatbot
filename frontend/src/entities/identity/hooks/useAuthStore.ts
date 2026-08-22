import { create } from 'zustand';
import type { User } from '../types';

type AuthState = {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isBootstrapping: boolean; // true while we attempt silent refresh on app load
    setAccessToken: (accessToken: string) => void;
    setUser: (user: User) => void;
    clearAuth: () => void;
    finishBootstrapping: () => void;
};

export const useAuthStore = create<AuthState>(set => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isBootstrapping: true,

    setAccessToken: accessToken => set({ accessToken, isAuthenticated: true }),
    setUser: user => set({ user }),
    clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    finishBootstrapping: () => set({ isBootstrapping: false }),
}));
