import { Core } from "@/core";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): Core.Users.User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
})