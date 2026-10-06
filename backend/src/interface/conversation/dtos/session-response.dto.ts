import { Core } from '@/core';

export class SessionsResponseDto {
    id: number;
    title: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}
export class SessionMessage {
    id: number;
    sessionId: number;
    role: Core.Messages.MessageRole;
    status: Core.Messages.MessageStatus;
    content: string;
    createdAt: Date;
}
export class SessionDetailsResponseDto {
    id: number;
    title: string;
    userId: number;
    messages: SessionMessage[];
    createdAt: Date;
    updatedAt: Date;
}
