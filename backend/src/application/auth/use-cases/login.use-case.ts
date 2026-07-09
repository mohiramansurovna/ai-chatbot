import { Core } from "@/core";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Hasher } from "@/shared/utils";
import { AccessToken } from "../utils/access-token";
import { RefreshToken } from "../utils/refresh-token";
import { randomUUID } from "crypto";
import { Tokens } from "../types";
@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(Core.Users.USERS_REPOSITORY) private readonly usersRepository: Core.Users.IUsersRepository,
        @Inject(Core.Shared.AUTH_CONFIG) private readonly authConfig:Core.Shared.IAuthConfig,
    ) { }
    async execute(email: Core.Users.User['email'], password: string): Promise<Tokens> {
        const user = await this.usersRepository.findByEmail(email);

        await Hasher.hash('password')

        if (!user) {
            throw new BadRequestException('invalid credentials')
        }

        const isPasswordValid = await Hasher.verify(user.passwordHash, password);

        if (!isPasswordValid) {
            throw new BadRequestException('invalid credentials')
        }

        const accessToken = await AccessToken.generate(user.id, this.authConfig);
        const refreshToken = await RefreshToken.generate(user.id, this.authConfig);
        const csrfRandom = randomUUID();

        return { accessToken, refreshToken, csrfRandom }

    }
}