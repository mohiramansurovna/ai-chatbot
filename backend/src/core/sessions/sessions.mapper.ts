import { Session } from "./sessions.entity"
import { SessionModel } from "./sessions.model"

export class SessionsMapper {
    static toModel(entity: Session): SessionModel {
        return {
            id: entity.id,
            title: entity.title,
            user_id: entity.userId,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt,
            deleted_at: entity.deletedAt,
        }
    }

    static toDomain(model: SessionModel): Session {
        return new Session({
            id: model.id,
            title: model.title,
            userId: model.user_id,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
            deletedAt: model.deleted_at,
        })
    }
}