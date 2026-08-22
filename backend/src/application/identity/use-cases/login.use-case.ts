import { Core } from "@/core";
import { Inject, Injectable } from "@nestjs/common";
import { Hasher } from "@/shared/utils";
import { AccessToken } from "../utils/access-token";
import { RefreshToken } from "../utils/refresh-token";
import { Tokens } from "../types";
import { InvalidCredentialsException } from "../errors";

interface LoginArgs{
    email:string;
    password:string;
}

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(Core.Users.USERS_REPOSITORY) private readonly usersRepository: Core.Users.IUsersRepository,
        @Inject(Core.Shared.AUTH_CONFIG) private readonly authConfig:Core.Shared.IAuthConfig,
    ) { }
    async execute(args:LoginArgs): Promise<Tokens> {
        const user = await this.usersRepository.findByEmail(args.email);
        console.log("should be user here", user)

        if (!user) {
            await Hasher.hash('password')
            throw new InvalidCredentialsException()
        }

        const isPasswordValid = await Hasher.verify(user.passwordHash, args.password);

        if (!isPasswordValid) {
            throw new InvalidCredentialsException()
        }

        const accessToken = await AccessToken.generate(user.id, this.authConfig);
        const refreshToken = await RefreshToken.generate(user.id, this.authConfig);
        return { accessToken, refreshToken }
    }
}