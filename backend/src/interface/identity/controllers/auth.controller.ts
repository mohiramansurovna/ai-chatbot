import { Application } from '@/application';
import {
    Body,
    Controller,
    Post,
    Res,
    Req,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { LoginDto, RegisterBodyDto } from '../dtos';
import { randomUUID } from 'crypto';
import { Decorators } from '../../shared';

@Controller('/auth')
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

        const csrfRandom = randomUUID();

        res.cookie('refresh_token', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        res.cookie('csrf_token', csrfRandom, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'none',
            secure: true,
        });

        return { accessToken };
    }

    @Decorators.Public()
    @Post('refresh')
    async refresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
        const oldRefreshToken = req.cookies?.refresh_token;
        const csrfToken = req.cookies?.csrf_token;
        const csrfTokenHeader = req.headers['x-csrf-token'];

        if (!oldRefreshToken) {
            throw new BadRequestException('Refresh token is not send');
        }
        if (!csrfToken || !csrfTokenHeader) {
            throw new BadRequestException('invalid refresh token');
        }

        if (csrfToken !== csrfTokenHeader) {
            throw new UnauthorizedException('invalid refresh token');
        }

        const { accessToken, refreshToken } = await this.refreshUseCase.execute(oldRefreshToken);

        const csrfRandom = randomUUID();

        res.cookie('refresh_token', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        res.cookie('csrf_token', csrfRandom, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'none',
            secure: true,
        });

        return { accessToken };
    }
}
