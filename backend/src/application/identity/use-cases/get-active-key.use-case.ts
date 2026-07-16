import { Inject, Injectable } from "@nestjs/common";
import { Core } from "@/core";


@Injectable()
export class GetActiveKeyUseCase {
    constructor(
        @Inject(Core.ApiKeys.API_KEYS_REPOSITORY) private readonly apiKeysRepository: Core.ApiKeys.IApiKeysRepository,
    ) { }

    async execute(userId:number, providerName:Core.Llm.LlmProviderName): Promise<Core.ApiKeys.ApiKey | null> {
        return this.apiKeysRepository.findActiveKey(userId, providerName);
    }
}
