import { Inject, Injectable } from "@nestjs/common";
import { Hasher } from "@/shared/utils";
import {Core} from "@/core"

@Injectable()
export class RegisterUseCase {
    constructor(@Inject(Core.Users.USERS_REPOSITORY) private readonly usersRepository: Core.Users.IUsersRepository) { }
    async execute(name: Core.Users.User['name'], email: Core.Users.User['email'], password: string): Promise<void> {
        const passwordHash = await Hasher.hash(password)

        await this.usersRepository.create({ name, email, passwordHash });

    }
}