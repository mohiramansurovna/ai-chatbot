import { User } from "@/core/entities";
import { EnvConfig } from "@/shared/configs/env.config";
import { Jose } from "@/shared/libs/jose";
import { ConfigService } from "@nestjs/config";
import { JWTPayload } from "jose";

export class RefreshToken {
    static generate(userId: User['id'], configService: ConfigService<EnvConfig, true>): Promise<string> {
        const payload = {
            subject: userId
        }

        const secret = configService.get("JWT_REFRESH_SECRET")
        const expiresIn = configService.get("JWT_REFRESH_SESSION_EXPIRES_IN")

        return Jose.sign(payload, {
            secret,
            expiresIn
        })
    }

    static verify<T extends JWTPayload>(token: string, configService: ConfigService<EnvConfig, true>): Promise<T> {
        const secret = configService.get("JWT_REFRESH_SECRET")
        return Jose.verify<T>(token, {
            secret
        })
    }

}