import { Core } from "@/core";
import { Schemas } from "../schemas";

export class EmbeddingsMapper {
    static toModel(entity: Core.Embeddings.Embedding): Schemas.EmbeddingsModel {
        return {
            id: entity.id,
            user_id: entity.userId,
            session_id: entity.sessionId,
            content: entity.content,
            embedding: entity.embedding,
            embedding_model: entity.embeddingModel,
            created_at: entity.createdAt
        }
    }
    static toDomain(model: Schemas.EmbeddingsModel): Core.Embeddings.Embedding {
        return new Core.Embeddings.Embedding({
            id: model.id,
            userId: model.user_id,
            sessionId: model.session_id,
            content: model.content,
            embedding: model.embedding,
            embeddingModel: model.embedding_model,
            createdAt: model.created_at
        })
    }
    static toDomainWithSimilarity(
        model: Schemas.EmbeddingsModel & { similarity: number }
    ): Core.Embeddings.EmbeddingWithSimilarity {
        const { similarity, ...rest } = model;
        return {
            ...this.toDomain(rest),
            similarity: similarity
        }
    }
}