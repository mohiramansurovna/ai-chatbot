import { Core } from "@/core";
import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from "@nestjs/common";


@Injectable()
export class EmbeddingsProvider implements Core.Llm.IEmbeddingsProvider, OnModuleInit {
    constructor(@Inject(Core.Shared.EMBEDDINGS_CONFIG) private readonly embeddingsConfig: Core.Shared.IEmbeddingsConfig) { }

    async onModuleInit() {
        await this.embed('hello world').catch(err => {
            console.log(`Ollama not initialized : ${err}`)
        })
    }

    async embed(text: string): Promise<{ embedding: number[], embeddingModel: string }> {
        const { ollamaEmbedModel, ollamaUrl } = this.embeddingsConfig;

        const res = await fetch(ollamaUrl + '/api/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: ollamaEmbedModel, prompt: text })
        })
        if (!res.ok) {
            throw new InternalServerErrorException(`Embedding failed: ${res.status}`);
        }

        const data = await res.json();
        if(!data.embedding){
            throw new InternalServerErrorException(`Response doesn't include embedding`)
        }
        return { embedding: data.embedding as number[], embeddingModel: ollamaEmbedModel }
    }
}
