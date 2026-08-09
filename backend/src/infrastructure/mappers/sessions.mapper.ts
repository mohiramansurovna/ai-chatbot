import { Core } from '@/core';
import { Schemas } from '../schemas';
import { Injectable } from '@nestjs/common';
import { IMapper } from './mapper.interface';

@Injectable()
export class SessionsMapper implements IMapper<
    Core.Sessions.Session,
    Schemas.SessionSelect,
    Schemas.SessionInsert
> {
    toInsertModel(entity: Core.Sessions.Session): Schemas.SessionSelect {
        return {
            id: entity.id,
            title: entity.title,
            user_id: entity.userId,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt,
            deleted_at: entity.deletedAt,
        };
    }
    toUpdateModel(entity: Core.Sessions.Session): Schemas.SessionSelect {
        return {
            id: entity.id,
            title: entity.title,
            user_id: entity.userId,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt,
            deleted_at: entity.deletedAt,
        };
    }
    toDomain(model: Schemas.SessionSelect): Core.Sessions.Session {
        return Core.Sessions.Session.fromModel({
            id: model.id,
            title: model.title,
            userId: model.user_id,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
            deletedAt: model.deleted_at,
        });
    }
}
