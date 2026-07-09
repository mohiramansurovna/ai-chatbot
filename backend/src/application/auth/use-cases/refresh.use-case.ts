import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RefreshToken } from "../utils/refresh-token";
import { TokenPayload, Tokens } from "../types";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "@/shared/configs/env.config";
import { AccessToken } from "../utils/access-token";
import { randomUUID } from "crypto";


@Injectable()
export class RefreshUseCase{
    constructor(private readonly configService:ConfigService<EnvConfig, true>){}

    async execute(oldRefreshToken:string):Promise<Tokens>{

        
        const payload= await RefreshToken.verify<TokenPayload>(oldRefreshToken, this.configService);

        if(!payload){
            throw new UnauthorizedException('invalid refresh token')
        }

        const accessToken=await AccessToken.generate(payload.subject, this.configService);
        const refreshToken=await RefreshToken.generate(payload.subject, this.configService);
        const csrfRandom=randomUUID();

        return {accessToken, refreshToken, csrfRandom}

    }
}