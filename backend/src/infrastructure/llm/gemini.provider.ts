// infra/llm/gemini.provider.ts
import { GoogleGenAI, Type } from '@google/genai'
import { Injectable } from '@nestjs/common'
import { ExtractedFacts, LlmProvider } from '@/core/llm/llm.types'
import { Message } from '@/core/messages/messages.entity'
import { buildExtractionPrompt } from '@/core/llm/extraction-prompt';

@Injectable()
export class GeminiProvider implements LlmProvider {
    private ai: GoogleGenAI | null = null

    async configure(decryptedApiKey: string): Promise<void> {
        this.ai = new GoogleGenAI({ apiKey: decryptedApiKey })
    }

    async send(messages: Message[], memoryFacts:string): Promise<string> {
        if (!this.ai) {
            throw new Error('Gemini client not configured. Call configure() first.')
        }

        const historyMessages = messages.slice(0, -1)
        const latestMessage = messages[messages.length - 1]

        if (!latestMessage) {
            throw new Error('Cannot send an empty message array.')
        }

        const mappedHistory = historyMessages.map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }))

        const chat = this.ai.chats.create({
            model: 'gemini-2.5-flash',
            history: mappedHistory,
            config: memoryFacts
                ? { systemInstruction: `Relevant context about this user:\n${memoryFacts}` }
                : undefined,
        })

        const res = await chat.sendMessage({
            message: latestMessage.content
        })

        return res.text ?? ''
    }

    async extractFacts(conversationTranscript: string, existingEmbeddings: string): Promise<ExtractedFacts> {
        if (!this.ai) {
            throw new Error('Gemini client not configured. Call configure() first.')
        }

        // Generate the combined user instruction/prompt
        const extractionPrompt = buildExtractionPrompt(conversationTranscript, existingEmbeddings)

        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: extractionPrompt,
            config: {
                // Enforce structured JSON output matching ExtractedFacts
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        old_facts: {
                            type: Type.ARRAY,
                            items: { type: Type.INTEGER },
                            description: 'Array of numeric IDs from existing facts that are no longer valid or need removal.',
                        },
                        new_facts: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'Array of newly extracted factual statements from the conversation.',
                        },
                    },
                    required: ['old_facts', 'new_facts'],
                },
            },
        })

        const textResponse = response.text
        if (!textResponse) {
            return { old_facts: [], new_facts: [] }
        }

        // Because of responseSchema, this safely parses straight into ExtractedFacts
        return JSON.parse(textResponse) as ExtractedFacts
    }
}