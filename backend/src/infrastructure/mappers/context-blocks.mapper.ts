import { Core } from '@/core';
import { Schemas } from '../schemas';
import { IMapper } from './mapper.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContextBlocksMapper implements IMapper<
    Core.ContextBlocks.ContextBlock,
    Schemas.ContextBlockSelect,
    Schemas.ContextBlockInsert
> {
    toInsertModel(entity: Core.ContextBlocks.ContextBlock): Schemas.ContextBlockInsert {
        return {
            session_id: entity.sessionId,
            start_message_id: entity.startMessageId,
            content: entity.content,
            message_count: entity.messageCount,
        };
    }
    toUpdateModel(entity: Core.ContextBlocks.ContextBlock): Partial<Schemas.ContextBlockInsert> {
        return {
            session_id: entity.sessionId,
            start_message_id: entity.startMessageId,
            content: entity.content,
            message_count: entity.messageCount,
        };
    }
    toDomain(model: Schemas.ContextBlockSelect): Core.ContextBlocks.ContextBlock {
        return Core.ContextBlocks.ContextBlock.fromModel({
            id: model.id,
            sessionId: model.session_id,
            startMessageId: model.start_message_id,
            messageCount: model.message_count,
            content: model.content,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
        });
    }
}
