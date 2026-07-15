// shared/errors.ts
export abstract class DomainError extends Error {
    abstract readonly code: string

    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = this.constructor.name
    }
}

export abstract class NotFoundError extends DomainError { }
export abstract class ConflictError extends DomainError { }
export abstract class ValidationError extends DomainError { }
export abstract class UnauthorizedError extends DomainError { }
export abstract class ForbiddenError extends DomainError { }