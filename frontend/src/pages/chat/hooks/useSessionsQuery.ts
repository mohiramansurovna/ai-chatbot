import { useAuthStore } from '@/pages/dashboard/hooks/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import type { Session } from '@/schemas';

//@ts-ignore
const url = import.meta.env.VITE_API_URL as string;

export const useSessionsQuery = () => {
    const { accessToken } = useAuthStore();
    return useQuery<Session[]>({
        queryKey: ['sessions'],
        queryFn: async () => {
            const res = await fetch(url + '/api/sessions', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error('Failed to fetch sessions');
            return res.json();
        },
        enabled: !!accessToken,
    });
};