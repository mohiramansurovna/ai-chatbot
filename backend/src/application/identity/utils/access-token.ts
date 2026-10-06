import { Core } from "@/core";
import { TokenPayload } from "../types";
import { ExpiredTokenException, InvalidAccessTokenException } from "../errors";
import { Shared } from "@/shared";

export class AccessToken {
    static async generate(userId: Core.Users.User['id'], authConfig: Core.Shared.IAuthConfig): Promise<string> {
        const payload = {
            subject: userId
        }

        return await Shared.Lib.Jose.sign(payload, {
            secret: authConfig.accessTokenSecret,
            expiresIn: authConfig.accessTokenExpiresIn
        })
    }

    static async verify(token: string, authConfig: Core.Shared.IAuthConfig): Promise<TokenPayload> {
        try{
            return await Shared.Lib.Jose.verify<TokenPayload>(token, {
                secret: authConfig.accessTokenSecret
            })
        }catch(err:unknown){
            if (err instanceof Shared.Lib.TokenExpiredError) throw new ExpiredTokenException()
            if (err instanceof Shared.Lib.TokenInvalidError) throw new InvalidAccessTokenException();
            throw err
        }
    }

}