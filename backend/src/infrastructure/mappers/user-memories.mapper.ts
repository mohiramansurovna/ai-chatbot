import { Core } from '@/core';
import { Schemas } from '../schemas';
import { Injectable } from '@nestjs/common';
import { IMapper } from './mapper.interface';

@Injectable()
export class UserMemoriesMapper implements IMapper<
    Core.UserMemories.UserMemory,
    Schemas.UserMemorySelect,
    Schemas.UserMemoryInsert
> {
    toDomainWithSimilarity(
        model: Schemas.UserMemorySelect & { similarity: number }
    ): Core.UserMemories.UserMemoryWithSimilarity {
        const { similarity, ...rest } = model;
        const userMemory = this.toDomain(rest);

        return Object.assign(userMemory, { similarity: similarity });
    }

    toInsertModel(entity: Core.UserMemories.UserMemory): Schemas.UserMemorySelect {
        return {
            id: entity.id,
            user_id: entity.userId,
            content: entity.content,
            embedding: entity.embedding,
            embedding_model: entity.embeddingModel,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt,
        };
    }

    toUpdateModel(entity: Core.UserMemories.UserMemory): Partial<Schemas.UserMemorySelect> {
        return {
            id: entity.id,
            user_id: entity.userId,
            content: entity.content,
            embedding: entity.embedding,
            embedding_model: entity.embeddingModel,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt,
        };
    }

    toDomain(model: Schemas.UserMemorySelect): Core.UserMemories.UserMemory {
        return Core.UserMemories.UserMemory.fromModel({
            id: model.id,
            userId: model.user_id,
            content: model.content,
            embedding: model.embedding,
            embeddingModel: model.embedding_model,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
        });
    }
}
