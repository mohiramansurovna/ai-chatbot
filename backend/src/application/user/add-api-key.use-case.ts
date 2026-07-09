import { ApiKeysRepository } from "@/core/api-keys/api-keys.repository";
import { User } from "@/core/entities";
import { LlmProviderName } from "@/core/llm/llm.types";
import { EnvConfig } from "@/shared/configs/env.config";
import { Jose } from "@/shared/libs/jose";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AddApiKeyUseCase {
    constructor(private readonly apiKeysRepository: ApiKeysRepository,
        private readonly configService: ConfigService<EnvConfig, true>
    ) { }

    async execute(userId: User['id'], apiKey: string, provider: LlmProviderName): Promise<void> {

        const secret = this.configService.get('LLM_SECRET', { infer: true })

        const encryptedKey = await Jose.encrypt(apiKey, {
            secret
        })
        await this.apiKeysRepository.create({
            userId,
            encryptedKey,
            provider,
        })
    }
}