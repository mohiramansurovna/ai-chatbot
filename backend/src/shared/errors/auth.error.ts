import { DomainError } from "./base.error";

export class AuthError extends DomainError {
    constructor(message: string) {
        super(message)
    }
}


export class InvalidCredentialsError extends AuthError {
    constructor(email: string) {
        super(`Invalid credentials for email "${email}"`);
    }
}

export class AccountLockedError extends AuthError {
    constructor(userId: string, lockedUntil: Date) {
        super(
            `Account locked for user "${userId}" until "${lockedUntil.toISOString()}"`,
        );
    }
}

export class AuthenticationRequiredError extends AuthError {
    constructor() {
        super('Authentication required but no authentication token was provided');
    }
}

export class InvalidAccessTokenError extends AuthError {
    constructor(reason?: string) {
        super(
            reason
                ? `Invalid access token: ${reason}`
                : 'Invalid access token',
        );
    }
}

export class InvalidRefreshTokenError extends AuthError {
    constructor(reason?: string) {
        super(
            reason
                ? `Invalid refresh token: ${reason}`
                : 'Invalid refresh token',
        );
    }
}
