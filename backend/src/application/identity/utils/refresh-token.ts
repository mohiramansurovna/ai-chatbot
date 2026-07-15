import { Core } from "@/core";
import { Shared } from "@/shared";
import { TokenPayload } from "../types";
import { ExpiredTokenException, InvalidRefreshTokenException } from "../errors";

export class RefreshToken {
    static generate(userId: Core.Users.User['id'], authConfig: Core.Shared.IAuthConfig): Promise<string> {
        const payload = {
            subject: userId
        }
        return Shared.Lib.Jose.sign(payload, {
            secret: authConfig.refreshTokenSecret,
            expiresIn: authConfig.refreshTokenExpiresIn
        })
    }

    static verify(token: string, authConfig: Core.Shared.IAuthConfig): Promise<TokenPayload> {
        try {
            return Shared.Lib.Jose.verify<TokenPayload>(token, {
                secret: authConfig.refreshTokenSecret
            })
        } catch (err: unknown) {
            if (err instanceof Shared.Lib.TokenExpiredError) throw new ExpiredTokenException()
            if (err instanceof Shared.Lib.TokenInvalidError) throw new InvalidRefreshTokenException()
            throw err
        }

    }
}