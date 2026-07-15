import { Core } from "@/core";
import { Schemas } from "../schemas";

export class ContextBlocksMapper {
    static toModel(entity: Core.ContextBlocks.ContextBlock): Schemas.ContextBlockModel {
        return {
            id: entity.id,
            session_id: entity.sessionId,
            start_message_id: entity.startMessageId,
            message_count: entity.messageCount,
            content: entity.content,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt
        }
    }
    static toDomain(model: Schemas.ContextBlockModel): Core.ContextBlocks.ContextBlock {
        return new Core.ContextBlocks.ContextBlock({
            id: model.id,
            sessionId: model.session_id,
            startMessageId: model.start_message_id,
            messageCount: model.message_count,
            content: model.content,
            createdAt: model.created_at,
            updatedAt: model.updated_at
        })
    }
}