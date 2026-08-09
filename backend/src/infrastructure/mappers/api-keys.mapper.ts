import { Core } from '@/core';
import { Schemas } from '../schemas';
import { IMapper } from './mapper.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeysMapper implements IMapper<
    Core.ApiKeys.ApiKey,
    Schemas.ApiKeySelect,
    Schemas.ApiKeyInsert
> {
    toInsertModel(entity: Core.ApiKeys.ApiKey): Schemas.ApiKeyInsert {
        return {
            user_id: entity.userId,
            provider: entity.provider,
            encrypted_key: entity.encryptedKey,
            status: entity.status,
            created_at: entity.createdAt,
        };
    }
    toUpdateModel(entity: Core.ApiKeys.ApiKey): Partial<Schemas.ApiKeyInsert> {
        return {
            user_id: entity.userId,
            provider: entity.provider,
            encrypted_key: entity.encryptedKey,
            status: entity.status,
            created_at: entity.createdAt,
        };
    }

    toDomain(model: Schemas.ApiKeySelect): Core.ApiKeys.ApiKey {
        return Core.ApiKeys.ApiKey.fromModel({
            id: model.id,
            userId: model.user_id,
            provider: model.provider,
            encryptedKey: model.encrypted_key,
            status: model.status,
            createdAt: model.created_at,
        });
    }
}
