import { Core } from "@/core";
import { Schemas } from "../schemas";

export class UserMemoriesMapper {
    static toModel(entity: Core.UserMemories.UserMemory): Schemas.UserMemoryModel {
        return {
            id: entity.id,
            user_id: entity.userId,
            content: entity.content,
            embedding: entity.embedding,
            embedding_model: entity.embeddingModel,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt,
        }
    }
    static toDomain(model: Schemas.UserMemoryModel): Core.UserMemories.UserMemory {
        return new Core.UserMemories.UserMemory({
            id: model.id,
            userId: model.user_id,
            content: model.content,
            embedding: model.embedding,
            embeddingModel: model.embedding_model,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
        })
    }
    static toDomainWithSimilarity(
        model: Schemas.UserMemoryModel & { similarity: number }
    ): Core.UserMemories.UserMemoryWithSimilarity {
        const { similarity, ...rest } = model;
        const userMemory = this.toDomain(rest);

        return Object.assign(userMemory, {
            similarity: similarity
        })
    }
}