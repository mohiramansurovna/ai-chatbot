import { Inject, Injectable } from "@nestjs/common";
import { Hasher } from "@/shared/utils";
import { Core } from "@/core"

interface RegisterArgs {
    name: string;
    email: string;
    password: string;
}

@Injectable()
export class RegisterUseCase {
    constructor(@Inject(Core.Users.USERS_REPOSITORY) private readonly usersRepository: Core.Users.IUsersRepository) { }
    async execute(args: RegisterArgs): Promise<void> {
        const passwordHash = await Hasher.hash(args.password)
        await this.usersRepository.create({
            name: args.name,
            email: args.email,
            passwordHash
        });
    }
}