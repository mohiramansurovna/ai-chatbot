import { useQuery } from '@tanstack/react-query';
import { UserSchema } from '@/schemas';
import { useAuthStore } from './useAuthStore';

//@ts-ignore
const url = import.meta.env.VITE_API_URL as string;

export const useMeQuery = () => {
    const accessToken = useAuthStore(state => state.accessToken);

    const fetchMe = async () => {
        const res = await fetch(url + '/api/user/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            throw new Error((await res.json().catch(() => ({}))).message ?? 'Failed to fetch user');
        }

        const json = await res.json();
        return UserSchema.parse(json);
    };

    return useQuery({
        queryKey: ['me', accessToken],
        queryFn: fetchMe,
        enabled: !!accessToken,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};