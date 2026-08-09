import { Inject, Injectable } from "@nestjs/common";
import { Core } from "@/core";
import { ApiKeyAccessDeniedException, ApiKeyNotFoundException } from "../errors";

interface RevokeApiKeyArgs {
    userId: Core.Users.User['id'];
    apiKeyId: Core.ApiKeys.ApiKey['id'];
}

@Injectable()
export class RevokeApiKeyUseCase {
    constructor(
        @Inject(Core.ApiKeys.API_KEYS_REPOSITORY) private readonly apiKeysRepository: Core.ApiKeys.IApiKeysRepository,
    ) { }

    async execute(args: RevokeApiKeyArgs): Promise<void> {
        const apiKey = await this.apiKeysRepository.findById(args.apiKeyId);

        if (!apiKey) {
            throw new ApiKeyNotFoundException(args.apiKeyId);
        }

        if (apiKey.userId !== args.userId) {
            throw new ApiKeyAccessDeniedException();
        }

        await this.apiKeysRepository.update(apiKey.revoke());
    }
}
