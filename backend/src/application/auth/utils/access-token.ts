import { User } from "@/core/entities";
import { EnvConfig } from "@/shared/configs/env.config";
import { Jose } from "@/shared/libs/jose";
import { ConfigService } from "@nestjs/config";
import { JWTPayload } from "jose";

export class AccessToken {
    static generate(userId: User['id'], configService: ConfigService<EnvConfig, true>): Promise<string> {
        const payload = {
            subject: userId
        }

        const secret = configService.get("JWT_ACCESS_SECRET", { infer: true })
        const expiresIn = configService.get("JWT_ACCESS_TOKEN_EXPIRES_IN", { infer: true })

        return Jose.sign(payload, {
            secret,
            expiresIn
        })
    }

    static verify<T extends JWTPayload>(token: string, configService: ConfigService<EnvConfig, true>): Promise<T> {
        const secret = configService.get("JWT_ACCESS_SECRET", { infer: true })

        return Jose.verify<T>(token, {
            secret
        })
    }

}