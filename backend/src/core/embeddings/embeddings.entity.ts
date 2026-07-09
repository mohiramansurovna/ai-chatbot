export class Embedding {
    id: number;
    userId: number;
    sessionId: number;
    content: string;
    embedding: number[];
    embeddingModel: string;
    createdAt: Date;

    constructor(props: Embedding) {
        Object.assign(this, props)
    }
}

export type EmbeddingWithSimilarity = Embedding & {
    similarity: number
}