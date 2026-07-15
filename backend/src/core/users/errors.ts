import { Shared } from "@/shared"

export class EmailAlreadyExistsException extends Shared.Errors.ConflictError {
    readonly code = 'EMAIL_ALREADY_EXISTS'
    constructor(email: string) {
        super(`Email already in use: ${email}`)
    }
}

