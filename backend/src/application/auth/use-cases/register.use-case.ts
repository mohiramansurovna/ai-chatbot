import { User } from "@/core/entities";
import { Injectable } from "@nestjs/common";
import { Hasher } from "@/shared/utils";
import { UsersRepository } from "@/core/users/users.repository";

@Injectable()
export class RegisterUseCase {
    constructor(private readonly usersRepository: UsersRepository) { }
    async execute(name: User['name'], email: User['email'], password: string): Promise<void> {
        const passwordHash = await Hasher.hash(password)

        await this.usersRepository.create({ name, email, passwordHash });

    }
}