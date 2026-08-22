import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { RegisterPayload } from '../types';

export function useRegisterMutation() {
    return useMutation({
        mutationFn: (payload: RegisterPayload) => apiClient.post<string>('/auth/register', payload),
    });
}
