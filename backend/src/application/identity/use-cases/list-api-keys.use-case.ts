import { Inject, Injectable } from "@nestjs/common";
import { Core } from "@/core";

interface ListApiKeysArgs {
    userId: Core.Users.User['id'];
}

@Injectable()
export class ListApiKeysUseCase {
    constructor(
        @Inject(Core.ApiKeys.API_KEYS_REPOSITORY) private readonly apiKeysRepository: Core.ApiKeys.IApiKeysRepository,
    ) { }

    async execute(args: ListApiKeysArgs): Promise<Core.ApiKeys.ApiKey[]> {
        return this.apiKeysRepository.listUserKeys(args.userId);
    }
}
