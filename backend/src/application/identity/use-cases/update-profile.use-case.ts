import { Inject, Injectable } from '@nestjs/common';
import { Core } from '@/core';
import { UserNotFoundException } from '../errors';
import { Hasher } from '@/shared/utils';

interface UpdateProfileArgs {
    userId: Core.Users.User['id'];
    name?: string;
    email?: string;
    password?: string;
}

@Injectable()
export class UpdateProfileUseCase {
    constructor(
        @Inject(Core.Users.USERS_REPOSITORY)
        private readonly usersRepository: Core.Users.IUsersRepository
    ) {}

    async execute(args: UpdateProfileArgs): Promise<void> {
        const { userId, name, email, password } = args;
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new UserNotFoundException(userId);
        }

        await this.usersRepository.update(user.update({
            name,
            email,
            passwordHash:password?await Hasher.hash(password):undefined
        }));
    }
}
