import { Shared } from "@/shared"

export class SessionAccessDeniedException extends Shared.Errors.ForbiddenError {
    readonly code = 'SESSION_ACCESS_DENIED'
    constructor() {
        super(`You do not have access to this session`)
    }
}
