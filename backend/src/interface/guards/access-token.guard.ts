import { Application } from "@/application"
import { Core } from "@/core"
import { IS_PUBLIC_KEY } from "@/shared/decorators/public.decorator";
import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core";
@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        @Inject(Core.Shared.AUTH_CONFIG) private readonly authConfig: Core.Shared.IAuthConfig,
        private readonly reflector: Reflector,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest()
        const token = request.headers.authorization?.split(' ')[1]
        if (!token) throw new UnauthorizedException('Missing access token')

        const payload = await Application.Identity.AccessToken.verify(token, this.authConfig)

        request.user = {id:payload.subject}
        return true
    }
}