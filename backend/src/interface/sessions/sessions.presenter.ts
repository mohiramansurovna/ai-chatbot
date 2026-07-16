import { Core } from "@/core";
import { SessionsResponseDto, SessionWithMessages, SessionDetailsResponseDto } from "./dtos/session-response.dto";

export class SessionsPresenter {
    static toResponse(entity:Core.Sessions.Session): SessionsResponseDto {
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