import { Core } from '@/core';
import { SessionsResponseDto, SessionDetailsResponseDto } from '../dtos';
import { Application } from '@/application';

export class SessionsPresenter {
    static toResponse(entity: Core.Sessions.Session): SessionsResponseDto {
        return {
            id: entity.id,
            title: entity.title,
            userId: entity.userId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    static toDetailsResponse(
        details: Application.Conversation.SessionDetails
    ): SessionDetailsResponseDto {
        return {
            ...this.toResponse(details.session),
            messages: details.messages.map(message => ({
                id: message.id,
                sessionId: message.sessionId,
                role: message.role,
                status: message.status,
                content: message.content,
                createdAt: message.createdAt,
            })),
        };
    }
}
