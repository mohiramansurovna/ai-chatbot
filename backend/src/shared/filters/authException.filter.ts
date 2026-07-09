import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import {
    AccountLockedError,
    AuthenticationRequiredError,
    AuthError,
    InvalidAccessTokenError,
    InvalidCredentialsError,
    InvalidRefreshTokenError,
} from '../errors';

import { sendError } from '../utils/send-error.util';

@Catch(AuthError)
export class AuthExceptionFilter implements ExceptionFilter {
    catch(exception: AuthError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        if (exception instanceof InvalidCredentialsError) {
            sendError(
                res,
                401,
                'Invalid credentials',
                'Unauthorized',
            );
            return;
        }

        if (exception instanceof AccountLockedError) {
            sendError(
                res,
                403,
                'Account is locked',
                'Forbidden',
            );
            return;
        }

        if (exception instanceof AuthenticationRequiredError) {
            sendError(
                res,
                401,
                'Authentication required',
                'Unauthorized',
            );
            return;
        }

        if (exception instanceof InvalidAccessTokenError) {
            sendError(
                res,
                401,
                'Invalid access token',
                'Unauthorized',
            );
            return;
        }

        if (
            exception instanceof InvalidRefreshTokenError
        ) {
            sendError(
                res,
                401,
                'Invalid refresh token',
                'Unauthorized',
            );
            return;
        }

        sendError(
            res,
            500,
            'Internal server error',
            'Server Error',
        );
    }
}