import { Core } from "@/core";
import { Module } from "@nestjs/common";
import { Llm } from "../llm";
import { ConfigModule } from "./config.module";

@Module({
    imports: [ConfigModule],
    providers: [
        Core.Llm.LlmRegistry,
        Llm.AnthropicProvider,
        Llm.GeminiProvider,
        Llm.OpenAiProvider,
        {
            provide: Core.Llm.EMBEDDINGS_PROVIDER,
            useClass: Llm.EmbeddingsProvider,
        }
    ],
    exports: [Core.Llm.LlmRegistry, Core.Llm.EMBEDDINGS_PROVIDER]
})
export class LlmModule { }