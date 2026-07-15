import { Application } from "@/application"
import { Core } from "@/core"
import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common"
@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(@Inject(Core.Shared.AUTH_CONFIG) private readonly authConfig: Core.Shared.IAuthConfig) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request.headers.authorization?.split(' ')[1]
        if (!token) throw new UnauthorizedException('Missing access token')

        const payload = await Application.Identity.AccessToken.verify(token, this.authConfig)

        request.userId = payload.subject
        return true
    }
}