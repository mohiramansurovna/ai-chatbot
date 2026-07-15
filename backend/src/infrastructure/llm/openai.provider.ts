// infra/llm/openai.provider.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { LlmProvider, LlmProviderGenerateArgs } from '@/core/llm/llm.provider';

@Injectable()
export class OpenAiProvider implements LlmProvider {
    async generate(args:LlmProviderGenerateArgs): Promise<string> {
        const client = new OpenAI({ apiKey: args.apiKey });

        const res = await client.chat.completions.create({
            model: 'gpt - 5.1 - mini',
            messages: [
                { role: 'system', content: args.systemPrompt },
                ...args.messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
            ],
        });

        return res.choices[0]?.message?.content ?? '';
    }
}