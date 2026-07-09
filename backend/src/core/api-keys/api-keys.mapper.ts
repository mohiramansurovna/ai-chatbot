// core/api-keys/api-key.mapper.ts
import { ApiKey } from "./api-keys.entity"
import { ApiKeyModel } from "./api-keys.model"

export class ApiKeysMapper {
    static toModel(entity: ApiKey): ApiKeyModel {
        return {
            id: entity.id,
            user_id: entity.userId,
            provider: entity.provider,
            encrypted_key: entity.encryptedKey,
            status: entity.status,
            created_at: entity.createdAt,
        }
    }

    static toDomain(model: ApiKeyModel): ApiKey {
        return new ApiKey({
            id: model.id,
            userId: model.user_id,
            provider: model.provider,
            encryptedKey: model.encrypted_key,
            status: model.status,
            createdAt: model.created_at,
        })
    }
}