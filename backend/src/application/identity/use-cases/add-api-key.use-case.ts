import { Inject, Injectable } from '@nestjs/common';
import { Core } from '@/core';
import { Jose } from '@/shared/libs/jose';
import { LlmProviderName } from '@/core/llm/llm.types';
import { ApiKey } from '@/core/api-keys/api-keys.entity';

interface AddApiKeyArgs {
    userId: Core.Users.User['id'];
    apiKey: string;
    provider: LlmProviderName;
}

@Injectable()
export class AddApiKeyUseCase {
    constructor(
        @Inject(Core.ApiKeys.API_KEYS_REPOSITORY)
        private readonly apiKeysRepository: Core.ApiKeys.IApiKeysRepository,
        @Inject(Core.Shared.LLM_CONFIG) private readonly llmConfig: Core.Shared.ILLMConfig
    ) {}

    async execute(args: AddApiKeyArgs): Promise<void> {
        const encryptedKey = await Jose.encrypt(args.apiKey, { secret: this.llmConfig.secret });

        const apiKey = ApiKey.create({
            userId: args.userId,
            encryptedKey,
            provider: args.provider,
        });
        await this.apiKeysRepository.create(apiKey);
    }
}
