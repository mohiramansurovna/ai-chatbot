import { create } from 'zustand';
import type { Provider } from '@/schemas';

type ChatState = {
    selectedSessionId: number | null;
    provider: Provider;
    setSelectedSessionId: (id: number | null) => void;
    setProvider: (p: Provider) => void;
};

export const useChatStore = create<ChatState>((set) => ({
    selectedSessionId: null,
    provider: 'gemini',
    setSelectedSessionId: (id) => set({ selectedSessionId: id }),
    setProvider: (p) => set({ provider: p }),
}));