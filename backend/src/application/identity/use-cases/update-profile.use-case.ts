import { Inject, Injectable } from "@nestjs/common";
import { Hasher } from "@/shared/utils";
import { Core } from "@/core";
import { UserNotFoundException } from "../errors";

interface UpdateProfileArgs {
    userId: Core.Users.User['id'];
    name?: string;
    email?: string;
    password?: string;
}

@Injectable()
export class UpdateProfileUseCase {
    constructor(
        @Inject(Core.Users.USERS_REPOSITORY) private readonly usersRepository: Core.Users.IUsersRepository,
    ) { }

    async execute(args: UpdateProfileArgs): Promise<Core.Users.User> {
        const user = await this.usersRepository.findById(args.userId);

        if (!user) {
            throw new UserNotFoundException(args.userId);
        }

        const updateArgs: Core.Users.UserUpdate = {};

        if (args.name !== undefined) {
            updateArgs.name = args.name;
        }

        if (args.email !== undefined) {
            updateArgs.email = args.email;
        }

        if (args.password !== undefined) {
            updateArgs.passwordHash = await Hasher.hash(args.password);
        }

        return this.usersRepository.update(args.userId, updateArgs);
    }
}
