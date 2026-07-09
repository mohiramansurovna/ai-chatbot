import { Message } from "../messages/messages.entity"

export type LlmProviderName = 'anthropic' | 'openai' | 'gemini'
export const LLM_PROVIDER_NAME = ["anthropic", "openai", "gemini"] as const satisfies LlmProviderName[];

export type ExtractedFacts = {
    "old_facts": number[],
    "new_facts": string[],
}

export interface LlmProvider {
    configure(decryptedApiKey:string):Promise<void>
    send(messages: Message[], memoryFacts:string): Promise<string>
    extractFacts(conversationTranscript:string, existingEmbeddings:string):Promise<ExtractedFacts>
}

