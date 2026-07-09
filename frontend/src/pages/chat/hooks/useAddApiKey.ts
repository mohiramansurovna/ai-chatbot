import { useAuthStore } from '@/pages/dashboard/hooks/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import type { Provider } from '@/schemas';

//@ts-ignore
const url = import.meta.env.VITE_API_URL as string;

export const useAddApiKey = () => {
    const { accessToken } = useAuthStore();
    return useMutation({
        mutationKey: ['addApiKey'],
        mutationFn: async ({ apiKey, provider }: { apiKey: string; provider: Provider }) => {
            return await fetch(url + '/api/user/apiKeys', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey, provider }),
            }).then(async res => {
                if (!res.ok) throw new Error((await res.json()).message ?? 'Failed to add API key');
                return res.text();
            });
        },
    });
};