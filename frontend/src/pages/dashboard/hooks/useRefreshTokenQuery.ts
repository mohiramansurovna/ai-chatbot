import { useQuery } from '@tanstack/react-query';
import { LoginResponseSchema } from '@/schemas';
import { getCookie } from '@/lib/cookies';

//@ts-ignore
const url = import.meta.env.VITE_API_URL as string;

export const useRefreshTokenQuery = () => {
    const fetchAccessToken = async () => {
        const csrfToken = getCookie('csrf_token');

        const headers = new Headers({
            'Content-Type': 'application/json',
        });
        if (csrfToken) {
            headers.set('x-csrf-token', csrfToken);
        }

        const res = await fetch(url + '/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
            headers,
        });

        if (!res.ok) {
            throw new Error((await res.json().catch(() => ({}))).message ?? 'Failed to refresh token');
        }

        const json = await res.json();
        return LoginResponseSchema.parse(json).accessToken;
    };

    return useQuery<string, Error, string, ['refresh-token']>({
        queryKey: ['refresh-token'],
        queryFn: fetchAccessToken,
        refetchInterval: 14 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        retry: false,
        enabled: true,
    });
};