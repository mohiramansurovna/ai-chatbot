import { Embedding, EmbeddingWithSimilarity } from "./embeddings.entity";
import { EmbeddingsModel } from "./embeddings.model";

export class EmbeddingsMapper {
    static toModel(entity: Embedding): EmbeddingsModel {
        return {
            id: entity.id,
            user_id: entity.userId,
            session_id: entity.sessionId,
            role: entity.role,
            content: entity.content,
            embedding: entity.embedding,
            embedding_model: entity.embeddingModel,
            created_at: entity.createdAt
        }
    }
    static toDomain(model: EmbeddingsModel): Embedding {
        return new Embedding({
            id: model.id,
            userId: model.user_id,
            sessionId: model.session_id,
            role: model.role,
            content: model.content,
            embedding: model.embedding,
            embeddingModel: model.embedding_model,
            createdAt: model.created_at
        })
    }
    static toDomainWithSimilarity(model: EmbeddingsModel & { similarity: number }): EmbeddingWithSimilarity {
        const { similarity, ...rest } = model;
        return {
            ...this.toDomain(rest),
            similarity: similarity
        }
    }
}