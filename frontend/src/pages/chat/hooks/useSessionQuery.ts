import { useAuthStore } from '@/pages/dashboard/hooks/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import type { Session, ChatMessage } from '@/schemas';

//@ts-ignore
const url = import.meta.env.VITE_API_URL as string;

export const useSessionQuery = (id: number | null) => {
    const { accessToken } = useAuthStore();
    return useQuery<Session>({
        queryKey: ['session', id],
        queryFn: async () => {
            const res = await fetch(url + `/api/sessions/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log()
            if (!res.ok) throw new Error('Failed to fetch session');

            const session = (await res.json()) as Session & { messages?: Array<ChatMessage & { type?: 'user' | 'assistant' }> };
            const normalizedMessages = (session.messages ?? []).map(message => ({
                ...message,
                role: message.role ?? (message.role === 'user' ? 'user' : 'assistant'),
            })) as ChatMessage[];

            return {
                ...session,
                messages: normalizedMessages,
            } as Session;
        },
        enabled: !!accessToken && id !== null,
    });
};