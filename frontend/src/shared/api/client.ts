import { useAuthStore } from '@/entities/identity';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type ApiErrorBody = { code: string; message: string };

class ApiError extends Error {
    code: string;

    constructor(
        public status: number,
        body: ApiErrorBody | null
    ) {
        super(body?.message ?? 'Something went wrong.');
        this.code = body?.code ?? 'UNKNOWN_ERROR';
    }
}

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const accessToken = useAuthStore.getState().accessToken;

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const body: ApiErrorBody | null = await res.json().catch(() => null);
        throw new ApiError(res.status, body);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown, extraHeaders?: HeadersInit) =>
        request<T>(path, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
            headers: extraHeaders,
        }),
    patch: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { ApiError, getCookie };
export type { ApiErrorBody };
