import { Shared } from "@/shared"

export class UserMemoryNotFoundException extends Shared.Errors.NotFoundError {
    readonly code = 'USER_MEMORY_NOT_FOUND'
    constructor() {
        super(`User memory not found`)
    }
}
