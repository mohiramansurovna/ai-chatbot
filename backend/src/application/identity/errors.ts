import { Shared } from "@/shared"

export class InvalidCredentialsException extends Shared.Errors.UnauthorizedError {
    readonly code = 'INVALID_CREDENTIALS'
    constructor() {
        super(`Invalid credentials`)
    }
}

export class InvalidAccessTokenException extends Shared.Errors.UnauthorizedError {
    readonly code = 'INVALID_ACCESS_TOKEN'
    constructor() {
        super(`Invalid access token`)
    }
}

export class InvalidRefreshTokenException extends Shared.Errors.UnauthorizedError {
    readonly code = 'INVALID_REFRESH_TOKEN'
    constructor() {
        super(`Invalid refresh token`)
    }
}

export class ExpiredTokenException extends Shared.Errors.UnauthorizedError {
    readonly code = 'EXPIRED_TOKEN'
    constructor() {
        super(`Expired token`)
    }
}

export class UserNotFoundException extends Shared.Errors.NotFoundError {
    readonly code = 'USER_NOT_FOUND'
    constructor(userId: number) {
        super(`User with id ${userId} was not found`)
    }
}

export class ApiKeyNotFoundException extends Shared.Errors.NotFoundError {
    readonly code = 'API_KEY_NOT_FOUND'
    constructor(apiKeyId: number) {
        super(`Api key with id ${apiKeyId} was not found`)
    }
}

export class ApiKeyAccessDeniedException extends Shared.Errors.ForbiddenError {
    readonly code = 'API_KEY_ACCESS_DENIED'
    constructor() {
        super(`You do not have access to this api key`)
    }
}

