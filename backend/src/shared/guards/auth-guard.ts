import { EnvConfig } from "../configs/env.config";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "@/shared/decorators/public.decorator"
import { TokenPayload } from "@/application/auth/types";
import { User } from "@/core/entities";
import { UsersRepository } from "@/core/users/users.repository";
import { Jose } from "../libs/jose";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly configService: ConfigService<EnvConfig, true>,
        private readonly usersRepository: UsersRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<Request>();

        const authHeader = request.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing access token');
        }

        const token = authHeader.split(' ')[1];
        const secret = this.configService.get('JWT_ACCESS_SECRET', { infer: true });

        const payload = await Jose.verify<TokenPayload>(token, { secret })
            .catch(() => {
                throw new UnauthorizedException('Invalid or expired access token')
            })

        const user = await this.usersRepository.findById(payload.subject);

        if (!user) {
            throw new UnauthorizedException('User with this email is not exists')
        }

        request['user'] = user satisfies User

        return true;
    }
}