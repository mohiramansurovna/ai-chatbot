import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { useAuthStore } from './useAuthStore';
import { loginResponseSchema, type LoginPayload } from '../types';

export function useLoginMutation() {
    const setAccessToken = useAuthStore(s => s.setAccessToken);

    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            const data = await apiClient.post('/auth/login', payload);
            return loginResponseSchema.parse(data);
        },
        onSuccess: data => {
            setAccessToken(data.accessToken);
        },
    });
}
