import { User } from "@/core/entities";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Hasher } from "@/shared/utils";
import { AccessToken } from "../utils/access-token";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "@/shared/configs/env.config";
import { RefreshToken } from "../utils/refresh-token";
import { randomUUID } from "crypto";
import { Tokens } from "../types";
import { UsersRepository } from "@/core/users/users.repository";

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly configService: ConfigService<EnvConfig, true>
    ) { }
    async execute(email: User['email'], password: string): Promise<Tokens> {
        const user = await this.usersRepository.findByEmail(email);

        await Hasher.hash('password')

        if (!user) {
            throw new BadRequestException('invalid credentials')
        }

        const isPasswordValid = await Hasher.verify(user.passwordHash, password);

        if (!isPasswordValid) {
            throw new BadRequestException('invalid credentials')
        }

        const accessToken = await AccessToken.generate(user.id, this.configService);
        const refreshToken= await RefreshToken.generate(user.id, this.configService);
        const csrfRandom=randomUUID();
        
        return {accessToken, refreshToken, csrfRandom}

    }
}