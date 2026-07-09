import { DomainError } from ".";


export class UsersError extends DomainError {
    constructor(message: string) {
        super(message)
    }
}


export class UserNotFoundError extends UsersError {
    constructor(data:string|number) {
        super(`User with the data: ${data} not found`);
    }
}

export class UserEmailConflictError extends UsersError {
    constructor(email: string) {
        super(`User with email ${email} already exists`)
    }
}