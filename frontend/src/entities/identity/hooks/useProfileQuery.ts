import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { useAuthStore } from './useAuthStore';
import { userSchema } from '../types';

export function useProfileQuery() {
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);
    const setUser = useAuthStore(s => s.setUser);

    return useQuery({
        queryKey: ['identity', 'profile'],
        queryFn: async () => {
            const data = await apiClient.get('/profile');
            const user = userSchema.parse(data);
            setUser(user);
            return user;
        },
        enabled: isAuthenticated,
    });
}
