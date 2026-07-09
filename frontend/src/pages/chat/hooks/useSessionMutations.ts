import { useAuthStore } from '@/pages/dashboard/hooks/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Session, Provider, ChatMessage } from '@/schemas';
import { useChatStore } from './useChatStore';
import { triggerMemoryExtraction } from './useMemoryExtraction';

//@ts-ignore
const url = import.meta.env.VITE_API_URL as string;

export const useCreateSession = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuthStore();
    const { setSelectedSessionId, selectedSessionId } = useChatStore();
    return useMutation({
        mutationKey: ['createSession'],
        mutationFn: async (title: string) => {
            // Trigger memory extraction for the current session before creating a new one
            if (selectedSessionId) {
                triggerMemoryExtraction(selectedSessionId, accessToken);
            }

            return await fetch(url + '/api/sessions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            }).then(async res => {
                if (!res.ok) throw new Error((await res.json()).message ?? 'Failed to create session');
                return (await res.json()) as Session;
            });
        },
        onSuccess: (session) => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            setSelectedSessionId(session.id);
        },
    });
};

export const useSendMessage = (sessionId: number | null) => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuthStore();
    return useMutation({
        mutationKey: ['sendMessage', sessionId],
        mutationFn: async ({ message, provider }: { message: string; provider: Provider }) => {
            const res = await fetch(url + `/api/sessions/${sessionId}/message`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, provider }),
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.message ?? 'Failed to send message');
            }

            const data = (await res.json()) as {
                id?: number | string;
                role?: 'assistant' | 'user';
                content?: string;
                createdAt?: string | Date;
            };

            return {
                id: data.id ?? `assistant-${Date.now()}`,
                role: data.role === 'assistant' ? 'assistant' : 'user',
                content: data.content ?? '',
                createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            } as ChatMessage;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
};