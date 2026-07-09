import { Injectable } from '@nestjs/common'
import { LlmProvider, LlmProviderName } from './llm.types'
import { AnthropicProvider } from '@/infrastructure/llm/anthropic.provider'
import { OpenAiProvider } from '@/infrastructure/llm/openai.provider'
import { ApiKey } from '../api-keys/api-keys.entity'
import { GeminiProvider } from '@/infrastructure/llm/gemini.provider'

@Injectable()
export class LlmRegistry {
    constructor(
        private readonly anthropic: AnthropicProvider,
        private readonly openai: OpenAiProvider,
        private readonly gemini:GeminiProvider
    ) { }

    resolve(name: LlmProviderName): LlmProvider {
        switch (name) {
            case 'anthropic': return this.anthropic
            case 'openai': return this.openai
            case 'gemini':return this.gemini
            default: throw new Error(`Unknown LLM provider: ${name}`)
        }
    }
}