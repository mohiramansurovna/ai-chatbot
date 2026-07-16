export interface IEmbeddingsProvider {
    embed(text: string): Promise<{ embedding: number[], embeddingModel: string }>
}
export const EMBEDDINGS_PROVIDER = Symbol('EMBEDDINGS_PROVIDER')