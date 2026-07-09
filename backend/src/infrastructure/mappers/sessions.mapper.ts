import { Core } from '@/core'
import { Schemas } from '../schemas'

export class SessionsMapper {
    static toModel(entity: Core.Sessions.Session): Schemas.SessionModel {
        return {
            id: entity.id,
            title: entity.title,
            user_id: entity.userId,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt,
            deleted_at: entity.deletedAt,
        }
    }

    static toDomain(model: Schemas.SessionModel): Core.Sessions.Session {
        return new Core.Sessions.Session({
            id: model.id,
            title: model.title,
            userId: model.user_id,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
            deletedAt: model.deleted_at,
        })
    }
}