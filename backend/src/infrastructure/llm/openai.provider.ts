import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ExtractedFacts, LlmProvider } from '@/core/llm/llm.types';
import { Message } from '@/core/messages/messages.entity';
import { buildExtractionPrompt, parseExtractedFacts } from '@/core/llm/extraction-prompt';

@Injectable()
export class OpenAiProvider implements LlmProvider {
    private client: OpenAI | null = null;

    async configure(decryptedApiKey: string): Promise<void> {
        this.client = new OpenAI({
            apiKey: decryptedApiKey,
        });
    }

    async send(messages: Message[], memoryFacts:string): Promise<string> {
        if (!this.client) {
            throw new Error('client not configured');
        }

        const response = await this.client.responses.create({
            model: 'gpt-5.5',
            input: messages,
            instructions: memoryFacts ? `Relevant context about this user:\n${memoryFacts}` : undefined,
            max_output_tokens: 1024,
        });

        return response.output_text;
    }
    async extractFacts(conversationTranscript: string, existingEmbeddings: string): Promise<ExtractedFacts> {
        if (!this.client) {
            throw new Error('client not configured')
        }

        const prompt = buildExtractionPrompt(conversationTranscript, existingEmbeddings)

        const res = await this.client.responses.create({
            model: 'gpt-5.5',
            input: prompt,
            max_output_tokens: 1024,
        })

        return parseExtractedFacts(res.output_text ?? '{}')
    }
}