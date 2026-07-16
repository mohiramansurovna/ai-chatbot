export type MessageRole = 'user' | 'assistant';
export type MessageStatus = 'compressed' | 'compressing' | 'raw';
export class Message {
    id: number;
    sessionId: number;
    role: MessageRole;
    status:MessageStatus;
    content: string;
    createdAt: Date;

    constructor(data: Message) {
        Object.assign(this, data)
    }
}