// infra/llm/anthropic.provider.ts
import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { LlmMessage } from '@/core/llm/llm.types';
import { LlmProvider, LlmProviderGenerateArgs } from '@/core/llm/llm.provider';

@Injectable()
export class AnthropicProvider implements LlmProvider {
    async generate(args:LlmProviderGenerateArgs): Promise<string> {
        const client = new Anthropic({ apiKey: args.apiKey });

        const res = await client.messages.create({
            model: 'claude-sonnet-4-6',
            system: args.systemPrompt,
            max_tokens: 4096,
            messages: args.messages?args.messages.map((m) => ({
                role: m.role,
                content: m.content,
            })):[],
        });

        const textBlock = res.content.find((b) => b.type === 'text');
        return textBlock?.type === 'text' ? textBlock.text : '';
    }
}