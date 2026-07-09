// infra/llm/anthropic.provider.ts
import Anthropic from '@anthropic-ai/sdk'
import { Injectable } from '@nestjs/common'
import { ExtractedFacts, LlmProvider } from '@/core/llm/llm.types'
import { Message } from '@/core/messages/messages.entity'
import { buildExtractionPrompt, parseExtractedFacts } from '@/core/llm/extraction-prompt';


@Injectable()
export class AnthropicProvider implements LlmProvider {
    private client:Anthropic|null=null;
    async send(messages: Message[], memoryFacts:string): Promise<string> {
        if(!this.client){
            throw Error('client not configured')
        }
        const res = await this.client.messages.create({
            model: 'claude-sonnet-4-6',
            system: memoryFacts ? `Relevant context about this user:\n${memoryFacts}` : undefined,
            max_tokens: 1024,
            messages,
        })
        const block = res.content[0]
        return block.type === 'text' ? block.text : ''
    }
    async configure(decryptedApiKey:string): Promise<void> {
        this.client = new Anthropic({apiKey:decryptedApiKey})
    }
    async extractFacts(conversationTranscript: string, existingEmbeddings: string): Promise<ExtractedFacts> {
        if (!this.client) {
            throw new Error('client not configured')
        }

        const prompt = buildExtractionPrompt(conversationTranscript, existingEmbeddings)

        const res = await this.client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
        })

        const block = res.content[0]
        const raw = block.type === 'text' ? block.text : '{}'
        return parseExtractedFacts(raw)
    }
}