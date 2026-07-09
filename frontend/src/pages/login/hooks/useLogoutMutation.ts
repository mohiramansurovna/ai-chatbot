import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/pages/dashboard/hooks/useAuthStore';

export const useLogoutMutation = () => {
    const { clearAuth } = useAuthStore();
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['logout'],
        mutationFn: async () => Promise.resolve(),
        onSuccess: () => {
            clearAuth();
            queryClient.clear();
        },
    });
};