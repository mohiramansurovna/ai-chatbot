import { Inject, Injectable } from "@nestjs/common";
import { Core } from "@/core";
import { UserNotFoundException } from "../errors";

interface DeleteAccountArgs {
    userId: Core.Users.User['id'];
}

@Injectable()
export class DeleteAccountUseCase {
    constructor(
        @Inject(Core.Users.USERS_REPOSITORY) private readonly usersRepository: Core.Users.IUsersRepository,
    ) { }

    async execute(args: DeleteAccountArgs): Promise<void> {
        const user = await this.usersRepository.findById(args.userId);

        if (!user) {
            throw new UserNotFoundException(args.userId);
        }

        await this.usersRepository.delete(args.userId);
        //will delete memories too, later
    }
}
