import { LlmProviderName } from './llm.types';
import { LlmProvider } from './llm.provider';

export interface ILlmRegistry {
    resolve(name: LlmProviderName): LlmProvider;
}
export const LLM_REGISTRY = Symbol('LLM_REGISTRY');
