import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { LlmRegistry } from "@/core/llm/llm.registry";
import { AnthropicProvider } from "../llm/providers/anthropic.provider";
import { OpenAiProvider } from "../llm/providers/openai.provider";
import { GeminiProvider } from "../llm/providers/gemini.provider";

@Module({
    imports: [DatabaseModule],
    providers: [LlmRegistry, AnthropicProvider, OpenAiProvider, GeminiProvider],
    exports: [LlmRegistry]
})
export class LlmModule { }