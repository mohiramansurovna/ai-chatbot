import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { RefreshToken } from "../utils/refresh-token";
import { TokenPayload, Tokens } from "../types";
import { AccessToken } from "../utils/access-token";
import { randomUUID } from "crypto";
import { Core } from "@/core";


@Injectable()
export class RefreshUseCase{
    constructor(@Inject(Core.Shared.AUTH_CONFIG) private readonly authConfig:Core.Shared.IAuthConfig){}

    async execute(oldRefreshToken:string):Promise<Tokens>{

        
        const payload= await RefreshToken.verify<TokenPayload>(oldRefreshToken, this.authConfig);

        if(!payload){
            throw new UnauthorizedException('invalid refresh token')
        }

        const accessToken=await AccessToken.generate(payload.subject, this.authConfig);
        const refreshToken=await RefreshToken.generate(payload.subject, this.authConfig);
        const csrfRandom=randomUUID();

        return {accessToken, refreshToken, csrfRandom}

    }
}