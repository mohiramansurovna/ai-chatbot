import { Shared } from "@/shared";
import { Body, Controller, Post, Res, Req, BadRequestException, UnauthorizedException } from "@nestjs/common";
import type { Response, Request } from 'express';
import { LoginDto, RegisterBodyDto } from "./dtos";
import { Auth } from '@/application';


@Controller('api/auth')
export class AuthController {

    constructor(
        private readonly registerUseCase: Auth.RegisterUseCase,
        private readonly loginUseCase: Auth.LoginUseCase,
        private readonly refreshUseCase: Auth.RefreshUseCase
    ) { }

    @Shared.Decorators.Public()
    @Post('register')
    async register(@Body() body: RegisterBodyDto): Promise<string> {

        await this.registerUseCase.execute(body.name, body.email, body.password);
        return "user registered successfully"
    }

    @Shared.Decorators.Public()
    @Post('login')
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken, csrfRandom } = await this.loginUseCase.execute(body.email, body.password);

        res.cookie('refresh_token', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });

        res.cookie('csrf_token', csrfRandom, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'none',
            secure: true
        })

        return { accessToken };
    }

    @Shared.Decorators.Public()
    @Post('refresh')
    async refresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
        const oldRefreshToken = req.cookies?.refresh_token;
        const csrfToken = req.cookies?.csrf_token;
        const csrfTokenHeader = req.headers['x-csrf-token'];

        if (!oldRefreshToken) {
            throw new BadRequestException('Refresh token is not send')
        }
        if (!csrfToken || !csrfTokenHeader) {
            throw new BadRequestException('invalid refresh token')
        }

        if (csrfToken !== csrfTokenHeader) {
            throw new UnauthorizedException('invalid refresh token');
        }

        const { accessToken, refreshToken, csrfRandom } = await this.refreshUseCase.execute(oldRefreshToken);

        res.cookie('refresh_token', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })
        res.cookie('csrf_token', csrfRandom, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'none',
            secure: true
        })

        return { accessToken }
    }
}