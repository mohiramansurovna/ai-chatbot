import { LlmProviderName } from "../llm/llm.types"

export class ApiKey {
    id: number
    userId: number
    provider: LlmProviderName
    encryptedKey: string
    status: 'active' | 'revoked'
    createdAt: Date

    constructor(props: ApiKey) {
        Object.assign(this, props)
    }
}