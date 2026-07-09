import { Core } from ".."
import { Embedding, EmbeddingWithSimilarity } from "./embeddings.entity"
export type EmbeddingInsert = Omit<Embedding, 'id' | 'createdAt'>
export type DeleteOptions={
    userId?:Core.Users.User['id']
    sessionId?:Core.Sessions.Session['id']
}

export interface IEmbeddingsRepository {
    findById(id: Embedding['id']): Promise<Embedding | null>

    findNearest(userId: Embedding['userId'], queryEmbedding: Embedding['embedding'],limit?:number): Promise<EmbeddingWithSimilarity[]>
    listBySessionId(sessionId: Core.Sessions.Session['id']): Promise<Embedding[]>
    create(args: EmbeddingInsert): Promise<void>
    delete(id: Embedding['id'], options?:DeleteOptions): Promise<void>
}
export const EMBEDDINGS_REPOSITORY=Symbol("EMBEDDINGS_REPOSITORY")