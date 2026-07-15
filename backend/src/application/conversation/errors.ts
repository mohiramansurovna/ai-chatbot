import { Shared } from "@/shared"

export class SessionNotFoundException extends Shared.Errors.NotFoundError {
    readonly code = 'SESSION_NOT_FOUND'
    constructor() {
        super(`Session not found`)
    }
}
