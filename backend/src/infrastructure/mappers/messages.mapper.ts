import { Core } from '@/core';
import { Schemas } from '../schemas';
import { Injectable } from '@nestjs/common';
import { IMapper } from './mapper.interface';

@Injectable()
export class MessagesMapper implements IMapper<
    Core.Messages.Message,
    Schemas.MessageSelect,
    Schemas.MessageInsert
> {
    toDomain(messageModel: Schemas.MessageSelect): Core.Messages.Message {
        return Core.Messages.Message.fromModel({
            id: messageModel.id,
            sessionId: messageModel.session_id,
            status: messageModel.status,
            role: messageModel.role,
            content: messageModel.content,
            createdAt: messageModel.created_at,
        });
    }
    toInsertModel(entity: Core.Messages.Message): Schemas.MessageInsert {
        return {
            session_id: entity.sessionId,
            status: entity.status,
            role: entity.role,
            content: entity.content,
        };
    }

    toUpdateModel(entity: Core.Messages.Message): Partial<Schemas.MessageInsert> {
        return {
            session_id: entity.sessionId,
            status: entity.status,
            role: entity.role,
            content: entity.content,
        };
    }
}
