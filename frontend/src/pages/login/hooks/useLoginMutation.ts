import { useAuthStore } from '@/pages/dashboard/hooks/useAuthStore';
import { LoginResponseSchema, type LoginInput } from '@/schemas';
import { useMutation } from '@tanstack/react-query';
import { decodeJwt } from '@/lib/jwt';

//@ts-ignore
const url = import.meta.env.VITE_API_URL as string;

export function useLoginMutation() {
    const { setAuth } = useAuthStore();
    return useMutation({
        mutationFn: async (data: LoginInput) => {
            return await fetch(url + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            }).then(async res => {
                console.log('Login response status:', res.status);
                if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? 'Login failed');
                return LoginResponseSchema.parse(await res.json());
            });
        },
        onSuccess: (data, variables) => {
            const payload = decodeJwt<{ sub?: string; email?: string; name?: string }>(data.accessToken);
            setAuth(data.accessToken, {
                id: payload?.sub,
                email: payload?.email ?? variables.email,
                name: payload?.name,
            });
        },
    });
}