import { Core } from '@/core';
import { Schemas } from '../schemas';
import { IMapper } from './mapper.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersMapper implements IMapper<
    Core.Users.User,
    Schemas.UserSelect,
    Schemas.UserInsert
> {
    toInsertModel(entity: Core.Users.User): Schemas.UserInsert {
        return {
            name: entity.name,
            email: entity.email,
            password_hash: entity.passwordHash,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt,
            deleted_at: entity.deletedAt,
        };
    }
    toUpdateModel(entity: Core.Users.User): Partial<Schemas.UserSelect> {
        return {
            name: entity.name,
            email: entity.email,
            password_hash: entity.passwordHash,
            updated_at: entity.updatedAt,
            deleted_at: entity.deletedAt,
        };
    }

    toDomain(model: Schemas.UserSelect): Core.Users.User {
        return Core.Users.User.fromModel({
            id: model.id,
            name: model.name,
            email: model.email,
            passwordHash: model.password_hash,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
            deletedAt: model.deleted_at,
        });
    }
}
