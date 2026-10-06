import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

let CSRF_TOKEN = 'x-csrf-token';
export class CSRFTokenCookie {
    static set(res: Response): void {
        let csrfRandom=randomUUID()
        res.cookie(CSRF_TOKEN, csrfRandom, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'none',
            secure: true,
        });
    }

    static clear(res: Response): void {
        res.clearCookie(CSRF_TOKEN, {sameSite: 'none', secure: true });
    }

    static validate(req: Request): boolean {
        return (
            req.cookies[CSRF_TOKEN] &&
            req.header[CSRF_TOKEN] &&
            req.cookies[CSRF_TOKEN] === req.header[CSRF_TOKEN]
        );
    }
}
