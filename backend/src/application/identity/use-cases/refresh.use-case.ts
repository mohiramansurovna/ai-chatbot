import { Inject, Injectable } from "@nestjs/common";
import { RefreshToken } from "../utils/refresh-token";
import { AccessToken } from "../utils/access-token";
import { TokenPayload, Tokens } from "../types";
import { Core } from "@/core";
import { InvalidRefreshTokenException } from "../errors";


@Injectable()
export class RefreshUseCase{
    constructor(
        @Inject(Core.Shared.AUTH_CONFIG) private readonly authConfig:Core.Shared.IAuthConfig,
        @Inject(Core.Users.USERS_REPOSITORY) private readonly usersRepository:Core.Users.IUsersRepository,
    ){}

    async execute(oldRefreshToken:string):Promise<Tokens>{
        const payload= await RefreshToken.verify(oldRefreshToken, this.authConfig);
        
        const user=await this.usersRepository.findById(payload.subject);
        if(!user){
            throw new InvalidRefreshTokenException()
        }

        const accessToken=await AccessToken.generate(payload.subject, this.authConfig);
        const refreshToken=await RefreshToken.generate(payload.subject, this.authConfig);

        return {accessToken, refreshToken}
    }
}