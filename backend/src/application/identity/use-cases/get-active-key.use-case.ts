import { Inject, Injectable } from '@nestjs/common';
import { Core } from '@/core';
import { LlmProvider } from '@/core/llm/llm.provider';
import { Jose } from '@/shared/libs/jose';

@Injectable()
export class GetActiveKeyUseCase {
    constructor(
        @Inject(Core.ApiKeys.API_KEYS_REPOSITORY)
        private readonly apiKeysRepository: Core.ApiKeys.IApiKeysRepository,

        @Inject(Core.Shared.LLM_CONFIG) private readonly llmConfig: Core.Shared.ILLMConfig
    ) {}

    async execute(
        userId: number,
        providerName: Core.Llm.LlmProviderName,
        llmProvider: LlmProvider
    ): Promise<string | null> {
        const apiKey = await this.apiKeysRepository.findActiveKey(userId, providerName);
        if (!apiKey) return null;
        const key = await Jose.decrypt(apiKey.encryptedKey, { secret: this.llmConfig.secret });
        const isActive= await llmProvider.isApiKeyActive(key);
        if(!isActive){
            await this.apiKeysRepository.update(apiKey.revoke());
            return await this.execute(userId, providerName, llmProvider)
        }
        return key
    }
}
