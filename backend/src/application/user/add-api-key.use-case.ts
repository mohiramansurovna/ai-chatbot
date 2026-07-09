import { ApiKeysRepository } from "@/core/api-keys/api-keys.repository";
import { Core } from "@/core";
import { LlmProviderName } from "@/core/llm/llm.types";
import { Jose } from "@/shared/libs/jose";
import { Inject, Injectable } from "@nestjs/common";
@Injectable()
export class AddApiKeyUseCase {
    constructor(
        private readonly apiKeysRepository: ApiKeysRepository,
        @Inject(Core.Shared.LLM_CONFIG) private readonly llmConfig: Core.Shared.ILLMConfig,
    ) { }

    async execute(userId: Core.Users.User['id'], apiKey: string, provider: LlmProviderName): Promise<void> {


        const encryptedKey = await Jose.encrypt(apiKey, {
            secret: this.llmConfig.secret
        })
        await this.apiKeysRepository.create({
            userId,
            encryptedKey,
            provider,
        })
    }
}