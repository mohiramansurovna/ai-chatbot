import type { RegisterInput } from '@/schemas';
import { useMutation } from '@tanstack/react-query';

//@ts-ignore
const url = import.meta.env.VITE_API_URL as string;

export function useRegisterMutation() {
    return useMutation({
        mutationFn: async (data: RegisterInput) => {
            return await fetch(url + '/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }).then(async res => {
                if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? 'Registration failed');
                return res.text();
            });
        },
    });
}