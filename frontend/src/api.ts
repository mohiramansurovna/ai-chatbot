export interface Message {
    id: number | string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt?: string | Date;
}

export interface Session {
    id: number;
    title: string;
    messages: Message[];
}

class ApiClient {
    isAuthenticated() {
        return typeof document !== 'undefined' && document.cookie.includes('access_token=');
    }
}

class AuthApi {
    async login(_payload: { email: string; password: string }) {
        return Promise.resolve();
    }

    async register(_payload: { name: string; email: string; password: string }) {
        return Promise.resolve();
    }

    logout() {
        return undefined;
    }
}

class ChatApi {
    async getSession(sessionId: number): Promise<Session> {
        return {
            id: sessionId,
            title: 'Session',
            messages: [],
        };
    }
}

export const apiClient = new ApiClient();
export const authApi = new AuthApi();
export const chatApi = new ChatApi();
