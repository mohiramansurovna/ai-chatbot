import { Core } from '@/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { Infrastructure } from '@/infrastructure';

@Module({
    imports: [ConfigModule],
    providers: [
        Infrastructure.Llm.AnthropicProvider,
        Infrastructure.Llm.GeminiProvider,
        Infrastructure.Llm.OpenAiProvider,
        { provide: Core.Llm.EMBEDDINGS_PROVIDER, useClass: Infrastructure.Llm.EmbeddingsProvider },
        { provide: Core.Llm.LLM_REGISTRY, useClass: Infrastructure.Llm.LlmRegistry },
    ],
    exports: [Core.Llm.LLM_REGISTRY, Core.Llm.EMBEDDINGS_PROVIDER],
})
export class LlmModule {}
