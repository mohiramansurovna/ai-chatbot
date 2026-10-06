import { LlmMessage } from "./llm.types";

export type LlmProviderGenerateArgs = {
    apiKey: string;
    systemPrompt: string;
    messages?: LlmMessage[];
}
export interface LlmProvider {
    generate(args: LlmProviderGenerateArgs): Promise<string>;
    isApiKeyActive(apiKey: string): Promise<boolean>;
}

