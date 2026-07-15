import { Inject, Injectable } from "@nestjs/common";
import { Core } from "@/core";
import { UserNotFoundException } from "../errors";

interface GetProfileArgs {
    userId: Core.Users.User['id'];
}

@Injectable()
export class GetProfileUseCase {
    constructor(
        @Inject(Core.Users.USERS_REPOSITORY) private readonly usersRepository: Core.Users.IUsersRepository,
    ) { }

    async execute(args: GetProfileArgs): Promise<Core.Users.User> {
        const user = await this.usersRepository.findById(args.userId);

        if (!user) {
            throw new UserNotFoundException(args.userId);
        }

        return user;
    }
}