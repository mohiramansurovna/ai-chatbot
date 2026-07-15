import { Inject, Injectable } from "@nestjs/common";
import { Core } from "@/core";

interface GetActiveKeyArgs {
    userId: Core.Users.User['id'];
    provider: Core.ApiKeys.ApiKey['provider'];
}

@Injectable()
export class GetActiveKeyUseCase {
    constructor(
        @Inject(Core.ApiKeys.API_KEYS_REPOSITORY) private readonly apiKeysRepository: Core.ApiKeys.IApiKeysRepository,
    ) { }

    async execute(args: GetActiveKeyArgs): Promise<Core.ApiKeys.ApiKey | null> {
        return this.apiKeysRepository.findActiveKey(args.userId, args.provider);
    }
}
