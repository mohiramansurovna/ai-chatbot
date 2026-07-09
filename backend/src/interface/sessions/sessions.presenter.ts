import { Session } from "@/core/entities";
import { SessionsResponseDto, SessionWithMessages, SessionDetailsResponseDto } from "./dtos/session-response.dto";
import { Message } from "@/core/messages/messages.entity";

export class SessionsPresenter {
    static toResponse(entity: Session): SessionsResponseDto {
        return {
            id: entity.id,
            title: entity.title,
            userId: entity.userId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }
    }
    static toDetailsResponse(entity: SessionWithMessages): SessionDetailsResponseDto {
        return {
            id: entity.id,
            title: entity.title,
            userId: entity.userId,
            messages: entity.messages,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }
    }
}