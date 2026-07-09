import { Core } from '@/core';
import { Schemas } from '../schemas';

export class UsersMapper {
    static toModel(entity: Core.Users.User): Schemas.UserModel {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            password_hash: entity.passwordHash,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt,
            deleted_at: entity.deletedAt,
        }
    }

    static toDomain(model: Schemas.UserModel): Core.Users.User {
        return new Core.Users.User({
            id: model.id,
            name: model.name,
            email: model.email,
            passwordHash: model.password_hash,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
            deletedAt: model.deleted_at,
        })
    }
}