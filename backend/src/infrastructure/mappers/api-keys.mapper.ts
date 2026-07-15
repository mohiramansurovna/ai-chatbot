import { Core } from "@/core"
import { Schemas } from "../schemas"

export class ApiKeysMapper {
    static toModel(entity: Core.ApiKeys.ApiKey): Schemas.ApiKeyModel {
        return {
            id: entity.id,
            user_id: entity.userId,
            provider: entity.provider,
            encrypted_key: entity.encryptedKey,
            status: entity.status,
            created_at: entity.createdAt,
        }
    }

    static toDomain(model: Schemas.ApiKeyModel): Core.ApiKeys.ApiKey {
        return new Core.ApiKeys.ApiKey({
            id: model.id,
            userId: model.user_id,
            provider: model.provider,
            encryptedKey: model.encrypted_key,
            status: model.status,
            createdAt: model.created_at,
        })
    }
}