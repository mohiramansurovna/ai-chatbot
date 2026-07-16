import { LlmProvider, LlmProviderGenerateArgs } from "@/core/llm/llm.provider";
import { LlmMessage } from "@/core/llm/llm.types";
import { Content, GoogleGenAI } from "@google/genai";

export class GeminiProvider implements LlmProvider {
    async generate(args:LlmProviderGenerateArgs): Promise<string> {
        const ai = new GoogleGenAI({ apiKey: args.apiKey });
        const contents = this.mapMessagesToGemini(args.messages??[]);

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: {
                    systemInstruction: args.systemPrompt,
                },
            });

            return response.text ?? "";
        } catch (error) {
            throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }


    private mapMessagesToGemini(messages: LlmMessage[]): Content[] {
        return messages.map((msg) => {
            const role = msg.role === "assistant" ? "model" : "user";

            return {
                role: role,
                parts: [
                    {
                        text: msg.content,
                    },
                ],
            };
        });
    }
}