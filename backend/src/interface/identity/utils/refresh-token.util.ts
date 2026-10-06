import { Request, Response } from 'express';

let REFRESH_TOKEN = 'refresh_token';
export class RefreshTokenCookie {
    static set(res: Response, refreshToken: string): void {
        res.cookie(REFRESH_TOKEN, refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
    }

    static clear(res: Response): void {
        res.clearCookie(REFRESH_TOKEN, { httpOnly: true, sameSite: 'none', secure: true });
    }

    static get(req:Request): string | null {
        return req.cookies[REFRESH_TOKEN] ?? null;
    }
}
