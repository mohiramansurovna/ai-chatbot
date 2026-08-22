interface UserProps {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
let temporaryId = -1;
export class User {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;

    private constructor(props: UserProps) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.passwordHash = props.passwordHash;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.deletedAt = props.deletedAt;
    }

    static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): User {
        return new User({
            id: temporaryId--,
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
        });
    }

    static fromModel(props: UserProps): User {
        return new User(props);
    }

    public update(props: Partial<Omit<UserProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>):Partial<UserProps>{
        return {
            id: this.id,
            ...props
        }
    };
}
