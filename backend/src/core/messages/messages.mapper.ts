import { Message } from "./messages.entity";
import { MessageModel } from "./messages.model";

export class MessagesMapper {
    static toDomain(messageModel: MessageModel): Message {
        return new Message({
            id: messageModel.id,
            sessionId: messageModel.session_id,
            role: messageModel.role,
            content: messageModel.content,
            createdAt: messageModel.created_at
        });
    }

    static toModel(message: Message): MessageModel {
        return {
            id: message.id,
            session_id: message.sessionId,
            role: message.role,
            content: message.content,
            created_at: message.createdAt
        }
    }
}