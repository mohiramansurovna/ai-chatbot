import { Application } from '@/application';
import {
    Body,
    Controller,
    Post,
    Res,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { LoginDto, RegisterBodyDto } from '../dtos';
import { Decorators } from '../../shared';
import { RefreshTokenCookie } from '../utils/refresh-token.util';
import { CSRFTokenCookie } from '../utils/csrf-token-cookie';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: Application.Identity.RegisterUseCase,
        private readonly loginUseCase: Application.Identity.LoginUseCase,
        private readonly refreshUseCase: Application.Identity.RefreshUseCase
    ) {}

    @Decorators.Public()
    @Post('register')
    async register(@Body() body: RegisterBodyDto): Promise<{ message: string }> {
        await this.registerUseCase.execute(body);
        return { message: 'user registered successfully' };
    }

    @Decorators.Public()
    @Post('login')
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.loginUseCase.execute(body);

        RefreshTokenCookie.set(res, refreshToken);
        CSRFTokenCookie.set(res);

        return { accessToken };
    }

    @Decorators.Public()
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const oldRefreshToken = RefreshTokenCookie.get(req);

        if (!oldRefreshToken) {
            throw new UnauthorizedException('refresh token not provided');
        }

        const isValid = CSRFTokenCookie.validate(req);

        if (!isValid) {
            throw new UnauthorizedException('invalid csrf-token');
        }

        const { accessToken, refreshToken } = await this.refreshUseCase.execute(oldRefreshToken);

        RefreshTokenCookie.set(res, refreshToken);
        CSRFTokenCookie.set(res);

        return { accessToken };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        RefreshTokenCookie.clear(res);
        CSRFTokenCookie.clear(res);

        return { message: 'successfully logged out' };
    }
}
