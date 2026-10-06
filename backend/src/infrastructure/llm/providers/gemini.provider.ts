import { LlmProvider, LlmProviderGenerateArgs } from "@/core/llm/llm.provider";
import { LlmMessage } from "@/core/llm/llm.types";
import { Content, GoogleGenAI } from "@google/genai";

export class GeminiProvider implements LlmProvider {
    async generate(args: LlmProviderGenerateArgs): Promise<string> {
        const ai = new GoogleGenAI({ apiKey: args.apiKey });
        const contents = this.mapMessagesToGemini(args.messages ?? []);

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: { systemInstruction: args.systemPrompt },
            });

            return response.text ?? '';
        } catch (error) {
            throw new Error(
                `Gemini API Error: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    async isApiKeyActive(apiKey: string): Promise<boolean> {
        if (!apiKey?.trim()) {
            return false;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            await ai.models.list();
            return true;
        } catch {
            return false;
        }
    }

    private mapMessagesToGemini(messages: LlmMessage[]): Content[] {
        return messages.map(msg => {
            const role = msg.role === 'assistant' ? 'model' : 'user';

            return { role: role, parts: [{ text: msg.content }] };
        });
    }
}