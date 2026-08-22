import { Injectable } from '@nestjs/common';
import { AnthropicProvider, GeminiProvider, OpenAiProvider } from './_';
import { Core } from '@/core';

@Injectable()
export class LlmRegistry implements Core.Llm.ILlmRegistry {
    constructor(
        private readonly anthropic: AnthropicProvider,
        private readonly openai: OpenAiProvider,
        private readonly gemini: GeminiProvider
    ) {}

    resolve(name: Core.Llm.LlmProviderName): Core.Llm.LlmProvider {
        switch (name) {
            case 'anthropic':
                return this.anthropic;
            case 'openai':
                return this.openai;
            case 'gemini':
                return this.gemini;
            default:
                throw new Error(`Unknown LLM provider: ${name}`);
        }
    }
}
