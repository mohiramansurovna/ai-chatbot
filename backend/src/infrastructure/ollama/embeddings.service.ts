import { EnvConfig } from "@/shared/configs/env.config";
import { Injectable, InternalServerErrorException, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmbeddingsService implements OnModuleInit {
    constructor(private readonly configService: ConfigService<EnvConfig, true>,) { }

    async onModuleInit() {
        await this.embed('hello world').catch(err=>{
            console.log(`Ollama not initialized : ${err}`)
        })
    }

    async embed(text: string): Promise<number[]> {
        const baseUrl = this.configService.get('OLLAMA_URL', { infer: true });
        const model = this.configService.get('OLLAMA_EMBED_MODEL', { infer: true })

        const res = await fetch(baseUrl + '/api/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt: text })
        })
        if (!res.ok) {
            throw new InternalServerErrorException(`Embedding failed: ${res.status}`);
        }

        const data = await res.json();
        return data.embedding as number[]
    }
}
