import { Shared } from "@/shared"

export class UserMemoryAccessDeniedException extends Shared.Errors.ForbiddenError {
    readonly code = 'USER_MEMORY_ACCESS_DENIED'
    constructor() {
        super(`You do not have access to this memory`)
    }
}