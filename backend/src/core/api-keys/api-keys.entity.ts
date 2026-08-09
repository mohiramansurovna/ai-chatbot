import { LlmProviderName } from '../llm/llm.types';

interface ApiKeyProps {
    readonly id: number;
    readonly userId: number;
    readonly provider: LlmProviderName;
    readonly encryptedKey: string;
    readonly status: 'active' | 'revoked';
    readonly createdAt: Date;
}
let temporaryId = -1;

export class ApiKey {
    id: number;
    userId: number;
    provider: LlmProviderName;
    encryptedKey: string;
    status: 'active' | 'revoked';
    createdAt: Date;
    private constructor(props: ApiKeyProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.provider = props.provider;
        this.encryptedKey = props.encryptedKey;
        this.status = props.status;
        this.createdAt = props.createdAt;
    }
    static create(props: Omit<ApiKeyProps, 'id' | 'status' | 'createdAt'>): ApiKey {
        return new ApiKey({ id: temporaryId--, ...props, status: 'active', createdAt: new Date() });
    }
    static fromModel(props: ApiKeyProps): ApiKey {
        return new ApiKey(props);
    }
    public revoke(): Pick<ApiKey, 'id' | 'status'> {
        return { id: this.id, status: 'revoked' };
    }
}
