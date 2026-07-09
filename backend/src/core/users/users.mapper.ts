import { User } from "./users.entity";
import { UserModel } from "./users.model";

export class UsersMapper {
    static toModel(entity: User): UserModel {
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

    static toDomain(model: UserModel): User {
        return new User({
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