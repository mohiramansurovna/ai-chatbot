export type LlmProviderName = 'anthropic' | 'openai' | 'gemini'
export const LLM_PROVIDER_NAME = ["anthropic", "openai", "gemini"] as const satisfies LlmProviderName[];

export type ExtractedFacts = {
    "old_facts": number[];
    "new_facts": string[];
}
export type LlmMessage = {
    role: 'user' | 'assistant';
    content: string
}