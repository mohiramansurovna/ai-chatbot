import { useMutation } from '@tanstack/react-query';
import { apiClient, getCookie } from '@/shared/api/client';
import { useAuthStore } from './useAuthStore';
import { refreshResponseSchema } from '../types';

export function useRefreshMutation() {
    const setAccessToken = useAuthStore(s => s.setAccessToken);
    const clearAuth = useAuthStore(s => s.clearAuth);

    return useMutation({
        mutationFn: async () => {
            const csrfToken = getCookie('csrf_token');
            const data = await apiClient.post(
                '/auth/refresh',
                undefined,
                csrfToken ? { 'x-csrf-token': csrfToken } : undefined
            );
            return refreshResponseSchema.parse(data);
        },
        onSuccess: data => {
            setAccessToken(data.accessToken);
        },
        onError: () => {
            clearAuth();
        },
    });
}
