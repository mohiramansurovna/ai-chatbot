import { Core } from "@/core";
import { Jose } from "@/shared/libs/jose";
import { JWTPayload } from "jose";

export class RefreshToken {
    static generate(userId: Core.Users.User['id'], authConfig: Core.Shared.IAuthConfig): Promise<string> {
        const payload = {
            subject: userId
        }
        return Jose.sign(payload, {
            secret: authConfig.refreshTokenSecret,
            expiresIn: authConfig.refreshTokenExpiresIn
        })
    }

    static verify<T extends JWTPayload>(token: string, authConfig: Core.Shared.IAuthConfig): Promise<T> {

        return Jose.verify<T>(token, {
            secret: authConfig.refreshTokenSecret
        })
    }

}