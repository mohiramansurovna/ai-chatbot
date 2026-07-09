
import { Core } from "@/core";
import { Schemas } from "../schemas";

export class MessagesMapper {
    static toDomain(messageModel: Schemas.MessageSelect): Core.Messages.Message {
        return new Core.Messages.Message({
            id: messageModel.id,
            sessionId: messageModel.session_id,
            role: messageModel.role,
            content: messageModel.content,
            createdAt: messageModel.created_at
        });
    }

    static toModel(message: Core.Messages.Message): Schemas.MessageSelect {
        return {
            id: message.id,
            session_id: message.sessionId,
            role: message.role,
            content: message.content,
            created_at: message.createdAt
        }
    }
}